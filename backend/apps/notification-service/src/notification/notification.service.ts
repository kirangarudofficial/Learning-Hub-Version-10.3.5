import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '@shared/database/prisma.service';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';

export enum NotificationType {
  EMAIL = 'email',
  SMS = 'sms',
  PUSH = 'push',
  IN_APP = 'in-app',
}

export enum NotificationStatus {
  PENDING = 'pending',
  SENT = 'sent',
  DELIVERED = 'delivered',
  FAILED = 'failed',
  READ = 'read',
}

interface EmailTemplate {
  subject: string;
  html: string;
  text?: string;
}

interface NotificationTemplate {
  id: string;
  name: string;
  type: NotificationType;
  subject?: string;
  content: string;
  variables: string[];
}

@Injectable()
export class NotificationService {
  private emailTransporter: Transporter;
  private templates: Map<string, NotificationTemplate> = new Map();

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService
  ) {
    this.initializeEmailTransporter();
    this.loadTemplates();
  }

  private async initializeEmailTransporter() {
    const smtpConfig = {
      host: this.configService.get('SMTP_HOST'),
      port: this.configService.get('SMTP_PORT'),
      secure: this.configService.get('SMTP_SECURE') === 'true',
      auth: {
        user: this.configService.get('SMTP_USER'),
        pass: this.configService.get('SMTP_PASS'),
      },
    };

    this.emailTransporter = nodemailer.createTransporter(smtpConfig);
    
    try {
      await this.emailTransporter.verify();
      console.log('Email transporter is ready');
    } catch (error) {
      console.error('Email transporter verification failed:', error);
    }
  }

  private loadTemplates() {
    // Load predefined templates
    const templates: NotificationTemplate[] = [
      {
        id: 'welcome',
        name: 'Welcome Email',
        type: NotificationType.EMAIL,
        subject: 'Welcome to {{platformName}}!',
        content: `
          <h1>Welcome {{userName}}!</h1>
          <p>Thank you for joining our learning platform. We're excited to have you on board!</p>
          <p>Start exploring our courses and begin your learning journey today.</p>
          <a href="{{loginUrl}}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Get Started</a>
        `,
        variables: ['userName', 'platformName', 'loginUrl'],
      },
      {
        id: 'course-enrolled',
        name: 'Course Enrollment Confirmation',
        type: NotificationType.EMAIL,
        subject: 'Successfully enrolled in {{courseTitle}}',
        content: `
          <h1>Enrollment Confirmed!</h1>
          <p>Hi {{userName}},</p>
          <p>You have successfully enrolled in the course: <strong>{{courseTitle}}</strong></p>
          <p>Course details:</p>
          <ul>
            <li>Instructor: {{instructorName}}</li>
            <li>Level: {{courseLevel}}</li>
            <li>Duration: {{courseDuration}}</li>
          </ul>
          <a href="{{courseUrl}}" style="background-color: #28a745; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Start Learning</a>
        `,
        variables: ['userName', 'courseTitle', 'instructorName', 'courseLevel', 'courseDuration', 'courseUrl'],
      },
      {
        id: 'payment-success',
        name: 'Payment Confirmation',
        type: NotificationType.EMAIL,
        subject: 'Payment confirmation for {{courseTitle}}',
        content: `
          <h1>Payment Successful!</h1>
          <p>Hi {{userName}},</p>
          <p>Your payment of ${{amount}} for the course "{{courseTitle}}" has been processed successfully.</p>
          <p>Transaction ID: {{transactionId}}</p>
          <p>You can now access the full course content.</p>
          <a href="{{courseUrl}}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Access Course</a>
        `,
        variables: ['userName', 'courseTitle', 'amount', 'transactionId', 'courseUrl'],
      },
      {
        id: 'course-completion',
        name: 'Course Completion Certificate',
        type: NotificationType.EMAIL,
        subject: 'Congratulations! You completed {{courseTitle}}',
        content: `
          <h1>🎉 Congratulations!</h1>
          <p>Hi {{userName}},</p>
          <p>You have successfully completed the course: <strong>{{courseTitle}}</strong></p>
          <p>Your certificate is ready for download.</p>
          <a href="{{certificateUrl}}" style="background-color: #ffc107; color: black; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Download Certificate</a>
          <p>Keep learning and exploring new courses!</p>
        `,
        variables: ['userName', 'courseTitle', 'certificateUrl'],
      },
    ];

    templates.forEach(template => {
      this.templates.set(template.id, template);
    });
  }

  async sendNotification(data: {
    type: NotificationType;
    recipient: string;
    templateId?: string;
    variables?: Record<string, string>;
    subject?: string;
    content?: string;
    userId?: string;
  }) {
    try {
      let processedContent = data.content || '';
      let processedSubject = data.subject || '';

      // Use template if provided
      if (data.templateId) {
        const template = this.templates.get(data.templateId);
        if (!template) {
          throw new Error(`Template ${data.templateId} not found`);
        }
        
        processedContent = this.processTemplate(template.content, data.variables || {});
        processedSubject = this.processTemplate(template.subject || '', data.variables || {});
      }

      // Send based on notification type
      switch (data.type) {
        case NotificationType.EMAIL:
          return await this.sendEmail(data.recipient, processedSubject, processedContent);
        case NotificationType.SMS:
          return await this.sendSMS(data.recipient, processedContent);
        case NotificationType.IN_APP:
          return await this.createInAppNotification(data.userId || '', processedSubject, processedContent);
        default:
          throw new Error(`Unsupported notification type: ${data.type}`);
      }
    } catch (error) {
      console.error('Failed to send notification:', error);
      throw new InternalServerErrorException('Failed to send notification');
    }
  }

  private processTemplate(template: string, variables: Record<string, string>): string {
    let processed = template;
    for (const [key, value] of Object.entries(variables)) {
      const regex = new RegExp(`{{${key}}}`, 'g');
      processed = processed.replace(regex, value);
    }
    return processed;
  }

  private async sendEmail(to: string, subject: string, html: string): Promise<{ success: boolean; messageId?: string }> {
    try {
      const result = await this.emailTransporter.sendMail({
        from: this.configService.get('SMTP_FROM') || this.configService.get('SMTP_USER'),
        to,
        subject,
        html,
        text: html.replace(/<[^>]*>/g, ''), // Strip HTML for text version
      });

      return {
        success: true,
        messageId: result.messageId,
      };
    } catch (error) {
      console.error('Email sending failed:', error);
      return { success: false };
    }
  }

  private async sendSMS(to: string, message: string): Promise<{ success: boolean; messageId?: string }> {
    // SMS implementation would go here (Twilio, AWS SNS, etc.)
    // For now, just log and return success
    console.log(`SMS to ${to}: ${message}`);
    return { success: true, messageId: `sms-${Date.now()}` };
  }

  private async createInAppNotification(userId: string, subject: string, content: string) {
    // Create in-app notification in database
    const notification = await this.prisma.notification.create({
      data: {
        type: NotificationType.IN_APP,
        recipient: userId,
        subject,
        content,
        status: NotificationStatus.SENT,
      },
    });

    return { success: true, notificationId: notification.id };
  }

  async findAll() {
    return this.prisma.notification.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByUser(userId: string) {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const notification = await this.prisma.notification.findUnique({
      where: { id },
    });

    if (!notification) {
      throw new NotFoundException(`Notification with ID ${id} not found`);
    }

    return notification;
  }

  async update(id: string, updateNotificationDto: UpdateNotificationDto) {
    await this.findOne(id); // Check if exists

    return this.prisma.notification.update({
      where: { id },
      data: updateNotificationDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id); // Check if exists

    return this.prisma.notification.delete({
      where: { id },
    });
  }

  async markAsRead(id: string) {
    await this.findOne(id); // Check if exists

    return this.prisma.notification.update({
      where: { id },
      data: { status: NotificationStatus.READ },
    });
  }

  async markAllAsRead(userId: string) {
    return this.prisma.notification.updateMany({
      where: { 
        userId,
        status: { not: NotificationStatus.READ },
      },
      data: { status: NotificationStatus.READ },
    });
  }

  async sendBulk(sendBulkNotificationsDto: SendBulkNotificationsDto) {
    const { userIds, ...notificationData } = sendBulkNotificationsDto;
    
    const notifications = userIds.map(userId => ({
      userId,
      type: notificationData.type,
      subject: notificationData.subject,
      content: notificationData.content,
      data: notificationData.data,
      templateId: notificationData.templateId,
      status: NotificationStatus.PENDING,
    }));

    return this.prisma.notification.createMany({
      data: notifications,
    });
  }
}
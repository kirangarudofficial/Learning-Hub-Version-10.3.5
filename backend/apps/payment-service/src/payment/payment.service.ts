import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@shared/database/prisma.service';
import { StripeService } from './stripe.service';

@Injectable()
export class PaymentService {
  constructor(
    private prisma: PrismaService,
    private stripeService: StripeService,
  ) {}

  async createPaymentIntent(userId: string, courseIds: string[], amount: number) {
    try {
      // Verify courses exist and calculate total
      const courses = await this.prisma.course.findMany({
        where: {
          id: {
            in: courseIds,
          },
        },
        include: {
          instructor: true,
        },
      });

      if (courses.length !== courseIds.length) {
        throw new BadRequestException('Some courses not found');
      }

      // Check if user is already enrolled in any of these courses
      const existingEnrollments = await this.prisma.enrollment.findMany({
        where: {
          userId,
          courseId: {
            in: courseIds,
          },
        },
      });

      if (existingEnrollments.length > 0) {
        throw new BadRequestException('Already enrolled in some of these courses');
      }

      const calculatedAmount = courses.reduce((total, course) => total + course.price, 0);

      if (Math.abs(calculatedAmount - amount) > 0.01) {
        throw new BadRequestException('Amount mismatch');
      }

      // Create Stripe Payment Intent
      const paymentIntent = await this.stripeService.createPaymentIntent(
        amount, 
        'usd', 
        {
          userId,
          courseIds: courseIds.join(','),
          type: 'course_purchase',
        }
      );

      // Store payment record
      const payment = await this.prisma.$executeRaw`
        INSERT INTO payments (id, user_id, amount, currency, status, stripe_payment_intent_id, metadata, created_at, updated_at)
        VALUES (${paymentIntent.id}, ${userId}, ${amount}, 'USD', 'pending', ${paymentIntent.id}, ${JSON.stringify({ courseIds })}, NOW(), NOW())
        ON CONFLICT (id) DO UPDATE SET updated_at = NOW()
      `;

      return {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        amount,
        courses,
      };
    } catch (error) {
      throw error;
    }
  }

  async confirmPayment(userId: string, paymentIntentId: string, courseIds: string[]) {
    try {
      // Retrieve payment intent from Stripe
      const paymentIntent = await this.stripeService.retrievePaymentIntent(paymentIntentId);

      if (paymentIntent.status !== 'succeeded') {
        throw new BadRequestException('Payment not successful');
      }

      // Verify the payment belongs to the user
      if (paymentIntent.metadata.userId !== userId) {
        throw new BadRequestException('Payment does not belong to user');
      }

      // Create enrollments
      const enrollments = await Promise.all(
        courseIds.map(courseId =>
          this.prisma.enrollment.create({
            data: {
              userId,
              courseId,
            },
            include: {
              course: {
                include: {
                  instructor: true,
                },
              },
            },
          })
        )
      );

      // Create initial progress records
      await Promise.all(
        courseIds.map(courseId =>
          this.prisma.userProgress.create({
            data: {
              userId,
              courseId,
              progressPercentage: 0,
            },
          })
        )
      );

      // Update payment status
      await this.prisma.$executeRaw`
        UPDATE payments 
        SET status = 'completed', updated_at = NOW() 
        WHERE stripe_payment_intent_id = ${paymentIntentId}
      `;

      return {
        success: true,
        enrollments,
        message: 'Payment confirmed and enrollments created',
      };
    } catch (error) {
      throw error;
    }
  }

  async handleStripeWebhook(signature: string, rawBody: Buffer) {
    try {
      const event = await this.stripeService.constructWebhookEvent(rawBody, signature);

      switch (event.type) {
        case 'payment_intent.succeeded':
          await this.handlePaymentSuccess(event.data.object);
          break;
        case 'payment_intent.payment_failed':
          await this.handlePaymentFailure(event.data.object);
          break;
        default:
          console.log(`Unhandled event type: ${event.type}`);
      }

      return { received: true };
    } catch (error) {
      throw error;
    }
  }

  private async handlePaymentSuccess(paymentIntent: any) {
    // Update payment status and trigger enrollment if not already done
    const { userId, courseIds } = paymentIntent.metadata;
    
    if (courseIds) {
      const courseIdArray = courseIds.split(',');
      
      // Check if enrollments already exist
      const existingEnrollments = await this.prisma.enrollment.findMany({
        where: {
          userId,
          courseId: {
            in: courseIdArray,
          },
        },
      });

      if (existingEnrollments.length === 0) {
        // Create enrollments and progress records
        await this.confirmPayment(userId, paymentIntent.id, courseIdArray);
      }
    }
  }

  private async handlePaymentFailure(paymentIntent: any) {
    // Update payment status
    await this.prisma.$executeRaw`
      UPDATE payments 
      SET status = 'failed', updated_at = NOW() 
      WHERE stripe_payment_intent_id = ${paymentIntent.id}
    `;
  }

  async refundPayment(paymentIntentId: string, reason?: string) {
    try {
      const refund = await this.stripeService.createRefund(paymentIntentId, undefined, reason);

      // Update payment status
      await this.prisma.$executeRaw`
        UPDATE payments 
        SET status = 'refunded', updated_at = NOW() 
        WHERE stripe_payment_intent_id = ${paymentIntentId}
      `;

      return {
        success: true,
        refund,
        message: 'Refund processed successfully',
      };
    } catch (error) {
      throw error;
    }
  }

  async getPaymentHistory(userId: string, pagination: any) {
    const { page = 1, limit = 10 } = pagination;
    const skip = (page - 1) * limit;

    const payments = await this.prisma.$queryRaw`
      SELECT * FROM payments 
      WHERE user_id = ${userId} 
      ORDER BY created_at DESC 
      LIMIT ${limit} OFFSET ${skip}
    `;

    const total = await this.prisma.$queryRaw`
      SELECT COUNT(*) as count FROM payments WHERE user_id = ${userId}
    `;

    return {
      payments,
      total: Number((total as any)[0]?.count || 0),
      page,
      limit,
      totalPages: Math.ceil(Number((total as any)[0]?.count || 0) / limit),
    };
  }

  async getInstructorEarnings(instructorId: string) {
    const instructor = await this.prisma.instructor.findUnique({
      where: { userId: instructorId },
      include: {
        courses: {
          include: {
            enrollments: {
              include: {
                course: true,
              },
            },
          },
        },
      },
    });

    if (!instructor) {
      throw new NotFoundException('Instructor not found');
    }

    let totalEarnings = 0;
    let thisMonthEarnings = 0;
    let lastMonthEarnings = 0;
    const currentDate = new Date();
    const thisMonth = currentDate.getMonth();
    const thisYear = currentDate.getFullYear();
    const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1;
    const lastMonthYear = thisMonth === 0 ? thisYear - 1 : thisYear;

    instructor.courses.forEach(course => {
      course.enrollments.forEach(enrollment => {
        const enrollmentDate = new Date(enrollment.enrolledAt);
        const earnings = course.price * 0.7; // Assuming 70% goes to instructor

        totalEarnings += earnings;

        if (
          enrollmentDate.getMonth() === thisMonth &&
          enrollmentDate.getFullYear() === thisYear
        ) {
          thisMonthEarnings += earnings;
        }

        if (
          enrollmentDate.getMonth() === lastMonth &&
          enrollmentDate.getFullYear() === lastMonthYear
        ) {
          lastMonthEarnings += earnings;
        }
      });
    });

    return {
      totalEarnings,
      thisMonthEarnings,
      lastMonthEarnings,
      pendingPayouts: thisMonthEarnings, // Simplified - would need more complex logic
      coursesCount: instructor.courses.length,
      studentsCount: instructor.courses.reduce((total, course) => total + course.enrollments.length, 0),
    };
  }

  async processInstructorPayout(instructorId: string, amount: number) {
    try {
      const instructor = await this.prisma.instructor.findUnique({
        where: { userId: instructorId },
        include: {
          user: true,
        },
      });

      if (!instructor) {
        throw new NotFoundException('Instructor not found');
      }

      // In a real implementation, you'd have stored Stripe Connected Account IDs
      // For now, we'll just record the payout intent
      const payout = {
        instructorId,
        amount,
        status: 'pending',
        createdAt: new Date(),
      };

      // Store payout record in database (you'd need to create a payouts table)
      // await this.prisma.payout.create({ data: payout });

      return {
        success: true,
        payout,
        message: 'Payout initiated successfully',
      };
    } catch (error) {
      throw error;
    }
  }
}
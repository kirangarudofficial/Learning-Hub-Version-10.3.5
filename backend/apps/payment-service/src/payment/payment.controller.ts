import { Controller } from '@nestjs/common';
import { MessagePattern, EventPattern, Payload } from '@nestjs/microservices';
import { PaymentService } from './payment.service';

@Controller()
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @MessagePattern('create_payment_intent')
  async createPaymentIntent(@Payload() data: { userId: string; courseIds: string[]; amount: number }) {
    return this.paymentService.createPaymentIntent(data.userId, data.courseIds, data.amount);
  }

  @MessagePattern('confirm_payment')
  async confirmPayment(@Payload() data: { userId: string; paymentIntentId: string; courseIds: string[] }) {
    return this.paymentService.confirmPayment(data.userId, data.paymentIntentId, data.courseIds);
  }

  @MessagePattern('stripe_webhook')
  async handleStripeWebhook(@Payload() data: { signature: string; rawBody: Buffer }) {
    return this.paymentService.handleStripeWebhook(data.signature, data.rawBody);
  }

  @MessagePattern('refund_payment')
  async refundPayment(@Payload() data: { paymentIntentId: string; reason?: string }) {
    return this.paymentService.refundPayment(data.paymentIntentId, data.reason);
  }

  @MessagePattern('get_payment_history')
  async getPaymentHistory(@Payload() data: { userId: string; pagination: any }) {
    return this.paymentService.getPaymentHistory(data.userId, data.pagination);
  }

  @MessagePattern('get_instructor_earnings')
  async getInstructorEarnings(@Payload() data: { instructorId: string }) {
    return this.paymentService.getInstructorEarnings(data.instructorId);
  }

  @MessagePattern('process_instructor_payout')
  async processInstructorPayout(@Payload() data: { instructorId: string; amount: number }) {
    return this.paymentService.processInstructorPayout(data.instructorId, data.amount);
  }

  @EventPattern('payment.completed')
  async handlePaymentCompleted(@Payload() data: any) {
    console.log('Payment completed event received:', data);
    // Handle post-payment tasks like sending receipts
  }

  @EventPattern('payment.failed')
  async handlePaymentFailed(@Payload() data: any) {
    console.log('Payment failed event received:', data);
    // Handle payment failure cleanup
  }
}
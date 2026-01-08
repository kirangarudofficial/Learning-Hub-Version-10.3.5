import { Controller, Post, Body, Headers, RawBodyRequest, Req } from '@nestjs/common';
import { CurrentUser, Public } from '@shared/decorators/user.decorator';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('create-payment-intent')
  async createPaymentIntent(
    @CurrentUser() user: any,
    @Body() body: { courseIds: string[]; amount: number },
  ) {
    return this.paymentsService.createPaymentIntent(user.id, body.courseIds, body.amount);
  }

  @Post('confirm-payment')
  async confirmPayment(
    @CurrentUser() user: any,
    @Body() body: { paymentIntentId: string; courseIds: string[] },
  ) {
    return this.paymentsService.confirmPayment(user.id, body.paymentIntentId, body.courseIds);
  }

  @Public()
  @Post('webhook')
  async stripeWebhook(
    @Headers('stripe-signature') signature: string,
    @Req() req: RawBodyRequest<Request>,
  ) {
    return this.paymentsService.handleWebhook(signature, req.rawBody);
  }

  @Post('refund')
  async refundPayment(@Body() body: { paymentIntentId: string; reason?: string }) {
    return this.paymentsService.refundPayment(body.paymentIntentId, body.reason);
  }
}
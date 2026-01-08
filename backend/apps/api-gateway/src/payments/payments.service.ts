import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { MICROSERVICE_TOKENS } from '@shared/constants';
import { ApiResponseUtil } from '@shared/utils';

@Injectable()
export class PaymentsService {
  constructor(
    @Inject(MICROSERVICE_TOKENS.PAYMENT_SERVICE)
    private paymentServiceClient: ClientProxy,
  ) {}

  async createPaymentIntent(userId: string, courseIds: string[], amount: number) {
    try {
      const result = await firstValueFrom(
        this.paymentServiceClient.send('create_payment_intent', {
          userId,
          courseIds,
          amount,
        }),
      );

      return ApiResponseUtil.success(result);
    } catch (error) {
      throw error;
    }
  }

  async confirmPayment(userId: string, paymentIntentId: string, courseIds: string[]) {
    try {
      const result = await firstValueFrom(
        this.paymentServiceClient.send('confirm_payment', {
          userId,
          paymentIntentId,
          courseIds,
        }),
      );

      return ApiResponseUtil.success(result);
    } catch (error) {
      throw error;
    }
  }

  async handleWebhook(signature: string, rawBody: Buffer) {
    try {
      const result = await firstValueFrom(
        this.paymentServiceClient.send('stripe_webhook', {
          signature,
          rawBody,
        }),
      );

      return result;
    } catch (error) {
      throw error;
    }
  }

  async refundPayment(paymentIntentId: string, reason?: string) {
    try {
      const result = await firstValueFrom(
        this.paymentServiceClient.send('refund_payment', {
          paymentIntentId,
          reason,
        }),
      );

      return ApiResponseUtil.success(result);
    } catch (error) {
      throw error;
    }
  }
}
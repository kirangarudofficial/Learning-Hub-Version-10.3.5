import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { StripeService } from './stripe.service';
import { DatabaseModule } from '@shared/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [PaymentController],
  providers: [PaymentService, StripeService],
  exports: [PaymentService, StripeService],
})
export class PaymentModule {}

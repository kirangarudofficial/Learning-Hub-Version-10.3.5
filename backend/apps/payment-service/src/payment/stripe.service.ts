import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor(private configService: ConfigService) {
    const secretKey = this.configService.get<string>('STRIPE_SECRET_KEY');
    if (!secretKey) {
      throw new Error('STRIPE_SECRET_KEY is not configured');
    }

    this.stripe = new Stripe(secretKey, {
      apiVersion: '2023-10-16',
    });
  }

  async createPaymentIntent(
    amount: number,
    currency: string = 'usd',
    metadata?: Record<string, string>,
    customerId?: string
  ): Promise<Stripe.PaymentIntent> {
    try {
      const paymentIntentData: Stripe.PaymentIntentCreateParams = {
        amount: Math.round(amount * 100), // Convert to cents
        currency: currency.toLowerCase(),
        automatic_payment_methods: {
          enabled: true,
        },
        metadata: metadata || {},
      };

      if (customerId) {
        paymentIntentData.customer = customerId;
      }

      return await this.stripe.paymentIntents.create(paymentIntentData);
    } catch (error) {
      console.error('Error creating payment intent:', error);
      throw new InternalServerErrorException('Failed to create payment intent');
    }
  }

  async retrievePaymentIntent(paymentIntentId: string): Promise<Stripe.PaymentIntent> {
    try {
      return await this.stripe.paymentIntents.retrieve(paymentIntentId);
    } catch (error) {
      console.error('Error retrieving payment intent:', error);
      throw new BadRequestException('Payment intent not found');
    }
  }

  async confirmPaymentIntent(paymentIntentId: string): Promise<Stripe.PaymentIntent> {
    try {
      return await this.stripe.paymentIntents.confirm(paymentIntentId);
    } catch (error) {
      console.error('Error confirming payment intent:', error);
      throw new BadRequestException('Failed to confirm payment');
    }
  }

  async cancelPaymentIntent(paymentIntentId: string): Promise<Stripe.PaymentIntent> {
    try {
      return await this.stripe.paymentIntents.cancel(paymentIntentId);
    } catch (error) {
      console.error('Error canceling payment intent:', error);
      throw new BadRequestException('Failed to cancel payment');
    }
  }

  async createRefund(
    paymentIntentId: string,
    amount?: number,
    reason?: string
  ): Promise<Stripe.Refund> {
    try {
      const refundData: Stripe.RefundCreateParams = {
        payment_intent: paymentIntentId,
      };

      if (amount) {
        refundData.amount = Math.round(amount * 100); // Convert to cents
      }

      if (reason) {
        refundData.reason = reason as Stripe.RefundCreateParams.Reason;
      }

      return await this.stripe.refunds.create(refundData);
    } catch (error) {
      console.error('Error creating refund:', error);
      throw new InternalServerErrorException('Failed to create refund');
    }
  }

  async createCustomer(email: string, name?: string, metadata?: Record<string, string>): Promise<Stripe.Customer> {
    try {
      return await this.stripe.customers.create({
        email,
        name,
        metadata,
      });
    } catch (error) {
      console.error('Error creating customer:', error);
      throw new InternalServerErrorException('Failed to create customer');
    }
  }

  async getCustomer(customerId: string): Promise<Stripe.Customer> {
    try {
      const customer = await this.stripe.customers.retrieve(customerId);
      return customer as Stripe.Customer;
    } catch (error) {
      console.error('Error retrieving customer:', error);
      throw new BadRequestException('Customer not found');
    }
  }

  async updateCustomer(
    customerId: string,
    data: { email?: string; name?: string; metadata?: Record<string, string> }
  ): Promise<Stripe.Customer> {
    try {
      return await this.stripe.customers.update(customerId, data);
    } catch (error) {
      console.error('Error updating customer:', error);
      throw new BadRequestException('Failed to update customer');
    }
  }

  async createSetupIntent(customerId: string): Promise<Stripe.SetupIntent> {
    try {
      return await this.stripe.setupIntents.create({
        customer: customerId,
        automatic_payment_methods: {
          enabled: true,
        },
      });
    } catch (error) {
      console.error('Error creating setup intent:', error);
      throw new InternalServerErrorException('Failed to create setup intent');
    }
  }

  async attachPaymentMethod(paymentMethodId: string, customerId: string): Promise<Stripe.PaymentMethod> {
    try {
      return await this.stripe.paymentMethods.attach(paymentMethodId, {
        customer: customerId,
      });
    } catch (error) {
      console.error('Error attaching payment method:', error);
      throw new BadRequestException('Failed to attach payment method');
    }
  }

  async detachPaymentMethod(paymentMethodId: string): Promise<Stripe.PaymentMethod> {
    try {
      return await this.stripe.paymentMethods.detach(paymentMethodId);
    } catch (error) {
      console.error('Error detaching payment method:', error);
      throw new BadRequestException('Failed to detach payment method');
    }
  }

  async listCustomerPaymentMethods(customerId: string, type: string = 'card'): Promise<Stripe.PaymentMethod[]> {
    try {
      const paymentMethods = await this.stripe.paymentMethods.list({
        customer: customerId,
        type: type as Stripe.PaymentMethodListParams.Type,
      });
      return paymentMethods.data;
    } catch (error) {
      console.error('Error listing payment methods:', error);
      throw new BadRequestException('Failed to list payment methods');
    }
  }

  async constructWebhookEvent(payload: Buffer, signature: string): Promise<Stripe.Event> {
    const webhookSecret = this.configService.get<string>('STRIPE_WEBHOOK_SECRET');
    if (!webhookSecret) {
      throw new Error('STRIPE_WEBHOOK_SECRET is not configured');
    }

    try {
      return this.stripe.webhooks.constructEvent(payload, signature, webhookSecret);
    } catch (error) {
      console.error('Error constructing webhook event:', error);
      throw new BadRequestException('Invalid webhook signature');
    }
  }

  async createPrice(
    productId: string,
    amount: number,
    currency: string = 'usd',
    recurring?: { interval: 'month' | 'year'; intervalCount?: number }
  ): Promise<Stripe.Price> {
    try {
      const priceData: Stripe.PriceCreateParams = {
        product: productId,
        unit_amount: Math.round(amount * 100), // Convert to cents
        currency: currency.toLowerCase(),
      };

      if (recurring) {
        priceData.recurring = {
          interval: recurring.interval,
          interval_count: recurring.intervalCount || 1,
        };
      }

      return await this.stripe.prices.create(priceData);
    } catch (error) {
      console.error('Error creating price:', error);
      throw new InternalServerErrorException('Failed to create price');
    }
  }

  async createProduct(name: string, description?: string, metadata?: Record<string, string>): Promise<Stripe.Product> {
    try {
      return await this.stripe.products.create({
        name,
        description,
        metadata,
      });
    } catch (error) {
      console.error('Error creating product:', error);
      throw new InternalServerErrorException('Failed to create product');
    }
  }

  async createSubscription(
    customerId: string,
    priceId: string,
    metadata?: Record<string, string>
  ): Promise<Stripe.Subscription> {
    try {
      return await this.stripe.subscriptions.create({
        customer: customerId,
        items: [{ price: priceId }],
        metadata,
      });
    } catch (error) {
      console.error('Error creating subscription:', error);
      throw new InternalServerErrorException('Failed to create subscription');
    }
  }

  async cancelSubscription(subscriptionId: string, immediately: boolean = false): Promise<Stripe.Subscription> {
    try {
      if (immediately) {
        return await this.stripe.subscriptions.cancel(subscriptionId);
      } else {
        return await this.stripe.subscriptions.update(subscriptionId, {
          cancel_at_period_end: true,
        });
      }
    } catch (error) {
      console.error('Error canceling subscription:', error);
      throw new BadRequestException('Failed to cancel subscription');
    }
  }

  async getPaymentIntentsByCustomer(customerId: string, limit: number = 10): Promise<Stripe.PaymentIntent[]> {
    try {
      const paymentIntents = await this.stripe.paymentIntents.list({
        customer: customerId,
        limit,
      });
      return paymentIntents.data;
    } catch (error) {
      console.error('Error retrieving payment intents:', error);
      throw new BadRequestException('Failed to retrieve payment intents');
    }
  }

  async getBalance(): Promise<Stripe.Balance> {
    try {
      return await this.stripe.balance.retrieve();
    } catch (error) {
      console.error('Error retrieving balance:', error);
      throw new InternalServerErrorException('Failed to retrieve balance');
    }
  }
}
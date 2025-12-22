import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StripePaymentIntentService } from '../../../../../core/services/stripe-payment-intent.service';
import { Product, Price, PaymentIntentResponse, PromoCodeValidation } from '../../../../../core/interfaces/payment.interface';
import { NotificationService } from '../../../../../core/services/notification.service';
import { AppConfig } from '../../../../../config.service';
import { MESSAGES } from '../../../../../core/constants/messages.constant';
import { loadStripe, Stripe, StripeElements, StripePaymentElement } from '@stripe/stripe-js';

@Component({
  selector: 'app-promocode-payment-intent',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './promocode-payment-intent.component.html',
  styleUrls: ['./promocode-payment-intent.component.scss']
})
export class PromocodePaymentIntentComponent implements OnInit {
  private paymentIntentService = inject(StripePaymentIntentService);
  private notificationService = inject(NotificationService);
  private config = inject(AppConfig);

  products = signal<Product[]>([]);
  selectedProduct = signal<Product | null>(null);
  selectedPrice = signal<Price | null>(null);
  loading = signal<boolean>(false);
  processing = signal<boolean>(false);
  paymentSuccess = signal<boolean>(false);
  
  promoCode = signal<string>('');
  promoCodeValidated = signal<boolean>(false);
  promoCodeValidation = signal<PromoCodeValidation | null>(null);
  
  stripe: Stripe | null = null;
  elements: StripeElements | null = null;
  paymentElement: StripePaymentElement | null = null;
  clientSecret = signal<string>('');
  paymentIntentId = signal<string>('');

  isPaymentFormReady = computed(() => {
    return this.clientSecret() !== '' && !this.processing();
  });

  finalAmount = computed(() => {
    return this.promoCodeValidation()?.final_amount || this.selectedPrice()?.amount || 0;
  });

  ngOnInit(): void {
    this.loadProducts();
    this.initializeStripe();
  }

  async initializeStripe(): Promise<void> {
    try {
      this.stripe = await loadStripe(this.config.stripePublishableKey);
    } catch (error) {
      console.error('Failed to load Stripe:', error);
      this.notificationService.error(MESSAGES.PAYMENT.INITIALIZATION_FAILED);
    }
  }

  loadProducts(): void {
    this.loading.set(true);
    this.paymentIntentService.getProductsWithPromoCode().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.products.set(response.data);
        }
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.notificationService.error(MESSAGES.PRODUCT.LOAD_FAILED);
        this.loading.set(false);
      }
    });
  }

  selectProduct(product: Product): void {
    this.selectedProduct.set(product);
    this.selectedPrice.set(null);
    this.promoCode.set('');
    this.promoCodeValidated.set(false);
    this.promoCodeValidation.set(null);
    this.clientSecret.set('');
    this.paymentSuccess.set(false);
  }

  selectPrice(price: Price): void {
    this.selectedPrice.set(price);
    this.promoCodeValidated.set(false);
    this.promoCodeValidation.set(null);
  }

  validatePromoCode(): void {
    if (!this.promoCode() || !this.selectedPrice()) {
      this.notificationService.error(MESSAGES.PROMO_CODE.REQUIRED);
      return;
    }

    this.processing.set(true);
    this.paymentIntentService.validatePromoCode(this.promoCode(), this.selectedPrice()!.id).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.promoCodeValidation.set(response.data);
          this.promoCodeValidated.set(true);
          this.notificationService.success(MESSAGES.SUCCESS.PROMO_CODE_APPLIED);
        }
        this.processing.set(false);
      },
      error: (error) => {
        console.error('Error validating promo code:', error);
        this.notificationService.error(error.error?.message || MESSAGES.PROMO_CODE.INVALID);
        this.processing.set(false);
      }
    });
  }

  createPaymentIntent(): void {
    if (!this.promoCodeValidated()) {
      this.notificationService.error(MESSAGES.PROMO_CODE.VALIDATE_FIRST);
      return;
    }

    this.processing.set(true);
    this.paymentIntentService.createPaymentIntentWithPromoCode(
      this.selectedPrice()!.id,
      this.promoCode()
    ).subscribe({
      next: async (response) => {
        if (response.success && response.data) {
          const data: PaymentIntentResponse = response.data;
          this.clientSecret.set(data.clientSecret);
          this.paymentIntentId.set(data.paymentIntentId);
          await this.setupPaymentElement(data.clientSecret);
          this.notificationService.success(MESSAGES.SUCCESS.PAYMENT_FORM_READY);
        }
        this.processing.set(false);
      },
      error: (error) => {
        console.error('Error creating payment intent:', error);
        this.notificationService.error(error.error?.message || MESSAGES.PAYMENT.CREATION_FAILED);
        this.processing.set(false);
      }
    });
  }

  async setupPaymentElement(clientSecret: string): Promise<void> {
    if (!this.stripe) {
      this.notificationService.error(MESSAGES.PAYMENT.STRIPE_NOT_INITIALIZED);
      return;
    }

    this.elements = this.stripe.elements({ clientSecret });
    this.paymentElement = this.elements.create('payment');
    this.paymentElement.mount('#payment-element');
  }

  async handleSubmit(): Promise<void> {
    if (!this.stripe || !this.elements) {
      this.notificationService.error(MESSAGES.PAYMENT.SYSTEM_NOT_READY);
      return;
    }

    this.processing.set(true);

    const { error } = await this.stripe.confirmPayment({
      elements: this.elements,
      confirmParams: {
        return_url: window.location.origin + '/main/stripe-payment-intent/success',
      },
      redirect: 'if_required'
    });

    if (error) {
      this.notificationService.error(error.message || MESSAGES.PAYMENT.FAILED);
      this.processing.set(false);
    } else {
      await this.confirmPayment();
    }
  }

  async confirmPayment(): Promise<void> {
    this.paymentIntentService.confirmPaymentWithPromoCode(this.paymentIntentId()).subscribe({
      next: (response) => {
        if (response.success && response.data.status === 'succeeded') {
          this.paymentSuccess.set(true);
          this.notificationService.success(MESSAGES.SUCCESS.PAYMENT_SUCCESSFUL);
        } else {
          this.notificationService.error(MESSAGES.PAYMENT.CONFIRMATION_FAILED);
        }
        this.processing.set(false);
      },
      error: (error) => {
        console.error('Error confirming payment:', error);
        this.notificationService.error(MESSAGES.PAYMENT.CONFIRMATION_FAILED);
        this.processing.set(false);
      }
    });
  }

  resetForm(): void {
    this.selectedProduct.set(null);
    this.selectedPrice.set(null);
    this.promoCode.set('');
    this.promoCodeValidated.set(false);
    this.promoCodeValidation.set(null);
    this.clientSecret.set('');
    this.paymentIntentId.set('');
    this.paymentSuccess.set(false);
    if (this.paymentElement) {
      this.paymentElement.unmount();
    }
    this.loadProducts();
  }

  formatAmount(amount: number, currency: string): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount / 100);
  }
}

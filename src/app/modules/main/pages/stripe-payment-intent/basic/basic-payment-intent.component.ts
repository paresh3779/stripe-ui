import { Component, OnInit, OnDestroy, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StripePaymentIntentService } from '../../../../../core/services/stripe-payment-intent.service';
import { Product, Price, PaymentIntentResponse } from '../../../../../core/interfaces/payment.interface';
import { NotificationService } from '../../../../../core/services/notification.service';
import { AppConfig } from '../../../../../config.service';
import { MESSAGES } from '../../../../../core/constants/messages.constant';
import { loadStripe, Stripe, StripeElements, StripePaymentElement } from '@stripe/stripe-js';

/**
 * Payment result interface
 */
interface PaymentResult {
  status: string;
  payment: {
    id: string;
    amount: number;
    currency: string;
    description: string;
    paid_at: string;
  };
  invoice?: {
    id: string;
    number: string;
    total: number;
  };
  paymentIntent: {
    id: string;
    status: string;
    amount: number;
    currency: string;
  };
}

/**
 * Component for basic PaymentIntent checkout without promo code or coupon
 */
@Component({
  selector: 'app-basic-payment-intent',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './basic-payment-intent.component.html',
  styleUrls: ['./basic-payment-intent.component.scss']
})
export class BasicPaymentIntentComponent implements OnInit, OnDestroy {
  private paymentIntentService = inject(StripePaymentIntentService);
  private notificationService = inject(NotificationService);
  private config = inject(AppConfig);

  // State signals
  products = signal<Product[]>([]);
  selectedProduct = signal<Product | null>(null);
  selectedPrice = signal<Price | null>(null);
  loading = signal<boolean>(false);
  processing = signal<boolean>(false);
  paymentSuccess = signal<boolean>(false);
  paymentFailed = signal<boolean>(false);
  errorMessage = signal<string>('');
  paymentResult = signal<PaymentResult | null>(null);
  
  // Stripe instances
  stripe: Stripe | null = null;
  elements: StripeElements | null = null;
  paymentElement: StripePaymentElement | null = null;
  clientSecret = signal<string>('');
  paymentIntentId = signal<string>('');
  paymentId = signal<string>('');

  /**
   * Computed property to check if payment form is ready
   */
  isPaymentFormReady = computed(() => {
    return this.clientSecret() !== '' && !this.processing();
  });

  /**
   * Computed property to check if can submit payment
   */
  canSubmitPayment = computed(() => {
    return this.isPaymentFormReady() && !this.processing() && this.paymentElement !== null;
  });

  /**
   * Initialize component and load products
   */
  ngOnInit(): void {
    this.loadProducts();
    this.initializeStripe();
  }

  /**
   * Initialize Stripe instance
   */
  async initializeStripe(): Promise<void> {
    try {
      this.stripe = await loadStripe(this.config.stripePublishableKey);
    } catch (error) {
      console.error('Failed to load Stripe:', error);
      this.notificationService.error(MESSAGES.PAYMENT.INITIALIZATION_FAILED);
    }
  }

  /**
   * Load all one-time products
   */
  loadProducts(): void {
    this.loading.set(true);
    this.paymentIntentService.getProducts().subscribe({
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

  /**
   * Select a product
   */
  selectProduct(product: Product): void {
    this.selectedProduct.set(product);
    this.selectedPrice.set(null);
    this.clientSecret.set('');
    this.paymentSuccess.set(false);
  }

  /**
   * Select a price and create PaymentIntent
   */
  selectPrice(price: Price): void {
    this.selectedPrice.set(price);
    this.createPaymentIntent(price.id);
  }

  /**
   * Create PaymentIntent
   */
  createPaymentIntent(priceId: string): void {
    this.processing.set(true);
    this.paymentIntentService.createPaymentIntent(priceId).subscribe({
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

  /**
   * Setup Stripe Payment Element
   */
  async setupPaymentElement(clientSecret: string): Promise<void> {
    if (!this.stripe) {
      this.notificationService.error(MESSAGES.PAYMENT.STRIPE_NOT_INITIALIZED);
      return;
    }

    this.elements = this.stripe.elements({ clientSecret });
    this.paymentElement = this.elements.create('payment');
    this.paymentElement.mount('#payment-element');
  }

  /**
   * Handle payment submission
   */
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

  /**
   * Confirm payment status with backend
   */
  async confirmPayment(): Promise<void> {
    this.paymentIntentService.confirmPayment(this.paymentIntentId()).subscribe({
      next: (response) => {
        if (response.success && response.data.status === 'succeeded') {
          this.paymentSuccess.set(true);
          this.paymentResult.set(response.data as PaymentResult);
          this.notificationService.success(MESSAGES.SUCCESS.PAYMENT_SUCCESSFUL);
        } else if (response.data.status === 'failed') {
          this.paymentFailed.set(true);
          this.errorMessage.set('Payment failed. Please try again.');
          this.notificationService.error(MESSAGES.PAYMENT.FAILED);
        } else {
          this.notificationService.info('Payment is being processed...');
        }
        this.processing.set(false);
      },
      error: (error) => {
        console.error('Error confirming payment:', error);
        this.paymentFailed.set(true);
        this.errorMessage.set(error.error?.message || MESSAGES.PAYMENT.CONFIRMATION_FAILED);
        this.notificationService.error(MESSAGES.PAYMENT.CONFIRMATION_FAILED);
        this.processing.set(false);
      }
    });
  }

  /**
   * Cancel the current payment
   */
  cancelCurrentPayment(): void {
    if (!this.paymentIntentId()) {
      this.resetForm();
      return;
    }

    this.processing.set(true);
    this.paymentIntentService.cancelPayment(this.paymentIntentId()).subscribe({
      next: () => {
        this.notificationService.info('Payment cancelled');
        this.resetForm();
      },
      error: (error) => {
        console.error('Error canceling payment:', error);
        this.resetForm();
      }
    });
  }

  /**
   * Reset the form
   */
  resetForm(): void {
    this.selectedProduct.set(null);
    this.selectedPrice.set(null);
    this.clientSecret.set('');
    this.paymentIntentId.set('');
    this.paymentId.set('');
    this.paymentSuccess.set(false);
    this.paymentFailed.set(false);
    this.errorMessage.set('');
    this.paymentResult.set(null);
    this.processing.set(false);
    
    if (this.paymentElement) {
      this.paymentElement.unmount();
      this.paymentElement = null;
    }
    this.elements = null;
    this.loadProducts();
  }

  /**
   * Cleanup on component destroy
   */
  ngOnDestroy(): void {
    if (this.paymentElement) {
      this.paymentElement.unmount();
      this.paymentElement = null;
    }
    this.elements = null;
  }

  /**
   * Format amount for display
   */
  formatAmount(amount: number, currency: string): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount / 100);
  }

  /**
   * Format date for display
   */
  formatDate(dateString: string): string {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}

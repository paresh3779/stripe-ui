import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StripePaymentIntentService } from '../../../../../core/services/stripe-payment-intent.service';
import { Product, Price, PaymentIntentResponse } from '../../../../../core/interfaces/payment.interface';
import { NotificationService } from '../../../../../core/services/notification.service';
import { AppConfig } from '../../../../../config.service';
import { MESSAGES } from '../../../../../core/constants/messages.constant';
import { loadStripe, Stripe, StripeElements, StripePaymentElement } from '@stripe/stripe-js';

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
export class BasicPaymentIntentComponent implements OnInit {
  private paymentIntentService = inject(StripePaymentIntentService);
  private notificationService = inject(NotificationService);
  private config = inject(AppConfig);

  products = signal<Product[]>([]);
  selectedProduct = signal<Product | null>(null);
  selectedPrice = signal<Price | null>(null);
  loading = signal<boolean>(false);
  processing = signal<boolean>(false);
  paymentSuccess = signal<boolean>(false);
  
  stripe: Stripe | null = null;
  elements: StripeElements | null = null;
  paymentElement: StripePaymentElement | null = null;
  clientSecret = signal<string>('');
  paymentIntentId = signal<string>('');

  /**
   * Computed property to check if payment form is ready
   */
  isPaymentFormReady = computed(() => {
    return this.clientSecret() !== '' && !this.processing();
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

  /**
   * Reset the form
   */
  resetForm(): void {
    this.selectedProduct.set(null);
    this.selectedPrice.set(null);
    this.clientSecret.set('');
    this.paymentIntentId.set('');
    this.paymentSuccess.set(false);
    if (this.paymentElement) {
      this.paymentElement.unmount();
    }
    this.loadProducts();
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
}

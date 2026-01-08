import { Component, OnInit, OnDestroy, inject, signal, computed, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StripeSubscriptionPaymentIntentService } from '../../../../../core/services/stripe-subscription-payment-intent.service';
import { NotificationService } from '../../../../../core/services/notification.service';
import { SubscriptionProduct, SubscriptionPrice } from '../../../../../core/interfaces/subscription.interface';
import { SavedPaymentMethod, TrialSubscription, TrialInvoice } from '../../../../../core/interfaces/subscription-payment-intent.interface';
import { SUBSCRIPTION_PAYMENT_INTENT_MESSAGES } from '../../../../../core/constants/subscription-payment-intent-messages.constant';
import { AppConfig } from '../../../../../config.service';
import { loadStripe, Stripe, StripeElements, StripeCardElement } from '@stripe/stripe-js';

/**
 * Subscription PaymentIntent with 15-day trial period
 * Features: Products, Stripe Elements, Payment Methods, Subscription Management, Invoices
 */
@Component({
  selector: 'app-trial-payment-intent',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './trial-payment-intent.component.html',
  styleUrls: ['./trial-payment-intent.component.scss']
})
export class TrialPaymentIntentComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('cardElement') cardElementRef!: ElementRef;

  private readonly paymentIntentService = inject(StripeSubscriptionPaymentIntentService);
  private readonly notificationService = inject(NotificationService);
  private readonly appConfig = inject(AppConfig);

  // Stripe
  private stripe: Stripe | null = null;
  private elements: StripeElements | null = null;
  private cardElement: StripeCardElement | null = null;

  // State signals - Products
  products = signal<SubscriptionProduct[]>([]);
  selectedProduct = signal<SubscriptionProduct | null>(null);
  selectedPrice = signal<SubscriptionPrice | null>(null);
  loading = signal(false);
  processingPayment = signal(false);

  // State signals - Payment Methods
  savedPaymentMethods = signal<SavedPaymentMethod[]>([]);
  selectedPaymentMethod = signal<SavedPaymentMethod | null>(null);
  useNewCard = signal(true);
  loadingPaymentMethods = signal(false);

  // State signals - Subscriptions & Invoices
  subscriptions = signal<TrialSubscription[]>([]);
  invoices = signal<TrialInvoice[]>([]);
  loadingSubscriptions = signal(false);
  loadingInvoices = signal(false);
  cancellingSubscription = signal<string | null>(null);

  // UI state
  activeTab = signal<'products' | 'subscriptions' | 'invoices'>('products');
  paymentStep = signal<'select' | 'payment' | 'success'>('select');
  clientSecret = signal<string | null>(null);
  cardComplete = signal(false);
  cardError = signal<string | null>(null);

  // Computed values
  hasProducts = computed(() => this.products().length > 0);
  hasSubscriptions = computed(() => this.subscriptions().length > 0);
  hasInvoices = computed(() => this.invoices().length > 0);
  hasSavedPaymentMethods = computed(() => this.savedPaymentMethods().length > 0);
  canProceed = computed(() => this.selectedPrice() !== null && !this.processingPayment());
  canSubmitPayment = computed(() => {
    if (this.processingPayment()) return false;
    if (!this.useNewCard() && this.selectedPaymentMethod()) return true;
    return this.useNewCard() && this.cardComplete();
  });

  /** Get prices with trial periods */
  trialPrices = computed(() => {
    const product = this.selectedProduct();
    if (!product?.prices) return [];
    return product.prices.filter(p => p.trial_days && p.trial_days > 0);
  });

  /** Get active subscriptions count */
  activeSubscriptionsCount = computed(() => 
    this.subscriptions().filter(s => s.status === 'active' || s.status === 'trialing').length
  );

  readonly messages = SUBSCRIPTION_PAYMENT_INTENT_MESSAGES;
  readonly TRIAL_DAYS = 15;

  async ngOnInit(): Promise<void> {
    this.stripe = await loadStripe(this.appConfig.stripePublishableKey);
    this.loadProducts();
    this.loadSubscriptions();
    this.loadInvoices();
    this.loadPaymentMethods();
  }

  ngAfterViewInit(): void {
    // Card element will be mounted when payment step is reached
  }

  ngOnDestroy(): void {
    if (this.cardElement) {
      this.cardElement.destroy();
    }
  }

  /** Switch between tabs */
  setActiveTab(tab: 'products' | 'subscriptions' | 'invoices'): void {
    this.activeTab.set(tab);
  }

  // ==================== Products ====================

  /** Load trial products from API */
  loadProducts(): void {
    this.loading.set(true);
    this.paymentIntentService.getTrialProducts().subscribe({
      next: (response) => {
        if (response.success) {
          this.products.set(response.data);
        }
        this.loading.set(false);
      },
      error: () => {
        this.notificationService.error(this.messages.PRODUCT_LOAD_FAILED);
        this.loading.set(false);
      }
    });
  }

  /** Select a product and auto-select first price */
  selectProduct(product: SubscriptionProduct): void {
    this.selectedProduct.set(product);
    const prices = product.prices || [];
    this.selectedPrice.set(prices.length > 0 ? prices[0] : null);
  }

  /** Select a specific price */
  selectPrice(price: SubscriptionPrice): void {
    this.selectedPrice.set(price);
  }

  // ==================== Payment Methods ====================

  /** Load saved payment methods */
  loadPaymentMethods(): void {
    this.loadingPaymentMethods.set(true);
    this.paymentIntentService.getTrialPaymentMethods().subscribe({
      next: (response) => {
        if (response.success) {
          this.savedPaymentMethods.set(response.data);
          // Auto-select default payment method
          const defaultMethod = response.data.find(pm => pm.is_default);
          if (defaultMethod) {
            this.selectedPaymentMethod.set(defaultMethod);
            this.useNewCard.set(false);
          }
        }
        this.loadingPaymentMethods.set(false);
      },
      error: () => {
        this.loadingPaymentMethods.set(false);
      }
    });
  }

  /** Select a saved payment method */
  selectSavedPaymentMethod(pm: SavedPaymentMethod): void {
    this.selectedPaymentMethod.set(pm);
    this.useNewCard.set(false);
  }

  /** Switch to new card */
  switchToNewCard(): void {
    this.useNewCard.set(true);
    this.selectedPaymentMethod.set(null);
  }

  /** Delete a saved payment method */
  deletePaymentMethod(pm: SavedPaymentMethod): void {
    if (!confirm('Are you sure you want to delete this payment method?')) return;

    this.paymentIntentService.deleteTrialPaymentMethod(pm.stripe_payment_method_id).subscribe({
      next: (response) => {
        if (response.success) {
          this.notificationService.success('Payment method deleted');
          this.loadPaymentMethods();
        }
      },
      error: (error) => {
        this.notificationService.error(error.error?.message || 'Failed to delete payment method');
      }
    });
  }

  // ==================== Checkout ====================

  /** Proceed to payment step */
  proceedToPayment(): void {
    if (!this.selectedPrice()) {
      this.notificationService.error(this.messages.PRICE_REQUIRED);
      return;
    }
    this.paymentStep.set('payment');
    this.createSetupIntent();
  }

  /** Create setup intent and mount Stripe Elements */
  private createSetupIntent(): void {
    const price = this.selectedPrice();
    if (!price) return;

    this.paymentIntentService.createTrialSetupIntent(price.id).subscribe({
      next: (response) => {
        if (response.success) {
          this.clientSecret.set(response.data.clientSecret);
          // Update saved payment methods from response
          if (response.data.savedPaymentMethods) {
            this.savedPaymentMethods.set(response.data.savedPaymentMethods);
          }
          // Mount card element after a short delay
          setTimeout(() => this.mountCardElement(), 100);
        }
      },
      error: (error) => {
        this.notificationService.error(error.error?.message || 'Failed to create setup intent');
        this.paymentStep.set('select');
      }
    });
  }

  /** Mount Stripe card element */
  private mountCardElement(): void {
    if (!this.stripe || !this.cardElementRef?.nativeElement) return;

    this.elements = this.stripe.elements();
    this.cardElement = this.elements.create('card', {
      style: {
        base: {
          fontSize: '16px',
          color: '#32325d',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          '::placeholder': { color: '#aab7c4' }
        },
        invalid: { color: '#fa755a', iconColor: '#fa755a' }
      }
    });

    this.cardElement.mount(this.cardElementRef.nativeElement);

    this.cardElement.on('change', (event) => {
      this.cardComplete.set(event.complete);
      this.cardError.set(event.error?.message || null);
    });
  }

  /** Go back to selection step */
  goBack(): void {
    this.paymentStep.set('select');
    this.clientSecret.set(null);
    if (this.cardElement) {
      this.cardElement.destroy();
      this.cardElement = null;
    }
  }

  /** Process payment / Start trial */
  async processPayment(): Promise<void> {
    const price = this.selectedPrice();
    if (!price || !this.stripe) return;

    this.processingPayment.set(true);

    try {
      if (!this.useNewCard() && this.selectedPaymentMethod()) {
        // Use existing payment method
        await this.createSubscriptionWithSavedMethod();
      } else {
        // Use new card
        await this.createSubscriptionWithNewCard();
      }
    } catch (error: any) {
      this.notificationService.error(error.message || 'Payment failed');
      this.processingPayment.set(false);
    }
  }

  /** Create subscription with new card */
  private async createSubscriptionWithNewCard(): Promise<void> {
    const clientSecret = this.clientSecret();
    if (!this.stripe || !this.cardElement || !clientSecret) return;

    const { setupIntent, error } = await this.stripe.confirmCardSetup(clientSecret, {
      payment_method: { card: this.cardElement }
    });

    if (error) {
      this.notificationService.error(error.message || 'Card setup failed');
      this.processingPayment.set(false);
      return;
    }

    if (setupIntent?.payment_method) {
      const price = this.selectedPrice();
      if (!price) return;

      this.paymentIntentService.createTrialSubscription(
        price.id,
        setupIntent.payment_method as string
      ).subscribe({
        next: (response) => {
          if (response.success) {
            this.handleSubscriptionSuccess(response.data);
          }
          this.processingPayment.set(false);
        },
        error: (err) => {
          this.notificationService.error(err.error?.message || 'Subscription creation failed');
          this.processingPayment.set(false);
        }
      });
    }
  }

  /** Create subscription with saved payment method */
  private async createSubscriptionWithSavedMethod(): Promise<void> {
    const price = this.selectedPrice();
    const paymentMethod = this.selectedPaymentMethod();
    if (!price || !paymentMethod) return;

    this.paymentIntentService.createTrialSubscriptionWithSaved(
      price.id,
      paymentMethod.stripe_payment_method_id
    ).subscribe({
      next: (response) => {
        if (response.success) {
          this.handleSubscriptionSuccess(response.data);
        }
        this.processingPayment.set(false);
      },
      error: (err) => {
        this.notificationService.error(err.error?.message || 'Subscription creation failed');
        this.processingPayment.set(false);
      }
    });
  }

  /** Handle successful subscription */
  private handleSubscriptionSuccess(data: any): void {
    this.notificationService.success(`Trial started! Your ${this.TRIAL_DAYS}-day free trial has begun.`);
    this.paymentStep.set('success');
    this.loadSubscriptions();
    this.loadPaymentMethods();
  }

  /** Start new subscription */
  startNewSubscription(): void {
    this.paymentStep.set('select');
    this.selectedProduct.set(null);
    this.selectedPrice.set(null);
    this.clientSecret.set(null);
    this.setActiveTab('products');
  }

  // ==================== Subscription Management ====================

  /** Load user's subscriptions */
  loadSubscriptions(): void {
    this.loadingSubscriptions.set(true);
    this.paymentIntentService.getTrialSubscriptions().subscribe({
      next: (response) => {
        if (response.success) {
          this.subscriptions.set(response.data);
        }
        this.loadingSubscriptions.set(false);
      },
      error: () => {
        this.loadingSubscriptions.set(false);
      }
    });
  }

  /** Cancel subscription (at period end) */
  cancelSubscription(subscription: TrialSubscription): void {
    if (!confirm('Are you sure you want to cancel this subscription? You will continue to have access until the end of your billing period.')) {
      return;
    }

    this.cancellingSubscription.set(subscription.id);
    this.paymentIntentService.cancelTrialSubscription(subscription.id, false).subscribe({
      next: (response) => {
        if (response.success) {
          this.notificationService.success('Subscription will be cancelled at the end of the billing period.');
          this.loadSubscriptions();
        }
        this.cancellingSubscription.set(null);
      },
      error: (error) => {
        this.notificationService.error(error.error?.message || 'Failed to cancel subscription');
        this.cancellingSubscription.set(null);
      }
    });
  }

  /** Cancel subscription immediately with refund (within 7 days) */
  cancelWithRefund(subscription: TrialSubscription): void {
    if (!subscription.can_refund) {
      this.notificationService.error('This subscription is no longer eligible for refund.');
      return;
    }

    if (!confirm('Are you sure you want to cancel and request a refund? This will immediately revoke your access.')) {
      return;
    }

    this.cancellingSubscription.set(subscription.id);
    this.paymentIntentService.cancelTrialSubscription(subscription.id, true).subscribe({
      next: (response) => {
        if (response.success) {
          const refundMsg = response.data.refund?.success 
            ? ` Refund of ${this.formatPrice(response.data.refund.amount || 0, response.data.refund.currency || 'usd')} processed.`
            : '';
          this.notificationService.success('Subscription cancelled.' + refundMsg);
          this.loadSubscriptions();
          this.loadInvoices();
        }
        this.cancellingSubscription.set(null);
      },
      error: (error) => {
        this.notificationService.error(error.error?.message || 'Failed to cancel subscription');
        this.cancellingSubscription.set(null);
      }
    });
  }

  /** Check if cancellation is in progress */
  isCancelling(subscriptionId: string): boolean {
    return this.cancellingSubscription() === subscriptionId;
  }

  // ==================== Invoice Management ====================

  /** Load user's invoices */
  loadInvoices(): void {
    this.loadingInvoices.set(true);
    this.paymentIntentService.getTrialInvoices().subscribe({
      next: (response) => {
        if (response.success) {
          this.invoices.set(response.data);
        }
        this.loadingInvoices.set(false);
      },
      error: () => {
        this.loadingInvoices.set(false);
      }
    });
  }

  /** Download invoice PDF */
  downloadInvoicePdf(invoice: TrialInvoice): void {
    if (invoice.invoice_pdf) {
      window.open(invoice.invoice_pdf, '_blank');
    } else {
      this.paymentIntentService.downloadTrialInvoice(invoice.id).subscribe({
        next: (response) => {
          if (response.success && response.data.pdf_url) {
            window.open(response.data.pdf_url, '_blank');
          }
        },
        error: () => {
          this.notificationService.error('Failed to download invoice');
        }
      });
    }
  }

  /** View invoice in Stripe hosted page */
  viewInvoice(invoice: TrialInvoice): void {
    if (invoice.hosted_invoice_url) {
      window.open(invoice.hosted_invoice_url, '_blank');
    }
  }

  // ==================== Utility Methods ====================

  /** Format price amount to currency string */
  formatPrice(amount: number, currency: string): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase()
    }).format(amount / 100);
  }

  /** Get interval label for display */
  getIntervalLabel(interval: string): string {
    return interval === 'month' ? this.messages.PER_MONTH : this.messages.PER_YEAR;
  }

  /** Format trial days to readable string */
  formatTrialDays(days: number | undefined): string {
    if (!days) return `${this.TRIAL_DAYS} days`;
    if (days === 1) return '1 day';
    if (days === 7) return '1 week';
    if (days === 14) return '2 weeks';
    if (days === 30) return '1 month';
    return `${days} days`;
  }

  /** Get status badge class */
  getStatusBadgeClass(status: string): string {
    const statusClasses: Record<string, string> = {
      'active': 'bg-success',
      'trialing': 'bg-info',
      'past_due': 'bg-warning',
      'canceled': 'bg-secondary',
      'unpaid': 'bg-danger',
      'incomplete': 'bg-warning',
      'incomplete_expired': 'bg-danger',
      'paused': 'bg-secondary',
      'paid': 'bg-success',
      'open': 'bg-warning',
      'draft': 'bg-secondary',
      'void': 'bg-dark',
      'uncollectible': 'bg-danger'
    };
    return statusClasses[status] || 'bg-secondary';
  }

  /** Format date for display */
  formatDate(dateString: string | null): string {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  /** Get card brand icon class */
  getCardBrandIcon(brand: string | null): string {
    const brandIcons: Record<string, string> = {
      'visa': 'bi-credit-card-2-front',
      'mastercard': 'bi-credit-card-2-front',
      'amex': 'bi-credit-card-2-front',
      'discover': 'bi-credit-card-2-front'
    };
    return brandIcons[brand?.toLowerCase() || ''] || 'bi-credit-card';
  }
}

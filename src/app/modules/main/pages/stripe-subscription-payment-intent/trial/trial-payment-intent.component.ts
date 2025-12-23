import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StripeSubscriptionPaymentIntentService } from '../../../../../core/services/stripe-subscription-payment-intent.service';
import { NotificationService } from '../../../../../core/services/notification.service';
import { SubscriptionProduct, SubscriptionPrice } from '../../../../../core/interfaces/subscription.interface';
import { SUBSCRIPTION_PAYMENT_INTENT_MESSAGES } from '../../../../../core/constants/subscription-payment-intent-messages.constant';

/**
 * Demo 2: Subscription PaymentIntent with trial period
 */
@Component({
  selector: 'app-trial-payment-intent',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './trial-payment-intent.component.html',
  styleUrls: ['./trial-payment-intent.component.scss']
})
export class TrialPaymentIntentComponent implements OnInit {
  private readonly paymentIntentService = inject(StripeSubscriptionPaymentIntentService);
  private readonly notificationService = inject(NotificationService);

  // State signals
  products = signal<SubscriptionProduct[]>([]);
  selectedProduct = signal<SubscriptionProduct | null>(null);
  selectedPrice = signal<SubscriptionPrice | null>(null);
  loading = signal(false);
  processingPayment = signal(false);
  paymentStep = signal<'select' | 'payment'>('select');

  // Computed values
  hasProducts = computed(() => this.products().length > 0);
  canProceed = computed(() => this.selectedPrice() !== null && !this.processingPayment());

  /** Get prices with trial periods */
  trialPrices = computed(() => {
    const product = this.selectedProduct();
    if (!product?.prices) return [];
    return product.prices.filter(p => p.trial_days && p.trial_days > 0);
  });

  readonly messages = SUBSCRIPTION_PAYMENT_INTENT_MESSAGES;

  ngOnInit(): void {
    this.loadProducts();
  }

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

  /** Select a product and auto-select first trial price */
  selectProduct(product: SubscriptionProduct): void {
    this.selectedProduct.set(product);
    const prices = product.prices?.filter(p => p.trial_days && p.trial_days > 0) || [];
    this.selectedPrice.set(prices.length > 0 ? prices[0] : null);
  }

  /** Select a specific price */
  selectPrice(price: SubscriptionPrice): void {
    this.selectedPrice.set(price);
  }

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
    if (!days) return '0 days';
    if (days === 1) return '1 day';
    if (days === 7) return '1 week';
    if (days === 14) return '2 weeks';
    if (days === 30) return '1 month';
    return `${days} days`;
  }

  /** Proceed to payment step */
  proceedToPayment(): void {
    if (!this.selectedPrice()) {
      this.notificationService.error(this.messages.PRICE_REQUIRED);
      return;
    }
    this.paymentStep.set('payment');
  }

  /** Go back to selection step */
  goBack(): void {
    this.paymentStep.set('select');
  }

  /** Process payment */
  processPayment(): void {
    const price = this.selectedPrice();
    if (!price) return;

    this.processingPayment.set(true);

    this.paymentIntentService.createTrialSetupIntent(price.id).subscribe({
      next: (response) => {
        if (response.success) {
          this.notificationService.success('Trial setup intent created. Integrate Stripe Elements for payment.');
          console.log('Setup Intent:', response.data);
        }
        this.processingPayment.set(false);
      },
      error: () => {
        this.notificationService.error(this.messages.SUBSCRIPTION_FAILED);
        this.processingPayment.set(false);
      }
    });
  }
}

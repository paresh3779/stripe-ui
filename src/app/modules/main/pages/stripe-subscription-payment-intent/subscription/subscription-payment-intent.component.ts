import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StripeSubscriptionPaymentIntentService } from '../../../../../core/services/stripe-subscription-payment-intent.service';
import { NotificationService } from '../../../../../core/services/notification.service';
import { SubscriptionProduct, SubscriptionPrice } from '../../../../../core/interfaces/subscription.interface';
import { SUBSCRIPTION_PAYMENT_INTENT_MESSAGES } from '../../../../../core/constants/subscription-payment-intent-messages.constant';

/**
 * Demo 1: Subscription PaymentIntent with monthly/yearly billing
 * Uses Stripe Elements for payment method collection
 */
@Component({
  selector: 'app-subscription-payment-intent',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './subscription-payment-intent.component.html',
  styleUrls: ['./subscription-payment-intent.component.scss']
})
export class SubscriptionPaymentIntentComponent implements OnInit {
  private readonly paymentIntentService = inject(StripeSubscriptionPaymentIntentService);
  private readonly notificationService = inject(NotificationService);

  // State signals
  products = signal<SubscriptionProduct[]>([]);
  selectedProduct = signal<SubscriptionProduct | null>(null);
  selectedPrice = signal<SubscriptionPrice | null>(null);
  selectedInterval = signal<'month' | 'year'>('month');
  loading = signal(false);
  processingPayment = signal(false);
  paymentStep = signal<'select' | 'payment'>('select');

  // Computed values
  hasProducts = computed(() => this.products().length > 0);
  canProceed = computed(() => this.selectedPrice() !== null && !this.processingPayment());

  /** Get prices filtered by selected billing interval */
  filteredPrices = computed(() => {
    const product = this.selectedProduct();
    if (!product?.prices) return [];
    return product.prices.filter(p => p.interval === this.selectedInterval());
  });

  /** Check if yearly prices are available */
  hasYearlyPrices = computed(() => {
    const product = this.selectedProduct();
    if (!product?.prices) return false;
    return product.prices.some(p => p.interval === 'year');
  });

  readonly messages = SUBSCRIPTION_PAYMENT_INTENT_MESSAGES;

  ngOnInit(): void {
    this.loadProducts();
  }

  /** Load subscription products from API */
  loadProducts(): void {
    this.loading.set(true);
    this.paymentIntentService.getSubscriptionProducts().subscribe({
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

  /** Select a product and auto-select first price for current interval */
  selectProduct(product: SubscriptionProduct): void {
    this.selectedProduct.set(product);
    this.autoSelectPrice();
  }

  /** Change billing interval and update selected price */
  setInterval(interval: 'month' | 'year'): void {
    this.selectedInterval.set(interval);
    this.autoSelectPrice();
  }

  /** Auto-select first available price for current interval */
  private autoSelectPrice(): void {
    const prices = this.filteredPrices();
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

  /** Simulate payment (in real app, integrate Stripe Elements) */
  processPayment(): void {
    const price = this.selectedPrice();
    if (!price) return;

    this.processingPayment.set(true);

    // In production, you would:
    // 1. Create SetupIntent via API
    // 2. Use Stripe Elements to collect payment method
    // 3. Confirm the SetupIntent
    // 4. Create subscription with the payment method

    this.paymentIntentService.createSetupIntent(price.id).subscribe({
      next: (response) => {
        if (response.success) {
          this.notificationService.success('Setup intent created. Integrate Stripe Elements for payment.');
          console.log('Setup Intent:', response.data);
        }
        this.processingPayment.set(false);
      },
      error: (error) => {
        this.notificationService.error(this.messages.SUBSCRIPTION_FAILED);
        this.processingPayment.set(false);
      }
    });
  }
}

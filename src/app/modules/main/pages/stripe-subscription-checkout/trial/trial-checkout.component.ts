import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StripeSubscriptionCheckoutService } from '../../../../../core/services/stripe-subscription-checkout.service';
import { NotificationService } from '../../../../../core/services/notification.service';
import { SubscriptionProduct, SubscriptionPrice } from '../../../../../core/interfaces/subscription.interface';
import { SUBSCRIPTION_MESSAGES } from '../../../../../core/constants/subscription-messages.constant';

/**
 * Demo 2: Subscription checkout with trial period
 * Displays products that offer free trial periods before billing starts
 */
@Component({
  selector: 'app-trial-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './trial-checkout.component.html',
  styleUrls: ['./trial-checkout.component.scss']
})
export class TrialCheckoutComponent implements OnInit {
  private readonly checkoutService = inject(StripeSubscriptionCheckoutService);
  private readonly notificationService = inject(NotificationService);

  // State signals
  products = signal<SubscriptionProduct[]>([]);
  selectedProduct = signal<SubscriptionProduct | null>(null);
  selectedPrice = signal<SubscriptionPrice | null>(null);
  loading = signal(false);
  processingCheckout = signal(false);

  // Computed values
  hasProducts = computed(() => this.products().length > 0);
  canCheckout = computed(() => this.selectedPrice() !== null && !this.processingCheckout());
  
  /** Get prices with trial periods */
  trialPrices = computed(() => {
    const product = this.selectedProduct();
    if (!product?.prices) return [];
    return product.prices.filter(p => p.trial_days && p.trial_days > 0);
  });

  readonly messages = SUBSCRIPTION_MESSAGES;

  ngOnInit(): void {
    this.loadProducts();
  }

  /** Load trial products from API */
  loadProducts(): void {
    this.loading.set(true);
    this.checkoutService.getTrialProducts().subscribe({
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
  formatTrialDays(days: number): string {
    if (days === 1) return '1 day';
    if (days === 7) return '1 week';
    if (days === 14) return '2 weeks';
    if (days === 30) return '1 month';
    return `${days} days`;
  }

  /** Proceed to Stripe checkout with trial */
  proceedToCheckout(): void {
    const price = this.selectedPrice();
    
    if (!price) {
      this.notificationService.error(this.messages.PRICE_REQUIRED);
      return;
    }

    if (!price.trial_days || price.trial_days <= 0) {
      this.notificationService.error(this.messages.TRIAL_NOT_AVAILABLE);
      return;
    }

    this.processingCheckout.set(true);
    this.checkoutService.createTrialCheckoutSession(price.id).subscribe({
      next: (response) => {
        if (response.success && response.data.url) {
          window.location.href = response.data.url;
        }
        this.processingCheckout.set(false);
      },
      error: () => {
        this.notificationService.error(this.messages.CHECKOUT_FAILED);
        this.processingCheckout.set(false);
      }
    });
  }
}

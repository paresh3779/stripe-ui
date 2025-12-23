import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StripeSubscriptionCheckoutService } from '../../../../../core/services/stripe-subscription-checkout.service';
import { NotificationService } from '../../../../../core/services/notification.service';
import { SubscriptionProduct, SubscriptionPrice } from '../../../../../core/interfaces/subscription.interface';
import { SUBSCRIPTION_MESSAGES } from '../../../../../core/constants/subscription-messages.constant';

/**
 * Demo 1: Basic subscription checkout with monthly/yearly billing options
 * Allows users to select a subscription product and choose billing interval
 */
@Component({
  selector: 'app-subscription-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './subscription-checkout.component.html',
  styleUrls: ['./subscription-checkout.component.scss']
})
export class SubscriptionCheckoutComponent implements OnInit {
  private readonly checkoutService = inject(StripeSubscriptionCheckoutService);
  private readonly notificationService = inject(NotificationService);

  // State signals
  products = signal<SubscriptionProduct[]>([]);
  selectedProduct = signal<SubscriptionProduct | null>(null);
  selectedPrice = signal<SubscriptionPrice | null>(null);
  selectedInterval = signal<'month' | 'year'>('month');
  loading = signal(false);
  processingCheckout = signal(false);

  // Computed values
  hasProducts = computed(() => this.products().length > 0);
  canCheckout = computed(() => this.selectedPrice() !== null && !this.processingCheckout());
  
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

  readonly messages = SUBSCRIPTION_MESSAGES;

  ngOnInit(): void {
    this.loadProducts();
  }

  /** Load subscription products from API */
  loadProducts(): void {
    this.loading.set(true);
    this.checkoutService.getSubscriptionProducts().subscribe({
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

  /** Proceed to Stripe checkout */
  proceedToCheckout(): void {
    const price = this.selectedPrice();
    
    if (!price) {
      this.notificationService.error(this.messages.PRICE_REQUIRED);
      return;
    }

    this.processingCheckout.set(true);
    this.checkoutService.createSubscriptionCheckoutSession(price.id).subscribe({
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

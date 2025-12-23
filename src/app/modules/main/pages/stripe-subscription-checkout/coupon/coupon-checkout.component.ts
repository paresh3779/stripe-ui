import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StripeSubscriptionCheckoutService } from '../../../../../core/services/stripe-subscription-checkout.service';
import { NotificationService } from '../../../../../core/services/notification.service';
import { SubscriptionProduct, SubscriptionPrice } from '../../../../../core/interfaces/subscription.interface';
import { Coupon } from '../../../../../core/interfaces/stripe.interface';
import { SUBSCRIPTION_MESSAGES } from '../../../../../core/constants/subscription-messages.constant';

/**
 * Demo 3: Subscription checkout with coupon discount
 * Allows users to apply a coupon for discount on subscription
 */
@Component({
  selector: 'app-coupon-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './coupon-checkout.component.html',
  styleUrls: ['./coupon-checkout.component.scss']
})
export class CouponCheckoutComponent implements OnInit {
  private readonly checkoutService = inject(StripeSubscriptionCheckoutService);
  private readonly notificationService = inject(NotificationService);

  // State signals
  products = signal<SubscriptionProduct[]>([]);
  coupons = signal<Coupon[]>([]);
  selectedProduct = signal<SubscriptionProduct | null>(null);
  selectedPrice = signal<SubscriptionPrice | null>(null);
  selectedCoupon = signal<Coupon | null>(null);
  loading = signal(false);
  loadingCoupons = signal(false);
  processingCheckout = signal(false);

  // Computed values
  hasProducts = computed(() => this.products().length > 0);
  hasCoupons = computed(() => this.coupons().length > 0);
  canCheckout = computed(() => 
    this.selectedPrice() !== null && 
    this.selectedCoupon() !== null && 
    !this.processingCheckout()
  );

  /** Calculate discounted price */
  discountedAmount = computed(() => {
    const price = this.selectedPrice();
    const coupon = this.selectedCoupon();
    if (!price || !coupon) return null;

    let discount = 0;
    if (coupon.discount_type === 'percentage') {
      discount = Math.round(price.amount * (coupon.discount_value / 100));
    } else {
      discount = Math.min(coupon.discount_value, price.amount);
    }

    return {
      original: price.amount,
      discount,
      final: price.amount - discount,
      currency: price.currency
    };
  });

  readonly messages = SUBSCRIPTION_MESSAGES;

  ngOnInit(): void {
    this.loadProducts();
    this.loadCoupons();
  }

  /** Load subscription products from API */
  loadProducts(): void {
    this.loading.set(true);
    this.checkoutService.getCouponProducts().subscribe({
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

  /** Load available coupons from API */
  loadCoupons(): void {
    this.loadingCoupons.set(true);
    this.checkoutService.getCoupons().subscribe({
      next: (response) => {
        if (response.success) {
          this.coupons.set(response.data);
        }
        this.loadingCoupons.set(false);
      },
      error: () => {
        this.loadingCoupons.set(false);
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

  /** Select a coupon */
  selectCoupon(coupon: Coupon): void {
    this.selectedCoupon.set(coupon);
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

  /** Format discount value for display */
  formatDiscount(coupon: Coupon): string {
    if (coupon.discount_type === 'percentage') {
      return `${coupon.discount_value}% OFF`;
    }
    return `${this.formatPrice(coupon.discount_value, coupon.currency)} OFF`;
  }

  /** Proceed to Stripe checkout with coupon */
  proceedToCheckout(): void {
    const price = this.selectedPrice();
    const coupon = this.selectedCoupon();
    
    if (!price) {
      this.notificationService.error(this.messages.PRICE_REQUIRED);
      return;
    }

    if (!coupon) {
      this.notificationService.error('Please select a coupon');
      return;
    }

    this.processingCheckout.set(true);
    this.checkoutService.createCouponCheckoutSession(price.id, coupon.id).subscribe({
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

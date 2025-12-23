import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StripeSubscriptionPaymentIntentService } from '../../../../../core/services/stripe-subscription-payment-intent.service';
import { NotificationService } from '../../../../../core/services/notification.service';
import { SubscriptionProduct, SubscriptionPrice } from '../../../../../core/interfaces/subscription.interface';
import { Coupon } from '../../../../../core/interfaces/stripe.interface';
import { SUBSCRIPTION_PAYMENT_INTENT_MESSAGES } from '../../../../../core/constants/subscription-payment-intent-messages.constant';

/**
 * Demo 3: Subscription PaymentIntent with coupon discount
 */
@Component({
  selector: 'app-coupon-payment-intent',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './coupon-payment-intent.component.html',
  styleUrls: ['./coupon-payment-intent.component.scss']
})
export class CouponPaymentIntentComponent implements OnInit {
  private readonly paymentIntentService = inject(StripeSubscriptionPaymentIntentService);
  private readonly notificationService = inject(NotificationService);

  // State signals
  products = signal<SubscriptionProduct[]>([]);
  coupons = signal<Coupon[]>([]);
  selectedProduct = signal<SubscriptionProduct | null>(null);
  selectedPrice = signal<SubscriptionPrice | null>(null);
  selectedCoupon = signal<Coupon | null>(null);
  loading = signal(false);
  loadingCoupons = signal(false);
  processingPayment = signal(false);
  paymentStep = signal<'select' | 'payment'>('select');

  // Computed values
  hasProducts = computed(() => this.products().length > 0);
  hasCoupons = computed(() => this.coupons().length > 0);
  canProceed = computed(() => 
    this.selectedPrice() !== null && 
    this.selectedCoupon() !== null && 
    !this.processingPayment()
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

  readonly messages = SUBSCRIPTION_PAYMENT_INTENT_MESSAGES;

  ngOnInit(): void {
    this.loadProducts();
    this.loadCoupons();
  }

  /** Load subscription products */
  loadProducts(): void {
    this.loading.set(true);
    this.paymentIntentService.getCouponProducts().subscribe({
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

  /** Load available coupons */
  loadCoupons(): void {
    this.loadingCoupons.set(true);
    this.paymentIntentService.getCoupons().subscribe({
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

  /** Select a product */
  selectProduct(product: SubscriptionProduct): void {
    this.selectedProduct.set(product);
    const prices = product.prices || [];
    this.selectedPrice.set(prices.length > 0 ? prices[0] : null);
  }

  /** Select a price */
  selectPrice(price: SubscriptionPrice): void {
    this.selectedPrice.set(price);
  }

  /** Select a coupon */
  selectCoupon(coupon: Coupon): void {
    this.selectedCoupon.set(coupon);
  }

  /** Format price */
  formatPrice(amount: number, currency: string): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase()
    }).format(amount / 100);
  }

  /** Get interval label */
  getIntervalLabel(interval: string): string {
    return interval === 'month' ? this.messages.PER_MONTH : this.messages.PER_YEAR;
  }

  /** Format discount value */
  formatDiscount(coupon: Coupon): string {
    if (coupon.discount_type === 'percentage') {
      return `${coupon.discount_value}% OFF`;
    }
    return `${this.formatPrice(coupon.discount_value, coupon.currency)} OFF`;
  }

  /** Proceed to payment */
  proceedToPayment(): void {
    if (!this.selectedPrice() || !this.selectedCoupon()) {
      this.notificationService.error('Please select a plan and coupon');
      return;
    }
    this.paymentStep.set('payment');
  }

  /** Go back */
  goBack(): void {
    this.paymentStep.set('select');
  }

  /** Process payment */
  processPayment(): void {
    const price = this.selectedPrice();
    const coupon = this.selectedCoupon();
    if (!price || !coupon) return;

    this.processingPayment.set(true);

    this.paymentIntentService.createCouponSetupIntent(price.id, coupon.id).subscribe({
      next: (response) => {
        if (response.success) {
          this.notificationService.success('Setup intent created with coupon.');
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

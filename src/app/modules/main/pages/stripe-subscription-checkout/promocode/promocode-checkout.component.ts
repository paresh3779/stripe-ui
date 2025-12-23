import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StripeSubscriptionCheckoutService } from '../../../../../core/services/stripe-subscription-checkout.service';
import { NotificationService } from '../../../../../core/services/notification.service';
import { SubscriptionProduct, SubscriptionPrice, PromoCodeValidation } from '../../../../../core/interfaces/subscription.interface';
import { SUBSCRIPTION_MESSAGES, SUBSCRIPTION_VALIDATION } from '../../../../../core/constants/subscription-messages.constant';

/**
 * Demo 4: Subscription checkout with promo code
 * Allows users to enter and validate a promo code for discount
 */
@Component({
  selector: 'app-promocode-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './promocode-checkout.component.html',
  styleUrls: ['./promocode-checkout.component.scss']
})
export class PromocodeCheckoutComponent implements OnInit {
  private readonly checkoutService = inject(StripeSubscriptionCheckoutService);
  private readonly notificationService = inject(NotificationService);

  // State signals
  products = signal<SubscriptionProduct[]>([]);
  selectedProduct = signal<SubscriptionProduct | null>(null);
  selectedPrice = signal<SubscriptionPrice | null>(null);
  promoCode = signal('');
  validatedPromo = signal<PromoCodeValidation | null>(null);
  loading = signal(false);
  validatingPromo = signal(false);
  processingCheckout = signal(false);

  // Computed values
  hasProducts = computed(() => this.products().length > 0);
  isPromoValid = computed(() => this.validatedPromo()?.valid === true);
  canValidatePromo = computed(() => 
    this.promoCode().length >= SUBSCRIPTION_VALIDATION.PROMO_CODE_MIN_LENGTH && 
    !this.validatingPromo()
  );
  canCheckout = computed(() => 
    this.selectedPrice() !== null && 
    this.isPromoValid() && 
    !this.processingCheckout()
  );

  /** Calculate discounted price */
  discountedAmount = computed(() => {
    const price = this.selectedPrice();
    const promo = this.validatedPromo();
    if (!price || !promo?.coupon) return null;

    const coupon = promo.coupon;
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
  }

  /** Load subscription products from API */
  loadProducts(): void {
    this.loading.set(true);
    this.checkoutService.getPromoCodeProducts().subscribe({
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

  /** Update promo code input */
  updatePromoCode(value: string): void {
    this.promoCode.set(value.toUpperCase());
    this.validatedPromo.set(null);
  }

  /** Validate the entered promo code */
  validatePromoCode(): void {
    const code = this.promoCode();
    if (!code || code.length < SUBSCRIPTION_VALIDATION.PROMO_CODE_MIN_LENGTH) {
      this.notificationService.error('Please enter a valid promo code');
      return;
    }

    this.validatingPromo.set(true);
    this.checkoutService.validatePromoCode(code).subscribe({
      next: (response) => {
        if (response.success && response.data.valid) {
          this.validatedPromo.set(response.data);
          this.notificationService.success(this.messages.PROMO_CODE_VALID);
        } else {
          this.validatedPromo.set(null);
          this.notificationService.error(this.messages.PROMO_CODE_INVALID);
        }
        this.validatingPromo.set(false);
      },
      error: () => {
        this.validatedPromo.set(null);
        this.notificationService.error(this.messages.PROMO_CODE_INVALID);
        this.validatingPromo.set(false);
      }
    });
  }

  /** Clear validated promo code */
  clearPromoCode(): void {
    this.promoCode.set('');
    this.validatedPromo.set(null);
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
  formatDiscount(): string {
    const promo = this.validatedPromo();
    if (!promo?.coupon) return '';
    
    const coupon = promo.coupon;
    if (coupon.discount_type === 'percentage') {
      return `${coupon.discount_value}% OFF`;
    }
    return `${this.formatPrice(coupon.discount_value, coupon.currency)} OFF`;
  }

  /** Proceed to Stripe checkout with promo code */
  proceedToCheckout(): void {
    const price = this.selectedPrice();
    const code = this.promoCode();
    
    if (!price) {
      this.notificationService.error(this.messages.PRICE_REQUIRED);
      return;
    }

    if (!this.isPromoValid()) {
      this.notificationService.error('Please validate your promo code first');
      return;
    }

    this.processingCheckout.set(true);
    this.checkoutService.createPromoCodeCheckoutSession(price.id, code).subscribe({
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

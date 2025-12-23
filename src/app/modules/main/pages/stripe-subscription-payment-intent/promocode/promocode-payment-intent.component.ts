import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StripeSubscriptionPaymentIntentService } from '../../../../../core/services/stripe-subscription-payment-intent.service';
import { NotificationService } from '../../../../../core/services/notification.service';
import { SubscriptionProduct, SubscriptionPrice } from '../../../../../core/interfaces/subscription.interface';
import { PromoCodeValidationResponse } from '../../../../../core/interfaces/subscription-payment-intent.interface';
import { SUBSCRIPTION_PAYMENT_INTENT_MESSAGES } from '../../../../../core/constants/subscription-payment-intent-messages.constant';

/**
 * Demo 4: Subscription PaymentIntent with promo code
 */
@Component({
  selector: 'app-promocode-payment-intent',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './promocode-payment-intent.component.html',
  styleUrls: ['./promocode-payment-intent.component.scss']
})
export class PromocodePaymentIntentComponent implements OnInit {
  private readonly paymentIntentService = inject(StripeSubscriptionPaymentIntentService);
  private readonly notificationService = inject(NotificationService);

  // State signals
  products = signal<SubscriptionProduct[]>([]);
  selectedProduct = signal<SubscriptionProduct | null>(null);
  selectedPrice = signal<SubscriptionPrice | null>(null);
  promoCode = signal('');
  validatedPromo = signal<PromoCodeValidationResponse | null>(null);
  loading = signal(false);
  validatingPromo = signal(false);
  processingPayment = signal(false);
  paymentStep = signal<'select' | 'payment'>('select');

  // Computed values
  hasProducts = computed(() => this.products().length > 0);
  isPromoValid = computed(() => this.validatedPromo()?.valid === true);
  canValidatePromo = computed(() => this.promoCode().length >= 3 && !this.validatingPromo());
  canProceed = computed(() => 
    this.selectedPrice() !== null && 
    this.isPromoValid() && 
    !this.processingPayment()
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

  readonly messages = SUBSCRIPTION_PAYMENT_INTENT_MESSAGES;

  ngOnInit(): void {
    this.loadProducts();
  }

  /** Load products */
  loadProducts(): void {
    this.loading.set(true);
    this.paymentIntentService.getPromoCodeProducts().subscribe({
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

  /** Update promo code */
  updatePromoCode(value: string): void {
    this.promoCode.set(value.toUpperCase());
    this.validatedPromo.set(null);
  }

  /** Validate promo code */
  validatePromoCode(): void {
    const code = this.promoCode();
    if (code.length < 3) return;

    this.validatingPromo.set(true);
    this.paymentIntentService.validatePromoCode(code).subscribe({
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

  /** Clear promo code */
  clearPromoCode(): void {
    this.promoCode.set('');
    this.validatedPromo.set(null);
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

  /** Format discount */
  formatDiscount(): string {
    const promo = this.validatedPromo();
    if (!promo?.coupon) return '';
    const coupon = promo.coupon;
    if (coupon.discount_type === 'percentage') {
      return `${coupon.discount_value}% OFF`;
    }
    return `${this.formatPrice(coupon.discount_value, coupon.currency)} OFF`;
  }

  /** Proceed to payment */
  proceedToPayment(): void {
    if (!this.selectedPrice() || !this.isPromoValid()) {
      this.notificationService.error('Please select a plan and validate promo code');
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
    const code = this.promoCode();
    if (!price || !code) return;

    this.processingPayment.set(true);

    this.paymentIntentService.createPromoCodeSetupIntent(price.id, code).subscribe({
      next: (response) => {
        if (response.success) {
          this.notificationService.success('Setup intent created with promo code.');
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

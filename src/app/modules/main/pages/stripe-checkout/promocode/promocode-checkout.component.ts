import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StripeCheckoutService } from '../../../../../core/services/stripe-checkout.service';
import { Product, Price, PromoCode, Coupon } from '../../../../../core/interfaces/stripe.interface';
import { NotificationService } from '../../../../../core/services/notification.service';

@Component({
  selector: 'app-promocode-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './promocode-checkout.component.html',
  styleUrls: ['./promocode-checkout.component.scss']
})
export class PromocodeCheckoutComponent implements OnInit {
  private readonly checkoutService = inject(StripeCheckoutService);
  private readonly notificationService = inject(NotificationService);

  // Signals
  products = signal<Product[]>([]);
  selectedProduct = signal<Product | null>(null);
  selectedPrice = signal<Price | null>(null);
  promoCode = signal('');
  validatedPromoCode = signal<PromoCode | null>(null);
  validatedCoupon = signal<Coupon | null>(null);
  loading = signal(false);
  validatingPromoCode = signal(false);
  processingCheckout = signal(false);

  // Computed signals
  hasProducts = computed(() => this.products().length > 0);
  isPromoCodeValid = computed(() => this.validatedPromoCode() !== null);
  canValidatePromoCode = computed(() => this.promoCode().trim().length > 0 && !this.validatingPromoCode());
  canCheckout = computed(() => this.selectedPrice() !== null && this.isPromoCodeValid() && !this.processingCheckout());
  
  discountAmount = computed(() => {
    const price = this.selectedPrice();
    const coupon = this.validatedCoupon();
    if (!price || !coupon) return 0;
    
    if (coupon.discount_type === 'percentage') {
      return (price.amount * coupon.discount_value) / 100;
    }
    return coupon.discount_value * 100;
  });
  
  totalAmount = computed(() => {
    const price = this.selectedPrice();
    if (!price) return 0;
    return Math.max(0, price.amount - this.discountAmount());
  });

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading.set(true);
    this.checkoutService.getProductsWithPromoCode().subscribe({
      next: (response) => {
        if (response.success) {
          this.products.set(response.data);
        }
        this.loading.set(false);
      },
      error: (error) => {
        console.error('API Error:', error);
        this.notificationService.error('Failed to load products');
        this.loading.set(false);
      }
    });
  }

  selectProduct(product: Product): void {
    this.selectedProduct.set(product);
    this.selectedPrice.set(product.prices && product.prices.length > 0 ? product.prices[0] : null);
  }

  selectPrice(price: Price): void {
    this.selectedPrice.set(price);
  }

  validatePromoCode(): void {
    const code = this.promoCode().trim();
    if (!code) {
      this.notificationService.error('Please enter a promo code');
      return;
    }

    this.validatingPromoCode.set(true);
    this.checkoutService.validatePromoCode(code).subscribe({
      next: (response) => {
        if (response.success && response.data.valid) {
          this.validatedPromoCode.set(response.data.promoCode);
          this.validatedCoupon.set(response.data.coupon);
          this.notificationService.success('Promo code applied successfully!');
        } else {
          this.notificationService.error('Invalid promo code');
        }
        this.validatingPromoCode.set(false);
      },
      error: (error) => {
        this.notificationService.error('Failed to validate promo code');
        this.validatingPromoCode.set(false);
      }
    });
  }

  removePromoCode(): void {
    this.promoCode.set('');
    this.validatedPromoCode.set(null);
    this.validatedCoupon.set(null);
  }

  formatPrice(amount: number, currency: string): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase()
    }).format(amount / 100);
  }

  proceedToCheckout(): void {
    const price = this.selectedPrice();
    const promoCode = this.validatedPromoCode();
    
    if (!price) {
      this.notificationService.error('Please select a product and price');
      return;
    }

    if (!promoCode) {
      this.notificationService.error('Please apply a valid promo code');
      return;
    }

    this.processingCheckout.set(true);
    this.checkoutService.createCheckoutSessionWithPromoCode(
      price.id,
      promoCode.code
    ).subscribe({
      next: (response) => {
        if (response.success && response.data.url) {
          window.location.href = response.data.url;
        }
        this.processingCheckout.set(false);
      },
      error: (error) => {
        this.notificationService.error('Failed to create checkout session');
        this.processingCheckout.set(false);
      }
    });
  }
}

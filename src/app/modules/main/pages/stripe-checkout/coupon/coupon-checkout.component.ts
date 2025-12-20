import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StripeCheckoutService } from '../../../../../core/services/stripe-checkout.service';
import { Product, Price, Coupon } from '../../../../../core/interfaces/stripe.interface';
import { NotificationService } from '../../../../../core/services/notification.service';

@Component({
  selector: 'app-coupon-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './coupon-checkout.component.html',
  styleUrls: ['./coupon-checkout.component.scss']
})
export class CouponCheckoutComponent implements OnInit {
  private readonly checkoutService = inject(StripeCheckoutService);
  private readonly notificationService = inject(NotificationService);

  // Signals
  products = signal<Product[]>([]);
  coupons = signal<Coupon[]>([]);
  selectedProduct = signal<Product | null>(null);
  selectedPrice = signal<Price | null>(null);
  selectedCoupon = signal<Coupon | null>(null);
  loading = signal(false);
  loadingCoupons = signal(false);
  processingCheckout = signal(false);

  // Computed signals
  hasProducts = computed(() => this.products().length > 0);
  hasCoupons = computed(() => this.coupons().length > 0);
  isCouponSelected = computed(() => this.selectedCoupon() !== null);
  canCheckout = computed(() => this.selectedPrice() !== null && this.isCouponSelected() && !this.processingCheckout());
  
  discountAmount = computed(() => {
    const price = this.selectedPrice();
    const coupon = this.selectedCoupon();
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
    this.loadCoupons();
  }

  loadProducts(): void {
    this.loading.set(true);
    this.checkoutService.getProductsWithCoupon().subscribe({
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

  loadCoupons(): void {
    this.loadingCoupons.set(true);
    this.checkoutService.getCoupons().subscribe({
      next: (response) => {
        if (response.success) {
          this.coupons.set(response.data);
        }
        this.loadingCoupons.set(false);
      },
      error: (error) => {
        console.error('Coupons API Error:', error);
        this.notificationService.error('Failed to load coupons');
        this.loadingCoupons.set(false);
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

  selectCoupon(coupon: Coupon): void {
    this.selectedCoupon.set(coupon);
  }

  formatPrice(amount: number, currency: string): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase()
    }).format(amount / 100);
  }

  getDiscountLabel(coupon: Coupon): string {
    if (coupon.discount_type === 'percentage') {
      return `${coupon.discount_value}% OFF`;
    } else {
      return `${this.formatPrice(coupon.discount_value, coupon.currency)} OFF`;
    }
  }

  proceedToCheckout(): void {
    const price = this.selectedPrice();
    const coupon = this.selectedCoupon();
    
    if (!price) {
      this.notificationService.error('Please select a product and price');
      return;
    }

    if (!coupon) {
      this.notificationService.error('Please select a coupon');
      return;
    }

    this.processingCheckout.set(true);
    this.checkoutService.createCheckoutSessionWithCoupon(
      price.id,
      coupon.id
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

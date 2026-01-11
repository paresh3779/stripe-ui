import { Component, OnInit, inject, signal, computed, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { StripeCheckoutService } from '../../../../../core/services/stripe-checkout.service';
import { Product, Price, CheckoutSessionVerification } from '../../../../../core/interfaces/stripe.interface';
import { NotificationService } from '../../../../../core/services/notification.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

/** Basic Stripe checkout component (no promo codes/coupons) */
@Component({
  selector: 'app-basic-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './basic-checkout.component.html',
  styleUrls: ['./basic-checkout.component.scss']
})
export class BasicCheckoutComponent implements OnInit {
  private readonly checkoutService = inject(StripeCheckoutService);
  private readonly notificationService = inject(NotificationService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private destroyRef = inject(DestroyRef);

  // State
  products = signal<Product[]>([]);
  selectedProduct = signal<Product | null>(null);
  selectedPrice = signal<Price | null>(null);
  loading = signal(false);
  processingCheckout = signal(false);

  // Payment status state
  paymentStatus = signal<'idle' | 'success' | 'cancelled' | 'verifying' | 'error'>('idle');
  sessionVerification = signal<CheckoutSessionVerification | null>(null);
  verificationError = signal<string | null>(null);

  // Computed
  hasProducts = computed(() => this.products().length > 0);
  readonly canCheckout = computed(() => this.selectedPrice() !== null && !this.processingCheckout());
  readonly showPaymentResult = computed(() => this.paymentStatus() !== 'idle');

  ngOnInit(): void {
    this.checkPaymentStatus();
    this.loadProducts();
  }

  /** Check URL params for payment status and verify session if needed */
  private checkPaymentStatus(): void {
    this.route.queryParams
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(params => {
        const status = params['status'];
        const sessionId = params['session_id'];

        if (status === 'success' && sessionId) {
          this.verifySession(sessionId);
        } else if (status === 'cancelled') {
          this.paymentStatus.set('cancelled');
          this.notificationService.info('Payment was cancelled');
        }
      });
  }

  /** Verify checkout session with backend */
  private verifySession(sessionId: string): void {
    this.paymentStatus.set('verifying');
    
    this.checkoutService.verifySession(sessionId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          if (response.success && response.data.is_complete) {
            this.sessionVerification.set(response.data);
            this.paymentStatus.set('success');
            this.notificationService.success('Payment completed successfully!');
          } else if (response.success && !response.data.is_complete) {
            this.verificationError.set('Payment is still processing. Please check back later.');
            this.paymentStatus.set('error');
          } else {
            this.verificationError.set('Could not verify payment status');
            this.paymentStatus.set('error');
          }
        },
        error: (error) => {
          this.verificationError.set(error.error?.message || 'Failed to verify payment');
          this.paymentStatus.set('error');
          this.notificationService.error('Failed to verify payment status');
        }
      });
  }

  /** Clear payment status and return to shopping */
  clearPaymentStatus(): void {
    this.paymentStatus.set('idle');
    this.sessionVerification.set(null);
    this.verificationError.set(null);
    // Clear URL params
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {}
    });
  }

  /** Load available products from API */
  loadProducts(): void {
    this.loading.set(true);
    this.checkoutService.getProducts()
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe({
      next: (response) => {
        if (response.success) {
          this.products.set(response.data);
        } else {
          console.error('API returned success=false');
        }
        this.loading.set(false);
      },
      error: (error) => {
        this.notificationService.error('Failed to load products');
        this.loading.set(false);
      }
    });
  }

  /** Select product and auto-select first price */
  selectProduct(product: Product): void {
    this.selectedProduct.set(product);
    this.selectedPrice.set(product.prices && product.prices.length > 0 ? product.prices[0] : null);
  }

  /** Select pricing option */
  selectPrice(price: Price): void {
    this.selectedPrice.set(price);
  }

  /** Format price amount (in cents) to currency string */
  formatPrice(amount: number, currency: string): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase()
    }).format(amount / 100);
  }

  /** Create checkout session and redirect to Stripe */
  proceedToCheckout(): void {
    const price = this.selectedPrice();
    
    if (!price) {
      this.notificationService.error('Please select a product and price');
      return;
    }

    this.processingCheckout.set(true);
    this.checkoutService.createCheckoutSession(price.id)
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe({
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

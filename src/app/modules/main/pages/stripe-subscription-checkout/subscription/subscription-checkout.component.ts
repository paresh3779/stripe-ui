import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StripeSubscriptionCheckoutService } from '../../../../../core/services/stripe-subscription-checkout.service';
import { NotificationService } from '../../../../../core/services/notification.service';
import { SubscriptionProduct, SubscriptionPrice, UserSubscription, UserInvoice } from '../../../../../core/interfaces/subscription.interface';
import { SUBSCRIPTION_MESSAGES } from '../../../../../core/constants/subscription-messages.constant';

/**
 * Demo 1: Subscription checkout with full management
 * - Display subscription products
 * - Checkout flow
 * - User's subscriptions list
 * - Cancel/refund within 7 days
 * - Invoice management
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

  // State signals - Products
  products = signal<SubscriptionProduct[]>([]);
  selectedProduct = signal<SubscriptionProduct | null>(null);
  selectedPrice = signal<SubscriptionPrice | null>(null);
  selectedInterval = signal<'month' | 'year'>('month');
  loading = signal(false);
  processingCheckout = signal(false);

  // State signals - Subscriptions & Invoices
  subscriptions = signal<UserSubscription[]>([]);
  invoices = signal<UserInvoice[]>([]);
  loadingSubscriptions = signal(false);
  loadingInvoices = signal(false);
  cancellingSubscription = signal<string | null>(null);

  // UI state
  activeTab = signal<'products' | 'subscriptions' | 'invoices'>('products');

  // Computed values
  hasProducts = computed(() => this.products().length > 0);
  hasSubscriptions = computed(() => this.subscriptions().length > 0);
  hasInvoices = computed(() => this.invoices().length > 0);
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

  /** Get active subscriptions count */
  activeSubscriptionsCount = computed(() => 
    this.subscriptions().filter(s => s.status === 'active' || s.status === 'trialing').length
  );

  readonly messages = SUBSCRIPTION_MESSAGES;

  ngOnInit(): void {
    this.loadProducts();
    this.loadSubscriptions();
    this.loadInvoices();
  }

  /** Switch between tabs */
  setActiveTab(tab: 'products' | 'subscriptions' | 'invoices'): void {
    this.activeTab.set(tab);
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

  /** Load user's subscriptions */
  loadSubscriptions(): void {
    this.loadingSubscriptions.set(true);
    this.checkoutService.getUserSubscriptions().subscribe({
      next: (response) => {
        if (response.success) {
          this.subscriptions.set(response.data);
        }
        this.loadingSubscriptions.set(false);
      },
      error: () => {
        this.loadingSubscriptions.set(false);
      }
    });
  }

  /** Load user's invoices */
  loadInvoices(): void {
    this.loadingInvoices.set(true);
    this.checkoutService.getUserInvoices().subscribe({
      next: (response) => {
        if (response.success) {
          this.invoices.set(response.data);
        }
        this.loadingInvoices.set(false);
      },
      error: () => {
        this.loadingInvoices.set(false);
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

  // ==================== Subscription Management ====================

  /** Cancel subscription (at period end) */
  cancelSubscription(subscription: UserSubscription): void {
    if (!confirm('Are you sure you want to cancel this subscription? You will continue to have access until the end of your billing period.')) {
      return;
    }

    this.cancellingSubscription.set(subscription.id);
    this.checkoutService.cancelSubscription(subscription.id, false).subscribe({
      next: (response) => {
        if (response.success) {
          this.notificationService.success('Subscription will be cancelled at the end of the billing period.');
          this.loadSubscriptions();
        }
        this.cancellingSubscription.set(null);
      },
      error: (error) => {
        this.notificationService.error(error.error?.message || 'Failed to cancel subscription');
        this.cancellingSubscription.set(null);
      }
    });
  }

  /** Cancel subscription immediately with refund (within 7 days) */
  cancelWithRefund(subscription: UserSubscription): void {
    if (!subscription.can_refund) {
      this.notificationService.error('This subscription is no longer eligible for refund. Refunds are only available within 7 days of purchase.');
      return;
    }

    if (!confirm(`Are you sure you want to cancel and request a refund? This will immediately revoke your access and process a refund.`)) {
      return;
    }

    this.cancellingSubscription.set(subscription.id);
    this.checkoutService.cancelSubscription(subscription.id, true).subscribe({
      next: (response) => {
        if (response.success) {
          const refundMsg = response.data.refund?.success 
            ? ` Refund of ${this.formatPrice(response.data.refund.amount || 0, response.data.refund.currency || 'usd')} has been processed.`
            : '';
          this.notificationService.success('Subscription cancelled successfully.' + refundMsg);
          this.loadSubscriptions();
          this.loadInvoices();
        }
        this.cancellingSubscription.set(null);
      },
      error: (error) => {
        this.notificationService.error(error.error?.message || 'Failed to cancel subscription');
        this.cancellingSubscription.set(null);
      }
    });
  }

  /** Check if cancellation is in progress for a subscription */
  isCancelling(subscriptionId: string): boolean {
    return this.cancellingSubscription() === subscriptionId;
  }

  // ==================== Invoice Management ====================

  /** Download invoice PDF */
  downloadInvoicePdf(invoice: UserInvoice): void {
    if (invoice.invoice_pdf) {
      window.open(invoice.invoice_pdf, '_blank');
    } else {
      this.checkoutService.downloadInvoice(invoice.id).subscribe({
        next: (response) => {
          if (response.success && response.data.pdf_url) {
            window.open(response.data.pdf_url, '_blank');
          }
        },
        error: () => {
          this.notificationService.error('Failed to download invoice');
        }
      });
    }
  }

  /** View invoice in Stripe hosted page */
  viewInvoice(invoice: UserInvoice): void {
    if (invoice.hosted_invoice_url) {
      window.open(invoice.hosted_invoice_url, '_blank');
    }
  }

  // ==================== Utility Methods ====================

  /** Get status badge class */
  getStatusBadgeClass(status: string): string {
    const statusClasses: Record<string, string> = {
      'active': 'bg-success',
      'trialing': 'bg-info',
      'past_due': 'bg-warning',
      'canceled': 'bg-secondary',
      'unpaid': 'bg-danger',
      'incomplete': 'bg-warning',
      'incomplete_expired': 'bg-danger',
      'paused': 'bg-secondary',
      'paid': 'bg-success',
      'open': 'bg-warning',
      'draft': 'bg-secondary',
      'void': 'bg-dark',
      'uncollectible': 'bg-danger'
    };
    return statusClasses[status] || 'bg-secondary';
  }

  /** Format date for display */
  formatDate(dateString: string | null): string {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
}

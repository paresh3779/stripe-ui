import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StripeCheckoutService, Product, Price } from '../../../../../core/services/stripe-checkout.service';
import { NotificationService } from '../../../../../core/services/notification.service';

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

  // Signals for reactive state management
  products = signal<Product[]>([]);
  selectedProduct = signal<Product | null>(null);
  selectedPrice = signal<Price | null>(null);
  loading = signal(false);
  processingCheckout = signal(false);

  // Computed signals
  hasProducts = computed(() => this.products().length > 0);
  canCheckout = computed(() => this.selectedPrice() !== null && !this.processingCheckout());

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading.set(true);
    this.checkoutService.getProducts().subscribe({
      next: (response) => {
        console.log('API Response:', response);
        if (response.success) {
          this.products.set(response.data);
          console.log('Products loaded:', this.products());
          console.log('First product details:', this.products()[0]);
          console.log('First product has prices?', this.products()[0]?.prices);
        } else {
          console.error('API returned success=false');
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

  formatPrice(amount: number, currency: string): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase()
    }).format(amount / 100);
  }

  proceedToCheckout(): void {
    const price = this.selectedPrice();
    if (!price) {
      this.notificationService.error('Please select a product and price');
      return;
    }

    this.processingCheckout.set(true);
    this.checkoutService.createCheckoutSession(price.id).subscribe({
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

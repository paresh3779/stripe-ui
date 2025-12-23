import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface OrderSummaryItem {
  label: string;
  amount: number;
  isDiscount?: boolean;
}

/**
 * Reusable order summary component for Stripe demos
 * Displays pricing breakdown with checkout button
 */
@Component({
  selector: 'app-order-summary',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card" [class.border-success]="variant === 'success'">
      <div class="card-header" 
           [class.bg-success]="variant === 'success'"
           [class.text-white]="variant === 'success'">
        <h5 class="mb-0">{{ title }}</h5>
      </div>
      <div class="card-body">
        <table class="table table-borderless mb-3">
          <tbody>
            @for (item of items; track item.label) {
              <tr [class.text-success]="item.isDiscount">
                <td>{{ item.label }}</td>
                <td class="text-end">
                  {{ item.isDiscount ? '-' : '' }}{{ formatPrice(item.amount) }}
                </td>
              </tr>
            }
            <tr class="border-top">
              <td><strong>Total</strong></td>
              <td class="text-end">
                <strong class="h5">{{ formatPrice(totalAmount) }}</strong>
                @if (intervalLabel) {
                  <span class="text-muted">{{ intervalLabel }}</span>
                }
              </td>
            </tr>
          </tbody>
        </table>

        <div class="d-grid">
          <button class="btn btn-lg"
                  [class.btn-primary]="!variant"
                  [class.btn-success]="variant === 'success'"
                  [disabled]="isProcessing || disabled"
                  (click)="onCheckout.emit()">
            @if (isProcessing) {
              <span class="spinner-border spinner-border-sm me-2" role="status"></span>
              {{ processingText }}
            } @else {
              {{ buttonText }}
            }
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .table-borderless td { padding: 0.5rem 0; }
  `]
})
export class OrderSummaryComponent {
  @Input() title = 'Order Summary';
  @Input() items: OrderSummaryItem[] = [];
  @Input() totalAmount = 0;
  @Input() intervalLabel = '';
  @Input() currency = 'usd';
  @Input() buttonText = 'Proceed to Checkout';
  @Input() processingText = 'Processing...';
  @Input() isProcessing = false;
  @Input() disabled = false;
  @Input() variant: 'primary' | 'success' | null = null;

  @Output() onCheckout = new EventEmitter<void>();

  formatPrice(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: this.currency.toUpperCase()
    }).format(amount / 100);
  }
}

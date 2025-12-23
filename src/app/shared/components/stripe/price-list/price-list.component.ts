import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface PriceItem {
  id: string;
  amount: number;
  currency: string;
  description?: string;
  interval?: string;
  trial_days?: number;
  features?: string[];
}

/**
 * Reusable price list component for Stripe demos
 * Displays a list of prices with selection capability
 */
@Component({
  selector: 'app-price-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="list-group">
      @for (price of prices; track price.id) {
        <button type="button" 
                class="list-group-item list-group-item-action"
                [class.active]="selectedPriceId === price.id"
                (click)="onPriceSelect.emit(price)">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <strong>{{ price.description || 'Standard Plan' }}</strong>
              @if (showInterval && price.interval) {
                <p class="mb-0 small text-muted">{{ price.interval === 'month' ? 'Monthly' : 'Yearly' }} billing</p>
              }
              @if (showTrialBadge && price.trial_days) {
                <span class="badge bg-success me-2">{{ formatTrialDays(price.trial_days) }} FREE</span>
              }
              @if (price.features && price.features.length > 0) {
                <ul class="mb-0 mt-1 small">
                  @for (feature of price.features; track feature) {
                    <li>{{ feature }}</li>
                  }
                </ul>
              }
            </div>
            <span class="badge rounded-pill" 
                  [class.bg-primary]="!variant"
                  [class.bg-success]="variant === 'success'">
              {{ formatPrice(price.amount, price.currency) }}{{ getIntervalLabel(price.interval) }}
            </span>
          </div>
        </button>
      }
    </div>
  `,
  styles: [`
    .list-group-item.active {
      background-color: var(--bs-primary);
      border-color: var(--bs-primary);
    }
    :host-context(.variant-success) .list-group-item.active {
      background-color: var(--bs-success);
      border-color: var(--bs-success);
    }
  `]
})
export class PriceListComponent {
  @Input() prices: PriceItem[] = [];
  @Input() selectedPriceId: string | null = null;
  @Input() showInterval = true;
  @Input() showTrialBadge = false;
  @Input() variant: 'primary' | 'success' | null = null;

  @Output() onPriceSelect = new EventEmitter<PriceItem>();

  formatPrice(amount: number, currency: string): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase()
    }).format(amount / 100);
  }

  getIntervalLabel(interval?: string): string {
    if (!interval) return '';
    return interval === 'month' ? '/month' : '/year';
  }

  formatTrialDays(days: number): string {
    if (days === 1) return '1 day';
    if (days === 7) return '1 week';
    if (days === 14) return '2 weeks';
    if (days === 30) return '1 month';
    return `${days} days`;
  }
}

import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Reusable product card component for Stripe demos
 * Displays product info with selection capability
 */
@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card h-100" 
         [class.border-primary]="isSelected && !variant"
         [class.border-success]="isSelected && variant === 'success'"
         [class.shadow]="isSelected">
      @if (headerText) {
        <div class="card-header text-white text-center"
             [class.bg-primary]="!variant"
             [class.bg-success]="variant === 'success'"
             [class.bg-warning]="variant === 'warning'">
          {{ headerText }}
        </div>
      }
      <div class="card-body">
        <h5 class="card-title">{{ name }}</h5>
        <p class="card-text text-muted">{{ description }}</p>
        
        <div class="mb-3">
          @if (showOriginalPrice && originalPrice) {
            <span class="text-decoration-line-through text-muted me-2">
              {{ formatPrice(originalPrice) }}
            </span>
          }
          <span class="h4" [class.text-primary]="!variant" [class.text-success]="variant === 'success'">
            {{ formatPrice(displayPrice) }}
          </span>
          @if (priceLabel) {
            <span class="text-muted">{{ priceLabel }}</span>
          }
        </div>

        @if (subText) {
          <p class="small text-muted mb-3">{{ subText }}</p>
        }

        <button class="btn w-100"
                [class.btn-primary]="!isSelected && !variant"
                [class.btn-outline-primary]="isSelected && !variant"
                [class.btn-success]="!isSelected && variant === 'success'"
                [class.btn-outline-success]="isSelected && variant === 'success'"
                (click)="onSelect.emit()">
          {{ isSelected ? 'Selected' : buttonText }}
        </button>
      </div>
    </div>
  `,
  styles: [`
    .card {
      transition: all 0.2s ease-in-out;
      cursor: pointer;
      &:hover { transform: translateY(-2px); }
      &.border-primary, &.border-success { border-width: 2px; }
    }
  `]
})
export class ProductCardComponent {
  @Input() name = '';
  @Input() description = '';
  @Input() displayPrice = 0;
  @Input() originalPrice?: number;
  @Input() showOriginalPrice = false;
  @Input() priceLabel = '';
  @Input() subText = '';
  @Input() headerText = '';
  @Input() buttonText = 'Select Plan';
  @Input() isSelected = false;
  @Input() variant: 'primary' | 'success' | 'warning' | null = null;
  @Input() currency = 'usd';

  @Output() onSelect = new EventEmitter<void>();

  formatPrice(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: this.currency.toUpperCase()
    }).format(amount / 100);
  }
}

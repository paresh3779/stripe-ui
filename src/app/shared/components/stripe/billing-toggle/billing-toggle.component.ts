import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Reusable billing interval toggle component
 */
@Component({
  selector: 'app-billing-toggle',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="mb-4">
      <label class="form-label fw-bold">{{ label }}</label>
      <div class="btn-group w-100" role="group">
        <button type="button" 
                class="btn"
                [class.btn-primary]="selectedInterval === 'month'"
                [class.btn-outline-primary]="selectedInterval !== 'month'"
                (click)="onIntervalChange.emit('month')">
          {{ monthlyLabel }}
        </button>
        <button type="button" 
                class="btn"
                [class.btn-primary]="selectedInterval === 'year'"
                [class.btn-outline-primary]="selectedInterval !== 'year'"
                (click)="onIntervalChange.emit('year')">
          {{ yearlyLabel }}
          @if (showSaveBadge) {
            <span class="badge bg-success ms-1">Save</span>
          }
        </button>
      </div>
    </div>
  `,
  styles: [`
    .btn-group .btn { flex: 1; }
  `]
})
export class BillingToggleComponent {
  @Input() label = 'Billing Cycle';
  @Input() monthlyLabel = 'Monthly';
  @Input() yearlyLabel = 'Yearly';
  @Input() selectedInterval: 'month' | 'year' = 'month';
  @Input() showSaveBadge = true;

  @Output() onIntervalChange = new EventEmitter<'month' | 'year'>();
}

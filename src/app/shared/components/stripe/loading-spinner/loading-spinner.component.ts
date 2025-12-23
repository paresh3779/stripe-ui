import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Reusable loading spinner component
 */
@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="text-center py-5">
      <div class="spinner-border" [class.text-primary]="!variant" [class.text-success]="variant === 'success'" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      @if (message) {
        <p class="mt-2 text-muted">{{ message }}</p>
      }
    </div>
  `
})
export class LoadingSpinnerComponent {
  @Input() message = '';
  @Input() variant: 'primary' | 'success' | null = null;
}

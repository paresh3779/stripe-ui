import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

/**
 * Reusable promo code input component
 */
@Component({
  selector: 'app-promo-code-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="card">
      <div class="card-header bg-info text-white">
        <h5 class="mb-0">{{ title }}</h5>
      </div>
      <div class="card-body">
        <div class="input-group mb-3">
          <input type="text" 
                 class="form-control form-control-lg promo-input" 
                 [value]="code"
                 (input)="onCodeChange.emit($any($event.target).value.toUpperCase())"
                 [placeholder]="placeholder"
                 [disabled]="isValid"
                 [class.is-valid]="isValid"
                 [class.is-invalid]="isInvalid">
          @if (!isValid) {
            <button class="btn btn-info" 
                    [disabled]="!canValidate || isValidating"
                    (click)="onValidate.emit()">
              @if (isValidating) {
                <span class="spinner-border spinner-border-sm"></span>
              } @else {
                Apply
              }
            </button>
          } @else {
            <button class="btn btn-outline-danger" (click)="onClear.emit()">
              Clear
            </button>
          }
        </div>

        @if (isValid && validatedLabel) {
          <div class="alert alert-success mb-0">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <strong>{{ code }}</strong>
                @if (description) {
                  <p class="mb-0 small">{{ description }}</p>
                }
              </div>
              <span class="badge bg-success fs-6">{{ discountLabel }}</span>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .promo-input {
      text-transform: uppercase;
      letter-spacing: 2px;
      font-weight: bold;
    }
  `]
})
export class PromoCodeInputComponent {
  @Input() title = 'Enter Promo Code';
  @Input() placeholder = 'PROMO CODE';
  @Input() code = '';
  @Input() isValid = false;
  @Input() isInvalid = false;
  @Input() isValidating = false;
  @Input() canValidate = false;
  @Input() validatedLabel = '';
  @Input() description = '';
  @Input() discountLabel = '';

  @Output() onCodeChange = new EventEmitter<string>();
  @Output() onValidate = new EventEmitter<void>();
  @Output() onClear = new EventEmitter<void>();
}

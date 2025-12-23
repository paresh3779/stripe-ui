import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';

/**
 * Success page displayed after successful subscription checkout
 * Shows confirmation message and session details
 */
@Component({
  selector: 'app-subscription-success',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './subscription-success.component.html',
  styleUrls: ['./subscription-success.component.scss']
})
export class SubscriptionSuccessComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);

  // State
  sessionId = signal<string | null>(null);

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.sessionId.set(params['session_id'] || null);
    });
  }
}

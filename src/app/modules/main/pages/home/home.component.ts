import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface Demo {
  title: string;
  description: string;
  link: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  checkoutDemos: Demo[] = [
    {
      title: 'Basic Checkout',
      description: 'Simple payment checkout with Stripe Elements',
      link: '/main/stripe-checkout/demo1'
    },
    {
      title: 'Advanced Checkout',
      description: 'Checkout with custom fields and validation',
      link: '/main/stripe-checkout/demo2'
    },
    {
      title: 'One-Time Payment',
      description: 'Secure one-time payment processing',
      link: '/main/stripe-checkout/demo3'
    }
  ];

  subscriptionDemos: Demo[] = [
    {
      title: 'Monthly Subscription',
      description: 'Set up recurring monthly payments',
      link: '/main/stripe-subscription/demo1'
    },
    {
      title: 'Annual Plan',
      description: 'Create and manage annual subscription plans',
      link: '/main/stripe-subscription/demo2'
    },
    {
      title: 'Subscription Management',
      description: 'Handle upgrades, downgrades, and cancellations',
      link: '/main/stripe-subscription/demo3'
    }
  ];

}

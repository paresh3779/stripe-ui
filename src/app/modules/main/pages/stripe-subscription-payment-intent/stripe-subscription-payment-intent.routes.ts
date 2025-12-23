import { Routes } from '@angular/router';

/**
 * Lazy-loaded routes for Stripe Subscription PaymentIntent demos
 */
export const STRIPE_SUBSCRIPTION_PAYMENT_INTENT_ROUTES: Routes = [
  {
    path: 'subscription',
    loadComponent: () => import('./subscription/subscription-payment-intent.component').then(m => m.SubscriptionPaymentIntentComponent),
    title: 'Subscription Payment'
  },
  {
    path: 'trial',
    loadComponent: () => import('./trial/trial-payment-intent.component').then(m => m.TrialPaymentIntentComponent),
    title: 'Trial Subscription'
  },
  {
    path: 'coupon',
    loadComponent: () => import('./coupon/coupon-payment-intent.component').then(m => m.CouponPaymentIntentComponent),
    title: 'Subscription with Coupon'
  },
  {
    path: 'promocode',
    loadComponent: () => import('./promocode/promocode-payment-intent.component').then(m => m.PromocodePaymentIntentComponent),
    title: 'Subscription with Promo Code'
  },
  {
    path: '',
    redirectTo: 'subscription',
    pathMatch: 'full'
  }
];

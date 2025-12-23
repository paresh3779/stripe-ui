import { Routes } from '@angular/router';

/**
 * Lazy-loaded routes for Stripe PaymentIntent demos
 */
export const STRIPE_PAYMENT_INTENT_ROUTES: Routes = [
  {
    path: 'basic',
    loadComponent: () => import('./basic/basic-payment-intent.component').then(m => m.BasicPaymentIntentComponent),
    title: 'Basic Payment'
  },
  {
    path: 'promocode',
    loadComponent: () => import('./promocode/promocode-payment-intent.component').then(m => m.PromocodePaymentIntentComponent),
    title: 'Payment with Promo Code'
  },
  {
    path: 'coupon',
    loadComponent: () => import('./coupon/coupon-payment-intent.component').then(m => m.CouponPaymentIntentComponent),
    title: 'Payment with Coupon'
  },
  {
    path: '',
    redirectTo: 'basic',
    pathMatch: 'full'
  }
];

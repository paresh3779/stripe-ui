import { Routes } from '@angular/router';

/**
 * Lazy-loaded routes for Stripe Subscription Checkout demos
 */
export const STRIPE_SUBSCRIPTION_CHECKOUT_ROUTES: Routes = [
  {
    path: 'subscription',
    loadComponent: () => import('./subscription/subscription-checkout.component').then(m => m.SubscriptionCheckoutComponent),
    title: 'Subscription Plans'
  },
  {
    path: 'subscription/success',
    loadComponent: () => import('./success/subscription-success.component').then(m => m.SubscriptionSuccessComponent),
    title: 'Subscription Success'
  },
  {
    path: 'trial',
    loadComponent: () => import('./trial/trial-checkout.component').then(m => m.TrialCheckoutComponent),
    title: 'Free Trial'
  },
  {
    path: 'trial/success',
    loadComponent: () => import('./success/subscription-success.component').then(m => m.SubscriptionSuccessComponent),
    title: 'Trial Success'
  },
  {
    path: 'coupon',
    loadComponent: () => import('./coupon/coupon-checkout.component').then(m => m.CouponCheckoutComponent),
    title: 'Subscription with Coupon'
  },
  {
    path: 'coupon/success',
    loadComponent: () => import('./success/subscription-success.component').then(m => m.SubscriptionSuccessComponent),
    title: 'Subscription Success'
  },
  {
    path: 'promocode',
    loadComponent: () => import('./promocode/promocode-checkout.component').then(m => m.PromocodeCheckoutComponent),
    title: 'Subscription with Promo Code'
  },
  {
    path: 'promocode/success',
    loadComponent: () => import('./success/subscription-success.component').then(m => m.SubscriptionSuccessComponent),
    title: 'Subscription Success'
  },
  {
    path: '',
    redirectTo: 'subscription',
    pathMatch: 'full'
  }
];

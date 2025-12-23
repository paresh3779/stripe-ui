import { Routes } from '@angular/router';

/**
 * Lazy-loaded routes for Stripe Checkout demos
 */
export const STRIPE_CHECKOUT_ROUTES: Routes = [
  {
    path: 'basic',
    loadComponent: () => import('./basic/basic-checkout.component').then(m => m.BasicCheckoutComponent),
    title: 'Basic Checkout'
  },
  {
    path: 'promocode',
    loadComponent: () => import('./promocode/promocode-checkout.component').then(m => m.PromocodeCheckoutComponent),
    title: 'Checkout with Promo Code'
  },
  {
    path: 'coupon',
    loadComponent: () => import('./coupon/coupon-checkout.component').then(m => m.CouponCheckoutComponent),
    title: 'Checkout with Coupon'
  },
  {
    path: '',
    redirectTo: 'basic',
    pathMatch: 'full'
  }
];

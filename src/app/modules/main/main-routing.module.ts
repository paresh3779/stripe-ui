import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

/**
 * Main routing module with lazy-loaded Stripe demo routes
 * All Stripe components are standalone and loaded on demand for optimal performance
 */
const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent),
    title: 'Home'
  },
  {
    path: 'stripe-checkout',
    loadChildren: () => import('./pages/stripe-checkout/stripe-checkout.routes').then(m => m.STRIPE_CHECKOUT_ROUTES),
    title: 'Stripe Checkout'
  },
  {
    path: 'stripe-payment-intent',
    loadChildren: () => import('./pages/stripe-payment-intent/stripe-payment-intent.routes').then(m => m.STRIPE_PAYMENT_INTENT_ROUTES),
    title: 'Stripe PaymentIntent'
  },
  {
    path: 'stripe-subscription-checkout',
    loadChildren: () => import('./pages/stripe-subscription-checkout/stripe-subscription-checkout.routes').then(m => m.STRIPE_SUBSCRIPTION_CHECKOUT_ROUTES),
    title: 'Subscription Checkout'
  },
  {
    path: 'stripe-subscription-payment-intent',
    loadChildren: () => import('./pages/stripe-subscription-payment-intent/stripe-subscription-payment-intent.routes').then(m => m.STRIPE_SUBSCRIPTION_PAYMENT_INTENT_ROUTES),
    title: 'Subscription PaymentIntent'
  },
  {
    path: 'invoices',
    loadComponent: () => import('./pages/invoices/invoices.component').then(m => m.InvoicesComponent),
    title: 'Invoice Management'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { BasicCheckoutComponent } from './pages/stripe-checkout/basic/basic-checkout.component';
import { PromocodeCheckoutComponent } from './pages/stripe-checkout/promocode/promocode-checkout.component';
import { CouponCheckoutComponent } from './pages/stripe-checkout/coupon/coupon-checkout.component';
import { BasicPaymentIntentComponent } from './pages/stripe-payment-intent/basic/basic-payment-intent.component';
import { PromocodePaymentIntentComponent } from './pages/stripe-payment-intent/promocode/promocode-payment-intent.component';
import { CouponPaymentIntentComponent } from './pages/stripe-payment-intent/coupon/coupon-payment-intent.component';
import { SubscriptionCheckoutComponent } from './pages/stripe-subscription-checkout/subscription/subscription-checkout.component';
import { TrialCheckoutComponent } from './pages/stripe-subscription-checkout/trial/trial-checkout.component';
import { CouponCheckoutComponent as SubscriptionCouponCheckoutComponent } from './pages/stripe-subscription-checkout/coupon/coupon-checkout.component';
import { PromocodeCheckoutComponent as SubscriptionPromocodeCheckoutComponent } from './pages/stripe-subscription-checkout/promocode/promocode-checkout.component';
import { SubscriptionSuccessComponent } from './pages/stripe-subscription-checkout/success/subscription-success.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'stripe-checkout',
    children: [
      {
        path: 'basic',
        component: BasicCheckoutComponent
      },
      {
        path: 'promocode',
        component: PromocodeCheckoutComponent
      },
      {
        path: 'coupon',
        component: CouponCheckoutComponent
      }
    ]
  },
  {
    path: 'stripe-payment-intent',
    children: [
      {
        path: 'basic',
        component: BasicPaymentIntentComponent
      },
      {
        path: 'promocode',
        component: PromocodePaymentIntentComponent
      },
      {
        path: 'coupon',
        component: CouponPaymentIntentComponent
      }
    ]
  },
  {
    path: 'stripe-subscription-checkout',
    children: [
      {
        path: 'subscription',
        component: SubscriptionCheckoutComponent
      },
      {
        path: 'subscription/success',
        component: SubscriptionSuccessComponent
      },
      {
        path: 'trial',
        component: TrialCheckoutComponent
      },
      {
        path: 'trial/success',
        component: SubscriptionSuccessComponent
      },
      {
        path: 'coupon',
        component: SubscriptionCouponCheckoutComponent
      },
      {
        path: 'coupon/success',
        component: SubscriptionSuccessComponent
      },
      {
        path: 'promocode',
        component: SubscriptionPromocodeCheckoutComponent
      },
      {
        path: 'promocode/success',
        component: SubscriptionSuccessComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }

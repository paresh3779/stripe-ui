import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { BasicCheckoutComponent } from './pages/stripe-checkout/basic/basic-checkout.component';
import { PromocodeCheckoutComponent } from './pages/stripe-checkout/promocode/promocode-checkout.component';
import { CouponCheckoutComponent } from './pages/stripe-checkout/coupon/coupon-checkout.component';

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
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }

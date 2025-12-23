import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

import { AuthService } from '../../../core/services/auth.service';

interface MenuItem {
  label: string;
  link?: string;
  children?: MenuItem[];
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {

  private authService = inject(AuthService);
  private router = inject(Router);

  user$ = this.authService.currentUser$;

  menu: MenuItem[] = [
    {
      label: 'Home',
      link: '/main/home'
    },
    {
      label: 'Stripe Checkout',
      children: [
        { label: 'Basic Checkout', link: '/main/stripe-checkout/basic' },
        { label: 'With Promo Code', link: '/main/stripe-checkout/promocode' },
        { label: 'With Coupon', link: '/main/stripe-checkout/coupon' }
      ]
    },
    {
      label: 'Stripe PaymentIntent',
      children: [
        { label: 'Basic Payment', link: '/main/stripe-payment-intent/basic' },
        { label: 'With Promo Code', link: '/main/stripe-payment-intent/promocode' },
        { label: 'With Coupon', link: '/main/stripe-payment-intent/coupon' }
      ]
    },
    {
      label: 'Subscription Checkout',
      children: [
        { label: 'Monthly/Yearly Plans', link: '/main/stripe-subscription-checkout/subscription' },
        { label: 'With Free Trial', link: '/main/stripe-subscription-checkout/trial' },
        { label: 'With Coupon', link: '/main/stripe-subscription-checkout/coupon' },
        { label: 'With Promo Code', link: '/main/stripe-subscription-checkout/promocode' }
      ]
    },
    {
      label: 'Subscription PaymentIntent',
      children: [
        { label: 'Monthly/Yearly Plans', link: '/main/stripe-subscription-payment-intent/subscription' },
        { label: 'With Free Trial', link: '/main/stripe-subscription-payment-intent/trial' },
        { label: 'With Coupon', link: '/main/stripe-subscription-payment-intent/coupon' },
        { label: 'With Promo Code', link: '/main/stripe-subscription-payment-intent/promocode' }
      ]
    }
  ];

  isAnyChildActive(item: MenuItem): boolean {
    if (!item.children) return false;
    return item.children.some(child => child.link ? this.router.isActive(child.link, true) : false);
  }

  logout(): void {
    this.authService.logout().subscribe();
  }

}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

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

  menu: MenuItem[] = [
    {
      label: 'Home',
      link: '/main/home'
    },
    {
      label: 'Stripe Checkout',
      children: [
        { label: 'Demo 1', link: '/main/stripe-checkout/demo1' },
        { label: 'Demo 2', link: '/main/stripe-checkout/demo2' },
        { label: 'Demo 3', link: '/main/stripe-checkout/demo3' }
      ]
    },
    {
      label: 'Stripe Subscription',
      children: [
        { label: 'Demo 1', link: '/main/stripe-subscription/demo1' },
        { label: 'Demo 2', link: '/main/stripe-subscription/demo2' },
        { label: 'Demo 3', link: '/main/stripe-subscription/demo3' }
      ]
    }
  ];

}

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

  isAnyChildActive(item: MenuItem): boolean {
    if (!item.children) return false;
    return item.children.some(child => child.link ? this.router.isActive(child.link, true) : false);
  }

  logout(): void {
    this.authService.logout().subscribe();
  }

}

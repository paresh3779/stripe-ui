import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiUrlService } from './api-url.service';

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  stripe_product_id: string;
  type: string;
  active: boolean;
  prices?: Price[];
}

export interface Price {
  id: string;
  product_id: string;
  stripe_price_id: string;
  description: string;
  amount: number;
  currency: string;
  type: string;
  interval?: string;
  interval_count?: number;
  trial_days?: number;
  features?: string[];
  active: boolean;
}

export interface Coupon {
  id: string;
  name: string;
  description: string;
  stripe_coupon_id: string;
  discount_type: string;
  discount_value: number;
  currency: string;
  duration: string;
  active: boolean;
}

export interface PromoCode {
  id: string;
  coupon_id: string;
  code: string;
  description: string;
  stripe_promotion_code_id: string;
  active: boolean;
  coupon?: Coupon;
}

export interface CheckoutSession {
  sessionId: string;
  url: string;
}

@Injectable({
  providedIn: 'root'
})
export class StripeCheckoutService {
  private http = inject(HttpClient);
  private apiUrlService = inject(ApiUrlService);

  getProducts(): Observable<{ success: boolean; data: Product[] }> {
    return this.http.get<{ success: boolean; data: Product[] }>(
      this.apiUrlService.url('stripe/checkout/basic/products')
    );
  }

  getProduct(productId: string): Observable<{ success: boolean; data: Product }> {
    return this.http.get<{ success: boolean; data: Product }>(
      this.apiUrlService.url(`stripe/checkout/basic/products/${productId}`)
    );
  }

  createCheckoutSession(priceId: string): Observable<{ success: boolean; data: CheckoutSession }> {
    return this.http.post<{ success: boolean; data: CheckoutSession }>(
      this.apiUrlService.url('stripe/checkout/basic/create-session'),
      { price_id: priceId }
    );
  }

  getProductsWithPromoCode(): Observable<{ success: boolean; data: Product[] }> {
    return this.http.get<{ success: boolean; data: Product[] }>(
      this.apiUrlService.url('stripe/checkout/promocode/products')
    );
  }

  getProductWithPromoCode(productId: string): Observable<{ success: boolean; data: Product }> {
    return this.http.get<{ success: boolean; data: Product }>(
      this.apiUrlService.url(`stripe/checkout/promocode/products/${productId}`)
    );
  }

  validatePromoCode(code: string): Observable<{ success: boolean; data: { valid: boolean; promoCode: PromoCode; coupon: Coupon } }> {
    return this.http.post<{ success: boolean; data: { valid: boolean; promoCode: PromoCode; coupon: Coupon } }>(
      this.apiUrlService.url('stripe/checkout/promocode/validate-promocode'),
      { code }
    );
  }

  createCheckoutSessionWithPromoCode(priceId: string, promoCode: string): Observable<{ success: boolean; data: CheckoutSession }> {
    return this.http.post<{ success: boolean; data: CheckoutSession }>(
      this.apiUrlService.url('stripe/checkout/promocode/create-session'),
      { price_id: priceId, promo_code: promoCode }
    );
  }

  getProductsWithCoupon(): Observable<{ success: boolean; data: Product[] }> {
    return this.http.get<{ success: boolean; data: Product[] }>(
      this.apiUrlService.url('stripe/checkout/coupon/products')
    );
  }

  getProductWithCoupon(productId: string): Observable<{ success: boolean; data: Product }> {
    return this.http.get<{ success: boolean; data: Product }>(
      this.apiUrlService.url(`stripe/checkout/coupon/products/${productId}`)
    );
  }

  getCoupons(): Observable<{ success: boolean; data: Coupon[] }> {
    return this.http.get<{ success: boolean; data: Coupon[] }>(
      this.apiUrlService.url('stripe/checkout/coupon/coupons')
    );
  }

  createCheckoutSessionWithCoupon(priceId: string, couponId: string): Observable<{ success: boolean; data: CheckoutSession }> {
    return this.http.post<{ success: boolean; data: CheckoutSession }>(
      this.apiUrlService.url('stripe/checkout/coupon/create-session'),
      { price_id: priceId, coupon_id: couponId }
    );
  }
}

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiUrlService } from './api-url.service';
import { API_ENDPOINTS } from '../constants/api-endpoints';
import {
  Product,
  Price,
  Coupon,
  PromoCode,
  CheckoutSession,
  CheckoutSessionVerification
} from '../interfaces/stripe.interface';
import { ApiResponse } from '../interfaces/api-response.interface';

/**
 * Stripe Checkout service for product purchases with optional discounts.
 * Supports: Basic checkout, Promo codes, and Coupons.
 */
@Injectable({
  providedIn: 'root'
})
export class StripeCheckoutService {
  private readonly http = inject(HttpClient);
  private readonly apiUrlService = inject(ApiUrlService);

  // ==================== Basic Checkout ====================

  /** Get all products for basic checkout */
  getProducts(): Observable<ApiResponse<Product[]>> {
    return this.http.get<ApiResponse<Product[]>>(
      this.apiUrlService.url(API_ENDPOINTS.STRIPE.CHECKOUT.BASIC.PRODUCTS)
    );
  }

  /** Get single product by ID */
  getProduct(productId: string): Observable<ApiResponse<Product>> {
    return this.http.get<ApiResponse<Product>>(
      this.apiUrlService.url(API_ENDPOINTS.STRIPE.CHECKOUT.BASIC.PRODUCT(productId))
    );
  }

  /** Create Stripe checkout session and return redirect URL */
  createCheckoutSession(priceId: string): Observable<ApiResponse<CheckoutSession>> {
    return this.http.post<ApiResponse<CheckoutSession>>(
      this.apiUrlService.url(API_ENDPOINTS.STRIPE.CHECKOUT.BASIC.CREATE_SESSION),
      { price_id: priceId }
    );
  }

  /** Verify checkout session status */
  verifySession(sessionId: string): Observable<ApiResponse<CheckoutSessionVerification>> {
    return this.http.post<ApiResponse<CheckoutSessionVerification>>(
      this.apiUrlService.url(API_ENDPOINTS.STRIPE.CHECKOUT.BASIC.VERIFY_SESSION),
      { session_id: sessionId }
    );
  }

  // ==================== Promo Code Checkout ====================

  /** Get all products for promo code checkout */
  getProductsWithPromoCode(): Observable<ApiResponse<Product[]>> {
    return this.http.get<ApiResponse<Product[]>>(
      this.apiUrlService.url(API_ENDPOINTS.STRIPE.CHECKOUT.PROMOCODE.PRODUCTS)
    );
  }

  /** Get single product by ID for promo code checkout */
  getProductWithPromoCode(productId: string): Observable<ApiResponse<Product>> {
    return this.http.get<ApiResponse<Product>>(
      this.apiUrlService.url(API_ENDPOINTS.STRIPE.CHECKOUT.PROMOCODE.PRODUCT(productId))
    );
  }

  /** Validate promo code and return coupon details */
  validatePromoCode(code: string): Observable<ApiResponse<{ valid: boolean; promoCode: PromoCode; coupon: Coupon }>> {
    return this.http.post<ApiResponse<{ valid: boolean; promoCode: PromoCode; coupon: Coupon }>>(
      this.apiUrlService.url(API_ENDPOINTS.STRIPE.CHECKOUT.PROMOCODE.VALIDATE),
      { code }
    );
  }

  /** Create checkout session with promo code applied */
  createCheckoutSessionWithPromoCode(priceId: string, promoCode: string): Observable<ApiResponse<CheckoutSession>> {
    return this.http.post<ApiResponse<CheckoutSession>>(
      this.apiUrlService.url(API_ENDPOINTS.STRIPE.CHECKOUT.PROMOCODE.CREATE_SESSION),
      { price_id: priceId, promo_code: promoCode }
    );
  }

  // ==================== Coupon Checkout ====================

  /** Get all products for coupon checkout */
  getProductsWithCoupon(): Observable<ApiResponse<Product[]>> {
    return this.http.get<ApiResponse<Product[]>>(
      this.apiUrlService.url(API_ENDPOINTS.STRIPE.CHECKOUT.COUPON.PRODUCTS)
    );
  }

  /** Get single product by ID for coupon checkout */
  getProductWithCoupon(productId: string): Observable<ApiResponse<Product>> {
    return this.http.get<ApiResponse<Product>>(
      this.apiUrlService.url(API_ENDPOINTS.STRIPE.CHECKOUT.COUPON.PRODUCT(productId))
    );
  }

  /** Get all available coupons */
  getCoupons(): Observable<ApiResponse<Coupon[]>> {
    return this.http.get<ApiResponse<Coupon[]>>(
      this.apiUrlService.url(API_ENDPOINTS.STRIPE.CHECKOUT.COUPON.COUPONS)
    );
  }

  /** Create checkout session with coupon applied */
  createCheckoutSessionWithCoupon(priceId: string, couponId: string): Observable<ApiResponse<CheckoutSession>> {
    return this.http.post<ApiResponse<CheckoutSession>>(
      this.apiUrlService.url(API_ENDPOINTS.STRIPE.CHECKOUT.COUPON.CREATE_SESSION),
      { price_id: priceId, coupon_id: couponId }
    );
  }
}

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiUrlService } from './api-url.service';
import { API_ENDPOINTS } from '../constants/api-endpoints';
import { ApiResponse } from '../interfaces/api-response.interface';
import { Coupon } from '../interfaces/stripe.interface';
import {
  SubscriptionProduct,
  SubscriptionCheckoutSession,
  TrialInfo,
  CouponValidation,
  PromoCodeValidation,
  DiscountCalculation
} from '../interfaces/subscription.interface';

/**
 * Service for Stripe subscription checkout operations.
 * Handles all subscription-related API calls including:
 * - Basic subscription (monthly/yearly)
 * - Trial period subscriptions
 * - Subscription with coupon
 * - Subscription with promo code
 */
@Injectable({
  providedIn: 'root'
})
export class StripeSubscriptionCheckoutService {
  private readonly http = inject(HttpClient);
  private readonly apiUrlService = inject(ApiUrlService);

  // ==================== Basic Subscription (Monthly/Yearly) ====================

  /** Get all subscription products */
  getSubscriptionProducts(): Observable<ApiResponse<SubscriptionProduct[]>> {
    return this.http.get<ApiResponse<SubscriptionProduct[]>>(
      this.apiUrlService.url(API_ENDPOINTS.STRIPE.SUBSCRIPTION_CHECKOUT.SUBSCRIPTION.PRODUCTS)
    );
  }

  /** Get single subscription product by ID */
  getSubscriptionProduct(productId: string): Observable<ApiResponse<SubscriptionProduct>> {
    return this.http.get<ApiResponse<SubscriptionProduct>>(
      this.apiUrlService.url(API_ENDPOINTS.STRIPE.SUBSCRIPTION_CHECKOUT.SUBSCRIPTION.PRODUCT(productId))
    );
  }

  /** Create subscription checkout session */
  createSubscriptionCheckoutSession(priceId: string): Observable<ApiResponse<SubscriptionCheckoutSession>> {
    return this.http.post<ApiResponse<SubscriptionCheckoutSession>>(
      this.apiUrlService.url(API_ENDPOINTS.STRIPE.SUBSCRIPTION_CHECKOUT.SUBSCRIPTION.CREATE_SESSION),
      { price_id: priceId }
    );
  }

  // ==================== Trial Period Subscription ====================

  /** Get subscription products with trial periods */
  getTrialProducts(): Observable<ApiResponse<SubscriptionProduct[]>> {
    return this.http.get<ApiResponse<SubscriptionProduct[]>>(
      this.apiUrlService.url(API_ENDPOINTS.STRIPE.SUBSCRIPTION_CHECKOUT.TRIAL.PRODUCTS)
    );
  }

  /** Get single trial product by ID */
  getTrialProduct(productId: string): Observable<ApiResponse<SubscriptionProduct>> {
    return this.http.get<ApiResponse<SubscriptionProduct>>(
      this.apiUrlService.url(API_ENDPOINTS.STRIPE.SUBSCRIPTION_CHECKOUT.TRIAL.PRODUCT(productId))
    );
  }

  /** Get trial information for a price */
  getTrialInfo(priceId: string): Observable<ApiResponse<TrialInfo>> {
    return this.http.post<ApiResponse<TrialInfo>>(
      this.apiUrlService.url(API_ENDPOINTS.STRIPE.SUBSCRIPTION_CHECKOUT.TRIAL.TRIAL_INFO),
      { price_id: priceId }
    );
  }

  /** Create trial subscription checkout session */
  createTrialCheckoutSession(priceId: string): Observable<ApiResponse<SubscriptionCheckoutSession>> {
    return this.http.post<ApiResponse<SubscriptionCheckoutSession>>(
      this.apiUrlService.url(API_ENDPOINTS.STRIPE.SUBSCRIPTION_CHECKOUT.TRIAL.CREATE_SESSION),
      { price_id: priceId }
    );
  }

  // ==================== Subscription with Coupon ====================

  /** Get subscription products for coupon checkout */
  getCouponProducts(): Observable<ApiResponse<SubscriptionProduct[]>> {
    return this.http.get<ApiResponse<SubscriptionProduct[]>>(
      this.apiUrlService.url(API_ENDPOINTS.STRIPE.SUBSCRIPTION_CHECKOUT.COUPON.PRODUCTS)
    );
  }

  /** Get single product for coupon checkout */
  getCouponProduct(productId: string): Observable<ApiResponse<SubscriptionProduct>> {
    return this.http.get<ApiResponse<SubscriptionProduct>>(
      this.apiUrlService.url(API_ENDPOINTS.STRIPE.SUBSCRIPTION_CHECKOUT.COUPON.PRODUCT(productId))
    );
  }

  /** Get all available coupons for subscriptions */
  getCoupons(): Observable<ApiResponse<Coupon[]>> {
    return this.http.get<ApiResponse<Coupon[]>>(
      this.apiUrlService.url(API_ENDPOINTS.STRIPE.SUBSCRIPTION_CHECKOUT.COUPON.COUPONS)
    );
  }

  /** Validate a coupon */
  validateCoupon(couponId: string): Observable<ApiResponse<CouponValidation>> {
    return this.http.post<ApiResponse<CouponValidation>>(
      this.apiUrlService.url(API_ENDPOINTS.STRIPE.SUBSCRIPTION_CHECKOUT.COUPON.VALIDATE),
      { coupon_id: couponId }
    );
  }

  /** Calculate discount for coupon */
  calculateCouponDiscount(amount: number, couponId: string): Observable<ApiResponse<DiscountCalculation>> {
    return this.http.post<ApiResponse<DiscountCalculation>>(
      this.apiUrlService.url(API_ENDPOINTS.STRIPE.SUBSCRIPTION_CHECKOUT.COUPON.CALCULATE_DISCOUNT),
      { amount, coupon_id: couponId }
    );
  }

  /** Create subscription checkout session with coupon */
  createCouponCheckoutSession(priceId: string, couponId: string): Observable<ApiResponse<SubscriptionCheckoutSession>> {
    return this.http.post<ApiResponse<SubscriptionCheckoutSession>>(
      this.apiUrlService.url(API_ENDPOINTS.STRIPE.SUBSCRIPTION_CHECKOUT.COUPON.CREATE_SESSION),
      { price_id: priceId, coupon_id: couponId }
    );
  }

  // ==================== Subscription with Promo Code ====================

  /** Get subscription products for promo code checkout */
  getPromoCodeProducts(): Observable<ApiResponse<SubscriptionProduct[]>> {
    return this.http.get<ApiResponse<SubscriptionProduct[]>>(
      this.apiUrlService.url(API_ENDPOINTS.STRIPE.SUBSCRIPTION_CHECKOUT.PROMOCODE.PRODUCTS)
    );
  }

  /** Get single product for promo code checkout */
  getPromoCodeProduct(productId: string): Observable<ApiResponse<SubscriptionProduct>> {
    return this.http.get<ApiResponse<SubscriptionProduct>>(
      this.apiUrlService.url(API_ENDPOINTS.STRIPE.SUBSCRIPTION_CHECKOUT.PROMOCODE.PRODUCT(productId))
    );
  }

  /** Validate a promo code */
  validatePromoCode(code: string): Observable<ApiResponse<PromoCodeValidation>> {
    return this.http.post<ApiResponse<PromoCodeValidation>>(
      this.apiUrlService.url(API_ENDPOINTS.STRIPE.SUBSCRIPTION_CHECKOUT.PROMOCODE.VALIDATE),
      { code }
    );
  }

  /** Calculate discount for promo code */
  calculatePromoCodeDiscount(amount: number, code: string): Observable<ApiResponse<DiscountCalculation>> {
    return this.http.post<ApiResponse<DiscountCalculation>>(
      this.apiUrlService.url(API_ENDPOINTS.STRIPE.SUBSCRIPTION_CHECKOUT.PROMOCODE.CALCULATE_DISCOUNT),
      { amount, code }
    );
  }

  /** Create subscription checkout session with promo code */
  createPromoCodeCheckoutSession(priceId: string, promoCode: string): Observable<ApiResponse<SubscriptionCheckoutSession>> {
    return this.http.post<ApiResponse<SubscriptionCheckoutSession>>(
      this.apiUrlService.url(API_ENDPOINTS.STRIPE.SUBSCRIPTION_CHECKOUT.PROMOCODE.CREATE_SESSION),
      { price_id: priceId, promo_code: promoCode }
    );
  }
}

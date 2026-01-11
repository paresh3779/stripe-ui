import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiUrlService } from './api-url.service';
import { API_ENDPOINTS } from '../constants/api-endpoints.constant';
import {
  Product,
  Price,
  Coupon,
  PaymentIntentResponse,
  PromoCodeValidation,
  CouponValidation,
  ApiResponse
} from '../interfaces/payment.interface';

/**
 * Service for Stripe PaymentIntent operations
 */
@Injectable({
  providedIn: 'root'
})
export class StripePaymentIntentService {
  private http = inject(HttpClient);
  private apiUrlService = inject(ApiUrlService);

  /**
   * Get all one-time products (Basic)
   */
  getProducts(): Observable<ApiResponse<Product[]>> {
    return this.http.get<ApiResponse<Product[]>>(
      this.apiUrlService.url(API_ENDPOINTS.PAYMENT_INTENT_BASIC.PRODUCTS)
    );
  }

  /**
   * Get product by ID (Basic)
   */
  getProduct(productId: string): Observable<ApiResponse<Product>> {
    return this.http.get<ApiResponse<Product>>(
      this.apiUrlService.url(API_ENDPOINTS.PAYMENT_INTENT_BASIC.PRODUCT_BY_ID(productId))
    );
  }

  /**
   * Create PaymentIntent (Basic - without promo/coupon)
   */
  createPaymentIntent(priceId: string): Observable<ApiResponse<PaymentIntentResponse>> {
    return this.http.post<ApiResponse<PaymentIntentResponse>>(
      this.apiUrlService.url(API_ENDPOINTS.PAYMENT_INTENT_BASIC.CREATE),
      { price_id: priceId }
    );
  }

  /**
   * Confirm payment status (Basic)
   */
  confirmPayment(paymentIntentId: string): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(
      this.apiUrlService.url(API_ENDPOINTS.PAYMENT_INTENT_BASIC.CONFIRM),
      { payment_intent_id: paymentIntentId }
    );
  }

  /**
   * Get payment status (Basic)
   */
  getPaymentStatus(paymentIntentId: string): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(
      this.apiUrlService.url(API_ENDPOINTS.PAYMENT_INTENT_BASIC.STATUS),
      { payment_intent_id: paymentIntentId }
    );
  }

  /**
   * Cancel payment intent (Basic)
   */
  cancelPayment(paymentIntentId: string): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(
      this.apiUrlService.url(API_ENDPOINTS.PAYMENT_INTENT_BASIC.CANCEL),
      { payment_intent_id: paymentIntentId }
    );
  }

  /**
   * Get all one-time products (PromoCode)
   */
  getProductsWithPromoCode(): Observable<ApiResponse<Product[]>> {
    return this.http.get<ApiResponse<Product[]>>(
      this.apiUrlService.url(API_ENDPOINTS.PAYMENT_INTENT_PROMOCODE.PRODUCTS)
    );
  }

  /**
   * Get product by ID (PromoCode)
   */
  getProductWithPromoCode(productId: string): Observable<ApiResponse<Product>> {
    return this.http.get<ApiResponse<Product>>(
      this.apiUrlService.url(API_ENDPOINTS.PAYMENT_INTENT_PROMOCODE.PRODUCT_BY_ID(productId))
    );
  }

  /**
   * Validate promo code
   */
  validatePromoCode(promoCode: string, priceId: string): Observable<ApiResponse<PromoCodeValidation>> {
    return this.http.post<ApiResponse<PromoCodeValidation>>(
      this.apiUrlService.url(API_ENDPOINTS.PAYMENT_INTENT_PROMOCODE.VALIDATE),
      { promo_code: promoCode, price_id: priceId }
    );
  }

  /**
   * Create PaymentIntent with promo code
   */
  createPaymentIntentWithPromoCode(priceId: string, promoCode: string): Observable<ApiResponse<PaymentIntentResponse>> {
    return this.http.post<ApiResponse<PaymentIntentResponse>>(
      this.apiUrlService.url(API_ENDPOINTS.PAYMENT_INTENT_PROMOCODE.CREATE),
      { price_id: priceId, promo_code: promoCode }
    );
  }

  /**
   * Confirm payment status (PromoCode)
   */
  confirmPaymentWithPromoCode(paymentIntentId: string): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(
      this.apiUrlService.url(API_ENDPOINTS.PAYMENT_INTENT_PROMOCODE.CONFIRM),
      { payment_intent_id: paymentIntentId }
    );
  }

  /**
   * Get all one-time products (Coupon)
   */
  getProductsWithCoupon(): Observable<ApiResponse<Product[]>> {
    return this.http.get<ApiResponse<Product[]>>(
      this.apiUrlService.url(API_ENDPOINTS.PAYMENT_INTENT_COUPON.PRODUCTS)
    );
  }

  /**
   * Get product by ID (Coupon)
   */
  getProductWithCoupon(productId: string): Observable<ApiResponse<Product>> {
    return this.http.get<ApiResponse<Product>>(
      this.apiUrlService.url(API_ENDPOINTS.PAYMENT_INTENT_COUPON.PRODUCT_BY_ID(productId))
    );
  }

  /**
   * Get all active coupons
   */
  getCoupons(): Observable<ApiResponse<Coupon[]>> {
    return this.http.get<ApiResponse<Coupon[]>>(
      this.apiUrlService.url(API_ENDPOINTS.PAYMENT_INTENT_COUPON.COUPONS)
    );
  }

  /**
   * Validate coupon
   */
  validateCoupon(couponId: string, priceId: string): Observable<ApiResponse<CouponValidation>> {
    return this.http.post<ApiResponse<CouponValidation>>(
      this.apiUrlService.url(API_ENDPOINTS.PAYMENT_INTENT_COUPON.VALIDATE),
      { coupon_id: couponId, price_id: priceId }
    );
  }

  /**
   * Create PaymentIntent with coupon
   */
  createPaymentIntentWithCoupon(priceId: string, couponId: string): Observable<ApiResponse<PaymentIntentResponse>> {
    return this.http.post<ApiResponse<PaymentIntentResponse>>(
      this.apiUrlService.url(API_ENDPOINTS.PAYMENT_INTENT_COUPON.CREATE),
      { price_id: priceId, coupon_id: couponId }
    );
  }

  /**
   * Confirm payment status (Coupon)
   */
  confirmPaymentWithCoupon(paymentIntentId: string): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(
      this.apiUrlService.url(API_ENDPOINTS.PAYMENT_INTENT_COUPON.CONFIRM),
      { payment_intent_id: paymentIntentId }
    );
  }
}

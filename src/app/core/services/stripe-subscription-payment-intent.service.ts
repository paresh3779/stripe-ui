import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiUrlService } from './api-url.service';
import { API_ENDPOINTS } from '../constants/api-endpoints';
import { ApiResponse } from '../interfaces/api-response.interface';
import { Coupon } from '../interfaces/stripe.interface';
import { SubscriptionProduct } from '../interfaces/subscription.interface';
import {
  SetupIntentResponse,
  SubscriptionResponse,
  SubscriptionConfirmation,
  TrialInfoResponse,
  CouponValidationResponse,
  PromoCodeValidationResponse,
  DiscountCalculationResponse,
  SavedPaymentMethod,
  TrialSubscription,
  TrialInvoice,
  CancelTrialSubscriptionResponse
} from '../interfaces/subscription-payment-intent.interface';

/**
 * Service for Stripe subscription PaymentIntent operations.
 * Handles all subscription payment intent API calls including:
 * - Basic subscription (monthly/yearly)
 * - Trial period subscriptions
 * - Subscription with coupon
 * - Subscription with promo code
 */
@Injectable({
  providedIn: 'root'
})
export class StripeSubscriptionPaymentIntentService {
  private readonly http = inject(HttpClient);
  private readonly apiUrlService = inject(ApiUrlService);

  // ==================== Basic Subscription (Monthly/Yearly) ====================

  /** Get all subscription products */
  getSubscriptionProducts(): Observable<ApiResponse<SubscriptionProduct[]>> {
    return this.http.get<ApiResponse<SubscriptionProduct[]>>(
      this.apiUrlService.url(API_ENDPOINTS.STRIPE.SUBSCRIPTION_PAYMENT_INTENT.SUBSCRIPTION.PRODUCTS)
    );
  }

  /** Get single subscription product by ID */
  getSubscriptionProduct(productId: string): Observable<ApiResponse<SubscriptionProduct>> {
    return this.http.get<ApiResponse<SubscriptionProduct>>(
      this.apiUrlService.url(API_ENDPOINTS.STRIPE.SUBSCRIPTION_PAYMENT_INTENT.SUBSCRIPTION.PRODUCT(productId))
    );
  }

  /** Create SetupIntent for collecting payment method */
  createSetupIntent(priceId: string): Observable<ApiResponse<SetupIntentResponse>> {
    return this.http.post<ApiResponse<SetupIntentResponse>>(
      this.apiUrlService.url(API_ENDPOINTS.STRIPE.SUBSCRIPTION_PAYMENT_INTENT.SUBSCRIPTION.SETUP_INTENT),
      { price_id: priceId }
    );
  }

  /** Create subscription with payment method */
  createSubscription(priceId: string, paymentMethodId: string): Observable<ApiResponse<SubscriptionResponse>> {
    return this.http.post<ApiResponse<SubscriptionResponse>>(
      this.apiUrlService.url(API_ENDPOINTS.STRIPE.SUBSCRIPTION_PAYMENT_INTENT.SUBSCRIPTION.CREATE),
      { price_id: priceId, payment_method_id: paymentMethodId }
    );
  }

  /** Confirm subscription status */
  confirmSubscription(subscriptionId: string): Observable<ApiResponse<SubscriptionConfirmation>> {
    return this.http.post<ApiResponse<SubscriptionConfirmation>>(
      this.apiUrlService.url(API_ENDPOINTS.STRIPE.SUBSCRIPTION_PAYMENT_INTENT.SUBSCRIPTION.CONFIRM),
      { subscription_id: subscriptionId }
    );
  }

  // ==================== Trial Period Subscription ====================

  /** Get subscription products with trial periods */
  getTrialProducts(): Observable<ApiResponse<SubscriptionProduct[]>> {
    return this.http.get<ApiResponse<SubscriptionProduct[]>>(
      this.apiUrlService.url(API_ENDPOINTS.STRIPE.SUBSCRIPTION_PAYMENT_INTENT.TRIAL.PRODUCTS)
    );
  }

  /** Get single trial product by ID */
  getTrialProduct(productId: string): Observable<ApiResponse<SubscriptionProduct>> {
    return this.http.get<ApiResponse<SubscriptionProduct>>(
      this.apiUrlService.url(API_ENDPOINTS.STRIPE.SUBSCRIPTION_PAYMENT_INTENT.TRIAL.PRODUCT(productId))
    );
  }

  /** Get trial information for a price */
  getTrialInfo(priceId: string): Observable<ApiResponse<TrialInfoResponse>> {
    return this.http.post<ApiResponse<TrialInfoResponse>>(
      this.apiUrlService.url(API_ENDPOINTS.STRIPE.SUBSCRIPTION_PAYMENT_INTENT.TRIAL.TRIAL_INFO),
      { price_id: priceId }
    );
  }

  /** Create SetupIntent for trial subscription */
  createTrialSetupIntent(priceId: string): Observable<ApiResponse<SetupIntentResponse>> {
    return this.http.post<ApiResponse<SetupIntentResponse>>(
      this.apiUrlService.url(API_ENDPOINTS.STRIPE.SUBSCRIPTION_PAYMENT_INTENT.TRIAL.SETUP_INTENT),
      { price_id: priceId }
    );
  }

  /** Create subscription with trial period */
  createTrialSubscription(priceId: string, paymentMethodId: string): Observable<ApiResponse<SubscriptionResponse>> {
    return this.http.post<ApiResponse<SubscriptionResponse>>(
      this.apiUrlService.url(API_ENDPOINTS.STRIPE.SUBSCRIPTION_PAYMENT_INTENT.TRIAL.CREATE),
      { price_id: priceId, payment_method_id: paymentMethodId }
    );
  }

  /** Create subscription with saved payment method */
  createTrialSubscriptionWithSaved(priceId: string, savedPaymentMethodId: string): Observable<ApiResponse<SubscriptionResponse>> {
    return this.http.post<ApiResponse<SubscriptionResponse>>(
      this.apiUrlService.url(API_ENDPOINTS.STRIPE.SUBSCRIPTION_PAYMENT_INTENT.TRIAL.CREATE_WITH_SAVED),
      { price_id: priceId, saved_payment_method_id: savedPaymentMethodId }
    );
  }

  /** Confirm trial subscription status */
  confirmTrialSubscription(subscriptionId: string): Observable<ApiResponse<SubscriptionConfirmation>> {
    return this.http.post<ApiResponse<SubscriptionConfirmation>>(
      this.apiUrlService.url(API_ENDPOINTS.STRIPE.SUBSCRIPTION_PAYMENT_INTENT.TRIAL.CONFIRM),
      { subscription_id: subscriptionId }
    );
  }

  // ==================== Trial Payment Methods ====================

  /** Get user's saved payment methods */
  getTrialPaymentMethods(): Observable<ApiResponse<SavedPaymentMethod[]>> {
    return this.http.get<ApiResponse<SavedPaymentMethod[]>>(
      this.apiUrlService.url(API_ENDPOINTS.STRIPE.SUBSCRIPTION_PAYMENT_INTENT.TRIAL.PAYMENT_METHODS)
    );
  }

  /** Save a new payment method */
  saveTrialPaymentMethod(paymentMethodId: string, setDefault: boolean = true): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(
      this.apiUrlService.url(API_ENDPOINTS.STRIPE.SUBSCRIPTION_PAYMENT_INTENT.TRIAL.PAYMENT_METHODS),
      { payment_method_id: paymentMethodId, set_default: setDefault }
    );
  }

  /** Delete a saved payment method */
  deleteTrialPaymentMethod(paymentMethodId: string): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(
      this.apiUrlService.url(API_ENDPOINTS.STRIPE.SUBSCRIPTION_PAYMENT_INTENT.TRIAL.DELETE_PAYMENT_METHOD(paymentMethodId))
    );
  }

  // ==================== Trial Subscription Management ====================

  /** Get user's trial subscriptions */
  getTrialSubscriptions(): Observable<ApiResponse<TrialSubscription[]>> {
    return this.http.get<ApiResponse<TrialSubscription[]>>(
      this.apiUrlService.url(API_ENDPOINTS.STRIPE.SUBSCRIPTION_PAYMENT_INTENT.TRIAL.SUBSCRIPTIONS)
    );
  }

  /** Get a single trial subscription */
  getTrialSubscription(subscriptionId: string): Observable<ApiResponse<TrialSubscription>> {
    return this.http.get<ApiResponse<TrialSubscription>>(
      this.apiUrlService.url(API_ENDPOINTS.STRIPE.SUBSCRIPTION_PAYMENT_INTENT.TRIAL.SUBSCRIPTION(subscriptionId))
    );
  }

  /** Cancel trial subscription */
  cancelTrialSubscription(subscriptionId: string, immediate: boolean = false): Observable<ApiResponse<CancelTrialSubscriptionResponse>> {
    return this.http.post<ApiResponse<CancelTrialSubscriptionResponse>>(
      this.apiUrlService.url(API_ENDPOINTS.STRIPE.SUBSCRIPTION_PAYMENT_INTENT.TRIAL.CANCEL_SUBSCRIPTION(subscriptionId)),
      { immediate }
    );
  }

  // ==================== Trial Invoice Management ====================

  /** Get user's trial invoices */
  getTrialInvoices(subscriptionId?: string): Observable<ApiResponse<TrialInvoice[]>> {
    const params = subscriptionId ? `?subscription_id=${subscriptionId}` : '';
    return this.http.get<ApiResponse<TrialInvoice[]>>(
      this.apiUrlService.url(API_ENDPOINTS.STRIPE.SUBSCRIPTION_PAYMENT_INTENT.TRIAL.INVOICES) + params
    );
  }

  /** Get a single trial invoice */
  getTrialInvoice(invoiceId: string): Observable<ApiResponse<TrialInvoice>> {
    return this.http.get<ApiResponse<TrialInvoice>>(
      this.apiUrlService.url(API_ENDPOINTS.STRIPE.SUBSCRIPTION_PAYMENT_INTENT.TRIAL.INVOICE(invoiceId))
    );
  }

  /** Download trial invoice PDF */
  downloadTrialInvoice(invoiceId: string): Observable<ApiResponse<{ pdf_url: string }>> {
    return this.http.get<ApiResponse<{ pdf_url: string }>>(
      this.apiUrlService.url(API_ENDPOINTS.STRIPE.SUBSCRIPTION_PAYMENT_INTENT.TRIAL.DOWNLOAD_INVOICE(invoiceId))
    );
  }

  // ==================== Subscription with Coupon ====================

  /** Get subscription products for coupon */
  getCouponProducts(): Observable<ApiResponse<SubscriptionProduct[]>> {
    return this.http.get<ApiResponse<SubscriptionProduct[]>>(
      this.apiUrlService.url(API_ENDPOINTS.STRIPE.SUBSCRIPTION_PAYMENT_INTENT.COUPON.PRODUCTS)
    );
  }

  /** Get single product for coupon */
  getCouponProduct(productId: string): Observable<ApiResponse<SubscriptionProduct>> {
    return this.http.get<ApiResponse<SubscriptionProduct>>(
      this.apiUrlService.url(API_ENDPOINTS.STRIPE.SUBSCRIPTION_PAYMENT_INTENT.COUPON.PRODUCT(productId))
    );
  }

  /** Get all available coupons */
  getCoupons(): Observable<ApiResponse<Coupon[]>> {
    return this.http.get<ApiResponse<Coupon[]>>(
      this.apiUrlService.url(API_ENDPOINTS.STRIPE.SUBSCRIPTION_PAYMENT_INTENT.COUPON.COUPONS)
    );
  }

  /** Validate a coupon */
  validateCoupon(couponId: string): Observable<ApiResponse<CouponValidationResponse>> {
    return this.http.post<ApiResponse<CouponValidationResponse>>(
      this.apiUrlService.url(API_ENDPOINTS.STRIPE.SUBSCRIPTION_PAYMENT_INTENT.COUPON.VALIDATE),
      { coupon_id: couponId }
    );
  }

  /** Calculate discount for coupon */
  calculateCouponDiscount(amount: number, couponId: string): Observable<ApiResponse<DiscountCalculationResponse>> {
    return this.http.post<ApiResponse<DiscountCalculationResponse>>(
      this.apiUrlService.url(API_ENDPOINTS.STRIPE.SUBSCRIPTION_PAYMENT_INTENT.COUPON.CALCULATE_DISCOUNT),
      { amount, coupon_id: couponId }
    );
  }

  /** Create SetupIntent for subscription with coupon */
  createCouponSetupIntent(priceId: string, couponId: string): Observable<ApiResponse<SetupIntentResponse>> {
    return this.http.post<ApiResponse<SetupIntentResponse>>(
      this.apiUrlService.url(API_ENDPOINTS.STRIPE.SUBSCRIPTION_PAYMENT_INTENT.COUPON.SETUP_INTENT),
      { price_id: priceId, coupon_id: couponId }
    );
  }

  /** Create subscription with coupon */
  createCouponSubscription(priceId: string, paymentMethodId: string, couponId: string): Observable<ApiResponse<SubscriptionResponse>> {
    return this.http.post<ApiResponse<SubscriptionResponse>>(
      this.apiUrlService.url(API_ENDPOINTS.STRIPE.SUBSCRIPTION_PAYMENT_INTENT.COUPON.CREATE),
      { price_id: priceId, payment_method_id: paymentMethodId, coupon_id: couponId }
    );
  }

  /** Confirm coupon subscription status */
  confirmCouponSubscription(subscriptionId: string): Observable<ApiResponse<SubscriptionConfirmation>> {
    return this.http.post<ApiResponse<SubscriptionConfirmation>>(
      this.apiUrlService.url(API_ENDPOINTS.STRIPE.SUBSCRIPTION_PAYMENT_INTENT.COUPON.CONFIRM),
      { subscription_id: subscriptionId }
    );
  }

  // ==================== Subscription with Promo Code ====================

  /** Get subscription products for promo code */
  getPromoCodeProducts(): Observable<ApiResponse<SubscriptionProduct[]>> {
    return this.http.get<ApiResponse<SubscriptionProduct[]>>(
      this.apiUrlService.url(API_ENDPOINTS.STRIPE.SUBSCRIPTION_PAYMENT_INTENT.PROMOCODE.PRODUCTS)
    );
  }

  /** Get single product for promo code */
  getPromoCodeProduct(productId: string): Observable<ApiResponse<SubscriptionProduct>> {
    return this.http.get<ApiResponse<SubscriptionProduct>>(
      this.apiUrlService.url(API_ENDPOINTS.STRIPE.SUBSCRIPTION_PAYMENT_INTENT.PROMOCODE.PRODUCT(productId))
    );
  }

  /** Validate a promo code */
  validatePromoCode(code: string): Observable<ApiResponse<PromoCodeValidationResponse>> {
    return this.http.post<ApiResponse<PromoCodeValidationResponse>>(
      this.apiUrlService.url(API_ENDPOINTS.STRIPE.SUBSCRIPTION_PAYMENT_INTENT.PROMOCODE.VALIDATE),
      { code }
    );
  }

  /** Calculate discount for promo code */
  calculatePromoCodeDiscount(amount: number, code: string): Observable<ApiResponse<DiscountCalculationResponse>> {
    return this.http.post<ApiResponse<DiscountCalculationResponse>>(
      this.apiUrlService.url(API_ENDPOINTS.STRIPE.SUBSCRIPTION_PAYMENT_INTENT.PROMOCODE.CALCULATE_DISCOUNT),
      { amount, code }
    );
  }

  /** Create SetupIntent for subscription with promo code */
  createPromoCodeSetupIntent(priceId: string, promoCode: string): Observable<ApiResponse<SetupIntentResponse>> {
    return this.http.post<ApiResponse<SetupIntentResponse>>(
      this.apiUrlService.url(API_ENDPOINTS.STRIPE.SUBSCRIPTION_PAYMENT_INTENT.PROMOCODE.SETUP_INTENT),
      { price_id: priceId, promo_code: promoCode }
    );
  }

  /** Create subscription with promo code */
  createPromoCodeSubscription(priceId: string, paymentMethodId: string, promoCode: string): Observable<ApiResponse<SubscriptionResponse>> {
    return this.http.post<ApiResponse<SubscriptionResponse>>(
      this.apiUrlService.url(API_ENDPOINTS.STRIPE.SUBSCRIPTION_PAYMENT_INTENT.PROMOCODE.CREATE),
      { price_id: priceId, payment_method_id: paymentMethodId, promo_code: promoCode }
    );
  }

  /** Confirm promo code subscription status */
  confirmPromoCodeSubscription(subscriptionId: string): Observable<ApiResponse<SubscriptionConfirmation>> {
    return this.http.post<ApiResponse<SubscriptionConfirmation>>(
      this.apiUrlService.url(API_ENDPOINTS.STRIPE.SUBSCRIPTION_PAYMENT_INTENT.PROMOCODE.CONFIRM),
      { subscription_id: subscriptionId }
    );
  }
}

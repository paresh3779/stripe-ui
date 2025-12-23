/**
 * Subscription PaymentIntent related interfaces
 */

import { Coupon, PromoCode } from './stripe.interface';

/** Setup intent response for collecting payment method */
export interface SetupIntentResponse {
  clientSecret: string;
  setupIntentId: string;
  customerId: string;
  price: {
    id: string;
    amount: number;
    currency: string;
    interval: string;
  };
  trialDays?: number;
  discount?: DiscountInfo;
  coupon?: Coupon;
  promoCode?: PromoCode;
}

/** Discount calculation info */
export interface DiscountInfo {
  original_amount: number;
  discount_amount: number;
  final_amount: number;
}

/** Subscription creation response */
export interface SubscriptionResponse {
  subscriptionId: string;
  clientSecret: string | null;
  status: string;
  amount: number;
  currency: string;
  interval: string;
  paymentId: string;
  originalAmount?: number;
  discountAmount?: number;
  finalAmount?: number;
  trialEnd?: number;
  trialDays?: number;
  coupon?: Coupon;
  promoCode?: PromoCode;
}

/** Subscription confirmation response */
export interface SubscriptionConfirmation {
  status: string;
  subscription: {
    id: string;
    status: string;
    current_period_start: number;
    current_period_end: number;
  };
  payment?: unknown;
}

/** Create subscription request */
export interface CreateSubscriptionRequest {
  price_id: string;
  payment_method_id: string;
}

/** Create subscription with coupon request */
export interface CreateSubscriptionWithCouponRequest {
  price_id: string;
  payment_method_id: string;
  coupon_id: string;
}

/** Create subscription with promo code request */
export interface CreateSubscriptionWithPromoCodeRequest {
  price_id: string;
  payment_method_id: string;
  promo_code: string;
}

/** Trial info response */
export interface TrialInfoResponse {
  has_trial: boolean;
  trial_days: number;
  price: unknown;
}

/** Coupon validation response */
export interface CouponValidationResponse {
  valid: boolean;
  coupon: Coupon;
}

/** Promo code validation response */
export interface PromoCodeValidationResponse {
  valid: boolean;
  promoCode: PromoCode;
  coupon: Coupon;
}

/** Discount calculation response */
export interface DiscountCalculationResponse {
  original_amount: number;
  discount_amount: number;
  final_amount: number;
  coupon?: Coupon;
  promo_code?: PromoCode;
}

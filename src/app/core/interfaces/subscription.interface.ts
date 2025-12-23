/**
 * Subscription-related interfaces for Stripe Checkout
 */

import { Coupon, Price, Product, PromoCode } from './stripe.interface';

/** Subscription product with recurring pricing options */
export interface SubscriptionProduct extends Product {
  prices?: SubscriptionPrice[];
}

/** Recurring price for subscription billing */
export interface SubscriptionPrice extends Price {
  interval: 'month' | 'year';
  interval_count: number;
  trial_days?: number;
}

/** Trial information for a subscription price */
export interface TrialInfo {
  has_trial: boolean;
  trial_days: number;
  price: SubscriptionPrice;
}

/** Discount calculation result */
export interface DiscountCalculation {
  original_amount: number;
  discount_amount: number;
  final_amount: number;
  coupon?: Coupon;
  promo_code?: PromoCode;
}

/** Coupon validation result */
export interface CouponValidation {
  valid: boolean;
  coupon: Coupon;
}

/** Promo code validation result */
export interface PromoCodeValidation {
  valid: boolean;
  promoCode: PromoCode;
  coupon: Coupon;
}

/** Subscription checkout session response */
export interface SubscriptionCheckoutSession {
  sessionId: string;
  url: string;
}

/** Billing interval type */
export type BillingInterval = 'month' | 'year';

/** Subscription checkout request payload */
export interface SubscriptionCheckoutRequest {
  price_id: string;
}

/** Subscription checkout with coupon request */
export interface SubscriptionCouponCheckoutRequest {
  price_id: string;
  coupon_id: string;
}

/** Subscription checkout with promo code request */
export interface SubscriptionPromoCodeCheckoutRequest {
  price_id: string;
  promo_code: string;
}

/** Calculate discount request */
export interface CalculateDiscountRequest {
  amount: number;
  coupon_id?: string;
  code?: string;
}

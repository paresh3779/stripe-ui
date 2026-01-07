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

/** User subscription with related data */
export interface UserSubscription {
  id: string;
  stripe_subscription_id: string;
  status: 'active' | 'past_due' | 'unpaid' | 'canceled' | 'incomplete' | 'incomplete_expired' | 'trialing' | 'paused';
  product: {
    id: string;
    name: string;
    description: string;
  };
  price: {
    id: string;
    amount: number;
    currency: string;
    interval: 'month' | 'year';
  };
  current_period_start: string | null;
  current_period_end: string | null;
  trial_end: string | null;
  canceled_at: string | null;
  cancel_at_period_end: boolean;
  can_cancel: boolean;
  can_refund: boolean;
  days_until_refund_expires: number;
  created_at: string;
  invoices: UserInvoice[];
}

/** User invoice */
export interface UserInvoice {
  id: string;
  number: string | null;
  stripe_invoice_id: string;
  status: 'draft' | 'open' | 'paid' | 'uncollectible' | 'void';
  amount_due: number;
  amount_paid: number;
  subtotal: number;
  total: number;
  tax: number;
  currency: string;
  description: string | null;
  hosted_invoice_url: string | null;
  invoice_pdf: string | null;
  due_date: string | null;
  paid_at: string | null;
  period_start: string | null;
  period_end: string | null;
  subscription?: {
    id: string;
    product_name: string;
  };
  created_at: string;
}

/** Cancel subscription response */
export interface CancelSubscriptionResponse {
  subscription: UserSubscription;
  refund: {
    success: boolean;
    refund_id?: string;
    amount?: number;
    currency?: string;
    status?: string;
    message?: string;
  } | null;
}

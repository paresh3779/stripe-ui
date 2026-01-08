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
    stripe_price_id?: string;
    amount: number;
    currency: string;
    interval: string;
  };
  trialDays?: number;
  discount?: DiscountInfo;
  coupon?: Coupon;
  promoCode?: PromoCode;
  savedPaymentMethods?: SavedPaymentMethod[];
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

/** Saved payment method */
export interface SavedPaymentMethod {
  id: string;
  stripe_payment_method_id: string;
  type: string;
  card_brand: string | null;
  last4: string | null;
  exp_month: number | null;
  exp_year: number | null;
  is_default: boolean;
}

/** Trial subscription */
export interface TrialSubscription {
  id: string;
  stripe_subscription_id: string;
  status: 'active' | 'past_due' | 'unpaid' | 'canceled' | 'incomplete' | 'incomplete_expired' | 'trialing' | 'paused';
  product: {
    id: string;
    name: string;
    description: string;
  } | null;
  price: {
    id?: string;
    amount: number;
    currency: string;
    interval: string;
  };
  trial_start: string | null;
  trial_end: string | null;
  current_period_start: string | null;
  current_period_end: string | null;
  canceled_at: string | null;
  cancel_at_period_end: boolean;
  can_cancel: boolean;
  can_refund: boolean;
  days_until_refund_expires: number;
  is_trialing: boolean;
  created_at: string;
  invoices: TrialInvoice[];
}

/** Trial invoice */
export interface TrialInvoice {
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

/** Cancel trial subscription response */
export interface CancelTrialSubscriptionResponse {
  subscription: TrialSubscription;
  refund: {
    success: boolean;
    refund_id?: string;
    amount?: number;
    currency?: string;
    status?: string;
    message?: string;
  } | null;
}

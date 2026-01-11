/** Stripe product with pricing options */
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

/** Pricing option for a product (one-time or recurring) */
export interface Price {
  id: string;
  product_id: string;
  stripe_price_id: string;
  description: string;
  amount: number; // Amount in cents
  currency: string;
  type: string;
  interval?: string;
  interval_count?: number;
  trial_days?: number;
  features?: string[];
  active: boolean;
}

/** Discount coupon for checkout */
export interface Coupon {
  id: string;
  name: string;
  description: string;
  stripe_coupon_id: string;
  discount_type: string; // 'percentage' or 'fixed_amount'
  discount_value: number;
  currency: string;
  duration: string;
  active: boolean;
}

/** Promotional code that links to a coupon */
export interface PromoCode {
  id: string;
  coupon_id: string;
  code: string;
  description: string;
  stripe_promotion_code_id: string;
  active: boolean;
  coupon?: Coupon;
}

/** Stripe Checkout Session with redirect URL */
export interface CheckoutSession {
  sessionId: string;
  url: string;
}

/** Checkout Session Verification Result */
export interface CheckoutSessionVerification {
  verified: boolean;
  session_id: string;
  status: string;
  payment_status: string;
  customer_email: string | null;
  amount_total: number;
  currency: string;
  payment_intent: string | null;
  is_paid: boolean;
  is_complete: boolean;
}

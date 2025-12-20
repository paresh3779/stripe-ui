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

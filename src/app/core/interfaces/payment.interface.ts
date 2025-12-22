/**
 * Interface for Product
 */
export interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  type: string;
  active: boolean;
  prices: Price[];
}

/**
 * Interface for Price
 */
export interface Price {
  id: string;
  product_id: string;
  amount: number;
  currency: string;
  type: string;
  description: string;
  active: boolean;
}

/**
 * Interface for Coupon
 */
export interface Coupon {
  id: string;
  name: string;
  description: string;
  discount_type: string;
  discount_value: number;
  currency: string;
  active: boolean;
}

/**
 * Interface for PromoCode
 */
export interface PromoCode {
  id: string;
  code: string;
  description: string;
  coupon_id: string;
  active: boolean;
  coupon?: Coupon;
}

/**
 * Interface for PaymentIntent response
 */
export interface PaymentIntentResponse {
  clientSecret: string;
  paymentIntentId: string;
  amount: number;
  currency: string;
  paymentId: string;
  originalAmount?: number;
  discountAmount?: number;
  promoCode?: string;
  coupon?: Coupon;
}

/**
 * Interface for PromoCode validation
 */
export interface PromoCodeValidation {
  valid: boolean;
  promo_code: PromoCode;
  coupon: Coupon;
  original_amount: number;
  discount_amount: number;
  final_amount: number;
  discount_type: string;
  discount_value: number;
}

/**
 * Interface for Coupon validation
 */
export interface CouponValidation {
  valid: boolean;
  coupon: Coupon;
  original_amount: number;
  discount_amount: number;
  final_amount: number;
  discount_type: string;
  discount_value: number;
}

/**
 * Interface for API Response
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: any;
}

/**
 * Interface for Payment
 */
export interface Payment {
  id: string;
  user_id: string;
  product_id: string;
  price_id: string;
  stripe_payment_intent_id: string;
  stripe_charge_id?: string;
  amount: number;
  currency: string;
  status: string;
  payment_method?: string;
  billing_reason: string;
  paid_at?: string;
  created_at: string;
  updated_at: string;
}

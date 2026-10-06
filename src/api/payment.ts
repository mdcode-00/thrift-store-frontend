import { axiosInstance } from '@/api/axiosInstance';
import type { Address } from '@/types';

export const checkoutCart = (shippingAddress?: Address) =>
  axiosInstance.post('/payment/checkout-cart', { shippingAddress });

export const verifyCart = (payload: {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}) => axiosInstance.post('/payment/verify-cart', payload);

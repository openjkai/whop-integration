// Whop API Types

export interface WhopUser {
  id: string;
  email: string;
  username?: string;
  profile_pic_url?: string;
}

export interface WhopMembership {
  id: string;
  user_id: string;
  product_id: string;
  plan_id: string;
  status: 'active' | 'cancelled' | 'past_due' | 'trialing' | 'expired';
  valid: boolean;
  created_at: number;
  renewal_period_start: number;
  renewal_period_end: number;
  cancel_at_period_end: boolean;
  license_key?: string;
  metadata?: Record<string, any>;
}

export interface WhopProduct {
  id: string;
  name: string;
  description?: string;
  price: number;
  currency: string;
  created_at: number;
}

export interface WhopPlan {
  id: string;
  product_id: string;
  plan_type: 'one_time' | 'monthly' | 'yearly' | 'quarterly' | 'lifetime';
  price: number;
  currency: string;
  billing_period?: number;
  created_at: number;
}

export interface WhopWebhookEvent {
  event: 'membership.created' | 'membership.updated' | 'membership.deleted' | 'payment.succeeded' | 'payment.failed';
  data: {
    membership?: WhopMembership;
    payment?: any;
  };
  created_at: number;
}

export interface CreateCheckoutResponse {
  checkout_url: string;
  checkout_session_id: string;
}

export interface SubscriptionResponse {
  success: boolean;
  message?: string;
  data?: any;
}


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
  image_url?: string;
  created_at: number;
  visibility?: 'visible' | 'hidden' | 'archived';
  product_type?: string;
  active_memberships_count?: number;
  experiences?: any[];
  metadata?: Record<string, any>;
}

export interface WhopPlan {
  id: string;
  created_at: string;
  updated_at: string;
  visibility: 'visible' | 'hidden' | 'archived';
  plan_type: 'renewal' | 'one_time' | 'pre_sale' | 'free_trial';
  release_method: 'buy_now' | 'whitelist' | 'nft_gate' | 'waitlist';
  currency: string;
  company: {
    id: string;
    title: string;
  };
  product: {
    id: string;
    title: string;
  };
  billing_period: number | null;
  title: string | null;
  description: string | null;
  purchase_url: string;
  expiration_days: number | null;
  initial_price: number;
  renewal_price: number;
  trial_period_days: number | null;
  member_count: number;
  stock: number;
  unlimited_stock: boolean;
  internal_notes: string | null;
  payment_method_configuration: any;
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


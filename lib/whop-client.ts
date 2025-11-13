// Whop API Client
import axios, { AxiosInstance } from 'axios';
import type {
  WhopMembership,
  WhopUser,
  WhopProduct,
  CreateCheckoutResponse,
} from '@/types/whop';

export class WhopClient {
  private client: AxiosInstance;
  private apiKey: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.WHOP_API_KEY || '';
    
    this.client = axios.create({
      baseURL: 'https://api.whop.com/v1',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
    });
  }

  // Get user membership details
  async getMembership(membershipId: string): Promise<WhopMembership> {
    const response = await this.client.get(`/memberships/${membershipId}`);
    return response.data;
  }

  // Get all memberships for a user
  async getUserMemberships(userId: string): Promise<WhopMembership[]> {
    const response = await this.client.get('/memberships', {
      params: { user_id: userId },
    });
    return response.data.data || [];
  }

  // Get user details
  async getUser(userId: string): Promise<WhopUser> {
    const response = await this.client.get(`/users/${userId}`);
    return response.data;
  }

  // Verify membership is valid
  async verifyMembership(membershipId: string): Promise<boolean> {
    try {
      const membership = await this.getMembership(membershipId);
      return membership.valid && membership.status === 'active';
    } catch (error) {
      console.error('Error verifying membership:', error);
      return false;
    }
  }

  // Create checkout session
  async createCheckout(
    planId: string,
    metadata?: Record<string, any>
  ): Promise<CreateCheckoutResponse> {
    const response = await this.client.post('/checkout_sessions', {
      plan_id: planId,
      metadata: metadata || {},
    });
    
    return {
      checkout_url: response.data.checkout_url,
      checkout_session_id: response.data.id,
    };
  }

  // Cancel membership at period end
  async cancelMembership(membershipId: string): Promise<WhopMembership> {
    const response = await this.client.post(`/memberships/${membershipId}/cancel`);
    return response.data;
  }

  // Reactivate a cancelled membership
  async reactivateMembership(membershipId: string): Promise<WhopMembership> {
    const response = await this.client.post(`/memberships/${membershipId}/reactivate`);
    return response.data;
  }

  // Update membership metadata
  async updateMembership(
    membershipId: string,
    metadata: Record<string, any>
  ): Promise<WhopMembership> {
    const response = await this.client.patch(`/memberships/${membershipId}`, {
      metadata,
    });
    return response.data;
  }

  // Get product details
  async getProduct(productId: string): Promise<WhopProduct> {
    const response = await this.client.get(`/products/${productId}`);
    return response.data;
  }

  // List all products
  async listProducts(): Promise<WhopProduct[]> {
    const response = await this.client.get('/products');
    return response.data.data || [];
  }
}

// Export singleton instance
export const whopClient = new WhopClient();


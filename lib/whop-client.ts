// Whop API Client using official Whop SDK
import Whop from '@whop/sdk';
import axios, { AxiosInstance } from 'axios';
import type {
  WhopMembership,
  WhopUser,
  WhopProduct,
  WhopPlan,
  CreateCheckoutResponse,
} from '@/types/whop';

export class WhopClient {
  private client: AxiosInstance;
  private sdk: Whop;
  private apiKey: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.WHOP_API_KEY || '';
    const webhookSecret = process.env.WHOP_WEBHOOK_SECRET || '';
    
    // Initialize official Whop SDK with webhook verification
    this.sdk = new Whop({
      apiKey: this.apiKey,
      webhookKey: webhookSecret ? Buffer.from(webhookSecret).toString('base64') : undefined,
    });
    
    // Keep axios client for backward compatibility
    this.client = axios.create({
      baseURL: 'https://api.whop.com/v1',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
    });
  }
  
  // Get the SDK instance for webhook verification
  getSDK() {
    return this.sdk;
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

  // Get product details (legacy method for backward compatibility)
  async getProduct(productId: string): Promise<WhopProduct> {
    const product = await this.getProductById(productId);
    if (!product) {
      throw new Error(`Product ${productId} not found`);
    }
    return product;
  }

  // List all products using official SDK
  async listProducts(companyId: string): Promise<WhopProduct[]> {
    try {
      const products: WhopProduct[] = [];
      
      // Use the official SDK to fetch all products
      for await (const product of this.sdk.products.list({ company_id: companyId })) {
        products.push(product as WhopProduct);
      }
      
      return products;
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  }

  // Get a specific product
  async getProductById(productId: string): Promise<WhopProduct | null> {
    try {
      const product = await this.sdk.products.retrieve(productId);
      return product as WhopProduct;
    } catch (error) {
      console.error('Error fetching product:', error);
      return null;
    }
  }

  // List all plans for a company using official SDK
  async listPlans(companyId: string): Promise<WhopPlan[]> {
    try {
      const plans: WhopPlan[] = [];
      
      // Use the official SDK to fetch all plans
      for await (const plan of this.sdk.plans.list({ company_id: companyId })) {
        plans.push(plan as WhopPlan);
      }
      
      return plans;
    } catch (error) {
      console.error('Error fetching plans:', error);
      return [];
    }
  }

  // Get a specific plan
  async getPlan(planId: string): Promise<WhopPlan | null> {
    try {
      const plan = await this.sdk.plans.retrieve(planId);
      return plan as WhopPlan;
    } catch (error) {
      console.error('Error fetching plan:', error);
      return null;
    }
  }
}

// Export singleton instance
export const whopClient = new WhopClient();


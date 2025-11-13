// Examples of using the Whop SDK

import Whop from '@whop/sdk';
import { whopClient } from '@/lib/whop-client';

// ============================================
// Example 1: Direct SDK Usage
// ============================================

export async function directSdkExample() {
  const whop = new Whop({
    apiKey: process.env.WHOP_API_KEY,
  });

  const companyId = process.env.WHOP_COMPANY_ID || '';

  // Fetch all plans for your company
  console.log('Fetching plans...');
  for await (const plan of whop.plans.list({ company_id: companyId })) {
    console.log(`Plan ID: ${plan.id}`);
    console.log(`Type: ${plan.plan_type}`);
    console.log(`Price: ${plan.price / 100} ${plan.currency}`);
    console.log('---');
  }
}

// ============================================
// Example 2: Using the WhopClient Wrapper
// ============================================

export async function whopClientExample() {
  const companyId = process.env.WHOP_COMPANY_ID || '';

  // Get all plans using our wrapper
  const plans = await whopClient.listPlans(companyId);
  
  console.log(`Found ${plans.length} plans:`);
  plans.forEach(plan => {
    console.log(`- ${plan.id}: ${plan.plan_type} (${plan.price / 100} ${plan.currency})`);
  });
}

// ============================================
// Example 3: Get Specific Plan Details
// ============================================

export async function getPlanDetailsExample(planId: string) {
  const plan = await whopClient.getPlan(planId);
  
  if (plan) {
    console.log('Plan Details:');
    console.log(`ID: ${plan.id}`);
    console.log(`Type: ${plan.plan_type}`);
    console.log(`Price: ${plan.price / 100} ${plan.currency}`);
    console.log(`Product ID: ${plan.product_id}`);
  } else {
    console.log('Plan not found');
  }
}

// ============================================
// Example 4: Fetch Plans in a Next.js Page
// ============================================

export async function fetchPlansForPage() {
  const companyId = process.env.WHOP_COMPANY_ID || '';
  
  try {
    const plans = await whopClient.listPlans(companyId);
    
    // Transform plans for display
    const displayPlans = plans.map(plan => ({
      id: plan.id,
      name: plan.plan_type.charAt(0).toUpperCase() + plan.plan_type.slice(1),
      price: `$${(plan.price / 100).toFixed(2)}`,
      currency: plan.currency,
      billingPeriod: plan.plan_type,
    }));
    
    return displayPlans;
  } catch (error) {
    console.error('Error fetching plans:', error);
    return [];
  }
}

// ============================================
// Example 5: Filter Plans by Type
// ============================================

export async function getMonthlyPlans() {
  const companyId = process.env.WHOP_COMPANY_ID || '';
  const allPlans = await whopClient.listPlans(companyId);
  
  // Filter for monthly plans only
  const monthlyPlans = allPlans.filter(plan => plan.plan_type === 'monthly');
  
  return monthlyPlans;
}

// ============================================
// Example 6: Get Plan with Product Info
// ============================================

export async function getPlanWithProduct(planId: string) {
  const plan = await whopClient.getPlan(planId);
  
  if (!plan) {
    return null;
  }
  
  // Get associated product information
  const product = await whopClient.getProduct(plan.product_id);
  
  return {
    plan,
    product,
    displayName: product.name,
    fullPrice: `$${(plan.price / 100).toFixed(2)} / ${plan.plan_type}`,
  };
}

// ============================================
// Example 7: Create Checkout with Plan
// ============================================

export async function createCheckoutForPlan(planId: string, userId: string) {
  try {
    const checkout = await whopClient.createCheckout(planId, {
      user_id: userId,
      source: 'website',
    });
    
    console.log('Checkout URL:', checkout.checkout_url);
    return checkout.checkout_url;
  } catch (error) {
    console.error('Error creating checkout:', error);
    return null;
  }
}

// ============================================
// Example 8: Using in API Route
// ============================================

/*
// In app/api/plans/route.ts

import { NextResponse } from 'next/server';
import { whopClient } from '@/lib/whop-client';

export async function GET() {
  const companyId = process.env.WHOP_COMPANY_ID || '';
  const plans = await whopClient.listPlans(companyId);
  
  return NextResponse.json({
    success: true,
    data: plans,
  });
}
*/

// ============================================
// Example 9: Using in Server Component
// ============================================

/*
// In app/products/page.tsx

import { whopClient } from '@/lib/whop-client';

export default async function ProductsPage() {
  const companyId = process.env.WHOP_COMPANY_ID!;
  const plans = await whopClient.listPlans(companyId);
  
  return (
    <div>
      <h1>Available Plans</h1>
      {plans.map(plan => (
        <div key={plan.id}>
          <h2>{plan.plan_type}</h2>
          <p>${(plan.price / 100).toFixed(2)}</p>
        </div>
      ))}
    </div>
  );
}
*/

// ============================================
// Example 10: Error Handling
// ============================================

export async function safeFetchPlans() {
  const companyId = process.env.WHOP_COMPANY_ID || '';
  
  try {
    const plans = await whopClient.listPlans(companyId);
    return { success: true, plans, error: null };
  } catch (error) {
    console.error('Failed to fetch plans:', error);
    return { 
      success: false, 
      plans: [], 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}


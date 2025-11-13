import PricingCard from '@/components/PricingCard';
import Link from 'next/link';
import { whopClient } from '@/lib/whop-client';

// Helper function to format price (Whop prices are in dollars)
function formatPrice(priceInDollars: number, currency: string = 'usd'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
    minimumFractionDigits: 2,
  }).format(priceInDollars);
}

// Helper function to get billing period text
function getBillingPeriod(billingPeriodDays: number | null, planType: string): string {
  if (!billingPeriodDays) {
    if (planType === 'one_time') return 'one-time';
    if (planType === 'free_trial') return 'trial';
    return 'subscription';
  }
  
  if (billingPeriodDays === 30) return 'month';
  if (billingPeriodDays === 365) return 'year';
  if (billingPeriodDays === 90) return 'quarter';
  if (billingPeriodDays === 7) return 'week';
  
  return `${billingPeriodDays} days`;
}

export default async function PricingPage() {
  const companyId = process.env.WHOP_COMPANY_ID || '';
  
  // Fetch plans from Whop API
  let whopPlans = await whopClient.listPlans(companyId);
 
  console.log('Plans data:', whopPlans);
  
  // Filter only visible and buyable plans
  whopPlans = whopPlans.filter(
    plan => plan.visibility === 'visible' && plan.release_method === 'buy_now'
  );
  
  // If no plans fetched, use example plans
  const plans = whopPlans.length > 0 
    ? whopPlans.map((plan, index) => {
        const hasFreeTrial = plan.trial_period_days && plan.trial_period_days > 0;
        
        // If initial price is 0, show renewal price (for free trials or free start plans)
        const displayPrice = plan.initial_price === 0 && plan.renewal_price > 0
          ? formatPrice(plan.renewal_price, plan.currency)
          : formatPrice(plan.initial_price, plan.currency);
        
        return {
          planId: plan.id,
          purchaseUrl: plan.purchase_url,
          name: plan.title || plan.product.title,
          description: plan.description || `${plan.product.title} subscription`,
          price: displayPrice,
          period: getBillingPeriod(plan.billing_period, plan.plan_type),
          initialPrice: plan.initial_price,
          renewalPrice: plan.renewal_price,
          trialDays: plan.trial_period_days,
          billingPeriod: plan.billing_period,
          features: [
            plan.plan_type === 'renewal' ? 'Recurring subscription' : 'One-time purchase',
            plan.initial_price === 0 && plan.renewal_price > 0 
              ? hasFreeTrial 
                ? `${plan.trial_period_days} days free trial, then ${formatPrice(plan.renewal_price, plan.currency)}`
                : `First period free, then ${formatPrice(plan.renewal_price, plan.currency)}`
              : 'Instant access',
            plan.unlimited_stock ? 'Unlimited availability' : `${plan.stock} spots left`,
            plan.billing_period ? `Billed every ${plan.billing_period} days` : 'One-time payment',
            'Cancel anytime',
          ],
          highlighted: index === 0, // Highlight first plan
          memberCount: plan.member_count,
        };
      })
    : [
        // Fallback plans if API fails or no plans found
        {
          planId: 'plan_starter_monthly',
          name: 'Starter',
          description: 'Perfect for individuals getting started',
          price: '$9.99',
          period: 'month',
          features: [
            'Access to basic features',
            'Community support',
            'Monthly updates',
            'Email notifications',
            'Cancel anytime',
          ],
          highlighted: false,
        },
        {
          planId: 'plan_pro_monthly',
          name: 'Pro',
          description: 'Best for professionals and small teams',
          price: '$29.99',
          period: 'month',
          features: [
            'All Starter features',
            'Priority support',
            'Advanced analytics',
            'API access',
            'Custom integrations',
            'Team collaboration',
          ],
          highlighted: true,
        },
        {
          planId: 'plan_enterprise_monthly',
          name: 'Enterprise',
          description: 'For large organizations with special needs',
          price: '$99.99',
          period: 'month',
          features: [
            'All Pro features',
            'Dedicated support',
            'Custom solutions',
            'SLA guarantee',
            'Advanced security',
            'Unlimited users',
            'Custom contracts',
          ],
          highlighted: false,
        },
      ];

  return (
    <main
      style={{
        minHeight: '100vh',
        padding: '40px 20px',
        backgroundColor: '#f9fafb',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
        }}
      >
        <div style={{ marginBottom: '20px' }}>
          <Link
            href="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '14px',
              color: '#5B4FE9',
              textDecoration: 'none',
              fontWeight: '600',
            }}
          >
            ← Back to Home
          </Link>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h1
            style={{
              fontSize: '48px',
              fontWeight: '700',
              marginBottom: '16px',
              color: '#1f2937',
            }}
          >
            Choose Your Plan
          </h1>
          <p
            style={{
              fontSize: '20px',
              color: '#6b7280',
              maxWidth: '600px',
              margin: '0 auto',
            }}
          >
            Select the perfect subscription plan for your needs. Cancel anytime.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '32px',
            marginBottom: '60px',
          }}
        >
          {plans.map((plan) => (
            <PricingCard key={plan.planId} {...plan} />
          ))}
        </div>

        <div
          style={{
            padding: '32px',
            backgroundColor: 'white',
            borderRadius: '12px',
            textAlign: 'center',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          }}
        >
          <h2
            style={{
              fontSize: '24px',
              fontWeight: '600',
              marginBottom: '12px',
              color: '#1f2937',
            }}
          >
            Need a custom plan?
          </h2>
          <p
            style={{
              fontSize: '16px',
              color: '#6b7280',
              marginBottom: '20px',
            }}
          >
            Contact us for enterprise solutions tailored to your organization
          </p>
          <button
            style={{
              padding: '12px 32px',
              fontSize: '16px',
              fontWeight: '600',
              backgroundColor: '#1f2937',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
            }}
          >
            Contact Sales
          </button>
        </div>
      </div>
    </main>
  );
}


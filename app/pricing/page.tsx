import PricingCard from '@/components/PricingCard';
import Link from 'next/link';

export default function PricingPage() {
  // Replace these with your actual Whop plan IDs
  const plans = [
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


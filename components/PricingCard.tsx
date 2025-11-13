'use client';

import SubscriptionButton from './SubscriptionButton';

interface PricingCardProps {
  planId: string;
  name: string;
  description: string;
  price: string;
  period: string;
  features: string[];
  highlighted?: boolean;
}

export default function PricingCard({
  planId,
  name,
  description,
  price,
  period,
  features,
  highlighted = false,
}: PricingCardProps) {
  return (
    <div
      style={{
        padding: '32px',
        backgroundColor: 'white',
        border: highlighted ? '2px solid #5B4FE9' : '1px solid #e5e7eb',
        borderRadius: '12px',
        boxShadow: highlighted
          ? '0 10px 25px rgba(91, 79, 233, 0.2)'
          : '0 1px 3px rgba(0,0,0,0.1)',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      {highlighted && (
        <div
          style={{
            position: 'absolute',
            top: '-12px',
            left: '50%',
            transform: 'translateX(-50%)',
            padding: '4px 16px',
            backgroundColor: '#5B4FE9',
            color: 'white',
            borderRadius: '12px',
            fontSize: '12px',
            fontWeight: '600',
            textTransform: 'uppercase',
          }}
        >
          Most Popular
        </div>
      )}

      <div style={{ marginBottom: '24px' }}>
        <h3
          style={{
            fontSize: '24px',
            fontWeight: '700',
            marginBottom: '8px',
            color: '#1f2937',
          }}
        >
          {name}
        </h3>
        <p style={{ fontSize: '14px', color: '#6b7280' }}>{description}</p>
      </div>

      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
          <span
            style={{
              fontSize: '48px',
              fontWeight: '700',
              color: '#1f2937',
            }}
          >
            {price}
          </span>
          <span style={{ fontSize: '16px', color: '#6b7280' }}>/{period}</span>
        </div>
      </div>

      <div style={{ marginBottom: '24px', flex: 1 }}>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {features.map((feature, index) => (
            <li
              key={index}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '12px',
                fontSize: '14px',
                color: '#4b5563',
              }}
            >
              <span
                style={{
                  display: 'inline-block',
                  width: '20px',
                  height: '20px',
                  backgroundColor: '#d1fae5',
                  borderRadius: '50%',
                  textAlign: 'center',
                  lineHeight: '20px',
                  color: '#065f46',
                  fontWeight: '700',
                  fontSize: '12px',
                }}
              >
                ✓
              </span>
              {feature}
            </li>
          ))}
        </ul>
      </div>

      <SubscriptionButton
        planId={planId}
        planName={name}
        price={`${price}/${period}`}
      />
    </div>
  );
}


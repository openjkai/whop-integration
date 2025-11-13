'use client';

import { useState } from 'react';

interface SubscriptionButtonProps {
  planId: string;
  planName: string;
  price: string;
  metadata?: Record<string, any>;
  className?: string;
}

export default function SubscriptionButton({
  planId,
  planName,
  price,
  metadata,
  className = '',
}: SubscriptionButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubscribe = async () => {
    try {
      setLoading(true);
      setError(null);

      // Create checkout session
      const response = await fetch('/api/subscription/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planId,
          metadata,
        }),
      });

      const result = await response.json();

      if (result.success && result.data.checkout_url) {
        // Redirect to Whop checkout
        window.location.href = result.data.checkout_url;
      } else {
        setError(result.message || 'Failed to create checkout session');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      console.error('Subscribe error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="subscription-button-container">
      <button
        onClick={handleSubscribe}
        disabled={loading}
        className={`subscription-button ${className}`}
        style={{
          padding: '12px 24px',
          fontSize: '16px',
          fontWeight: '600',
          backgroundColor: loading ? '#ccc' : '#5B4FE9',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: loading ? 'not-allowed' : 'pointer',
          transition: 'all 0.2s',
        }}
      >
        {loading ? 'Processing...' : `Subscribe to ${planName} - ${price}`}
      </button>
      
      {error && (
        <div
          style={{
            marginTop: '12px',
            padding: '12px',
            backgroundColor: '#fee',
            color: '#c33',
            borderRadius: '4px',
            fontSize: '14px',
          }}
        >
          {error}
        </div>
      )}
    </div>
  );
}


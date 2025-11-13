'use client';

import { useState, useEffect } from 'react';
import type { WhopMembership } from '@/types/whop';

interface SubscriptionStatusProps {
  membershipId?: string;
  userId?: string;
}

export default function SubscriptionStatus({
  membershipId,
  userId,
}: SubscriptionStatusProps) {
  const [memberships, setMemberships] = useState<WhopMembership[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSubscriptionStatus();
  }, [membershipId, userId]);

  const fetchSubscriptionStatus = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (membershipId) params.append('membershipId', membershipId);
      if (userId) params.append('userId', userId);

      const response = await fetch(`/api/subscription/status?${params}`);
      const result = await response.json();

      if (result.success) {
        setMemberships(result.data.memberships || []);
      } else {
        setError(result.message || 'Failed to fetch subscription status');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      console.error('Fetch status error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      active: '#22c55e',
      cancelled: '#ef4444',
      past_due: '#f59e0b',
      trialing: '#3b82f6',
      expired: '#6b7280',
    };
    return colors[status] || '#6b7280';
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <p>Loading subscription status...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          padding: '20px',
          backgroundColor: '#fee',
          color: '#c33',
          borderRadius: '8px',
        }}
      >
        <p>Error: {error}</p>
      </div>
    );
  }

  if (memberships.length === 0) {
    return (
      <div
        style={{
          padding: '20px',
          backgroundColor: '#f9fafb',
          borderRadius: '8px',
          textAlign: 'center',
        }}
      >
        <p>No active subscriptions found.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ marginBottom: '20px', fontSize: '24px', fontWeight: '600' }}>
        Your Subscriptions
      </h2>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {memberships.map((membership) => (
          <div
            key={membership.id}
            style={{
              padding: '20px',
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
                  Subscription #{membership.id.slice(0, 8)}
                </h3>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  <span
                    style={{
                      padding: '4px 12px',
                      backgroundColor: getStatusColor(membership.status),
                      color: 'white',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '600',
                      textTransform: 'uppercase',
                    }}
                  >
                    {membership.status}
                  </span>
                  {membership.valid && (
                    <span
                      style={{
                        padding: '4px 12px',
                        backgroundColor: '#22c55e',
                        color: 'white',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '600',
                      }}
                    >
                      ✓ Valid
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ fontSize: '14px' }}>
                <strong>Product ID:</strong> {membership.product_id}
              </div>
              <div style={{ fontSize: '14px' }}>
                <strong>Plan ID:</strong> {membership.plan_id}
              </div>
              <div style={{ fontSize: '14px' }}>
                <strong>Created:</strong> {formatDate(membership.created_at)}
              </div>
              <div style={{ fontSize: '14px' }}>
                <strong>Current Period:</strong>{' '}
                {formatDate(membership.renewal_period_start)} -{' '}
                {formatDate(membership.renewal_period_end)}
              </div>
              {membership.cancel_at_period_end && (
                <div
                  style={{
                    marginTop: '8px',
                    padding: '8px',
                    backgroundColor: '#fef3c7',
                    color: '#92400e',
                    borderRadius: '4px',
                    fontSize: '14px',
                  }}
                >
                  ⚠️ Subscription will cancel at the end of the billing period
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


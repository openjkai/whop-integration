'use client';

import { useState } from 'react';
import Link from 'next/link';
import SubscriptionStatus from '@/components/SubscriptionStatus';
import CancelSubscription from '@/components/CancelSubscription';

export default function SubscriptionPage() {
  const [email, setEmail] = useState('');
  const [membershipId, setMembershipId] = useState('');
  const [userId, setUserId] = useState('');
  const [showStatus, setShowStatus] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [memberships, setMemberships] = useState<any[]>([]);

  const handleSearchByEmail = async () => {
    if (!email) {
      alert('Please enter your email');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/members/by-email?email=${encodeURIComponent(email)}`);
      const result = await response.json();

      if (result.success && result.data.memberships) {
        setMemberships(result.data.memberships);
        setUserId(result.data.member.user.id);
        setShowStatus(true);
      } else {
        setError(result.message || 'No subscription found for this email');
        setShowStatus(false);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch subscription');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckStatus = () => {
    if (membershipId || userId) {
      setShowStatus(true);
    } else {
      alert('Please enter a Membership ID or User ID');
    }
  };

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
          maxWidth: '1000px',
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

        <div style={{ marginBottom: '40px' }}>
          <h1
            style={{
              fontSize: '36px',
              fontWeight: '700',
              marginBottom: '16px',
              color: '#1f2937',
            }}
          >
            Manage Your Subscription
          </h1>
          <p style={{ fontSize: '16px', color: '#6b7280' }}>
            View your subscription details and manage your account
          </p>
        </div>

        {/* Search by Email Section */}
        <div
          style={{
            padding: '32px',
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            marginBottom: '32px',
          }}
        >
          <h2
            style={{
              fontSize: '20px',
              fontWeight: '600',
              marginBottom: '12px',
              color: '#1f2937',
            }}
          >
            Find Your Subscription
          </h2>
          <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '20px' }}>
            Enter the email you used to purchase your subscription
          </p>

          <div style={{ marginBottom: '20px' }}>
            <label
              htmlFor="email"
              style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: '600',
                color: '#374151',
              }}
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              onKeyPress={(e) => e.key === 'Enter' && handleSearchByEmail()}
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '16px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                outline: 'none',
              }}
            />
          </div>

          <button
            onClick={handleSearchByEmail}
            disabled={loading}
            style={{
              padding: '12px 32px',
              fontSize: '16px',
              fontWeight: '600',
              backgroundColor: loading ? '#9ca3af' : '#5B4FE9',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? 'Searching...' : 'Find My Subscription'}
          </button>

          {error && (
            <div
              style={{
                marginTop: '16px',
                padding: '12px',
                backgroundColor: '#fee',
                color: '#c33',
                borderRadius: '6px',
                fontSize: '14px',
              }}
            >
              {error}
            </div>
          )}
        </div>

        {/* Advanced Search Section (Collapsible) */}
        <details
          style={{
            padding: '32px',
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            marginBottom: '32px',
          }}
        >
          <summary
            style={{
              fontSize: '16px',
              fontWeight: '600',
              color: '#6b7280',
              cursor: 'pointer',
            }}
          >
            Advanced: Search by Membership ID or User ID
          </summary>

          <div style={{ marginTop: '20px' }}>
            <div style={{ marginBottom: '20px' }}>
              <label
                htmlFor="membershipId"
                style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151',
                }}
              >
                Membership ID
              </label>
              <input
                id="membershipId"
                type="text"
                value={membershipId}
                onChange={(e) => setMembershipId(e.target.value)}
                placeholder="mem_xxxxxxxxxxxxxx"
                style={{
                  width: '100%',
                  padding: '12px',
                  fontSize: '16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  outline: 'none',
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label
                htmlFor="userId"
                style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151',
                }}
              >
                User ID
              </label>
              <input
                id="userId"
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="user_xxxxxxxxxxxxx"
                style={{
                  width: '100%',
                  padding: '12px',
                  fontSize: '16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  outline: 'none',
                }}
              />
            </div>

            <button
              onClick={handleCheckStatus}
              style={{
                padding: '12px 32px',
                fontSize: '16px',
                fontWeight: '600',
                backgroundColor: '#5B4FE9',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
              }}
            >
              Check Status
            </button>
          </div>
        </details>

        {showStatus && (
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              marginBottom: '32px',
            }}
          >
            <SubscriptionStatus
              membershipId={membershipId || undefined}
              userId={userId || undefined}
            />

            {membershipId && (
              <div style={{ padding: '0 20px 20px 20px' }}>
                <CancelSubscription
                  membershipId={membershipId}
                  onSuccess={() => {
                    setShowStatus(false);
                    setTimeout(() => setShowStatus(true), 100);
                  }}
                />
              </div>
            )}
          </div>
        )}

        <div
          style={{
            padding: '24px',
            backgroundColor: '#eff6ff',
            border: '1px solid #bfdbfe',
            borderRadius: '8px',
          }}
        >
          <h3
            style={{
              fontSize: '16px',
              fontWeight: '600',
              marginBottom: '12px',
              color: '#1e40af',
            }}
          >
            💡 How It Works
          </h3>
          <ul style={{ fontSize: '14px', color: '#1e40af', lineHeight: '1.8', paddingLeft: '20px' }}>
            <li>Enter the <strong>email address</strong> you used when purchasing</li>
            <li>We&apos;ll find all your active subscriptions</li>
            <li>You can <strong>cancel with one click</strong> directly from this page</li>
            <li>Your access continues until the end of your billing period</li>
          </ul>
        </div>
      </div>
    </main>
  );
}


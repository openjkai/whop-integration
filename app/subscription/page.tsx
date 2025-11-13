'use client';

import { useState } from 'react';
import Link from 'next/link';
import SubscriptionStatus from '@/components/SubscriptionStatus';
import CancelSubscription from '@/components/CancelSubscription';

export default function SubscriptionPage() {
  // In a real app, you would get these from authentication/session
  const [membershipId, setMembershipId] = useState('');
  const [userId, setUserId] = useState('');
  const [showStatus, setShowStatus] = useState(false);

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
              marginBottom: '20px',
              color: '#1f2937',
            }}
          >
            Check Subscription Status
          </h2>

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
              Membership ID (optional)
            </label>
            <input
              id="membershipId"
              type="text"
              value={membershipId}
              onChange={(e) => setMembershipId(e.target.value)}
              placeholder="Enter your membership ID"
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
              User ID (optional)
            </label>
            <input
              id="userId"
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="Enter your user ID"
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
            💡 Demo Note
          </h3>
          <p style={{ fontSize: '14px', color: '#1e40af', lineHeight: '1.6' }}>
            In a production app, you would automatically get the user&apos;s membership
            and user IDs from your authentication system (e.g., NextAuth, Auth0, Clerk).
            This demo requires manual input for testing purposes.
          </p>
        </div>
      </div>
    </main>
  );
}


// Advanced usage examples for Whop integration

'use client';

import { useSubscription } from '@/hooks/useSubscription';
import { useEffect } from 'react';

/**
 * Example 1: Using the custom hook for subscription management
 */
export function SubscriptionDashboard({ userId }: { userId: string }) {
  const {
    loading,
    error,
    memberships,
    getMemberships,
    cancelSubscription,
  } = useSubscription();

  useEffect(() => {
    getMemberships(userId);
  }, [userId, getMemberships]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Your Subscriptions</h2>
      {memberships.map((membership) => (
        <div key={membership.id}>
          <p>Status: {membership.status}</p>
          <button onClick={() => cancelSubscription(membership.id)}>
            Cancel
          </button>
        </div>
      ))}
    </div>
  );
}

/**
 * Example 2: Server-side membership verification
 * Use this in a Server Component or API route
 */
export async function ServerSideVerification() {
  // This would be in a server component
  const { whopClient } = await import('@/lib/whop-client');
  
  // Get membership ID from session/auth
  const membershipId = 'mem_xxx';
  
  try {
    const isValid = await whopClient.verifyMembership(membershipId);
    
    if (!isValid) {
      return <div>Access Denied</div>;
    }
    
    return <div>Protected Content</div>;
  } catch (error) {
    return <div>Error verifying subscription</div>;
  }
}

/**
 * Example 3: Protected route with subscription check
 */
export function ProtectedContent({ membershipId }: { membershipId: string }) {
  const { verifyMembership } = useSubscription();
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    verifyMembership(membershipId).then(setHasAccess);
  }, [membershipId, verifyMembership]);

  if (!hasAccess) {
    return (
      <div>
        <h2>Subscription Required</h2>
        <p>Please subscribe to access this content.</p>
        <a href="/pricing">View Plans</a>
      </div>
    );
  }

  return (
    <div>
      <h1>Premium Content</h1>
      <p>Welcome, subscriber!</p>
    </div>
  );
}

/**
 * Example 4: Inline checkout button with custom styling
 */
export function CustomCheckoutButton() {
  const { createCheckout, loading } = useSubscription();

  const handleClick = async () => {
    await createCheckout('plan_xxx', {
      userId: 'user_123',
      source: 'homepage_cta',
    });
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="custom-button"
    >
      {loading ? 'Processing...' : 'Start Free Trial'}
    </button>
  );
}

/**
 * Example 5: Handling subscription status in layout
 */
export function SubscriptionLayout({ children, userId }: any) {
  const { memberships, getMemberships } = useSubscription();

  useEffect(() => {
    getMemberships(userId);
  }, [userId, getMemberships]);

  const hasActiveSubscription = memberships.some(
    (m) => m.status === 'active' && m.valid
  );

  return (
    <div>
      {!hasActiveSubscription && (
        <div className="subscription-banner">
          <p>Subscribe now to unlock all features!</p>
          <a href="/pricing">View Plans</a>
        </div>
      )}
      {children}
    </div>
  );
}

/**
 * Example 6: Webhook handler customization
 * Add this logic to app/api/webhooks/whop/route.ts
 */
/*
async function handleMembershipCreated(event: WhopWebhookEvent) {
  const membership = event.data.membership;
  
  if (!membership) return;
  
  // 1. Store in database
  await db.subscriptions.create({
    data: {
      membershipId: membership.id,
      userId: membership.user_id,
      planId: membership.plan_id,
      status: membership.status,
    },
  });
  
  // 2. Send welcome email
  await sendEmail({
    to: await getUserEmail(membership.user_id),
    subject: 'Welcome to Premium!',
    template: 'welcome',
  });
  
  // 3. Grant access to Discord/community
  await grantDiscordRole(membership.user_id, 'premium');
  
  // 4. Log analytics
  await analytics.track({
    event: 'subscription_created',
    userId: membership.user_id,
    properties: {
      planId: membership.plan_id,
      value: getPlanValue(membership.plan_id),
    },
  });
}
*/

/**
 * Example 7: Graceful subscription downgrade
 */
export function SubscriptionManager({ membershipId }: { membershipId: string }) {
  const { cancelSubscription, loading } = useSubscription();
  const [cancelling, setCancelling] = useState(false);

  const handleCancel = async () => {
    setCancelling(true);
    try {
      await cancelSubscription(membershipId);
      alert('Subscription will cancel at period end. You still have access!');
    } catch (error) {
      alert('Failed to cancel subscription');
    } finally {
      setCancelling(false);
    }
  };

  return (
    <div>
      <h3>Manage Subscription</h3>
      <button
        onClick={handleCancel}
        disabled={loading || cancelling}
      >
        {cancelling ? 'Cancelling...' : 'Cancel Subscription'}
      </button>
      <p style={{ fontSize: '12px', color: '#666' }}>
        You&apos;ll keep access until the end of your billing period
      </p>
    </div>
  );
}

// Import statement needed for the examples above
import { useState } from 'react';


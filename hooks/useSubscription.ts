// Custom React hook for subscription management
'use client';

import { useState, useCallback } from 'react';
import type { WhopMembership } from '@/types/whop';

interface UseSubscriptionReturn {
  loading: boolean;
  error: string | null;
  memberships: WhopMembership[];
  createCheckout: (planId: string, metadata?: Record<string, any>) => Promise<void>;
  getMemberships: (userId?: string, membershipId?: string) => Promise<void>;
  cancelSubscription: (membershipId: string) => Promise<void>;
  reactivateSubscription: (membershipId: string) => Promise<void>;
  verifyMembership: (membershipId: string) => Promise<boolean>;
}

export function useSubscription(): UseSubscriptionReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [memberships, setMemberships] = useState<WhopMembership[]>([]);

  const createCheckout = useCallback(
    async (planId: string, metadata?: Record<string, any>) => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('/api/subscription/create-checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ planId, metadata }),
        });

        const result = await response.json();

        if (result.success && result.data.checkout_url) {
          window.location.href = result.data.checkout_url;
        } else {
          throw new Error(result.message || 'Failed to create checkout');
        }
      } catch (err: any) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const getMemberships = useCallback(
    async (userId?: string, membershipId?: string) => {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams();
        if (userId) params.append('userId', userId);
        if (membershipId) params.append('membershipId', membershipId);

        const response = await fetch(`/api/subscription/status?${params}`);
        const result = await response.json();

        if (result.success) {
          setMemberships(result.data.memberships || []);
        } else {
          throw new Error(result.message || 'Failed to get memberships');
        }
      } catch (err: any) {
        setError(err.message);
        setMemberships([]);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const cancelSubscription = useCallback(async (membershipId: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/subscription/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ membershipId }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Failed to cancel subscription');
      }

      // Refresh memberships
      await getMemberships(undefined, membershipId);
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [getMemberships]);

  const reactivateSubscription = useCallback(async (membershipId: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/subscription/reactivate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ membershipId }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Failed to reactivate subscription');
      }

      // Refresh memberships
      await getMemberships(undefined, membershipId);
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [getMemberships]);

  const verifyMembership = useCallback(async (membershipId: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/subscription/verify?membershipId=${membershipId}`);
      const result = await response.json();

      if (result.success) {
        return result.data.isValid;
      } else {
        throw new Error(result.message || 'Failed to verify membership');
      }
    } catch (err: any) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    memberships,
    createCheckout,
    getMemberships,
    cancelSubscription,
    reactivateSubscription,
    verifyMembership,
  };
}


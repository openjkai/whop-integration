'use client';

import { useState } from 'react';

interface CancelSubscriptionProps {
  membershipId: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export default function CancelSubscription({
  membershipId,
  onSuccess,
  onError,
}: CancelSubscriptionProps) {
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleCancel = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const response = await fetch('/api/subscription/cancel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ membershipId }),
      });

      const result = await response.json();

      if (result.success) {
        setSuccess(result.message || 'Subscription cancelled successfully');
        setShowConfirm(false);
        onSuccess?.();
      } else {
        const errorMsg = result.message || 'Failed to cancel subscription';
        setError(errorMsg);
        onError?.(errorMsg);
      }
    } catch (err: any) {
      const errorMsg = err.message || 'An error occurred';
      setError(errorMsg);
      onError?.(errorMsg);
      console.error('Cancel subscription error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReactivate = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const response = await fetch('/api/subscription/reactivate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ membershipId }),
      });

      const result = await response.json();

      if (result.success) {
        setSuccess(result.message || 'Subscription reactivated successfully');
        onSuccess?.();
      } else {
        const errorMsg = result.message || 'Failed to reactivate subscription';
        setError(errorMsg);
        onError?.(errorMsg);
      }
    } catch (err: any) {
      const errorMsg = err.message || 'An error occurred';
      setError(errorMsg);
      onError?.(errorMsg);
      console.error('Reactivate subscription error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginTop: '20px' }}>
      {!showConfirm ? (
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => setShowConfirm(true)}
            disabled={loading}
            style={{
              padding: '10px 20px',
              fontSize: '14px',
              fontWeight: '600',
              backgroundColor: '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            Cancel Subscription
          </button>

          <button
            onClick={handleReactivate}
            disabled={loading}
            style={{
              padding: '10px 20px',
              fontSize: '14px',
              fontWeight: '600',
              backgroundColor: '#22c55e',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? 'Processing...' : 'Reactivate Subscription'}
          </button>
        </div>
      ) : (
        <div
          style={{
            padding: '20px',
            backgroundColor: '#fef3c7',
            borderRadius: '8px',
            border: '1px solid #fbbf24',
          }}
        >
          <h3 style={{ marginBottom: '12px', fontSize: '16px', fontWeight: '600' }}>
            Are you sure you want to cancel?
          </h3>
          <p style={{ marginBottom: '16px', fontSize: '14px', color: '#92400e' }}>
            Your subscription will remain active until the end of the current billing period.
            You will not be charged again.
          </p>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={handleCancel}
              disabled={loading}
              style={{
                padding: '10px 20px',
                fontSize: '14px',
                fontWeight: '600',
                backgroundColor: '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? 'Cancelling...' : 'Yes, Cancel'}
            </button>
            <button
              onClick={() => setShowConfirm(false)}
              disabled={loading}
              style={{
                padding: '10px 20px',
                fontSize: '14px',
                fontWeight: '600',
                backgroundColor: '#6b7280',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
            >
              No, Keep Subscription
            </button>
          </div>
        </div>
      )}

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

      {success && (
        <div
          style={{
            marginTop: '12px',
            padding: '12px',
            backgroundColor: '#d1fae5',
            color: '#065f46',
            borderRadius: '4px',
            fontSize: '14px',
          }}
        >
          {success}
        </div>
      )}
    </div>
  );
}


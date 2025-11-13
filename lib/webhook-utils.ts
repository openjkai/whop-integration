// Webhook verification and handling utilities
import crypto from 'crypto';

export function verifyWhopWebhook(
  payload: string,
  signature: string,
  secret: string
): boolean {
  try {
    const computedSignature = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex');
    
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(computedSignature)
    );
  } catch (error) {
    console.error('Webhook verification error:', error);
    return false;
  }
}

export function parseWebhookPayload<T = any>(payload: string): T | null {
  try {
    return JSON.parse(payload);
  } catch (error) {
    console.error('Error parsing webhook payload:', error);
    return null;
  }
}


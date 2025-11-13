// API Route: Whop Webhook Handler
import { NextRequest, NextResponse } from 'next/server';
import { verifyWhopWebhook, parseWebhookPayload } from '@/lib/webhook-utils';
import type { WhopWebhookEvent } from '@/types/whop';

export async function POST(request: NextRequest) {
  try {
    // Get the raw body as text for signature verification
    const rawBody = await request.text();
    
    // Get the webhook signature from headers
    const signature = request.headers.get('x-whop-signature') || '';
    const webhookSecret = process.env.WHOP_WEBHOOK_SECRET || '';

    // Verify webhook signature
    if (!verifyWhopWebhook(rawBody, signature, webhookSecret)) {
      console.error('Invalid webhook signature');
      return NextResponse.json(
        { success: false, message: 'Invalid signature' },
        { status: 401 }
      );
    }

    // Parse the webhook payload
    const event = parseWebhookPayload<WhopWebhookEvent>(rawBody);
    
    if (!event) {
      return NextResponse.json(
        { success: false, message: 'Invalid payload' },
        { status: 400 }
      );
    }

    // Handle different webhook events
    switch (event.event) {
      case 'membership.created':
        await handleMembershipCreated(event);
        break;
      
      case 'membership.updated':
        await handleMembershipUpdated(event);
        break;
      
      case 'membership.deleted':
        await handleMembershipDeleted(event);
        break;
      
      case 'payment.succeeded':
        await handlePaymentSucceeded(event);
        break;
      
      case 'payment.failed':
        await handlePaymentFailed(event);
        break;
      
      default:
        console.log(`Unhandled event type: ${event.event}`);
    }

    return NextResponse.json({ success: true, received: true });
  } catch (error: any) {
    console.error('Webhook handler error:', error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Webhook processing failed',
      },
      { status: 500 }
    );
  }
}

// Event Handlers
async function handleMembershipCreated(event: WhopWebhookEvent) {
  console.log('Membership created:', event.data.membership);
  
  // TODO: Add your custom logic here
  // - Send welcome email
  // - Grant access to content
  // - Update your database
  // - Log analytics event
  
  const membership = event.data.membership;
  if (membership) {
    console.log(`New subscription for user ${membership.user_id}`);
    console.log(`Product: ${membership.product_id}, Plan: ${membership.plan_id}`);
  }
}

async function handleMembershipUpdated(event: WhopWebhookEvent) {
  console.log('Membership updated:', event.data.membership);
  
  // TODO: Add your custom logic here
  // - Update user access
  // - Handle subscription changes
  // - Update your database
  
  const membership = event.data.membership;
  if (membership) {
    console.log(`Membership ${membership.id} updated`);
    console.log(`Status: ${membership.status}`);
    
    if (membership.cancel_at_period_end) {
      console.log('Subscription set to cancel at period end');
      // Handle cancellation pending
    }
  }
}

async function handleMembershipDeleted(event: WhopWebhookEvent) {
  console.log('Membership deleted:', event.data.membership);
  
  // TODO: Add your custom logic here
  // - Revoke user access
  // - Send cancellation confirmation email
  // - Update your database
  // - Log analytics event
  
  const membership = event.data.membership;
  if (membership) {
    console.log(`Subscription cancelled for user ${membership.user_id}`);
  }
}

async function handlePaymentSucceeded(event: WhopWebhookEvent) {
  console.log('Payment succeeded:', event.data.payment);
  
  // TODO: Add your custom logic here
  // - Send payment receipt
  // - Extend subscription period
  // - Log revenue analytics
}

async function handlePaymentFailed(event: WhopWebhookEvent) {
  console.log('Payment failed:', event.data.payment);
  
  // TODO: Add your custom logic here
  // - Send payment failure notification
  // - Update subscription status
  // - Trigger retry logic
}


// API Route: Whop Webhook Handler
import { NextRequest, NextResponse } from 'next/server';
import { whopClient } from '@/lib/whop-client';

export async function POST(request: NextRequest) {
  try {
    // Get the raw body as text for signature verification
    const requestBodyText = await request.text();
    
    // Get headers for webhook verification
    const headers = Object.fromEntries(request.headers);
    
    // Get the Whop SDK instance for webhook verification
    const whopSDK = whopClient.getSDK();
    
    // Verify and unwrap the webhook using official Whop SDK
    // This automatically validates the webhook signature according to Standard Webhooks spec
    const webhookData = whopSDK.webhooks.unwrap(requestBodyText, { headers });
    
    console.log('Received webhook:', webhookData.type);
    
    // Handle different webhook events based on type
    // Cast webhookData to any to handle dynamic webhook types
    const event = webhookData as any;
    
    switch (event.type) {
      case 'payment.succeeded':
        await handlePaymentSucceeded(event.data);
        break;
      
      case 'membership.went_valid':
      case 'membership.activated':
        await handleMembershipActivated(event.data);
        break;
      
      case 'membership.went_invalid':
      case 'membership.deactivated':
        await handleMembershipDeactivated(event.data);
        break;
      
      case 'waitlist.entry.created':
      case 'entry.created':
        await handleWaitlistEntryCreated(event.data);
        break;
      
      default:
        console.log(`Unhandled webhook type: ${event.type}`);
    }

    // Always return 200 quickly to acknowledge receipt
    return NextResponse.json({ received: true }, { status: 200 });
    
  } catch (error: any) {
    console.error('Webhook handler error:', error);
    
    // If verification fails, return 401
    if (error.message?.includes('signature') || error.message?.includes('verify')) {
      return NextResponse.json(
        { error: 'Invalid webhook signature' },
        { status: 401 }
      );
    }
    
    // For other errors, still return 200 to avoid retries
    // Log the error for debugging
    console.error('Error processing webhook:', error);
    return NextResponse.json({ received: true }, { status: 200 });
  }
}

// Event Handlers
async function handlePaymentSucceeded(payment: any) {
  console.log('[PAYMENT SUCCEEDED]', payment);
  
  // TODO: Add your custom logic here
  // - Send payment receipt email
  // - Log revenue analytics
  // - Update database with payment info
  // - Grant/extend access
  
  console.log(`Payment ${payment.id} succeeded`);
  console.log(`Amount: ${payment.total} ${payment.currency}`);
  console.log(`User: ${payment.user?.email}`);
  console.log(`Product: ${payment.product?.title}`);
  console.log(`Membership: ${payment.membership?.id}`);
  
  // Example: Store payment in database
  // await db.payments.create({
  //   id: payment.id,
  //   userId: payment.user.id,
  //   amount: payment.total,
  //   currency: payment.currency,
  //   status: payment.status,
  // });
}

async function handleMembershipActivated(membership: any) {
  console.log('[MEMBERSHIP ACTIVATED]', membership);
  
  // TODO: Add your custom logic here
  // - Send welcome email
  // - Grant access to content/community
  // - Add user to Discord/Telegram
  // - Update your database
  
  console.log(`New member: ${membership.user?.email}`);
  console.log(`Product: ${membership.product?.title}`);
  console.log(`Plan: ${membership.plan?.id}`);
}

async function handleMembershipDeactivated(membership: any) {
  console.log('[MEMBERSHIP DEACTIVATED]', membership);
  
  // TODO: Add your custom logic here
  // - Revoke access
  // - Remove from Discord/Telegram
  // - Send cancellation email
  // - Update your database
  
  console.log(`Member deactivated: ${membership.user?.email}`);
  console.log(`Reason: ${membership.status}`);
}

async function handleWaitlistEntryCreated(entry: any) {
  console.log('[WAITLIST ENTRY CREATED]', entry);
  
  // TODO: Add your custom logic here
  // - Send confirmation email
  // - Add to CRM
  // - Track in analytics
  
  console.log(`New waitlist entry: ${entry.email}`);
}


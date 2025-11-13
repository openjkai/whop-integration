// API Route: Cancel Subscription
import { NextRequest, NextResponse } from 'next/server';
import { whopClient } from '@/lib/whop-client';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { membershipId } = body;

    if (!membershipId) {
      return NextResponse.json(
        { success: false, message: 'Membership ID is required' },
        { status: 400 }
      );
    }

    // Cancel membership at period end
    const cancelledMembership = await whopClient.cancelMembership(membershipId);

    return NextResponse.json({
      success: true,
      message: 'Subscription cancelled successfully. Access will continue until the end of the billing period.',
      data: cancelledMembership,
    });
  } catch (error: any) {
    console.error('Cancel subscription error:', error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to cancel subscription',
      },
      { status: 500 }
    );
  }
}


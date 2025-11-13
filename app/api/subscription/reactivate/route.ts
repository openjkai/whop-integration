// API Route: Reactivate Subscription
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

    // Reactivate cancelled membership
    const reactivatedMembership = await whopClient.reactivateMembership(membershipId);

    return NextResponse.json({
      success: true,
      message: 'Subscription reactivated successfully',
      data: reactivatedMembership,
    });
  } catch (error: any) {
    console.error('Reactivate subscription error:', error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to reactivate subscription',
      },
      { status: 500 }
    );
  }
}


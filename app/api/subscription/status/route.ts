// API Route: Get Subscription Status
import { NextRequest, NextResponse } from 'next/server';
import { whopClient } from '@/lib/whop-client';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const membershipId = searchParams.get('membershipId');
    const userId = searchParams.get('userId');

    if (!membershipId && !userId) {
      return NextResponse.json(
        { success: false, message: 'Membership ID or User ID is required' },
        { status: 400 }
      );
    }

    let memberships: any[] = [];

    if (membershipId) {
      // Get specific membership
      const membership = await whopClient.getMembership(membershipId);
      memberships = [membership];
    } else if (userId) {
      // Get all memberships for user
      memberships = await whopClient.getUserMemberships(userId);
    }

    return NextResponse.json({
      success: true,
      data: {
        memberships,
        count: memberships.length,
      },
    });
  } catch (error: any) {
    console.error('Get subscription status error:', error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to get subscription status',
      },
      { status: 500 }
    );
  }
}


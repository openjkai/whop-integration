// API Route: Verify Membership
import { NextRequest, NextResponse } from 'next/server';
import { whopClient } from '@/lib/whop-client';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const membershipId = searchParams.get('membershipId');

    if (!membershipId) {
      return NextResponse.json(
        { success: false, message: 'Membership ID is required' },
        { status: 400 }
      );
    }

    // Verify membership
    const isValid = await whopClient.verifyMembership(membershipId);
    const membership = await whopClient.getMembership(membershipId);

    return NextResponse.json({
      success: true,
      data: {
        isValid,
        membership,
      },
    });
  } catch (error: any) {
    console.error('Verify membership error:', error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to verify membership',
      },
      { status: 500 }
    );
  }
}


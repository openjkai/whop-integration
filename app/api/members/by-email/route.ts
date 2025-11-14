// API Route: Get Member by Email
import { NextRequest, NextResponse } from 'next/server';
import { whopClient } from '@/lib/whop-client';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const email = searchParams.get('email');
    const companyId = process.env.WHOP_COMPANY_ID || '';

    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Email is required' },
        { status: 400 }
      );
    }

    if (!companyId) {
      return NextResponse.json(
        { success: false, message: 'Company ID not configured' },
        { status: 500 }
      );
    }

    // Get member by email
    const member = await whopClient.getMemberByEmail(companyId, email);

    if (!member) {
      return NextResponse.json(
        { success: false, message: 'No subscription found for this email' },
        { status: 404 }
      );
    }

    console.log('Found member:', member);

    // Get full membership details if member exists
    let memberships: any[] = [];
    
    try {
      memberships = await whopClient.getUserMemberships(member.user.id);
      console.log('Found memberships:', memberships);
    } catch (error: any) {
      console.error('Error fetching memberships:', error.message);
      // If we can't get detailed memberships, return the member info we have
    }

    return NextResponse.json({
      success: true,
      data: {
        member,
        memberships,
        // Also include basic info from member object
        hasSubscription: member.status === 'active',
      },
    });
  } catch (error: any) {
    console.error('Get member by email error:', error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to fetch member',
      },
      { status: 500 }
    );
  }
}


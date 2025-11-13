// API Route: Create Checkout Session
import { NextRequest, NextResponse } from 'next/server';
import { whopClient } from '@/lib/whop-client';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { planId, metadata } = body;

    if (!planId) {
      return NextResponse.json(
        { success: false, message: 'Plan ID is required' },
        { status: 400 }
      );
    }

    // Create checkout session with Whop
    const checkout = await whopClient.createCheckout(planId, metadata);

    return NextResponse.json({
      success: true,
      data: checkout,
    });
  } catch (error: any) {
    console.error('Create checkout error:', error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to create checkout session',
      },
      { status: 500 }
    );
  }
}


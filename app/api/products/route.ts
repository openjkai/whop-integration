// API Route: Get Products List
import { NextRequest, NextResponse } from 'next/server';
import { whopClient } from '@/lib/whop-client';

export async function GET(request: NextRequest) {
  try {
    const companyId = process.env.WHOP_COMPANY_ID || '';

    if (!companyId) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'WHOP_COMPANY_ID not configured' 
        },
        { status: 400 }
      );
    }

    // Fetch products from Whop
    const products = await whopClient.listProducts(companyId);

    return NextResponse.json({
      success: true,
      data: {
        products,
        count: products.length,
      },
    });
  } catch (error: any) {
    console.error('Get products error:', error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to fetch products',
      },
      { status: 500 }
    );
  }
}


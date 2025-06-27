// app/api/admin/pricing/create/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import PricingService from '@/lib/pricing-service';

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const configData = await req.json();
    
    // Validate required fields
    if (!configData.name || configData.basePrice == null) {
      return NextResponse.json(
        { error: 'Name and base price are required' },
        { status: 400 }
      );
    }

    const config = await PricingService.createPricingConfig(
      configData,
      session.user.id
    );

    return NextResponse.json({
      success: true,
      config
    });
  } catch (error) {
    console.error('Error creating pricing config:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create pricing configuration' },
      { status: 500 }
    );
  }
}
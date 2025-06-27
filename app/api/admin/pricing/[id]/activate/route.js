// app/api/admin/pricing/[id]/activate/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import PricingService from '@/lib/pricing-service';

export async function POST(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    
    const config = await PricingService.activatePricingConfig(id);

    return NextResponse.json({
      success: true,
      message: 'Pricing configuration activated successfully',
      config
    });
  } catch (error) {
    console.error('Error activating pricing config:', error);
    return NextResponse.json(
      { error: 'Failed to activate pricing configuration' },
      { status: 500 }
    );
  }
}
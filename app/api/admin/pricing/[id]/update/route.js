// app/api/admin/pricing/[id]/update/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { PricingService } from '@/lib/pricing-service';

export async function PUT(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const updates = await req.json();

    const config = await PricingService.updatePricingConfig(
      id,
      updates,
      session.user.id
    );

    return NextResponse.json({
      success: true,
      config
    });
  } catch (error) {
    console.error('Error updating pricing config:', error);
    return NextResponse.json(
      { error: 'Failed to update pricing configuration' },
      { status: 500 }
    );
  }
}
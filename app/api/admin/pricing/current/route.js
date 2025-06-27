// app/api/admin/pricing/current/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { PricingService } from '@/lib/pricing-service';

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const config = await PricingService.getActivePricingConfig();
    const estimates = await PricingService.getPricingEstimates();

    return NextResponse.json({
      config,
      estimates
    });
  } catch (error) {
    console.error('Error fetching pricing config:', error);
    return NextResponse.json(
      { error: 'Failed to fetch pricing configuration' },
      { status: 500 }
    );
  }
}
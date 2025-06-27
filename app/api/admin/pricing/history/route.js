// app/api/admin/pricing/history/route.js
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

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '10');

    const history = await PricingService.getPricingHistory(limit);

    return NextResponse.json({
      history
    });
  } catch (error) {
    console.error('Error fetching pricing history:', error);
    return NextResponse.json(
      { error: 'Failed to fetch pricing history' },
      { status: 500 }
    );
  }
}
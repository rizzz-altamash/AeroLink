// app/api/admin/pricing/preview/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { PricingService } from '@/lib/pricing-service';

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { configId, scenarios } = await req.json();

    const sampleScenarios = scenarios || [
      {
        scenario: 'Routine Delivery (5km, 500g)',
        urgency: 'routine',
        distance: 5000,
        weight: 500
      },
      {
        scenario: 'Urgent Delivery (15km, 1kg)',
        urgency: 'urgent',
        distance: 15000,
        weight: 1000,
        temperatureControlled: true
      },
      {
        scenario: 'Emergency Delivery (30km, 2kg)',
        urgency: 'emergency',
        distance: 30000,
        weight: 2000,
        fragile: true
      },
      {
        scenario: 'Night Emergency (20km, 1.5kg)',
        urgency: 'emergency',
        distance: 20000,
        weight: 1500,
        scheduledTime: new Date().setHours(23, 0, 0, 0)
      }
    ];

    const previews = await PricingService.calculatePricePreview(
      configId,
      sampleScenarios
    );

    return NextResponse.json({
      previews
    });
  } catch (error) {
    console.error('Error calculating preview:', error);
    return NextResponse.json(
      { error: 'Failed to calculate price preview' },
      { status: 500 }
    );
  }
}
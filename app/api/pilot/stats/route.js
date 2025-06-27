// app/api/pilot/stats/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { connectDB } from '@/lib/mongodb';
import Delivery from '@/models/Delivery';

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'pilot') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    // Get pilot's delivery stats
    const allDeliveries = await Delivery.find({ pilotId: session.user.id });
    const successfulDeliveries = allDeliveries.filter(d => d.status === 'delivered');
    
    // Get today's flights
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayFlights = allDeliveries.filter(d => 
      new Date(d.createdAt) >= todayStart
    ).length;

    // Calculate flight hours (simplified)
    const flightHours = Math.round(allDeliveries.length * 0.5); // Assume 30 min per delivery

    return NextResponse.json({
      totalFlights: allDeliveries.length,
      flightHours,
      successRate: allDeliveries.length > 0 
        ? Math.round((successfulDeliveries.length / allDeliveries.length) * 100)
        : 0,
      todayFlights
    });
  } catch (error) {
    console.error('Error fetching pilot stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
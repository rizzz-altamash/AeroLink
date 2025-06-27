// app/api/staff/stats/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { connectDB } from '@/lib/mongodb';
import Delivery from '@/models/Delivery';
import User from '@/models/User';
import Hospital from '@/models/Hospital';

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'medical_staff') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    // Get today's start
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    // Get all deliveries for this user
    const userDeliveries = await Delivery.find({
      $or: [
        { 'sender.userId': session.user.id },
        { 'recipient.userId': session.user.id },
        { 'metadata.orderedBy': session.user.id }
      ]
    });

    // Calculate stats
    const todayDeliveries = userDeliveries.filter(d => 
      new Date(d.createdAt) >= todayStart
    ).length;

    const pendingPickups = userDeliveries.filter(d => 
      d.status === 'pending' || d.status === 'approved'
    ).length;

    const inTransit = userDeliveries.filter(d => 
      d.status === 'pickup' || d.status === 'in_transit'
    ).length;

    // Calculate average delivery time for completed deliveries
    const completedDeliveries = userDeliveries.filter(d => 
      d.status === 'delivered' && d.delivery?.actualDeliveryTime
    );

    let avgDeliveryTime = 0;
    if (completedDeliveries.length > 0) {
      const totalTime = completedDeliveries.reduce((sum, d) => {
        const duration = new Date(d.delivery.actualDeliveryTime) - new Date(d.createdAt);
        return sum + duration;
      }, 0);
      avgDeliveryTime = Math.round(totalTime / completedDeliveries.length / 60000); // Convert to minutes
    }

    return NextResponse.json({
      todayDeliveries,
      pendingPickups,
      inTransit,
      avgDeliveryTime
    });
  } catch (error) {
    console.error('Error fetching staff stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
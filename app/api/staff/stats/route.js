// app/api/staff/stats/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { connectDB } from '@/lib/mongodb';
import Delivery from '@/models/Delivery';

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'medical_staff') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get today's deliveries count
    const todayDeliveries = await Delivery.countDocuments({
      'sender.userId': session.user.id,
      createdAt: { $gte: today }
    });

    // Get pending pickups
    const pendingPickups = await Delivery.countDocuments({
      'sender.userId': session.user.id,
      status: { $in: ['pending', 'approved'] }
    });

    // Get in transit
    const inTransit = await Delivery.countDocuments({
      'sender.userId': session.user.id,
      status: 'in_transit'
    });

    // Calculate average delivery time for completed deliveries this month
    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);

    const completedDeliveries = await Delivery.find({
      'sender.userId': session.user.id,
      status: 'delivered',
      'delivery.actualDeliveryTime': { $exists: true },
      createdAt: { $gte: monthStart }
    });

    let avgDeliveryTime = 0;
    if (completedDeliveries.length > 0) {
      const totalTime = completedDeliveries.reduce((sum, delivery) => {
        const duration = new Date(delivery.delivery.actualDeliveryTime) - new Date(delivery.createdAt);
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
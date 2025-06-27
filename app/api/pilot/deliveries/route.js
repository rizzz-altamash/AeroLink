// app/api/pilot/deliveries/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { connectDB } from '@/lib/mongodb';
import Delivery from '@/models/Delivery';
import User from '@/models/User';
import Hospital from '@/models/Hospital';
import Drone from '@/models/Drone';

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'pilot') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    // Get deliveries assigned to this pilot
    const assignedDeliveries = await Delivery.find({
      pilotId: session.user.id,
      status: { $in: ['assigned', 'pickup', 'in_transit', 'pending_confirmation'] }
    })
    .populate('sender.hospitalId', 'name')
    .populate('recipient.hospitalId', 'name')
    .populate('droneId', 'registrationId')
    .sort({ 'package.urgency': -1, createdAt: -1 });

    // Transform for display
    const transformedDeliveries = assignedDeliveries.map(delivery => ({
      _id: delivery._id,
      orderId: delivery.orderId,
      packageType: delivery.package.type,
      priority: delivery.package.urgency,
      pickup: delivery.sender.hospitalId?.name || 'Warehouse',
      delivery: delivery.recipient.hospitalId?.name || delivery.recipient.name,
      distance: (delivery.flightPath?.estimatedDistance || 0) / 1000, // Convert to km
      status: delivery.status
    }));

    return NextResponse.json(transformedDeliveries);
  } catch (error) {
    console.error('Error fetching pilot deliveries:', error);
    return NextResponse.json(
      { error: 'Failed to fetch deliveries' },
      { status: 500 }
    );
  }
}
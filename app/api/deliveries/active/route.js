// app/api/deliveries/active/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { connectDB } from '@/lib/mongodb';
import Delivery from '@/models/Delivery';
import User from '@/models/User';

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'medical_staff') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    // Get active deliveries created by this staff member
    const activeDeliveries = await Delivery.find({
      'sender.userId': session.user.id,
      status: { $in: ['pending', 'approved', 'assigned', 'pickup', 'in_transit'] }
    })
    .populate('recipient.userId', 'name email phoneNumber')
    .populate('droneId', 'registrationId model')
    .sort({ createdAt: -1 })
    .limit(20);

    return NextResponse.json(activeDeliveries);
  } catch (error) {
    console.error('Error fetching active deliveries:', error);
    return NextResponse.json(
      { error: 'Failed to fetch active deliveries' },
      { status: 500 }
    );
  }
}
// app/api/deliveries/[id]/track/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { connectDB } from '@/lib/mongodb';
import Delivery from '@/models/Delivery';

export async function GET(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const delivery = await Delivery.findById(params.id)
      .populate('droneId', 'registrationId model currentLocation')
      .populate('recipient.userId', 'name');

    if (!delivery) {
      return NextResponse.json({ error: 'Delivery not found' }, { status: 404 });
    }

    // Check if user has permission to track this delivery
    if (delivery.sender.userId.toString() !== session.user.id &&
        delivery.recipient.userId?.toString() !== session.user.id &&
        session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    return NextResponse.json(delivery);
  } catch (error) {
    console.error('Error fetching tracking data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tracking data' },
      { status: 500 }
    );
  }
}
// app/api/hospital/deliveries/recent/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { connectDB } from '@/lib/mongodb';
import Delivery from '@/models/Delivery';
import User from '@/models/User';
import Hospital from '@/models/Hospital';

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'hospital_admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const hospitalId = session.user.hospitalId;
    if (!hospitalId) {
      return NextResponse.json({ error: 'No hospital associated with user' }, { status: 400 });
    }

    // Get recent deliveries for this hospital
    const recentDeliveries = await Delivery.find({
      $or: [
        { 'sender.hospitalId': hospitalId },
        { 'recipient.hospitalId': hospitalId }
      ]
    })
    .populate('sender.userId', 'name')
    .populate('recipient.userId', 'name')
    .populate('droneId', 'registrationId')
    .sort({ createdAt: -1 })
    .limit(20);

    // Transform deliveries for display
    const transformedDeliveries = recentDeliveries.map(delivery => {
      const isIncoming = delivery.recipient.hospitalId?.toString() === hospitalId;
      
      return {
        _id: delivery._id,
        orderId: delivery.orderId,
        type: delivery.package.type,
        recipient: isIncoming ? 'Your Hospital' : (delivery.recipient.userId?.name || delivery.recipient.name || 'Unknown'),
        status: delivery.status,
        eta: delivery.delivery?.scheduledTime ? new Date(delivery.delivery.scheduledTime).toLocaleTimeString() : 'N/A',
        createdAt: delivery.createdAt
      };
    });

    return NextResponse.json(transformedDeliveries);
  } catch (error) {
    console.error('Error fetching hospital deliveries:', error);
    return NextResponse.json(
      { error: 'Failed to fetch deliveries' },
      { status: 500 }
    );
  }
}
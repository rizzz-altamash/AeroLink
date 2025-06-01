// app/api/hospital-admin/deliveries/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { connectDB } from '@/lib/mongodb';
import Delivery from '@/models/Delivery';
import User from '@/models/User';

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'hospital_admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const status = searchParams.get('status');
    const type = searchParams.get('type');
    const urgency = searchParams.get('urgency');
    const direction = searchParams.get('direction');
    const search = searchParams.get('search');

    await connectDB();

    // Build query
    const query = {
      $or: [
        { 'sender.hospitalId': session.user.hospitalId },
        { 'recipient.hospitalId': session.user.hospitalId },
        { 'metadata.orderingHospital': session.user.hospitalId }
      ]
    };

    if (status && status !== 'all') {
      query.status = status;
    }

    if (type && type !== 'all') {
      query['package.type'] = type;
    }

    if (urgency && urgency !== 'all') {
      query['package.urgency'] = urgency;
    }

    if (direction && direction !== 'all') {
      if (direction === 'incoming') {
        query['metadata.deliveryType'] = 'incoming';
      } else {
        query['metadata.deliveryType'] = { $ne: 'incoming' };
      }
    }

    if (search) {
      query.$and = [
        { $or: query.$or },
        {
          $or: [
            { orderId: { $regex: search, $options: 'i' } },
            { 'sender.userId.name': { $regex: search, $options: 'i' } }
          ]
        }
      ];
      delete query.$or;
    }

    const total = await Delivery.countDocuments(query);

    const deliveries = await Delivery.find(query)
      .populate('sender.userId', 'name email')
      .populate('metadata.orderedBy', 'name email')
      .populate('recipient.hospitalId', 'name')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    // Transform deliveries
    const transformedDeliveries = deliveries.map(delivery => ({
      ...delivery.toObject(),
      isIncoming: delivery.metadata?.deliveryType === 'incoming',
      requestedBy: delivery.metadata?.orderedBy || delivery.sender.userId
    }));

    return NextResponse.json({
      deliveries: transformedDeliveries,
      total,
      page,
      limit
    });
  } catch (error) {
    console.error('Error fetching hospital deliveries:', error);
    return NextResponse.json(
      { error: 'Failed to fetch deliveries' },
      { status: 500 }
    );
  }
}
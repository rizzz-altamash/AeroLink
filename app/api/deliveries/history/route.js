// app/api/deliveries/history/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { connectDB } from '@/lib/mongodb';
import Delivery from '@/models/Delivery';
import User from '@/models/User';
import Hospital from '@/models/Hospital';
import Drone from '@/models/Drone';

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const status = searchParams.get('status');
    const type = searchParams.get('type');
    const dateRange = searchParams.get('dateRange');
    const search = searchParams.get('search');

    await connectDB();

    // Build query - include deliveries where user is sender, recipient, or orderer
    const query = {
      $or: [
        { 'sender.userId': session.user.id },
        { 'recipient.userId': session.user.id },
        { 'metadata.orderedBy': session.user.id }
      ]
    };

    // Status filter
    if (status && status !== 'all') {
      query.status = status;
    }

    // Type filter
    if (type && type !== 'all') {
      query['package.type'] = type;
    }

    // Date range filter
    if (dateRange && dateRange !== 'all') {
      const days = {
        '7days': 7,
        '30days': 30,
        '90days': 90
      };
      
      if (days[dateRange]) {
        const date = new Date();
        date.setDate(date.getDate() - days[dateRange]);
        query.createdAt = { $gte: date };
      }
    }

    // Search filter - wrap in $and to combine with $or
    if (search) {
      query.$and = [
        { $or: query.$or },
        {
          $or: [
            { orderId: { $regex: search, $options: 'i' } },
            { 'recipient.name': { $regex: search, $options: 'i' } }
          ]
        }
      ];
      delete query.$or;
    }

    // Get total count
    const total = await Delivery.countDocuments(query);

    // Get paginated results
    const deliveries = await Delivery.find(query)
      .populate('recipient.userId', 'name')
      .populate('recipient.hospitalId', 'name')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    // Transform deliveries to include type information
    const transformedDeliveries = deliveries.map(delivery => ({
      ...delivery.toObject(),
      deliveryType: delivery.metadata?.deliveryType || 'outgoing',
      displayType: delivery.metadata?.deliveryType === 'incoming' ? 'Order' : 'Delivery'
    }));

    return NextResponse.json({
      deliveries: transformedDeliveries,
      total,
      page,
      limit
    });
  } catch (error) {
    console.error('Error fetching delivery history:', error);
    return NextResponse.json(
      { error: 'Failed to fetch delivery history' },
      { status: 500 }
    );
  }
}
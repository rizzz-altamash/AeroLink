// app/api/hospital-admin/staff/activity/detailed/route.js
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
    const limit = parseInt(searchParams.get('limit') || '50');
    const staffId = searchParams.get('staffId');
    const activityType = searchParams.get('activityType');
    const dateRange = searchParams.get('dateRange');

    await connectDB();

    // Build date filter
    let dateFilter = {};
    const now = new Date();
    switch (dateRange) {
      case 'today':
        const todayStart = new Date(now);
        todayStart.setHours(0, 0, 0, 0);
        dateFilter = { $gte: todayStart };
        break;
      case '7days':
        dateFilter = { $gte: new Date(now.setDate(now.getDate() - 7)) };
        break;
      case '30days':
        dateFilter = { $gte: new Date(now.setDate(now.getDate() - 30)) };
        break;
      case '90days':
        dateFilter = { $gte: new Date(now.setDate(now.getDate() - 90)) };
        break;
    }

    // Get activities from deliveries
    const deliveryQuery = {
      'sender.hospitalId': session.user.hospitalId,
      ...(dateFilter && { createdAt: dateFilter })
    };

    if (staffId && staffId !== 'all') {
      deliveryQuery['$or'] = [
        { 'sender.userId': staffId },
        { 'metadata.orderedBy': staffId }
      ];
    }

    const deliveries = await Delivery.find(deliveryQuery)
      .populate('sender.userId', 'name')
      .populate('metadata.orderedBy', 'name')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    // Transform to activities
    const activities = deliveries.map(delivery => ({
      _id: delivery._id,
      type: delivery.status === 'cancelled' ? 'delivery_cancelled' : 'delivery_created',
      staffName: delivery.metadata?.orderedBy?.name || delivery.sender.userId?.name || 'Unknown',
      action: `${delivery.status === 'cancelled' ? 'Cancelled' : 'Created'} ${delivery.package.urgency} delivery`,
      details: `Order ID: ${delivery.orderId}, Type: ${delivery.package.type}`,
      timestamp: delivery.createdAt,
      timeAgo: getTimeAgo(delivery.createdAt)
    }));

    const total = await Delivery.countDocuments(deliveryQuery);

    return NextResponse.json({
      activities,
      total,
      page,
      limit
    });
  } catch (error) {
    console.error('Error fetching staff activities:', error);
    return NextResponse.json(
      { error: 'Failed to fetch activities' },
      { status: 500 }
    );
  }
}

function getTimeAgo(date) {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  
  if (seconds < 60) return 'Just now';
  
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  
  return new Date(date).toLocaleDateString();
}
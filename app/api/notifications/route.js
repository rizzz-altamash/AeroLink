// app/api/notifications/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { connectDB } from '@/lib/mongodb';
import Notification from '@/models/Notification';
import Delivery from '@/models/Delivery';
import User from '@/models/User';
import Hospital from '@/models/Hospital';

// GET notifications for current user with filters
export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const unreadOnly = searchParams.get('unread') === 'true';
    
    // Filter parameters
    const type = searchParams.get('type');
    const priority = searchParams.get('priority');
    const readStatus = searchParams.get('read');
    const dateRange = searchParams.get('dateRange');

    await connectDB();

    // Build query
    const query = { userId: session.user.id };
    
    // Apply filters
    if (unreadOnly) {
      query.read = false;
    } else if (readStatus && readStatus !== 'all') {
      query.read = readStatus === 'read';
    }
    
    if (type && type !== 'all') {
      query.type = type;
    }
    
    if (priority && priority !== 'all') {
      query.priority = priority;
    }
    
    // Date range filter
    if (dateRange && dateRange !== 'all') {
      const now = new Date();
      let startDate;
      
      switch(dateRange) {
        case 'today':
          startDate = new Date(now.setHours(0, 0, 0, 0));
          break;
        case 'week':
          startDate = new Date(now.setDate(now.getDate() - 7));
          break;
        case 'month':
          startDate = new Date(now.setMonth(now.getMonth() - 1));
          break;
      }
      
      if (startDate) {
        query.createdAt = { $gte: startDate };
      }
    }

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('data.deliveryId', 'orderId status');

    const total = await Notification.countDocuments(query);
    const unreadCount = await Notification.getUnreadCount(session.user.id);

    return NextResponse.json({
      notifications,
      total,
      unreadCount,
      page,
      limit
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch notifications' },
      { status: 500 }
    );
  }
}
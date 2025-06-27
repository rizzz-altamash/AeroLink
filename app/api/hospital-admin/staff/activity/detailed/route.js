// app/api/hospital-admin/staff/activity/detailed/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
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

    const hospitalId = session.user.hospitalId;

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
        const sevenDays = new Date(now);
        sevenDays.setDate(sevenDays.getDate() - 7);
        dateFilter = { $gte: sevenDays };
        break;
      case '30days':
        const thirtyDays = new Date(now);
        thirtyDays.setDate(thirtyDays.getDate() - 30);
        dateFilter = { $gte: thirtyDays };
        break;
      case '90days':
        const ninetyDays = new Date(now);
        ninetyDays.setDate(ninetyDays.getDate() - 90);
        dateFilter = { $gte: ninetyDays };
        break;
    }

    // Get all staff members of this hospital if filtering by specific staff
    let staffIds = [];
    if (staffId && staffId !== 'all') {
      staffIds = [staffId];
    } else {
      const hospitalStaff = await User.find({
        hospitalId: hospitalId,
        role: 'medical_staff'
      }).select('_id');
      staffIds = hospitalStaff.map(staff => staff._id);
    }

    // Build the main query
    const deliveryQuery = {
      $and: [
        // Date filter
        ...(Object.keys(dateFilter).length > 0 ? [{ createdAt: dateFilter }] : []),
        // Hospital and staff filter
        {
          $or: [
            // Outgoing deliveries from this hospital
            {
              'sender.hospitalId': hospitalId,
              ...(staffId && staffId !== 'all' ? { 'sender.userId': staffId } : {})
            },
            // Incoming orders placed by staff from this hospital
            {
              'metadata.orderingHospital': hospitalId,
              'metadata.deliveryType': 'incoming',
              ...(staffId && staffId !== 'all' ? { 'metadata.orderedBy': staffId } : {})
            },
            // Also check if orderedBy is from our staff
            {
              'metadata.orderedBy': { $in: staffIds }
            }
          ]
        }
      ]
    };

    // Apply activity type filter if specified
    if (activityType && activityType !== 'all') {
      if (activityType === 'incoming') {
        deliveryQuery['metadata.deliveryType'] = 'incoming';
      } else if (activityType === 'outgoing') {
        deliveryQuery['$or'] = [
          { 'metadata.deliveryType': { $ne: 'incoming' } },
          { 'metadata.deliveryType': { $exists: false } }
        ];
      } else if (activityType === 'cancelled') {
        deliveryQuery.status = 'cancelled';
      }
    }

    // Get total count
    const total = await Delivery.countDocuments(deliveryQuery);

    // Get paginated deliveries
    const deliveries = await Delivery.find(deliveryQuery)
      .populate('sender.userId', 'name')
      .populate('metadata.orderedBy', 'name')
      .populate('recipient.hospitalId', 'name')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    // Transform to activities with better details
    const activities = deliveries.map(delivery => {
      let staffName = 'Unknown Staff';
      let action = '';
      let actionType = '';
      
      // Determine who created this delivery and what type
      if (delivery.metadata?.deliveryType === 'incoming') {
        // For incoming orders
        staffName = delivery.metadata.orderedBy?.name || 'Unknown Staff';
        actionType = 'incoming_order';
        
        if (delivery.status === 'cancelled') {
          action = `Cancelled incoming ${delivery.package.urgency} order`;
        } else {
          action = `Placed incoming ${delivery.package.urgency} order`;
        }
      } else {
        // For outgoing deliveries
        staffName = delivery.sender.userId?.name || 'Unknown Staff';
        actionType = 'outgoing_delivery';
        
        if (delivery.status === 'cancelled') {
          action = `Cancelled outgoing ${delivery.package.urgency} delivery`;
        } else {
          action = `Created outgoing ${delivery.package.urgency} delivery`;
        }
      }

      // Add recipient info for better context
      const recipientInfo = delivery.metadata?.deliveryType === 'incoming' 
        ? 'from Central Warehouse'
        : `to ${delivery.recipient.hospitalId?.name || delivery.recipient.name || 'Unknown'}`;

      return {
        _id: delivery._id,
        type: actionType,
        staffName,
        action,
        details: `Order ID: ${delivery.orderId}, Type: ${delivery.package.type}, ${recipientInfo}`,
        status: delivery.status,
        urgency: delivery.package.urgency,
        orderId: delivery.orderId,
        packageType: delivery.package.type,
        timestamp: delivery.createdAt,
        timeAgo: getTimeAgo(delivery.createdAt),
        deliveryType: delivery.metadata?.deliveryType || 'outgoing'
      };
    });

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
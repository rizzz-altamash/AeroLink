// app/api/admin/activity/detailed/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import { connectDB } from '@/lib/mongodb';
import Delivery from '@/models/Delivery';
import User from '@/models/User';
import Hospital from '@/models/Hospital';

function isDateInRange(date, filter) {
  const dateObj = new Date(date);
  if (filter.$gte) {
    return dateObj >= filter.$gte;
  }
  return true;
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

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const activityType = searchParams.get('activityType');
    const userRole = searchParams.get('userRole');
    const urgency = searchParams.get('urgency');
    const dateRange = searchParams.get('dateRange');
    const search = searchParams.get('search');

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

    // Fetch deliveries with timeline events
    let deliveryQuery = {};
    
    if (Object.keys(dateFilter).length > 0) {
      deliveryQuery['timeline.timestamp'] = dateFilter;
    }

    if (urgency && urgency !== 'all') {
      deliveryQuery['package.urgency'] = urgency;
    }

    if (search) {
      deliveryQuery.$or = [
        { orderId: { $regex: search, $options: 'i' } }
      ];
    }

    const deliveries = await Delivery.find(deliveryQuery)
      .populate('sender.userId', 'name email role')
      .populate('recipient.userId', 'name email role')
      .populate('metadata.orderedBy', 'name email role')
      .populate('metadata.approvedBy', 'name email role')
      .populate('metadata.rejectedBy', 'name email role')
      .populate('metadata.assignedBy', 'name email role')
      .populate('pilotId', 'name email role')
      .sort({ 'timeline.timestamp': -1 });

    // Process activities from timeline
    const activities = [];

    for (const delivery of deliveries) {
      // Get all timeline events
      for (const event of delivery.timeline) {
        // Skip if date filter doesn't match
        if (Object.keys(dateFilter).length > 0 && !isDateInRange(event.timestamp, dateFilter)) {
          continue;
        }

        let activity = null;

        switch (event.status) {
          case 'pending_approval':
            // Medical staff created delivery/order
            const isIncoming = delivery.metadata?.deliveryType === 'incoming';
            const creator = isIncoming 
              ? delivery.metadata?.orderedBy 
              : delivery.sender?.userId;
              
            if (creator) {
              activity = {
                activityType: isIncoming ? 'placed_order' : 'created_delivery',
                action: isIncoming ? 'Placed Incoming Order' : 'Created Outgoing Delivery',
                userName: creator.name || 'Unknown',
                userRole: 'medical_staff',
                userEmail: creator.email,
                deliveryId: delivery._id,
                orderId: delivery.orderId,
                packageType: delivery.package?.type,
                urgency: delivery.package?.urgency,
                timestamp: event.timestamp,
                notes: event.notes
              };
            }
            break;

          case 'approved':
            // Hospital admin approved
            if (delivery.metadata?.approvedBy) {
              activity = {
                activityType: 'approved_delivery',
                action: 'Approved Delivery',
                userName: delivery.metadata.approvedBy.name || 'Unknown',
                userRole: 'hospital_admin',
                userEmail: delivery.metadata.approvedBy.email,
                deliveryId: delivery._id,
                orderId: delivery.orderId,
                packageType: delivery.package?.type,
                urgency: delivery.package?.urgency,
                timestamp: event.timestamp,
                notes: event.notes
              };
            }
            break;

          case 'rejected':
            // Hospital admin rejected
            if (delivery.metadata?.rejectedBy) {
              activity = {
                activityType: 'rejected_delivery',
                action: 'Rejected Delivery',
                userName: delivery.metadata.rejectedBy.name || 'Unknown',
                userRole: 'hospital_admin',
                userEmail: delivery.metadata.rejectedBy.email,
                deliveryId: delivery._id,
                orderId: delivery.orderId,
                packageType: delivery.package?.type,
                urgency: delivery.package?.urgency,
                timestamp: event.timestamp,
                notes: event.notes,
                reason: delivery.metadata?.rejectionReason
              };
            }
            break;

          case 'assigned':
            // Admin assigned pilot
            if (delivery.metadata?.assignedBy) {
              activity = {
                activityType: 'assigned_pilot',
                action: 'Assigned Pilot',
                userName: delivery.metadata.assignedBy.name || 'Unknown',
                userRole: 'admin',
                userEmail: delivery.metadata.assignedBy.email,
                deliveryId: delivery._id,
                orderId: delivery.orderId,
                packageType: delivery.package?.type,
                urgency: delivery.package?.urgency,
                timestamp: event.timestamp,
                notes: event.notes,
                pilotName: delivery.pilotId?.name
              };
            }
            break;

          case 'in_transit':
            // Pilot started flight
            if (delivery.pilotId) {
              activity = {
                activityType: 'started_flight',
                action: 'Started Flight',
                userName: delivery.pilotId.name || 'Unknown',
                userRole: 'pilot',
                userEmail: delivery.pilotId.email,
                deliveryId: delivery._id,
                orderId: delivery.orderId,
                packageType: delivery.package?.type,
                urgency: delivery.package?.urgency,
                timestamp: event.timestamp,
                notes: event.notes
              };
            }
            break;

          case 'pending_confirmation':
            // Pilot marked delivered
            if (delivery.pilotId) {
              activity = {
                activityType: 'marked_delivered',
                action: 'Marked as Delivered',
                userName: delivery.pilotId.name || 'Unknown',
                userRole: 'pilot',
                userEmail: delivery.pilotId.email,
                deliveryId: delivery._id,
                orderId: delivery.orderId,
                packageType: delivery.package?.type,
                urgency: delivery.package?.urgency,
                timestamp: event.timestamp,
                notes: event.notes
              };
            }
            break;

          case 'delivered':
            // Staff confirmed delivery
            if (event.notes?.includes('confirmed')) {
              activity = {
                activityType: 'confirmed_delivery',
                action: 'Confirmed Delivery',
                userName: 'Medical Staff',
                userRole: 'medical_staff',
                deliveryId: delivery._id,
                orderId: delivery.orderId,
                packageType: delivery.package?.type,
                urgency: delivery.package?.urgency,
                timestamp: event.timestamp,
                notes: event.notes
              };
            }
            break;

          case 'failed':
            // Pilot cancelled flight
            if (delivery.pilotId && event.notes?.includes('cancelled by pilot')) {
              activity = {
                activityType: 'cancelled_flight',
                action: 'Cancelled Flight',
                userName: delivery.pilotId.name || 'Unknown',
                userRole: 'pilot',
                userEmail: delivery.pilotId.email,
                deliveryId: delivery._id,
                orderId: delivery.orderId,
                packageType: delivery.package?.type,
                urgency: delivery.package?.urgency,
                timestamp: event.timestamp,
                notes: event.notes,
                reason: delivery.metadata?.failureReason
              };
            }
            break;
        }

        if (activity) {
          // Apply filters
          if (activityType && activityType !== 'all' && activity.activityType !== activityType) {
            continue;
          }
          if (userRole && userRole !== 'all' && activity.userRole !== userRole) {
            continue;
          }

          // Add time ago
          // activity.timeAgo = getTimeAgo(activity.timestamp);
          if (activity && activity.timestamp) {
            activity.timeAgo = getTimeAgo(activity.timestamp);
          }
          activities.push(activity);
        }
      }
    }

    // Sort by timestamp descending
    activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    // Paginate
    const total = activities.length;
    const paginatedActivities = activities.slice((page - 1) * limit, page * limit);

    return NextResponse.json({
      activities: paginatedActivities,
      total,
      page,
      limit
    });
  } catch (error) {
    console.error('Error fetching detailed activities:', error);
    return NextResponse.json(
      { error: 'Failed to fetch activities' },
      { status: 500 }
    );
  }
}
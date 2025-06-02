// // app/api/admin/activity/route.js
// import { NextResponse } from 'next/server';
// import { getServerSession } from 'next-auth';
// import { authOptions } from '@/app/api/auth/[...nextauth]/route';
// import { connectDB } from '@/lib/mongodb';
// import Delivery from '@/models/Delivery';
// import User from '@/models/User';
// import Hospital from '@/models/Hospital';

// export async function GET(req) {
//   try {
//     const session = await getServerSession(authOptions);
//     if (!session || session.user.role !== 'admin') {
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//     }

//     await connectDB();

//     // Get recent activities
//     const recentDeliveries = await Delivery.find()
//       .populate('sender.userId', 'name')
//       .sort({ createdAt: -1 })
//       .limit(5);

//     const recentUsers = await User.find()
//       .sort({ createdAt: -1 })
//       .limit(5);

//     const activities = [];

//     // Add delivery activities
//     recentDeliveries.forEach(delivery => {
//       activities.push({
//         description: `New ${delivery.package.urgency} delivery created by ${delivery.sender.userId?.name || 'Unknown'}`,
//         timestamp: getTimeAgo(delivery.createdAt)
//       });
//     });

//     // Add user activities
//     recentUsers.forEach(user => {
//       activities.push({
//         description: `New ${user.role} registered: ${user.name}`,
//         timestamp: getTimeAgo(user.createdAt)
//       });
//     });

//     // Sort by time and limit
//     return NextResponse.json(activities.slice(0, 10));
//   } catch (error) {
//     console.error('Error fetching activity:', error);
//     return NextResponse.json(
//       { error: 'Failed to fetch activity' },
//       { status: 500 }
//     );
//   }
// }

// function getTimeAgo(date) {
//   const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  
//   if (seconds < 60) return 'Just now';
  
//   const minutes = Math.floor(seconds / 60);
//   if (minutes < 60) return `${minutes}m ago`;
  
//   const hours = Math.floor(minutes / 60);
//   if (hours < 24) return `${hours}h ago`;
  
//   const days = Math.floor(hours / 24);
//   return `${days}d ago`;
// }



















import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { connectDB } from '@/lib/mongodb';
import Delivery from '@/models/Delivery';
import User from '@/models/User';

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    // Get recent deliveries with their timeline events
    const recentDeliveries = await Delivery.find()
      .populate('sender.userId', 'name email role')
      .populate('recipient.userId', 'name email role')
      .populate('metadata.orderedBy', 'name email role')
      .populate('metadata.approvedBy', 'name email role')
      .populate('metadata.assignedBy', 'name email role')
      .populate('pilotId', 'name email role')
      .sort({ 'timeline.timestamp': -1 })
      .limit(50);

    const activities = [];

    // Process each delivery's timeline to extract activities
    for (const delivery of recentDeliveries) {
      const sortedTimeline = delivery.timeline.sort((a, b) => 
        new Date(b.timestamp) - new Date(a.timestamp)
      );

      for (const event of sortedTimeline.slice(0, 2)) { // Get last 2 events per delivery
        let activity = null;

        switch (event.status) {
          case 'pending_approval':
            const isIncoming = delivery.metadata?.deliveryType === 'incoming';
            const creator = isIncoming 
              ? delivery.metadata?.orderedBy 
              : delivery.sender?.userId;
              
            if (creator) {
              activity = {
                activityType: isIncoming ? 'placed_order' : 'created_delivery',
                action: isIncoming ? 'Placed Order' : 'Created Delivery',
                userName: creator.name || 'Unknown',
                userRole: 'medical_staff',
                orderId: delivery.orderId,
                packageType: delivery.package?.type,
                urgency: delivery.package?.urgency,
                timestamp: event.timestamp,
                timeAgo: getTimeAgo(event.timestamp),
                deliveryId: delivery._id
              };
            }
            break;

          case 'approved':
            if (delivery.metadata?.approvedBy) {
              activity = {
                activityType: 'approved_delivery',
                action: 'Approved',
                userName: delivery.metadata.approvedBy.name || 'Hospital Admin',
                userRole: 'hospital_admin',
                orderId: delivery.orderId,
                packageType: delivery.package?.type,
                urgency: delivery.package?.urgency,
                timestamp: event.timestamp,
                timeAgo: getTimeAgo(event.timestamp),
                deliveryId: delivery._id
              };
            }
            break;

          case 'rejected':
            if (delivery.metadata?.rejectedBy) {
              activity = {
                activityType: 'rejected_delivery',
                action: 'Rejected',
                userName: delivery.metadata.rejectedBy.name || 'Hospital Admin',
                userRole: 'hospital_admin',
                orderId: delivery.orderId,
                packageType: delivery.package?.type,
                urgency: delivery.package?.urgency,
                timestamp: event.timestamp,
                timeAgo: getTimeAgo(event.timestamp),
                deliveryId: delivery._id
              };
            }
            break;

          case 'assigned':
            if (delivery.metadata?.assignedBy && delivery.pilotId) {
              activity = {
                activityType: 'assigned_pilot',
                action: 'Assigned Pilot',
                userName: 'System Admin',
                userRole: 'admin',
                orderId: delivery.orderId,
                packageType: delivery.package?.type,
                urgency: delivery.package?.urgency,
                timestamp: event.timestamp,
                timeAgo: getTimeAgo(event.timestamp),
                deliveryId: delivery._id,
                pilotName: delivery.pilotId.name
              };
            }
            break;

          case 'in_transit':
            if (delivery.pilotId) {
              activity = {
                activityType: 'started_flight',
                action: 'Started Flight',
                userName: delivery.pilotId.name || 'Pilot',
                userRole: 'pilot',
                orderId: delivery.orderId,
                packageType: delivery.package?.type,
                urgency: delivery.package?.urgency,
                timestamp: event.timestamp,
                timeAgo: getTimeAgo(event.timestamp),
                deliveryId: delivery._id
              };
            }
            break;

          case 'pending_confirmation':
            if (delivery.pilotId) {
              activity = {
                activityType: 'marked_delivered',
                action: 'Delivered',
                userName: delivery.pilotId.name || 'Pilot',
                userRole: 'pilot',
                orderId: delivery.orderId,
                packageType: delivery.package?.type,
                urgency: delivery.package?.urgency,
                timestamp: event.timestamp,
                timeAgo: getTimeAgo(event.timestamp),
                deliveryId: delivery._id
              };
            }
            break;

          case 'failed':
            if (delivery.pilotId && event.notes?.includes('cancelled')) {
              activity = {
                activityType: 'cancelled_flight',
                action: 'Cancelled',
                userName: delivery.pilotId.name || 'Pilot',
                userRole: 'pilot',
                orderId: delivery.orderId,
                packageType: delivery.package?.type,
                urgency: delivery.package?.urgency,
                timestamp: event.timestamp,
                timeAgo: getTimeAgo(event.timestamp),
                deliveryId: delivery._id
              };
            }
            break;
        }

        if (activity) {
          activities.push(activity);
        }
      }
    }

    // Sort by timestamp and limit to most recent
    activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    return NextResponse.json(activities.slice(0, 15));
  } catch (error) {
    console.error('Error fetching activity:', error);
    return NextResponse.json(
      { error: 'Failed to fetch activity' },
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
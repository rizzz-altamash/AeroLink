// // BEST -----------------------------
// // app/api/deliveries/active/route.js
// import { NextResponse } from 'next/server';
// import { getServerSession } from 'next-auth';
// import { authOptions } from '@/app/api/auth/[...nextauth]/route';
// import { connectDB } from '@/lib/mongodb';
// import Delivery from '@/models/Delivery';
// import User from '@/models/User';
// import Hospital from '@/models/Hospital';
// import Drone from '@/models/Drone';

// export async function GET(req) {
//   try {
//     const session = await getServerSession(authOptions);
//     if (!session || session.user.role !== 'medical_staff') {
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//     }

//     await connectDB();

//     // Get active deliveries where user is either sender, recipient, or orderer
//     const activeDeliveries = await Delivery.find({
//       $and: [
//         {
//           $or: [
//             { 'sender.userId': session.user.id },
//             { 'recipient.userId': session.user.id },
//             { 'metadata.orderedBy': session.user.id }
//           ]
//         },
//         {
//           status: { $in: ['pending', 'approved', 'assigned', 'pickup', 'in_transit'] }
//         }
//       ]
//     })
//     .populate('recipient.userId', 'name email phoneNumber')
//     .populate('recipient.hospitalId', 'name')
//     .populate('sender.userId', 'name email')
//     .populate('droneId', 'registrationId model')
//     .sort({ createdAt: -1 })
//     .limit(20);

//     // Transform the data to include delivery type info
//     const transformedDeliveries = activeDeliveries.map(delivery => {
//       const isIncoming = delivery.metadata?.deliveryType === 'incoming';
      
//       return {
//         ...delivery.toObject(),
//         displayType: isIncoming ? 'Incoming Order' : 'Outgoing Delivery',
//         displayLocation: isIncoming 
//           ? delivery.recipient.hospitalId?.name || delivery.recipient.name
//           : delivery.recipient.name || 'Unknown Recipient'
//       };
//     });

//     return NextResponse.json(transformedDeliveries);
//   } catch (error) {
//     console.error('Error fetching active deliveries:', error);
//     return NextResponse.json(
//       { error: 'Failed to fetch active deliveries' },
//       { status: 500 }
//     );
//   }
// }
































// app/api/deliveries/active/route.js
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
    if (!session || session.user.role !== 'medical_staff') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    // Get active deliveries where user is either sender, recipient, or orderer
    const activeDeliveries = await Delivery.find({
      $and: [
        {
          $or: [
            { 'sender.userId': session.user.id },
            { 'recipient.userId': session.user.id },
            { 'metadata.orderedBy': session.user.id }
          ]
        },
        {
          status: { $in: ['pending_approval', 'approved', 'assigned', 'pickup', 'in_transit'] }
        }
      ]
    })
    .populate('recipient.userId', 'name email phoneNumber')
    .populate('recipient.hospitalId', 'name')
    .populate('sender.userId', 'name email')
    .populate('droneId', 'registrationId model')
    .populate('metadata.approvedBy', 'name')
    .populate('metadata.rejectedBy', 'name')
    .sort({ createdAt: -1 })
    .limit(20);

    // Transform the data to include delivery type info and approval status
    const transformedDeliveries = activeDeliveries.map(delivery => {
      const isIncoming = delivery.metadata?.deliveryType === 'incoming';
      
      // Calculate time remaining for auto-approval if applicable
      let autoApprovalInfo = null;
      if (delivery.status === 'pending_approval' && 
          delivery.package.urgency === 'urgent' && 
          delivery.metadata.approvalDeadline) {
        const timeRemaining = new Date(delivery.metadata.approvalDeadline) - new Date();
        if (timeRemaining > 0) {
          const hoursRemaining = Math.floor(timeRemaining / (1000 * 60 * 60));
          const minutesRemaining = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
          autoApprovalInfo = {
            deadline: delivery.metadata.approvalDeadline,
            timeRemaining: `${hoursRemaining}h ${minutesRemaining}m`
          };
        }
      }
      
      return {
        ...delivery.toObject(),
        displayType: isIncoming ? 'Incoming Order' : 'Outgoing Delivery',
        displayLocation: isIncoming 
          ? delivery.recipient.hospitalId?.name || delivery.recipient.name
          : delivery.recipient.name || 'Unknown Recipient',
        displayAddress: delivery.recipient?.address,
        approvalStatus: delivery.status === 'pending_approval' 
          ? 'Awaiting Hospital Admin Approval' 
          : delivery.status === 'approved' 
          ? 'Approved - Awaiting Pilot Assignment'
          : delivery.status === 'rejected'
          ? `Rejected: ${delivery.metadata.rejectionReason || 'No reason provided'}`
          : null,
        autoApprovalInfo
      };
    });

    return NextResponse.json(transformedDeliveries);
  } catch (error) {
    console.error('Error fetching active deliveries:', error);
    return NextResponse.json(
      { error: 'Failed to fetch active deliveries' },
      { status: 500 }
    );
  }
}

// Additional endpoint to get deliveries pending approval for hospital admin
export async function getPendingApprovals(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'hospital_admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    // Get deliveries pending approval for this hospital
    const pendingDeliveries = await Delivery.find({
      status: 'pending_approval',
      'sender.hospitalId': session.user.hospitalId
    })
    .populate('sender.userId', 'name email')
    .populate('package')
    .sort({ 'package.urgency': -1, createdAt: -1 });

    // Group by urgency for better visualization
    const grouped = {
      emergency: pendingDeliveries.filter(d => d.package.urgency === 'emergency'),
      urgent: pendingDeliveries.filter(d => d.package.urgency === 'urgent'),
      routine: pendingDeliveries.filter(d => d.package.urgency === 'routine')
    };

    return NextResponse.json({
      total: pendingDeliveries.length,
      byUrgency: grouped,
      all: pendingDeliveries
    });
  } catch (error) {
    console.error('Error fetching pending approvals:', error);
    return NextResponse.json(
      { error: 'Failed to fetch pending approvals' },
      { status: 500 }
    );
  }
}

// Additional endpoint to get deliveries needing pilot assignment for admin
export async function getDeliveriesNeedingAssignment(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    // Get approved deliveries without pilot assignment
    const needingAssignment = await Delivery.find({
      status: 'approved',
      pilotId: { $exists: false }
    })
    .populate('sender.userId', 'name')
    .populate('sender.hospitalId', 'name')
    .populate('recipient.hospitalId', 'name')
    .populate('metadata.approvedBy', 'name')
    .sort({ 'package.urgency': -1, createdAt: -1 });

    // Include auto-approved flag and time since approval
    const enrichedDeliveries = needingAssignment.map(delivery => {
      const timeSinceApproval = new Date() - new Date(delivery.metadata.approvalTime || delivery.createdAt);
      const minutesSinceApproval = Math.floor(timeSinceApproval / (1000 * 60));
      
      return {
        ...delivery.toObject(),
        timeSinceApproval: `${minutesSinceApproval} minutes`,
        isAutoApproved: delivery.metadata.autoApproved || false,
        approverName: delivery.metadata.approvedBy?.name || (delivery.metadata.autoApproved ? 'System (Auto)' : 'Unknown')
      };
    });

    return NextResponse.json({
      total: enrichedDeliveries.length,
      deliveries: enrichedDeliveries
    });
  } catch (error) {
    console.error('Error fetching deliveries needing assignment:', error);
    return NextResponse.json(
      { error: 'Failed to fetch deliveries' },
      { status: 500 }
    );
  }
}
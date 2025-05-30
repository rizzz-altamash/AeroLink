// // app/api/hospital-admin/pending-approvals/route.js
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
//     if (!session || session.user.role !== 'hospital_admin') {
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//     }

//     await connectDB();

//     // Get deliveries pending approval for this hospital
//     const pendingDeliveries = await Delivery.find({
//       status: 'pending_approval',
//       'sender.hospitalId': session.user.hospitalId
//     })
//     .populate('sender.userId', 'name email')
//     .populate('package')
//     .sort({ 'package.urgency': -1, createdAt: -1 });

//     // Group by urgency for better visualization
//     const grouped = {
//       emergency: pendingDeliveries.filter(d => d.package.urgency === 'emergency'),
//       urgent: pendingDeliveries.filter(d => d.package.urgency === 'urgent'),
//       routine: pendingDeliveries.filter(d => d.package.urgency === 'routine')
//     };

//     // Calculate stats
//     const stats = {
//       total: pendingDeliveries.length,
//       emergency: grouped.emergency.length,
//       urgent: grouped.urgent.length,
//       routine: grouped.routine.length,
//       urgentNearingAutoApproval: grouped.urgent.filter(d => {
//         if (!d.metadata?.approvalDeadline) return false;
//         const timeRemaining = new Date(d.metadata.approvalDeadline) - new Date();
//         return timeRemaining > 0 && timeRemaining < 30 * 60 * 1000; // Less than 30 minutes
//       }).length
//     };

//     return NextResponse.json({
//       stats,
//       byUrgency: grouped,
//       all: pendingDeliveries
//     });
//   } catch (error) {
//     console.error('Error fetching pending approvals:', error);
//     return NextResponse.json(
//       { error: 'Failed to fetch pending approvals' },
//       { status: 500 }
//     );
//   }
// }




















// app/api/hospital-admin/pending-approvals/route.js
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

    // Get deliveries pending approval for this hospital
    // For incoming deliveries, check recipient.hospitalId or metadata.orderingHospital
    // For outgoing deliveries, check sender.hospitalId
    const pendingDeliveries = await Delivery.find({
      status: 'pending_approval',
      $or: [
        { 'sender.hospitalId': session.user.hospitalId },
        { 'recipient.hospitalId': session.user.hospitalId },
        { 'metadata.orderingHospital': session.user.hospitalId }
      ]
    })
    .populate('sender.userId', 'name email')
    .populate('metadata.orderedBy', 'name email')
    .populate('package')
    .sort({ 'package.urgency': -1, createdAt: -1 });

    // Add delivery type to each delivery
    const enrichedDeliveries = pendingDeliveries.map(delivery => ({
      ...delivery.toObject(),
      displayType: delivery.metadata?.deliveryType || 'outgoing',
      isIncoming: delivery.metadata?.deliveryType === 'incoming'
    }));


    // Group by urgency for better visualization
    const grouped = {
      emergency: pendingDeliveries.filter(d => d.package.urgency === 'emergency'),
      urgent: pendingDeliveries.filter(d => d.package.urgency === 'urgent'),
      routine: pendingDeliveries.filter(d => d.package.urgency === 'routine')
    };

    // Calculate stats
    const stats = {
      total: pendingDeliveries.length,
      emergency: grouped.emergency.length,
      urgent: grouped.urgent.length,
      routine: grouped.routine.length,
      urgentNearingAutoApproval: grouped.urgent.filter(d => {
        if (!d.metadata?.approvalDeadline) return false;
        const timeRemaining = new Date(d.metadata.approvalDeadline) - new Date();
        return timeRemaining > 0 && timeRemaining < 30 * 60 * 1000; // Less than 30 minutes
      }).length
    };

    console.log(`Found ${pendingDeliveries.length} pending deliveries for hospital ${session.user.hospitalId}`);

    return NextResponse.json({
      stats,
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
// // app/api/hospital-admin/deliveries/[id]/approve/route.js
// import { NextResponse } from 'next/server';
// import { getServerSession } from 'next-auth';
// import { authOptions } from '@/app/api/auth/[...nextauth]/route';
// import { connectDB } from '@/lib/mongodb';
// import Delivery from '@/models/Delivery';
// import User from '@/models/User';
// import Notification from '@/models/Notification';

// export async function POST(req, { params }) {
//   try {
//     const session = await getServerSession(authOptions);
//     if (!session || session.user.role !== 'hospital_admin') {
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//     }

//     const { id } = await params;
//     const { approved, reason } = await req.json();

//     await connectDB();

//     const delivery = await Delivery.findById(id)
//       .populate('sender.userId', 'name')
//       .populate('sender.hospitalId', 'name');

//     if (!delivery) {
//       return NextResponse.json({ error: 'Delivery not found' }, { status: 404 });
//     }

//     // Check if the delivery belongs to the hospital admin's hospital
//     if (delivery.sender.hospitalId?.toString() !== session.user.hospitalId) {
//       return NextResponse.json({ error: 'Unauthorized to approve this delivery' }, { status: 403 });
//     }

//     // Check if delivery is in pending_approval status
//     if (delivery.status !== 'pending_approval') {
//       return NextResponse.json({ 
//         error: 'Delivery is not pending approval',
//         currentStatus: delivery.status 
//       }, { status: 400 });
//     }

//     if (approved) {
//       // Approve the delivery
//       delivery.status = 'approved';
//       delivery.timeline.push({
//         status: 'approved',
//         timestamp: new Date(),
//         notes: `Approved by hospital admin: ${session.user.name}`
//       });

//       // Remove approval requirement
//       delivery.metadata.requiresApproval = false;
//       delivery.metadata.approvedBy = session.user.id;
//       delivery.metadata.approvalTime = new Date();

//       await delivery.save();

//       // Notify system admins that delivery is ready for pilot assignment
//       await notifySystemAdminsForAssignment(delivery);

//       // Notify the medical staff who created the order
//       await notifyMedicalStaff(delivery.sender.userId, delivery, 'approved');

//       return NextResponse.json({ 
//         success: true, 
//         message: 'Delivery approved successfully',
//         delivery 
//       });
//     } else {
//       // Reject the delivery
//       delivery.status = 'rejected';
//       delivery.timeline.push({
//         status: 'rejected',
//         timestamp: new Date(),
//         notes: `Rejected by hospital admin: ${session.user.name}. Reason: ${reason || 'Not specified'}`
//       });

//       delivery.metadata.rejectedBy = session.user.id;
//       delivery.metadata.rejectionReason = reason;
//       delivery.metadata.rejectionTime = new Date();

//       await delivery.save();

//       // Notify the medical staff who created the order
//       await notifyMedicalStaff(delivery.sender.userId, delivery, 'rejected', reason);

//       return NextResponse.json({ 
//         success: true, 
//         message: 'Delivery rejected',
//         delivery 
//       });
//     }
//   } catch (error) {
//     console.error('Error approving delivery:', error);
//     return NextResponse.json(
//       { error: 'Failed to process approval' },
//       { status: 500 }
//     );
//   }
// }

// // Helper function to notify system admins for pilot assignment
// async function notifySystemAdminsForAssignment(delivery) {
//   try {
//     const systemAdmins = await User.find({
//       role: 'admin',
//       isActive: true
//     });

//     const notifications = await Promise.all(
//       systemAdmins.map(admin => 
//         Notification.create({
//           userId: admin._id,
//           type: 'delivery_status',
//           title: 'Delivery Ready for Pilot Assignment',
//           message: `${delivery.package.urgency} delivery ${delivery.orderId} has been approved and requires pilot assignment`,
//           data: {
//             deliveryId: delivery._id,
//             orderId: delivery.orderId,
//             urgency: delivery.package.urgency,
//             packageType: delivery.package.type,
//             status: delivery.status
//           },
//           priority: delivery.package.urgency === 'urgent' ? 'high' : 
//                    delivery.package.urgency === 'emergency' ? 'urgent' : 'medium',
//           actionRequired: true,
//           actionUrl: `/dashboard/admin/assign-pilot/${delivery._id}`
//         })
//       )
//     );

//     console.log(`Notified ${systemAdmins.length} system admins for pilot assignment`);
//     return notifications;
//   } catch (error) {
//     console.error('Error notifying system admins:', error);
//   }
// }

// // Helper function to notify medical staff about approval status
// async function notifyMedicalStaff(userId, delivery, status, reason = '') {
//   try {
//     const title = status === 'approved' 
//       ? 'Delivery Approved' 
//       : 'Delivery Rejected';
    
//     const message = status === 'approved'
//       ? `Your delivery order ${delivery.orderId} has been approved by hospital admin`
//       : `Your delivery order ${delivery.orderId} has been rejected. Reason: ${reason || 'Not specified'}`;

//     await Notification.create({
//       userId: userId,
//       type: 'delivery_status',
//       title,
//       message,
//       data: {
//         deliveryId: delivery._id,
//         orderId: delivery.orderId,
//         urgency: delivery.package.urgency,
//         packageType: delivery.package.type,
//         status: delivery.status,
//         reason: reason
//       },
//       priority: 'medium',
//       actionRequired: false,
//       actionUrl: `/dashboard/delivery/${delivery._id}`
//     });

//     console.log(`Notified medical staff about ${status}`);
//   } catch (error) {
//     console.error('Error notifying medical staff:', error);
//   }
// }



























// app/api/hospital-admin/deliveries/[id]/approve/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { connectDB } from '@/lib/mongodb';
import Delivery from '@/models/Delivery';
import User from '@/models/User';
import Notification from '@/models/Notification';

export async function POST(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'hospital_admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const { approved, reason } = await req.json();

    await connectDB();

    const delivery = await Delivery.findById(id)
      .populate('sender.userId', 'name')
      .populate('sender.hospitalId', 'name');

    if (!delivery) {
      return NextResponse.json({ error: 'Delivery not found' }, { status: 404 });
    }

    // Fix: Convert both to strings for comparison
    const adminHospitalId = session.user.hospitalId.toString();

    // Handle populated hospital object properly
    const senderHospitalId = delivery.sender.hospitalId?._id?.toString() || 
                           delivery.sender.hospitalId?.toString();
    const recipientHospitalId = delivery.recipient.hospitalId?._id?.toString() || 
                              delivery.recipient.hospitalId?.toString();
    const orderingHospitalId = delivery.metadata?.orderingHospital?._id?.toString() || 
                             delivery.metadata?.orderingHospital?.toString();
    
    // Check authorization
    const isAuthorized = 
      senderHospitalId === adminHospitalId ||
      recipientHospitalId === adminHospitalId ||
      orderingHospitalId === adminHospitalId;

    if (!isAuthorized) {
      return NextResponse.json({ error: 'Unauthorized to approve this delivery' }, { status: 403 });
    }

    // Check if delivery is in pending_approval status
    if (delivery.status !== 'pending_approval') {
      return NextResponse.json({ 
        error: 'Delivery is not pending approval',
        currentStatus: delivery.status 
      }, { status: 400 });
    }

    if (approved) {
      // Approve the delivery
      delivery.status = 'approved';
      delivery.timeline.push({
        status: 'approved',
        timestamp: new Date(),
        notes: `Approved by hospital admin: ${session.user.name}`
      });

      // Remove approval requirement
      delivery.metadata.requiresApproval = false;
      delivery.metadata.approvedBy = session.user.id;
      delivery.metadata.approvalTime = new Date();

      await delivery.save();

      // Notify system admins that delivery is ready for pilot assignment
      await notifySystemAdminsForAssignment(delivery);

      // Notify the medical staff who created the order
      // await notifyMedicalStaff(delivery.sender.userId, delivery, 'approved');

      // Notify the medical staff who created the order
      // For incoming deliveries, use orderedBy, for outgoing use sender.userId
      const notifyUserId = delivery.metadata?.orderedBy || delivery.sender.userId;
      await notifyMedicalStaff(notifyUserId, delivery, 'approved');

      return NextResponse.json({ 
        success: true, 
        message: 'Delivery approved successfully',
        delivery 
      });
    } else {
      // Reject the delivery
      delivery.status = 'rejected';
      delivery.timeline.push({
        status: 'rejected',
        timestamp: new Date(),
        notes: `Rejected by hospital admin: ${session.user.name}. Reason: ${reason || 'Not specified'}`
      });

      delivery.metadata.rejectedBy = session.user.id;
      delivery.metadata.rejectionReason = reason;
      delivery.metadata.rejectionTime = new Date();

      await delivery.save();

      // Notify the medical staff who created the order
      // await notifyMedicalStaff(delivery.sender.userId, delivery, 'rejected', reason);
      const notifyUserId = delivery.metadata?.orderedBy || delivery.sender.userId;
      await notifyMedicalStaff(notifyUserId, delivery, 'rejected', reason);

      return NextResponse.json({ 
        success: true, 
        message: 'Delivery rejected',
        delivery 
      });
    }
  } catch (error) {
    console.error('Error approving delivery:', error);
    return NextResponse.json(
      { error: 'Failed to process approval' },
      { status: 500 }
    );
  }
}

// Helper function to notify system admins for pilot assignment
async function notifySystemAdminsForAssignment(delivery) {
  try {
    const systemAdmins = await User.find({
      role: 'admin',
      isActive: true
    });

    const notifications = await Promise.all(
      systemAdmins.map(admin => 
        Notification.create({
          userId: admin._id,
          type: 'delivery_status',
          title: 'Delivery Ready for Pilot Assignment',
          message: `${delivery.package.urgency} delivery ${delivery.orderId} has been approved and requires pilot assignment`,
          data: {
            deliveryId: delivery._id,
            orderId: delivery.orderId,
            urgency: delivery.package.urgency,
            packageType: delivery.package.type,
            status: delivery.status
          },
          priority: delivery.package.urgency === 'urgent' ? 'high' : 
                   delivery.package.urgency === 'emergency' ? 'urgent' : 'medium',
          actionRequired: true,
          actionUrl: `/dashboard/admin/assign-pilot/${delivery._id}`
        })
      )
    );

    console.log(`Notified ${systemAdmins.length} system admins for pilot assignment`);
    return notifications;
  } catch (error) {
    console.error('Error notifying system admins:', error);
  }
}

// Helper function to notify medical staff about approval status
async function notifyMedicalStaff(userId, delivery, status, reason = '') {
  try {
    const title = status === 'approved' 
      ? 'Delivery Approved' 
      : 'Delivery Rejected';
    
    const message = status === 'approved'
      ? `Your delivery order ${delivery.orderId} has been approved by hospital admin`
      : `Your delivery order ${delivery.orderId} has been rejected. Reason: ${reason || 'Not specified'}`;

    await Notification.create({
      userId: userId,
      type: 'delivery_status',
      title,
      message,
      data: {
        deliveryId: delivery._id,
        orderId: delivery.orderId,
        urgency: delivery.package.urgency,
        packageType: delivery.package.type,
        status: delivery.status,
        reason: reason
      },
      priority: 'medium',
      actionRequired: false,
      actionUrl: `/dashboard/delivery/${delivery._id}`
    });

    console.log(`Notified medical staff about ${status}`);
  } catch (error) {
    console.error('Error notifying medical staff:', error);
  }
}
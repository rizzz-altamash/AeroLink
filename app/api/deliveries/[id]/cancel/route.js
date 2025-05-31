// app/api/deliveries/[id]/cancel/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { connectDB } from '@/lib/mongodb';
import { checkRole } from '@/lib/auth-helpers';
import Delivery from '@/models/Delivery';
import User from '@/models/User';
import Hospital from '@/models/Hospital';
import Notification from '@/models/Notification';

export async function POST(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Await params as required in Next.js 14+
    const { id } = await params;

    await connectDB();

    // const delivery = await Delivery.findById(id);

    // Make sure to populate hospital data for notifications
    const delivery = await Delivery.findById(id)
      .populate('sender.hospitalId')
      .populate('recipient.hospitalId')
      .populate('metadata.orderingHospital');

    if (!delivery) {
      return NextResponse.json({ error: 'Delivery not found' }, { status: 404 });
    }

    // Check if user has permission to cancel
    const userId = session.user.id;
    const isAdmin = session.user.role === 'admin';
    const isSender = delivery.sender.userId?.toString() === userId;
    const isOrderer = delivery.metadata?.orderedBy?.toString() === userId;
    const isMedicalStaff = session.user.role === 'medical_staff' && (isSender || isOrderer);

    if (!isAdmin && !isMedicalStaff) {
      return NextResponse.json({ error: 'Unauthorized to cancel this delivery' }, { status: 403 });
    }

    // Medical staff can cancel their own orders at any stage except if already delivered or failed
    const nonCancellableStatuses = ['delivered', 'failed', 'cancelled'];
    
    if (nonCancellableStatuses.includes(delivery.status)) {
      return NextResponse.json(
        { error: `Cannot cancel delivery with status: ${delivery.status}` },
        { status: 400 }
      );
    }

    // Update status
    const previousStatus = delivery.status;
    await delivery.updateStatus('cancelled', `Cancelled by ${session.user.name}`);

    // Send notifications to relevant parties
    await sendCancellationNotifications(delivery, session.user, previousStatus);

    return NextResponse.json({ success: true, delivery });
  } catch (error) {
    console.error('Error cancelling delivery:', error);
    return NextResponse.json(
      { error: 'Failed to cancel delivery' },
      { status: 500 }
    );
  }
}

// Helper function to send cancellation notifications
async function sendCancellationNotifications(delivery, cancelledBy, previousStatus) {
  try {
    const notifications = [];

    // Determine which hospital admins to notify based on delivery type
    let hospitalIdToNotify;
    
    if (delivery.metadata?.deliveryType === 'incoming') {
      // For incoming deliveries, notify the ordering hospital's admin
      hospitalIdToNotify = delivery.metadata?.orderingHospital || delivery.recipient.hospitalId;
    } else {
      // For outgoing deliveries, notify the sender hospital's admin
      hospitalIdToNotify = delivery.sender.hospitalId;
    }

    // Notify hospital admin regardless of status (they should know about all cancellations)
    if (hospitalIdToNotify) {
      const hospitalAdmins = await User.find({
        role: 'hospital_admin',
        hospitalId: hospitalIdToNotify,
        isActive: true
      });

      console.log(`Notifying ${hospitalAdmins.length} hospital admins for hospital ${hospitalIdToNotify}`);

      for (const admin of hospitalAdmins) {
        notifications.push(
          Notification.create({
            userId: admin._id,
            type: 'delivery_status',
            title: 'Delivery Cancelled',
            message: `${delivery.package.urgency} delivery ${delivery.orderId} has been cancelled by ${cancelledBy.name}`,
            data: {
              deliveryId: delivery._id,
              orderId: delivery.orderId,
              urgency: delivery.package.urgency,
              packageType: delivery.package.type,
              cancelledBy: cancelledBy.name,
              previousStatus,
              deliveryType: delivery.metadata?.deliveryType
            },
            priority: delivery.package.urgency === 'emergency' ? 'high' : 'medium',
            actionRequired: false
          })
        );
      }
    }

    // Notify pilot if one was assigned
    if (delivery.pilotId && ['assigned', 'pickup', 'in_transit'].includes(previousStatus)) {
      notifications.push(
        Notification.create({
          userId: delivery.pilotId,
          type: 'delivery_status',
          title: 'Delivery Assignment Cancelled',
          message: `Delivery ${delivery.orderId} has been cancelled`,
          data: {
            deliveryId: delivery._id,
            orderId: delivery.orderId,
            cancelledBy: cancelledBy.name
          },
          priority: 'high',
          actionRequired: false
        })
      );
    }

    // Notify system admin if delivery was in active state
    if (['approved', 'assigned', 'pickup', 'in_transit'].includes(previousStatus)) {
      const systemAdmins = await User.find({
        role: 'admin',
        isActive: true
      });

      for (const admin of systemAdmins) {
        notifications.push(
          Notification.create({
            userId: admin._id,
            type: 'delivery_status',
            title: 'Active Delivery Cancelled',
            message: `${delivery.package.urgency} delivery ${delivery.orderId} has been cancelled`,
            data: {
              deliveryId: delivery._id,
              orderId: delivery.orderId,
              urgency: delivery.package.urgency,
              cancelledBy: cancelledBy.name,
              previousStatus
            },
            priority: delivery.package.urgency === 'emergency' ? 'high' : 'medium',
            actionRequired: false
          })
        );
      }
    }

    // Execute all notifications
    const results = await Promise.all(notifications);
    console.log(`Sent ${results.length} cancellation notifications`);
    
  } catch (error) {
    console.error('Error sending cancellation notifications:', error);
  }
}
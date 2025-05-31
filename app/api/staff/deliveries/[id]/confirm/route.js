// app/api/staff/deliveries/[id]/confirm/route.js
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
    if (!session || session.user.role !== 'medical_staff') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const { confirmed, reason } = await req.json();

    await connectDB();

    const delivery = await Delivery.findById(id)
      .populate('pilotId', 'name')
      .populate('sender.hospitalId')
      .populate('recipient.hospitalId');

    if (!delivery) {
      return NextResponse.json({ error: 'Delivery not found' }, { status: 404 });
    }

    // Verify user has permission to confirm
    const isAuthorized = 
      delivery.sender.userId?.toString() === session.user.id ||
      delivery.recipient.userId?.toString() === session.user.id ||
      delivery.metadata?.orderedBy?.toString() === session.user.id;

    if (!isAuthorized) {
      return NextResponse.json({ error: 'Not authorized to confirm this delivery' }, { status: 403 });
    }

    // Check if delivery is pending confirmation
    if (delivery.status !== 'pending_confirmation') {
      return NextResponse.json({ 
        error: 'Delivery is not pending confirmation',
        currentStatus: delivery.status 
      }, { status: 400 });
    }

    if (confirmed) {
      // Mark as delivered
      delivery.status = 'delivered';
      delivery.timeline.push({
        status: 'delivered',
        timestamp: new Date(),
        notes: `Delivery confirmed by ${session.user.name}`
      });

      // Set actual delivery time
      delivery.delivery.actualDeliveryTime = delivery.metadata.pendingDeliveryTime || new Date();
      
      // Clear pending delivery time
      delete delivery.metadata.pendingDeliveryTime;

      await delivery.save();

      // Send success notifications
      await sendDeliverySuccessNotifications(delivery, session.user);

      // Notify pilot of successful delivery
      if (delivery.pilotId) {
        await Notification.create({
          userId: delivery.pilotId,
          type: 'delivery_status',
          title: 'Delivery Confirmed',
          message: `Delivery ${delivery.orderId} has been confirmed as received`,
          data: {
            deliveryId: delivery._id,
            orderId: delivery.orderId,
            confirmedBy: session.user.name
          },
          priority: 'medium',
          actionRequired: false
        });
      }

      return NextResponse.json({ 
        success: true, 
        message: 'Delivery confirmed successfully' 
      });
    } else {
      // Delivery not confirmed - revert to in_transit
      delivery.status = 'in_transit';
      delivery.timeline.push({
        status: 'in_transit',
        timestamp: new Date(),
        notes: `Delivery confirmation denied by ${session.user.name}. Reason: ${reason || 'Not specified'}`
      });

      // Clear pending delivery time
      delete delivery.metadata.pendingDeliveryTime;

      await delivery.save();

      // Notify pilot that delivery was not confirmed
      if (delivery.pilotId) {
        await Notification.create({
          userId: delivery.pilotId,
          type: 'urgent_alert',
          title: 'Delivery Not Confirmed',
          message: `Delivery ${delivery.orderId} was not confirmed. Reason: ${reason || 'Not specified'}`,
          data: {
            deliveryId: delivery._id,
            orderId: delivery.orderId,
            deniedBy: session.user.name,
            reason: reason
          },
          priority: 'urgent',
          actionRequired: true
        });
      }

      return NextResponse.json({ 
        success: true, 
        message: 'Delivery confirmation denied' 
      });
    }
  } catch (error) {
    console.error('Error confirming delivery:', error);
    return NextResponse.json(
      { error: 'Failed to confirm delivery' },
      { status: 500 }
    );
  }
}

async function sendDeliverySuccessNotifications(delivery, confirmedBy) {
  try {
    const notifications = [];

    // Notify system admins
    const admins = await User.find({ role: 'admin', isActive: true });
    for (const admin of admins) {
      notifications.push(
        Notification.create({
          userId: admin._id,
          type: 'delivery_status',
          title: 'Delivery Completed',
          message: `Delivery ${delivery.orderId} has been successfully completed`,
          data: {
            deliveryId: delivery._id,
            orderId: delivery.orderId,
            urgency: delivery.package.urgency,
            status: 'delivered',
            completedTime: delivery.delivery.actualDeliveryTime
          },
          priority: 'low',
          actionRequired: false
        })
      );
    }

    // Notify hospital admin
    const hospitalId = delivery.metadata?.deliveryType === 'incoming' 
      ? delivery.metadata?.orderingHospital || delivery.recipient.hospitalId
      : delivery.sender.hospitalId;

    if (hospitalId) {
      const hospitalAdmins = await User.find({
        role: 'hospital_admin',
        hospitalId: hospitalId,
        isActive: true
      });

      for (const admin of hospitalAdmins) {
        notifications.push(
          Notification.create({
            userId: admin._id,
            type: 'delivery_status',
            title: 'Delivery Successfully Completed',
            message: `${delivery.package.urgency} delivery ${delivery.orderId} has been delivered`,
            data: {
              deliveryId: delivery._id,
              orderId: delivery.orderId,
              urgency: delivery.package.urgency,
              status: 'delivered',
              deliveryTime: delivery.delivery.actualDeliveryTime
            },
            priority: 'low',
            actionRequired: false
          })
        );
      }
    }

    // Notify medical staff (if not the one who confirmed)
    const staffUserId = delivery.metadata?.orderedBy || delivery.sender.userId;
    if (staffUserId && staffUserId.toString() !== confirmedBy._id.toString()) {
      notifications.push(
        Notification.create({
          userId: staffUserId,
          type: 'delivery_status',
          title: 'Delivery Completed Successfully!',
          message: `Your delivery ${delivery.orderId} has been successfully delivered`,
          data: {
            deliveryId: delivery._id,
            orderId: delivery.orderId,
            urgency: delivery.package.urgency,
            status: 'delivered',
            deliveryTime: delivery.delivery.actualDeliveryTime
          },
          priority: 'medium',
          actionRequired: false
        })
      );
    }

    await Promise.all(notifications);
    console.log(`Sent ${notifications.length} delivery success notifications`);
  } catch (error) {
    console.error('Error sending success notifications:', error);
  }
}
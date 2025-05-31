// app/api/pilot/deliveries/[id]/cancel-flight/route.js
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
    if (!session || session.user.role !== 'pilot') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const { reason } = await req.json();

    if (!reason || reason.trim().length < 10) {
      return NextResponse.json({ 
        error: 'Please provide a detailed cancellation reason (minimum 10 characters)' 
      }, { status: 400 });
    }

    await connectDB();

    const delivery = await Delivery.findById(id)
      .populate('sender.hospitalId')
      .populate('recipient.hospitalId');

    if (!delivery) {
      return NextResponse.json({ error: 'Delivery not found' }, { status: 404 });
    }

    // Verify pilot is assigned to this delivery
    if (delivery.pilotId?.toString() !== session.user.id) {
      return NextResponse.json({ error: 'Not authorized for this delivery' }, { status: 403 });
    }

    // Check if delivery is in transit
    if (delivery.status !== 'in_transit') {
      return NextResponse.json({ 
        error: 'Can only cancel flights that are in transit',
        currentStatus: delivery.status 
      }, { status: 400 });
    }

    // Update delivery status
    delivery.status = 'failed';
    delivery.timeline.push({
      status: 'failed',
      timestamp: new Date(),
      notes: `Flight cancelled by pilot: ${reason}`
    });

    delivery.metadata.failureReason = reason;
    delivery.metadata.failedBy = session.user.id;
    delivery.metadata.failureTime = new Date();

    await delivery.save();

    // Send notifications with cancellation reason
    await sendFlightCancelledNotifications(delivery, session.user, reason);

    return NextResponse.json({ 
      success: true, 
      message: 'Flight cancelled',
      delivery: {
        _id: delivery._id,
        orderId: delivery.orderId,
        status: delivery.status
      }
    });
  } catch (error) {
    console.error('Error cancelling flight:', error);
    return NextResponse.json(
      { error: 'Failed to cancel flight' },
      { status: 500 }
    );
  }
}

async function sendFlightCancelledNotifications(delivery, pilot, reason) {
  try {
    const notifications = [];

    // Notify system admins
    const admins = await User.find({ role: 'admin', isActive: true });
    for (const admin of admins) {
      notifications.push(
        Notification.create({
          userId: admin._id,
          type: 'urgent_alert',
          title: 'Flight Cancelled',
          message: `Delivery ${delivery.orderId} flight cancelled by pilot. Reason: ${reason}`,
          data: {
            deliveryId: delivery._id,
            orderId: delivery.orderId,
            urgency: delivery.package.urgency,
            status: 'failed',
            cancellationReason: reason,
            pilotName: pilot.name
          },
          priority: 'urgent',
          actionRequired: true
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
            type: 'urgent_alert',
            title: 'Delivery Flight Cancelled',
            message: `${delivery.package.urgency} delivery ${delivery.orderId} flight has been cancelled`,
            data: {
              deliveryId: delivery._id,
              orderId: delivery.orderId,
              urgency: delivery.package.urgency,
              status: 'failed',
              cancellationReason: reason
            },
            priority: 'high',
            actionRequired: false
          })
        );
      }
    }

    // Notify medical staff
    const staffUserId = delivery.metadata?.orderedBy || delivery.sender.userId;
    if (staffUserId) {
      notifications.push(
        Notification.create({
          userId: staffUserId,
          type: 'urgent_alert',
          title: 'Delivery Cancelled',
          message: `Your delivery ${delivery.orderId} has been cancelled by the pilot. Reason: ${reason}`,
          data: {
            deliveryId: delivery._id,
            orderId: delivery.orderId,
            urgency: delivery.package.urgency,
            status: 'failed',
            cancellationReason: reason
          },
          priority: 'urgent',
          actionRequired: false
        })
      );
    }

    await Promise.all(notifications);
    console.log(`Sent ${notifications.length} flight cancellation notifications`);
  } catch (error) {
    console.error('Error sending cancellation notifications:', error);
  }
}
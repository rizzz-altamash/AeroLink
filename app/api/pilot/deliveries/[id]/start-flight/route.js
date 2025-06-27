// app/api/pilot/deliveries/[id]/start-flight/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
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

    await connectDB();

    const delivery = await Delivery.findById(id)
      .populate('sender.hospitalId')
      .populate('recipient.hospitalId')
      .populate('metadata.orderedBy');

    if (!delivery) {
      return NextResponse.json({ error: 'Delivery not found' }, { status: 404 });
    }

    // Verify pilot is assigned to this delivery
    if (delivery.pilotId?.toString() !== session.user.id) {
      return NextResponse.json({ error: 'Not authorized for this delivery' }, { status: 403 });
    }

    // Check if delivery is in correct status
    if (delivery.status !== 'assigned') {
      return NextResponse.json({ 
        error: 'Delivery must be in assigned status to start flight',
        currentStatus: delivery.status 
      }, { status: 400 });
    }

    // Update delivery status to in_transit
    delivery.status = 'in_transit';
    delivery.timeline.push({
      status: 'in_transit',
      timestamp: new Date(),
      notes: `Flight started by pilot ${session.user.name}`
    });

    // Set actual pickup time
    if (!delivery.delivery) {
      delivery.delivery = {};
    }
    delivery.delivery.actualPickupTime = new Date();

    await delivery.save();

    // Send notifications
    await sendFlightStartedNotifications(delivery, session.user);

    return NextResponse.json({ 
      success: true, 
      message: 'Flight started successfully',
      delivery: {
        _id: delivery._id,
        orderId: delivery.orderId,
        status: delivery.status
      }
    });
  } catch (error) {
    console.error('Error starting flight:', error);
    return NextResponse.json(
      { error: 'Failed to start flight' },
      { status: 500 }
    );
  }
}

async function sendFlightStartedNotifications(delivery, pilot) {
  try {
    const notifications = [];

    // Notify system admins
    const admins = await User.find({ role: 'admin', isActive: true });
    for (const admin of admins) {
      notifications.push(
        Notification.create({
          userId: admin._id,
          type: 'delivery_status',
          title: 'Delivery In Transit',
          message: `Delivery ${delivery.orderId} is now in transit`,
          data: {
            deliveryId: delivery._id,
            orderId: delivery.orderId,
            urgency: delivery.package.urgency,
            status: 'in_transit',
            pilotName: pilot.name
          },
          priority: delivery.package.urgency === 'emergency' ? 'high' : 'medium',
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
            title: 'Package On The Way',
            message: `${delivery.package.urgency} delivery ${delivery.orderId} is on the way`,
            data: {
              deliveryId: delivery._id,
              orderId: delivery.orderId,
              urgency: delivery.package.urgency,
              status: 'in_transit'
            },
            priority: delivery.package.urgency === 'emergency' ? 'high' : 'medium',
            actionRequired: false
          })
        );
      }
    }

    // Notify medical staff (sender/orderer)
    const staffUserId = delivery.metadata?.orderedBy || delivery.sender.userId;
    if (staffUserId) {
      notifications.push(
        Notification.create({
          userId: staffUserId,
          type: 'delivery_status',
          title: 'Your Package is On The Way!',
          message: `Delivery ${delivery.orderId} has been picked up and is in transit`,
          data: {
            deliveryId: delivery._id,
            orderId: delivery.orderId,
            urgency: delivery.package.urgency,
            status: 'in_transit',
            estimatedDeliveryTime: delivery.delivery?.scheduledTime
          },
          priority: 'high',
          actionRequired: false,
          actionUrl: `/dashboard/track/${delivery._id}`
        })
      );
    }

    await Promise.all(notifications);
    console.log(`Sent ${notifications.length} flight started notifications`);
  } catch (error) {
    console.error('Error sending flight started notifications:', error);
  }
}
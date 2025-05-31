// app/api/pilot/deliveries/[id]/mark-delivered/route.js
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

    await connectDB();

    const delivery = await Delivery.findById(id);

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
        error: 'Delivery must be in transit to mark as delivered',
        currentStatus: delivery.status 
      }, { status: 400 });
    }

    // Update status to pending_confirmation
    delivery.status = 'pending_confirmation';
    delivery.timeline.push({
      status: 'pending_confirmation',
      timestamp: new Date(),
      notes: `Pilot marked as delivered, awaiting staff confirmation`
    });

    // Store temporary delivery time
    if (!delivery.metadata.pendingDeliveryTime) {
      delivery.metadata.pendingDeliveryTime = new Date();
    }

    await delivery.save();

    // Send confirmation request to medical staff
    await sendDeliveryConfirmationRequest(delivery, session.user);

    return NextResponse.json({ 
      success: true, 
      message: 'Delivery marked as complete, awaiting staff confirmation',
      delivery: {
        _id: delivery._id,
        orderId: delivery.orderId,
        status: delivery.status
      }
    });
  } catch (error) {
    console.error('Error marking delivery as done:', error);
    return NextResponse.json(
      { error: 'Failed to mark delivery as done' },
      { status: 500 }
    );
  }
}

async function sendDeliveryConfirmationRequest(delivery, pilot) {
  try {
    // For incoming deliveries, notify the staff who ordered
    // For outgoing deliveries, notify the recipient if they're a staff member
    let notifyUserId;
    
    if (delivery.metadata?.deliveryType === 'incoming') {
      notifyUserId = delivery.metadata?.orderedBy || delivery.recipient.userId;
    } else {
      // For outgoing, check if recipient is a medical staff
      const recipientUser = await User.findById(delivery.recipient.userId);
      if (recipientUser && recipientUser.role === 'medical_staff') {
        notifyUserId = delivery.recipient.userId;
      } else {
        // If recipient is not staff, notify the sender
        notifyUserId = delivery.sender.userId;
      }
    }

    if (notifyUserId) {
      await Notification.create({
        userId: notifyUserId,
        type: 'delivery_status',
        title: 'Confirm Delivery Receipt',
        message: `Please confirm receipt of delivery ${delivery.orderId}`,
        data: {
          deliveryId: delivery._id,
          orderId: delivery.orderId,
          urgency: delivery.package.urgency,
          packageType: delivery.package.type,
          requiresConfirmation: true
        },
        priority: 'low',
        actionRequired: true,
        actionUrl: `/dashboard/confirm-delivery/${delivery._id}`
      });

      console.log('Sent delivery confirmation request to staff');
    }
  } catch (error) {
    console.error('Error sending confirmation request:', error);
  }
}
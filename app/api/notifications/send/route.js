// app/api/notifications/send/route.js
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Notification from '@/models/Notification';
import Delivery from '@/models/Delivery';
import User from '@/models/User';
import Hospital from '@/models/Hospital';

export async function POST(req) {
  try {
    const { deliveryId, notificationType } = await req.json();
    
    await connectDB();

    const delivery = await Delivery.findById(deliveryId).populate('sender.userId');
    if (!delivery) {
      return NextResponse.json({ error: 'Delivery not found' }, { status: 404 });
    }

    // Get users to notify based on notification type and urgency
    const query = {
      isActive: true,
      $or: []
    };

    // Always notify admins
    query.$or.push({ role: 'admin' });

    // Notify hospital admin of the sender's hospital
    if (delivery.sender.hospitalId) {
      query.$or.push({ 
        role: 'hospital_admin', 
        hospitalId: delivery.sender.hospitalId 
      });
    }

    // For urgent/emergency deliveries, notify all pilots
    if (['urgent', 'emergency'].includes(delivery.package.urgency)) {
      query.$or.push({ role: 'pilot' });
    }

    const usersToNotify = await User.find(query);

    // Create notifications for each user
    const notifications = await Promise.all(
      usersToNotify.map(user => 
        Notification.createDeliveryNotification(
          user._id,
          delivery,
          notificationType || 'new_delivery'
        )
      )
    );

    // In production, also send:
    // - Email notifications
    // - SMS for urgent/emergency
    // - Push notifications
    // - WebSocket events for real-time updates

    return NextResponse.json({ 
      success: true,
      notificationsSent: notifications.length,
      recipients: {
        admins: usersToNotify.filter(u => u.role === 'admin').length,
        hospitalAdmins: usersToNotify.filter(u => u.role === 'hospital_admin').length,
        pilots: usersToNotify.filter(u => u.role === 'pilot').length
      }
    });
  } catch (error) {
    console.error('Error sending notifications:', error);
    return NextResponse.json(
      { error: 'Failed to send notifications' },
      { status: 500 }
    );
  }
}
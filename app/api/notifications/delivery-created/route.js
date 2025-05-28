// app/api/notifications/delivery-created/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import Delivery from '@/models/Delivery';

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { deliveryId, urgency } = await req.json();
    await connectDB();

    // Get delivery details
    const delivery = await Delivery.findById(deliveryId)
      .populate('recipient.hospitalId');

    // Find all admins and pilots
    const admins = await User.find({ role: 'admin', isActive: true });
    const pilots = await User.find({ role: 'pilot', isActive: true });

    // Create notifications for admins
    for (const admin of admins) {
      // Send email/SMS/push notification to admin
      console.log(`Notifying admin ${admin.email} about new ${urgency} delivery ${delivery.orderId}`);
      
      // In real implementation, use email service like SendGrid
      // await sendEmail({
      //   to: admin.email,
      //   subject: `New ${urgency.toUpperCase()} Delivery Order`,
      //   body: `New delivery order ${delivery.orderId} requires processing.`
      // });
    }

    // For urgent/emergency deliveries, also notify pilots
    if (urgency === 'urgent' || urgency === 'emergency') {
      for (const pilot of pilots) {
        console.log(`Notifying pilot ${pilot.email} about ${urgency} delivery`);
        
        // Send notification to pilot
        // await sendNotification({
        //   to: pilot.phoneNumber,
        //   message: `URGENT: New ${urgency} delivery available for pickup`
        // });
      }
    }

    return NextResponse.json({ 
      success: true,
      notifiedAdmins: admins.length,
      notifiedPilots: (urgency === 'urgent' || urgency === 'emergency') ? pilots.length : 0
    });
  } catch (error) {
    console.error('Error sending notifications:', error);
    return NextResponse.json(
      { error: 'Failed to send notifications' },
      { status: 500 }
    );
  }
}
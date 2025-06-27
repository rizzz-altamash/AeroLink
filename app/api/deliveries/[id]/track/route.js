// app/api/deliveries/[id]/track/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { connectDB } from '@/lib/mongodb';
import Delivery from '@/models/Delivery';
import User from '@/models/User';
import Hospital from '@/models/Hospital';
import Drone from '@/models/Drone';

export async function GET(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Await params as required in Next.js 14+
    const { id } = await params;

    await connectDB();

    // First, get the delivery without populating to check permissions
    const delivery = await Delivery.findById(id);

    if (!delivery) {
      return NextResponse.json({ error: 'Delivery not found' }, { status: 404 });
    }

    // Check if user has permission to track this delivery
    const userId = session.user.id;
    
    // Convert ObjectIds to strings for comparison
    const senderUserId = delivery.sender.userId?.toString();
    const recipientUserId = delivery.recipient.userId?.toString();
    const orderedBy = delivery.metadata?.orderedBy?.toString();
    const pilotId = delivery.pilotId?.toString();
    const senderHospitalId = delivery.sender.hospitalId?.toString();
    const recipientHospitalId = delivery.recipient.hospitalId?.toString();
    
    // Permission checks
    const isAdmin = session.user.role === 'admin';
    const isPilot = session.user.role === 'pilot' && pilotId === userId;
    const isSender = senderUserId === userId;
    const isRecipient = recipientUserId === userId;
    const isOrderer = orderedBy === userId;
    const isHospitalAdmin = session.user.role === 'hospital_admin' && 
      (senderHospitalId === session.user.hospitalId || 
       recipientHospitalId === session.user.hospitalId);

    // // Debug logging
    // console.log('Permission check:', {
    //   userId,
    //   senderUserId,
    //   recipientUserId,
    //   orderedBy,
    //   'userId === recipientUserId': userId === recipientUserId,
    //   'userId === senderUserId': userId === senderUserId,
    //   'userId === orderedBy': userId === orderedBy,
    //   deliveryType: delivery.metadata?.deliveryType,
    //   permissions: {
    //     isAdmin,
    //     isPilot,
    //     isSender,
    //     isRecipient,
    //     isOrderer,
    //     isHospitalAdmin
    //   }
    // });

    const hasPermission = isAdmin || isPilot || isSender || isRecipient || isOrderer || isHospitalAdmin;

    if (!hasPermission) {
      return NextResponse.json({ 
        error: 'Unauthorized to view this delivery',
        debug: {
          userId,
          senderUserId,
          recipientUserId,
          orderedBy,
          deliveryType: delivery.metadata?.deliveryType,
          permissions: {
            isAdmin,
            isPilot,
            isSender,
            isRecipient,
            isOrderer,
            isHospitalAdmin
          }
        }
      }, { status: 403 });
    }

    // Now populate the fields for the response
    const populatedDelivery = await Delivery.findById(id)
      .populate('droneId', 'registrationId model currentLocation')
      .populate('recipient.userId', 'name email')
      .populate('sender.userId', 'name email')
      .populate('recipient.hospitalId', 'name')
      .populate('sender.hospitalId', 'name');

    // Return delivery data with additional tracking info
    const trackingData = {
      _id: populatedDelivery._id,
      orderId: populatedDelivery.orderId,
      status: populatedDelivery.status,
      package: populatedDelivery.package,
      sender: {
        name: populatedDelivery.sender.userId?.name || 'Warehouse',
        email: populatedDelivery.sender.userId?.email,
        hospitalName: populatedDelivery.sender.hospitalId?.name,
        location: populatedDelivery.sender.location
      },
      recipient: {
        name: populatedDelivery.recipient.userId?.name || populatedDelivery.recipient.name,
        email: populatedDelivery.recipient.userId?.email,
        hospitalName: populatedDelivery.recipient.hospitalId?.name,
        location: populatedDelivery.recipient.location
      },
      timeline: populatedDelivery.timeline,
      tracking: populatedDelivery.tracking,
      droneId: populatedDelivery.droneId,
      delivery: populatedDelivery.delivery,
      pricing: populatedDelivery.pricing,
      flightPath: populatedDelivery.flightPath,
      metadata: populatedDelivery.metadata || {},
      createdAt: populatedDelivery.createdAt,
      updatedAt: populatedDelivery.updatedAt
    };

    return NextResponse.json(trackingData);
  } catch (error) {
    console.error('Error fetching tracking data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tracking data', details: error.message },
      { status: 500 }
    );
  }
}
// app/api/hospital-admin/deliveries/[id]/payment/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { connectDB } from '@/lib/mongodb';
import PaymentHistory from '@/models/PaymentHistory';
import Delivery from '@/models/Delivery';
import { processAutoDeduction } from '@/lib/payment-processor';

export async function POST(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'hospital_admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const { action } = await req.json();

    await connectDB();

    const delivery = await Delivery.findById(id)
      .populate('sender.userId')
      .populate('sender.hospitalId');

    if (!delivery) {
      return NextResponse.json({ error: 'Delivery not found' }, { status: 404 });
    }

    // Verify the delivery belongs to the admin's hospital
    if (delivery.sender.hospitalId._id.toString() !== session.user.hospitalId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    if (action === 'retry') {
      // Retry auto-deduction
      const result = await processAutoDeduction(delivery, delivery.sender.hospitalId);
      
      if (result.success) {
        return NextResponse.json({
          success: true,
          message: 'Payment retry initiated',
          ...result
        });
      } else {
        return NextResponse.json({
          success: false,
          error: result.error
        }, { status: 400 });
      }
    } else if (action === 'manual') {
      // Create payment record for manual processing
      const paymentRecord = await PaymentHistory.create({
        hospitalId: delivery.sender.hospitalId._id,
        deliveryId: delivery._id,
        orderId: delivery.orderId,
        amount: delivery.pricing.totalPrice,
        status: 'pending',
        priceBreakdown: delivery.pricing,
        staffDetails: {
          id: delivery.sender.userId._id,
          name: delivery.sender.userId.name,
          email: delivery.sender.userId.email
        },
        deliveryDetails: {
          packageType: delivery.package.type,
          urgency: delivery.package.urgency,
          weight: delivery.package.weight,
          deliveredAt: delivery.delivery.actualDeliveryTime
        },
        metadata: {
          manualPayment: true,
          createdBy: session.user.id
        }
      });

      return NextResponse.json({
        success: true,
        message: 'Manual payment record created',
        paymentId: paymentRecord._id
      });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Error processing payment action:', error);
    return NextResponse.json(
      { error: 'Failed to process payment action' },
      { status: 500 }
    );
  }
}
// app/api/webhooks/razorpay/route.js
import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { connectDB } from '@/lib/mongodb';
import PaymentHistory from '@/models/PaymentHistory';
import Hospital from '@/models/Hospital';
import Delivery from '@/models/Delivery';
import Notification from '@/models/Notification';
import User from '@/models/User';

export async function POST(req) {
  try {
    const body = await req.text();
    const signature = req.headers.get('x-razorpay-signature');
    
    let event;
    
    // In test mode, Razorpay might not provide webhook secret
    // So we'll skip verification in development
    if (process.env.NODE_ENV === 'development' || !process.env.RAZORPAY_WEBHOOK_SECRET || process.env.RAZORPAY_WEBHOOK_SECRET === 'not_provided') {
      console.log('⚠️  Webhook signature verification skipped (test mode)');
      event = JSON.parse(body);
    } else {
      // Production: Verify webhook signature
      const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET)
        .update(body)
        .digest('hex');
      
      if (signature !== expectedSignature) {
        console.error('Invalid webhook signature');
        return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
      }
      event = JSON.parse(body);
    }
    
    console.log('📨 Razorpay webhook event received:', {
      event: event.event,
      paymentId: event.payload?.payment?.entity?.id,
      orderId: event.payload?.order?.entity?.id || event.payload?.payment?.entity?.order_id
    });
    
    await connectDB();
    
    // Process events
    switch (event.event) {
      case 'payment.captured':
        await handlePaymentCaptured(event.payload.payment.entity);
        break;
      case 'payment.failed':
        await handlePaymentFailed(event.payload.payment.entity);
        break;
      case 'payment.authorized':
        await handlePaymentAuthorized(event.payload.payment.entity);
        break;
      case 'order.paid':
        await handleOrderPaid(event.payload.order.entity);
        break;
      default:
        console.log('Unhandled webhook event type:', event.event);
    }
    
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('❌ Webhook processing error:', error);
    return NextResponse.json({ error: 'Webhook failed' }, { status: 500 });
  }
}

async function handlePaymentCaptured(payment) {
  try {
    console.log('💰 Payment captured:', payment.id, 'Amount:', payment.amount / 100);
    
    // Update payment history record
    const paymentRecord = await PaymentHistory.findOneAndUpdate(
      { razorpayOrderId: payment.order_id },
      { 
        status: 'completed',
        razorpayPaymentId: payment.id,
        paymentMethod: {
          type: payment.method,
          last4: payment.card?.last4,
          upiId: payment.vpa
        },
        'metadata.capturedAt': new Date(),
        'metadata.paymentDetails': payment
      }
    );

    if (paymentRecord) {
      console.log('✅ Payment record updated:', paymentRecord.orderId);
      
      // Update hospital billing stats
      await Hospital.findByIdAndUpdate(paymentRecord.hospitalId, {
        $inc: {
          'billing.totalSpent': paymentRecord.amount,
          'billing.pendingAmount': -paymentRecord.amount
        }
      });

      // Update delivery payment status
      await Delivery.findByIdAndUpdate(paymentRecord.deliveryId, {
        'metadata.paymentStatus': 'completed',
        'metadata.paymentCompletedAt': new Date()
      });

      // Send success notification to hospital admin
      const hospitalAdmins = await User.find({
        hospitalId: paymentRecord.hospitalId,
        role: 'hospital_admin',
        isActive: true
      });

      for (const admin of hospitalAdmins) {
        await Notification.create({
          userId: admin._id,
          type: 'payment_status',
          title: 'Payment Successful',
          message: `Payment of ₹${paymentRecord.amount} for delivery ${paymentRecord.orderId} has been processed successfully`,
          data: {
            paymentId: paymentRecord._id,
            orderId: paymentRecord.orderId,
            amount: paymentRecord.amount
          },
          priority: 'low'
        });
      }
      
      console.log('✅ All updates completed for payment:', payment.id);
    } else {
      console.log('⚠️  No payment record found for order:', payment.order_id);
    }
  } catch (error) {
    console.error('❌ Error handling payment captured:', error);
  }
}

async function handlePaymentFailed(payment) {
  try {
    console.log('❌ Payment failed:', payment.id, 'Reason:', payment.error_description);
    
    // Update payment history record
    const paymentRecord = await PaymentHistory.findOneAndUpdate(
      { razorpayOrderId: payment.order_id },
      { 
        status: 'failed',
        razorpayPaymentId: payment.id,
        'metadata.failedAt': new Date(),
        'metadata.failureReason': payment.error_description || payment.error_reason,
        'metadata.errorCode': payment.error_code,
        'metadata.paymentDetails': payment
      }
    );

    if (paymentRecord) {
      // Send failure notification
      const hospitalAdmins = await User.find({
        hospitalId: paymentRecord.hospitalId,
        role: 'hospital_admin',
        isActive: true
      });

      for (const admin of hospitalAdmins) {
        await Notification.create({
          userId: admin._id,
          type: 'urgent_alert',
          title: 'Payment Failed',
          message: `Payment of ₹${paymentRecord.amount} for delivery ${paymentRecord.orderId} has failed. Reason: ${payment.error_description || 'Unknown error'}`,
          data: {
            paymentId: paymentRecord._id,
            orderId: paymentRecord.orderId,
            amount: paymentRecord.amount,
            error: payment.error_description
          },
          priority: 'urgent',
          actionRequired: true
        });
      }

      // Update delivery metadata
      await Delivery.findByIdAndUpdate(paymentRecord.deliveryId, {
        'metadata.paymentStatus': 'failed',
        'metadata.paymentFailureReason': payment.error_description
      });
    }
  } catch (error) {
    console.error('❌ Error handling payment failed:', error);
  }
}

async function handlePaymentAuthorized(payment) {
  console.log('🔐 Payment authorized:', payment.id);
  // Handle authorized payments if using 2-step payment flow
  // Most implementations will use direct capture, so this might not be needed
}

async function handleOrderPaid(order) {
  console.log('📦 Order paid:', order.id, 'Amount:', order.amount / 100);
  // Handle order payment completion
  // This event is triggered when the order is fully paid
}

// Add this test endpoint to verify webhook is working
export async function GET(req) {
  return NextResponse.json({
    status: 'Webhook endpoint is active',
    testMode: process.env.NODE_ENV === 'development',
    secretConfigured: !!process.env.RAZORPAY_WEBHOOK_SECRET && process.env.RAZORPAY_WEBHOOK_SECRET !== 'not_provided'
  });
}
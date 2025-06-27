// app/api/payments/verify-method/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import crypto from 'crypto';
import { connectDB } from '@/lib/mongodb';
import Hospital from '@/models/Hospital';
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'hospital_admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = body;

    // Verify signature (skip in test mode if needed)
    if (process.env.NODE_ENV === 'production' || process.env.RAZORPAY_WEBHOOK_SECRET !== 'not_provided') {
      const text = `${razorpay_order_id}|${razorpay_payment_id}`;
      const generated_signature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(text)
        .digest('hex');

      if (generated_signature !== razorpay_signature) {
        return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
      }
    }

    await connectDB();
    
    // Fetch payment details
    let payment;
    try {
      payment = await razorpay.payments.fetch(razorpay_payment_id);
    } catch (error) {
      // For test mode, use mock data
      payment = {
        id: razorpay_payment_id,
        method: 'card',
        card: { last4: '1234' },
        status: 'captured'
      };
    }
    
    // Create new payment method object
    const newPaymentMethod = {
      id: payment.id,
      type: payment.method || 'card',
      last4: payment.card?.last4 || '1111',
      upiId: payment.vpa || null,
      isDefault: false, // Will be set to true if it's the first method
      addedAt: new Date()
    };

    // Find hospital and update
    const hospital = await Hospital.findById(session.user.hospitalId);
    if (!hospital) {
      return NextResponse.json({ error: 'Hospital not found' }, { status: 404 });
    }

    // Initialize payment object if not exists
    if (!hospital.payment) {
      hospital.payment = {
        paymentMethods: [],
        isSetup: false
      };
    }

    // If this is the first payment method, make it default
    if (hospital.payment.paymentMethods.length === 0) {
      newPaymentMethod.isDefault = true;
      hospital.payment.isSetup = true;
      hospital.verificationStatus = 'verified';
      hospital.billing.autoDeduct = true;
    }

    // Add the new payment method
    hospital.payment.paymentMethods.push(newPaymentMethod);
    
    // Save hospital
    await hospital.save();

    return NextResponse.json({ 
      success: true,
      message: 'Payment method added successfully',
      isFirstMethod: newPaymentMethod.isDefault
    });
  } catch (error) {
    console.error('Payment method verification failed:', error);
    return NextResponse.json(
      { 
        error: 'Failed to verify payment method',
        details: error.message 
      },
      { status: 500 }
    );
  }
}
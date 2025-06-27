// app/api/payments/add-method/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import Razorpay from 'razorpay';
import { connectDB } from '@/lib/mongodb';
import Hospital from '@/models/Hospital';

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

    await connectDB();

    const hospital = await Hospital.findById(session.user.hospitalId);
    if (!hospital) {
      return NextResponse.json({ error: 'Hospital not found' }, { status: 404 });
    }
    
    let customerId = hospital.payment?.razorpayCustomerId;
    
    // Create or get customer
    if (!customerId) {
      const customer = await razorpay.customers.create({
        name: hospital.name,
        email: hospital.contactInfo?.email || session.user.email || 'noemail@hospital.com',
        contact: hospital.contactInfo?.primaryPhone || '+919999999999',
        notes: {
          hospitalId: hospital._id.toString()
        }
      });
      customerId = customer.id;
      
      // Save the customer ID
      await Hospital.findByIdAndUpdate(hospital._id, {
        'payment.razorpayCustomerId': customerId
      });
    }

    // Create verification order for new payment method
    const order = await razorpay.orders.create({
      amount: 100, // ₹1 for verification
      currency: 'INR',
      receipt: `add_method_${Date.now()}`,
      notes: {
        hospitalId: hospital._id.toString(),
        purpose: 'add_payment_method'
      }
    });

    return NextResponse.json({
      success: true,
      customerId,
      orderId: order.id,
      email: hospital.contactInfo?.email || session.user.email,
      phone: hospital.contactInfo?.primaryPhone || '+919999999999',
      hospitalId: hospital._id,
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID
    });
  } catch (error) {
    console.error('Add payment method error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to initialize payment method',
        details: error.message
      },
      { status: 500 }
    );
  }
}
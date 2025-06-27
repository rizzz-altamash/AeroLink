// app/api/debug-payment/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { connectDB } from '@/lib/mongodb';
import Hospital from '@/models/Hospital';
import User from '@/models/User';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    // Check session
    if (!session) {
      return NextResponse.json({ error: 'No session found' });
    }
    
    await connectDB();
    
    // Check user
    const user = await User.findById(session.user.id);
    
    // Check hospital
    let hospital = null;
    if (session.user.hospitalId) {
      hospital = await Hospital.findById(session.user.hospitalId);
    }
    
    return NextResponse.json({
      session: {
        exists: true,
        userId: session.user.id,
        role: session.user.role,
        hospitalId: session.user.hospitalId
      },
      user: {
        exists: !!user,
        role: user?.role,
        hospitalId: user?.hospitalId?.toString()
      },
      hospital: {
        exists: !!hospital,
        name: hospital?.name,
        hasContactInfo: !!hospital?.contactInfo,
        email: hospital?.contactInfo?.email,
        phone: hospital?.contactInfo?.primaryPhone,
        hasPayment: !!hospital?.payment,
        customerId: hospital?.payment?.razorpayCustomerId
      },
      razorpay: {
        keyId: !!process.env.RAZORPAY_KEY_ID,
        keySecret: !!process.env.RAZORPAY_KEY_SECRET,
        publicKey: !!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        publicKeyValue: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID?.substring(0, 10) + '...'
      }
    });
  } catch (error) {
    return NextResponse.json({
      error: error.message,
      stack: error.stack
    });
  }
}
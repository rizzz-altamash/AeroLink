// app/api/diagnose-hospital/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { connectDB } from '@/lib/mongodb';
import Hospital from '@/models/Hospital';
import User from '@/models/User';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Not logged in' });
    }
    
    await connectDB();
    
    // Get user details
    const user = await User.findById(session.user.id);
    
    // Get hospital details if exists
    let hospital = null;
    let hospitalError = null;
    
    if (session.user.hospitalId) {
      try {
        hospital = await Hospital.findById(session.user.hospitalId);
      } catch (e) {
        hospitalError = e.message;
      }
    } else if (user?.hospitalId) {
      try {
        hospital = await Hospital.findById(user.hospitalId);
      } catch (e) {
        hospitalError = e.message;
      }
    }
    
    // Check Razorpay config
    const razorpayConfig = {
      hasKeyId: !!process.env.RAZORPAY_KEY_ID,
      hasKeySecret: !!process.env.RAZORPAY_KEY_SECRET,
      hasPublicKey: !!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      keyIdPreview: process.env.RAZORPAY_KEY_ID ? 
        process.env.RAZORPAY_KEY_ID.substring(0, 10) + '...' : 'NOT SET',
      publicKeyPreview: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ? 
        process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID.substring(0, 10) + '...' : 'NOT SET'
    };
    
    return NextResponse.json({
      diagnosis: {
        timestamp: new Date().toISOString(),
        
        session: {
          exists: true,
          userId: session.user.id,
          userEmail: session.user.email,
          userName: session.user.name,
          role: session.user.role,
          hospitalIdInSession: session.user.hospitalId || 'NOT SET'
        },
        
        user: {
          exists: !!user,
          id: user?._id?.toString(),
          email: user?.email,
          role: user?.role,
          hospitalIdInUser: user?.hospitalId?.toString() || 'NOT SET',
          isActive: user?.isActive,
          isEmailVerified: user?.isEmailVerified
        },
        
        hospital: {
          exists: !!hospital,
          id: hospital?._id?.toString(),
          name: hospital?.name,
          registrationNumber: hospital?.registrationNumber,
          verificationStatus: hospital?.verificationStatus,
          hasContactInfo: !!hospital?.contactInfo,
          contactInfo: hospital?.contactInfo || 'NOT SET',
          hasPaymentSetup: hospital?.payment?.isSetup || false,
          paymentDetails: hospital?.payment || 'NOT SET',
          error: hospitalError
        },
        
        razorpayConfig,
        
        issues: []
      }
    });
  } catch (error) {
    return NextResponse.json({
      error: 'Diagnostic failed',
      details: error.message,
      stack: error.stack
    });
  }
}

// Fix hospital association
export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }
    
    const { userId, hospitalId } = await req.json();
    
    await connectDB();
    
    // Update user with hospital ID
    const user = await User.findByIdAndUpdate(
      userId,
      { hospitalId: hospitalId },
      { new: true }
    );
    
    return NextResponse.json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        hospitalId: user.hospitalId
      }
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
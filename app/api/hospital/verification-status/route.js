// app/api/hospital/verification-status/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { connectDB } from '@/lib/mongodb';
import Hospital from '@/models/Hospital';
import User from '@/models/User';

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    // Get user with hospital info
    const user = await User.findById(session.user.id);
    
    if (!user) {
      return NextResponse.json({ 
        isVerified: false,
        error: 'User not found' 
      }, { status: 404 });
    }

    // Get hospital ID from session or user
    const hospitalId = session.user.hospitalId || user.hospitalId;
    
    if (!hospitalId) {
      return NextResponse.json({ 
        isVerified: false,
        error: 'No hospital associated with this user',
        needsSetup: true
      });
    }

    // Get hospital details
    const hospital = await Hospital.findById(hospitalId);
    
    if (!hospital) {
      return NextResponse.json({ 
        isVerified: false,
        error: 'Hospital not found',
        hospitalId: hospitalId
      });
    }

    // Check verification status
    // A hospital is considered verified if:
    // 1. verificationStatus is 'verified'
    // 2. Payment is setup
    const isVerified = hospital.verificationStatus === 'verified' && hospital.payment?.isSetup === true;

    return NextResponse.json({
      isVerified,
      verificationStatus: hospital.verificationStatus,
      paymentSetup: hospital.payment?.isSetup || false,
      hospitalName: hospital.name,
      hospitalId: hospital._id,
      message: !isVerified ? getVerificationMessage(hospital) : 'Hospital is verified and ready'
    });

  } catch (error) {
    console.error('Error checking hospital verification:', error);
    return NextResponse.json(
      { 
        isVerified: false,
        error: 'Failed to check verification status',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

// Helper function to provide specific messages
function getVerificationMessage(hospital) {
  if (hospital.verificationStatus !== 'verified') {
    if (!hospital.payment?.isSetup) {
      return 'Hospital needs to complete payment setup and verification';
    }
    return 'Hospital verification is pending approval';
  }
  
  if (!hospital.payment?.isSetup) {
    return 'Hospital needs to complete payment setup';
  }
  
  return 'Hospital verification pending';
}
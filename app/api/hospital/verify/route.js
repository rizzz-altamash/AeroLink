// app/api/hospital/verify/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { connectDB } from '@/lib/mongodb';
import Hospital from '@/models/Hospital';

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    
    // Allow hospital admin or system admin to verify
    if (!session || (session.user.role !== 'hospital_admin' && session.user.role !== 'admin')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    // Get hospital ID
    let hospitalId = session.user.hospitalId;
    
    // If admin is verifying, they can specify hospital ID
    if (session.user.role === 'admin') {
      const body = await req.json();
      if (body.hospitalId) {
        hospitalId = body.hospitalId;
      }
    }

    if (!hospitalId) {
      return NextResponse.json({ error: 'Hospital ID not found' }, { status: 400 });
    }

    // Update hospital verification status
    const hospital = await Hospital.findByIdAndUpdate(
      hospitalId,
      {
        'verificationStatus': 'verified',
        'verificationDocuments': [{
          type: 'payment_verification',
          uploadedAt: new Date(),
          verifiedAt: new Date()
        }]
      },
      { new: true }
    );

    if (!hospital) {
      return NextResponse.json({ error: 'Hospital not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Hospital verified successfully',
      hospital: {
        id: hospital._id,
        name: hospital.name,
        verificationStatus: hospital.verificationStatus,
        paymentSetup: hospital.payment?.isSetup || false
      }
    });

  } catch (error) {
    console.error('Error verifying hospital:', error);
    return NextResponse.json(
      { error: 'Failed to verify hospital' },
      { status: 500 }
    );
  }
}

// GET method to check current verification status
export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const hospitalId = session.user.hospitalId;
    if (!hospitalId) {
      return NextResponse.json({ error: 'No hospital associated' }, { status: 400 });
    }

    const hospital = await Hospital.findById(hospitalId);
    
    return NextResponse.json({
      hospital: {
        id: hospital._id,
        name: hospital.name,
        verificationStatus: hospital.verificationStatus,
        paymentSetup: hospital.payment?.isSetup || false,
        canCreateDeliveries: hospital.verificationStatus === 'verified' && hospital.payment?.isSetup
      }
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
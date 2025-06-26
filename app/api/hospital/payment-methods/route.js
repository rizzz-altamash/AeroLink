// app/api/hospital/payment-methods/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { connectDB } from '@/lib/mongodb';
import Hospital from '@/models/Hospital';

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'hospital_admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const hospital = await Hospital.findById(session.user.hospitalId)
      .select('payment.paymentMethods payment.isSetup verificationStatus name');

    if (!hospital) {
      return NextResponse.json({ error: 'Hospital not found' }, { status: 404 });
    }

    return NextResponse.json({
      paymentMethods: hospital.payment?.paymentMethods || [],
      hospitalInfo: {
        isSetup: hospital.payment?.isSetup || false,
        isVerified: hospital.verificationStatus === 'verified',
        hospitalName: hospital.name
      }
    });
  } catch (error) {
    console.error('Error fetching payment methods:', error);
    return NextResponse.json(
      { error: 'Failed to fetch payment methods' },
      { status: 500 }
    );
  }
}
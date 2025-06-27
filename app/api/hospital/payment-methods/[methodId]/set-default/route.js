// app/api/hospital/payment-methods/[methodId]/set-default/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { connectDB } from '@/lib/mongodb';
import Hospital from '@/models/Hospital';

export async function POST(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'hospital_admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { methodId } = await params;

    await connectDB();

    const hospital = await Hospital.findById(session.user.hospitalId);
    if (!hospital) {
      return NextResponse.json({ error: 'Hospital not found' }, { status: 404 });
    }

    // Find the payment method
    let methodFound = false;
    hospital.payment.paymentMethods.forEach(method => {
      if (method.id === methodId) {
        method.isDefault = true;
        methodFound = true;
      } else {
        method.isDefault = false;
      }
    });

    if (!methodFound) {
      return NextResponse.json({ error: 'Payment method not found' }, { status: 404 });
    }

    await hospital.save();

    return NextResponse.json({
      success: true,
      message: 'Default payment method updated successfully'
    });
  } catch (error) {
    console.error('Error setting default payment method:', error);
    return NextResponse.json(
      { error: 'Failed to set default payment method' },
      { status: 500 }
    );
  }
}
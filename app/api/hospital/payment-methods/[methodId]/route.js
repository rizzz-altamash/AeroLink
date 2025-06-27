// app/api/hospital/payment-methods/[methodId]/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { connectDB } from '@/lib/mongodb';
import Hospital from '@/models/Hospital';
import Notification from '@/models/Notification';
import User from '@/models/User';

export async function DELETE(req, { params }) {
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

    // Find the payment method to remove
    const methodIndex = hospital.payment.paymentMethods.findIndex(
      method => method.id === methodId
    );

    if (methodIndex === -1) {
      return NextResponse.json({ error: 'Payment method not found' }, { status: 404 });
    }

    // Remove the payment method
    hospital.payment.paymentMethods.splice(methodIndex, 1);

    // If no payment methods left, unverify hospital
    let hospitalUnverified = false;
    if (hospital.payment.paymentMethods.length === 0) {
      hospital.payment.isSetup = false;
      hospital.verificationStatus = 'unverified';
      hospital.billing.autoDeduct = false;
      hospitalUnverified = true;

      // Send notification to all hospital admins
      const admins = await User.find({
        hospitalId: hospital._id,
        role: 'hospital_admin',
        isActive: true
      });

      for (const admin of admins) {
        await Notification.create({
          userId: admin._id,
          type: 'urgent_alert',
          title: 'Hospital Unverified',
          message: 'All payment methods have been removed. Please add a payment method to verify your hospital and enable services.',
          priority: 'urgent',
          actionRequired: true,
          data: {
            action: 'setup_payment_method'
          }
        });
      }
    } else {
      // If removed method was default, set another as default
      const hasDefault = hospital.payment.paymentMethods.some(m => m.isDefault);
      if (!hasDefault && hospital.payment.paymentMethods.length > 0) {
        hospital.payment.paymentMethods[0].isDefault = true;
      }
    }

    await hospital.save();

    return NextResponse.json({
      success: true,
      hospitalUnverified,
      message: hospitalUnverified 
        ? 'Payment method removed. Hospital is now unverified.' 
        : 'Payment method removed successfully'
    });
  } catch (error) {
    console.error('Error removing payment method:', error);
    return NextResponse.json(
      { error: 'Failed to remove payment method' },
      { status: 500 }
    );
  }
}
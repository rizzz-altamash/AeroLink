// app/api/hospital/payment-status/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import Hospital from '@/models/Hospital';

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    
    // Get user with populated hospital
    const user = await User.findById(session.user.id).populate('hospitalId');
    
    if (!user || !user.hospitalId) {
      return NextResponse.json({
        isSetup: false,
        isVerified: false,
        message: 'No hospital associated with this user'
      });
    }

    const hospital = user.hospitalId;
    
    // Calculate pending payments
    const PaymentHistory = (await import('@/models/PaymentHistory')).default;
    const pendingPayments = await PaymentHistory.countDocuments({
      hospitalId: hospital._id,
      status: { $in: ['pending', 'processing'] }
    });
    
    return NextResponse.json({
      isSetup: hospital.payment?.isSetup || false,
      isVerified: hospital.verificationStatus === 'verified',
      paymentMethods: hospital.payment?.paymentMethods?.map(method => ({
        id: method.id,
        type: method.type,
        last4: method.last4,
        upiId: method.upiId,
        isDefault: method.isDefault,
        addedAt: method.addedAt
      })) || [],
      billing: {
        autoDeduct: hospital.billing?.autoDeduct ?? true,
        currency: hospital.billing?.currency || 'INR',
        totalSpent: hospital.billing?.totalSpent || 0,
        pendingAmount: hospital.billing?.pendingAmount || 0,
        pendingPayments
      },
      subscription: hospital.subscription || {
        plan: 'basic',
        isActive: true
      }
    });
  } catch (error) {
    console.error('Error fetching payment status:', error);
    return NextResponse.json(
      { error: 'Failed to fetch payment status' },
      { status: 500 }
    );
  }
}
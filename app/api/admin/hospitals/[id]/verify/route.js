// app/api/admin/hospitals/[id]/verify/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { connectDB } from '@/lib/mongodb';
import Hospital from '@/models/Hospital';
import User from '@/models/User';
import Notification from '@/models/Notification';

export async function POST(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const { status, notes } = await req.json();

    if (!['verified', 'suspended'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      );
    }

    await connectDB();

    // Update hospital verification status
    const hospital = await Hospital.findByIdAndUpdate(
      id,
      {
        verificationStatus: status,
        'subscription.isActive': status === 'verified'
      },
      { new: true }
    );

    if (!hospital) {
      return NextResponse.json(
        { error: 'Hospital not found' },
        { status: 404 }
      );
    }

    // Notify all hospital admins
    const hospitalAdmins = await User.find({
      hospitalId: hospital._id,
      role: 'hospital_admin',
      isActive: true
    });

    const notificationPromises = hospitalAdmins.map(admin =>
      Notification.create({
        userId: admin._id,
        type: status === 'verified' ? 'success' : 'warning',
        title: `Hospital ${status === 'verified' ? 'Verified' : 'Suspended'}`,
        message: status === 'verified' 
          ? `Your hospital ${hospital.name} has been verified. You can now start accepting deliveries.`
          : `Your hospital ${hospital.name} has been suspended. ${notes || 'Please contact support for more information.'}`,
        priority: 'high',
        data: {
          hospitalId: hospital._id,
          status,
          notes
        }
      })
    );

    await Promise.all(notificationPromises);

    // Log the action
    console.log(`Hospital ${hospital.name} ${status} by ${session.user.email}`);

    return NextResponse.json({
      success: true,
      hospital
    });
  } catch (error) {
    console.error('Error verifying hospital:', error);
    return NextResponse.json(
      { error: 'Failed to verify hospital' },
      { status: 500 }
    );
  }
}
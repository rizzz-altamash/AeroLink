// app/api/admin/stats/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { connectDB } from '@/lib/mongodb';
import Delivery from '@/models/Delivery';
import User from '@/models/User';
import Hospital from '@/models/Hospital';
import Drone from '@/models/Drone';

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    // Get overall stats
    const totalDeliveries = await Delivery.countDocuments();
    const activeDeliveries = await Delivery.countDocuments({
      status: { $in: ['pending', 'approved', 'assigned', 'pickup', 'in_transit'] }
    });
    
    const totalDrones = await Drone.countDocuments();
    const activeDrones = await Drone.countDocuments({ status: 'in_flight' });
    
    const totalHospitals = await Hospital.countDocuments();
    const verifiedHospitals = await Hospital.countDocuments({ verificationStatus: 'verified' });
    
    const totalUsers = await User.countDocuments();

    // Calculate revenue (simplified)
    const deliveries = await Delivery.find({ status: 'delivered' });
    const revenue = deliveries.reduce((sum, d) => sum + (d.pricing?.totalPrice || 0), 0);

    return NextResponse.json({
      totalDeliveries,
      activeDeliveries,
      totalDrones,
      activeDrones,
      totalHospitals,
      verifiedHospitals,
      totalUsers,
      revenue
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
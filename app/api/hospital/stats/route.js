// app/api/hospital/stats/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { connectDB } from '@/lib/mongodb';
import Delivery from '@/models/Delivery';
import User from '@/models/User';
import Hospital from '@/models/Hospital';

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'hospital_admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const hospitalId = session.user.hospitalId;
    if (!hospitalId) {
      return NextResponse.json({ error: 'No hospital associated with user' }, { status: 400 });
    }

    // Get today's start
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    // Get all deliveries for this hospital
    const hospitalDeliveries = await Delivery.find({
      $or: [
        { 'sender.hospitalId': hospitalId },
        { 'recipient.hospitalId': hospitalId }
      ]
    });

    // Calculate stats
    const totalDeliveries = hospitalDeliveries.length;
    const activeDeliveries = hospitalDeliveries.filter(d => 
      ['pending', 'approved', 'assigned', 'pickup', 'in_transit'].includes(d.status)
    ).length;
    
    const completedToday = hospitalDeliveries.filter(d => 
      d.status === 'delivered' && 
      d.delivery?.actualDeliveryTime && 
      new Date(d.delivery.actualDeliveryTime) >= todayStart
    ).length;

    // Calculate average delivery time
    const completedDeliveries = hospitalDeliveries.filter(d => 
      d.status === 'delivered' && d.delivery?.actualDeliveryTime
    );

    let averageDeliveryTime = 0;
    if (completedDeliveries.length > 0) {
      const totalTime = completedDeliveries.reduce((sum, d) => {
        const duration = new Date(d.delivery.actualDeliveryTime) - new Date(d.createdAt);
        return sum + duration;
      }, 0);
      averageDeliveryTime = Math.round(totalTime / completedDeliveries.length / 60000); // minutes
    }

    // Get staff count
    const totalStaff = await User.countDocuments({ 
      hospitalId,
      role: 'medical_staff'
    });
    
    const activeStaff = await User.countDocuments({ 
      hospitalId,
      role: 'medical_staff',
      isActive: true
    });

    // Count pending requests
    const pendingRequests = hospitalDeliveries.filter(d => 
      d.status === 'pending'
    ).length;

    // Calculate monthly bill (simplified)
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const monthlyDeliveries = hospitalDeliveries.filter(d => {
      const deliveryDate = new Date(d.createdAt);
      return deliveryDate.getMonth() === currentMonth && 
             deliveryDate.getFullYear() === currentYear;
    });

    const monthlyBill = monthlyDeliveries.reduce((sum, d) => 
      sum + (d.pricing?.totalPrice || 0), 0
    );

    return NextResponse.json({
      totalDeliveries,
      activeDeliveries,
      completedToday,
      averageDeliveryTime,
      totalStaff,
      activeStaff,
      pendingRequests,
      monthlyBill
    });
  } catch (error) {
    console.error('Error fetching hospital stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch hospital stats' },
      { status: 500 }
    );
  }
}
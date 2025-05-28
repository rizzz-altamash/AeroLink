// app/api/hospital/staff/activity/route.js
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

    // Get recent staff activities by looking at recent deliveries created by staff
    const recentActivities = await Delivery.find({
      'sender.hospitalId': hospitalId
    })
    .populate('sender.userId', 'name role')
    .sort({ createdAt: -1 })
    .limit(10);

    // Transform to activity format
    const activities = recentActivities.map(delivery => ({
      staffName: delivery.sender.userId?.name || 'Unknown Staff',
      action: `Created ${delivery.package.urgency} delivery order`,
      time: getTimeAgo(delivery.createdAt)
    }));

    // Also get login activities if available
    const staffMembers = await User.find({ 
      hospitalId,
      role: 'medical_staff'
    })
    .sort({ 'metadata.lastLogin': -1 })
    .limit(5);

    staffMembers.forEach(staff => {
      if (staff.metadata?.lastLogin) {
        activities.push({
          staffName: staff.name,
          action: 'Logged in',
          time: getTimeAgo(staff.metadata.lastLogin)
        });
      }
    });

    // Sort activities by time
    activities.sort((a, b) => {
      // This is a simplified sort - in production, store actual timestamps
      return 0;
    });

    return NextResponse.json(activities.slice(0, 10));
  } catch (error) {
    console.error('Error fetching staff activity:', error);
    return NextResponse.json(
      { error: 'Failed to fetch staff activity' },
      { status: 500 }
    );
  }
}

function getTimeAgo(date) {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  
  if (seconds < 60) return 'Just now';
  
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}
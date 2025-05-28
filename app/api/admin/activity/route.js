// app/api/admin/activity/route.js
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
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    // Get recent activities
    const recentDeliveries = await Delivery.find()
      .populate('sender.userId', 'name')
      .sort({ createdAt: -1 })
      .limit(5);

    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5);

    const activities = [];

    // Add delivery activities
    recentDeliveries.forEach(delivery => {
      activities.push({
        description: `New ${delivery.package.urgency} delivery created by ${delivery.sender.userId?.name || 'Unknown'}`,
        timestamp: getTimeAgo(delivery.createdAt)
      });
    });

    // Add user activities
    recentUsers.forEach(user => {
      activities.push({
        description: `New ${user.role} registered: ${user.name}`,
        timestamp: getTimeAgo(user.createdAt)
      });
    });

    // Sort by time and limit
    return NextResponse.json(activities.slice(0, 10));
  } catch (error) {
    console.error('Error fetching activity:', error);
    return NextResponse.json(
      { error: 'Failed to fetch activity' },
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
// app/api/hospital/staff/activity/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
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

    // Get all staff members of this hospital first
    const hospitalStaff = await User.find({
      hospitalId: hospitalId,
      role: 'medical_staff'
    }).select('_id name');

    const staffIds = hospitalStaff.map(staff => staff._id);

    // Get recent activities by looking at deliveries created by staff
    // Include both outgoing deliveries AND incoming orders
    const recentActivities = await Delivery.find({
      $or: [
        // Outgoing deliveries from this hospital
        { 'sender.hospitalId': hospitalId },
        // Incoming orders placed by staff from this hospital
        { 
          'metadata.orderingHospital': hospitalId,
          'metadata.deliveryType': 'incoming'
        },
        // Also check if orderedBy is from our staff
        { 'metadata.orderedBy': { $in: staffIds } }
      ]
    })
    .populate('sender.userId', 'name role')
    .populate('metadata.orderedBy', 'name role')
    .sort({ createdAt: -1 })
    .limit(15);

    // Transform to activity format
    const activities = recentActivities.map(delivery => {
      let staffName = 'Unknown Staff';
      let action = '';
      
      // Determine who created this delivery
      if (delivery.metadata?.deliveryType === 'incoming') {
        // For incoming orders, use orderedBy
        staffName = delivery.metadata.orderedBy?.name || 'Unknown Staff';
        action = `Placed incoming ${delivery.package.urgency} order for ${delivery.package.type}`;
      } else {
        // For outgoing deliveries, use sender
        staffName = delivery.sender.userId?.name || 'Unknown Staff';
        action = `Created outgoing ${delivery.package.urgency} delivery for ${delivery.package.type}`;
      }

      return {
        staffName,
        action,
        time: getTimeAgo(delivery.createdAt),
        type: delivery.metadata?.deliveryType || 'outgoing',
        urgency: delivery.package.urgency,
        orderId: delivery.orderId,
        timestamp: delivery.createdAt
      };
    });

    // Also get login activities if available
    const staffMembers = await User.find({ 
      hospitalId,
      role: 'medical_staff',
      'metadata.lastLogin': { $exists: true }
    })
    .sort({ 'metadata.lastLogin': -1 })
    .limit(5);

    staffMembers.forEach(staff => {
      if (staff.metadata?.lastLogin) {
        activities.push({
          staffName: staff.name,
          action: 'Logged in',
          time: getTimeAgo(staff.metadata.lastLogin),
          type: 'login',
          timestamp: staff.metadata.lastLogin
        });
      }
    });

    // Sort activities by timestamp
    activities.sort((a, b) => {
      const timeA = new Date(a.timestamp || 0);
      const timeB = new Date(b.timestamp || 0);
      return timeB - timeA;
    });

    // Return top 10 activities
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
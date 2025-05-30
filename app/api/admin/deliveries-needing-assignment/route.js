// app/api/admin/deliveries-needing-assignment/route.js
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

    // Get approved deliveries without pilot assignment
    const needingAssignment = await Delivery.find({
      status: 'approved',
      pilotId: { $exists: false }
    })
    .populate('sender.userId', 'name')
    .populate('sender.hospitalId', 'name')
    .populate('recipient.hospitalId', 'name')
    .populate('metadata.approvedBy', 'name')
    .sort({ 'package.urgency': -1, createdAt: -1 });

    // Include auto-approved flag and time since approval
    const enrichedDeliveries = needingAssignment.map(delivery => {
      const timeSinceApproval = new Date() - new Date(delivery.metadata.approvalTime || delivery.createdAt);
      const minutesSinceApproval = Math.floor(timeSinceApproval / (1000 * 60));
      
      return {
        ...delivery.toObject(),
        timeSinceApproval: minutesSinceApproval < 60 
          ? `${minutesSinceApproval} minutes`
          : `${Math.floor(minutesSinceApproval / 60)} hours`,
        isAutoApproved: delivery.metadata.autoApproved || false,
        approverName: delivery.metadata.approvedBy?.name || (delivery.metadata.autoApproved ? 'System (Auto)' : 'Unknown')
      };
    });

    // Get stats
    const stats = {
      total: enrichedDeliveries.length,
      emergency: enrichedDeliveries.filter(d => d.package?.urgency === 'emergency').length,
      urgent: enrichedDeliveries.filter(d => d.package?.urgency === 'urgent').length,
      routine: enrichedDeliveries.filter(d => d.package?.urgency === 'routine').length,
      autoApproved: enrichedDeliveries.filter(d => d.isAutoApproved).length
    };

    return NextResponse.json({
      stats,
      deliveries: enrichedDeliveries
    });
  } catch (error) {
    console.error('Error fetching deliveries needing assignment:', error);
    return NextResponse.json(
      { error: 'Failed to fetch deliveries' },
      { status: 500 }
    );
  }
}
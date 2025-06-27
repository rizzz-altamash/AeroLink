// app/api/admin/deliveries-needing-assignment/route.js
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
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get query parameters
    const { searchParams } = new URL(req.url);
    const urgencyFilter = searchParams.get('urgency');
    const hospitalFilter = searchParams.get('hospital');

    await connectDB();

    // Build query for approved deliveries without pilot
    const query = {
      status: 'approved',
      pilotId: { $exists: false }
    };

    // Apply urgency filter
    if (urgencyFilter && urgencyFilter !== 'all') {
      query['package.urgency'] = urgencyFilter;
    }

    // Apply hospital filter
    if (hospitalFilter && hospitalFilter !== 'all') {
      query.$or = [
        { 'sender.hospitalId': hospitalFilter },
        { 'recipient.hospitalId': hospitalFilter },
        { 'metadata.orderingHospital': hospitalFilter }
      ];
    }

    // Get deliveries with applied filters
    const needingAssignment = await Delivery.find(query)
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

    // Get stats based on filtered results
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
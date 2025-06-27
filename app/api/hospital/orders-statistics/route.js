// app/api/hospital/orders-statistics/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { connectDB } from '@/lib/mongodb';
import Delivery from '@/models/Delivery';

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

    // Get all deliveries for this hospital
    const allDeliveries = await Delivery.find({
      $or: [
        { 'sender.hospitalId': hospitalId },
        { 'recipient.hospitalId': hospitalId },
        { 'metadata.orderingHospital': hospitalId }
      ]
    });

    // Calculate statistics
    const stats = {
      // Delivery Direction
      direction: {
        outgoing: 0,
        incoming: 0
      },
      // Status Statistics
      status: {
        approved: 0,
        rejected: 0,
        delivered: 0,
        failed: 0,
        pending: 0,
        in_transit: 0,
        cancelled: 0
      },
      // Urgency Statistics
      urgency: {
        routine: 0,
        urgent: 0,
        emergency: 0
      },
      // Additional Stats
      total: allDeliveries.length,
      pendingApproval: 0,
      activeDeliveries: 0
    };

    // Process each delivery
    allDeliveries.forEach(delivery => {
      // Direction stats
      if (delivery.metadata?.deliveryType === 'incoming') {
        stats.direction.incoming++;
      } else {
        stats.direction.outgoing++;
      }

      // Status stats
      switch (delivery.status) {
        case 'approved':
          stats.status.approved++;
          break;
        case 'rejected':
          stats.status.rejected++;
          break;
        case 'delivered':
          stats.status.delivered++;
          break;
        case 'failed':
          stats.status.failed++;
          break;
        case 'pending':
        case 'pending_approval':
          stats.status.pending++;
          if (delivery.status === 'pending_approval') {
            stats.pendingApproval++;
          }
          break;
        case 'in_transit':
        case 'assigned':
        case 'pickup':
          stats.status.in_transit++;
          stats.activeDeliveries++;
          break;
        case 'cancelled':
          stats.status.cancelled++;
          break;
      }

      // Urgency stats
      const urgency = delivery.package?.urgency || 'routine';
      stats.urgency[urgency]++;
    });

    // Calculate percentages
    if (stats.total > 0) {
      stats.successRate = Math.round((stats.status.delivered / stats.total) * 100);
      stats.failureRate = Math.round((stats.status.failed / stats.total) * 100);
    } else {
      stats.successRate = 0;
      stats.failureRate = 0;
    }

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching order statistics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch order statistics' },
      { status: 500 }
    );
  }
}
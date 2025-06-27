// app/api/admin/delivery-analytics/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { connectDB } from '@/lib/mongodb';
import Delivery from '@/models/Delivery';
import Hospital from '@/models/Hospital';

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const timeRange = searchParams.get('timeRange') || 'week';

    await connectDB();

    // Calculate date ranges
    const now = new Date();
    const startDate = new Date();
    
    switch (timeRange) {
      case 'today':
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
    }

    // Get only approved deliveries (includes all statuses after approval)
    const deliveries = await Delivery.find({
      status: { $in: ['approved', 'assigned', 'pickup', 'in_transit', 'pending_confirmation', 'delivered'] },
      $or: [
        { 'metadata.approvalTime': { $gte: startDate } },
        { createdAt: { $gte: startDate } }
      ]
    })
    .populate('sender.hospitalId', 'name')
    .populate('recipient.hospitalId', 'name')
    .populate('metadata.approvedBy', 'name');

    // Calculate metrics
    const totalDeliveries = deliveries.length;
    const incomingDeliveries = deliveries.filter(d => d.metadata?.deliveryType === 'incoming');
    const outgoingDeliveries = deliveries.filter(d => d.metadata?.deliveryType !== 'incoming');
    
    // Today's approved deliveries
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayDeliveries = deliveries.filter(d => {
      const approvalTime = d.metadata?.approvalTime || d.createdAt;
      return new Date(approvalTime) >= todayStart;
    });

    // Average per day
    const daysDiff = Math.max(1, Math.ceil((now - startDate) / (1000 * 60 * 60 * 24)));
    const avgPerDay = totalDeliveries / daysDiff;

    // Prepare chart data
    const chartData = await prepareChartData(deliveries, timeRange, startDate);

    // Delivery type breakdown
    const deliveryTypeBreakdown = [
      {
        name: 'Incoming',
        type: 'incoming',
        value: incomingDeliveries.length,
        percentage: ((incomingDeliveries.length / totalDeliveries) * 100 || 0).toFixed(1)
      },
      {
        name: 'Outgoing',
        type: 'outgoing',
        value: outgoingDeliveries.length,
        percentage: ((outgoingDeliveries.length / totalDeliveries) * 100 || 0).toFixed(1)
      }
    ];

    // Urgency breakdown
    const urgencyBreakdown = [
      {
        name: 'Emergency',
        type: 'emergency',
        value: deliveries.filter(d => d.package?.urgency === 'emergency').length,
        percentage: ((deliveries.filter(d => d.package?.urgency === 'emergency').length / totalDeliveries) * 100 || 0).toFixed(1)
      },
      {
        name: 'Urgent',
        type: 'urgent',
        value: deliveries.filter(d => d.package?.urgency === 'urgent').length,
        percentage: ((deliveries.filter(d => d.package?.urgency === 'urgent').length / totalDeliveries) * 100 || 0).toFixed(1)
      },
      {
        name: 'Routine',
        type: 'routine',
        value: deliveries.filter(d => d.package?.urgency === 'routine').length,
        percentage: ((deliveries.filter(d => d.package?.urgency === 'routine').length / totalDeliveries) * 100 || 0).toFixed(1)
      }
    ];

    // Package type breakdown
    const packageTypes = {};
    deliveries.forEach(d => {
      const type = d.package?.type || 'other';
      packageTypes[type] = (packageTypes[type] || 0) + 1;
    });

    const packageTypeBreakdown = Object.entries(packageTypes).map(([type, count]) => ({
      name: type.charAt(0).toUpperCase() + type.slice(1).replace('_', ' '),
      type,
      value: count,
      percentage: ((count / totalDeliveries) * 100 || 0).toFixed(1)
    })).sort((a, b) => b.value - a.value);

    // Peak hours analysis (based on approval time)
    const peakHours = calculatePeakHours(deliveries);

    // Time distribution
    const timeDistribution = calculateTimeDistribution(deliveries);

    // Additional admin-specific metrics
    const autoApprovedCount = deliveries.filter(d => d.metadata?.autoApproved).length;
    const manualApprovedCount = totalDeliveries - autoApprovedCount;

    return NextResponse.json({
      chartData,
      metrics: {
        total: totalDeliveries,
        incoming: incomingDeliveries.length,
        outgoing: outgoingDeliveries.length,
        todayDeliveries: todayDeliveries.length,
        avgPerDay,
        autoApproved: autoApprovedCount,
        manualApproved: manualApprovedCount
      },
      deliveryTypeBreakdown,
      urgencyBreakdown,
      packageTypeBreakdown,
      peakHours,
      timeDistribution
    });
  } catch (error) {
    console.error('Error fetching admin delivery analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch delivery analytics' },
      { status: 500 }
    );
  }
}

// Helper function to prepare chart data
async function prepareChartData(deliveries, timeRange, startDate) {
  const chartData = [];
  const now = new Date();
  
  if (timeRange === 'today') {
    // Hourly data for today
    for (let hour = 0; hour < 24; hour++) {
      const hourStart = new Date(startDate);
      hourStart.setHours(hour, 0, 0, 0);
      const hourEnd = new Date(startDate);
      hourEnd.setHours(hour + 1, 0, 0, 0);
      
      const hourDeliveries = deliveries.filter(d => {
        const approvalTime = new Date(d.metadata?.approvalTime || d.createdAt);
        return approvalTime >= hourStart && approvalTime < hourEnd;
      });
      
      chartData.push({
        date: `${hour}:00`,
        total: hourDeliveries.length,
        emergency: hourDeliveries.filter(d => d.package?.urgency === 'emergency').length,
        urgent: hourDeliveries.filter(d => d.package?.urgency === 'urgent').length,
        routine: hourDeliveries.filter(d => d.package?.urgency === 'routine').length,
        incoming: hourDeliveries.filter(d => d.metadata?.deliveryType === 'incoming').length,
        outgoing: hourDeliveries.filter(d => d.metadata?.deliveryType !== 'incoming').length
      });
    }
  } else {
    // Daily data for other time ranges
    const days = timeRange === 'week' ? 7 : 30;
    
    for (let i = 0; i < days; i++) {
      const dayStart = new Date(now);
      dayStart.setDate(now.getDate() - (days - i - 1));
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(dayStart);
      dayEnd.setDate(dayEnd.getDate() + 1);
      
      const dayDeliveries = deliveries.filter(d => {
        const approvalTime = new Date(d.metadata?.approvalTime || d.createdAt);
        return approvalTime >= dayStart && approvalTime < dayEnd;
      });
      
      chartData.push({
        date: dayStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        total: dayDeliveries.length,
        emergency: dayDeliveries.filter(d => d.package?.urgency === 'emergency').length,
        urgent: dayDeliveries.filter(d => d.package?.urgency === 'urgent').length,
        routine: dayDeliveries.filter(d => d.package?.urgency === 'routine').length,
        incoming: dayDeliveries.filter(d => d.metadata?.deliveryType === 'incoming').length,
        outgoing: dayDeliveries.filter(d => d.metadata?.deliveryType !== 'incoming').length
      });
    }
  }
  
  return chartData;
}

// Helper function to calculate peak hours based on approval time
function calculatePeakHours(deliveries) {
  const hourMap = new Map();
  
  deliveries.forEach(delivery => {
    const approvalTime = delivery.metadata?.approvalTime || delivery.createdAt;
    const hour = new Date(approvalTime).getHours();
    const current = hourMap.get(hour) || { hour, count: 0 };
    current.count += 1;
    hourMap.set(hour, current);
  });
  
  return Array.from(hourMap.values())
    .sort((a, b) => b.count - a.count);
}

// Helper function to calculate time distribution
function calculateTimeDistribution(deliveries) {
  const periods = {
    morning: { start: 6, end: 12, count: 0, label: 'Morning (6AM-12PM)' },
    afternoon: { start: 12, end: 18, count: 0, label: 'Afternoon (12PM-6PM)' },
    evening: { start: 18, end: 24, count: 0, label: 'Evening (6PM-12AM)' },
    night: { start: 0, end: 6, count: 0, label: 'Night (12AM-6AM)' }
  };

  deliveries.forEach(delivery => {
    const approvalTime = delivery.metadata?.approvalTime || delivery.createdAt;
    const hour = new Date(approvalTime).getHours();
    
    if (hour >= periods.morning.start && hour < periods.morning.end) {
      periods.morning.count++;
    } else if (hour >= periods.afternoon.start && hour < periods.afternoon.end) {
      periods.afternoon.count++;
    } else if (hour >= periods.evening.start && hour < periods.evening.end) {
      periods.evening.count++;
    } else {
      periods.night.count++;
    }
  });

  const total = deliveries.length || 1;
  const now = new Date().getHours();

  return Object.entries(periods).map(([key, period]) => ({
    period: period.label,
    percentage: ((period.count / total) * 100).toFixed(1),
    count: period.count,
    isActive: (now >= period.start && now < period.end) || 
              (key === 'evening' && now >= 18) ||
              (key === 'night' && now < 6)
  }));
}
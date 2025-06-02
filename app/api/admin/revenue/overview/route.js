// app/api/admin/revenue/overview/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
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
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
    }

    // Get all delivered/completed deliveries
    const deliveries = await Delivery.find({
      status: 'delivered',
      'delivery.actualDeliveryTime': { $gte: startDate }
    }).populate('sender.hospitalId recipient.hospitalId');

    // Calculate metrics
    const totalRevenue = deliveries.reduce((sum, d) => sum + (d.pricing?.totalPrice || 0), 0);
    const averageRevenue = deliveries.length > 0 ? totalRevenue / deliveries.length : 0;

    // Calculate growth (compare with previous period)
    const prevStartDate = new Date(startDate);
    const prevEndDate = new Date(startDate);
    
    switch (timeRange) {
      case 'today':
        prevStartDate.setDate(prevStartDate.getDate() - 1);
        prevEndDate.setHours(0, 0, 0, 0);
        break;
      case 'week':
        prevStartDate.setDate(prevStartDate.getDate() - 7);
        break;
      case 'month':
        prevStartDate.setMonth(prevStartDate.getMonth() - 1);
        break;
      case 'year':
        prevStartDate.setFullYear(prevStartDate.getFullYear() - 1);
        break;
    }

    const prevDeliveries = await Delivery.find({
      status: 'delivered',
      'delivery.actualDeliveryTime': { $gte: prevStartDate, $lt: prevEndDate }
    });

    const prevRevenue = prevDeliveries.reduce((sum, d) => sum + (d.pricing?.totalPrice || 0), 0);
    const growth = prevRevenue > 0 ? ((totalRevenue - prevRevenue) / prevRevenue) * 100 : 0;

    // Today's revenue
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayDeliveries = await Delivery.find({
      status: 'delivered',
      'delivery.actualDeliveryTime': { $gte: todayStart }
    });
    const todayRevenue = todayDeliveries.reduce((sum, d) => sum + (d.pricing?.totalPrice || 0), 0);

    // This week's revenue
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - 7);
    const weekDeliveries = await Delivery.find({
      status: 'delivered',
      'delivery.actualDeliveryTime': { $gte: weekStart }
    });
    const weekRevenue = weekDeliveries.reduce((sum, d) => sum + (d.pricing?.totalPrice || 0), 0);

    // This month's revenue
    const monthStart = new Date();
    monthStart.setMonth(monthStart.getMonth() - 1);
    const monthDeliveries = await Delivery.find({
      status: 'delivered',
      'delivery.actualDeliveryTime': { $gte: monthStart }
    });
    const monthRevenue = monthDeliveries.reduce((sum, d) => sum + (d.pricing?.totalPrice || 0), 0);

    // Prepare chart data based on time range
    const chartData = await prepareChartData(deliveries, timeRange, startDate);

    // Urgency breakdown
    const urgencyBreakdown = [
      {
        name: 'Emergency',
        value: deliveries.filter(d => d.package?.urgency === 'emergency')
          .reduce((sum, d) => sum + (d.pricing?.totalPrice || 0), 0),
        color: '#ef4444'
      },
      {
        name: 'Urgent',
        value: deliveries.filter(d => d.package?.urgency === 'urgent')
          .reduce((sum, d) => sum + (d.pricing?.totalPrice || 0), 0),
        color: '#f97316'
      },
      {
        name: 'Routine',
        value: deliveries.filter(d => d.package?.urgency === 'routine')
          .reduce((sum, d) => sum + (d.pricing?.totalPrice || 0), 0),
        color: '#6b7280'
      }
    ];

    // Hospital revenue (top 10)
    const hospitalRevenue = await calculateHospitalRevenue(deliveries);

    // Delivery type split
    const deliveryTypeSplit = {
      outgoing: deliveries.filter(d => d.metadata?.deliveryType !== 'incoming')
        .reduce((sum, d) => sum + (d.pricing?.totalPrice || 0), 0),
      incoming: deliveries.filter(d => d.metadata?.deliveryType === 'incoming')
        .reduce((sum, d) => sum + (d.pricing?.totalPrice || 0), 0)
    };

    // Peak hours analysis
    const peakHours = calculatePeakHours(deliveries);

    // Distance-based revenue
    const distanceRevenue = calculateDistanceRevenue(deliveries);

    // Simple forecast (based on trend)
    const forecast = calculateForecast(chartData, timeRange);

    return NextResponse.json({
      chartData,
      metrics: {
        total: totalRevenue,
        average: averageRevenue,
        growth,
        todayRevenue,
        weekRevenue,
        monthRevenue
      },
      urgencyBreakdown,
      hospitalRevenue,
      deliveryTypeSplit,
      peakHours,
      distanceRevenue,
      forecast
    });
  } catch (error) {
    console.error('Error fetching revenue data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch revenue data' },
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
        const deliveryTime = new Date(d.delivery.actualDeliveryTime);
        return deliveryTime >= hourStart && deliveryTime < hourEnd;
      });
      
      chartData.push({
        date: `${hour}:00`,
        revenue: hourDeliveries.reduce((sum, d) => sum + (d.pricing?.totalPrice || 0), 0),
        emergency: hourDeliveries.filter(d => d.package?.urgency === 'emergency')
          .reduce((sum, d) => sum + (d.pricing?.totalPrice || 0), 0),
        urgent: hourDeliveries.filter(d => d.package?.urgency === 'urgent')
          .reduce((sum, d) => sum + (d.pricing?.totalPrice || 0), 0),
        routine: hourDeliveries.filter(d => d.package?.urgency === 'routine')
          .reduce((sum, d) => sum + (d.pricing?.totalPrice || 0), 0),
        cumulative: 0
      });
    }
  } else {
    // Daily data for other time ranges
    const days = timeRange === 'week' ? 7 : timeRange === 'month' ? 30 : 365;
    
    for (let i = 0; i < days; i++) {
      const dayStart = new Date(now);
      dayStart.setDate(now.getDate() - (days - i - 1));
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(dayStart);
      dayEnd.setDate(dayEnd.getDate() + 1);
      
      const dayDeliveries = deliveries.filter(d => {
        const deliveryTime = new Date(d.delivery.actualDeliveryTime);
        return deliveryTime >= dayStart && deliveryTime < dayEnd;
      });
      
      chartData.push({
        date: dayStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        revenue: dayDeliveries.reduce((sum, d) => sum + (d.pricing?.totalPrice || 0), 0),
        emergency: dayDeliveries.filter(d => d.package?.urgency === 'emergency')
          .reduce((sum, d) => sum + (d.pricing?.totalPrice || 0), 0),
        urgent: dayDeliveries.filter(d => d.package?.urgency === 'urgent')
          .reduce((sum, d) => sum + (d.pricing?.totalPrice || 0), 0),
        routine: dayDeliveries.filter(d => d.package?.urgency === 'routine')
          .reduce((sum, d) => sum + (d.pricing?.totalPrice || 0), 0),
        cumulative: 0
      });
    }
  }
  
  // Calculate cumulative revenue
  let cumulative = 0;
  chartData.forEach(data => {
    cumulative += data.revenue;
    data.cumulative = cumulative;
  });
  
  return chartData;
}

// Helper function to calculate hospital revenue
async function calculateHospitalRevenue(deliveries) {
  const hospitalMap = new Map();
  
  deliveries.forEach(delivery => {
    const hospitalId = delivery.sender.hospitalId?._id?.toString() || 
                      delivery.recipient.hospitalId?._id?.toString();
    const hospitalName = delivery.sender.hospitalId?.name || 
                        delivery.recipient.hospitalId?.name || 
                        'Unknown Hospital';
    
    if (hospitalId) {
      const current = hospitalMap.get(hospitalId) || { name: hospitalName, revenue: 0 };
      current.revenue += delivery.pricing?.totalPrice || 0;
      hospitalMap.set(hospitalId, current);
    }
  });
  
  return Array.from(hospitalMap.values())
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 10);
}

// Helper function to calculate peak hours
function calculatePeakHours(deliveries) {
  const hourMap = new Map();
  
  deliveries.forEach(delivery => {
    const hour = new Date(delivery.delivery.actualDeliveryTime).getHours();
    const current = hourMap.get(hour) || { hour, revenue: 0, count: 0 };
    current.revenue += delivery.pricing?.totalPrice || 0;
    current.count += 1;
    hourMap.set(hour, current);
  });
  
  return Array.from(hourMap.values())
    .sort((a, b) => b.revenue - a.revenue);
}

// Helper function to calculate distance-based revenue
function calculateDistanceRevenue(deliveries) {
  const ranges = [
    { range: '0-5km', min: 0, max: 5000, revenue: 0 },
    { range: '5-10km', min: 5000, max: 10000, revenue: 0 },
    { range: '10-20km', min: 10000, max: 20000, revenue: 0 },
    { range: '20km+', min: 20000, max: Infinity, revenue: 0 }
  ];
  
  deliveries.forEach(delivery => {
    const distance = delivery.flightPath?.estimatedDistance || 0;
    const range = ranges.find(r => distance >= r.min && distance < r.max);
    if (range) {
      range.revenue += delivery.pricing?.totalPrice || 0;
    }
  });
  
  return ranges;
}

// Helper function to calculate forecast
function calculateForecast(chartData, timeRange) {
  if (chartData.length < 3) return { nextPeriod: 0 };
  
  // Simple moving average forecast
  const recentData = chartData.slice(-3);
  const avgRevenue = recentData.reduce((sum, d) => sum + d.revenue, 0) / recentData.length;
  
  // Calculate trend
  const trend = (recentData[2].revenue - recentData[0].revenue) / 2;
  
  const nextPeriod = avgRevenue + trend;
  
  return {
    nextPeriod: Math.max(0, nextPeriod),
    confidence: 75 // Simple confidence metric
  };
}
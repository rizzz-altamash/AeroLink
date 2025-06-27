// app/api/hospital/delivery-analytics/export/route.js
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

    const { searchParams } = new URL(req.url);
    const format = searchParams.get('format') || 'csv';
    const timeRange = searchParams.get('timeRange') || 'week';

    await connectDB();

    // Calculate date range
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

    // Get deliveries
    const deliveries = await Delivery.find({
      'sender.hospitalId': session.user.hospitalId,
      createdAt: { $gte: startDate }
    }).populate('sender.userId', 'name');

    if (format === 'csv') {
      // Generate CSV
      const csvHeaders = [
        'Order ID',
        'Created At',
        'Delivery Type',
        'Package Type',
        'Urgency',
        'Weight (g)',
        'Status',
        'Created By',
        'Recipient'
      ];

      const csvRows = deliveries.map(d => [
        d.orderId,
        new Date(d.createdAt).toISOString(),
        d.metadata?.deliveryType === 'incoming' ? 'Incoming' : 'Outgoing',
        d.package?.type || 'N/A',
        d.package?.urgency || 'routine',
        d.package?.weight || 0,
        d.status,
        d.sender?.userId?.name || 'Unknown',
        d.recipient?.name || 'Unknown'
      ]);

      const csvContent = [
        csvHeaders.join(','),
        ...csvRows.map(row => row.map(cell => `"${cell}"`).join(','))
      ].join('\n');

      return new NextResponse(csvContent, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="delivery-analytics-${timeRange}-${new Date().toISOString().split('T')[0]}.csv"`
        }
      });
    } else if (format === 'pdf') {
      // For PDF generation, you would typically use a library like puppeteer or pdfkit
      // This is a placeholder response
      return NextResponse.json(
        { error: 'PDF export not implemented yet' },
        { status: 501 }
      );
    }

    return NextResponse.json({ error: 'Invalid format' }, { status: 400 });
  } catch (error) {
    console.error('Error exporting analytics:', error);
    return NextResponse.json(
      { error: 'Failed to export analytics' },
      { status: 500 }
    );
  }
}
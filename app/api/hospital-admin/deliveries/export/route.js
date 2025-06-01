// app/api/hospital-admin/deliveries/export/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { connectDB } from '@/lib/mongodb';
import Delivery from '@/models/Delivery';

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'hospital_admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const filters = await req.json();
    await connectDB();

    // Build query
    const query = {
      $or: [
        { 'sender.hospitalId': session.user.hospitalId },
        { 'recipient.hospitalId': session.user.hospitalId },
        { 'metadata.orderingHospital': session.user.hospitalId }
      ]
    };

    if (filters.status && filters.status !== 'all') {
      query.status = filters.status;
    }

    if (filters.type && filters.type !== 'all') {
      query['package.type'] = filters.type;
    }

    if (filters.urgency && filters.urgency !== 'all') {
      query['package.urgency'] = filters.urgency;
    }

    const deliveries = await Delivery.find(query)
      .populate('sender.userId', 'name')
      .populate('metadata.orderedBy', 'name')
      .sort({ createdAt: -1 });

    // Create CSV
    const headers = ['Order ID', 'Date', 'Type', 'Direction', 'Urgency', 'Requested By', 'Status', 'Cost'];
    const rows = deliveries.map(d => [
      d.orderId,
      new Date(d.createdAt).toISOString().split('T')[0],
      d.package?.type || 'N/A',
      d.metadata?.deliveryType === 'incoming' ? 'Incoming' : 'Outgoing',
      d.package?.urgency || 'N/A',
      d.metadata?.orderedBy?.name || d.sender.userId?.name || 'N/A',
      d.status,
      d.pricing?.totalPrice?.toFixed(2) || 'N/A'
    ]);

    const csv = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="hospital-deliveries-${new Date().toISOString().split('T')[0]}.csv"`
      }
    });
  } catch (error) {
    console.error('Error exporting deliveries:', error);
    return NextResponse.json(
      { error: 'Failed to export deliveries' },
      { status: 500 }
    );
  }
}
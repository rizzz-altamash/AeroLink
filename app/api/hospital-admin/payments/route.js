// app/api/hospital-admin/payments/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { connectDB } from '@/lib/mongodb';
import PaymentHistory from '@/models/PaymentHistory';

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'hospital_admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') || 'all';
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 20;
    const skip = (page - 1) * limit;

    await connectDB();

    // Build query
    const query = { hospitalId: session.user.hospitalId };
    
    if (status === 'pending') {
      query.status = { $in: ['pending', 'processing'] };
    } else if (status === 'completed') {
      query.status = 'completed';
    } else if (status === 'failed') {
      query.status = 'failed';
    }

    // Get payments with pagination
    const [payments, total] = await Promise.all([
      PaymentHistory.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('deliveryId', 'orderId package recipient')
        .populate('staffDetails.id', 'name email')
        .lean(),
      PaymentHistory.countDocuments(query)
    ]);

    return NextResponse.json({
      payments,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching payments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch payments' },
      { status: 500 }
    );
  }
}
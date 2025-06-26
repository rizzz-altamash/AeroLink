// app/api/hospital-admin/payment-history/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { connectDB } from '@/lib/mongodb';
import PaymentHistory from '@/models/PaymentHistory';

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'hospital_admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');
    const status = searchParams.get('status');
    const urgency = searchParams.get('urgency');
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 50;
    const skip = (page - 1) * limit;

    await connectDB();

    // Build query
    const query = { hospitalId: session.user.hospitalId };
    
    // Date filter
    if (dateFrom || dateTo) {
      query.createdAt = {};
      if (dateFrom) query.createdAt.$gte = new Date(dateFrom);
      if (dateTo) {
        const endDate = new Date(dateTo);
        endDate.setHours(23, 59, 59, 999);
        query.createdAt.$lte = endDate;
      }
    }
    
    // Status filter
    if (status && status !== 'all') {
      query.status = status;
    }
    
    // Urgency filter
    if (urgency && urgency !== 'all') {
      query['deliveryDetails.urgency'] = urgency;
    }

    // Get payment history
    const [payments, total] = await Promise.all([
      PaymentHistory.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      PaymentHistory.countDocuments(query)
    ]);

    // Calculate summary stats
    const summary = await PaymentHistory.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          totalAmount: { 
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, '$amount', 0] } 
          },
          totalCount: { $sum: 1 },
          completedCount: { 
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } 
          },
          pendingAmount: { 
            $sum: { 
              $cond: [{ $in: ['$status', ['pending', 'processing']] }, '$amount', 0] 
            } 
          }
        }
      }
    ]);

    return NextResponse.json({
      payments,
      summary: summary[0] || {
        totalAmount: 0,
        totalCount: 0,
        completedCount: 0,
        pendingAmount: 0
      },
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching payment history:', error);
    return NextResponse.json(
      { error: 'Failed to fetch payment history' },
      { status: 500 }
    );
  }
}
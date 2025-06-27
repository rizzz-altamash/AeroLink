// app/api/hospital-admin/payment-stats/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { connectDB } from '@/lib/mongodb';
import PaymentHistory from '@/models/PaymentHistory';
import mongoose from 'mongoose';

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'hospital_admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    
    const hospitalId = session.user.hospitalId;
    
    // Get current date info for date-based queries
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    
    // Aggregate payment statistics
    const [
      overallStats,
      monthlyStats,
      todayStats,
      paymentMethodStats
    ] = await Promise.all([
      // Overall statistics
      PaymentHistory.aggregate([
        { $match: { hospitalId: new mongoose.Types.ObjectId(hospitalId) } },
        {
          $group: {
            _id: null,
            totalSpent: { 
              $sum: { $cond: [{ $eq: ['$status', 'completed'] }, '$amount', 0] } 
            },
            completedDeliveries: { 
              $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } 
            },
            pendingAmount: { 
              $sum: { 
                $cond: [{ $in: ['$status', ['pending', 'processing']] }, '$amount', 0] 
              } 
            },
            pendingCount: {
              $sum: { 
                $cond: [{ $in: ['$status', ['pending', 'processing']] }, 1, 0] 
              }
            },
            failedCount: {
              $sum: { $cond: [{ $eq: ['$status', 'failed'] }, 1, 0] }
            },
            totalTransactions: { $sum: 1 }
          }
        }
      ]),
      
      // Monthly comparison
      PaymentHistory.aggregate([
        { 
          $match: { 
            hospitalId: new mongoose.Types.ObjectId(hospitalId),
            createdAt: { $gte: lastMonth }
          } 
        },
        {
          $group: {
            _id: { 
              month: { $month: '$createdAt' },
              year: { $year: '$createdAt' }
            },
            totalAmount: { 
              $sum: { $cond: [{ $eq: ['$status', 'completed'] }, '$amount', 0] } 
            },
            count: { $sum: 1 }
          }
        }
      ]),
      
      // Today's statistics
      PaymentHistory.aggregate([
        { 
          $match: { 
            hospitalId: new mongoose.Types.ObjectId(hospitalId),
            createdAt: { $gte: today },
            status: 'completed'
          } 
        },
        {
          $group: {
            _id: null,
            todayAmount: { $sum: '$amount' },
            todayCount: { $sum: 1 }
          }
        }
      ]),
      
      // Payment method distribution
      PaymentHistory.aggregate([
        { 
          $match: { 
            hospitalId: new mongoose.Types.ObjectId(hospitalId),
            status: 'completed'
          } 
        },
        {
          $group: {
            _id: '$paymentMethod.type',
            count: { $sum: 1 },
            totalAmount: { $sum: '$amount' }
          }
        }
      ])
    ]);
    
    // Process results
    const stats = overallStats[0] || {
      totalSpent: 0,
      pendingAmount: 0,
      completedDeliveries: 0,
      pendingCount: 0,
      failedCount: 0,
      totalTransactions: 0
    };
    
    // Calculate average per delivery
    stats.averagePerDelivery = stats.completedDeliveries > 0 
      ? Math.round(stats.totalSpent / stats.completedDeliveries * 100) / 100
      : 0;
    
    // Add success rate
    stats.successRate = stats.totalTransactions > 0
      ? Math.round((stats.completedDeliveries / stats.totalTransactions) * 100)
      : 0;
    
    // Process monthly stats
    const currentMonthStats = monthlyStats.find(m => 
      m._id.month === (today.getMonth() + 1) && m._id.year === today.getFullYear()
    );
    const previousMonthStats = monthlyStats.find(m => 
      m._id.month === today.getMonth() && m._id.year === today.getFullYear()
    );
    
    stats.monthlyGrowth = previousMonthStats && currentMonthStats
      ? Math.round(((currentMonthStats.totalAmount - previousMonthStats.totalAmount) / previousMonthStats.totalAmount) * 100)
      : 0;
    
    // Add today's stats
    stats.todayAmount = todayStats[0]?.todayAmount || 0;
    stats.todayCount = todayStats[0]?.todayCount || 0;
    
    // Add payment method stats
    stats.paymentMethods = paymentMethodStats.map(method => ({
      type: method._id || 'unknown',
      count: method.count,
      totalAmount: method.totalAmount,
      percentage: Math.round((method.count / stats.completedDeliveries) * 100)
    }));
    
    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching payment stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch payment statistics' },
      { status: 500 }
    );
  }
}
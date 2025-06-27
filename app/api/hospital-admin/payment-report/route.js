// app/api/hospital-admin/payment-report/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { connectDB } from '@/lib/mongodb';
import PaymentHistory from '@/models/PaymentHistory';
import { Parser } from 'json2csv';

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
    const format = searchParams.get('format') || 'csv';

    await connectDB();

    // Build query
    const query = { hospitalId: session.user.hospitalId };
    
    if (dateFrom || dateTo) {
      query.createdAt = {};
      if (dateFrom) query.createdAt.$gte = new Date(dateFrom);
      if (dateTo) {
        const endDate = new Date(dateTo);
        endDate.setHours(23, 59, 59, 999);
        query.createdAt.$lte = endDate;
      }
    }
    
    if (status && status !== 'all') {
      query.status = status;
    }

    // Get all payments for the report
    const payments = await PaymentHistory.find(query)
      .sort({ createdAt: -1 })
      .lean();

    // Transform data for CSV
    const reportData = payments.map(payment => ({
      'Order ID': payment.orderId,
      'Date': new Date(payment.createdAt).toLocaleString(),
      'Staff Name': payment.staffDetails?.name || 'N/A',
      'Staff Email': payment.staffDetails?.email || 'N/A',
      'Package Type': payment.deliveryDetails?.packageType || 'N/A',
      'Urgency': payment.deliveryDetails?.urgency || 'N/A',
      'Weight (g)': payment.deliveryDetails?.weight || 0,
      'Base Price': payment.priceBreakdown?.basePrice || 0,
      'Urgency Charge': payment.priceBreakdown?.urgencyCharge || 0,
      'Distance Charge': payment.priceBreakdown?.distanceCharge || 0,
      'Weight Charge': payment.priceBreakdown?.weightCharge || 0,
      'Temperature Charge': payment.priceBreakdown?.temperatureCharge || 0,
      'Fragile Charge': payment.priceBreakdown?.fragileCharge || 0,
      'Time Based Charge': payment.priceBreakdown?.timeBasedCharge || 0,
      'Total Amount': payment.amount,
      'Currency': payment.currency,
      'Status': payment.status,
      'Payment ID': payment.razorpayPaymentId || 'N/A',
      'Invoice Number': payment.invoiceNumber || 'N/A'
    }));

    if (format === 'csv') {
      // Generate CSV
      const fields = Object.keys(reportData[0] || {});
      const parser = new Parser({ fields });
      const csv = parser.parse(reportData);

      // Return CSV file
      return new Response(csv, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="payment-report-${new Date().toISOString().split('T')[0]}.csv"`
        }
      });
    } else {
      // Return JSON
      return NextResponse.json({
        report: reportData,
        summary: {
          totalPayments: reportData.length,
          totalAmount: reportData.reduce((sum, p) => sum + p['Total Amount'], 0),
          completedPayments: reportData.filter(p => p.Status === 'completed').length,
          pendingPayments: reportData.filter(p => ['pending', 'processing'].includes(p.Status)).length,
          failedPayments: reportData.filter(p => p.Status === 'failed').length
        }
      });
    }
  } catch (error) {
    console.error('Error generating payment report:', error);
    return NextResponse.json(
      { error: 'Failed to generate payment report' },
      { status: 500 }
    );
  }
}
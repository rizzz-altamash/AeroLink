// // app/api/deliveries/export/route.js
// import { NextResponse } from 'next/server';
// import { getServerSession } from 'next-auth';
// import { authOptions } from '@/app/api/auth/[...nextauth]/route';
// import { connectDB } from '@/lib/mongodb';
// import { checkRole } from '@/lib/auth-helpers';
// import Delivery from '@/models/Delivery';
// import User from '@/models/User';
// import Hospital from '@/models/Hospital';

// export async function POST(req) {

//   // Check role authorization
//   const { authorized, response, session } = await checkRole(req, ['medical_staff']);
//   if (!authorized) return response;
  
  
//   try {
//     const session = await getServerSession(authOptions);
//     if (!session) {
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//     }

//     const filters = await req.json();
//     await connectDB();

//     // Build query based on filters
//     const query = {
//       'sender.userId': session.user.id
//     };

//     if (filters.status && filters.status !== 'all') {
//       query.status = filters.status;
//     }

//     if (filters.type && filters.type !== 'all') {
//       query['package.type'] = filters.type;
//     }

//     // Fetch deliveries
//     const deliveries = await Delivery.find(query)
//       .populate('recipient.userId', 'name')
//       .sort({ createdAt: -1 });

//     // Create CSV
//     const headers = ['Order ID', 'Date', 'Type', 'Recipient', 'Status', 'Duration (min)', 'Cost ($)'];
//     const rows = deliveries.map(d => [
//       d.orderId,
//       new Date(d.createdAt).toISOString().split('T')[0],
//       d.package?.type || 'N/A',
//       d.recipient?.name || 'N/A',
//       d.status,
//       d.delivery?.actualDeliveryTime ? 
//         Math.round((new Date(d.delivery.actualDeliveryTime) - new Date(d.createdAt)) / 60000) : 
//         'N/A',
//       d.pricing?.totalPrice?.toFixed(2) || 'N/A'
//     ]);

//     const csv = [
//       headers.join(','),
//       ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
//     ].join('\n');

//     return new NextResponse(csv, {
//       status: 200,
//       headers: {
//         'Content-Type': 'text/csv',
//         'Content-Disposition': `attachment; filename="deliveries-${new Date().toISOString().split('T')[0]}.csv"`
//       }
//     });
//   } catch (error) {
//     console.error('Error exporting deliveries:', error);
//     return NextResponse.json(
//       { error: 'Failed to export deliveries' },
//       { status: 500 }
//     );
//   }
// }

























// app/api/deliveries/export/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { connectDB } from '@/lib/mongodb';
import Delivery from '@/models/Delivery';
import User from '@/models/User';
import Hospital from '@/models/Hospital';
import { checkRole } from '@/lib/auth-helpers';

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const filters = await req.json();
    await connectDB();

    // Build query based on filters
    const query = {
      $or: [
        { 'sender.userId': session.user.id },
        { 'recipient.userId': session.user.id },
        { 'metadata.orderedBy': session.user.id }
      ]
    };

    if (filters.status && filters.status !== 'all') {
      query.status = filters.status;
    }

    if (filters.type && filters.type !== 'all') {
      query['package.type'] = filters.type;
    }

    // Fetch deliveries
    const deliveries = await Delivery.find(query)
      .populate('recipient.userId', 'name')
      .populate('recipient.hospitalId', 'name')
      .sort({ createdAt: -1 });

    // Create CSV
    const headers = ['Order ID', 'Date', 'Type', 'Recipient', 'Status', 'Duration (min)', 'Cost ($)'];
    const rows = deliveries.map(d => [
      d.orderId,
      new Date(d.createdAt).toISOString().split('T')[0],
      d.package?.type || 'N/A',
      d.recipient?.userId?.name || d.recipient?.name || 'N/A',
      d.status,
      d.delivery?.actualDeliveryTime ? 
        Math.round((new Date(d.delivery.actualDeliveryTime) - new Date(d.createdAt)) / 60000) : 
        'N/A',
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
        'Content-Disposition': `attachment; filename="deliveries-${new Date().toISOString().split('T')[0]}.csv"`
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
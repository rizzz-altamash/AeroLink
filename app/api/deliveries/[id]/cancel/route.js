// // app/api/deliveries/[id]/cancel/route.js
// import { NextResponse } from 'next/server';
// import { getServerSession } from 'next-auth';
// import { authOptions } from '@/app/api/auth/[...nextauth]/route';
// import { connectDB } from '@/lib/mongodb';
// import Delivery from '@/models/Delivery';
// import { checkRole } from '@/lib/auth-helpers';

// export async function POST(req, { params }) {

//   // Check role authorization
//   const { authorized, response, session } = await checkRole(req, ['medical_staff']);
//   if (!authorized) return response;
  
  
//   try {
//     const session = await getServerSession(authOptions);
//     if (!session) {
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//     }

//     const { id } = await params;

//     await connectDB();

//     const delivery = await Delivery.findById(id);

//     if (!delivery) {
//       return NextResponse.json({ error: 'Delivery not found' }, { status: 404 });
//     }

//     // Check if user has permission to cancel
//     if (delivery.sender.userId.toString() !== session.user.id &&
//         session.user.role !== 'admin') {
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
//     }

//     // Can only cancel pending deliveries
//     if (!['pending', 'approved'].includes(delivery.status)) {
//       return NextResponse.json(
//         { error: 'Cannot cancel delivery in current status' },
//         { status: 400 }
//       );
//     }

//     // Update status
//     await delivery.updateStatus('cancelled', 'Cancelled by sender');

//     return NextResponse.json({ success: true, delivery });
//   } catch (error) {
//     console.error('Error cancelling delivery:', error);
//     return NextResponse.json(
//       { error: 'Failed to cancel delivery' },
//       { status: 500 }
//     );
//   }
// }




















// app/api/deliveries/[id]/cancel/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { connectDB } from '@/lib/mongodb';
import { checkRole } from '@/lib/auth-helpers';
import Delivery from '@/models/Delivery';
import User from '@/models/User';
import Hospital from '@/models/Hospital';

export async function POST(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Await params as required in Next.js 14+
    const { id } = await params;

    await connectDB();

    const delivery = await Delivery.findById(id);

    if (!delivery) {
      return NextResponse.json({ error: 'Delivery not found' }, { status: 404 });
    }

    // Check if user has permission to cancel
    const userId = session.user.id;
    const isAdmin = session.user.role === 'admin';
    const isSender = delivery.sender.userId?.toString() === userId;
    const isOrderer = delivery.metadata?.orderedBy?.toString() === userId;

    if (!isAdmin && !isSender && !isOrderer) {
      return NextResponse.json({ error: 'Unauthorized to cancel this delivery' }, { status: 403 });
    }

    // Can only cancel pending or approved deliveries
    if (!['pending', 'approved'].includes(delivery.status)) {
      return NextResponse.json(
        { error: 'Cannot cancel delivery in current status' },
        { status: 400 }
      );
    }

    // Update status
    await delivery.updateStatus('cancelled', 'Cancelled by user');

    return NextResponse.json({ success: true, delivery });
  } catch (error) {
    console.error('Error cancelling delivery:', error);
    return NextResponse.json(
      { error: 'Failed to cancel delivery' },
      { status: 500 }
    );
  }
}
// // app/api/deliveries/recent/route.js
// import { NextResponse } from 'next/server';
// import { getServerSession } from 'next-auth';
// import { authOptions } from '@/app/api/auth/[...nextauth]/route';
// import { connectDB } from '@/lib/mongodb';
// import Delivery from '@/models/Delivery';

// export async function GET(req) {
//   try {
//     const session = await getServerSession(authOptions);
//     if (!session || session.user.role !== 'medical_staff') {
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//     }

//     await connectDB();

//     // Get recent completed deliveries
//     const recentDeliveries = await Delivery.find({
//       'sender.userId': session.user.id,
//       status: { $in: ['delivered', 'failed', 'cancelled'] }
//     })
//     .populate('recipient.userId', 'name')
//     .sort({ updatedAt: -1 })
//     .limit(10);

//     return NextResponse.json(recentDeliveries);
//   } catch (error) {
//     console.error('Error fetching recent deliveries:', error);
//     return NextResponse.json(
//       { error: 'Failed to fetch recent deliveries' },
//       { status: 500 }
//     );
//   }
// }
























// app/api/deliveries/recent/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { connectDB } from '@/lib/mongodb';
import Delivery from '@/models/Delivery';
import User from '@/models/User';
import Hospital from '@/models/Hospital';
import Drone from '@/models/Drone';

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'medical_staff') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    // Get recent completed deliveries where user is sender, recipient, or orderer
    const recentDeliveries = await Delivery.find({
      $and: [
        {
          $or: [
            { 'sender.userId': session.user.id },
            { 'recipient.userId': session.user.id },
            { 'metadata.orderedBy': session.user.id }
          ]
        },
        {
          status: { $in: ['delivered', 'failed', 'cancelled'] }
        }
      ]
    })
    .populate('recipient.userId', 'name')
    .populate('recipient.hospitalId', 'name')
    .sort({ updatedAt: -1 })
    .limit(10);

    return NextResponse.json(recentDeliveries);
  } catch (error) {
    console.error('Error fetching recent deliveries:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recent deliveries' },
      { status: 500 }
    );
  }
}
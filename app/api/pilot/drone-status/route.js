// app/api/pilot/drone-status/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { connectDB } from '@/lib/mongodb';
import Drone from '@/models/Drone';

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'pilot') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    // Get drone assigned to pilot (simplified - in production, track pilot-drone assignments)
    const drone = await Drone.findOne({ status: 'available' });

    if (!drone) {
      return NextResponse.json({ error: 'No drone assigned' }, { status: 404 });
    }

    return NextResponse.json({
      _id: drone._id,
      registrationId: drone.registrationId,
      model: drone.model,
      status: drone.status,
      battery: drone.health.batteryLevel,
      altitude: 0,
      speed: 0
    });
  } catch (error) {
    console.error('Error fetching drone status:', error);
    return NextResponse.json(
      { error: 'Failed to fetch drone status' },
      { status: 500 }
    );
  }
}
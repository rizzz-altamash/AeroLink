// app/api/admin/drones/status/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { connectDB } from '@/lib/mongodb';
import Drone from '@/models/Drone';

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    // Get all drones with status
    const drones = await Drone.find()
      .sort({ status: 1, 'health.batteryLevel': -1 })
      .limit(10);

    return NextResponse.json(drones);
  } catch (error) {
    console.error('Error fetching drone status:', error);
    return NextResponse.json(
      { error: 'Failed to fetch drone status' },
      { status: 500 }
    );
  }
}
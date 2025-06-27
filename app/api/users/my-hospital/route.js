// app/api/users/my-hospital/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { connectDB } from '@/lib/mongodb';
import Hospital from '@/models/Hospital';
import User from '@/models/User';

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    // Get user's hospital ID
    const user = await User.findById(session.user.id);
    if (!user || !user.hospitalId) {
      return NextResponse.json({ error: 'No hospital associated with user' }, { status: 404 });
    }

    // Get hospital details
    const hospital = await Hospital.findById(user.hospitalId);
    if (!hospital) {
      return NextResponse.json({ error: 'Hospital not found' }, { status: 404 });
    }

    return NextResponse.json(hospital);
  } catch (error) {
    console.error('Error fetching hospital:', error);
    return NextResponse.json(
      { error: 'Failed to fetch hospital data' },
      { status: 500 }
    );
  }
}
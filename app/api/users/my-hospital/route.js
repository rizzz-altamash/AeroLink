// app/api/users/my-hospital/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { connectDB } from '@/lib/mongodb';
import Hospital from '@/models/Hospital';

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const hospital = await Hospital.findById(session.user.hospitalId);
    
    if (!hospital) {
      return NextResponse.json({ error: 'Hospital not found' }, { status: 404 });
    }

    return NextResponse.json(hospital);
  } catch (error) {
    console.error('Error fetching hospital:', error);
    return NextResponse.json(
      { error: 'Failed to fetch hospital' },
      { status: 500 }
    );
  }
}
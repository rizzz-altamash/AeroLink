// app/api/hospital-admin/staff/list/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'hospital_admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const staff = await User.find({
      hospitalId: session.user.hospitalId,
      role: 'medical_staff'
    }).select('_id name email isActive createdAt');

    return NextResponse.json(staff);
  } catch (error) {
    console.error('Error fetching staff list:', error);
    return NextResponse.json(
      { error: 'Failed to fetch staff list' },
      { status: 500 }
    );
  }
}
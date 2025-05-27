// app/api/users/search/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const phone = searchParams.get('phone');

    if (!phone) {
      return NextResponse.json({ error: 'Phone number required' }, { status: 400 });
    }

    await connectDB();

    const user = await User.findOne({ phoneNumber: phone })
      .select('name email phoneNumber address');

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error searching user:', error);
    return NextResponse.json(
      { error: 'Failed to search user' },
      { status: 500 }
    );
  }
}
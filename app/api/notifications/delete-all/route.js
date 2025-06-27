// app/api/notifications/delete-all/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { connectDB } from '@/lib/mongodb';
import Notification from '@/models/Notification';

export async function DELETE(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    // Delete all notifications for the user
    const result = await Notification.deleteMany({
      userId: session.user.id
    });

    return NextResponse.json({ 
      success: true, 
      message: `${result.deletedCount} notifications deleted` 
    });
  } catch (error) {
    console.error('Error deleting all notifications:', error);
    return NextResponse.json(
      { error: 'Failed to delete notifications' },
      { status: 500 }
    );
  }
}
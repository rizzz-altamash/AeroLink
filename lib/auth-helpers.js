// Helper function to check roles in API routes
// lib/auth-helpers.js
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { NextResponse } from 'next/server';

export async function checkRole(req, allowedRoles = []) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return {
      authorized: false,
      response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    };
  }

  if (!allowedRoles.includes(session.user.role)) {
    return {
      authorized: false,
      response: NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    };
  }

  return {
    authorized: true,
    session
  };
}
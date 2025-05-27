// lib/auth.js - Helper functions for auth
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  return session?.user;
}

export async function isAuthenticated() {
  const user = await getCurrentUser();
  return !!user;
}

export async function hasRole(roles) {
  const user = await getCurrentUser();
  if (!user) return false;
  
  if (Array.isArray(roles)) {
    return roles.includes(user.role);
  }
  
  return user.role === roles;
}
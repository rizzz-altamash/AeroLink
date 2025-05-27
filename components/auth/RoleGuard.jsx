// components/auth/RoleGuard.jsx
'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function RoleGuard({ children, allowedRoles = [] }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;

    if (!session) {
      // Not logged in, redirect to sign in
      router.push('/auth/signin');
    } else if (!allowedRoles.includes(session.user.role)) {
      // Logged in but doesn't have required role
      router.push('/unauthorized');
    }
  }, [session, status, router, allowedRoles]);

  // Show loading while checking authentication
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner />
          <p className="text-gray-400 mt-4">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!session) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400">Redirecting to sign in...</p>
        </div>
      </div>
    );
  }

  // Wrong role
  if (!allowedRoles.includes(session.user.role)) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400">Access denied. Redirecting...</p>
        </div>
      </div>
    );
  }

  // Authorized - render children
  return children;
}
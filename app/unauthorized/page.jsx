// app/unauthorized/page.jsx
'use client';

import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function UnauthorizedPage() {
  const router = useRouter();
  const { data: session } = useSession();

  const handleGoBack = () => {
    if (session?.user) {
      // Redirect based on user role
      switch (session.user.role) {
        case 'admin':
          router.push('/dashboard');
          break;
        case 'hospital_admin':
          router.push('/dashboard');
          break;
        case 'medical_staff':
          router.push('/dashboard');
          break;
        case 'customer':
          router.push('/dashboard');
          break;
        case 'pilot':
          router.push('/dashboard');
          break;
        default:
          router.push('/');
      }
    } else {
      router.push('/');
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="mx-auto w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center mb-4">
            <svg className="w-12 h-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Access Denied</h1>
          <p className="text-gray-400">
            You don't have permission to access this page.
          </p>
        </div>

        {session?.user && (
          <div className="mb-8 p-4 bg-gray-900/50 rounded-xl">
            <p className="text-gray-300">
              Logged in as: <span className="text-white font-medium">{session.user.email}</span>
            </p>
            <p className="text-gray-300">
              Role: <span className="text-red-400 font-medium">{session.user.role}</span>
            </p>
          </div>
        )}

        <button
          onClick={handleGoBack}
          className="px-6 py-3 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-xl font-semibold hover:from-red-700 hover:to-rose-700 transition-all"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
}
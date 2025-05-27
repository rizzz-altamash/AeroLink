// components/auth/withRoleAuth.jsx
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function withRoleAuth(Component, allowedRoles = []) {
  return function ProtectedComponent(props) {
    const { data: session, status } = useSession({
      required: true,
      onUnauthenticated() {
        router.push('/auth/signin');
      },
    });
    const router = useRouter();

    useEffect(() => {
      if (status === 'authenticated' && session) {
        if (!allowedRoles.includes(session.user.role)) {
          router.push('/unauthorized');
        }
      }
    }, [session, status, router]);

    if (status === 'loading') {
      return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center">
          <LoadingSpinner />
        </div>
      );
    }

    if (status === 'authenticated' && allowedRoles.includes(session.user.role)) {
      return <Component {...props} />;
    }

    return null;
  };
}
// app/dashboard/layout.jsx
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';

export default async function DashboardLayoutWrapper({ children }) {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/auth/signin');
  }

  return <>{children}</>;
} 
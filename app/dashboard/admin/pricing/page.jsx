// app/dashboard/admin/pricing/page.jsx
'use client';

import DashboardLayout from '@/components/dashboard/DashboardLayout';
import RoleGuard from '@/components/auth/RoleGuard';
import PricingManagement from '@/components/dashboard/PricingManagement';

export default function PricingPage() {
  return (
    <RoleGuard allowedRoles={['admin']}>
      <DashboardLayout>
        <div className="p-8">
          <PricingManagement />
        </div>
      </DashboardLayout>
    </RoleGuard>
  );
}
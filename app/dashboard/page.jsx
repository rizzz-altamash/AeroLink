// // app/dashboard/page.jsx
// 'use client';

// import { useSession } from 'next-auth/react';
// import { useEffect, useState } from 'react';
// import CustomerDashboard from '@/components/dashboard/CustomerDashboard';
// import HospitalDashboard from '@/components/dashboard/HospitalDashboard';
// // import PilotDashboard from '@/components/dashboard/PilotDashboard';
// // import AdminDashboard from '@/components/dashboard/AdminDashboard';
// import DashboardLayout from '@/components/dashboard/DashboardLayout';

// export default function DashboardPage() {
//   const { data: session, status } = useSession();
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (status !== 'loading') {
//       setLoading(false);
//     }
//   }, [status]);

//   if (loading) {
//     return (
//       <DashboardLayout>
//         <div className="min-h-[60vh] flex items-center justify-center">
//           <div className="text-center">
//             <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600/20 rounded-full mb-4">
//               <svg className="w-8 h-8 text-blue-500 animate-spin" fill="none" viewBox="0 0 24 24">
//                 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//               </svg>
//             </div>
//             <p className="text-gray-400">Loading dashboard...</p>
//           </div>
//         </div>
//       </DashboardLayout>
//     );
//   }

//   const renderDashboard = () => {
//     switch (session?.user?.role) {
//       case 'admin':
//         return <AdminDashboard />;
//       case 'hospital_admin':
//       case 'medical_staff':
//         return <HospitalDashboard />;
//       case 'pilot':
//         return <PilotDashboard />;
//       case 'customer':
//       default:
//         return <CustomerDashboard />;
//     }
//   };

//   return (
//     <DashboardLayout>
//       {renderDashboard()}
//     </DashboardLayout>
//   );
// }





















// app/dashboard/page.jsx
'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import AdminDashboard from '@/components/dashboard/AdminDashboard';
import HospitalAdminDashboard from '@/components/dashboard/HospitalAdminDashboard';
import MedicalStaffDashboard from '@/components/dashboard/MedicalStaffDashboard';
import CustomerDashboard from '@/components/dashboard/CustomerDashboard';
import PilotDashboard from '@/components/dashboard/PilotDashboard';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!session?.user) {
    return null;
  }

  const renderDashboard = () => {
    switch (session.user.role) {
      case 'admin':
        return <AdminDashboard />;
      case 'hospital_admin':
        return <HospitalAdminDashboard />;
      case 'medical_staff':
        return <MedicalStaffDashboard />;
      case 'customer':
        return <CustomerDashboard />;
      case 'pilot':
        return <PilotDashboard />;
      default:
        return <CustomerDashboard />;
    }
  };

  return (
    <DashboardLayout>
      {renderDashboard()}
    </DashboardLayout>
  );
}
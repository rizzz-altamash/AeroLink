// // components/dashboard/MedicalStaffDashboard.jsx
// 'use client';

// import { useState, useEffect } from 'react';
// import { useSession } from 'next-auth/react';
// import { useRouter } from 'next/navigation';

// export default function MedicalStaffDashboard() {
//   const { data: session } = useSession();
//   const router = useRouter();
//   const [activeDeliveries, setActiveDeliveries] = useState([]);
//   const [recentDeliveries, setRecentDeliveries] = useState([]);
//   const [stats, setStats] = useState({
//     todayDeliveries: 0,
//     pendingPickups: 0,
//     inTransit: 0,
//     avgDeliveryTime: 0
//   });

//   useEffect(() => {
//     fetchActiveDeliveries();
//     fetchRecentDeliveries();
//     fetchStats();
//   }, []);

//   const fetchActiveDeliveries = async () => {
//     try {
//       const res = await fetch('/api/deliveries/active');
//       const data = await res.json();
//       setActiveDeliveries(data);
//     } catch (error) {
//       console.error('Failed to fetch active deliveries:', error);
//     }
//   };

//   const fetchRecentDeliveries = async () => {
//     try {
//       const res = await fetch('/api/deliveries/recent');
//       const data = await res.json();
//       setRecentDeliveries(data);
//     } catch (error) {
//       console.error('Failed to fetch recent deliveries:', error);
//     }
//   };

//   const fetchStats = async () => {
//     try {
//       const res = await fetch('/api/staff/stats');
//       const data = await res.json();
//       setStats(data);
//     } catch (error) {
//       console.error('Failed to fetch stats:', error);
//     }
//   };

//   const handleNewDelivery = (urgency) => {
//     router.push(`/dashboard/new-delivery${urgency === 'emergency' ? '?urgency=emergency' : ''}`);
//   };

//   return (
//     <div className="p-8">
//       {/* Header */}
//       <div className="mb-8">
//         <h1 className="text-3xl font-bold text-white mb-2">Medical Staff Dashboard</h1>
//         <p className="text-gray-400">Welcome back, {session?.user?.name}</p>
//       </div>

//       {/* Quick Actions */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
//         <QuickActionCard
//           title="Standard Delivery"
//           description="Regular medical supplies and documents"
//           icon={PackageIcon}
//           gradient="from-blue-600 to-cyan-600"
//           onClick={() => handleNewDelivery('standard')}
//         />
//         <QuickActionCard
//           title="Urgent Delivery"
//           description="Time-sensitive medications and samples"
//           icon={UrgentIcon}
//           gradient="from-orange-600 to-amber-600"
//           onClick={() => handleNewDelivery('urgent')}
//         />
//         <QuickActionCard
//           title="Emergency Delivery"
//           description="Critical supplies, blood, organs"
//           icon={EmergencyIcon}
//           gradient="from-red-600 to-rose-600"
//           onClick={() => handleNewDelivery('emergency')}
//         />
//       </div>

//       {/* Stats Overview */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
//         <StatCard
//           title="Today's Deliveries"
//           value={stats.todayDeliveries}
//           icon={TodayIcon}
//           color="text-blue-400"
//           bgColor="bg-blue-500/20"
//         />
//         <StatCard
//           title="Pending Pickup"
//           value={stats.pendingPickups}
//           icon={PendingIcon}
//           color="text-yellow-400"
//           bgColor="bg-yellow-500/20"
//         />
//         <StatCard
//           title="In Transit"
//           value={stats.inTransit}
//           icon={TransitIcon}
//           color="text-purple-400"
//           bgColor="bg-purple-500/20"
//         />
//         <StatCard
//           title="Avg. Delivery Time"
//           value={`${stats.avgDeliveryTime} min`}
//           icon={TimeIcon}
//           color="text-green-400"
//           bgColor="bg-green-500/20"
//         />
//       </div>

//       {/* Active Deliveries */}
//       <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-red-500/20 hover:border-red-500/30 transition-all mb-8">
//         <div className="flex items-center justify-between mb-6">
//           <h2 className="text-xl font-semibold text-white">Active Deliveries</h2>
//           <button className="text-red-400 hover:text-red-300 text-sm font-medium">
//             Track All
//           </button>
//         </div>
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//           {activeDeliveries.length === 0 ? (
//             <div className="col-span-full text-center py-8">
//               <p className="text-gray-500">No active deliveries at the moment</p>
//             </div>
//           ) : (
//             activeDeliveries.map((delivery) => (
//               <ActiveDeliveryCard key={delivery._id} delivery={delivery} />
//             ))
//           )}
//         </div>
//       </div>

//       {/* Recent Delivery History */}
//       <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-red-500/20 hover:border-red-500/30 transition-all">
//         <div className="flex items-center justify-between mb-6">
//           <h2 className="text-xl font-semibold text-white">Recent Deliveries</h2>
//           <button className="text-red-400 hover:text-red-300 text-sm font-medium">
//             View History
//           </button>
//         </div>
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead>
//               <tr className="text-left border-b border-gray-800">
//                 <th className="pb-3 text-sm font-medium text-gray-400">Order ID</th>
//                 <th className="pb-3 text-sm font-medium text-gray-400">Type</th>
//                 <th className="pb-3 text-sm font-medium text-gray-400">Recipient</th>
//                 <th className="pb-3 text-sm font-medium text-gray-400">Delivered</th>
//                 <th className="pb-3 text-sm font-medium text-gray-400">Duration</th>
//                 <th className="pb-3 text-sm font-medium text-gray-400">Status</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-800">
//               {recentDeliveries.length === 0 ? (
//                 <tr>
//                   <td colSpan="6" className="py-4 text-center text-gray-500">
//                     No recent deliveries
//                   </td>
//                 </tr>
//               ) : (
//                 recentDeliveries.map((delivery) => (
//                   <RecentDeliveryRow key={delivery._id} delivery={delivery} />
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// }

// // Quick Action Card Component
// function QuickActionCard({ title, description, icon: Icon, gradient, onClick }) {
//   return (
//     <button
//       onClick={onClick}
//       className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-red-500/20 hover:border-red-500/30 transition-all group text-left hover:shadow-lg hover:shadow-red-500/10"
//     >
//       <div className={`w-14 h-14 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
//         <Icon className="w-8 h-8 text-white" />
//       </div>
//       <h3 className="text-white font-semibold mb-1">{title}</h3>
//       <p className="text-gray-400 text-sm">{description}</p>
//     </button>
//   );
// }

// // Stat Card Component
// function StatCard({ title, value, icon: Icon, color, bgColor }) {
//   return (
//     <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-red-500/20 hover:border-red-500/30 transition-all group">
//       <div className="flex items-center gap-4">
//         <div className={`w-12 h-12 ${bgColor} backdrop-blur rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
//           <Icon className={`w-6 h-6 ${color}`} />
//         </div>
//         <div>
//           <p className="text-gray-400 text-sm">{title}</p>
//           <p className="text-2xl font-bold text-white">{value}</p>
//         </div>
//       </div>
//     </div>
//   );
// }

// // Active Delivery Card Component
// function ActiveDeliveryCard({ delivery }) {
//   const urgencyColors = {
//     routine: 'from-blue-600 to-cyan-600',
//     urgent: 'from-orange-600 to-amber-600',
//     emergency: 'from-red-600 to-rose-600'
//   };

//   const statusIcons = {
//     pending: PendingIcon,
//     pickup: PickupIcon,
//     in_transit: TransitIcon,
//     delivered: DeliveredIcon
//   };

//   const StatusIcon = statusIcons[delivery.status] || PendingIcon;
//   const urgencyGradient = urgencyColors[delivery.urgency] || urgencyColors.routine;

//   return (
//     <div className="bg-gray-800/50 rounded-xl p-5 hover:bg-gray-800/70 transition-all">
//       <div className="flex items-start justify-between mb-4">
//         <div>
//           <h3 className="text-white font-semibold">{delivery.orderId}</h3>
//           <p className="text-gray-400 text-sm">{delivery.type}</p>
//         </div>
//         <span className={`px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${urgencyGradient} text-white`}>
//           {delivery.urgency}
//         </span>
//       </div>
      
//       <div className="space-y-3">
//         <div className="flex items-center gap-2">
//           <LocationIcon className="w-4 h-4 text-gray-400" />
//           <p className="text-gray-300 text-sm truncate">{delivery.destination}</p>
//         </div>
        
//         <div className="flex items-center gap-2">
//           <StatusIcon className="w-4 h-4 text-red-400" />
//           <p className="text-red-400 text-sm">{delivery.status.replace('_', ' ')}</p>
//         </div>
        
//         <div className="flex items-center gap-2">
//           <TimeIcon className="w-4 h-4 text-gray-400" />
//           <p className="text-gray-300 text-sm">ETA: {delivery.eta}</p>
//         </div>
//       </div>
      
//       <button className="mt-4 w-full py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg transition-all text-sm font-medium">
//         Track Delivery
//       </button>
//     </div>
//   );
// }

// // Recent Delivery Row Component
// function RecentDeliveryRow({ delivery }) {
//   const statusColors = {
//     delivered: 'text-green-400',
//     failed: 'text-red-400',
//     cancelled: 'text-gray-400'
//   };

//   const statusColor = statusColors[delivery.status] || 'text-gray-400';

//   return (
//     <tr className="hover:bg-gray-800/50 transition-colors">
//       <td className="py-3">
//         <span className="text-white font-medium">{delivery.orderId}</span>
//       </td>
//       <td className="py-3">
//         <span className="text-gray-300">{delivery.type}</span>
//       </td>
//       <td className="py-3">
//         <span className="text-gray-300">{delivery.recipient}</span>
//       </td>
//       <td className="py-3">
//         <span className="text-gray-300">{delivery.deliveredAt}</span>
//       </td>
//       <td className="py-3">
//         <span className="text-gray-300">{delivery.duration}</span>
//       </td>
//       <td className="py-3">
//         <span className={`font-medium ${statusColor}`}>
//           {delivery.status}
//         </span>
//       </td>
//     </tr>
//   );
// }

// // Icon Components
// const PackageIcon = ({ className }) => (
//   <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
//   </svg>
// );

// const UrgentIcon = ({ className }) => (
//   <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
//   </svg>
// );

// const EmergencyIcon = ({ className }) => (
//   <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
//   </svg>
// );

// const TodayIcon = ({ className }) => (
//   <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
//   </svg>
// );

// const PendingIcon = ({ className }) => (
//   <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//   </svg>
// );

// const TransitIcon = ({ className }) => (
//   <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
//   </svg>
// );

// const TimeIcon = ({ className }) => (
//   <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//   </svg>
// );

// const LocationIcon = ({ className }) => (
//   <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
//   </svg>
// );

// const PickupIcon = ({ className }) => (
//   <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
//   </svg>
// );

// const DeliveredIcon = ({ className }) => (
//   <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//   </svg>
// )















// components/dashboard/MedicalStaffDashboard.jsx
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import NotificationBell from '@/components/NotificationBell';
import toast from 'react-hot-toast';

// Icon Components - Define at the top
const PackageIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
  </svg>
);

const UrgentIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

const EmergencyIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);

const TodayIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const PendingIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const TransitIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
  </svg>
);

const TimeIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const LocationIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const PickupIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
  </svg>
);

const DeliveredIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const DroneIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
  </svg>
);

const BatteryIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
  </svg>
);

const LoadingSpinner = () => (
  <svg className="animate-spin h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

export default function MedicalStaffDashboard() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [activeDeliveries, setActiveDeliveries] = useState([]);
  const [recentDeliveries, setRecentDeliveries] = useState([]);
  const [stats, setStats] = useState({
    todayDeliveries: 0,
    pendingPickups: 0,
    inTransit: 0,
    avgDeliveryTime: 0
  });
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [showTrackingModal, setShowTrackingModal] = useState(false);

  useEffect(() => {
    fetchDashboardData();
    // Set up auto-refresh for active deliveries
    const interval = setInterval(() => {
      fetchActiveDeliveries();
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchActiveDeliveries(),
        fetchRecentDeliveries(),
        fetchStats()
      ]);
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const fetchActiveDeliveries = async () => {
    try {
      const res = await fetch('/api/deliveries/active');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setActiveDeliveries(data);
    } catch (error) {
      console.error('Failed to fetch active deliveries:', error);
    }
  };

  const fetchRecentDeliveries = async () => {
    try {
      const res = await fetch('/api/deliveries/recent');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setRecentDeliveries(data);
    } catch (error) {
      console.error('Failed to fetch recent deliveries:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/staff/stats');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const handleNewDelivery = (urgency) => {
    router.push(`/dashboard/new-delivery?urgency=${urgency}`);
  };

  const handleTrackDelivery = async (delivery) => {
    setSelectedDelivery(delivery);
    setShowTrackingModal(true);
  };

  const handleCancelDelivery = async (deliveryId) => {
    if (!confirm('Are you sure you want to cancel this delivery?')) return;

    try {
      const res = await fetch(`/api/deliveries/${deliveryId}/cancel`, {
        method: 'POST'
      });

      if (!res.ok) throw new Error('Failed to cancel');

      alert('Delivery cancelled successfully');
      fetchDashboardData();
    } catch (error) {
      alert('Failed to cancel delivery');
    }
  };

  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="p-8 relative">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-500/5 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-rose-500/5 rounded-full blur-3xl animate-pulse-slow animation-delay-2000"></div>
      </div>

      {/* Header */}
      <div className="mb-8 relative">
        <h1 className="text-3xl font-bold text-white mb-2 flex justify-between">Medical Staff Dashboard <NotificationBell /></h1>
        <p className="text-gray-400">Welcome back, {session?.user?.name}</p>
      </div>

      {/* Quick Actions with animations */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <QuickActionCard
          title="Standard Delivery"
          description="Regular medical supplies and documents"
          icon={PackageIcon}
          gradient="from-blue-600 to-cyan-600"
          onClick={() => handleNewDelivery('routine')}
          delay="0"
        />
        <QuickActionCard
          title="Urgent Delivery"
          description="Time-sensitive medications and samples"
          icon={UrgentIcon}
          gradient="from-orange-600 to-amber-600"
          onClick={() => handleNewDelivery('urgent')}
          delay="100"
        />
        <QuickActionCard
          title="Emergency Delivery"
          description="Critical supplies, blood, organs"
          icon={EmergencyIcon}
          gradient="from-red-600 to-rose-600"
          onClick={() => handleNewDelivery('emergency')}
          delay="200"
        />
      </div>

      {/* Stats Overview with loading states */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Today's Deliveries"
          value={stats.todayDeliveries}
          icon={TodayIcon}
          color="text-blue-400"
          bgColor="bg-blue-500/20"
          trend="+12%"
          delay="0"
        />
        <StatCard
          title="Pending Pickup"
          value={stats.pendingPickups}
          icon={PendingIcon}
          color="text-yellow-400"
          bgColor="bg-yellow-500/20"
          trend="-5%"
          delay="100"
        />
        <StatCard
          title="In Transit"
          value={stats.inTransit}
          icon={TransitIcon}
          color="text-purple-400"
          bgColor="bg-purple-500/20"
          delay="200"
        />
        <StatCard
          title="Avg. Delivery Time"
          value={`${stats.avgDeliveryTime} min`}
          icon={TimeIcon}
          color="text-green-400"
          bgColor="bg-green-500/20"
          trend="-8%"
          delay="300"
        />
      </div>

      {/* Active Deliveries with real-time updates */}
      <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-red-500/20 hover:border-red-500/30 transition-all mb-8 animate-fade-in-up">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold text-white">Active Deliveries</h2>
            {activeDeliveries.length > 0 && (
              <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded-full text-xs font-medium animate-pulse">
                {activeDeliveries.length} Active
              </span>
            )}
          </div>
          <button 
            onClick={() => router.push('/dashboard/track-all')}
            className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors"
          >
            Track All
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {activeDeliveries.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <DroneIcon className="w-16 h-16 text-gray-600 mx-auto mb-4 opacity-50" />
              <p className="text-gray-500">No active deliveries at the moment</p>
              <button 
                onClick={() => handleNewDelivery('routine')}
                className="mt-4 text-red-400 hover:text-red-300 text-sm font-medium"
              >
                Create New Delivery →
              </button>
            </div>
          ) : (
            activeDeliveries.map((delivery, index) => (
              <ActiveDeliveryCard 
                key={delivery._id} 
                delivery={delivery} 
                onTrack={() => handleTrackDelivery(delivery)}
                onCancel={() => handleCancelDelivery(delivery._id)}
                delay={index * 100}
              />
            ))
          )}
        </div>
      </div>

      {/* Recent Delivery History with filters */}
      <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-red-500/20 hover:border-red-500/30 transition-all animate-fade-in-up animation-delay-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">Recent Deliveries</h2>
          <div className="flex items-center gap-4">
            <select className="bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-white focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all">
              <option value="all">All Types</option>
              <option value="medication">Medication</option>
              <option value="blood">Blood</option>
              <option value="medical_supplies">Medical Supplies</option>
            </select>
            <button 
              onClick={() => router.push('/dashboard/delivery-history')}
              className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors"
            >
              View History
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-gray-800">
                <th className="pb-3 text-sm font-medium text-gray-400">Order ID</th>
                <th className="pb-3 text-sm font-medium text-gray-400">Type</th>
                <th className="pb-3 text-sm font-medium text-gray-400">Recipient</th>
                <th className="pb-3 text-sm font-medium text-gray-400">Delivered</th>
                <th className="pb-3 text-sm font-medium text-gray-400">Duration</th>
                <th className="pb-3 text-sm font-medium text-gray-400">Status</th>
                <th className="pb-3 text-sm font-medium text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {recentDeliveries.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-gray-500">
                    No recent deliveries
                  </td>
                </tr>
              ) : (
                recentDeliveries.map((delivery, index) => (
                  <RecentDeliveryRow 
                    key={delivery._id} 
                    delivery={delivery} 
                    delay={index * 50}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tracking Modal */}
      {showTrackingModal && selectedDelivery && (
        <TrackingModal 
          delivery={selectedDelivery} 
          onClose={() => {
            setShowTrackingModal(false);
            setSelectedDelivery(null);
          }}
        />
      )}
    </div>
  );
}

// Enhanced Quick Action Card with animations
function QuickActionCard({ title, description, icon: Icon, gradient, onClick, delay }) {
  return (
    <button
      onClick={onClick}
      className={`bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-red-500/20 hover:border-red-500/30 transition-all group text-left hover:shadow-lg hover:shadow-red-500/10 transform hover:-translate-y-1 animate-fade-in-up`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className={`w-14 h-14 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg group-hover:rotate-3`}>
        <Icon className="w-8 h-8 text-white" />
      </div>
      <h3 className="text-white font-semibold mb-1 group-hover:text-red-300 transition-colors">{title}</h3>
      <p className="text-gray-400 text-sm">{description}</p>
      <div className="mt-4 flex items-center text-red-400 text-sm opacity-0 group-hover:opacity-100 transition-opacity">
        <span>Create delivery</span>
        <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </button>
  );
}

// Enhanced Stat Card with trends
function StatCard({ title, value, icon: Icon, color, bgColor, trend, delay }) {
  const isPositive = trend && trend.startsWith('+');
  
  return (
    <div 
      className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-red-500/20 hover:border-red-500/30 transition-all group animate-fade-in-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 ${bgColor} backdrop-blur rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-sm ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
            {isPositive ? (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
              </svg>
            )}
            <span>{trend}</span>
          </div>
        )}
      </div>
      <div>
        <p className="text-gray-400 text-sm">{title}</p>
        <p className="text-2xl font-bold text-white mt-1">{value}</p>
      </div>
    </div>
  );
}

// Enhanced Active Delivery Card with actions
function ActiveDeliveryCard({ delivery, onTrack, onCancel, delay }) {
  const urgencyColors = {
    routine: 'from-blue-600 to-cyan-600',
    urgent: 'from-orange-600 to-amber-600',
    emergency: 'from-red-600 to-rose-600'
  };

  const statusIcons = {
    pending: PendingIcon,
    pickup: PickupIcon,
    in_transit: TransitIcon,
    delivered: DeliveredIcon
  };

  const StatusIcon = statusIcons[delivery.status] || PendingIcon;
  const urgencyGradient = urgencyColors[delivery.package?.urgency] || urgencyColors.routine;

  return (
    <div 
      className="bg-gray-800/50 rounded-xl p-5 hover:bg-gray-800/70 transition-all group animate-scale-in"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-white font-semibold group-hover:text-red-300 transition-colors">{delivery.orderId}</h3>
          <p className="text-gray-400 text-sm">{delivery.package?.type || 'Package'}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${urgencyGradient} text-white animate-pulse`}>
          {delivery.package?.urgency || 'routine'}
        </span>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <LocationIcon className="w-4 h-4 text-gray-400" />
          <p className="text-gray-300 text-sm truncate">{delivery.recipient?.name || 'Unknown'}</p>
        </div>
        
        <div className="flex items-center gap-2">
          <StatusIcon className="w-4 h-4 text-red-400" />
          <p className="text-red-400 text-sm capitalize">{delivery.status?.replace('_', ' ')}</p>
        </div>
        
        <div className="flex items-center gap-2">
          <TimeIcon className="w-4 h-4 text-gray-400" />
          <p className="text-gray-300 text-sm">
            ETA: {delivery.delivery?.scheduledTime ? 
              new Date(delivery.delivery.scheduledTime).toLocaleTimeString() : 
              'Calculating...'}
          </p>
        </div>

        {/* Battery and Drone Status */}
        {delivery.tracking?.battery && (
          <div className="flex items-center gap-2">
            <BatteryIcon className="w-4 h-4 text-gray-400" />
            <div className="flex-1 bg-gray-700 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all ${
                  delivery.tracking.battery > 50 ? 'bg-green-500' : 
                  delivery.tracking.battery > 20 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${delivery.tracking.battery}%` }}
              />
            </div>
            <span className="text-xs text-gray-400">{delivery.tracking.battery}%</span>
          </div>
        )}
      </div>
      
      <div className="mt-4 flex gap-2">
        <button 
          onClick={onTrack}
          className="flex-1 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg transition-all text-sm font-medium group"
        >
          <span className="flex items-center justify-center gap-1">
            Track
            <svg className="w-3 h-3 transform group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </button>
        {delivery.status === 'pending' && (
          <button 
            onClick={onCancel}
            className="px-3 py-2 bg-gray-700/50 hover:bg-red-600/20 text-gray-400 hover:text-red-400 rounded-lg transition-all text-sm"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

// Enhanced Recent Delivery Row
function RecentDeliveryRow({ delivery, delay }) {
  const statusColors = {
    delivered: 'text-green-400 bg-green-500/20',
    failed: 'text-red-400 bg-red-500/20',
    cancelled: 'text-gray-400 bg-gray-500/20'
  };

  const statusStyle = statusColors[delivery.status] || statusColors.cancelled;

  return (
    <tr 
      className="hover:bg-gray-800/50 transition-colors animate-fade-in"
      style={{ animationDelay: `${delay}ms` }}
    >
      <td className="py-3">
        <span className="text-white font-medium">{delivery.orderId}</span>
      </td>
      <td className="py-3">
        <span className="text-gray-300 capitalize">{delivery.package?.type}</span>
      </td>
      <td className="py-3">
        <span className="text-gray-300">{delivery.recipient?.name}</span>
      </td>
      <td className="py-3">
        <span className="text-gray-300">
          {delivery.delivery?.actualDeliveryTime ? 
            new Date(delivery.delivery.actualDeliveryTime).toLocaleDateString() : 
            'N/A'}
        </span>
      </td>
      <td className="py-3">
        <span className="text-gray-300">
          {delivery.delivery?.actualDeliveryTime && delivery.createdAt ? 
            `${Math.round((new Date(delivery.delivery.actualDeliveryTime) - new Date(delivery.createdAt)) / 60000)} min` : 
            'N/A'}
        </span>
      </td>
      <td className="py-3">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyle}`}>
          {delivery.status}
        </span>
      </td>
      <td className="py-3">
        <button className="text-red-400 hover:text-red-300 text-sm">
          View Details
        </button>
      </td>
    </tr>
  );
}

// Loading Skeleton
function DashboardSkeleton() {
  return (
    <div className="p-8 animate-pulse">
      <div className="h-8 bg-gray-800 rounded w-64 mb-8"></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-gray-900/50 rounded-2xl p-6 h-40"></div>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="bg-gray-900/50 rounded-2xl p-6 h-32"></div>
        ))}
      </div>
    </div>
  );
}

// Tracking Modal Component
function TrackingModal({ delivery, onClose }) {
  const [trackingData, setTrackingData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrackingData();
    const interval = setInterval(fetchTrackingData, 5000); // Update every 5 seconds
    return () => clearInterval(interval);
  }, [delivery._id]);

  const fetchTrackingData = async () => {
    try {
      const res = await fetch(`/api/deliveries/${delivery._id}/track`);
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setTrackingData(data);
    } catch (error) {
      console.error('Failed to fetch tracking data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-gray-900 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scale-in">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Live Tracking</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner />
          </div>
        ) : trackingData ? (
          <div className="space-y-6">
            {/* Map placeholder */}
            <div className="bg-gray-800 rounded-xl h-64 flex items-center justify-center">
              <p className="text-gray-500">Live map tracking coming soon</p>
            </div>

            {/* Tracking details */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-800/50 rounded-xl p-4">
                <p className="text-gray-400 text-sm mb-1">Current Status</p>
                <p className="text-white font-semibold capitalize">{trackingData.status}</p>
              </div>
              <div className="bg-gray-800/50 rounded-xl p-4">
                <p className="text-gray-400 text-sm mb-1">Drone ID</p>
                <p className="text-white font-semibold">{trackingData.droneId || 'Assigning...'}</p>
              </div>
              <div className="bg-gray-800/50 rounded-xl p-4">
                <p className="text-gray-400 text-sm mb-1">Battery Level</p>
                <p className="text-white font-semibold">{trackingData.tracking?.battery || 0}%</p>
              </div>
              <div className="bg-gray-800/50 rounded-xl p-4">
                <p className="text-gray-400 text-sm mb-1">ETA</p>
                <p className="text-white font-semibold">
                  {trackingData.delivery?.scheduledTime ? 
                    new Date(trackingData.delivery.scheduledTime).toLocaleTimeString() : 
                    'Calculating...'}
                </p>
              </div>
            </div>

            {/* Timeline */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Delivery Timeline</h3>
              <div className="space-y-4">
                {trackingData.timeline?.map((event, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-3 h-3 rounded-full ${
                        index === 0 ? 'bg-red-500' : 'bg-gray-600'
                      }`}></div>
                      {index < trackingData.timeline.length - 1 && (
                        <div className="w-0.5 h-16 bg-gray-700"></div>
                      )}
                    </div>
                    <div className="flex-1 pb-8">
                      <p className="text-white font-medium capitalize">{event.status}</p>
                      <p className="text-gray-400 text-sm">
                        {new Date(event.timestamp).toLocaleString()}
                      </p>
                      {event.notes && (
                        <p className="text-gray-500 text-sm mt-1">{event.notes}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-500 py-12">No tracking data available</p>
        )}
      </div>
    </div>
  );
}
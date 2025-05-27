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
//       <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-red-500/10 mb-8">
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
//       <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-red-500/10">
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
//       className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-red-500/10 hover:border-red-500/20 transition-all group text-left"
//     >
//       <div className={`w-14 h-14 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
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
//     <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-red-500/10">
//       <div className="flex items-center gap-4">
//         <div className={`w-12 h-12 ${bgColor} rounded-xl flex items-center justify-center`}>
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
// );




























// components/dashboard/MedicalStaffDashboard.jsx
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function MedicalStaffDashboard() {
  const { data: session } = useSession();
  const router = useRouter();
  const [activeDeliveries, setActiveDeliveries] = useState([]);
  const [recentDeliveries, setRecentDeliveries] = useState([]);
  const [stats, setStats] = useState({
    todayDeliveries: 0,
    pendingPickups: 0,
    inTransit: 0,
    avgDeliveryTime: 0
  });

  useEffect(() => {
    fetchActiveDeliveries();
    fetchRecentDeliveries();
    fetchStats();
  }, []);

  const fetchActiveDeliveries = async () => {
    try {
      const res = await fetch('/api/deliveries/active');
      const data = await res.json();
      setActiveDeliveries(data);
    } catch (error) {
      console.error('Failed to fetch active deliveries:', error);
    }
  };

  const fetchRecentDeliveries = async () => {
    try {
      const res = await fetch('/api/deliveries/recent');
      const data = await res.json();
      setRecentDeliveries(data);
    } catch (error) {
      console.error('Failed to fetch recent deliveries:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/staff/stats');
      const data = await res.json();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const handleNewDelivery = (urgency) => {
    router.push(`/dashboard/new-delivery${urgency === 'emergency' ? '?urgency=emergency' : ''}`);
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Medical Staff Dashboard</h1>
        <p className="text-gray-400">Welcome back, {session?.user?.name}</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <QuickActionCard
          title="Standard Delivery"
          description="Regular medical supplies and documents"
          icon={PackageIcon}
          gradient="from-blue-600 to-cyan-600"
          onClick={() => handleNewDelivery('standard')}
        />
        <QuickActionCard
          title="Urgent Delivery"
          description="Time-sensitive medications and samples"
          icon={UrgentIcon}
          gradient="from-orange-600 to-amber-600"
          onClick={() => handleNewDelivery('urgent')}
        />
        <QuickActionCard
          title="Emergency Delivery"
          description="Critical supplies, blood, organs"
          icon={EmergencyIcon}
          gradient="from-red-600 to-rose-600"
          onClick={() => handleNewDelivery('emergency')}
        />
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Today's Deliveries"
          value={stats.todayDeliveries}
          icon={TodayIcon}
          color="text-blue-400"
          bgColor="bg-blue-500/20"
        />
        <StatCard
          title="Pending Pickup"
          value={stats.pendingPickups}
          icon={PendingIcon}
          color="text-yellow-400"
          bgColor="bg-yellow-500/20"
        />
        <StatCard
          title="In Transit"
          value={stats.inTransit}
          icon={TransitIcon}
          color="text-purple-400"
          bgColor="bg-purple-500/20"
        />
        <StatCard
          title="Avg. Delivery Time"
          value={`${stats.avgDeliveryTime} min`}
          icon={TimeIcon}
          color="text-green-400"
          bgColor="bg-green-500/20"
        />
      </div>

      {/* Active Deliveries */}
      <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-red-500/20 hover:border-red-500/30 transition-all mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">Active Deliveries</h2>
          <button className="text-red-400 hover:text-red-300 text-sm font-medium">
            Track All
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {activeDeliveries.length === 0 ? (
            <div className="col-span-full text-center py-8">
              <p className="text-gray-500">No active deliveries at the moment</p>
            </div>
          ) : (
            activeDeliveries.map((delivery) => (
              <ActiveDeliveryCard key={delivery._id} delivery={delivery} />
            ))
          )}
        </div>
      </div>

      {/* Recent Delivery History */}
      <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-red-500/20 hover:border-red-500/30 transition-all">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">Recent Deliveries</h2>
          <button className="text-red-400 hover:text-red-300 text-sm font-medium">
            View History
          </button>
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
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {recentDeliveries.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-4 text-center text-gray-500">
                    No recent deliveries
                  </td>
                </tr>
              ) : (
                recentDeliveries.map((delivery) => (
                  <RecentDeliveryRow key={delivery._id} delivery={delivery} />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Quick Action Card Component
function QuickActionCard({ title, description, icon: Icon, gradient, onClick }) {
  return (
    <button
      onClick={onClick}
      className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-red-500/20 hover:border-red-500/30 transition-all group text-left hover:shadow-lg hover:shadow-red-500/10"
    >
      <div className={`w-14 h-14 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
        <Icon className="w-8 h-8 text-white" />
      </div>
      <h3 className="text-white font-semibold mb-1">{title}</h3>
      <p className="text-gray-400 text-sm">{description}</p>
    </button>
  );
}

// Stat Card Component
function StatCard({ title, value, icon: Icon, color, bgColor }) {
  return (
    <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-red-500/20 hover:border-red-500/30 transition-all group">
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 ${bgColor} backdrop-blur rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
        <div>
          <p className="text-gray-400 text-sm">{title}</p>
          <p className="text-2xl font-bold text-white">{value}</p>
        </div>
      </div>
    </div>
  );
}

// Active Delivery Card Component
function ActiveDeliveryCard({ delivery }) {
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
  const urgencyGradient = urgencyColors[delivery.urgency] || urgencyColors.routine;

  return (
    <div className="bg-gray-800/50 rounded-xl p-5 hover:bg-gray-800/70 transition-all">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-white font-semibold">{delivery.orderId}</h3>
          <p className="text-gray-400 text-sm">{delivery.type}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${urgencyGradient} text-white`}>
          {delivery.urgency}
        </span>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <LocationIcon className="w-4 h-4 text-gray-400" />
          <p className="text-gray-300 text-sm truncate">{delivery.destination}</p>
        </div>
        
        <div className="flex items-center gap-2">
          <StatusIcon className="w-4 h-4 text-red-400" />
          <p className="text-red-400 text-sm">{delivery.status.replace('_', ' ')}</p>
        </div>
        
        <div className="flex items-center gap-2">
          <TimeIcon className="w-4 h-4 text-gray-400" />
          <p className="text-gray-300 text-sm">ETA: {delivery.eta}</p>
        </div>
      </div>
      
      <button className="mt-4 w-full py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg transition-all text-sm font-medium">
        Track Delivery
      </button>
    </div>
  );
}

// Recent Delivery Row Component
function RecentDeliveryRow({ delivery }) {
  const statusColors = {
    delivered: 'text-green-400',
    failed: 'text-red-400',
    cancelled: 'text-gray-400'
  };

  const statusColor = statusColors[delivery.status] || 'text-gray-400';

  return (
    <tr className="hover:bg-gray-800/50 transition-colors">
      <td className="py-3">
        <span className="text-white font-medium">{delivery.orderId}</span>
      </td>
      <td className="py-3">
        <span className="text-gray-300">{delivery.type}</span>
      </td>
      <td className="py-3">
        <span className="text-gray-300">{delivery.recipient}</span>
      </td>
      <td className="py-3">
        <span className="text-gray-300">{delivery.deliveredAt}</span>
      </td>
      <td className="py-3">
        <span className="text-gray-300">{delivery.duration}</span>
      </td>
      <td className="py-3">
        <span className={`font-medium ${statusColor}`}>
          {delivery.status}
        </span>
      </td>
    </tr>
  );
}

// Icon Components
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
)
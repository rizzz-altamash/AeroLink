// // components/dashboard/CustomerDashboard.jsx
// 'use client';

// import { useState, useEffect } from 'react';
// import { useSession } from 'next-auth/react';
// import { useRouter } from 'next/navigation';

// export default function CustomerDashboard() {
//   const { data: session } = useSession();
//   const router = useRouter();
//   const [deliveries, setDeliveries] = useState([]);
//   const [activeDelivery, setActiveDelivery] = useState(null);
//   const [stats, setStats] = useState({
//     totalDeliveries: 0,
//     activeDeliveries: 0,
//     completedDeliveries: 0,
//     averageSatisfaction: 0
//   });

//   useEffect(() => {
//     fetchDeliveries();
//     fetchStats();
//   }, []);

//   const fetchDeliveries = async () => {
//     try {
//       const res = await fetch('/api/customer/deliveries');
//       const data = await res.json();
//       setDeliveries(data);
      
//       // Find active delivery if any
//       const active = data.find(d => ['pending', 'approved', 'assigned', 'pickup', 'in_transit'].includes(d.status));
//       setActiveDelivery(active);
//     } catch (error) {
//       console.error('Failed to fetch deliveries:', error);
//     }
//   };

//   const fetchStats = async () => {
//     try {
//       const res = await fetch('/api/customer/stats');
//       const data = await res.json();
//       setStats(data);
//     } catch (error) {
//       console.error('Failed to fetch stats:', error);
//     }
//   };

//   return (
//     <div className="p-8">
//       {/* Header */}
//       <div className="mb-8">
//         <h1 className="text-3xl font-bold text-white mb-2">Welcome back, {session?.user?.name}!</h1>
//         <p className="text-gray-400">Manage your drone deliveries and track packages in real-time</p>
//       </div>

//       {/* Quick Actions */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
//         <QuickActionCard
//           title="New Delivery"
//           description="Send a package via drone"
//           icon={NewDeliveryIcon}
//           gradient="from-blue-600 to-cyan-600"
//           onClick={() => router.push('/dashboard/new-delivery')}
//         />
//         <QuickActionCard
//           title="Track Package"
//           description="Real-time tracking"
//           icon={TrackIcon}
//           gradient="from-green-600 to-emerald-600"
//           onClick={() => router.push('/dashboard/track')}
//         />
//         <QuickActionCard
//           title="Delivery History"
//           description="View past deliveries"
//           icon={HistoryIcon}
//           gradient="from-purple-600 to-pink-600"
//           onClick={() => router.push('/dashboard/history')}
//         />
//         <QuickActionCard
//           title="Support"
//           description="Get help 24/7"
//           icon={SupportIcon}
//           gradient="from-orange-600 to-yellow-600"
//           onClick={() => router.push('/support')}
//         />
//       </div>

//       {/* Active Delivery Tracking */}
//       {activeDelivery && (
//         <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-6 mb-8 relative overflow-hidden">
//           <div className="absolute inset-0 bg-grid-white/10"></div>
//           <div className="relative z-10">
//             <div className="flex items-center justify-between mb-4">
//               <div>
//                 <h2 className="text-2xl font-bold text-white mb-1">Active Delivery</h2>
//                 <p className="text-blue-100">Order #{activeDelivery.orderId}</p>
//               </div>
//               <div className="text-right">
//                 <p className="text-sm text-blue-100">Estimated arrival</p>
//                 <p className="text-xl font-bold text-white">{activeDelivery.eta || '25 mins'}</p>
//               </div>
//             </div>
            
//             {/* Progress Bar */}
//             <div className="mb-6">
//               <div className="flex justify-between text-sm text-blue-100 mb-2">
//                 <span>Pickup</span>
//                 <span>In Transit</span>
//                 <span>Delivery</span>
//               </div>
//               <div className="w-full bg-blue-800/50 rounded-full h-3">
//                 <div className="bg-white h-3 rounded-full transition-all" style={{ width: '60%' }}></div>
//               </div>
//             </div>
            
//             {/* Delivery Details */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//               <div>
//                 <p className="text-blue-100 text-sm">Package Type</p>
//                 <p className="text-white font-medium">{activeDelivery.packageType || 'Standard Package'}</p>
//               </div>
//               <div>
//                 <p className="text-blue-100 text-sm">Drone ID</p>
//                 <p className="text-white font-medium">{activeDelivery.droneId || 'DRN-2024-001'}</p>
//               </div>
//             </div>
            
//             <button className="w-full md:w-auto px-6 py-3 bg-white text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition-all">
//               Track Live Location
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Stats Overview */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
//         <StatCard
//           title="Total Deliveries"
//           value={stats.totalDeliveries}
//           icon={PackageIcon}
//           trend="+12%"
//           trendUp={true}
//         />
//         <StatCard
//           title="Active Deliveries"
//           value={stats.activeDeliveries}
//           icon={ActiveIcon}
//         />
//         <StatCard
//           title="Completed"
//           value={stats.completedDeliveries}
//           icon={CompletedIcon}
//           trend="+8%"
//           trendUp={true}
//         />
//         <StatCard
//           title="Satisfaction"
//           value={`${stats.averageSatisfaction}★`}
//           icon={StarIcon}
//         />
//       </div>

//       {/* Recent Deliveries */}
//       <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-blue-500/10">
//         <div className="flex items-center justify-between mb-6">
//           <h2 className="text-xl font-semibold text-white">Recent Deliveries</h2>
//           <button 
//             onClick={() => router.push('/dashboard/history')}
//             className="text-blue-400 hover:text-blue-300 text-sm font-medium"
//           >
//             View All
//           </button>
//         </div>
        
//         {deliveries.length === 0 ? (
//           <div className="text-center py-12">
//             <DroneEmptyIcon className="w-24 h-24 text-gray-600 mx-auto mb-4" />
//             <p className="text-gray-400 mb-4">No deliveries yet</p>
//             <button 
//               onClick={() => router.push('/dashboard/new-delivery')}
//               className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-medium hover:shadow-lg transition-all"
//             >
//               Create Your First Delivery
//             </button>
//           </div>
//         ) : (
//           <div className="space-y-4">
//             {deliveries.slice(0, 5).map((delivery) => (
//               <DeliveryItem key={delivery._id} delivery={delivery} />
//             ))}
//           </div>
//         )}
//       </div>

//       {/* Promotional Banner */}
//       <div className="mt-8 bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-2xl p-6 border border-purple-500/20">
//         <div className="flex items-center justify-between">
//           <div>
//             <h3 className="text-xl font-bold text-white mb-2">Upgrade to Premium</h3>
//             <p className="text-gray-300">Get priority deliveries, 24/7 support, and exclusive discounts</p>
//           </div>
//           <button className="px-6 py-3 bg-white text-purple-600 rounded-xl font-semibold hover:bg-purple-50 transition-all">
//             Learn More
//           </button>
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
//       className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-blue-500/10 hover:border-blue-500/20 transition-all group text-left"
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
// function StatCard({ title, value, icon: Icon, trend, trendUp }) {
//   return (
//     <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-blue-500/10">
//       <div className="flex items-center justify-between mb-4">
//         <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
//           <Icon className="w-6 h-6 text-blue-400" />
//         </div>
//         {trend && (
//           <span className={`text-sm font-medium ${trendUp ? 'text-green-400' : 'text-red-400'}`}>
//             {trend}
//           </span>
//         )}
//       </div>
//       <h3 className="text-2xl font-bold text-white">{value}</h3>
//       <p className="text-gray-400 text-sm mt-1">{title}</p>
//     </div>
//   );
// }

// // Delivery Item Component
// function DeliveryItem({ delivery }) {
//   const statusColors = {
//     pending: 'text-yellow-400 bg-yellow-500/20',
//     approved: 'text-blue-400 bg-blue-500/20',
//     in_transit: 'text-purple-400 bg-purple-500/20',
//     delivered: 'text-green-400 bg-green-500/20',
//     failed: 'text-red-400 bg-red-500/20',
//     cancelled: 'text-gray-400 bg-gray-500/20'
//   };

//   const statusClass = statusColors[delivery.status] || 'text-gray-400 bg-gray-500/20';

//   return (
//     <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl hover:bg-gray-800/70 transition-all">
//       <div className="flex items-center gap-4">
//         <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center">
//           <PackageIcon className="w-6 h-6 text-blue-400" />
//         </div>
//         <div>
//           <p className="text-white font-medium">Order #{delivery.orderId}</p>
//           <p className="text-gray-400 text-sm">{delivery.recipient || 'Standard Delivery'}</p>
//         </div>
//       </div>
//       <div className="text-right">
//         <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusClass}`}>
//           {delivery.status.replace('_', ' ')}
//         </span>
//         <p className="text-gray-400 text-xs mt-1">{delivery.date || '2 days ago'}</p>
//       </div>
//     </div>
//   );
// }

// // Icon Components
// const NewDeliveryIcon = ({ className }) => (
//   <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
//   </svg>
// );

// const TrackIcon = ({ className }) => (
//   <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
//   </svg>
// );

// const HistoryIcon = ({ className }) => (
//   <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//   </svg>
// );

// const SupportIcon = ({ className }) => (
//   <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
//   </svg>
// );

// const PackageIcon = ({ className }) => (
//   <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
//   </svg>
// );

// const ActiveIcon = ({ className }) => (
//   <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
//   </svg>
// );

// const CompletedIcon = ({ className }) => (
//   <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//   </svg>
// );

// const StarIcon = ({ className }) => (
//   <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
//   </svg>
// );

// const DroneEmptyIcon = ({ className }) => (
//   <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
//   </svg>
// );


































// components/dashboard/CustomerDashboard.jsx
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import NotificationBell from '@/components/NotificationBell';

export default function CustomerDashboard() {
  const { data: session } = useSession();
  const router = useRouter();
  const [deliveries, setDeliveries] = useState([]);
  const [activeDelivery, setActiveDelivery] = useState(null);
  const [stats, setStats] = useState({
    totalDeliveries: 0,
    activeDeliveries: 0,
    completedDeliveries: 0,
    averageSatisfaction: 0
  });

  useEffect(() => {
    fetchDeliveries();
    fetchStats();
  }, []);

  const fetchDeliveries = async () => {
    try {
      const res = await fetch('/api/customer/deliveries');
      const data = await res.json();
      setDeliveries(data);
      
      // Find active delivery if any
      const active = data.find(d => ['pending', 'approved', 'assigned', 'pickup', 'in_transit'].includes(d.status));
      setActiveDelivery(active);
    } catch (error) {
      console.error('Failed to fetch deliveries:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/customer/stats');
      const data = await res.json();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2 flex justify-between">Welcome back, {session?.user?.name}! <NotificationBell /></h1>
        <p className="text-gray-400">Manage your drone deliveries and track packages in real-time</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <QuickActionCard
          title="New Delivery"
          description="Send a package via drone"
          icon={NewDeliveryIcon}
          gradient="from-blue-600 to-cyan-600"
          onClick={() => router.push('/dashboard/new-delivery')}
        />
        <QuickActionCard
          title="Track Package"
          description="Real-time tracking"
          icon={TrackIcon}
          gradient="from-green-600 to-emerald-600"
          onClick={() => router.push('/dashboard/track')}
        />
        <QuickActionCard
          title="Delivery History"
          description="View past deliveries"
          icon={HistoryIcon}
          gradient="from-purple-600 to-pink-600"
          onClick={() => router.push('/dashboard/history')}
        />
        <QuickActionCard
          title="Support"
          description="Get help 24/7"
          icon={SupportIcon}
          gradient="from-orange-600 to-yellow-600"
          onClick={() => router.push('/support')}
        />
      </div>

      {/* Active Delivery Tracking */}
      {activeDelivery && (
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-6 mb-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-white/10"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">Active Delivery</h2>
                <p className="text-blue-100">Order #{activeDelivery.orderId}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-blue-100">Estimated arrival</p>
                <p className="text-xl font-bold text-white">{activeDelivery.eta || '25 mins'}</p>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex justify-between text-sm text-blue-100 mb-2">
                <span>Pickup</span>
                <span>In Transit</span>
                <span>Delivery</span>
              </div>
              <div className="w-full bg-blue-800/50 rounded-full h-3">
                <div className="bg-white h-3 rounded-full transition-all" style={{ width: '60%' }}></div>
              </div>
            </div>
            
            {/* Delivery Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-blue-100 text-sm">Package Type</p>
                <p className="text-white font-medium">{activeDelivery.packageType || 'Standard Package'}</p>
              </div>
              <div>
                <p className="text-blue-100 text-sm">Drone ID</p>
                <p className="text-white font-medium">{activeDelivery.droneId || 'DRN-2024-001'}</p>
              </div>
            </div>
            
            <button className="w-full md:w-auto px-6 py-3 bg-white text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition-all">
              Track Live Location
            </button>
          </div>
        </div>
      )}

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Deliveries"
          value={stats.totalDeliveries}
          icon={PackageIcon}
          trend="+12%"
          trendUp={true}
        />
        <StatCard
          title="Active Deliveries"
          value={stats.activeDeliveries}
          icon={ActiveIcon}
        />
        <StatCard
          title="Completed"
          value={stats.completedDeliveries}
          icon={CompletedIcon}
          trend="+8%"
          trendUp={true}
        />
        <StatCard
          title="Satisfaction"
          value={`${stats.averageSatisfaction}★`}
          icon={StarIcon}
        />
      </div>

      {/* Recent Deliveries */}
      <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-blue-500/20 hover:border-blue-500/30 transition-all">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">Recent Deliveries</h2>
          <button 
            onClick={() => router.push('/dashboard/history')}
            className="text-blue-400 hover:text-blue-300 text-sm font-medium"
          >
            View All
          </button>
        </div>
        
        {deliveries.length === 0 ? (
          <div className="text-center py-12">
            <DroneEmptyIcon className="w-24 h-24 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 mb-4">No deliveries yet</p>
            <button 
              onClick={() => router.push('/dashboard/new-delivery')}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-blue-500/25 transition-all"
            >
              Create Your First Delivery
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {deliveries.slice(0, 5).map((delivery) => (
              <DeliveryItem key={delivery._id} delivery={delivery} />
            ))}
          </div>
        )}
      </div>

      {/* Promotional Banner */}
      <div className="mt-8 bg-gradient-to-r from-purple-900/50 to-pink-900/50 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/20 hover:border-purple-500/30 transition-all">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-white mb-2">Upgrade to Premium</h3>
            <p className="text-gray-300">Get priority deliveries, 24/7 support, and exclusive discounts</p>
          </div>
          <button className="px-6 py-3 bg-white text-purple-600 rounded-xl font-semibold hover:bg-purple-50 transition-all shadow-lg">
            Learn More
          </button>
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
      className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-blue-500/20 hover:border-blue-500/30 transition-all group text-left hover:shadow-lg hover:shadow-blue-500/10"
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
function StatCard({ title, value, icon: Icon, trend, trendUp }) {
  return (
    <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-blue-500/20 hover:border-blue-500/30 transition-all group">
      <div className="flex items-center justify-between mb-4">
        <div className="w-12 h-12 bg-blue-500/20 backdrop-blur rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
          <Icon className="w-6 h-6 text-blue-400" />
        </div>
        {trend && (
          <span className={`text-sm font-medium ${trendUp ? 'text-green-400' : 'text-red-400'}`}>
            {trend}
          </span>
        )}
      </div>
      <h3 className="text-2xl font-bold text-white">{value}</h3>
      <p className="text-gray-400 text-sm mt-1">{title}</p>
    </div>
  );
}

// Delivery Item Component
function DeliveryItem({ delivery }) {
  const statusColors = {
    pending: 'text-yellow-400 bg-yellow-500/20',
    approved: 'text-blue-400 bg-blue-500/20',
    in_transit: 'text-purple-400 bg-purple-500/20',
    delivered: 'text-green-400 bg-green-500/20',
    failed: 'text-red-400 bg-red-500/20',
    cancelled: 'text-gray-400 bg-gray-500/20'
  };

  const statusClass = statusColors[delivery.status] || 'text-gray-400 bg-gray-500/20';

  return (
    <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl hover:bg-gray-800/70 transition-all">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center">
          <PackageIcon className="w-6 h-6 text-blue-400" />
        </div>
        <div>
          <p className="text-white font-medium">Order #{delivery.orderId}</p>
          <p className="text-gray-400 text-sm">{delivery.recipient || 'Standard Delivery'}</p>
        </div>
      </div>
      <div className="text-right">
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusClass}`}>
          {delivery.status.replace('_', ' ')}
        </span>
        <p className="text-gray-400 text-xs mt-1">{delivery.date || '2 days ago'}</p>
      </div>
    </div>
  );
}

// Icon Components
const NewDeliveryIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
  </svg>
);

const TrackIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const HistoryIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const SupportIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const PackageIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
  </svg>
);

const ActiveIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

const CompletedIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const StarIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
  </svg>
);

const DroneEmptyIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
  </svg>
)
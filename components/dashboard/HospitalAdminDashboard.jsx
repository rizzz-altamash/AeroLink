// // components/dashboard/HospitalAdminDashboard.jsx
// 'use client';

// import { useState, useEffect } from 'react';
// import { useSession } from 'next-auth/react';

// export default function HospitalAdminDashboard() {
//   const { data: session } = useSession();
//   const [hospitalStats, setHospitalStats] = useState({
//     totalDeliveries: 0,
//     activeDeliveries: 0,
//     completedToday: 0,
//     averageDeliveryTime: 0,
//     totalStaff: 0,
//     activeStaff: 0,
//     pendingRequests: 0,
//     monthlyBill: 0
//   });

//   const [recentDeliveries, setRecentDeliveries] = useState([]);
//   const [staffActivity, setStaffActivity] = useState([]);

//   useEffect(() => {
//     fetchHospitalStats();
//     fetchRecentDeliveries();
//     fetchStaffActivity();
//   }, []);

//   const fetchHospitalStats = async () => {
//     try {
//       const res = await fetch('/api/hospital/stats');
//       const data = await res.json();
//       setHospitalStats(data);
//     } catch (error) {
//       console.error('Failed to fetch hospital stats:', error);
//     }
//   };

//   const fetchRecentDeliveries = async () => {
//     try {
//       const res = await fetch('/api/hospital/deliveries/recent');
//       const data = await res.json();
//       setRecentDeliveries(data);
//     } catch (error) {
//       console.error('Failed to fetch deliveries:', error);
//     }
//   };

//   const fetchStaffActivity = async () => {
//     try {
//       const res = await fetch('/api/hospital/staff/activity');
//       const data = await res.json();
//       setStaffActivity(data);
//     } catch (error) {
//       console.error('Failed to fetch staff activity:', error);
//     }
//   };

//   return (
//     <div className="p-8">
//       {/* Header */}
//       <div className="mb-8">
//         <h1 className="text-3xl font-bold text-white mb-2">Hospital Dashboard</h1>
//         <p className="text-gray-400">Manage deliveries and staff for your hospital</p>
//       </div>

//       {/* Hospital Info Banner */}
//       <div className="bg-gradient-to-r from-red-600 to-rose-600 rounded-2xl p-6 mb-8">
//         <div className="flex items-center justify-between">
//           <div>
//             <h2 className="text-2xl font-bold text-white mb-1">{session?.user?.hospitalName || 'City General Hospital'}</h2>
//             <p className="text-red-100">Registration: #HOS2024001</p>
//           </div>
//           <div className="text-right">
//             <p className="text-sm text-red-100">Subscription Plan</p>
//             <p className="text-xl font-bold text-white">Premium</p>
//           </div>
//         </div>
//       </div>

//       {/* Stats Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//         <StatCard
//           title="Active Deliveries"
//           value={hospitalStats.activeDeliveries}
//           subtitle="In progress"
//           icon={ActiveIcon}
//           gradient="from-green-600 to-emerald-600"
//           change="+12%"
//         />
//         <StatCard
//           title="Completed Today"
//           value={hospitalStats.completedToday}
//           subtitle="Deliveries"
//           icon={CheckIcon}
//           gradient="from-blue-600 to-cyan-600"
//           change="+8%"
//         />
//         <StatCard
//           title="Avg. Delivery Time"
//           value={`${hospitalStats.averageDeliveryTime} min`}
//           subtitle="This month"
//           icon={TimeIcon}
//           gradient="from-purple-600 to-pink-600"
//           change="-5%"
//         />
//         <StatCard
//           title="Active Staff"
//           value={`${hospitalStats.activeStaff}/${hospitalStats.totalStaff}`}
//           subtitle="On duty"
//           icon={UsersIcon}
//           gradient="from-orange-600 to-yellow-600"
//         />
//       </div>

//       {/* Main Content Grid */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
//         {/* Recent Deliveries - Takes 2 columns */}
//         <div className="lg:col-span-2 bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-red-500/10">
//           <div className="flex items-center justify-between mb-4">
//             <h2 className="text-xl font-semibold text-white">Recent Deliveries</h2>
//             <button className="text-red-400 hover:text-red-300 text-sm font-medium">View All</button>
//           </div>
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead>
//                 <tr className="text-left border-b border-gray-800">
//                   <th className="pb-3 text-sm font-medium text-gray-400">Order ID</th>
//                   <th className="pb-3 text-sm font-medium text-gray-400">Type</th>
//                   <th className="pb-3 text-sm font-medium text-gray-400">Recipient</th>
//                   <th className="pb-3 text-sm font-medium text-gray-400">Status</th>
//                   <th className="pb-3 text-sm font-medium text-gray-400">ETA</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-800">
//                 {recentDeliveries.length === 0 ? (
//                   <tr>
//                     <td colSpan="5" className="py-4 text-center text-gray-500">No recent deliveries</td>
//                   </tr>
//                 ) : (
//                   recentDeliveries.map((delivery) => (
//                     <DeliveryRow key={delivery._id} delivery={delivery} />
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {/* Staff Activity */}
//         <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-red-500/10">
//           <h2 className="text-xl font-semibold text-white mb-4">Staff Activity</h2>
//           <div className="space-y-4">
//             {staffActivity.length === 0 ? (
//               <p className="text-gray-500">No recent activity</p>
//             ) : (
//               staffActivity.map((activity, index) => (
//                 <StaffActivityItem key={index} activity={activity} />
//               ))
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Delivery Types Chart and Quick Actions */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* Delivery Types Distribution */}
//         <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-red-500/10">
//           <h2 className="text-xl font-semibold text-white mb-4">Delivery Types</h2>
//           <div className="space-y-4">
//             <DeliveryTypeBar type="Medications" percentage={45} color="bg-blue-500" />
//             <DeliveryTypeBar type="Blood Samples" percentage={25} color="bg-red-500" />
//             <DeliveryTypeBar type="Medical Supplies" percentage={20} color="bg-green-500" />
//             <DeliveryTypeBar type="Documents" percentage={10} color="bg-purple-500" />
//           </div>
//         </div>

//         {/* Quick Actions */}
//         <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-red-500/10">
//           <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
//           <div className="grid grid-cols-2 gap-4">
//             <QuickActionButton
//               title="New Delivery"
//               icon={PlusIcon}
//               gradient="from-red-600 to-rose-600"
//               onClick={() => {}}
//             />
//             <QuickActionButton
//               title="Add Staff"
//               icon={UserPlusIcon}
//               gradient="from-red-600 to-rose-600"
//               onClick={() => {}}
//             />
//             <QuickActionButton
//               title="Inventory"
//               icon={InventoryIcon}
//               gradient="from-red-600 to-rose-600"
//               onClick={() => {}}
//             />
//             <QuickActionButton
//               title="Reports"
//               icon={ReportIcon}
//               gradient="from-red-600 to-rose-600"
//               onClick={() => {}}
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// // Stat Card Component
// function StatCard({ title, value, subtitle, icon: Icon, gradient, change }) {
//   const isPositive = change && change.startsWith('+');
  
//   return (
//     <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-red-500/10">
//       <div className="flex items-center justify-between mb-4">
//         <div className={`w-12 h-12 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center`}>
//           <Icon className="w-6 h-6 text-white" />
//         </div>
//         {change && (
//           <span className={`text-sm font-medium ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
//             {change}
//           </span>
//         )}
//       </div>
//       <h3 className="text-2xl font-bold text-white">{value}</h3>
//       <p className="text-gray-400 text-sm mt-1">{title}</p>
//       <p className="text-gray-500 text-xs mt-1">{subtitle}</p>
//     </div>
//   );
// }

// // Delivery Row Component
// function DeliveryRow({ delivery }) {
//   const statusColors = {
//     pending: 'text-yellow-400 bg-yellow-500/20',
//     in_transit: 'text-blue-400 bg-blue-500/20',
//     delivered: 'text-green-400 bg-green-500/20',
//     failed: 'text-red-400 bg-red-500/20'
//   };

//   const statusClass = statusColors[delivery.status] || 'text-gray-400 bg-gray-500/20';

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
//         <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClass}`}>
//           {delivery.status}
//         </span>
//       </td>
//       <td className="py-3">
//         <span className="text-gray-300">{delivery.eta}</span>
//       </td>
//     </tr>
//   );
// }

// // Staff Activity Item Component
// function StaffActivityItem({ activity }) {
//   return (
//     <div className="flex items-start gap-3">
//       <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0">
//         <UserIcon className="w-4 h-4 text-red-400" />
//       </div>
//       <div className="flex-1">
//         <p className="text-white text-sm">{activity.staffName}</p>
//         <p className="text-gray-400 text-xs">{activity.action}</p>
//         <p className="text-gray-500 text-xs mt-1">{activity.time}</p>
//       </div>
//     </div>
//   );
// }

// // Delivery Type Bar Component
// function DeliveryTypeBar({ type, percentage, color }) {
//   return (
//     <div>
//       <div className="flex justify-between mb-1">
//         <span className="text-sm text-gray-300">{type}</span>
//         <span className="text-sm text-gray-400">{percentage}%</span>
//       </div>
//       <div className="w-full bg-gray-800 rounded-full h-2">
//         <div className={`${color} h-2 rounded-full transition-all`} style={{ width: `${percentage}%` }}></div>
//       </div>
//     </div>
//   );
// }

// // Quick Action Button Component
// function QuickActionButton({ title, icon: Icon, gradient, onClick }) {
//   return (
//     <button
//       onClick={onClick}
//       className="bg-gray-800/50 hover:bg-gray-700/50 rounded-xl p-4 transition-all group"
//     >
//       <div className={`w-10 h-10 bg-gradient-to-br ${gradient} rounded-lg flex items-center justify-center mb-2 group-hover:scale-110 transition-transform`}>
//         <Icon className="w-5 h-5 text-white" />
//       </div>
//       <p className="text-white text-sm font-medium">{title}</p>
//     </button>
//   );
// }

// // Icon Components
// const ActiveIcon = ({ className }) => (
//   <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
//   </svg>
// );

// const CheckIcon = ({ className }) => (
//   <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//   </svg>
// );

// const TimeIcon = ({ className }) => (
//   <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//   </svg>
// );

// const UsersIcon = ({ className }) => (
//   <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
//   </svg>
// );

// const UserIcon = ({ className }) => (
//   <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//   </svg>
// );

// const PlusIcon = ({ className }) => (
//   <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
//   </svg>
// );

// const UserPlusIcon = ({ className }) => (
//   <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
//   </svg>
// );

// const InventoryIcon = ({ className }) => (
//   <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
//   </svg>
// );

// const ReportIcon = ({ className }) => (
//   <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//   </svg>
// );






























// components/dashboard/HospitalAdminDashboard.jsx
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

export default function HospitalAdminDashboard() {
  const { data: session } = useSession();
  const [hospitalStats, setHospitalStats] = useState({
    totalDeliveries: 0,
    activeDeliveries: 0,
    completedToday: 0,
    averageDeliveryTime: 0,
    totalStaff: 0,
    activeStaff: 0,
    pendingRequests: 0,
    monthlyBill: 0
  });

  const [recentDeliveries, setRecentDeliveries] = useState([]);
  const [staffActivity, setStaffActivity] = useState([]);

  useEffect(() => {
    fetchHospitalStats();
    fetchRecentDeliveries();
    fetchStaffActivity();
  }, []);

  const fetchHospitalStats = async () => {
    try {
      const res = await fetch('/api/hospital/stats');
      const data = await res.json();
      setHospitalStats(data);
    } catch (error) {
      console.error('Failed to fetch hospital stats:', error);
    }
  };

  const fetchRecentDeliveries = async () => {
    try {
      const res = await fetch('/api/hospital/deliveries/recent');
      const data = await res.json();
      setRecentDeliveries(data);
    } catch (error) {
      console.error('Failed to fetch deliveries:', error);
    }
  };

  const fetchStaffActivity = async () => {
    try {
      const res = await fetch('/api/hospital/staff/activity');
      const data = await res.json();
      setStaffActivity(data);
    } catch (error) {
      console.error('Failed to fetch staff activity:', error);
    }
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Hospital Dashboard</h1>
        <p className="text-gray-400">Manage deliveries and staff for your hospital</p>
      </div>

      {/* Hospital Info Banner */}
      <div className="bg-gradient-to-r from-red-600/10 to-yellow-600/20 rounded-2xl p-6 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">{session?.user?.hospitalName || 'City General Hospital'}</h2>
            <p className="text-red-100">Registration: #HOS2024001</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-red-100">Subscription Plan</p>
            <p className="text-xl font-bold text-white">Premium</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Active Deliveries"
          value={hospitalStats.activeDeliveries}
          subtitle="In progress"
          icon={ActiveIcon}
          gradient="from-green-600 to-emerald-600"
          change="+12%"
        />
        <StatCard
          title="Completed Today"
          value={hospitalStats.completedToday}
          subtitle="Deliveries"
          icon={CheckIcon}
          gradient="from-blue-600 to-cyan-600"
          change="+8%"
        />
        <StatCard
          title="Avg. Delivery Time"
          value={`${hospitalStats.averageDeliveryTime} min`}
          subtitle="This month"
          icon={TimeIcon}
          gradient="from-purple-600 to-pink-600"
          change="-5%"
        />
        <StatCard
          title="Active Staff"
          value={`${hospitalStats.activeStaff}/${hospitalStats.totalStaff}`}
          subtitle="On duty"
          icon={UsersIcon}
          gradient="from-orange-600 to-yellow-600"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Recent Deliveries - Takes 2 columns */}
        <div className="lg:col-span-2 bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-red-500/20 hover:border-red-500/30 transition-all">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">Recent Deliveries</h2>
            <button className="text-red-400 hover:text-red-300 text-sm font-medium">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-gray-800">
                  <th className="pb-3 text-sm font-medium text-gray-400">Order ID</th>
                  <th className="pb-3 text-sm font-medium text-gray-400">Type</th>
                  <th className="pb-3 text-sm font-medium text-gray-400">Recipient</th>
                  <th className="pb-3 text-sm font-medium text-gray-400">Status</th>
                  <th className="pb-3 text-sm font-medium text-gray-400">ETA</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {recentDeliveries.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="py-4 text-center text-gray-500">No recent deliveries</td>
                  </tr>
                ) : (
                  recentDeliveries.map((delivery) => (
                    <DeliveryRow key={delivery._id} delivery={delivery} />
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Staff Activity */}
        <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-red-500/20 hover:border-red-500/30 transition-all">
          <h2 className="text-xl font-semibold text-white mb-4">Staff Activity</h2>
          <div className="space-y-4">
            {staffActivity.length === 0 ? (
              <p className="text-gray-500">No recent activity</p>
            ) : (
              staffActivity.map((activity, index) => (
                <StaffActivityItem key={index} activity={activity} />
              ))
            )}
          </div>
        </div>
      </div>

      {/* Delivery Types Chart and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Delivery Types Distribution */}
        <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-red-500/20 hover:border-red-500/30 transition-all">
          <h2 className="text-xl font-semibold text-white mb-4">Delivery Types</h2>
          <div className="space-y-4">
            <DeliveryTypeBar type="Medications" percentage={45} color="bg-blue-500" />
            <DeliveryTypeBar type="Blood Samples" percentage={25} color="bg-red-500" />
            <DeliveryTypeBar type="Medical Supplies" percentage={20} color="bg-green-500" />
            <DeliveryTypeBar type="Documents" percentage={10} color="bg-purple-500" />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-red-500/20 hover:border-red-500/30 transition-all">
          <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <QuickActionButton
              title="New Delivery"
              icon={PlusIcon}
              gradient="from-red-600 to-rose-600"
              onClick={() => {}}
            />
            <QuickActionButton
              title="Add Staff"
              icon={UserPlusIcon}
              gradient="from-red-600 to-rose-600"
              onClick={() => {}}
            />
            <QuickActionButton
              title="Inventory"
              icon={InventoryIcon}
              gradient="from-red-600 to-rose-600"
              onClick={() => {}}
            />
            <QuickActionButton
              title="Reports"
              icon={ReportIcon}
              gradient="from-red-600 to-rose-600"
              onClick={() => {}}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// Stat Card Component
function StatCard({ title, value, subtitle, icon: Icon, gradient, change }) {
  const isPositive = change && change.startsWith('+');
  
  return (
    <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-red-500/20 hover:border-red-500/30 transition-all group">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {change && (
          <span className={`text-sm font-medium ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
            {change}
          </span>
        )}
      </div>
      <h3 className="text-2xl font-bold text-white">{value}</h3>
      <p className="text-gray-400 text-sm mt-1">{title}</p>
      <p className="text-gray-500 text-xs mt-1">{subtitle}</p>
    </div>
  );
}

// Delivery Row Component
function DeliveryRow({ delivery }) {
  const statusColors = {
    pending: 'text-yellow-400 bg-yellow-500/20',
    in_transit: 'text-blue-400 bg-blue-500/20',
    delivered: 'text-green-400 bg-green-500/20',
    failed: 'text-red-400 bg-red-500/20'
  };

  const statusClass = statusColors[delivery.status] || 'text-gray-400 bg-gray-500/20';

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
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClass}`}>
          {delivery.status}
        </span>
      </td>
      <td className="py-3">
        <span className="text-gray-300">{delivery.eta}</span>
      </td>
    </tr>
  );
}

// Staff Activity Item Component
function StaffActivityItem({ activity }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0">
        <UserIcon className="w-4 h-4 text-red-400" />
      </div>
      <div className="flex-1">
        <p className="text-white text-sm">{activity.staffName}</p>
        <p className="text-gray-400 text-xs">{activity.action}</p>
        <p className="text-gray-500 text-xs mt-1">{activity.time}</p>
      </div>
    </div>
  );
}

// Delivery Type Bar Component
function DeliveryTypeBar({ type, percentage, color }) {
  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className="text-sm text-gray-300">{type}</span>
        <span className="text-sm text-gray-400">{percentage}%</span>
      </div>
      <div className="w-full bg-gray-800 rounded-full h-2">
        <div className={`${color} h-2 rounded-full transition-all`} style={{ width: `${percentage}%` }}></div>
      </div>
    </div>
  );
}

// Quick Action Button Component
function QuickActionButton({ title, icon: Icon, gradient, onClick }) {
  return (
    <button
      onClick={onClick}
      className="bg-gray-800/50 backdrop-blur hover:bg-gray-700/50 rounded-xl p-4 transition-all group border border-red-500/10 hover:border-red-500/20"
    >
      <div className={`w-10 h-10 bg-gradient-to-br ${gradient} rounded-lg flex items-center justify-center mb-2 group-hover:scale-110 transition-transform shadow-lg`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <p className="text-white text-sm font-medium">{title}</p>
    </button>
  );
}

// Icon Components
const ActiveIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

const CheckIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const TimeIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const UsersIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const UserIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const PlusIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
  </svg>
);

const UserPlusIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
  </svg>
);

const InventoryIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
  </svg>
);

const ReportIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
)
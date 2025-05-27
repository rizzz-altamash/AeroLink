// // components/dashboard/AdminDashboard.jsx
// 'use client';

// import { useState, useEffect } from 'react';
// import { useSession } from 'next-auth/react';

// export default function AdminDashboard() {
//   const { data: session } = useSession();
//   const [stats, setStats] = useState({
//     totalDeliveries: 0,
//     activeDeliveries: 0,
//     totalDrones: 0,
//     activeDrones: 0,
//     totalHospitals: 0,
//     verifiedHospitals: 0,
//     totalUsers: 0,
//     revenue: 0
//   });

//   const [recentActivity, setRecentActivity] = useState([]);
//   const [droneStatus, setDroneStatus] = useState([]);

//   useEffect(() => {
//     // Fetch dashboard data
//     fetchDashboardStats();
//     fetchRecentActivity();
//     fetchDroneStatus();
//   }, []);

//   const fetchDashboardStats = async () => {
//     try {
//       const res = await fetch('/api/admin/stats');
//       const data = await res.json();
//       setStats(data);
//     } catch (error) {
//       console.error('Failed to fetch stats:', error);
//     }
//   };

//   const fetchRecentActivity = async () => {
//     try {
//       const res = await fetch('/api/admin/activity');
//       const data = await res.json();
//       setRecentActivity(data);
//     } catch (error) {
//       console.error('Failed to fetch activity:', error);
//     }
//   };

//   const fetchDroneStatus = async () => {
//     try {
//       const res = await fetch('/api/admin/drones/status');
//       const data = await res.json();
//       setDroneStatus(data);
//     } catch (error) {
//       console.error('Failed to fetch drone status:', error);
//     }
//   };

//   return (
//     <div className="p-8">
//       {/* Header */}
//       <div className="mb-8">
//         <h1 className="text-3xl font-bold text-white mb-2">System Overview</h1>
//         <p className="text-gray-400">Welcome back, {session?.user?.name}</p>
//       </div>

//       {/* Stats Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//         <StatCard
//           title="Total Deliveries"
//           value={stats.totalDeliveries}
//           subtitle="All time"
//           icon={DeliveryIcon}
//           gradient="from-purple-600 to-indigo-600"
//         />
//         <StatCard
//           title="Active Deliveries"
//           value={stats.activeDeliveries}
//           subtitle="In progress"
//           icon={ActiveDeliveryIcon}
//           gradient="from-green-600 to-emerald-600"
//         />
//         <StatCard
//           title="Drone Fleet"
//           value={`${stats.activeDrones}/${stats.totalDrones}`}
//           subtitle="Active / Total"
//           icon={DroneIcon}
//           gradient="from-blue-600 to-cyan-600"
//         />
//         <StatCard
//           title="Hospitals"
//           value={`${stats.verifiedHospitals}/${stats.totalHospitals}`}
//           subtitle="Verified / Total"
//           icon={HospitalIcon}
//           gradient="from-red-600 to-rose-600"
//         />
//       </div>

//       {/* Charts and Activity */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
//         {/* Delivery Trends Chart */}
//         <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/10">
//           <h2 className="text-xl font-semibold text-white mb-4">Delivery Trends</h2>
//           <div className="h-64 flex items-center justify-center text-gray-500">
//             {/* Chart placeholder - integrate with a charting library */}
//             <p>Delivery trends chart</p>
//           </div>
//         </div>

//         {/* Revenue Chart */}
//         <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/10">
//           <h2 className="text-xl font-semibold text-white mb-4">Revenue Overview</h2>
//           <div className="h-64 flex items-center justify-center text-gray-500">
//             {/* Chart placeholder */}
//             <p>Revenue chart</p>
//           </div>
//         </div>
//       </div>

//       {/* Recent Activity and Drone Status */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* Recent Activity */}
//         <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/10">
//           <h2 className="text-xl font-semibold text-white mb-4">Recent Activity</h2>
//           <div className="space-y-4">
//             {recentActivity.length === 0 ? (
//               <p className="text-gray-500">No recent activity</p>
//             ) : (
//               recentActivity.map((activity, index) => (
//                 <ActivityItem key={index} activity={activity} />
//               ))
//             )}
//           </div>
//         </div>

//         {/* Drone Fleet Status */}
//         <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/10">
//           <h2 className="text-xl font-semibold text-white mb-4">Drone Fleet Status</h2>
//           <div className="space-y-4">
//             {droneStatus.length === 0 ? (
//               <p className="text-gray-500">No drones available</p>
//             ) : (
//               droneStatus.map((drone) => (
//                 <DroneStatusItem key={drone._id} drone={drone} />
//               ))
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Quick Actions */}
//       <div className="mt-8">
//         <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           <QuickActionCard
//             title="Add New Drone"
//             description="Register a new drone to the fleet"
//             icon={PlusIcon}
//             href="/dashboard/drones/new"
//             gradient="from-purple-600 to-indigo-600"
//           />
//           <QuickActionCard
//             title="Verify Hospital"
//             description="Review pending hospital verifications"
//             icon={CheckIcon}
//             href="/dashboard/hospitals/verify"
//             gradient="from-purple-600 to-indigo-600"
//           />
//           <QuickActionCard
//             title="System Settings"
//             description="Configure system parameters"
//             icon={SettingsIcon}
//             href="/dashboard/settings"
//             gradient="from-purple-600 to-indigo-600"
//           />
//         </div>
//       </div>
//     </div>
//   );
// }

// // Stat Card Component
// function StatCard({ title, value, subtitle, icon: Icon, gradient }) {
//   return (
//     <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/10">
//       <div className="flex items-center justify-between mb-4">
//         <div className={`w-12 h-12 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center`}>
//           <Icon className="w-6 h-6 text-white" />
//         </div>
//         <span className="text-sm text-gray-500">{subtitle}</span>
//       </div>
//       <h3 className="text-2xl font-bold text-white">{value}</h3>
//       <p className="text-gray-400 text-sm mt-1">{title}</p>
//     </div>
//   );
// }

// // Activity Item Component
// function ActivityItem({ activity }) {
//   return (
//     <div className="flex items-start gap-3">
//       <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
//         <ActivityIcon className="w-4 h-4 text-purple-400" />
//       </div>
//       <div className="flex-1">
//         <p className="text-white text-sm">{activity.description}</p>
//         <p className="text-gray-500 text-xs mt-1">{activity.timestamp}</p>
//       </div>
//     </div>
//   );
// }

// // Drone Status Item Component
// function DroneStatusItem({ drone }) {
//   const statusColors = {
//     available: 'text-green-400 bg-green-500/20',
//     in_flight: 'text-blue-400 bg-blue-500/20',
//     maintenance: 'text-yellow-400 bg-yellow-500/20',
//     charging: 'text-orange-400 bg-orange-500/20',
//     offline: 'text-red-400 bg-red-500/20'
//   };

//   const statusClass = statusColors[drone.status] || 'text-gray-400 bg-gray-500/20';

//   return (
//     <div className="flex items-center justify-between">
//       <div className="flex items-center gap-3">
//         <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
//           <DroneIcon className="w-6 h-6 text-purple-400" />
//         </div>
//         <div>
//           <p className="text-white font-medium">{drone.registrationId}</p>
//           <p className="text-gray-500 text-sm">{drone.model}</p>
//         </div>
//       </div>
//       <div className="flex items-center gap-2">
//         <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusClass}`}>
//           {drone.status.replace('_', ' ')}
//         </span>
//         <span className="text-gray-400 text-sm">{drone.health.batteryLevel}%</span>
//       </div>
//     </div>
//   );
// }

// // Quick Action Card Component
// function QuickActionCard({ title, description, icon: Icon, href, gradient }) {
//   return (
//     <a
//       href={href}
//       className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/10 hover:border-purple-500/20 transition-all group"
//     >
//       <div className={`w-12 h-12 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
//         <Icon className="w-6 h-6 text-white" />
//       </div>
//       <h3 className="text-white font-semibold mb-1">{title}</h3>
//       <p className="text-gray-400 text-sm">{description}</p>
//     </a>
//   );
// }

// // Icon Components
// const DeliveryIcon = ({ className }) => (
//   <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
//   </svg>
// );

// const ActiveDeliveryIcon = ({ className }) => (
//   <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
//   </svg>
// );

// const DroneIcon = ({ className }) => (
//   <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
//   </svg>
// );

// const HospitalIcon = ({ className }) => (
//   <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
//   </svg>
// );

// const ActivityIcon = ({ className }) => (
//   <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//   </svg>
// );

// const PlusIcon = ({ className }) => (
//   <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
//   </svg>
// );

// const CheckIcon = ({ className }) => (
//   <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//   </svg>
// );

// const SettingsIcon = ({ className }) => (
//   <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//   </svg>
// );


























// components/dashboard/AdminDashboard.jsx
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

export default function AdminDashboard() {
  const { data: session } = useSession();
  const [stats, setStats] = useState({
    totalDeliveries: 0,
    activeDeliveries: 0,
    totalDrones: 0,
    activeDrones: 0,
    totalHospitals: 0,
    verifiedHospitals: 0,
    totalUsers: 0,
    revenue: 0
  });

  const [recentActivity, setRecentActivity] = useState([]);
  const [droneStatus, setDroneStatus] = useState([]);

  useEffect(() => {
    // Fetch dashboard data
    fetchDashboardStats();
    fetchRecentActivity();
    fetchDroneStatus();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const res = await fetch('/api/admin/stats');
      const data = await res.json();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const fetchRecentActivity = async () => {
    try {
      const res = await fetch('/api/admin/activity');
      const data = await res.json();
      setRecentActivity(data);
    } catch (error) {
      console.error('Failed to fetch activity:', error);
    }
  };

  const fetchDroneStatus = async () => {
    try {
      const res = await fetch('/api/admin/drones/status');
      const data = await res.json();
      setDroneStatus(data);
    } catch (error) {
      console.error('Failed to fetch drone status:', error);
    }
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">System Overview</h1>
        <p className="text-gray-400">Welcome back, {session?.user?.name}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Deliveries"
          value={stats.totalDeliveries}
          subtitle="All time"
          icon={DeliveryIcon}
          gradient="from-purple-600 to-indigo-600"
        />
        <StatCard
          title="Active Deliveries"
          value={stats.activeDeliveries}
          subtitle="In progress"
          icon={ActiveDeliveryIcon}
          gradient="from-green-600 to-emerald-600"
        />
        <StatCard
          title="Drone Fleet"
          value={`${stats.activeDrones}/${stats.totalDrones}`}
          subtitle="Active / Total"
          icon={DroneIcon}
          gradient="from-blue-600 to-cyan-600"
        />
        <StatCard
          title="Hospitals"
          value={`${stats.verifiedHospitals}/${stats.totalHospitals}`}
          subtitle="Verified / Total"
          icon={HospitalIcon}
          gradient="from-red-600 to-rose-600"
        />
      </div>

      {/* Charts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Delivery Trends Chart */}
        <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/20 hover:border-purple-500/30 transition-all">
          <h2 className="text-xl font-semibold text-white mb-4">Delivery Trends</h2>
          <div className="h-64 flex items-center justify-center text-gray-500">
            {/* Chart placeholder - integrate with a charting library */}
            <p>Delivery trends chart</p>
          </div>
        </div>

        {/* Revenue Chart */}
        <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/20 hover:border-purple-500/30 transition-all">
          <h2 className="text-xl font-semibold text-white mb-4">Revenue Overview</h2>
          <div className="h-64 flex items-center justify-center text-gray-500">
            {/* Chart placeholder */}
            <p>Revenue chart</p>
          </div>
        </div>
      </div>

      {/* Recent Activity and Drone Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/20 hover:border-purple-500/30 transition-all">
          <h2 className="text-xl font-semibold text-white mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivity.length === 0 ? (
              <p className="text-gray-500">No recent activity</p>
            ) : (
              recentActivity.map((activity, index) => (
                <ActivityItem key={index} activity={activity} />
              ))
            )}
          </div>
        </div>

        {/* Drone Fleet Status */}
        <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/20 hover:border-purple-500/30 transition-all">
          <h2 className="text-xl font-semibold text-white mb-4">Drone Fleet Status</h2>
          <div className="space-y-4">
            {droneStatus.length === 0 ? (
              <p className="text-gray-500">No drones available</p>
            ) : (
              droneStatus.map((drone) => (
                <DroneStatusItem key={drone._id} drone={drone} />
              ))
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <QuickActionCard
            title="Add New Drone"
            description="Register a new drone to the fleet"
            icon={PlusIcon}
            href="/dashboard/drones/new"
            gradient="from-purple-600 to-indigo-600"
          />
          <QuickActionCard
            title="Verify Hospital"
            description="Review pending hospital verifications"
            icon={CheckIcon}
            href="/dashboard/hospitals/verify"
            gradient="from-purple-600 to-indigo-600"
          />
          <QuickActionCard
            title="System Settings"
            description="Configure system parameters"
            icon={SettingsIcon}
            href="/dashboard/settings"
            gradient="from-purple-600 to-indigo-600"
          />
        </div>
      </div>
    </div>
  );
}

// Stat Card Component
function StatCard({ title, value, subtitle, icon: Icon, gradient }) {
  return (
    <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/20 hover:border-purple-500/30 transition-all group">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <span className="text-sm text-gray-500">{subtitle}</span>
      </div>
      <h3 className="text-2xl font-bold text-white">{value}</h3>
      <p className="text-gray-400 text-sm mt-1">{title}</p>
    </div>
  );
}

// Activity Item Component
function ActivityItem({ activity }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
        <ActivityIcon className="w-4 h-4 text-purple-400" />
      </div>
      <div className="flex-1">
        <p className="text-white text-sm">{activity.description}</p>
        <p className="text-gray-500 text-xs mt-1">{activity.timestamp}</p>
      </div>
    </div>
  );
}

// Drone Status Item Component
function DroneStatusItem({ drone }) {
  const statusColors = {
    available: 'text-green-400 bg-green-500/20',
    in_flight: 'text-blue-400 bg-blue-500/20',
    maintenance: 'text-yellow-400 bg-yellow-500/20',
    charging: 'text-orange-400 bg-orange-500/20',
    offline: 'text-red-400 bg-red-500/20'
  };

  const statusClass = statusColors[drone.status] || 'text-gray-400 bg-gray-500/20';

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
          <DroneIcon className="w-6 h-6 text-purple-400" />
        </div>
        <div>
          <p className="text-white font-medium">{drone.registrationId}</p>
          <p className="text-gray-500 text-sm">{drone.model}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusClass}`}>
          {drone.status.replace('_', ' ')}
        </span>
        <span className="text-gray-400 text-sm">{drone.health.batteryLevel}%</span>
      </div>
    </div>
  );
}

// Quick Action Card Component
function QuickActionCard({ title, description, icon: Icon, href, gradient }) {
  return (
    <a
      href={href}
      className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/20 hover:border-purple-500/30 transition-all group hover:shadow-lg hover:shadow-purple-500/10"
    >
      <div className={`w-12 h-12 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <h3 className="text-white font-semibold mb-1">{title}</h3>
      <p className="text-gray-400 text-sm">{description}</p>
    </a>
  );
}

// Icon Components
const DeliveryIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
  </svg>
);

const ActiveDeliveryIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

const DroneIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
  </svg>
);

const HospitalIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

const ActivityIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const PlusIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
  </svg>
);

const CheckIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const SettingsIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
)
// // app/dashboard/hospital-admin/staff-activity/page.jsx
// 'use client';

// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { useSession } from 'next-auth/react';
// import DashboardLayout from '@/components/dashboard/DashboardLayout';
// import RoleGuard from '@/components/auth/RoleGuard';
// import toast from 'react-hot-toast';

// // Icon Components
// const BackIcon = ({ className }) => (
//   <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
//   </svg>
// );

// const UserIcon = ({ className }) => (
//   <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//   </svg>
// );

// const FilterIcon = ({ className }) => (
//   <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
//   </svg>
// );

// const ActivityIcon = ({ className }) => (
//   <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
//   </svg>
// );

// const CalendarIcon = ({ className }) => (
//   <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
//   </svg>
// );

// const SearchIcon = ({ className }) => (
//   <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//   </svg>
// );

// export default function StaffActivityPage() {
//   const router = useRouter();
//   const { data: session } = useSession();
//   const [activities, setActivities] = useState([]);
//   const [staffList, setStaffList] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [filters, setFilters] = useState({
//     staffId: 'all',
//     activityType: 'all', // all, deliveries, logins
//     dateRange: '7days',
//     search: ''
//   });
//   const [showFilters, setShowFilters] = useState(false);
//   const [pagination, setPagination] = useState({
//     page: 1,
//     limit: 50,
//     total: 0
//   });

//   useEffect(() => {
//     fetchStaffList();
//     fetchActivities();
//   }, [filters, pagination.page]);

//   const fetchStaffList = async () => {
//     try {
//       const res = await fetch('/api/hospital-admin/staff/list');
//       if (!res.ok) throw new Error('Failed to fetch');
//       const data = await res.json();
//       setStaffList(data);
//     } catch (error) {
//       console.error('Error fetching staff list:', error);
//     }
//   };

//   const fetchActivities = async () => {
//     setLoading(true);
//     try {
//       const queryParams = new URLSearchParams({
//         page: pagination.page,
//         limit: pagination.limit,
//         ...filters
//       });

//       const res = await fetch(`/api/hospital-admin/staff/activity/detailed?${queryParams}`);
//       if (!res.ok) throw new Error('Failed to fetch');
      
//       const data = await res.json();
//       setActivities(data.activities);
//       setPagination(prev => ({ ...prev, total: data.total }));
//     } catch (error) {
//       console.error('Error fetching activities:', error);
//       toast.error('Failed to load staff activities');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleFilterChange = (name, value) => {
//     setFilters(prev => ({ ...prev, [name]: value }));
//     setPagination(prev => ({ ...prev, page: 1 }));
//   };

//   const getActivityIcon = (type) => {
//     switch (type) {
//       case 'delivery_created':
//         return { icon: ActivityIcon, color: 'text-green-400', bg: 'bg-green-500/20' };
//       case 'delivery_cancelled':
//         return { icon: ActivityIcon, color: 'text-red-400', bg: 'bg-red-500/20' };
//       case 'login':
//         return { icon: UserIcon, color: 'text-blue-400', bg: 'bg-blue-500/20' };
//       default:
//         return { icon: ActivityIcon, color: 'text-gray-400', bg: 'bg-gray-500/20' };
//     }
//   };

//   const totalPages = Math.ceil(pagination.total / pagination.limit);

//   return (
//     <RoleGuard allowedRoles={['hospital_admin']}>
//       <DashboardLayout>
//         <div className="min-h-screen p-8">
//           {/* Background elements */}
//           <div className="fixed inset-0 overflow-hidden pointer-events-none">
//             <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-500/5 rounded-full blur-3xl animate-pulse-slow"></div>
//             <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-rose-500/5 rounded-full blur-3xl animate-pulse-slow animation-delay-2000"></div>
//           </div>

//           {/* Header */}
//           <div className="relative mb-8">
//             <button
//               onClick={() => router.back()}
//               className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
//             >
//               <BackIcon className="w-5 h-5" />
//               <span>Back to Dashboard</span>
//             </button>

//             <div className="flex items-center justify-between">
//               <div>
//                 <h1 className="text-3xl font-bold text-white mb-2">Staff Activity</h1>
//                 <p className="text-gray-400">Monitor all staff activities and actions</p>
//               </div>

//               <button
//                 onClick={() => setShowFilters(!showFilters)}
//                 className="px-4 py-2 bg-gray-800/50 text-white rounded-xl hover:bg-gray-700/50 transition-all flex items-center gap-2"
//               >
//                 <FilterIcon className="w-5 h-5" />
//                 Filters
//               </button>
//             </div>
//           </div>

//           {/* Stats Cards */}
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
//             <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl p-4 border border-red-500/20">
//               <div className="flex items-center gap-3">
//                 <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
//                   <UserIcon className="w-6 h-6 text-red-400" />
//                 </div>
//                 <div>
//                   <p className="text-2xl font-bold text-white">{staffList.length}</p>
//                   <p className="text-sm text-gray-400">Total Staff</p>
//                 </div>
//               </div>
//             </div>

//             <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl p-4 border border-green-500/20">
//               <div className="flex items-center gap-3">
//                 <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
//                   <UserIcon className="w-6 h-6 text-green-400" />
//                 </div>
//                 <div>
//                   <p className="text-2xl font-bold text-white">
//                     {staffList.filter(s => s.isActive).length}
//                   </p>
//                   <p className="text-sm text-gray-400">Active Now</p>
//                 </div>
//               </div>
//             </div>

//             <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl p-4 border border-blue-500/20">
//               <div className="flex items-center gap-3">
//                 <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
//                   <ActivityIcon className="w-6 h-6 text-blue-400" />
//                 </div>
//                 <div>
//                   <p className="text-2xl font-bold text-white">{pagination.total}</p>
//                   <p className="text-sm text-gray-400">Total Activities</p>
//                 </div>
//               </div>
//             </div>

//             <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl p-4 border border-yellow-500/20">
//               <div className="flex items-center gap-3">
//                 <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
//                   <CalendarIcon className="w-6 h-6 text-yellow-400" />
//                 </div>
//                 <div>
//                   <p className="text-2xl font-bold text-white">
//                     {activities.filter(a => {
//                       const activityDate = new Date(a.timestamp);
//                       const today = new Date();
//                       return activityDate.toDateString() === today.toDateString();
//                     }).length}
//                   </p>
//                   <p className="text-sm text-gray-400">Today's Activities</p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Filters */}
//           {showFilters && (
//             <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-red-500/20 mb-6 animate-fade-in-up">
//               <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-400 mb-2">Staff Member</label>
//                   <select
//                     value={filters.staffId}
//                     onChange={(e) => handleFilterChange('staffId', e.target.value)}
//                     className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-red-500"
//                   >
//                     <option value="all">All Staff</option>
//                     {staffList.map(staff => (
//                       <option key={staff._id} value={staff._id}>{staff.name}</option>
//                     ))}
//                   </select>
//                 </div>

//                 {/* <div>
//                   <label className="block text-sm font-medium text-gray-400 mb-2">Activity Type</label>
//                   <select
//                     value={filters.activityType}
//                     onChange={(e) => handleFilterChange('activityType', e.target.value)}
//                     className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-red-500"
//                   >
//                     <option value="all">All Activities</option>
//                     <option value="deliveries">Deliveries</option>
//                     <option value="logins">Logins</option>
//                   </select>
//                 </div> */}

//                 <div>
//                   <label className="block text-sm font-medium text-gray-400 mb-2">Date Range</label>
//                   <select
//                     value={filters.dateRange}
//                     onChange={(e) => handleFilterChange('dateRange', e.target.value)}
//                     className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-red-500"
//                   >
//                     <option value="today">Today</option>
//                     <option value="7days">Last 7 Days</option>
//                     <option value="30days">Last 30 Days</option>
//                     <option value="90days">Last 90 Days</option>
//                   </select>
//                 </div>

//                 <div className="col-span-2">
//                   <label className="block text-sm font-medium text-gray-400 mb-2">Search</label>
//                   <div className="relative">
//                     <input
//                       type="text"
//                       value={filters.search}
//                       onChange={(e) => handleFilterChange('search', e.target.value)}
//                       placeholder="Search activities..."
//                       className="w-full px-4 py-2 pl-10 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-red-500"
//                     />
//                     <SearchIcon className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Activity Timeline */}
//           <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-red-500/20">
//             <h2 className="text-xl font-semibold text-white mb-6">Activity Timeline</h2>
            
//             {loading ? (
//               <div className="flex items-center justify-center py-12">
//                 <svg className="animate-spin h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24">
//                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                 </svg>
//               </div>
//             ) : activities.length === 0 ? (
//               <div className="text-center py-12">
//                 <ActivityIcon className="w-12 h-12 text-gray-600 mx-auto mb-3" />
//                 <p className="text-gray-500">No activities found</p>
//               </div>
//             ) : (
//               <div className="space-y-4">
//                 {activities.map((activity, index) => {
//                   const { icon: Icon, color, bg } = getActivityIcon(activity.type);
                  
//                   return (
//                     <div key={activity._id || index} className="flex gap-4 animate-fade-in">
//                       <div className="flex flex-col items-center">
//                         <div className={`w-10 h-10 rounded-full ${bg} flex items-center justify-center flex-shrink-0`}>
//                           <Icon className={`w-5 h-5 ${color}`} />
//                         </div>
//                         {index < activities.length - 1 && (
//                           <div className="w-0.5 h-full bg-gray-700 mt-2"></div>
//                         )}
//                       </div>
                      
//                       <div className="flex-1 pb-8">
//                         <div className="bg-gray-800/50 rounded-xl p-4">
//                           <div className="flex items-center justify-between mb-2">
//                             <h4 className="text-white font-semibold">
//                               {activity.staffName || 'Unknown Staff'}
//                             </h4>
//                             <span className="text-xs text-gray-400">
//                               {activity.timeAgo}
//                             </span>
//                           </div>
//                           <p className="text-gray-300">{activity.action}</p>
//                           {activity.details && (
//                             <p className="text-gray-500 text-sm mt-2">{activity.details}</p>
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             )}

//             {/* Pagination */}
//             {totalPages > 1 && (
//               <div className="mt-6 flex items-center justify-center">
//                 <div className="flex gap-2">
//                   <button
//                     onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
//                     disabled={pagination.page === 1}
//                     className="px-3 py-1 bg-gray-800/50 text-white rounded-lg hover:bg-gray-700/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
//                   >
//                     Previous
//                   </button>
                  
//                   <span className="px-3 py-1 text-gray-400">
//                     Page {pagination.page} of {totalPages}
//                   </span>
                  
//                   <button
//                     onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
//                     disabled={pagination.page === totalPages}
//                     className="px-3 py-1 bg-gray-800/50 text-white rounded-lg hover:bg-gray-700/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
//                   >
//                     Next
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </DashboardLayout>
//     </RoleGuard>
//   );
// }

























// app/dashboard/hospital-admin/staff-activity/page.jsx
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

// Loading Spinner Component
const LoadingSpinner = () => (
  <div className="flex flex-col items-center justify-center py-12">
    <div className="relative">
      <div className="w-16 h-16 border-4 border-red-500/20 rounded-full"></div>
      <div className="w-16 h-16 border-4 border-red-500 rounded-full animate-spin absolute top-0 left-0 border-t-transparent"></div>
    </div>
    <p className="text-gray-400 mt-4 animate-pulse">Loading activities...</p>
  </div>
);

export default function StaffActivityPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState({
    staffId: 'all',
    activityType: 'all',
    dateRange: '7days'
  });
  const [staffList, setStaffList] = useState([]);

  const limit = 50;

  useEffect(() => {
    fetchStaffList();
  }, []);

  useEffect(() => {
    fetchActivities();
  }, [page, filters]);

  const fetchStaffList = async () => {
    try {
      const res = await fetch('/api/hospital-admin/staff/list');
      if (!res.ok) throw new Error('Failed to fetch staff');
      const data = await res.json();
      setStaffList(data);
    } catch (error) {
      console.error('Error fetching staff:', error);
    }
  };

  const fetchActivities = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...filters
      });

      const res = await fetch(`/api/hospital-admin/staff/activity/detailed?${params}`);
      if (!res.ok) throw new Error('Failed to fetch activities');
      
      const data = await res.json();
      setActivities(data.activities);
      setTotal(data.total);
    } catch (error) {
      console.error('Error fetching activities:', error);
      toast.error('Failed to load activities');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Background Pattern and Gradient - Similar to Dashboard */}
      <div className="fixed inset-0 bg-gray-950">
        {/* Grid Pattern */}
        <div 
          className="absolute inset-0 bg-[size:4rem_4rem] opacity-20"
          style={{
            backgroundImage: `linear-gradient(to right, #dc262615 1px, transparent 1px), linear-gradient(to bottom, #dc262615 1px, transparent 1px)`
          }}
        ></div>
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-950/50 via-gray-950 to-rose-950/50"></div>
        
        {/* Animated Background Elements */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl animate-pulse-slow animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-500/5 rounded-full blur-3xl animate-pulse-slow animation-delay-4000"></div>
      </div>

      <div className="relative z-10 p-8">{/* Content Container */}

      {/* Header with Animation */}
      <div className="mb-8 animate-fade-in">
        <div className="flex items-center gap-4 mb-2">
          <button
            onClick={() => router.back()}
            className="text-gray-400 hover:text-white transition-all hover:scale-110 group"
          >
            <BackIcon className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
          </button>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-red-400 to-rose-400 bg-clip-text text-transparent">
            Staff Activity Log
          </h1>
        </div>
        <p className="text-gray-400 ml-10">Complete activity history of medical staff orders and deliveries</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Total Activities"
          value={total}
          icon={ActivityIcon}
          gradient="from-purple-600 to-pink-600"
          delay="0"
        />
        <StatCard
          title="Active Staff"
          value={staffList.length}
          icon={UsersIcon}
          gradient="from-blue-600 to-cyan-600"
          delay="100"
        />
        <StatCard
          title="Today's Activities"
          value={activities.filter(a => a.timeAgo.includes('Just now') || a.timeAgo.includes('m ago') || a.timeAgo.includes('h ago')).length}
          icon={TodayIcon}
          gradient="from-green-600 to-emerald-600"
          delay="200"
        />
        <StatCard
          title="Current Page"
          value={`${page}/${totalPages || 1}`}
          icon={PageIcon}
          gradient="from-orange-600 to-red-600"
          delay="300"
        />
      </div>

      {/* Filters with Glass Effect */}
      <div className="bg-gray-900/60 backdrop-blur-xl rounded-2xl p-6 border border-red-500/20 hover:border-red-500/30 transition-all mb-6 animate-fade-in-up">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <FilterIcon className="w-5 h-5 text-red-400" />
          Filter Activities
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="group">
            <label className="text-sm text-gray-400 block mb-2 group-hover:text-red-400 transition-colors">
              Staff Member
            </label>
            <select
              value={filters.staffId}
              onChange={(e) => handleFilterChange('staffId', e.target.value)}
              className="w-full bg-gray-800/70 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all hover:bg-gray-800"
            >
              <option value="all">All Staff</option>
              {staffList.map(staff => (
                <option key={staff._id} value={staff._id}>{staff.name}</option>
              ))}
            </select>
          </div>

          <div className="group">
            <label className="text-sm text-gray-400 block mb-2 group-hover:text-red-400 transition-colors">
              Activity Type
            </label>
            <select
              value={filters.activityType}
              onChange={(e) => handleFilterChange('activityType', e.target.value)}
              className="w-full bg-gray-800/70 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all hover:bg-gray-800"
            >
              <option value="all">All Activities</option>
              <option value="incoming">Incoming Orders</option>
              <option value="outgoing">Outgoing Deliveries</option>
              <option value="cancelled">Cancelled Orders</option>
            </select>
          </div>

          <div className="group">
            <label className="text-sm text-gray-400 block mb-2 group-hover:text-red-400 transition-colors">
              Date Range
            </label>
            <select
              value={filters.dateRange}
              onChange={(e) => handleFilterChange('dateRange', e.target.value)}
              className="w-full bg-gray-800/70 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all hover:bg-gray-800"
            >
              <option value="today">Today</option>
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="90days">Last 90 Days</option>
              <option value="all">All Time</option>
            </select>
          </div>
        </div>
      </div>

      {/* Activities Table with Enhanced Design */}
      <div className="bg-gray-900/60 backdrop-blur-xl rounded-2xl p-6 border border-red-500/20 hover:border-red-500/30 transition-all animate-fade-in-up animation-delay-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">Activity History</h2>
          {!loading && (
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-gray-400">Live Data</span>
            </div>
          )}
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : activities.length === 0 ? (
          <div className="text-center py-12">
            <EmptyIcon className="w-16 h-16 text-gray-600 mx-auto mb-4 opacity-50" />
            <p className="text-gray-500 text-lg">No activities found</p>
            <p className="text-gray-600 text-sm mt-1">Try adjusting your filters</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b border-gray-800">
                    <th className="pb-3 text-sm font-medium text-gray-400">Staff Member</th>
                    <th className="pb-3 text-sm font-medium text-gray-400">Activity</th>
                    <th className="pb-3 text-sm font-medium text-gray-400">Order Details</th>
                    <th className="pb-3 text-sm font-medium text-gray-400">Status</th>
                    <th className="pb-3 text-sm font-medium text-gray-400">Time</th>
                    {/* <th className="pb-3 text-sm font-medium text-gray-400">Actions</th> */}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {activities.map((activity, index) => (
                    <ActivityRow key={activity._id} activity={activity} delay={index * 50} />
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination with Glass Effect */}
            {totalPages > 1 && (
              <div className="mt-6 flex items-center justify-between">
                <p className="text-sm text-gray-400">
                  Showing <span className="text-red-400 font-medium">{(page - 1) * limit + 1}</span> to{' '}
                  <span className="text-red-400 font-medium">{Math.min(page * limit, total)}</span> of{' '}
                  <span className="text-red-400 font-medium">{total}</span> activities
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 bg-gray-800/70 hover:bg-gray-700/70 disabled:bg-gray-900/70 disabled:text-gray-600 text-white rounded-lg transition-all hover:scale-105 disabled:scale-100 backdrop-blur-sm border border-gray-700 hover:border-red-500/50 disabled:border-gray-800"
                  >
                    Previous
                  </button>
                  <span className="text-white px-4 py-2 bg-red-500/10 rounded-lg border border-red-500/20">
                    Page <span className="font-bold text-red-400">{page}</span> of <span className="font-bold text-red-400">{totalPages}</span>
                  </span>
                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="px-4 py-2 bg-gray-800/70 hover:bg-gray-700/70 disabled:bg-gray-900/70 disabled:text-gray-600 text-white rounded-lg transition-all hover:scale-105 disabled:scale-100 backdrop-blur-sm border border-gray-700 hover:border-red-500/50 disabled:border-gray-800"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Add Animation Styles */}
      <style jsx>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.1); }
        }
        .animate-pulse-slow { animation: pulse-slow 4s ease-in-out infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in { animation: fade-in 0.5s ease-out; }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up { animation: fade-in-up 0.5s ease-out; }
        .animation-delay-200 { animation-delay: 200ms; }
      `}</style>
      </div>
    </div>
  );
}

// Stat Card Component with Animation
function StatCard({ title, value, icon: Icon, gradient, delay }) {
  return (
    <div 
      className="bg-gray-900/60 backdrop-blur-xl rounded-xl p-4 border border-red-500/20 hover:border-red-500/30 transition-all hover:scale-105 animate-fade-in-up group"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm">{title}</p>
          <p className="text-2xl font-bold text-white mt-1">{value}</p>
        </div>
        <div className={`w-12 h-12 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
}

// Activity Row Component with Hover Effects
function ActivityRow({ activity, delay }) {
  const router = useRouter();

  const getActivityIcon = () => {
    if (activity.deliveryType === 'incoming' || activity.type === 'incoming_order') {
      return <IncomingIcon className="w-5 h-5 text-blue-400" />;
    } else {
      return <OutgoingIcon className="w-5 h-5 text-orange-400" />;
    }
  };

  const getStatusBadge = () => {
    const statusColors = {
      pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      pending_approval: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      approved: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      assigned: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      in_transit: 'bg-green-500/20 text-green-400 border-green-500/30',
      delivered: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      failed: 'bg-red-500/20 text-red-400 border-red-500/30',
      cancelled: 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    };

    const color = statusColors[activity.status] || 'bg-gray-500/20 text-gray-400 border-gray-500/30';

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${color} backdrop-blur-sm`}>
        {activity.status}
      </span>
    );
  };

  const getUrgencyBadge = () => {
    const urgencyColors = {
      routine: 'text-gray-400',
      urgent: 'text-yellow-400',
      emergency: 'text-red-400 animate-pulse'
    };

    return (
      <span className={`${urgencyColors[activity.urgency] || 'text-gray-400'} text-sm font-medium`}>
        {activity.urgency?.toUpperCase()}
      </span>
    );
  };

  return (
    <tr 
      className="hover:bg-gray-800/50 transition-all hover:shadow-lg animate-fade-in group"
      style={{ animationDelay: `${delay}ms` }}
    >
      <td className="py-4">
        <div className="flex items-center gap-3">
          {/* <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
            <span className="text-white font-medium text-sm">
              {activity.staffName?.charAt(0).toUpperCase()}
            </span>
          </div> */}
          <span className="text-white font-medium">{activity.staffName}</span>
        </div>
      </td>
      <td className="py-4">
        <div className="flex items-center gap-2">
          {getActivityIcon()}
          <span className="text-gray-300">{activity.action}</span>
        </div>
      </td>
      <td className="py-4">
        <div className="space-y-1">
          <p className="text-gray-300 text-sm">{activity.details}</p>
          {getUrgencyBadge()}
        </div>
      </td>
      <td className="py-4">
        {getStatusBadge()}
      </td>
      <td className="py-4">
        <p className="text-gray-400 text-sm">{activity.timeAgo}</p>
      </td>
      {/* <td className="py-4">
        <button
          onClick={() => router.push(`/dashboard/delivery/${activity._id}`)}
          className="text-red-400 hover:text-red-300 text-sm transition-all hover:scale-105 flex items-center gap-1 group"
        >
          View Details
          <svg className="w-3 h-3 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </td> */}
    </tr>
  );
}

// Icon Components
const BackIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
  </svg>
);

const IncomingIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
  </svg>
);

const OutgoingIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
  </svg>
);

const ActivityIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
  </svg>
);

const UsersIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const TodayIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const PageIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
  </svg>
);

const FilterIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
  </svg>
);

const EmptyIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
  </svg>
);
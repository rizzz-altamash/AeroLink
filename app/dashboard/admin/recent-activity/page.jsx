// // app/dashboard/admin/recent-activity/page.jsx
// 'use client';

// import { useState, useEffect } from 'react';
// import { useSession } from 'next-auth/react';
// import { useRouter } from 'next/navigation';
// import toast from 'react-hot-toast';

// // Icon Components
// const BackIcon = ({ className }) => (
//   <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
//   </svg>
// );

// const FilterIcon = ({ className }) => (
//   <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
//   </svg>
// );

// const RefreshIcon = ({ className }) => (
//   <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
//   </svg>
// );

// const SearchIcon = ({ className }) => (
//   <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//   </svg>
// );

// const ActivityIcon = ({ className }) => (
//   <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//   </svg>
// );

// const MedicalStaffIcon = ({ className }) => (
//   <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//   </svg>
// );

// const HospitalAdminIcon = ({ className }) => (
//   <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
//   </svg>
// );

// const AdminIcon = ({ className }) => (
//   <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
//   </svg>
// );

// const PilotIcon = ({ className }) => (
//   <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
//   </svg>
// );

// // Loading Spinner Component
// const LoadingSpinner = () => (
//   <div className="flex flex-col items-center justify-center py-12">
//     <div className="relative">
//       <div className="w-16 h-16 border-4 border-purple-500/20 rounded-full"></div>
//       <div className="w-16 h-16 border-4 border-purple-500 rounded-full animate-spin absolute top-0 left-0 border-t-transparent"></div>
//     </div>
//     <p className="text-gray-400 mt-4 animate-pulse">Loading activities...</p>
//   </div>
// );

// export default function RecentActivityPage() {
//   const { data: session } = useSession();
//   const router = useRouter();
//   const [activities, setActivities] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showFilters, setShowFilters] = useState(false);
//   const [filters, setFilters] = useState({
//     activityType: 'all',
//     userRole: 'all',
//     urgency: 'all',
//     dateRange: '7days',
//     search: ''
//   });
//   const [pagination, setPagination] = useState({
//     page: 1,
//     limit: 50,
//     total: 0
//   });

//   useEffect(() => {
//     if (session?.user?.role === 'admin') {
//       fetchActivities();
//     }
//   }, [session, filters, pagination.page]);

//   const fetchActivities = async () => {
//     setLoading(true);
//     try {
//       const queryParams = new URLSearchParams({
//         page: pagination.page,
//         limit: pagination.limit,
//         ...filters
//       });

//       const res = await fetch(`/api/admin/activity/detailed?${queryParams}`);
//       if (!res.ok) throw new Error('Failed to fetch');
      
//       const data = await res.json();
//       setActivities(data.activities);
//       setPagination(prev => ({ ...prev, total: data.total }));
//     } catch (error) {
//       console.error('Error fetching activities:', error);
//       toast.error('Failed to load activities');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleFilterChange = (name, value) => {
//     setFilters(prev => ({ ...prev, [name]: value }));
//     setPagination(prev => ({ ...prev, page: 1 }));
//   };

//   const getActivityIcon = (activity) => {
//     switch (activity.userRole) {
//       case 'medical_staff':
//         return <MedicalStaffIcon className="w-5 h-5 text-blue-400" />;
//       case 'hospital_admin':
//         return <HospitalAdminIcon className="w-5 h-5 text-red-400" />;
//       case 'admin':
//         return <AdminIcon className="w-5 h-5 text-purple-400" />;
//       case 'pilot':
//         return <PilotIcon className="w-5 h-5 text-green-400" />;
//       default:
//         return <ActivityIcon className="w-5 h-5 text-gray-400" />;
//     }
//   };

//   const getActivityColor = (activityType) => {
//     const colors = {
//       'created_delivery': 'text-blue-400 bg-blue-500/20',
//       'placed_order': 'text-cyan-400 bg-cyan-500/20',
//       'approved_delivery': 'text-green-400 bg-green-500/20',
//       'rejected_delivery': 'text-red-400 bg-red-500/20',
//       'assigned_pilot': 'text-purple-400 bg-purple-500/20',
//       'started_flight': 'text-yellow-400 bg-yellow-500/20',
//       'marked_delivered': 'text-emerald-400 bg-emerald-500/20',
//       'cancelled_flight': 'text-orange-400 bg-orange-500/20',
//       'confirmed_delivery': 'text-teal-400 bg-teal-500/20'
//     };
//     return colors[activityType] || 'text-gray-400 bg-gray-500/20';
//   };

//   const urgencyColors = {
//     routine: 'text-gray-400 bg-gray-500/20',
//     urgent: 'text-orange-400 bg-orange-500/20',
//     emergency: 'text-red-400 bg-red-500/20'
//   };

//   const totalPages = Math.ceil(pagination.total / pagination.limit);

//   if (!session || session.user.role !== 'admin') {
//     return (
//       <div className="min-h-screen bg-gray-950 flex items-center justify-center">
//         <p className="text-white">Unauthorized</p>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-950">
//       {/* Background Pattern - Purple Theme for Admin */}
//       <div className="fixed inset-0 bg-gray-950">
//         <div 
//           className="absolute inset-0 bg-[size:4rem_4rem] opacity-20"
//           style={{
//             backgroundImage: `linear-gradient(to right, #a855f715 1px, transparent 1px), linear-gradient(to bottom, #a855f715 1px, transparent 1px)`
//           }}
//         ></div>
//         <div className="absolute inset-0 bg-gradient-to-br from-purple-950/50 via-gray-950 to-indigo-950/50"></div>
//         <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
//         <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl animate-pulse-slow animation-delay-2000"></div>
//       </div>

//       <div className="relative z-10 p-8">
//         {/* Header */}
//         <div className="mb-8 animate-fade-in">
//           <button
//             onClick={() => router.back()}
//             className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4 group"
//           >
//             <BackIcon className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
//             <span>Back to Dashboard</span>
//           </button>

//           <div className="flex items-center justify-between">
//             <div>
//               <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent mb-2">
//                 System Activity Log
//               </h1>
//               <p className="text-gray-400">Monitor all system activities across different user roles</p>
//             </div>

//             <div className="flex gap-4">
//               <button
//                 onClick={fetchActivities}
//                 className="px-4 py-2 bg-gray-800/50 text-white rounded-xl hover:bg-gray-700/50 transition-all flex items-center gap-2 border border-purple-500/20 hover:border-purple-500/30"
//               >
//                 <RefreshIcon className="w-5 h-5" />
//                 Refresh
//               </button>
//               <button
//                 onClick={() => setShowFilters(!showFilters)}
//                 className="px-4 py-2 bg-purple-600/20 text-purple-400 rounded-xl hover:bg-purple-600/30 transition-all flex items-center gap-2 border border-purple-500/30"
//               >
//                 <FilterIcon className="w-5 h-5" />
//                 Filters
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Filters */}
//         {showFilters && (
//           <div className="bg-gray-900/60 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/20 mb-6 animate-fade-in-up">
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-400 mb-2">Activity Type</label>
//                 <select
//                   value={filters.activityType}
//                   onChange={(e) => handleFilterChange('activityType', e.target.value)}
//                   className="w-full px-4 py-2 bg-gray-800/70 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
//                 >
//                   <option value="all">All Activities</option>
//                   <option value="created_delivery">Created Delivery</option>
//                   <option value="placed_order">Placed Order</option>
//                   <option value="approved_delivery">Approved Delivery</option>
//                   <option value="rejected_delivery">Rejected Delivery</option>
//                   <option value="assigned_pilot">Assigned Pilot</option>
//                   <option value="started_flight">Started Flight</option>
//                   <option value="marked_delivered">Marked Delivered</option>
//                   <option value="cancelled_flight">Cancelled Flight</option>
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-400 mb-2">User Role</label>
//                 <select
//                   value={filters.userRole}
//                   onChange={(e) => handleFilterChange('userRole', e.target.value)}
//                   className="w-full px-4 py-2 bg-gray-800/70 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
//                 >
//                   <option value="all">All Roles</option>
//                   <option value="medical_staff">Medical Staff</option>
//                   <option value="hospital_admin">Hospital Admin</option>
//                   <option value="admin">System Admin</option>
//                   <option value="pilot">Pilot</option>
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-400 mb-2">Urgency</label>
//                 <select
//                   value={filters.urgency}
//                   onChange={(e) => handleFilterChange('urgency', e.target.value)}
//                   className="w-full px-4 py-2 bg-gray-800/70 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
//                 >
//                   <option value="all">All Urgency</option>
//                   <option value="routine">Routine</option>
//                   <option value="urgent">Urgent</option>
//                   <option value="emergency">Emergency</option>
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-400 mb-2">Date Range</label>
//                 <select
//                   value={filters.dateRange}
//                   onChange={(e) => handleFilterChange('dateRange', e.target.value)}
//                   className="w-full px-4 py-2 bg-gray-800/70 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
//                 >
//                   <option value="today">Today</option>
//                   <option value="7days">Last 7 Days</option>
//                   <option value="30days">Last 30 Days</option>
//                   <option value="90days">Last 90 Days</option>
//                   <option value="all">All Time</option>
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-400 mb-2">Search</label>
//                 <div className="relative">
//                   <input
//                     type="text"
//                     value={filters.search}
//                     onChange={(e) => handleFilterChange('search', e.target.value)}
//                     placeholder="Order ID or username..."
//                     className="w-full px-4 py-2 pl-10 bg-gray-800/70 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
//                   />
//                   <SearchIcon className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Activities Table */}
//         <div className="bg-gray-900/60 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/20 animate-fade-in-up animation-delay-200">
//           {loading ? (
//             <LoadingSpinner />
//           ) : (
//             <>
//               <div className="overflow-x-auto">
//                 <table className="w-full">
//                   <thead>
//                     <tr className="text-left border-b border-gray-800">
//                       <th className="pb-3 text-sm font-medium text-gray-400">Timestamp</th>
//                       <th className="pb-3 text-sm font-medium text-gray-400">User</th>
//                       <th className="pb-3 text-sm font-medium text-gray-400">Activity</th>
//                       <th className="pb-3 text-sm font-medium text-gray-400">Order ID</th>
//                       <th className="pb-3 text-sm font-medium text-gray-400">Package Type</th>
//                       <th className="pb-3 text-sm font-medium text-gray-400">Urgency</th>
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y divide-gray-800">
//                     {activities.length === 0 ? (
//                       <tr>
//                         <td colSpan="7" className="py-8 text-center text-gray-500">
//                           No activities found
//                         </td>
//                       </tr>
//                     ) : (
//                       activities.map((activity, index) => (
//                         <tr 
//                           key={activity._id || index} 
//                           className="hover:bg-gray-800/50 transition-colors animate-fade-in"
//                           style={{ animationDelay: `${index * 50}ms` }}
//                         >
//                           <td className="py-3">
//                             <span className="text-gray-300">
//                               {new Date(activity.timestamp).toLocaleString()}
//                             </span>
//                             <span className="text-gray-500 text-xs block">
//                               {activity.timeAgo}
//                             </span>
//                           </td>
//                           <td className="py-3">
//                             <div className="flex items-center gap-2">
//                               {getActivityIcon(activity)}
//                               <div>
//                                 <span className="text-white font-medium">{activity.userName}</span>
//                                 <span className="text-gray-500 text-xs block capitalize">
//                                   {activity.userRole?.replace('_', ' ')}
//                                 </span>
//                               </div>
//                             </div>
//                           </td>
//                           <td className="py-3">
//                             <span className={`px-3 py-1 rounded-full text-xs font-medium ${getActivityColor(activity.activityType)}`}>
//                               {activity.action}
//                             </span>
//                           </td>
//                           <td className="py-3">
//                             <span className="text-white font-mono">{activity.orderId}</span>
//                           </td>
//                           <td className="py-3">
//                             <span className="text-gray-300 capitalize">{activity.packageType}</span>
//                           </td>
//                           <td className="py-3">
//                             <span className={`px-2 py-1 rounded-full text-xs font-medium ${urgencyColors[activity.urgency] || urgencyColors.routine}`}>
//                               {activity.urgency}
//                             </span>
//                           </td>
//                         </tr>
//                       ))
//                     )}
//                   </tbody>
//                 </table>
//               </div>

//               {/* Pagination */}
//               {totalPages > 1 && (
//                 <div className="mt-6 flex items-center justify-between">
//                   <p className="text-gray-400 text-sm">
//                     Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} activities
//                   </p>
                  
//                   <div className="flex gap-2">
//                     <button
//                       onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
//                       disabled={pagination.page === 1}
//                       className="px-3 py-1 bg-gray-800/50 text-white rounded-lg hover:bg-gray-700/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
//                     >
//                       Previous
//                     </button>
                    
//                     {[...Array(Math.min(5, totalPages))].map((_, i) => {
//                       const pageNum = i + 1;
//                       return (
//                         <button
//                           key={pageNum}
//                           onClick={() => setPagination(prev => ({ ...prev, page: pageNum }))}
//                           className={`px-3 py-1 rounded-lg transition-all ${
//                             pagination.page === pageNum
//                               ? 'bg-purple-600 text-white'
//                               : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50'
//                           }`}
//                         >
//                           {pageNum}
//                         </button>
//                       );
//                     })}
                    
//                     <button
//                       onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
//                       disabled={pagination.page === totalPages}
//                       className="px-3 py-1 bg-gray-800/50 text-white rounded-lg hover:bg-gray-700/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
//                     >
//                       Next
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </>
//           )}
//         </div>
//       </div>

//       {/* Animation Styles */}
//       <style jsx>{`
//         @keyframes pulse-slow {
//           0%, 100% { opacity: 0.3; transform: scale(1); }
//           50% { opacity: 0.5; transform: scale(1.1); }
//         }
//         .animate-pulse-slow { animation: pulse-slow 4s ease-in-out infinite; }
//         .animation-delay-2000 { animation-delay: 2s; }
//         @keyframes fade-in {
//           from { opacity: 0; }
//           to { opacity: 1; }
//         }
//         .animate-fade-in { animation: fade-in 0.5s ease-out; }
//         @keyframes fade-in-up {
//           from { opacity: 0; transform: translateY(20px); }
//           to { opacity: 1; transform: translateY(0); }
//         }
//         .animate-fade-in-up { animation: fade-in-up 0.5s ease-out; }
//         .animation-delay-200 { animation-delay: 200ms; }
//       `}</style>
//     </div>
//   );
// }













// Responsive 
// app/dashboard/admin/recent-activity/page.jsx
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

// Icon Components
const BackIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
  </svg>
);

const FilterIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
  </svg>
);

const RefreshIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

const SearchIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const ActivityIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const MedicalStaffIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const HospitalAdminIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

const AdminIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
  </svg>
);

const PilotIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
  </svg>
);

// Loading Spinner Component
const LoadingSpinner = () => (
  <div className="flex flex-col items-center justify-center py-8 sm:py-12">
    <div className="relative">
      <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-purple-500/20 rounded-full"></div>
      <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-purple-500 rounded-full animate-spin absolute top-0 left-0 border-t-transparent"></div>
    </div>
    <p className="text-gray-400 mt-4 animate-pulse text-sm sm:text-base">Loading activities...</p>
  </div>
);

export default function RecentActivityPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    activityType: 'all',
    userRole: 'all',
    urgency: 'all',
    dateRange: '7days',
    search: ''
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50,
    total: 0
  });

  useEffect(() => {
    if (session?.user?.role === 'admin') {
      fetchActivities();
    }
  }, [session, filters, pagination.page]);

  const fetchActivities = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page: pagination.page,
        limit: pagination.limit,
        ...filters
      });

      const res = await fetch(`/api/admin/activity/detailed?${queryParams}`);
      if (!res.ok) throw new Error('Failed to fetch');
      
      const data = await res.json();
      setActivities(data.activities);
      setPagination(prev => ({ ...prev, total: data.total }));
    } catch (error) {
      console.error('Error fetching activities:', error);
      toast.error('Failed to load activities');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const getActivityIcon = (activity) => {
    switch (activity.userRole) {
      case 'medical_staff':
        return <MedicalStaffIcon className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />;
      case 'hospital_admin':
        return <HospitalAdminIcon className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" />;
      case 'admin':
        return <AdminIcon className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />;
      case 'pilot':
        return <PilotIcon className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />;
      default:
        return <ActivityIcon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />;
    }
  };

  const getActivityColor = (activityType) => {
    const colors = {
      'created_delivery': 'text-blue-400 bg-blue-500/20',
      'placed_order': 'text-cyan-400 bg-cyan-500/20',
      'approved_delivery': 'text-green-400 bg-green-500/20',
      'rejected_delivery': 'text-red-400 bg-red-500/20',
      'assigned_pilot': 'text-purple-400 bg-purple-500/20',
      'started_flight': 'text-yellow-400 bg-yellow-500/20',
      'marked_delivered': 'text-emerald-400 bg-emerald-500/20',
      'cancelled_flight': 'text-orange-400 bg-orange-500/20',
      'confirmed_delivery': 'text-teal-400 bg-teal-500/20'
    };
    return colors[activityType] || 'text-gray-400 bg-gray-500/20';
  };

  const urgencyColors = {
    routine: 'text-gray-400 bg-gray-500/20',
    urgent: 'text-orange-400 bg-orange-500/20',
    emergency: 'text-red-400 bg-red-500/20'
  };

  const totalPages = Math.ceil(pagination.total / pagination.limit);

  if (!session || session.user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
        <p className="text-white">Unauthorized</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Background Pattern - Purple Theme for Admin */}
      <div className="fixed inset-0 bg-gray-950">
        <div 
          className="absolute inset-0 bg-[size:2rem_2rem] sm:bg-[size:4rem_4rem] opacity-20"
          style={{
            backgroundImage: `linear-gradient(to right, #a855f715 1px, transparent 1px), linear-gradient(to bottom, #a855f715 1px, transparent 1px)`
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-br from-purple-950/50 via-gray-950 to-indigo-950/50"></div>
        <div className="absolute -top-20 -right-20 sm:-top-40 sm:-right-40 w-40 h-40 sm:w-80 sm:h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute -bottom-20 -left-20 sm:-bottom-40 sm:-left-40 w-40 h-40 sm:w-80 sm:h-80 bg-indigo-500/10 rounded-full blur-3xl animate-pulse-slow animation-delay-2000"></div>
      </div>

      <div className="relative z-10 p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8 animate-fade-in">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4 group"
          >
            <BackIcon className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm sm:text-base">Back to Dashboard</span>
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent mb-2">
                System Activity Log
              </h1>
              <p className="text-gray-400 text-sm sm:text-base">Monitor all system activities across different user roles</p>
            </div>

            <div className="flex gap-2 sm:gap-4">
              <button
                onClick={fetchActivities}
                className="px-3 py-1.5 sm:px-4 sm:py-2 bg-gray-800/50 text-white rounded-xl hover:bg-gray-700/50 transition-all flex items-center gap-2 border border-purple-500/20 hover:border-purple-500/30 text-sm sm:text-base"
              >
                <RefreshIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">Refresh</span>
              </button>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="px-3 py-1.5 sm:px-4 sm:py-2 bg-purple-600/20 text-purple-400 rounded-xl hover:bg-purple-600/30 transition-all flex items-center gap-2 border border-purple-500/30 text-sm sm:text-base"
              >
                <FilterIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                Filters
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="bg-gray-900/60 backdrop-blur-xl rounded-2xl p-4 sm:p-6 border border-purple-500/20 mb-6 animate-fade-in-up">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
              <div className="sm:col-span-2 lg:col-span-1">
                <label className="block text-xs sm:text-sm font-medium text-gray-400 mb-1 sm:mb-2">Activity Type</label>
                <select
                  value={filters.activityType}
                  onChange={(e) => handleFilterChange('activityType', e.target.value)}
                  className="w-full px-3 py-1.5 sm:px-4 sm:py-2 bg-gray-800/70 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm sm:text-base"
                >
                  <option value="all">All Activities</option>
                  <option value="created_delivery">Created Delivery</option>
                  <option value="placed_order">Placed Order</option>
                  <option value="approved_delivery">Approved Delivery</option>
                  <option value="rejected_delivery">Rejected Delivery</option>
                  <option value="assigned_pilot">Assigned Pilot</option>
                  <option value="started_flight">Started Flight</option>
                  <option value="marked_delivered">Marked Delivered</option>
                  <option value="cancelled_flight">Cancelled Flight</option>
                </select>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-400 mb-1 sm:mb-2">User Role</label>
                <select
                  value={filters.userRole}
                  onChange={(e) => handleFilterChange('userRole', e.target.value)}
                  className="w-full px-3 py-1.5 sm:px-4 sm:py-2 bg-gray-800/70 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm sm:text-base"
                >
                  <option value="all">All Roles</option>
                  <option value="medical_staff">Medical Staff</option>
                  <option value="hospital_admin">Hospital Admin</option>
                  <option value="admin">System Admin</option>
                  <option value="pilot">Pilot</option>
                </select>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-400 mb-1 sm:mb-2">Urgency</label>
                <select
                  value={filters.urgency}
                  onChange={(e) => handleFilterChange('urgency', e.target.value)}
                  className="w-full px-3 py-1.5 sm:px-4 sm:py-2 bg-gray-800/70 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm sm:text-base"
                >
                  <option value="all">All Urgency</option>
                  <option value="routine">Routine</option>
                  <option value="urgent">Urgent</option>
                  <option value="emergency">Emergency</option>
                </select>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-400 mb-1 sm:mb-2">Date Range</label>
                <select
                  value={filters.dateRange}
                  onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                  className="w-full px-3 py-1.5 sm:px-4 sm:py-2 bg-gray-800/70 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm sm:text-base"
                >
                  <option value="today">Today</option>
                  <option value="7days">Last 7 Days</option>
                  <option value="30days">Last 30 Days</option>
                  <option value="90days">Last 90 Days</option>
                  <option value="all">All Time</option>
                </select>
              </div>

              <div className="sm:col-span-2 lg:col-span-1">
                <label className="block text-xs sm:text-sm font-medium text-gray-400 mb-1 sm:mb-2">Search</label>
                <div className="relative">
                  <input
                    type="text"
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    placeholder="Order ID or username..."
                    className="w-full px-3 py-1.5 pl-8 sm:px-4 sm:py-2 sm:pl-10 bg-gray-800/70 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm sm:text-base"
                  />
                  <SearchIcon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 absolute left-2 sm:left-3 top-2 sm:top-2.5" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Activities Table */}
        <div className="bg-gray-900/60 backdrop-blur-xl rounded-2xl p-3 sm:p-6 border border-purple-500/20 animate-fade-in-up animation-delay-200">
          {loading ? (
            <LoadingSpinner />
          ) : (
            <>
              <div className="overflow-x-auto -mx-3 sm:-mx-6">
                <div className="inline-block w-200 md:w-full align-middle px-3 sm:px-6">
                  <table className="min-w-full divide-y divide-gray-800">
                    <thead>
                      <tr className="text-left">
                        <th className="pb-3 text-xs sm:text-sm font-medium text-gray-400 pr-2 sm:pr-4">Timestamp</th>
                        <th className="pb-3 text-xs sm:text-sm font-medium text-gray-400 pr-2 sm:pr-4">User</th>
                        <th className="pb-3 text-xs sm:text-sm font-medium text-gray-400 pr-2 sm:pr-4">Activity</th>
                        <th className="pb-3 text-xs sm:text-sm font-medium text-gray-400 pr-2 sm:pr-4">Order ID</th>
                        <th className="pb-3 text-xs sm:text-sm font-medium text-gray-400 pr-2 sm:pr-4">Package Type</th>
                        <th className="pb-3 text-xs sm:text-sm font-medium text-gray-400">Urgency</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                      {activities.length === 0 ? (
                        <tr>
                          <td colSpan="6" className="py-8 text-center text-gray-500 text-sm sm:text-base">
                            No activities found
                          </td>
                        </tr>
                      ) : (
                        activities.map((activity, index) => (
                          <tr 
                            key={activity._id || index} 
                            className="hover:bg-gray-800/50 transition-colors animate-fade-in"
                            style={{ animationDelay: `${index * 50}ms` }}
                          >
                            <td className="py-2 sm:py-3 pr-2 sm:pr-4">
                              <span className="text-gray-300 text-xs sm:text-sm lg:text-base block">
                                {new Date(activity.timestamp).toLocaleDateString()}
                              </span>
                              <span className="text-gray-500 text-xs block">
                                {new Date(activity.timestamp).toLocaleTimeString()}
                              </span>
                              <span className="text-gray-500 text-xs block sm:hidden">
                                {activity.timeAgo}
                              </span>
                            </td>
                            <td className="py-2 sm:py-3 pr-2 sm:pr-4">
                              <div className="flex items-center gap-1 sm:gap-2">
                                {getActivityIcon(activity)}
                                <div className="min-w-0">
                                  <span className="text-white font-medium text-xs sm:text-sm block truncate">{activity.userName}</span>
                                  <span className="text-gray-500 text-xs capitalize">
                                    {activity.userRole?.replace('_', ' ')}
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td className="py-2 sm:py-3 pr-2 sm:pr-4">
                              <span className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-medium ${getActivityColor(activity.activityType)}`}>
                                {activity.action}
                              </span>
                            </td>
                            <td className="py-2 sm:py-3 pr-2 sm:pr-4">
                              <span className="text-white font-mono text-xs sm:text-sm">{activity.orderId}</span>
                              <span className="text-gray-500 text-xs capitalize block md:hidden mt-1">
                                {activity.packageType}
                              </span>
                            </td>
                            <td className="py-2 sm:py-3 pr-2 sm:pr-4">
                              <span className="text-gray-300 capitalize text-sm">{activity.packageType}</span>
                            </td>
                            <td className="py-2 sm:py-3">
                              <span className={`px-2 py-0.5 sm:py-1 rounded-full text-xs font-medium ${urgencyColors[activity.urgency] || urgencyColors.routine}`}>
                                {activity.urgency}
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <p className="text-gray-400 text-xs sm:text-sm text-center sm:text-left">
                    Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} activities
                  </p>
                  
                  <div className="flex gap-1 sm:gap-2">
                    <button
                      onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                      disabled={pagination.page === 1}
                      className="px-2 py-1 sm:px-3 sm:py-1 bg-gray-800/50 text-white rounded-lg hover:bg-gray-700/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-xs sm:text-sm"
                    >
                      Previous
                    </button>
                    
                    <div className="flex gap-1">
                      {[...Array(Math.min(3, totalPages))].map((_, i) => {
                        const pageNum = i + 1;
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setPagination(prev => ({ ...prev, page: pageNum }))}
                            className={`px-2 py-1 sm:px-3 sm:py-1 rounded-lg transition-all text-xs sm:text-sm ${
                              pagination.page === pageNum
                                ? 'bg-purple-600 text-white'
                                : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                      {totalPages > 3 && (
                        <>
                          <span className="px-1 text-gray-500 self-center">...</span>
                          <button
                            onClick={() => setPagination(prev => ({ ...prev, page: totalPages }))}
                            className={`px-2 py-1 sm:px-3 sm:py-1 rounded-lg transition-all text-xs sm:text-sm ${
                              pagination.page === totalPages
                                ? 'bg-purple-600 text-white'
                                : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50'
                            }`}
                          >
                            {totalPages}
                          </button>
                        </>
                      )}
                    </div>
                    
                    <button
                      onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                      disabled={pagination.page === totalPages}
                      className="px-2 py-1 sm:px-3 sm:py-1 bg-gray-800/50 text-white rounded-lg hover:bg-gray-700/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-xs sm:text-sm"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Animation Styles */}
      <style jsx>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.1); }
        }
        .animate-pulse-slow { animation: pulse-slow 4s ease-in-out infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
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
  );
}
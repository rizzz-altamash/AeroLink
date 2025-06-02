// // app/dashboard/admin/recent-activity/page.jsx
// 'use client';

// import { useState, useEffect } from 'react';
// import { useSession } from 'next-auth/react';
// import { useRouter } from 'next/navigation';
// import toast from 'react-hot-toast';

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

// export default function AdminRecentActivityPage() {
//   const { data: session } = useSession();
//   const router = useRouter();
//   const [activities, setActivities] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [page, setPage] = useState(1);
//   const [total, setTotal] = useState(0);
//   const [filters, setFilters] = useState({
//     activityType: 'all',
//     dateRange: '7days'
//   });

//   const limit = 50;

//   useEffect(() => {
//     fetchActivities();
//   }, [page, filters]);

//   const fetchActivities = async () => {
//     setLoading(true);
//     try {
//       const params = new URLSearchParams({
//         page: page.toString(),
//         limit: limit.toString(),
//         ...filters
//       });

//       const res = await fetch(`/api/admin/activity/detailed?${params}`);
//       if (!res.ok) throw new Error('Failed to fetch activities');
      
//       const data = await res.json();
//       setActivities(data.activities);
//       setTotal(data.total);
//     } catch (error) {
//       console.error('Error fetching activities:', error);
//       toast.error('Failed to load activities');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleFilterChange = (key, value) => {
//     setFilters(prev => ({ ...prev, [key]: value }));
//     setPage(1);
//   };

//   const totalPages = Math.ceil(total / limit);

//   return (
//     <div className="min-h-screen bg-gray-950">
//       {/* Background Pattern and Gradient - Purple Theme for Admin */}
//       <div className="fixed inset-0 bg-gray-950">
//         {/* Grid Pattern */}
//         <div 
//           className="absolute inset-0 bg-[size:4rem_4rem] opacity-20"
//           style={{
//             backgroundImage: `linear-gradient(to right, #a855f715 1px, transparent 1px), linear-gradient(to bottom, #a855f715 1px, transparent 1px)`
//           }}
//         ></div>
        
//         {/* Gradient Overlay */}
//         <div className="absolute inset-0 bg-gradient-to-br from-purple-950/50 via-gray-950 to-indigo-950/50"></div>
        
//         {/* Animated Background Elements */}
//         <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
//         <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl animate-pulse-slow animation-delay-2000"></div>
//         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse-slow animation-delay-4000"></div>
//       </div>

//       <div className="relative z-10 p-8">
//         {/* Header with Animation */}
//         <div className="mb-8 animate-fade-in">
//           <div className="flex items-center gap-4 mb-2">
//             <button
//               onClick={() => router.back()}
//               className="text-gray-400 hover:text-white transition-all hover:scale-110 group"
//             >
//               <BackIcon className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
//             </button>
//             <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
//               System Activity Log
//             </h1>
//           </div>
//           <p className="text-gray-400 ml-10">Complete activity history across the platform</p>
//         </div>

//         {/* Stats Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
//           <StatCard
//             title="Total Activities"
//             value={total}
//             icon={ActivityIcon}
//             gradient="from-purple-600 to-indigo-600"
//             delay="0"
//           />
//           <StatCard
//             title="Deliveries"
//             value={activities.filter(a => a.type === 'delivery').length}
//             icon={DeliveryIcon}
//             gradient="from-blue-600 to-cyan-600"
//             delay="100"
//           />
//           <StatCard
//             title="User Activities"
//             value={activities.filter(a => a.type === 'user').length}
//             icon={UsersIcon}
//             gradient="from-green-600 to-emerald-600"
//             delay="200"
//           />
//           <StatCard
//             title="System Events"
//             value={activities.filter(a => a.type === 'system').length}
//             icon={SystemIcon}
//             gradient="from-orange-600 to-red-600"
//             delay="300"
//           />
//         </div>

//         {/* Filters */}
//         <div className="bg-gray-900/60 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/20 hover:border-purple-500/30 transition-all mb-6 animate-fade-in-up">
//           <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
//             <FilterIcon className="w-5 h-5 text-purple-400" />
//             Filter Activities
//           </h3>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div className="group">
//               <label className="text-sm text-gray-400 block mb-2 group-hover:text-purple-400 transition-colors">
//                 Activity Type
//               </label>
//               <select
//                 value={filters.activityType}
//                 onChange={(e) => handleFilterChange('activityType', e.target.value)}
//                 className="w-full bg-gray-800/70 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all hover:bg-gray-800"
//               >
//                 <option value="all">All Activities</option>
//                 <option value="delivery">Delivery Activities</option>
//                 <option value="user">User Activities</option>
//                 <option value="system">System Events</option>
//                 <option value="pilot">Pilot Activities</option>
//                 <option value="hospital">Hospital Activities</option>
//               </select>
//             </div>

//             <div className="group">
//               <label className="text-sm text-gray-400 block mb-2 group-hover:text-purple-400 transition-colors">
//                 Date Range
//               </label>
//               <select
//                 value={filters.dateRange}
//                 onChange={(e) => handleFilterChange('dateRange', e.target.value)}
//                 className="w-full bg-gray-800/70 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all hover:bg-gray-800"
//               >
//                 <option value="today">Today</option>
//                 <option value="7days">Last 7 Days</option>
//                 <option value="30days">Last 30 Days</option>
//                 <option value="90days">Last 90 Days</option>
//                 <option value="all">All Time</option>
//               </select>
//             </div>
//           </div>
//         </div>

//         {/* Activities Table */}
//         <div className="bg-gray-900/60 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/20 hover:border-purple-500/30 transition-all animate-fade-in-up animation-delay-200">
//           <div className="flex items-center justify-between mb-6">
//             <h2 className="text-xl font-semibold text-white">Activity History</h2>
//             {!loading && (
//               <div className="flex items-center gap-2">
//                 <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
//                 <span className="text-xs text-gray-400">Live Data</span>
//               </div>
//             )}
//           </div>

//           {loading ? (
//             <LoadingSpinner />
//           ) : activities.length === 0 ? (
//             <div className="text-center py-12">
//               <EmptyIcon className="w-16 h-16 text-gray-600 mx-auto mb-4 opacity-50" />
//               <p className="text-gray-500 text-lg">No activities found</p>
//               <p className="text-gray-600 text-sm mt-1">Try adjusting your filters</p>
//             </div>
//           ) : (
//             <>
//               <div className="overflow-x-auto">
//                 <table className="w-full">
//                   <thead>
//                     <tr className="text-left border-b border-gray-800">
//                       <th className="pb-3 text-sm font-medium text-gray-400">Activity</th>
//                       <th className="pb-3 text-sm font-medium text-gray-400">Type</th>
//                       <th className="pb-3 text-sm font-medium text-gray-400">User/Entity</th>
//                       <th className="pb-3 text-sm font-medium text-gray-400">Details</th>
//                       <th className="pb-3 text-sm font-medium text-gray-400">Time</th>
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y divide-gray-800">
//                     {activities.map((activity, index) => (
//                       <ActivityRow key={activity._id} activity={activity} delay={index * 50} />
//                     ))}
//                   </tbody>
//                 </table>
//               </div>

//               {/* Pagination */}
//               {totalPages > 1 && (
//                 <div className="mt-6 flex items-center justify-between">
//                   <p className="text-sm text-gray-400">
//                     Showing <span className="text-purple-400 font-medium">{(page - 1) * limit + 1}</span> to{' '}
//                     <span className="text-purple-400 font-medium">{Math.min(page * limit, total)}</span> of{' '}
//                     <span className="text-purple-400 font-medium">{total}</span> activities
//                   </p>
//                   <div className="flex items-center gap-2">
//                     <button
//                       onClick={() => setPage(p => Math.max(1, p - 1))}
//                       disabled={page === 1}
//                       className="px-4 py-2 bg-gray-800/70 hover:bg-gray-700/70 disabled:bg-gray-900/70 disabled:text-gray-600 text-white rounded-lg transition-all hover:scale-105 disabled:scale-100 backdrop-blur-sm border border-gray-700 hover:border-purple-500/50 disabled:border-gray-800"
//                     >
//                       Previous
//                     </button>
//                     <span className="text-white px-4 py-2 bg-purple-500/10 rounded-lg border border-purple-500/20">
//                       Page <span className="font-bold text-purple-400">{page}</span> of <span className="font-bold text-purple-400">{totalPages}</span>
//                     </span>
//                     <button
//                       onClick={() => setPage(p => Math.min(totalPages, p + 1))}
//                       disabled={page === totalPages}
//                       className="px-4 py-2 bg-gray-800/70 hover:bg-gray-700/70 disabled:bg-gray-900/70 disabled:text-gray-600 text-white rounded-lg transition-all hover:scale-105 disabled:scale-100 backdrop-blur-sm border border-gray-700 hover:border-purple-500/50 disabled:border-gray-800"
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
//         .animation-delay-4000 { animation-delay: 4s; }
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

// // Stat Card Component
// function StatCard({ title, value, icon: Icon, gradient, delay }) {
//   return (
//     <div 
//       className="bg-gray-900/60 backdrop-blur-xl rounded-xl p-4 border border-purple-500/20 hover:border-purple-500/30 transition-all hover:scale-105 animate-fade-in-up group"
//       style={{ animationDelay: `${delay}ms` }}
//     >
//       <div className="flex items-center justify-between">
//         <div>
//           <p className="text-gray-400 text-sm">{title}</p>
//           <p className="text-2xl font-bold text-white mt-1">{value}</p>
//         </div>
//         <div className={`w-12 h-12 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
//           <Icon className="w-6 h-6 text-white" />
//         </div>
//       </div>
//     </div>
//   );
// }

// // Activity Row Component
// function ActivityRow({ activity, delay }) {
//   const typeColors = {
//     delivery: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
//     user: 'bg-green-500/20 text-green-400 border-green-500/30',
//     system: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
//     pilot: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
//     hospital: 'bg-pink-500/20 text-pink-400 border-pink-500/30'
//   };

//   const typeColor = typeColors[activity.type] || 'bg-gray-500/20 text-gray-400 border-gray-500/30';

//   return (
//     <tr 
//       className="hover:bg-gray-800/50 transition-all hover:shadow-lg animate-fade-in group"
//       style={{ animationDelay: `${delay}ms` }}
//     >
//       <td className="py-4">
//         <p className="text-white font-medium">{activity.action}</p>
//       </td>
//       <td className="py-4">
//         <span className={`px-3 py-1 rounded-full text-xs font-medium border ${typeColor} backdrop-blur-sm`}>
//           {activity.type}
//         </span>
//       </td>
//       <td className="py-4">
//         <div className="flex items-center gap-2">
//           <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
//             <span className="text-white text-xs font-medium">
//               {activity.userName?.charAt(0).toUpperCase() || '?'}
//             </span>
//           </div>
//           <span className="text-gray-300">{activity.userName || 'System'}</span>
//         </div>
//       </td>
//       <td className="py-4">
//         <p className="text-gray-400 text-sm">{activity.details}</p>
//       </td>
//       <td className="py-4">
//         <p className="text-gray-400 text-sm">{activity.timeAgo}</p>
//       </td>
//     </tr>
//   );
// }

// // Icon Components
// const BackIcon = ({ className }) => (
//   <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
//   </svg>
// );

// const ActivityIcon = ({ className }) => (
//   <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
//   </svg>
// );

// const DeliveryIcon = ({ className }) => (
//   <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
//   </svg>
// );

// const UsersIcon = ({ className }) => (
//   <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
//   </svg>
// );

// const SystemIcon = ({ className }) => (
//   <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
//   </svg>
// );

// const FilterIcon = ({ className }) => (
//   <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
//   </svg>
// );

// const EmptyIcon = ({ className }) => (
//   <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
//   </svg>
// );






























// // app/dashboard/admin/recent-activity/page.jsx
// 'use client';

// import { useState, useEffect } from 'react';
// import { useSession } from 'next-auth/react';
// import { useRouter } from 'next/navigation';
// import toast from 'react-hot-toast';

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

// export default function AdminRecentActivityPage() {
//   const { data: session } = useSession();
//   const router = useRouter();
//   const [activities, setActivities] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [page, setPage] = useState(1);
//   const [total, setTotal] = useState(0);
//   const [filters, setFilters] = useState({
//     activityType: 'all',
//     dateRange: '7days'
//   });

//   const limit = 50;

//   useEffect(() => {
//     fetchActivities();
//   }, [page, filters]);

//   const fetchActivities = async () => {
//     setLoading(true);
//     try {
//       const params = new URLSearchParams({
//         page: page.toString(),
//         limit: limit.toString(),
//         ...filters
//       });

//       const res = await fetch(`/api/admin/activity/detailed?${params}`);
//       if (!res.ok) throw new Error('Failed to fetch activities');
      
//       const data = await res.json();
//       setActivities(data.activities);
//       setTotal(data.total);
//     } catch (error) {
//       console.error('Error fetching activities:', error);
//       toast.error('Failed to load activities');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleFilterChange = (key, value) => {
//     setFilters(prev => ({ ...prev, [key]: value }));
//     setPage(1);
//   };

//   const totalPages = Math.ceil(total / limit);

//   return (
//     <div className="min-h-screen bg-gray-950">
//       {/* Background Pattern and Gradient - Purple Theme for Admin */}
//       <div className="fixed inset-0 bg-gray-950">
//         {/* Grid Pattern */}
//         <div 
//           className="absolute inset-0 bg-[size:4rem_4rem] opacity-20"
//           style={{
//             backgroundImage: `linear-gradient(to right, #a855f715 1px, transparent 1px), linear-gradient(to bottom, #a855f715 1px, transparent 1px)`
//           }}
//         ></div>
        
//         {/* Gradient Overlay */}
//         <div className="absolute inset-0 bg-gradient-to-br from-purple-950/50 via-gray-950 to-indigo-950/50"></div>
        
//         {/* Animated Background Elements */}
//         <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
//         <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl animate-pulse-slow animation-delay-2000"></div>
//         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse-slow animation-delay-4000"></div>
//       </div>

//       <div className="relative z-10 p-8">
//         {/* Header with Animation */}
//         <div className="mb-8 animate-fade-in">
//           <div className="flex items-center gap-4 mb-2">
//             <button
//               onClick={() => router.back()}
//               className="text-gray-400 hover:text-white transition-all hover:scale-110 group"
//             >
//               <BackIcon className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
//             </button>
//             <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
//               System Activity Log
//             </h1>
//           </div>
//           <p className="text-gray-400 ml-10">Complete activity history across the platform</p>
//         </div>

//         {/* Stats Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
//           <StatCard
//             title="Total Activities"
//             value={total}
//             icon={ActivityIcon}
//             gradient="from-purple-600 to-indigo-600"
//             delay="0"
//           />
//           <StatCard
//             title="Medical Staff"
//             value={activities.filter(a => a.type === 'delivery').length}
//             icon={DeliveryIcon}
//             gradient="from-blue-600 to-cyan-600"
//             delay="100"
//           />
//           <StatCard
//             title="Pilot Activities"
//             value={activities.filter(a => a.type === 'pilot').length}
//             icon={PilotIcon}
//             gradient="from-green-600 to-emerald-600"
//             delay="200"
//           />
//           <StatCard
//             title="Admin Actions"
//             value={activities.filter(a => a.type === 'system').length}
//             icon={SystemIcon}
//             gradient="from-orange-600 to-red-600"
//             delay="300"
//           />
//         </div>

//         {/* Filters */}
//         <div className="bg-gray-900/60 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/20 hover:border-purple-500/30 transition-all mb-6 animate-fade-in-up">
//           <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
//             <FilterIcon className="w-5 h-5 text-purple-400" />
//             Filter Activities
//           </h3>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div className="group">
//               <label className="text-sm text-gray-400 block mb-2 group-hover:text-purple-400 transition-colors">
//                 Activity Type
//               </label>
//               <select
//                 value={filters.activityType}
//                 onChange={(e) => handleFilterChange('activityType', e.target.value)}
//                 className="w-full bg-gray-800/70 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all hover:bg-gray-800"
//               >
//                 <option value="all">All Activities</option>
//                 <option value="delivery">Medical Staff Activities</option>
//                 <option value="hospital">Hospital Admin Activities</option>
//                 <option value="pilot">Pilot Activities</option>
//                 <option value="system">Admin Actions</option>
//                 <option value="user">User Registrations</option>
//               </select>
//             </div>

//             <div className="group">
//               <label className="text-sm text-gray-400 block mb-2 group-hover:text-purple-400 transition-colors">
//                 Date Range
//               </label>
//               <select
//                 value={filters.dateRange}
//                 onChange={(e) => handleFilterChange('dateRange', e.target.value)}
//                 className="w-full bg-gray-800/70 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all hover:bg-gray-800"
//               >
//                 <option value="today">Today</option>
//                 <option value="7days">Last 7 Days</option>
//                 <option value="30days">Last 30 Days</option>
//                 <option value="90days">Last 90 Days</option>
//                 <option value="all">All Time</option>
//               </select>
//             </div>
//           </div>
//         </div>

//         {/* Activities Table */}
//         <div className="bg-gray-900/60 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/20 hover:border-purple-500/30 transition-all animate-fade-in-up animation-delay-200">
//           <div className="flex items-center justify-between mb-6">
//             <h2 className="text-xl font-semibold text-white">Activity History</h2>
//             {!loading && (
//               <div className="flex items-center gap-2">
//                 <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
//                 <span className="text-xs text-gray-400">Live Data</span>
//               </div>
//             )}
//           </div>

//           {loading ? (
//             <LoadingSpinner />
//           ) : activities.length === 0 ? (
//             <div className="text-center py-12">
//               <EmptyIcon className="w-16 h-16 text-gray-600 mx-auto mb-4 opacity-50" />
//               <p className="text-gray-500 text-lg">No activities found</p>
//               <p className="text-gray-600 text-sm mt-1">Try adjusting your filters</p>
//             </div>
//           ) : (
//             <>
//               <div className="overflow-x-auto">
//                 <table className="w-full">
//                   <thead>
//                     <tr className="text-left border-b border-gray-800">
//                       <th className="pb-3 text-sm font-medium text-gray-400">Activity</th>
//                       <th className="pb-3 text-sm font-medium text-gray-400">Type</th>
//                       <th className="pb-3 text-sm font-medium text-gray-400">User/Entity</th>
//                       <th className="pb-3 text-sm font-medium text-gray-400">Details</th>
//                       <th className="pb-3 text-sm font-medium text-gray-400">Time</th>
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y divide-gray-800">
//                     {activities.map((activity, index) => (
//                       <ActivityRow key={activity._id} activity={activity} delay={index * 50} />
//                     ))}
//                   </tbody>
//                 </table>
//               </div>

//               {/* Pagination */}
//               {totalPages > 1 && (
//                 <div className="mt-6 flex items-center justify-between">
//                   <p className="text-sm text-gray-400">
//                     Showing <span className="text-purple-400 font-medium">{(page - 1) * limit + 1}</span> to{' '}
//                     <span className="text-purple-400 font-medium">{Math.min(page * limit, total)}</span> of{' '}
//                     <span className="text-purple-400 font-medium">{total}</span> activities
//                   </p>
//                   <div className="flex items-center gap-2">
//                     <button
//                       onClick={() => setPage(p => Math.max(1, p - 1))}
//                       disabled={page === 1}
//                       className="px-4 py-2 bg-gray-800/70 hover:bg-gray-700/70 disabled:bg-gray-900/70 disabled:text-gray-600 text-white rounded-lg transition-all hover:scale-105 disabled:scale-100 backdrop-blur-sm border border-gray-700 hover:border-purple-500/50 disabled:border-gray-800"
//                     >
//                       Previous
//                     </button>
//                     <span className="text-white px-4 py-2 bg-purple-500/10 rounded-lg border border-purple-500/20">
//                       Page <span className="font-bold text-purple-400">{page}</span> of <span className="font-bold text-purple-400">{totalPages}</span>
//                     </span>
//                     <button
//                       onClick={() => setPage(p => Math.min(totalPages, p + 1))}
//                       disabled={page === totalPages}
//                       className="px-4 py-2 bg-gray-800/70 hover:bg-gray-700/70 disabled:bg-gray-900/70 disabled:text-gray-600 text-white rounded-lg transition-all hover:scale-105 disabled:scale-100 backdrop-blur-sm border border-gray-700 hover:border-purple-500/50 disabled:border-gray-800"
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
//         .animation-delay-4000 { animation-delay: 4s; }
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

// // Stat Card Component
// function StatCard({ title, value, icon: Icon, gradient, delay }) {
//   return (
//     <div 
//       className="bg-gray-900/60 backdrop-blur-xl rounded-xl p-4 border border-purple-500/20 hover:border-purple-500/30 transition-all hover:scale-105 animate-fade-in-up group"
//       style={{ animationDelay: `${delay}ms` }}
//     >
//       <div className="flex items-center justify-between">
//         <div>
//           <p className="text-gray-400 text-sm">{title}</p>
//           <p className="text-2xl font-bold text-white mt-1">{value}</p>
//         </div>
//         <div className={`w-12 h-12 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
//           <Icon className="w-6 h-6 text-white" />
//         </div>
//       </div>
//     </div>
//   );
// }

// // Activity Row Component
// function ActivityRow({ activity, delay }) {
//   const typeColors = {
//     delivery: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
//     user: 'bg-green-500/20 text-green-400 border-green-500/30',
//     system: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
//     pilot: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
//     hospital: 'bg-pink-500/20 text-pink-400 border-pink-500/30'
//   };

//   const typeLabels = {
//     delivery: 'Medical Staff',
//     user: 'Registration',
//     system: 'Admin',
//     pilot: 'Pilot',
//     hospital: 'Hospital Admin'
//   };

//   const typeColor = typeColors[activity.type] || 'bg-gray-500/20 text-gray-400 border-gray-500/30';
//   const typeLabel = typeLabels[activity.type] || activity.type;

//   return (
//     <tr 
//       className="hover:bg-gray-800/50 transition-all hover:shadow-lg animate-fade-in group"
//       style={{ animationDelay: `${delay}ms` }}
//     >
//       <td className="py-4">
//         <p className="text-white font-medium">{activity.action}</p>
//       </td>
//       <td className="py-4">
//         <span className={`px-3 py-1 rounded-full text-xs font-medium border ${typeColor} backdrop-blur-sm`}>
//           {typeLabel}
//         </span>
//       </td>
//       <td className="py-4">
//         <div className="flex items-center gap-2">
//           <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
//             <span className="text-white text-xs font-medium">
//               {activity.userName?.charAt(0).toUpperCase() || '?'}
//             </span>
//           </div>
//           <span className="text-gray-300">{activity.userName || 'System'}</span>
//         </div>
//       </td>
//       <td className="py-4">
//         <p className="text-gray-400 text-sm">{activity.details}</p>
//       </td>
//       <td className="py-4">
//         <p className="text-gray-400 text-sm">{activity.timeAgo}</p>
//       </td>
//     </tr>
//   );
// }

// // Icon Components
// const BackIcon = ({ className }) => (
//   <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
//   </svg>
// );

// const ActivityIcon = ({ className }) => (
//   <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
//   </svg>
// );

// const DeliveryIcon = ({ className }) => (
//   <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
//   </svg>
// );

// const PilotIcon = ({ className }) => (
//   <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
//   </svg>
// );

// const SystemIcon = ({ className }) => (
//   <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
//   </svg>
// );

// const FilterIcon = ({ className }) => (
//   <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
//   </svg>
// );

// const EmptyIcon = ({ className }) => (
//   <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
//   </svg>
// );






























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
  <div className="flex flex-col items-center justify-center py-12">
    <div className="relative">
      <div className="w-16 h-16 border-4 border-purple-500/20 rounded-full"></div>
      <div className="w-16 h-16 border-4 border-purple-500 rounded-full animate-spin absolute top-0 left-0 border-t-transparent"></div>
    </div>
    <p className="text-gray-400 mt-4 animate-pulse">Loading activities...</p>
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
        return <MedicalStaffIcon className="w-5 h-5 text-blue-400" />;
      case 'hospital_admin':
        return <HospitalAdminIcon className="w-5 h-5 text-red-400" />;
      case 'admin':
        return <AdminIcon className="w-5 h-5 text-purple-400" />;
      case 'pilot':
        return <PilotIcon className="w-5 h-5 text-green-400" />;
      default:
        return <ActivityIcon className="w-5 h-5 text-gray-400" />;
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
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <p className="text-white">Unauthorized</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Background Pattern - Purple Theme for Admin */}
      <div className="fixed inset-0 bg-gray-950">
        <div 
          className="absolute inset-0 bg-[size:4rem_4rem] opacity-20"
          style={{
            backgroundImage: `linear-gradient(to right, #a855f715 1px, transparent 1px), linear-gradient(to bottom, #a855f715 1px, transparent 1px)`
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-br from-purple-950/50 via-gray-950 to-indigo-950/50"></div>
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl animate-pulse-slow animation-delay-2000"></div>
      </div>

      <div className="relative z-10 p-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4 group"
          >
            <BackIcon className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Dashboard</span>
          </button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent mb-2">
                System Activity Log
              </h1>
              <p className="text-gray-400">Monitor all system activities across different user roles</p>
            </div>

            <div className="flex gap-4">
              <button
                onClick={fetchActivities}
                className="px-4 py-2 bg-gray-800/50 text-white rounded-xl hover:bg-gray-700/50 transition-all flex items-center gap-2 border border-purple-500/20 hover:border-purple-500/30"
              >
                <RefreshIcon className="w-5 h-5" />
                Refresh
              </button>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="px-4 py-2 bg-purple-600/20 text-purple-400 rounded-xl hover:bg-purple-600/30 transition-all flex items-center gap-2 border border-purple-500/30"
              >
                <FilterIcon className="w-5 h-5" />
                Filters
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="bg-gray-900/60 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/20 mb-6 animate-fade-in-up">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Activity Type</label>
                <select
                  value={filters.activityType}
                  onChange={(e) => handleFilterChange('activityType', e.target.value)}
                  className="w-full px-4 py-2 bg-gray-800/70 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
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
                <label className="block text-sm font-medium text-gray-400 mb-2">User Role</label>
                <select
                  value={filters.userRole}
                  onChange={(e) => handleFilterChange('userRole', e.target.value)}
                  className="w-full px-4 py-2 bg-gray-800/70 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="all">All Roles</option>
                  <option value="medical_staff">Medical Staff</option>
                  <option value="hospital_admin">Hospital Admin</option>
                  <option value="admin">System Admin</option>
                  <option value="pilot">Pilot</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Urgency</label>
                <select
                  value={filters.urgency}
                  onChange={(e) => handleFilterChange('urgency', e.target.value)}
                  className="w-full px-4 py-2 bg-gray-800/70 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="all">All Urgency</option>
                  <option value="routine">Routine</option>
                  <option value="urgent">Urgent</option>
                  <option value="emergency">Emergency</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Date Range</label>
                <select
                  value={filters.dateRange}
                  onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                  className="w-full px-4 py-2 bg-gray-800/70 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="today">Today</option>
                  <option value="7days">Last 7 Days</option>
                  <option value="30days">Last 30 Days</option>
                  <option value="90days">Last 90 Days</option>
                  <option value="all">All Time</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Search</label>
                <div className="relative">
                  <input
                    type="text"
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    placeholder="Order ID or username..."
                    className="w-full px-4 py-2 pl-10 bg-gray-800/70 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                  <SearchIcon className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Activities Table */}
        <div className="bg-gray-900/60 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/20 animate-fade-in-up animation-delay-200">
          {loading ? (
            <LoadingSpinner />
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left border-b border-gray-800">
                      <th className="pb-3 text-sm font-medium text-gray-400">Timestamp</th>
                      <th className="pb-3 text-sm font-medium text-gray-400">User</th>
                      <th className="pb-3 text-sm font-medium text-gray-400">Activity</th>
                      <th className="pb-3 text-sm font-medium text-gray-400">Order ID</th>
                      <th className="pb-3 text-sm font-medium text-gray-400">Package Type</th>
                      <th className="pb-3 text-sm font-medium text-gray-400">Urgency</th>
                      <th className="pb-3 text-sm font-medium text-gray-400">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {activities.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="py-8 text-center text-gray-500">
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
                          <td className="py-3">
                            <span className="text-gray-300">
                              {new Date(activity.timestamp).toLocaleString()}
                            </span>
                            <span className="text-gray-500 text-xs block">
                              {activity.timeAgo}
                            </span>
                          </td>
                          <td className="py-3">
                            <div className="flex items-center gap-2">
                              {getActivityIcon(activity)}
                              <div>
                                <span className="text-white font-medium">{activity.userName}</span>
                                <span className="text-gray-500 text-xs block capitalize">
                                  {activity.userRole?.replace('_', ' ')}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="py-3">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getActivityColor(activity.activityType)}`}>
                              {activity.action}
                            </span>
                          </td>
                          <td className="py-3">
                            <span className="text-white font-mono">{activity.orderId}</span>
                          </td>
                          <td className="py-3">
                            <span className="text-gray-300 capitalize">{activity.packageType}</span>
                          </td>
                          <td className="py-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${urgencyColors[activity.urgency] || urgencyColors.routine}`}>
                              {activity.urgency}
                            </span>
                          </td>
                          <td className="py-3">
                            <button
                              onClick={() => router.push(`/dashboard/delivery/${activity.deliveryId}`)}
                              className="text-purple-400 hover:text-purple-300 text-sm"
                            >
                              View Delivery
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-6 flex items-center justify-between">
                  <p className="text-gray-400 text-sm">
                    Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} activities
                  </p>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                      disabled={pagination.page === 1}
                      className="px-3 py-1 bg-gray-800/50 text-white rounded-lg hover:bg-gray-700/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      Previous
                    </button>
                    
                    {[...Array(Math.min(5, totalPages))].map((_, i) => {
                      const pageNum = i + 1;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setPagination(prev => ({ ...prev, page: pageNum }))}
                          className={`px-3 py-1 rounded-lg transition-all ${
                            pagination.page === pageNum
                              ? 'bg-purple-600 text-white'
                              : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    
                    <button
                      onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                      disabled={pagination.page === totalPages}
                      className="px-3 py-1 bg-gray-800/50 text-white rounded-lg hover:bg-gray-700/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
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
// // components/dashboard/MedicalStaffDashboard.jsx
// 'use client';

// import { useState, useEffect } from 'react';
// import { useSession } from 'next-auth/react';
// import { useRouter } from 'next/navigation';
// import NotificationBell from '@/components/NotificationBell';
// import toast from 'react-hot-toast';

// // Icon Components - Define at the top
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

// const DroneIcon = ({ className }) => (
//   <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
//   </svg>
// );

// const BatteryIcon = ({ className }) => (
//   <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
//   </svg>
// );

// const AssignedIcon = ({ className }) => (
//   <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//   </svg>
// );

// const CheckIcon = ({ className }) => (
//   <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//   </svg>
// );

// const FailedIcon = ({ className }) => (
//   <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//   </svg>
// );

// // Confirmation Icon - for pending confirmation status
// const ConfirmationIcon = ({ className }) => (
//   <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//   </svg>
// );

// // Flight Icon - for in-transit status
// const FlightIcon = ({ className }) => (
//   <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
//   </svg>
// );

// // Warning Icon - for alerts and warnings
// const WarningIcon = ({ className }) => (
//   <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
//   </svg>
// );

// const LoadingSpinner = () => (
//   <svg className="animate-spin h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24">
//     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//   </svg>
// );

// export default function MedicalStaffDashboard() {
//   const { data: session } = useSession();
//   const router = useRouter();
//   const [loading, setLoading] = useState(true);
//   const [activeDeliveries, setActiveDeliveries] = useState([]);
//   const [recentDeliveries, setRecentDeliveries] = useState([]);
//   const [stats, setStats] = useState({
//     todayDeliveries: 0,
//     pendingPickups: 0,
//     inTransit: 0,
//     avgDeliveryTime: 0
//   });
//   const [selectedDelivery, setSelectedDelivery] = useState(null);
//   const [showTrackingModal, setShowTrackingModal] = useState(false);

//   useEffect(() => {
//     fetchDashboardData();
//     // Set up auto-refresh for active deliveries
//     const interval = setInterval(() => {
//       fetchActiveDeliveries();
//     }, 30000); // Refresh every 30 seconds

//     return () => clearInterval(interval);
//   }, []);

//   const fetchDashboardData = async () => {
//     setLoading(true);
//     try {
//       await Promise.all([
//         fetchActiveDeliveries(),
//         fetchRecentDeliveries(),
//         fetchStats()
//       ]);
//     } catch (error) {
//       toast.error('Failed to load dashboard data');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchActiveDeliveries = async () => {
//     try {
//       const res = await fetch('/api/deliveries/active');
//       if (!res.ok) throw new Error('Failed to fetch');
//       const data = await res.json();
//       setActiveDeliveries(data);
//     } catch (error) {
//       console.error('Failed to fetch active deliveries:', error);
//     }
//   };

//   const fetchRecentDeliveries = async () => {
//     try {
//       const res = await fetch('/api/deliveries/recent');
//       if (!res.ok) throw new Error('Failed to fetch');
//       const data = await res.json();
//       setRecentDeliveries(data);
//     } catch (error) {
//       console.error('Failed to fetch recent deliveries:', error);
//     }
//   };

//   const fetchStats = async () => {
//     try {
//       const res = await fetch('/api/staff/stats');
//       if (!res.ok) throw new Error('Failed to fetch');
//       const data = await res.json();
//       setStats(data);
//     } catch (error) {
//       console.error('Failed to fetch stats:', error);
//     }
//   };

//   const handleNewDelivery = (urgency) => {
//     router.push(`/dashboard/new-delivery?urgency=${urgency}`);
//   };

//   const handleTrackDelivery = async (delivery) => {
//     setSelectedDelivery(delivery);
//     setShowTrackingModal(true);
//   };

//   const handleCancelDelivery = async (deliveryId) => {
//     if (!confirm('Are you sure you want to cancel this delivery?')) return;

//     try {
//       const res = await fetch(`/api/deliveries/${deliveryId}/cancel`, {
//         method: 'POST'
//       });

//       if (!res.ok) {
//         const error = await res.json();
//         throw new Error(error.error || 'Failed to cancel delivery');
//       }

//       toast.success('Delivery cancelled successfully');
//       fetchDashboardData();
//     } catch (error) {
//       toast.error(error.message || 'Failed to cancel delivery');
//       console.error('Cancel error:', error);
//     }
//   };


//   if (loading) {
//     return <DashboardSkeleton />;
//   }

//   return (
//     <div className="p-8 relative">
//       {/* Animated Background Elements */}
//       <div className="fixed inset-0 overflow-hidden pointer-events-none">
//         <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-500/5 rounded-full blur-3xl animate-pulse-slow"></div>
//         <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-rose-500/5 rounded-full blur-3xl animate-pulse-slow animation-delay-2000"></div>
//       </div>

//       {/* Header */}
//       <div className="mb-8 relative">
//         <h1 className="text-3xl font-bold text-white mb-2 flex justify-between">Medical Staff Dashboard <NotificationBell /></h1>
//         <p className="text-gray-400">Welcome back, {session?.user?.name}</p>
//       </div>

//       {/* Quick Actions with animations */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
//         <QuickActionCard
//           title="Standard Delivery"
//           description="Regular medical supplies and documents"
//           icon={PackageIcon}
//           gradient="from-blue-600 to-cyan-600"
//           onClick={() => handleNewDelivery('routine')}
//           delay="0"
//         />
//         <QuickActionCard
//           title="Urgent Delivery"
//           description="Time-sensitive medications and samples"
//           icon={UrgentIcon}
//           gradient="from-orange-600 to-amber-600"
//           onClick={() => handleNewDelivery('urgent')}
//           delay="100"
//         />
//         <QuickActionCard
//           title="Emergency Delivery"
//           description="Critical supplies, blood, organs"
//           icon={EmergencyIcon}
//           gradient="from-red-600 to-rose-600"
//           onClick={() => handleNewDelivery('emergency')}
//           delay="200"
//         />
//       </div>

//       {/* Stats Overview with loading states */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
//         <StatCard
//           title="Today's Deliveries"
//           value={stats.todayDeliveries}
//           icon={TodayIcon}
//           color="text-blue-400"
//           bgColor="bg-blue-500/20"
//           trend="+12%"
//           delay="0"
//         />
//         <StatCard
//           title="Pending Pickup"
//           value={stats.pendingPickups}
//           icon={PendingIcon}
//           color="text-yellow-400"
//           bgColor="bg-yellow-500/20"
//           trend="-5%"
//           delay="100"
//         />
//         <StatCard
//           title="In Transit"
//           value={stats.inTransit}
//           icon={TransitIcon}
//           color="text-purple-400"
//           bgColor="bg-purple-500/20"
//           delay="200"
//         />
//         <StatCard
//           title="Avg. Delivery Time"
//           value={`${stats.avgDeliveryTime} min`}
//           icon={TimeIcon}
//           color="text-green-400"
//           bgColor="bg-green-500/20"
//           trend="-8%"
//           delay="300"
//         />
//       </div>

//       {/* Active Deliveries with real-time updates */}
//       <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-red-500/20 hover:border-red-500/30 transition-all mb-8 animate-fade-in-up">
//         <div className="flex items-center justify-between mb-6">
//           <div className="flex items-center gap-3">
//             <h2 className="text-xl font-semibold text-white">Active Deliveries</h2>
//             {activeDeliveries.length > 0 && (
//               <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded-full text-xs font-medium animate-pulse">
//                 {activeDeliveries.length} Active
//               </span>
//             )}
//           </div>
//           <button 
//             onClick={() => router.push('/dashboard/track-all')}
//             className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors"
//           >
//             Track All
//           </button>
//         </div>
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//           {activeDeliveries.length === 0 ? (
//             <div className="col-span-full text-center py-12">
//               <DroneIcon className="w-16 h-16 text-gray-600 mx-auto mb-4 opacity-50" />
//               <p className="text-gray-500">No active deliveries at the moment</p>
//               <button 
//                 onClick={() => handleNewDelivery('routine')}
//                 className="mt-4 text-red-400 hover:text-red-300 text-sm font-medium"
//               >
//                 Create New Delivery →
//               </button>
//             </div>
//           ) : (
//             activeDeliveries.map((delivery, index) => (
//               <ActiveDeliveryCard 
//                 key={delivery._id} 
//                 delivery={delivery} 
//                 onTrack={() => handleTrackDelivery(delivery)}
//                 onCancel={() => handleCancelDelivery(delivery._id)}
//                 delay={index * 100}
//               />
//             ))
//           )}
//         </div>
//       </div>

//       {/* Recent Delivery History with filters */}
//       <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-red-500/20 hover:border-red-500/30 transition-all animate-fade-in-up animation-delay-200">
//         <div className="flex items-center justify-between mb-6">
//           <h2 className="text-xl font-semibold text-white">Recent Deliveries</h2>
//           <div className="flex items-center gap-4">
//             <select className="bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-white focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all">
//               <option value="all">All Types</option>
//               <option value="medication">Medication</option>
//               <option value="blood">Blood</option>
//               <option value="medical_supplies">Medical Supplies</option>
//             </select>
//             <button 
//               onClick={() => router.push('/dashboard/delivery-history')}
//               className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors"
//             >
//               View History
//             </button>
//           </div>
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
//                 <th className="pb-3 text-sm font-medium text-gray-400">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-800">
//               {recentDeliveries.length === 0 ? (
//                 <tr>
//                   <td colSpan="7" className="py-8 text-center text-gray-500">
//                     No recent deliveries
//                   </td>
//                 </tr>
//               ) : (
//                 recentDeliveries.map((delivery, index) => (
//                   <RecentDeliveryRow 
//                     key={delivery._id} 
//                     delivery={delivery} 
//                     delay={index * 50}
//                   />
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* Tracking Modal */}
//       {showTrackingModal && selectedDelivery && (
//         <TrackingModal 
//           delivery={selectedDelivery} 
//           onClose={() => {
//             setShowTrackingModal(false);
//             setSelectedDelivery(null);
//           }}
//         />
//       )}
//     </div>
//   );
// }

// // Enhanced Quick Action Card with animations
// function QuickActionCard({ title, description, icon: Icon, gradient, onClick, delay }) {
//   return (
//     <button
//       onClick={onClick}
//       className={`bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-red-500/20 hover:border-red-500/30 transition-all group text-left hover:shadow-lg hover:shadow-red-500/10 transform hover:-translate-y-1 animate-fade-in-up`}
//       style={{ animationDelay: `${delay}ms` }}
//     >
//       <div className={`w-14 h-14 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg group-hover:rotate-3`}>
//         <Icon className="w-8 h-8 text-white" />
//       </div>
//       <h3 className="text-white font-semibold mb-1 group-hover:text-red-300 transition-colors">{title}</h3>
//       <p className="text-gray-400 text-sm">{description}</p>
//       <div className="mt-4 flex items-center text-red-400 text-sm opacity-0 group-hover:opacity-100 transition-opacity">
//         <span>Create delivery</span>
//         <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//         </svg>
//       </div>
//     </button>
//   );
// }

// // Enhanced Stat Card with trends
// function StatCard({ title, value, icon: Icon, color, bgColor, trend, delay }) {
//   const isPositive = trend && trend.startsWith('+');
  
//   return (
//     <div 
//       className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-red-500/20 hover:border-red-500/30 transition-all group animate-fade-in-up"
//       style={{ animationDelay: `${delay}ms` }}
//     >
//       <div className="flex items-center justify-between mb-4">
//         <div className={`w-12 h-12 ${bgColor} backdrop-blur rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
//           <Icon className={`w-6 h-6 ${color}`} />
//         </div>
//         {trend && (
//           <div className={`flex items-center gap-1 text-sm ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
//             {isPositive ? (
//               <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
//               </svg>
//             ) : (
//               <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
//               </svg>
//             )}
//             <span>{trend}</span>
//           </div>
//         )}
//       </div>
//       <div>
//         <p className="text-gray-400 text-sm">{title}</p>
//         <p className="text-2xl font-bold text-white mt-1">{value}</p>
//       </div>
//     </div>
//   );
// }

// // Enhanced Active Delivery Card with actions

// function ActiveDeliveryCard({ delivery, onTrack, onCancel, delay }) {

//   const router = useRouter();

//   const urgencyColors = {
//     routine: 'from-blue-600 to-cyan-600',
//     urgent: 'from-orange-600 to-amber-600',
//     emergency: 'from-red-600 to-rose-600'
//   };

//   const statusIcons = {
//     pending: PendingIcon,
//     pending_approval: PendingIcon,
//     approved: CheckIcon,
//     assigned: AssignedIcon,
//     pickup: PickupIcon,
//     in_transit: FlightIcon,
//     pending_confirmation: ConfirmationIcon ,
//     delivered: DeliveredIcon,
//     failed: FailedIcon
//   };

//   const StatusIcon = statusIcons[delivery.status] || PendingIcon;
//   const urgencyGradient = urgencyColors[delivery.package?.urgency] || urgencyColors.routine;

//   // Check if incoming
//   const isIncoming = delivery.metadata?.deliveryType === 'incoming' || delivery.displayType === 'Incoming Order';

//   return (
//     <div 
//       className="bg-gray-800/50 rounded-xl p-5 hover:bg-gray-800/70 transition-all group animate-scale-in"
//       style={{ animationDelay: `${delay}ms` }}
//     >
//       <div className="flex items-start justify-between mb-4">
//         <div>
//           {/* <h3 className="text-white font-semibold group-hover:text-red-300 transition-colors">{delivery.orderId}</h3> */}
//           <div className="flex items-center gap-2 mb-1">
//             <h3 className="text-white font-semibold group-hover:text-red-300 transition-colors">
//               {delivery.orderId}
//             </h3>
//             {/* Add delivery type badge */}
//             <span className={`text-xs px-2 py-0.5 rounded-full ${
//               isIncoming 
//                 ? 'bg-blue-500/20 text-blue-400' 
//                 : 'bg-orange-500/20 text-orange-400'
//             }`}>
//               {isIncoming ? 'Incoming' : 'Outgoing'}
//             </span>
//           </div>
//           <p className="text-gray-400 text-sm">{delivery.package?.type || 'Package'}</p>
//         </div>
//         <span className={`px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${urgencyGradient} text-white animate-pulse`}>
//           {delivery.package?.urgency || 'routine'}
//         </span>
//       </div>
      
//       <div className="space-y-3">
//         <div className="flex items-center gap-2">
//           <LocationIcon className="w-4 h-4 text-gray-400" />
//           <p className="text-gray-300 text-sm truncate">{isIncoming ? 'To : Your Hospital' : `To : ${delivery.recipient?.name || 'Unknown'}`}</p>
//         </div>
        
//         <div className="flex items-center gap-2">
//           <StatusIcon className="w-4 h-4 text-red-400" />
//           <p className="text-red-400 text-sm capitalize">{delivery.status?.replace('_', ' ')}</p>
//         </div>
        
//         {/* Show approval status for pending approvals */}
//         {delivery.status === 'pending_approval' && (
//           <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-2">
//             <p className="text-xs text-yellow-400">
//               Awaiting hospital admin approval
//             </p>
//             {/* {delivery.autoApprovalInfo && (
//               <p className="text-xs text-yellow-300 mt-1">
//                 Auto-approval in: {delivery.autoApprovalInfo.timeRemaining}
//               </p>
//             )} */}
//           </div>
//         )}
        
//         {/* Show if approved but not assigned */}
//         {delivery.status === 'approved' && !delivery.pilotId && (
//           <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-2">
//             <p className="text-xs text-blue-400">
//               Approved - Awaiting pilot assignment by admin
//             </p>
//           </div>
//         )}
        
//         {/* Show if assigned but not picked up */}
//         {delivery.status === 'assigned' && delivery.pilotId && (
//           <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-2">
//             <p className="text-xs text-purple-400">
//               Pilot assigned - Preparing for pickup
//             </p>
//           </div>
//         )}

//         {/* Show if in transit */}
//         {delivery.status === 'in_transit' && (
//           <div className="bg-lime-500/10 border border-lime-500/30 rounded-lg p-2">
//             <p className="text-xs text-lime-400">
//               Package is on the way - In Transit 🚁
//             </p>
//           </div>
//         )}

//         {/* Show if pending confirmation */}
//         {delivery.status === 'pending_confirmation' && (
//           <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-2">
//             <p className="text-xs text-emerald-400">
//               📦 Package delivered - Awaiting your confirmation
//             </p>
//           </div>
//         )}

//         {/* Show if failed */}
//         {delivery.status === 'failed' && delivery.metadata?.failureReason && (
//           <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-2">
//             <p className="text-xs text-red-400">
//               ❌ Delivery failed
//             </p>
//             <p className="text-xs text-red-300 mt-1">
//               Reason: {delivery.metadata.failureReason}
//             </p>
//           </div>
//         )}
        
//         <div className="flex items-center gap-2">
//           <TimeIcon className="w-4 h-4 text-gray-400" />
//           <p className="text-gray-300 text-sm">
//             ETA: {delivery.delivery?.scheduledTime ? 
//               new Date(delivery.delivery.scheduledTime).toLocaleTimeString() : 
//               'Calculating...'}
//           </p>
//         </div>

//         {/* Battery and Drone Status - only show if drone assigned */}
//         {delivery.tracking?.battery && delivery.droneId && (
//           <div className="flex items-center gap-2">
//             <BatteryIcon className="w-4 h-4 text-gray-400" />
//             <div className="flex-1 bg-gray-700 rounded-full h-2">
//               <div 
//                 className={`h-2 rounded-full transition-all ${
//                   delivery.tracking.battery > 50 ? 'bg-green-500' : 
//                   delivery.tracking.battery > 20 ? 'bg-yellow-500' : 'bg-red-500'
//                 }`}
//                 style={{ width: `${delivery.tracking.battery}%` }}
//               />
//             </div>
//             <span className="text-xs text-gray-400">{delivery.tracking.battery}%</span>
//           </div>
//         )}
//       </div>
      
//       <div className="mt-4 flex gap-2">
//         {/* <button 
//           onClick={onTrack}
//           className="flex-1 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg transition-all text-sm font-medium group"
//         >
//           <span className="flex items-center justify-center gap-1">
//             Track
//             <svg className="w-3 h-3 transform group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//             </svg>
//           </span>
//         </button> */}

//         {/* Show Confirm Receipt button for pending confirmation */}
//         {delivery.status === 'pending_confirmation' && delivery.needsConfirmation ? (
//           <button 
//             onClick={() => router.push(`/dashboard/confirm-delivery/${delivery._id}`)}
//             className="flex-1 py-2 bg-yellow-600/20 hover:bg-yellow-600/30 text-yellow-400 rounded-lg transition-all text-sm font-medium group animate-pulse"
//           >
//             <span className="flex items-center justify-center gap-1">
//               Confirm Receipt
//               <svg className="w-3 h-3 transform group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//               </svg>
//             </span>
//           </button>
//         ) : (
//           <button 
//             onClick={onTrack}
//             className="flex-1 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg transition-all text-sm font-medium group"
//           >
//             <span className="flex items-center justify-center gap-1">
//               Track
//               <svg className="w-3 h-3 transform group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//               </svg>
//             </span>
//           </button>
//         )}

//         {/* {(delivery.status === 'pending' || delivery.status === 'pending_approval') && (
//           <button 
//             onClick={onCancel}
//             className="px-3 py-2 bg-gray-700/50 hover:bg-red-600/20 text-gray-400 hover:text-red-400 rounded-lg transition-all text-sm"
//           >
//             <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//             </svg>
//           </button>
//         )} */}

//         {!['delivered', 'failed', 'cancelled'].includes(delivery.status) && (
//         <button 
//           onClick={onCancel}
//           className="px-3 py-2 bg-gray-700/50 hover:bg-red-600/20 text-gray-400 hover:text-red-400 rounded-lg transition-all text-sm"
//           title="Cancel Delivery"
//         >
//           <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//           </svg>
//         </button>
//         )}
//       </div>
//     </div>
//   );
// }

// // Enhanced Recent Delivery Row
// function RecentDeliveryRow({ delivery, delay }) {
//   const statusColors = {
//     delivered: 'text-green-400 bg-green-500/20',
//     failed: 'text-red-400 bg-red-500/20',
//     cancelled: 'text-gray-400 bg-gray-500/20'
//   };

//   const statusStyle = statusColors[delivery.status] || statusColors.cancelled;
//   const isIncoming = delivery.metadata?.deliveryType === 'incoming';

//   return (
//     <tr 
//       className="hover:bg-gray-800/50 transition-colors animate-fade-in"
//       style={{ animationDelay: `${delay}ms` }}
//     >
//       <td className="py-3">
//         {/* <span className="text-white font-medium">{delivery.orderId}</span> */}
//         <div className="flex items-center gap-2">
//           <span className="text-white font-medium">{delivery.orderId}</span>
//           <span className={`text-xs px-2 py-0.5 rounded-full ${
//             isIncoming 
//               ? 'bg-blue-500/20 text-blue-400' 
//               : 'bg-orange-500/20 text-orange-400'
//           }`}>
//             {isIncoming ? 'Incoming' : 'Outgoing'}
//           </span>
//         </div>
//       </td>
//       <td className="py-3">
//         <span className="text-gray-300 capitalize">{delivery.package?.type}</span>
//       </td>
//       <td className="py-3">
//         <span className="text-gray-300">{delivery.recipient?.name}</span>
//       </td>
//       <td className="py-3">
//         <span className="text-gray-300">
//           {delivery.delivery?.actualDeliveryTime ? 
//             new Date(delivery.delivery.actualDeliveryTime).toLocaleDateString() : 
//             'N/A'}
//         </span>
//       </td>
//       <td className="py-3">
//         <span className="text-gray-300">
//           {delivery.delivery?.actualDeliveryTime && delivery.createdAt ? 
//             `${Math.round((new Date(delivery.delivery.actualDeliveryTime) - new Date(delivery.createdAt)) / 60000)} min` : 
//             'N/A'}
//         </span>
//       </td>
//       <td className="py-3">
//         <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyle}`}>
//           {delivery.status}
//         </span>
//       </td>
//       <td className="py-3">
//         <button className="text-red-400 hover:text-red-300 text-sm">
//           View Details
//         </button>
//       </td>
//     </tr>
//   );
// }

// // Loading Skeleton
// function DashboardSkeleton() {
//   return (
//     <div className="p-8 animate-pulse">
//       <div className="h-8 bg-gray-800 rounded w-64 mb-8"></div>
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
//         {[1, 2, 3].map(i => (
//           <div key={i} className="bg-gray-900/50 rounded-2xl p-6 h-40"></div>
//         ))}
//       </div>
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
//         {[1, 2, 3, 4].map(i => (
//           <div key={i} className="bg-gray-900/50 rounded-2xl p-6 h-32"></div>
//         ))}
//       </div>
//     </div>
//   );
// }

// // Tracking Modal Component
// function TrackingModal({ delivery, onClose }) {
//   const [trackingData, setTrackingData] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchTrackingData();
//     const interval = setInterval(fetchTrackingData, 5000); // Update every 5 seconds
//     return () => clearInterval(interval);
//   }, [delivery._id]);

//   const fetchTrackingData = async () => {
//     try {
//       const res = await fetch(`/api/deliveries/${delivery._id}/track`);
//       if (!res.ok) throw new Error('Failed to fetch');
//       const data = await res.json();
//       setTrackingData(data);
//     } catch (error) {
//       console.error('Failed to fetch tracking data:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
//       <div className="bg-gray-900 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scale-in">
//         <div className="flex items-center justify-between mb-6">
//           <h2 className="text-2xl font-bold text-white">Live Tracking</h2>
//           <button 
//             onClick={onClose}
//             className="text-gray-400 hover:text-white transition-colors"
//           >
//             <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//             </svg>
//           </button>
//         </div>

//         {loading ? (
//           <div className="flex items-center justify-center py-12">
//             <LoadingSpinner />
//           </div>
//         ) : trackingData ? (
//           <div className="space-y-6">
//             {/* Map placeholder */}
//             <div className="bg-gray-800 rounded-xl h-64 flex items-center justify-center">
//               <p className="text-gray-500">Live map tracking coming soon</p>
//             </div>

//             {/* Tracking details */}
//             <div className="grid grid-cols-2 gap-4">
//               <div className="bg-gray-800/50 rounded-xl p-4">
//                 <p className="text-gray-400 text-sm mb-1">Current Status</p>
//                 <p className="text-white font-semibold capitalize">{trackingData.status}</p>
//               </div>
//               <div className="bg-gray-800/50 rounded-xl p-4">
//                 <p className="text-gray-400 text-sm mb-1">Drone ID</p>
//                 <p className="text-white font-semibold">{trackingData.droneId || 'Assigning...'}</p>
//               </div>
//               <div className="bg-gray-800/50 rounded-xl p-4">
//                 <p className="text-gray-400 text-sm mb-1">Battery Level</p>
//                 <p className="text-white font-semibold">{trackingData.tracking?.battery || 0}%</p>
//               </div>
//               <div className="bg-gray-800/50 rounded-xl p-4">
//                 <p className="text-gray-400 text-sm mb-1">ETA</p>
//                 <p className="text-white font-semibold">
//                   {trackingData.delivery?.scheduledTime ? 
//                     new Date(trackingData.delivery.scheduledTime).toLocaleTimeString() : 
//                     'Calculating...'}
//                 </p>
//               </div>
//             </div>

//             {/* Timeline */}
//             <div>
//               <h3 className="text-lg font-semibold text-white mb-4">Delivery Timeline</h3>
//               <div className="space-y-4">
//                 {trackingData.timeline?.map((event, index) => (
//                   <div key={index} className="flex gap-4">
//                     <div className="flex flex-col items-center">
//                       <div className={`w-3 h-3 rounded-full ${
//                         index === 0 ? 'bg-red-500' : 'bg-gray-600'
//                       }`}></div>
//                       {index < trackingData.timeline.length - 1 && (
//                         <div className="w-0.5 h-16 bg-gray-700"></div>
//                       )}
//                     </div>
//                     <div className="flex-1 pb-8">
//                       <p className="text-white font-medium capitalize">{event.status}</p>
//                       <p className="text-gray-400 text-sm">
//                         {new Date(event.timestamp).toLocaleString()}
//                       </p>
//                       {event.notes && (
//                         <p className="text-gray-500 text-sm mt-1">{event.notes}</p>
//                       )}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         ) : (
//           <p className="text-center text-gray-500 py-12">No tracking data available</p>
//         )}
//       </div>
//     </div>
//   );
// }
























// Responsive 
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

const AssignedIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const CheckIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const FailedIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

// Confirmation Icon - for pending confirmation status
const ConfirmationIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

// Flight Icon - for in-transit status
const FlightIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
  </svg>
);

// Warning Icon - for alerts and warnings
const WarningIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
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

  const [hospitalVerified, setHospitalVerified] = useState(null);

  useEffect(() => {
    checkHospitalStatus();
  }, []);

  useEffect(() => {
    fetchDashboardData();
    // Set up auto-refresh for active deliveries
    const interval = setInterval(() => {
      fetchActiveDeliveries();
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const checkHospitalStatus = async () => {
    try {
      const res = await fetch('/api/hospital/verification-status');
      const data = await res.json();
      setHospitalVerified(data.isVerified);
      
      if (!data.isVerified) {
        toast.error('Your hospital setup is incomplete. Please contact your hospital administrator.');
      }
    } catch (error) {
      console.error('Failed to check hospital status:', error);
    }
  };

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
    if (!hospitalVerified) {
      toast.error('Hospital verification pending. Cannot create deliveries. Please contact your hospital administrator.');
      return;
    }

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

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to cancel delivery');
      }

      toast.success('Delivery cancelled successfully');
      fetchDashboardData();
    } catch (error) {
      toast.error(error.message || 'Failed to cancel delivery');
      console.error('Cancel error:', error);
    }
  };


  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 relative">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-500/5 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-rose-500/5 rounded-full blur-3xl animate-pulse-slow animation-delay-2000"></div>
      </div>

      {/* Header */}
      <div className="mb-6 sm:mb-8 relative">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2 flex justify-between items-center">
          <span className="truncate mr-2">Medical Staff Dashboard</span>
          <NotificationBell />
        </h1>
        <p className="text-gray-400 text-sm sm:text-base">Welcome back, {session?.user?.name}</p>
      </div>

      {/* Show warning banner if not verified */}
      {hospitalVerified === false && (
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-3">
            <svg className="w-6 h-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <p className="text-white font-semibold">Hospital Setup Incomplete</p>
              <p className="text-gray-400 text-sm">Your hospital administrator needs to complete the payment setup process.</p>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions with animations */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
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
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
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

      {/* Active Deliveries with real-time updates and max-height */}
      <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-4 sm:p-6 border border-red-500/20 hover:border-red-500/30 transition-all mb-6 sm:mb-8 animate-fade-in-up">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="flex items-center gap-2 sm:gap-3">
            <h2 className="text-lg sm:text-xl font-semibold text-white">Active Deliveries</h2>
            {activeDeliveries.length > 0 && (
              <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded-full text-xs font-medium animate-pulse">
                {activeDeliveries.length} Active
              </span>
            )}
          </div>
          <button 
            onClick={() => router.push('/dashboard/track-all')}
            className="text-red-400 hover:text-red-300 text-xs sm:text-sm font-medium transition-colors"
          >
            Track All
          </button>
        </div>
        
        {/* Scrollable container with max-height */}
        <div 
          className="
            max-h-[400px] sm:max-h-[420px] lg:max-h-[490px] 
            overflow-y-auto overflow-x-hidden 
            scrollbar-hide
          "
        >
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
            {activeDeliveries.length === 0 ? (
              <div className="col-span-full text-center py-8 sm:py-12">
                <DroneIcon className="w-12 h-12 sm:w-16 sm:h-16 text-gray-600 mx-auto mb-3 sm:mb-4 opacity-50" />
                <p className="text-gray-500 text-sm sm:text-base">No active deliveries at the moment</p>
                <button 
                  onClick={() => handleNewDelivery('routine')}
                  className="mt-3 sm:mt-4 text-red-400 hover:text-red-300 text-xs sm:text-sm font-medium"
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
      </div>

      {/* Recent Delivery History with filters */}
      <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-4 sm:p-6 border border-red-500/20 hover:border-red-500/30 transition-all animate-fade-in-up animation-delay-200">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-semibold text-white">Recent Deliveries</h2>
          <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
            <select className="flex-1 sm:flex-none bg-gray-800/50 border border-gray-700 rounded-lg px-2 sm:px-3 py-1.5 text-xs sm:text-sm text-white focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all">
              <option value="all">All Types</option>
              <option value="medication">Medication</option>
              <option value="blood">Blood</option>
              <option value="medical_supplies">Medical Supplies</option>
            </select>
            <button 
              onClick={() => router.push('/dashboard/delivery-history')}
              className="text-red-400 hover:text-red-300 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap"
            >
              View History
            </button>
          </div>
        </div>
        
        {/* Table container with horizontal scroll for mobile */}
        <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="text-left border-b border-gray-800">
                <th className="pb-3 text-xs sm:text-sm font-medium text-gray-400">Order ID</th>
                <th className="pb-3 text-xs sm:text-sm font-medium text-gray-400">Type</th>
                <th className="pb-3 text-xs sm:text-sm font-medium text-gray-400 hidden sm:table-cell">Recipient</th>
                <th className="pb-3 text-xs sm:text-sm font-medium text-gray-400">Delivered</th>
                <th className="pb-3 text-xs sm:text-sm font-medium text-gray-400 hidden lg:table-cell">Duration</th>
                <th className="pb-3 text-xs sm:text-sm font-medium text-gray-400">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {recentDeliveries.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-6 sm:py-8 text-center text-gray-500 text-sm">
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
      className={`bg-gray-900/50 backdrop-blur-xl rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-red-500/20 hover:border-red-500/30 transition-all group text-left hover:shadow-lg hover:shadow-red-500/10 transform hover:-translate-y-1 animate-fade-in-up`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className={`w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-gradient-to-br ${gradient} rounded-lg sm:rounded-xl flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform shadow-lg group-hover:rotate-3`}>
        <Icon className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" />
      </div>
      <h3 className="text-white font-semibold text-sm sm:text-base mb-1 group-hover:text-red-300 transition-colors">{title}</h3>
      <p className="text-gray-400 text-xs sm:text-sm">{description}</p>
      <div className="mt-3 sm:mt-4 flex items-center text-red-400 text-xs sm:text-sm opacity-0 group-hover:opacity-100 transition-opacity">
        <span>Create delivery</span>
        <svg className="w-3 h-3 sm:w-4 sm:h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
      className="bg-gray-900/50 backdrop-blur-xl rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 border border-red-500/20 hover:border-red-500/30 transition-all group animate-fade-in-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center justify-between mb-2 sm:mb-3 lg:mb-4">
        <div className={`w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 ${bgColor} backdrop-blur rounded-lg sm:rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
          <Icon className={`w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 ${color}`} />
        </div>
        {trend && (
          <div className={`flex items-center gap-0.5 sm:gap-1 text-xs sm:text-sm ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
            {isPositive ? (
              <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
              </svg>
            ) : (
              <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
              </svg>
            )}
            <span className="hidden sm:inline">{trend}</span>
          </div>
        )}
      </div>
      <div>
        <p className="text-gray-400 text-xs sm:text-sm">{title}</p>
        <p className="text-lg sm:text-xl lg:text-2xl font-bold text-white mt-0.5 sm:mt-1">{value}</p>
      </div>
    </div>
  );
}

// Enhanced Active Delivery Card with actions

function ActiveDeliveryCard({ delivery, onTrack, onCancel, delay }) {

  const router = useRouter();

  const urgencyColors = {
    routine: 'from-blue-600 to-cyan-600',
    urgent: 'from-orange-600 to-amber-600',
    emergency: 'from-red-600 to-rose-600'
  };

  const statusIcons = {
    pending: PendingIcon,
    pending_approval: PendingIcon,
    approved: CheckIcon,
    assigned: AssignedIcon,
    pickup: PickupIcon,
    in_transit: FlightIcon,
    pending_confirmation: ConfirmationIcon ,
    delivered: DeliveredIcon,
    failed: FailedIcon
  };

  const StatusIcon = statusIcons[delivery.status] || PendingIcon;
  const urgencyGradient = urgencyColors[delivery.package?.urgency] || urgencyColors.routine;

  // Check if incoming
  const isIncoming = delivery.metadata?.deliveryType === 'incoming' || delivery.displayType === 'Incoming Order';

  return (
    <div 
      className="bg-gray-800/50 rounded-lg sm:rounded-xl p-4 sm:p-5 hover:bg-gray-800/70 transition-all group animate-scale-in"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between mb-3 sm:mb-4">
        <div className="min-w-0 flex-1 mr-2">
          {/* <h3 className="text-white font-semibold group-hover:text-red-300 transition-colors">{delivery.orderId}</h3> */}
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-white font-semibold group-hover:text-red-300 transition-colors text-sm sm:text-base truncate">
              {delivery.orderId}
            </h3>
            {/* Add delivery type badge */}
            <span className={`text-xs px-1.5 sm:px-2 py-0.5 rounded-full flex-shrink-0 ${
              isIncoming 
                ? 'bg-blue-500/20 text-blue-400' 
                : 'bg-orange-500/20 text-orange-400'
            }`}>
              {isIncoming ? 'Incoming' : 'Outgoing'}
            </span>
          </div>
          <p className="text-gray-400 text-xs sm:text-sm">{delivery.package?.type || 'Package'}</p>
        </div>
        <span className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-medium bg-gradient-to-r ${urgencyGradient} text-white animate-pulse flex-shrink-0`}>
          {delivery.package?.urgency || 'routine'}
        </span>
      </div>
      
      <div className="space-y-2 sm:space-y-3">
        <div className="flex items-center gap-2">
          <LocationIcon className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0" />
          <p className="text-gray-300 text-xs sm:text-sm truncate">{isIncoming ? 'To : Your Hospital' : `To : ${delivery.recipient?.name || 'Unknown'}`}</p>
        </div>
        
        <div className="flex items-center gap-2">
          <StatusIcon className="w-3 h-3 sm:w-4 sm:h-4 text-red-400 flex-shrink-0" />
          <p className="text-red-400 text-xs sm:text-sm capitalize">{delivery.status?.replace('_', ' ')}</p>
        </div>
        
        {/* Show approval status for pending approvals */}
        {delivery.status === 'pending_approval' && (
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-2">
            <p className="text-xs text-yellow-400">
              Awaiting hospital admin approval
            </p>
          </div>
        )}
        
        {/* Show if approved but not assigned */}
        {delivery.status === 'approved' && !delivery.pilotId && (
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-2">
            <p className="text-xs text-blue-400">
              Approved - Awaiting pilot assignment by admin
            </p>
          </div>
        )}
        
        {/* Show if assigned but not picked up */}
        {delivery.status === 'assigned' && delivery.pilotId && (
          <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-2">
            <p className="text-xs text-purple-400">
              Pilot assigned - Preparing for pickup
            </p>
          </div>
        )}

        {/* Show if in transit */}
        {delivery.status === 'in_transit' && (
          <div className="bg-lime-500/10 border border-lime-500/30 rounded-lg p-2">
            <p className="text-xs text-lime-400">
              Package is on the way - In Transit 🚁
            </p>
          </div>
        )}

        {/* Show if pending confirmation */}
        {delivery.status === 'pending_confirmation' && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-2">
            <p className="text-xs text-emerald-400">
              📦 Package delivered - Awaiting your confirmation
            </p>
          </div>
        )}

        {/* Show if failed */}
        {delivery.status === 'failed' && delivery.metadata?.failureReason && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-2">
            <p className="text-xs text-red-400">
              ❌ Delivery failed
            </p>
            <p className="text-xs text-red-300 mt-1">
              Reason: {delivery.metadata.failureReason}
            </p>
          </div>
        )}
        
        <div className="flex items-center gap-2">
          <TimeIcon className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0" />
          <p className="text-gray-300 text-xs sm:text-sm">
            ETA: {delivery.delivery?.scheduledTime ? 
              new Date(delivery.delivery.scheduledTime).toLocaleTimeString() : 
              'Calculating...'}
          </p>
        </div>

        {/* Battery and Drone Status - only show if drone assigned */}
        {delivery.tracking?.battery && delivery.droneId && (
          <div className="flex items-center gap-2">
            <BatteryIcon className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0" />
            <div className="flex-1 bg-gray-700 rounded-full h-1.5 sm:h-2">
              <div 
                className={`h-1.5 sm:h-2 rounded-full transition-all ${
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
      
      <div className="mt-3 sm:mt-4 flex gap-2">
        {/* Show Confirm Receipt button for pending confirmation */}
        {delivery.status === 'pending_confirmation' && delivery.needsConfirmation ? (
          <button 
            onClick={() => router.push(`/dashboard/confirm-delivery/${delivery._id}`)}
            className="flex-1 py-1.5 sm:py-2 bg-yellow-600/20 hover:bg-yellow-600/30 text-yellow-400 rounded-lg transition-all text-xs sm:text-sm font-medium group animate-pulse"
          >
            <span className="flex items-center justify-center gap-1">
              Confirm Receipt
              <svg className="w-3 h-3 transform group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </button>
        ) : (
          <button 
            onClick={onTrack}
            className="flex-1 py-1.5 sm:py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg transition-all text-xs sm:text-sm font-medium group"
          >
            <span className="flex items-center justify-center gap-1">
              Track
              <svg className="w-3 h-3 transform group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </button>
        )}

        {!['delivered', 'failed', 'cancelled'].includes(delivery.status) && (
        <button 
          onClick={onCancel}
          className="px-2 sm:px-3 py-1.5 sm:py-2 bg-gray-700/50 hover:bg-red-600/20 text-gray-400 hover:text-red-400 rounded-lg transition-all text-xs sm:text-sm"
          title="Cancel Delivery"
        >
          <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
  const isIncoming = delivery.metadata?.deliveryType === 'incoming';

  return (
    <tr 
      className="hover:bg-gray-800/50 transition-colors animate-fade-in"
      style={{ animationDelay: `${delay}ms` }}
    >
      <td className="py-2 sm:py-3">
        <div className="flex items-center gap-1 sm:gap-2">
          <span className="text-white font-medium text-xs sm:text-sm">{delivery.orderId}</span>
          <span className={`text-xs px-1.5 sm:px-2 py-0.5 rounded-full ${
            isIncoming 
              ? 'bg-blue-500/20 text-blue-400' 
              : 'bg-orange-500/20 text-orange-400'
          }`}>
            {isIncoming ? 'In' : 'Out'}
          </span>
        </div>
      </td>
      <td className="py-2 sm:py-3">
        <span className="text-gray-300 capitalize text-xs sm:text-sm">{delivery.package?.type}</span>
      </td>
      <td className="py-2 sm:py-3 hidden sm:table-cell">
        <span className="text-gray-300 text-xs sm:text-sm">{delivery.recipient?.name}</span>
      </td>
      <td className="py-2 sm:py-3">
        <span className="text-gray-300 text-xs sm:text-sm">
          {delivery.delivery?.actualDeliveryTime ? 
            new Date(delivery.delivery.actualDeliveryTime).toLocaleDateString() : 
            'N/A'}
        </span>
      </td>
      <td className="py-2 sm:py-3 hidden lg:table-cell">
        <span className="text-gray-300 text-xs sm:text-sm">
          {delivery.delivery?.actualDeliveryTime && delivery.createdAt ? 
            `${Math.round((new Date(delivery.delivery.actualDeliveryTime) - new Date(delivery.createdAt)) / 60000)} min` : 
            'N/A'}
        </span>
      </td>
      <td className="py-2 sm:py-3">
        <span className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-medium ${statusStyle}`}>
          {delivery.status}
        </span>
      </td>
    </tr>
  );
}

// Loading Skeleton
function DashboardSkeleton() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 animate-pulse">
      <div className="h-6 sm:h-8 bg-gray-800 rounded w-48 sm:w-64 mb-6 sm:mb-8"></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-gray-900/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 h-32 sm:h-40"></div>
        ))}
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="bg-gray-900/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 h-24 sm:h-32"></div>
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
      <div className="bg-gray-900 rounded-xl sm:rounded-2xl p-4 sm:p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scale-in">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-white">Live Tracking</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-1"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-8 sm:py-12">
            <LoadingSpinner />
          </div>
        ) : trackingData ? (
          <div className="space-y-4 sm:space-y-6">
            {/* Map placeholder */}
            <div className="bg-gray-800 rounded-lg sm:rounded-xl h-48 sm:h-64 items-center justify-center hidden">
              <p className="text-gray-500 text-sm sm:text-base">Live map tracking coming soon</p>
            </div>

            {/* Tracking details */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="bg-gray-800/50 rounded-lg sm:rounded-xl p-3 sm:p-4">
                <p className="text-gray-400 text-xs sm:text-sm mb-1">Current Status</p>
                <p className="text-white font-semibold capitalize text-sm sm:text-base">{trackingData.status}</p>
              </div>
              <div className="bg-gray-800/50 rounded-lg sm:rounded-xl p-3 sm:p-4">
                <p className="text-gray-400 text-xs sm:text-sm mb-1">Drone ID</p>
                <p className="text-white font-semibold text-sm sm:text-base">{trackingData.droneId || 'Assigning...'}</p>
              </div>
              <div className="bg-gray-800/50 rounded-lg sm:rounded-xl p-3 sm:p-4">
                <p className="text-gray-400 text-xs sm:text-sm mb-1">Battery Level</p>
                <p className="text-white font-semibold text-sm sm:text-base">{trackingData.tracking?.battery || 0}%</p>
              </div>
              <div className="bg-gray-800/50 rounded-lg sm:rounded-xl p-3 sm:p-4">
                <p className="text-gray-400 text-xs sm:text-sm mb-1">ETA</p>
                <p className="text-white font-semibold text-sm sm:text-base">
                  {trackingData.delivery?.scheduledTime ? 
                    new Date(trackingData.delivery.scheduledTime).toLocaleTimeString() : 
                    'Calculating...'}
                </p>
              </div>
            </div>

            {/* Timeline */}
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">Delivery Timeline</h3>
              <div className="space-y-3 sm:space-y-4">
                {trackingData.timeline?.map((event, index) => (
                  <div key={index} className="flex gap-3 sm:gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full ${
                        index === 0 ? 'bg-red-500' : 'bg-gray-600'
                      }`}></div>
                      {index < trackingData.timeline.length - 1 && (
                        <div className="w-0.5 h-12 sm:h-16 bg-gray-700"></div>
                      )}
                    </div>
                    <div className="flex-1 pb-6 sm:pb-8">
                      <p className="text-white font-medium capitalize text-sm sm:text-base">{event.status}</p>
                      <p className="text-gray-400 text-xs sm:text-sm">
                        {new Date(event.timestamp).toLocaleString()}
                      </p>
                      {event.notes && (
                        <p className="text-gray-500 text-xs sm:text-sm mt-1">{event.notes}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-500 py-8 sm:py-12 text-sm sm:text-base">No tracking data available</p>
        )}
      </div>
    </div>
  );
}
// // app/dashboard/notifications/page.js
// 'use client';

// import { useState, useEffect } from 'react';
// import { useSession } from 'next-auth/react';
// import { useRouter } from 'next/navigation';
// import toast from 'react-hot-toast';

// // Icon Components
// const BellIcon = ({ className }) => (
//   <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
//   </svg>
// );

// const TrashIcon = ({ className }) => (
//   <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
//   </svg>
// );

// const FilterIcon = ({ className }) => (
//   <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
//   </svg>
// );

// const CheckIcon = ({ className }) => (
//   <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//   </svg>
// );

// export default function NotificationsPage() {
//   const { data: session } = useSession();
//   const router = useRouter();
  
//   const [notifications, setNotifications] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [page, setPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [selectedNotifications, setSelectedNotifications] = useState([]);
//   const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
//   // Filters
//   const [filters, setFilters] = useState({
//     type: 'all',
//     priority: 'all',
//     read: 'all',
//     dateRange: 'all'
//   });

//   useEffect(() => {
//     fetchNotifications();
//   }, [page, filters]);

//   const fetchNotifications = async () => {
//     setLoading(true);
//     try {
//       const queryParams = new URLSearchParams({
//         page: page.toString(),
//         limit: '20',
//         ...filters
//       });

//       const res = await fetch(`/api/notifications?${queryParams}`);
//       if (!res.ok) throw new Error('Failed to fetch');
      
//       const data = await res.json();
//       setNotifications(data.notifications);
//       setTotalPages(Math.ceil(data.total / 20));
//     } catch (error) {
//       console.error('Error fetching notifications:', error);
//       toast.error('Failed to fetch notifications');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const markAsRead = async (notificationId) => {
//     try {
//       const res = await fetch(`/api/notifications/${notificationId}/read`, {
//         method: 'PATCH'
//       });
      
//       if (res.ok) {
//         setNotifications(prev => 
//           prev.map(n => n._id === notificationId ? { ...n, read: true } : n)
//         );
//       }
//     } catch (error) {
//       console.error('Error marking notification as read:', error);
//     }
//   };

//   const markSelectedAsRead = async () => {
//     try {
//       await Promise.all(
//         selectedNotifications.map(id => 
//           fetch(`/api/notifications/${id}/read`, { method: 'PATCH' })
//         )
//       );
      
//       setNotifications(prev => 
//         prev.map(n => selectedNotifications.includes(n._id) ? { ...n, read: true } : n)
//       );
//       setSelectedNotifications([]);
//       toast.success('Notifications marked as read');
//     } catch (error) {
//       console.error('Error marking notifications as read:', error);
//       toast.error('Failed to mark notifications as read');
//     }
//   };

//   const deleteNotification = async (notificationId) => {
//     try {
//       const res = await fetch(`/api/notifications/${notificationId}/delete`, {
//         method: 'DELETE'
//       });
      
//       if (res.ok) {
//         setNotifications(prev => prev.filter(n => n._id !== notificationId));
//         toast.success('Notification deleted');
//       } else {
//         toast.error('Failed to delete notification');
//       }
//     } catch (error) {
//       console.error('Error deleting notification:', error);
//       toast.error('Failed to delete notification');
//     }
//   };

//   const deleteSelected = async () => {
//     try {
//       await Promise.all(
//         selectedNotifications.map(id => 
//           fetch(`/api/notifications/${id}/delete`, { method: 'DELETE' })
//         )
//       );
      
//       setNotifications(prev => prev.filter(n => !selectedNotifications.includes(n._id)));
//       setSelectedNotifications([]);
//       setShowDeleteConfirm(false);
//       toast.success('Selected notifications deleted');
//     } catch (error) {
//       console.error('Error deleting notifications:', error);
//       toast.error('Failed to delete notifications');
//     }
//   };

//   const deleteAll = async () => {
//     try {
//       const res = await fetch('/api/notifications/delete-all', {
//         method: 'DELETE'
//       });
      
//       if (res.ok) {
//         setNotifications([]);
//         setShowDeleteConfirm(false);
//         toast.success('All notifications deleted');
//       } else {
//         toast.error('Failed to delete notifications');
//       }
//     } catch (error) {
//       console.error('Error deleting all notifications:', error);
//       toast.error('Failed to delete notifications');
//     }
//   };

//   const handleNotificationClick = (notification) => {
//     if (!notification.read) {
//       markAsRead(notification._id);
//     }
    
//     if (notification.actionUrl) {
//       router.push(notification.actionUrl);
//     }
//   };

//   const toggleSelectAll = () => {
//     if (selectedNotifications.length === notifications.length) {
//       setSelectedNotifications([]);
//     } else {
//       setSelectedNotifications(notifications.map(n => n._id));
//     }
//   };

//   const toggleSelect = (notificationId) => {
//     setSelectedNotifications(prev => 
//       prev.includes(notificationId)
//         ? prev.filter(id => id !== notificationId)
//         : [...prev, notificationId]
//     );
//   };

//   const priorityColors = {
//     low: 'bg-gray-500',
//     medium: 'bg-blue-500',
//     high: 'bg-orange-500',
//     urgent: 'bg-red-500'
//   };

//   const priorityTextColors = {
//     low: 'text-gray-400',
//     medium: 'text-blue-400',
//     high: 'text-orange-400',
//     urgent: 'text-red-400'
//   };

//   const typeColors = {
//     new_delivery: 'text-green-400',
//     delivery_assigned: 'text-blue-400',
//     delivery_status: 'text-yellow-400',
//     system_alert: 'text-purple-400',
//     urgent_alert: 'text-red-400'
//   };

//   return (
//     <div className="p-8">
//       {/* Header */}
//       <div className="mb-8">
//         <h1 className="text-3xl font-bold text-white mb-2">Notifications</h1>
//         <p className="text-gray-400">Manage and view all your notifications</p>
//       </div>

//       {/* Filters and Actions */}
//       <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-red-500/20 mb-6">
//         <div className="flex flex-col lg:flex-row gap-4">
//           {/* Filters */}
//           <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
//             <select
//               value={filters.type}
//               onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
//               className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-red-500 focus:ring-1 focus:ring-red-500"
//             >
//               <option value="all">All Types</option>
//               <option value="new_delivery">New Delivery</option>
//               <option value="delivery_assigned">Delivery Assigned</option>
//               <option value="delivery_status">Status Update</option>
//               <option value="system_alert">System Alert</option>
//               <option value="urgent_alert">Urgent Alert</option>
//             </select>

//             <select
//               value={filters.priority}
//               onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value }))}
//               className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-red-500 focus:ring-1 focus:ring-red-500"
//             >
//               <option value="all">All Priorities</option>
//               <option value="low">Low</option>
//               <option value="medium">Medium</option>
//               <option value="high">High</option>
//               <option value="urgent">Urgent</option>
//             </select>

//             <select
//               value={filters.read}
//               onChange={(e) => setFilters(prev => ({ ...prev, read: e.target.value }))}
//               className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-red-500 focus:ring-1 focus:ring-red-500"
//             >
//               <option value="all">All Status</option>
//               <option value="unread">Unread Only</option>
//               <option value="read">Read Only</option>
//             </select>

//             <select
//               value={filters.dateRange}
//               onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value }))}
//               className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-red-500 focus:ring-1 focus:ring-red-500"
//             >
//               <option value="all">All Time</option>
//               <option value="today">Today</option>
//               <option value="week">This Week</option>
//               <option value="month">This Month</option>
//             </select>
//           </div>

//           {/* Bulk Actions */}
//           {selectedNotifications.length > 0 && (
//             <div className="flex gap-2">
//               <button
//                 onClick={markSelectedAsRead}
//                 className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all"
//               >
//                 Mark as Read ({selectedNotifications.length})
//               </button>
//               <button
//                 onClick={() => setShowDeleteConfirm(true)}
//                 className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-all"
//               >
//                 Delete ({selectedNotifications.length})
//               </button>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Delete Confirmation Modal */}
//       {showDeleteConfirm && (
//         <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
//           <div className="bg-gray-900 rounded-2xl p-6 max-w-md w-full">
//             <h3 className="text-xl font-semibold text-white mb-4">Confirm Delete</h3>
//             <p className="text-gray-300 mb-6">
//               Are you sure you want to delete {selectedNotifications.length > 0 ? `${selectedNotifications.length} selected` : 'all'} notifications?
//             </p>
//             <div className="flex gap-3">
//               <button
//                 onClick={selectedNotifications.length > 0 ? deleteSelected : deleteAll}
//                 className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-all"
//               >
//                 Delete
//               </button>
//               <button
//                 onClick={() => setShowDeleteConfirm(false)}
//                 className="flex-1 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold transition-all"
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Notifications List */}
//       <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl border border-red-500/20 overflow-hidden">
//         {loading ? (
//           <div className="p-12 text-center">
//             <div className="animate-spin h-12 w-12 border-2 border-red-500 border-t-transparent rounded-full mx-auto"></div>
//           </div>
//         ) : notifications.length === 0 ? (
//           <div className="p-12 text-center">
//             <BellIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
//             <p className="text-gray-500 text-lg">No notifications found</p>
//             <p className="text-gray-600 text-sm mt-2">Try adjusting your filters</p>
//           </div>
//         ) : (
//           <>
//             {/* Select All */}
//             <div className="p-4 border-b border-gray-800 flex items-center gap-4">
//               <input
//                 type="checkbox"
//                 checked={selectedNotifications.length === notifications.length}
//                 onChange={toggleSelectAll}
//                 className="w-4 h-4 text-red-600 bg-gray-800 border-gray-600 rounded focus:ring-red-500"
//               />
//               <span className="text-gray-400 text-sm">Select All</span>
//               {notifications.length > 0 && (
//                 <button
//                   onClick={() => setShowDeleteConfirm(true)}
//                   className="ml-auto text-sm text-gray-400 hover:text-red-400 transition-colors"
//                 >
//                   Delete All
//                 </button>
//               )}
//             </div>

//             {/* Notifications */}
//             <div className="divide-y divide-gray-800">
//               {notifications.map((notification) => (
//                 <div
//                   key={notification._id}
//                   className={`p-4 hover:bg-gray-800/50 transition-all ${
//                     !notification.read ? 'bg-gray-800/30' : ''
//                   }`}
//                 >
//                   <div className="flex items-start gap-4">
//                     <input
//                       type="checkbox"
//                       checked={selectedNotifications.includes(notification._id)}
//                       onChange={() => toggleSelect(notification._id)}
//                       className="w-4 h-4 mt-1 text-red-600 bg-gray-800 border-gray-600 rounded focus:ring-red-500"
//                     />
                    
//                     <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
//                       priorityColors[notification.priority]
//                     } ${!notification.read ? 'animate-pulse' : ''}`} />
                    
//                     <div 
//                       className="flex-1 cursor-pointer"
//                       onClick={() => handleNotificationClick(notification)}
//                     >
//                       <div className="flex items-start justify-between gap-4">
//                         <div className="flex-1">
//                           <h4 className={`text-sm font-medium ${
//                             !notification.read ? 'text-white' : 'text-gray-300'
//                           }`}>
//                             {notification.title}
//                           </h4>
//                           <p className="text-sm text-gray-400 mt-1">
//                             {notification.message}
//                           </p>
//                           <div className="flex items-center gap-4 mt-2">
//                             <span className={`text-xs ${typeColors[notification.type] || 'text-gray-500'}`}>
//                               {notification.type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
//                             </span>
//                             <span className={`text-xs ${priorityTextColors[notification.priority]}`}>
//                               {notification.priority} priority
//                             </span>
//                             {notification.data?.orderId && (
//                               <span className="text-xs text-gray-500">
//                                 Order: {notification.data.orderId}
//                               </span>
//                             )}
//                             <span className="text-xs text-gray-600">
//                               {new Date(notification.createdAt).toLocaleString()}
//                             </span>
//                           </div>
//                         </div>
                        
//                         <div className="flex items-center gap-2">
//                           {notification.actionRequired && (
//                             <span className="text-xs text-red-400 bg-red-500/10 px-2 py-1 rounded">
//                               Action Required
//                             </span>
//                           )}
//                           <button
//                             onClick={(e) => {
//                               e.stopPropagation();
//                               deleteNotification(notification._id);
//                             }}
//                             className="p-1 text-gray-400 hover:text-red-400 transition-colors"
//                             title="Delete notification"
//                           >
//                             <TrashIcon className="w-4 h-4" />
//                           </button>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {/* Pagination */}
//             {totalPages > 1 && (
//               <div className="p-4 border-t border-gray-800 flex items-center justify-center gap-2">
//                 <button
//                   onClick={() => setPage(prev => Math.max(1, prev - 1))}
//                   disabled={page === 1}
//                   className="px-4 py-2 bg-gray-800 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition-all"
//                 >
//                   Previous
//                 </button>
//                 <span className="text-gray-400 mx-4">
//                   Page {page} of {totalPages}
//                 </span>
//                 <button
//                   onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
//                   disabled={page === totalPages}
//                   className="px-4 py-2 bg-gray-800 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition-all"
//                 >
//                   Next
//                 </button>
//               </div>
//             )}
//           </>
//         )}
//       </div>
//     </div>
//   );
// }






























// BEST --------------------------------------------------------------------------------------
// app/dashboard/notifications/page.js
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

// Icon Components
const BellIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
  </svg>
);

const TrashIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const FilterIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
  </svg>
);

const CheckIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const LoadingSpinner = () => (
  <svg className="animate-spin h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

export default function NotificationsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedNotifications, setSelectedNotifications] = useState([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  // Filters
  const [filters, setFilters] = useState({
    type: 'all',
    priority: 'all',
    read: 'all',
    dateRange: 'all'
  });

  useEffect(() => {
    fetchNotifications();
  }, [page, filters]);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: '20',
        ...filters
      });

      const res = await fetch(`/api/notifications?${queryParams}`);
      if (!res.ok) throw new Error('Failed to fetch');
      
      const data = await res.json();
      setNotifications(data.notifications);
      setTotalPages(Math.ceil(data.total / 20));
    } catch (error) {
      console.error('Error fetching notifications:', error);
      toast.error('Failed to fetch notifications');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const res = await fetch(`/api/notifications/${notificationId}/read`, {
        method: 'PATCH'
      });
      
      if (res.ok) {
        setNotifications(prev => 
          prev.map(n => n._id === notificationId ? { ...n, read: true } : n)
        );
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markSelectedAsRead = async () => {
    try {
      await Promise.all(
        selectedNotifications.map(id => 
          fetch(`/api/notifications/${id}/read`, { method: 'PATCH' })
        )
      );
      
      setNotifications(prev => 
        prev.map(n => selectedNotifications.includes(n._id) ? { ...n, read: true } : n)
      );
      setSelectedNotifications([]);
      toast.success('Notifications marked as read');
    } catch (error) {
      console.error('Error marking notifications as read:', error);
      toast.error('Failed to mark notifications as read');
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      const res = await fetch(`/api/notifications/${notificationId}/delete`, {
        method: 'DELETE'
      });
      
      if (res.ok) {
        setNotifications(prev => prev.filter(n => n._id !== notificationId));
        toast.success('Notification deleted');
      } else {
        toast.error('Failed to delete notification');
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
      toast.error('Failed to delete notification');
    }
  };

  const deleteSelected = async () => {
    try {
      await Promise.all(
        selectedNotifications.map(id => 
          fetch(`/api/notifications/${id}/delete`, { method: 'DELETE' })
        )
      );
      
      setNotifications(prev => prev.filter(n => !selectedNotifications.includes(n._id)));
      setSelectedNotifications([]);
      setShowDeleteConfirm(false);
      toast.success('Selected notifications deleted');
    } catch (error) {
      console.error('Error deleting notifications:', error);
      toast.error('Failed to delete notifications');
    }
  };

  const deleteAll = async () => {
    try {
      const res = await fetch('/api/notifications/delete-all', {
        method: 'DELETE'
      });
      
      if (res.ok) {
        setNotifications([]);
        setShowDeleteConfirm(false);
        toast.success('All notifications deleted');
      } else {
        toast.error('Failed to delete notifications');
      }
    } catch (error) {
      console.error('Error deleting all notifications:', error);
      toast.error('Failed to delete notifications');
    }
  };

  const handleNotificationClick = (notification) => {
    if (!notification.read) {
      markAsRead(notification._id);
    }
    
    // if (notification.actionUrl) {
    //   router.push(notification.actionUrl);
    // }
  };

  const toggleSelectAll = () => {
    if (selectedNotifications.length === notifications.length) {
      setSelectedNotifications([]);
    } else {
      setSelectedNotifications(notifications.map(n => n._id));
    }
  };

  const toggleSelect = (notificationId) => {
    setSelectedNotifications(prev => 
      prev.includes(notificationId)
        ? prev.filter(id => id !== notificationId)
        : [...prev, notificationId]
    );
  };

  const priorityColors = {
    low: 'bg-gray-500',
    medium: 'bg-blue-500',
    high: 'bg-orange-500',
    urgent: 'bg-red-500'
  };

  const priorityTextColors = {
    low: 'text-gray-400',
    medium: 'text-blue-400',
    high: 'text-orange-400',
    urgent: 'text-red-400'
  };

  const typeColors = {
    new_delivery: 'text-green-400',
    delivery_assigned: 'text-blue-400',
    delivery_status: 'text-yellow-400',
    system_alert: 'text-purple-400',
    urgent_alert: 'text-red-400'
  };

  const typeIcons = {
    new_delivery: '📦',
    delivery_assigned: '✈️',
    delivery_status: '📍',
    system_alert: '⚙️',
    urgent_alert: '🚨'
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="p-8 relative">
        {/* Animated Background Elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-500/5 rounded-full blur-3xl animate-pulse-slow"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-rose-500/5 rounded-full blur-3xl animate-pulse-slow animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse-slow animation-delay-4000"></div>
        </div>

        {/* Header */}
        <div className="mb-8 relative animate-fade-in-up">
          <h1 className="text-3xl font-bold text-white mb-2">
            <span className="bg-gradient-to-r from-red-400 to-rose-400 bg-clip-text text-transparent">
              Notifications
            </span>
          </h1>
          <p className="text-gray-400">Manage and view all your notifications</p>
        </div>

        {/* Filters and Actions */}
        <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-red-500/20 hover:border-red-500/30 transition-all mb-6 animate-fade-in-up animation-delay-100">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Filters */}
            <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
              <select
                value={filters.type}
                onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
                className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all"
              >
                <option value="all">All Types</option>
                <option value="new_delivery">New Delivery</option>
                <option value="delivery_assigned">Delivery Assigned</option>
                <option value="delivery_status">Status Update</option>
                <option value="system_alert">System Alert</option>
                <option value="urgent_alert">Urgent Alert</option>
              </select>

              <select
                value={filters.priority}
                onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value }))}
                className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all"
              >
                <option value="all">All Priorities</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>

              <select
                value={filters.read}
                onChange={(e) => setFilters(prev => ({ ...prev, read: e.target.value }))}
                className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all"
              >
                <option value="all">All Status</option>
                <option value="unread">Unread Only</option>
                <option value="read">Read Only</option>
              </select>

              <select
                value={filters.dateRange}
                onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value }))}
                className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
            </div>

            {/* Bulk Actions */}
            {selectedNotifications.length > 0 && (
              <div className="flex gap-2 animate-scale-in">
                <button
                  onClick={markSelectedAsRead}
                  className="px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-400 rounded-lg font-medium transition-all backdrop-blur"
                >
                  Mark as Read ({selectedNotifications.length})
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 text-red-400 rounded-lg font-medium transition-all backdrop-blur"
                >
                  Delete ({selectedNotifications.length})
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="bg-gray-900 rounded-2xl p-6 max-w-md w-full border border-red-500/20 animate-scale-in">
              <h3 className="text-xl font-semibold text-white mb-4">Confirm Delete</h3>
              <p className="text-gray-300 mb-6">
                Are you sure you want to delete {selectedNotifications.length > 0 ? `${selectedNotifications.length} selected` : 'all'} notifications?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={selectedNotifications.length > 0 ? deleteSelected : deleteAll}
                  className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-all"
                >
                  Delete
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-semibold transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Notifications List */}
        <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl border border-red-500/20 hover:border-red-500/30 transition-all overflow-hidden animate-fade-in-up animation-delay-200">
          {loading ? (
            <div className="p-12 text-center">
              <LoadingSpinner />
              <p className="text-gray-400 mt-4">Loading notifications...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-20 h-20 bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur">
                <BellIcon className="w-10 h-10 text-gray-600" />
              </div>
              <p className="text-gray-400 text-lg font-medium">No notifications found</p>
              <p className="text-gray-600 text-sm mt-2">Try adjusting your filters or check back later</p>
            </div>
          ) : (
            <>
              {/* Select All */}
              <div className="p-4 border-b border-gray-800/50 flex items-center gap-4 bg-gray-800/20">
                <input
                  type="checkbox"
                  checked={selectedNotifications.length === notifications.length}
                  onChange={toggleSelectAll}
                  className="w-4 h-4 text-red-600 bg-gray-800 border-gray-600 rounded focus:ring-red-500 focus:ring-offset-0 focus:ring-offset-gray-900"
                />
                <span className="text-gray-400 text-sm font-medium">Select All</span>
                {notifications.length > 0 && (
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="ml-auto text-sm text-gray-400 hover:text-red-400 transition-colors flex items-center gap-2"
                  >
                    <TrashIcon className="w-4 h-4" />
                    Delete All
                  </button>
                )}
              </div>

              {/* Notifications */}
              <div className="divide-y divide-gray-800/50">
                {notifications.map((notification, index) => (
                  <div
                    key={notification._id}
                    className={`p-4 hover:bg-gray-800/30 transition-all group ${
                      !notification.read ? 'bg-gray-800/20' : ''
                    } animate-fade-in-up`}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="flex items-start gap-4">
                      <input
                        type="checkbox"
                        checked={selectedNotifications.includes(notification._id)}
                        onChange={() => toggleSelect(notification._id)}
                        className="w-4 h-4 mt-1 text-red-600 bg-gray-800 border-gray-600 rounded focus:ring-red-500 focus:ring-offset-0 focus:ring-offset-gray-900"
                      />
                      
                      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-800/50 backdrop-blur flex-shrink-0">
                        <span className="text-xl">{typeIcons[notification.type] || '📢'}</span>
                      </div>
                      
                      <div 
                        className="flex-1 cursor-pointer"
                        onClick={() => handleNotificationClick(notification)}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className={`text-sm font-medium ${
                                !notification.read ? 'text-white' : 'text-gray-300'
                              }`}>
                                {notification.title}
                              </h4>
                              <div className={`w-2 h-2 rounded-full ${
                                priorityColors[notification.priority]
                              } ${!notification.read ? 'animate-pulse' : ''}`} />
                            </div>
                            <p className="text-sm text-gray-400 line-clamp-2">
                              {notification.message}
                            </p>
                            <div className="flex items-center gap-4 mt-2 flex-wrap">
                              <span className={`text-xs ${typeColors[notification.type] || 'text-gray-500'}`}>
                                {notification.type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                              </span>
                              <span className={`text-xs ${priorityTextColors[notification.priority]}`}>
                                {notification.priority} priority
                              </span>
                              {notification.data?.orderId && (
                                <span className="text-xs text-gray-500">
                                  Order: <span className="text-gray-400">{notification.data.orderId}</span>
                                </span>
                              )}
                              <span className="text-xs text-gray-600">
                                {new Date(notification.createdAt).toLocaleString()}
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 flex-shrink-0">
                            {notification.actionRequired && (
                              <span className="text-xs text-red-400 bg-red-500/10 px-2 py-1 rounded backdrop-blur">
                                Action Required
                              </span>
                            )}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteNotification(notification._id);
                              }}
                              className="p-2 text-gray-400 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 hover:bg-red-500/10 rounded-lg"
                              title="Delete notification"
                            >
                              <TrashIcon className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="p-4 border-t border-gray-800/50 flex items-center justify-center gap-2 bg-gray-800/20">
                  <button
                    onClick={() => setPage(prev => Math.max(1, prev - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 bg-gray-800/50 backdrop-blur text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700/50 transition-all border border-gray-700"
                  >
                    Previous
                  </button>
                  <span className="text-gray-400 mx-4 font-medium">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={page === totalPages}
                    className="px-4 py-2 bg-gray-800/50 backdrop-blur text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700/50 transition-all border border-gray-700"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
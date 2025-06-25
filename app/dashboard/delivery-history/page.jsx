// // app/dashboard/delivery-history/page.jsx
// 'use client';

// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { useSession } from 'next-auth/react';
// import DashboardLayout from '@/components/dashboard/DashboardLayout';
// import RoleGuard from '@/components/auth/RoleGuard';

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

// const DownloadIcon = ({ className }) => (
//   <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
//   </svg>
// );

// const SearchIcon = ({ className }) => (
//   <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//   </svg>
// );

// export default function DeliveryHistoryPage() {
//   const router = useRouter();
//   const { data: session } = useSession();
//   const [deliveries, setDeliveries] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [filters, setFilters] = useState({
//     status: 'all',
//     type: 'all',
//     dateRange: '30days',
//     search: ''
//   });
//   const [showFilters, setShowFilters] = useState(false);
//   const [pagination, setPagination] = useState({
//     page: 1,
//     limit: 20,
//     total: 0
//   });

//   useEffect(() => {
//     fetchDeliveries();
//   }, [filters, pagination.page]);

//   const fetchDeliveries = async () => {
//     setLoading(true);
//     try {
//       const queryParams = new URLSearchParams({
//         page: pagination.page,
//         limit: pagination.limit,
//         ...filters
//       });

//       const res = await fetch(`/api/deliveries/history?${queryParams}`);
//       if (!res.ok) throw new Error('Failed to fetch');
      
//       const data = await res.json();
//       setDeliveries(data.deliveries);
//       setPagination(prev => ({ ...prev, total: data.total }));
//     } catch (error) {
//       console.error('Error fetching deliveries:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleFilterChange = (name, value) => {
//     setFilters(prev => ({ ...prev, [name]: value }));
//     setPagination(prev => ({ ...prev, page: 1 }));
//   };

//   const handleExportData = async () => {
//     try {
//       const res = await fetch('/api/deliveries/export', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(filters)
//       });

//       if (!res.ok) throw new Error('Failed to export');

//       const blob = await res.blob();
//       const url = URL.createObjectURL(blob);
//       const a = document.createElement('a');
//       a.href = url;
//       a.download = `deliveries-${new Date().toISOString().split('T')[0]}.csv`;
//       a.click();
//     } catch (error) {
//       alert('Failed to export data');
//     }
//   };

//   const statusColors = {
//     pending: 'text-yellow-400 bg-yellow-500/20',
//     approved: 'text-blue-400 bg-blue-500/20',
//     assigned: 'text-purple-400 bg-purple-500/20',
//     pickup: 'text-orange-400 bg-orange-500/20',
//     in_transit: 'text-cyan-400 bg-cyan-500/20',
//     delivered: 'text-green-400 bg-green-500/20',
//     failed: 'text-red-400 bg-red-500/20',
//     cancelled: 'text-gray-400 bg-gray-500/20'
//   };

//   const totalPages = Math.ceil(pagination.total / pagination.limit);

//   return (
//     <RoleGuard allowedRoles={['medical_staff']}>
//     <DashboardLayout>
//       <div className="min-h-screen p-8">
//         {/* Background elements */}
//         <div className="fixed inset-0 overflow-hidden pointer-events-none">
//           <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-500/5 rounded-full blur-3xl animate-pulse-slow"></div>
//           <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-rose-500/5 rounded-full blur-3xl animate-pulse-slow animation-delay-2000"></div>
//         </div>

//         {/* Header */}
//         <div className="relative mb-8">
//           <button
//             onClick={() => router.back()}
//             className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
//           >
//             <BackIcon className="w-5 h-5" />
//             <span>Back to Dashboard</span>
//           </button>

//           <div className="flex items-center justify-between">
//             <div>
//               <h1 className="text-3xl font-bold text-white mb-2">Delivery History</h1>
//               <p className="text-gray-400">View and manage all your past deliveries</p>
//             </div>

//             <div className="flex gap-4">
//               <button
//                 onClick={() => setShowFilters(!showFilters)}
//                 className="px-4 py-2 bg-gray-800/50 text-white rounded-xl hover:bg-gray-700/50 transition-all flex items-center gap-2"
//               >
//                 <FilterIcon className="w-5 h-5" />
//                 Filters
//               </button>
//               <button
//                 onClick={handleExportData}
//                 className="px-4 py-2 bg-red-600/20 text-red-400 rounded-xl hover:bg-red-600/30 transition-all flex items-center gap-2"
//               >
//                 <DownloadIcon className="w-5 h-5" />
//                 Export
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Filters */}
//         {showFilters && (
//           <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-red-500/20 mb-6 animate-fade-in-up">
//             <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-400 mb-2">Status</label>
//                 <select
//                   value={filters.status}
//                   onChange={(e) => handleFilterChange('status', e.target.value)}
//                   className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-red-500"
//                 >
//                   <option value="all">All Status</option>
//                   <option value="delivered">Delivered</option>
//                   <option value="cancelled">Cancelled</option>
//                   <option value="failed">Failed</option>
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-400 mb-2">Type</label>
//                 <select
//                   value={filters.type}
//                   onChange={(e) => handleFilterChange('type', e.target.value)}
//                   className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-red-500"
//                 >
//                   <option value="all">All Types</option>
//                   <option value="medication">Medication</option>
//                   <option value="blood">Blood Samples</option>
//                   <option value="organ">Organ</option>
//                   <option value="medical_supplies">Medical Supplies</option>
//                   <option value="documents">Documents</option>
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-400 mb-2">Date Range</label>
//                 <select
//                   value={filters.dateRange}
//                   onChange={(e) => handleFilterChange('dateRange', e.target.value)}
//                   className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-red-500"
//                 >
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
//                     placeholder="Order ID or recipient..."
//                     className="w-full px-4 py-2 pl-10 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-red-500"
//                   />
//                   <SearchIcon className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Deliveries Table */}
//         <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-red-500/20">
//           {loading ? (
//             <div className="flex items-center justify-center py-12">
//               <svg className="animate-spin h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24">
//                 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//               </svg>
//             </div>
//           ) : (
//             <>
//               <div className="overflow-x-auto">
//                 <table className="w-full">
//                   <thead>
//                     <tr className="text-left border-b border-gray-800">
//                       <th className="pb-3 text-sm font-medium text-gray-400">Order ID</th>
//                       <th className="pb-3 text-sm font-medium text-gray-400">Date</th>
//                       <th className="pb-3 text-sm font-medium text-gray-400">Type</th>
//                       <th className="pb-3 text-sm font-medium text-gray-400">Recipient</th>
//                       <th className="pb-3 text-sm font-medium text-gray-400">Duration</th>
//                       <th className="pb-3 text-sm font-medium text-gray-400">Cost</th>
//                       <th className="pb-3 text-sm font-medium text-gray-400">Status</th>
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y divide-gray-800">
//                     {deliveries.length === 0 ? (
//                       <tr>
//                         <td colSpan="8" className="py-8 text-center text-gray-500">
//                           No deliveries found
//                         </td>
//                       </tr>
//                     ) : (
//                       deliveries.map((delivery) => (
//                         <tr key={delivery._id} className="hover:bg-gray-800/50 transition-colors">
//                           <td className="py-3">
//                             <span className="text-white font-medium">{delivery.orderId}</span>
//                           </td>
//                           <td className="py-3">
//                             <span className="text-gray-300">
//                               {new Date(delivery.createdAt).toLocaleDateString()}
//                             </span>
//                           </td>
//                           <td className="py-3">
//                             <span className="text-gray-300 capitalize">{delivery.package?.type}</span>
//                           </td>
//                           <td className="py-3">
//                             <span className="text-gray-300">{delivery.recipient?.name}</span>
//                           </td>
//                           <td className="py-3">
//                             <span className="text-gray-300">
//                               {delivery.delivery?.actualDeliveryTime && delivery.createdAt ? 
//                                 `${Math.round((new Date(delivery.delivery.actualDeliveryTime) - new Date(delivery.createdAt)) / 60000)} min` : 
//                                 'N/A'}
//                             </span>
//                           </td>
//                           <td className="py-3">
//                             <span className="text-gray-300">
//                               ${delivery.pricing?.totalPrice?.toFixed(2) || 'N/A'}
//                             </span>
//                           </td>
//                           <td className="py-3">
//                             <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[delivery.status] || statusColors.cancelled}`}>
//                               {delivery.status.replace('_', ' ')}
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
//                     Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} results
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
//                               ? 'bg-red-600 text-white'
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
//     </DashboardLayout>
//     </RoleGuard>
//   );
// }













// Responsive 
// app/dashboard/delivery-history/page.jsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import RoleGuard from '@/components/auth/RoleGuard';

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

const DownloadIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </svg>
);

const SearchIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

export default function DeliveryHistoryPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: 'all',
    type: 'all',
    dateRange: '30days',
    search: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0
  });

  useEffect(() => {
    fetchDeliveries();
  }, [filters, pagination.page]);

  const fetchDeliveries = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page: pagination.page,
        limit: pagination.limit,
        ...filters
      });

      const res = await fetch(`/api/deliveries/history?${queryParams}`);
      if (!res.ok) throw new Error('Failed to fetch');
      
      const data = await res.json();
      setDeliveries(data.deliveries);
      setPagination(prev => ({ ...prev, total: data.total }));
    } catch (error) {
      console.error('Error fetching deliveries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleExportData = async () => {
    try {
      const res = await fetch('/api/deliveries/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(filters)
      });

      if (!res.ok) throw new Error('Failed to export');

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `deliveries-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
    } catch (error) {
      alert('Failed to export data');
    }
  };

  const statusColors = {
    pending: 'text-yellow-400 bg-yellow-500/20',
    approved: 'text-blue-400 bg-blue-500/20',
    assigned: 'text-purple-400 bg-purple-500/20',
    pickup: 'text-orange-400 bg-orange-500/20',
    in_transit: 'text-cyan-400 bg-cyan-500/20',
    delivered: 'text-green-400 bg-green-500/20',
    failed: 'text-red-400 bg-red-500/20',
    cancelled: 'text-gray-400 bg-gray-500/20'
  };

  const totalPages = Math.ceil(pagination.total / pagination.limit);

  return (
    <RoleGuard allowedRoles={['medical_staff']}>
    <DashboardLayout>
      <div className="min-h-screen p-4 sm:p-6 lg:p-8">
        {/* Background elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-500/5 rounded-full blur-3xl animate-pulse-slow"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-rose-500/5 rounded-full blur-3xl animate-pulse-slow animation-delay-2000"></div>
        </div>

        {/* Header */}
        <div className="relative mb-6 sm:mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
          >
            <BackIcon className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-sm sm:text-base">Back to Dashboard</span>
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1 sm:mb-2">Delivery History</h1>
              <p className="text-sm sm:text-base text-gray-400">View and manage all your past deliveries</p>
            </div>

            <div className="flex gap-2 sm:gap-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex-1 sm:flex-initial px-3 sm:px-4 py-2 bg-gray-800/50 text-white rounded-xl hover:bg-gray-700/50 transition-all flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <FilterIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Filters</span>
              </button>
              <button
                onClick={handleExportData}
                className="flex-1 sm:flex-initial px-3 sm:px-4 py-2 bg-red-600/20 text-red-400 rounded-xl hover:bg-red-600/30 transition-all flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <DownloadIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Export</span>
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-4 sm:p-6 border border-red-500/20 mb-4 sm:mb-6 animate-fade-in-up">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="col-span-1">
                <label className="block text-xs sm:text-sm font-medium text-gray-400 mb-1 sm:mb-2">Status</label>
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-red-500 text-sm sm:text-base"
                >
                  <option value="all">All Status</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="failed">Failed</option>
                </select>
              </div>

              <div className="col-span-1">
                <label className="block text-xs sm:text-sm font-medium text-gray-400 mb-1 sm:mb-2">Type</label>
                <select
                  value={filters.type}
                  onChange={(e) => handleFilterChange('type', e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-red-500 text-sm sm:text-base"
                >
                  <option value="all">All Types</option>
                  <option value="medication">Medication</option>
                  <option value="blood">Blood Samples</option>
                  <option value="organ">Organ</option>
                  <option value="medical_supplies">Medical Supplies</option>
                  <option value="documents">Documents</option>
                </select>
              </div>

              <div className="col-span-1">
                <label className="block text-xs sm:text-sm font-medium text-gray-400 mb-1 sm:mb-2">Date Range</label>
                <select
                  value={filters.dateRange}
                  onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-red-500 text-sm sm:text-base"
                >
                  <option value="7days">Last 7 Days</option>
                  <option value="30days">Last 30 Days</option>
                  <option value="90days">Last 90 Days</option>
                  <option value="all">All Time</option>
                </select>
              </div>

              <div className="col-span-1">
                <label className="block text-xs sm:text-sm font-medium text-gray-400 mb-1 sm:mb-2">Search</label>
                <div className="relative">
                  <input
                    type="text"
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    placeholder="Order ID or recipient..."
                    className="w-full px-3 sm:px-4 py-2 pl-8 sm:pl-10 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-red-500 text-sm sm:text-base"
                  />
                  <SearchIcon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 absolute left-2 sm:left-3 top-2.5" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Deliveries Table */}
        <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-3 sm:p-6 border border-red-500/20">
          {loading ? (
            <div className="flex items-center justify-center py-8 sm:py-12">
              <svg className="animate-spin h-6 w-6 sm:h-8 sm:w-8 text-red-500" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          ) : (
            <>
              {/* Table wrapper with horizontal scroll for mobile */}
              <div className="overflow-x-auto -mx-3 sm:-mx-6">
                <div className="inline-block min-w-full align-middle px-3 sm:px-6">
                  <table className="min-w-full">
                    <thead>
                      <tr className="text-left border-b border-gray-800">
                        <th className="pb-2 sm:pb-3 pr-3 text-xs sm:text-sm font-medium text-gray-400 whitespace-nowrap">Order ID</th>
                        <th className="pb-2 sm:pb-3 px-3 text-xs sm:text-sm font-medium text-gray-400 whitespace-nowrap">Date</th>
                        <th className="pb-2 sm:pb-3 px-3 text-xs sm:text-sm font-medium text-gray-400 whitespace-nowrap">Type</th>
                        <th className="pb-2 sm:pb-3 px-3 text-xs sm:text-sm font-medium text-gray-400 whitespace-nowrap">Recipient</th>
                        <th className="pb-2 sm:pb-3 px-3 text-xs sm:text-sm font-medium text-gray-400 whitespace-nowrap">Duration</th>
                        <th className="pb-2 sm:pb-3 px-3 text-xs sm:text-sm font-medium text-gray-400 whitespace-nowrap">Cost</th>
                        <th className="pb-2 sm:pb-3 pl-3 text-xs sm:text-sm font-medium text-gray-400 whitespace-nowrap">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                      {deliveries.length === 0 ? (
                        <tr>
                          <td colSpan="7" className="py-6 sm:py-8 text-center text-sm sm:text-base text-gray-500">
                            No deliveries found
                          </td>
                        </tr>
                      ) : (
                        deliveries.map((delivery) => (
                          <tr key={delivery._id} className="hover:bg-gray-800/50 transition-colors">
                            <td className="py-2 sm:py-3 pr-3">
                              <span className="text-white font-medium text-xs sm:text-sm whitespace-nowrap">{delivery.orderId}</span>
                            </td>
                            <td className="py-2 sm:py-3 px-3">
                              <span className="text-gray-300 text-xs sm:text-sm whitespace-nowrap">
                                {new Date(delivery.createdAt).toLocaleDateString()}
                              </span>
                            </td>
                            <td className="py-2 sm:py-3 px-3">
                              <span className="text-gray-300 capitalize text-xs sm:text-sm whitespace-nowrap">{delivery.package?.type}</span>
                            </td>
                            <td className="py-2 sm:py-3 px-3">
                              <span className="text-gray-300 text-xs sm:text-sm whitespace-nowrap">{delivery.recipient?.name}</span>
                            </td>
                            <td className="py-2 sm:py-3 px-3">
                              <span className="text-gray-300 text-xs sm:text-sm whitespace-nowrap">
                                {delivery.delivery?.actualDeliveryTime && delivery.createdAt ? 
                                  `${Math.round((new Date(delivery.delivery.actualDeliveryTime) - new Date(delivery.createdAt)) / 60000)} min` : 
                                  'N/A'}
                              </span>
                            </td>
                            <td className="py-2 sm:py-3 px-3">
                              <span className="text-gray-300 text-xs sm:text-sm whitespace-nowrap">
                                ${delivery.pricing?.totalPrice?.toFixed(2) || 'N/A'}
                              </span>
                            </td>
                            <td className="py-2 sm:py-3 pl-3">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${statusColors[delivery.status] || statusColors.cancelled}`}>
                                {delivery.status.replace('_', ' ')}
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
                <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
                  <p className="text-gray-400 text-xs sm:text-sm text-center sm:text-left">
                    Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} results
                  </p>
                  
                  <div className="flex gap-1 sm:gap-2 justify-center sm:justify-end">
                    <button
                      onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                      disabled={pagination.page === 1}
                      className="px-2 sm:px-3 py-1 bg-gray-800/50 text-white rounded-lg hover:bg-gray-700/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-xs sm:text-sm"
                    >
                      Previous
                    </button>
                    
                    {/* Show fewer page numbers on mobile */}
                    <div className="flex gap-1 sm:gap-2">
                      {[...Array(Math.min(3, totalPages))].map((_, i) => {
                        let pageNum;
                        if (totalPages <= 3) {
                          pageNum = i + 1;
                        } else if (pagination.page === 1) {
                          pageNum = i + 1;
                        } else if (pagination.page === totalPages) {
                          pageNum = totalPages - 2 + i;
                        } else {
                          pageNum = pagination.page - 1 + i;
                        }
                        
                        if (pageNum < 1 || pageNum > totalPages) return null;
                        
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setPagination(prev => ({ ...prev, page: pageNum }))}
                            className={`px-2 sm:px-3 py-1 rounded-lg transition-all text-xs sm:text-sm ${
                              pagination.page === pageNum
                                ? 'bg-red-600 text-white'
                                : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>
                    
                    <button
                      onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                      disabled={pagination.page === totalPages}
                      className="px-2 sm:px-3 py-1 bg-gray-800/50 text-white rounded-lg hover:bg-gray-700/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-xs sm:text-sm"
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
    </DashboardLayout>
    </RoleGuard>
  );
}
// app/dashboard/hospital-admin/deliveries/page.jsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import RoleGuard from '@/components/auth/RoleGuard';
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

const RefreshIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

export default function HospitalDeliveriesPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: 'all',
    type: 'all',
    urgency: 'all',
    direction: 'all', // incoming/outgoing
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

      const res = await fetch(`/api/hospital-admin/deliveries?${queryParams}`);
      if (!res.ok) throw new Error('Failed to fetch');
      
      const data = await res.json();
      setDeliveries(data.deliveries);
      setPagination(prev => ({ ...prev, total: data.total }));
    } catch (error) {
      console.error('Error fetching deliveries:', error);
      toast.error('Failed to load deliveries');
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
      const res = await fetch('/api/hospital-admin/deliveries/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(filters)
      });

      if (!res.ok) throw new Error('Failed to export');

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `hospital-deliveries-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
    } catch (error) {
      toast.error('Failed to export data');
    }
  };

  const statusColors = {
    pending: 'text-yellow-400 bg-yellow-500/20',
    pending_approval: 'text-yellow-400 bg-yellow-500/20',
    approved: 'text-blue-400 bg-blue-500/20',
    assigned: 'text-purple-400 bg-purple-500/20',
    pickup: 'text-orange-400 bg-orange-500/20',
    in_transit: 'text-cyan-400 bg-cyan-500/20',
    pending_confirmation: 'text-indigo-400 bg-indigo-500/20',
    delivered: 'text-green-400 bg-green-500/20',
    failed: 'text-red-400 bg-red-500/20',
    cancelled: 'text-gray-400 bg-gray-500/20'
  };

  const urgencyColors = {
    routine: 'text-blue-400 bg-blue-500/20',
    urgent: 'text-orange-400 bg-orange-500/20',
    emergency: 'text-red-400 bg-red-500/20'
  };

  const totalPages = Math.ceil(pagination.total / pagination.limit);

  return (
    <RoleGuard allowedRoles={['hospital_admin']}>
      <DashboardLayout>
        <div className="min-h-screen p-8">
          {/* Background elements */}
          <div className="fixed inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-500/5 rounded-full blur-3xl animate-pulse-slow"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-rose-500/5 rounded-full blur-3xl animate-pulse-slow animation-delay-2000"></div>
          </div>

          {/* Header */}
          <div className="relative mb-8">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
            >
              <BackIcon className="w-5 h-5" />
              <span>Back to Dashboard</span>
            </button>

            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Hospital Deliveries</h1>
                <p className="text-gray-400">View and manage all deliveries for your hospital</p>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={fetchDeliveries}
                  className="px-4 py-2 bg-gray-800/50 text-white rounded-xl hover:bg-gray-700/50 transition-all flex items-center gap-2"
                >
                  <RefreshIcon className="w-5 h-5" />
                  Refresh
                </button>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="px-4 py-2 bg-gray-800/50 text-white rounded-xl hover:bg-gray-700/50 transition-all flex items-center gap-2"
                >
                  <FilterIcon className="w-5 h-5" />
                  Filters
                </button>
                <button
                  onClick={handleExportData}
                  className="px-4 py-2 bg-red-600/20 text-red-400 rounded-xl hover:bg-red-600/30 transition-all flex items-center gap-2"
                >
                  <DownloadIcon className="w-5 h-5" />
                  Export
                </button>
              </div>
            </div>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-red-500/20 mb-6 animate-fade-in-up">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Status</label>
                  <select
                    value={filters.status}
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                    className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-red-500"
                  >
                    <option value="all">All Status</option>
                    <option value="pending_approval">Pending Approval</option>
                    <option value="approved">Approved</option>
                    <option value="assigned">Assigned</option>
                    <option value="in_transit">In Transit</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="failed">Failed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Type</label>
                  <select
                    value={filters.type}
                    onChange={(e) => handleFilterChange('type', e.target.value)}
                    className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-red-500"
                  >
                    <option value="all">All Types</option>
                    <option value="medication">Medication</option>
                    <option value="blood">Blood Samples</option>
                    <option value="organ">Organ</option>
                    <option value="medical_supplies">Medical Supplies</option>
                    <option value="documents">Documents</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Urgency</label>
                  <select
                    value={filters.urgency}
                    onChange={(e) => handleFilterChange('urgency', e.target.value)}
                    className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-red-500"
                  >
                    <option value="all">All Urgency</option>
                    <option value="routine">Routine</option>
                    <option value="urgent">Urgent</option>
                    <option value="emergency">Emergency</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Direction</label>
                  <select
                    value={filters.direction}
                    onChange={(e) => handleFilterChange('direction', e.target.value)}
                    className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-red-500"
                  >
                    <option value="all">All Directions</option>
                    <option value="incoming">Incoming</option>
                    <option value="outgoing">Outgoing</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Search</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={filters.search}
                      onChange={(e) => handleFilterChange('search', e.target.value)}
                      placeholder="Order ID or staff name..."
                      className="w-full px-4 py-2 pl-10 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-red-500"
                    />
                    <SearchIcon className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Deliveries Table */}
          <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-red-500/20">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <svg className="animate-spin h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left border-b border-gray-800">
                        <th className="pb-3 text-sm font-medium text-gray-400">Order ID</th>
                        <th className="pb-3 text-sm font-medium text-gray-400">Date</th>
                        <th className="pb-3 text-sm font-medium text-gray-400">Type</th>
                        <th className="pb-3 text-sm font-medium text-gray-400">Direction</th>
                        <th className="pb-3 text-sm font-medium text-gray-400">Urgency</th>
                        <th className="pb-3 text-sm font-medium text-gray-400">Requested By</th>
                        <th className="pb-3 text-sm font-medium text-gray-400">Status</th>
                        <th className="pb-3 text-sm font-medium text-gray-400">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                      {deliveries.length === 0 ? (
                        <tr>
                          <td colSpan="8" className="py-8 text-center text-gray-500">
                            No deliveries found
                          </td>
                        </tr>
                      ) : (
                        deliveries.map((delivery) => (
                          <tr key={delivery._id} className="hover:bg-gray-800/50 transition-colors">
                            <td className="py-3">
                              <span className="text-white font-medium">{delivery.orderId}</span>
                            </td>
                            <td className="py-3">
                              <span className="text-gray-300">
                                {new Date(delivery.createdAt).toLocaleDateString()}
                              </span>
                            </td>
                            <td className="py-3">
                              <span className="text-gray-300 capitalize">{delivery.package?.type}</span>
                            </td>
                            <td className="py-3">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                delivery.isIncoming
                                  ? 'bg-blue-500/20 text-blue-400'
                                  : 'bg-orange-500/20 text-orange-400'
                              }`}>
                                {delivery.isIncoming ? 'Incoming' : 'Outgoing'}
                              </span>
                            </td>
                            <td className="py-3">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${urgencyColors[delivery.package?.urgency] || urgencyColors.routine}`}>
                                {delivery.package?.urgency}
                              </span>
                            </td>
                            <td className="py-3">
                              <span className="text-gray-300">{delivery.requestedBy?.name || 'Unknown'}</span>
                            </td>
                            <td className="py-3">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[delivery.status] || statusColors.cancelled}`}>
                                {delivery.status.replace('_', ' ')}
                              </span>
                            </td>
                            <td className="py-3">
                              <button
                                onClick={() => router.push(`/dashboard/delivery/${delivery._id}`)}
                                className="text-red-400 hover:text-red-300 text-sm"
                              >
                                View Details
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
                      Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} results
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
                                ? 'bg-red-600 text-white'
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
      </DashboardLayout>
    </RoleGuard>
  );
}
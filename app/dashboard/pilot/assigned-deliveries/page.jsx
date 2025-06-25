// Responsive 
// app/dashboard/pilot/assigned-deliveries/page.jsx
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import NotificationBell from '@/components/NotificationBell';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import RoleGuard from '@/components/auth/RoleGuard';

export default function PilotAssignedDeliveriesPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [assignedDeliveries, setAssignedDeliveries] = useState([]);
  const [filteredDeliveries, setFilteredDeliveries] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchAssignedDeliveries();
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchAssignedDeliveries, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    filterDeliveries();
  }, [assignedDeliveries, activeFilter, searchQuery]);

  const fetchAssignedDeliveries = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/pilot/deliveries');
      const data = await res.json();
      setAssignedDeliveries(data);
    } catch (error) {
      console.error('Failed to fetch deliveries:', error);
      toast.error('Failed to load deliveries');
    } finally {
      setLoading(false);
    }
  };

  const filterDeliveries = () => {
    let filtered = [...assignedDeliveries];

    // Apply priority filter
    if (activeFilter !== 'all') {
      filtered = filtered.filter(delivery => delivery.priority === activeFilter);
    }

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(delivery => 
        delivery.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        delivery.packageType?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        delivery.pickup?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        delivery.delivery?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredDeliveries(filtered);
  };

  const getFilterStats = () => {
    return {
      all: assignedDeliveries.length,
      routine: assignedDeliveries.filter(d => d.priority === 'routine').length,
      urgent: assignedDeliveries.filter(d => d.priority === 'urgent').length,
      emergency: assignedDeliveries.filter(d => d.priority === 'emergency').length
    };
  };

  const stats = getFilterStats();

  return (
    <RoleGuard allowedRoles={['pilot']}>
    <DashboardLayout>
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <BackIcon className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">Assigned Deliveries</h1>
              <p className="text-gray-400 text-sm sm:text-base mt-1">
                Manage all your assigned delivery tasks
              </p>
            </div>
          </div>
          <NotificationBell />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
        <StatCard
          label="Total Assigned"
          value={stats.all}
          color="text-white"
          bgColor="bg-gray-600"
          active={activeFilter === 'all'}
          onClick={() => setActiveFilter('all')}
        />
        <StatCard
          label="Routine"
          value={stats.routine}
          color="text-gray-400"
          bgColor="bg-gray-500"
          active={activeFilter === 'routine'}
          onClick={() => setActiveFilter('routine')}
        />
        <StatCard
          label="Urgent"
          value={stats.urgent}
          color="text-orange-400"
          bgColor="bg-orange-500"
          active={activeFilter === 'urgent'}
          onClick={() => setActiveFilter('urgent')}
        />
        <StatCard
          label="Emergency"
          value={stats.emergency}
          color="text-red-400"
          bgColor="bg-red-500"
          active={activeFilter === 'emergency'}
          onClick={() => setActiveFilter('emergency')}
        />
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-green-500/20 mb-6">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <div className="flex-1">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by Order ID, Package Type, or Location..."
                className="w-full bg-gray-800/50 text-white rounded-lg sm:rounded-xl pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 focus:ring-2 focus:ring-green-500 focus:outline-none text-sm sm:text-base placeholder-gray-500"
              />
            </div>
          </div>
          <button
            onClick={fetchAssignedDeliveries}
            className="px-4 sm:px-6 py-2.5 sm:py-3 bg-green-600/20 hover:bg-green-600/30 text-green-400 rounded-lg sm:rounded-xl transition-all font-medium flex items-center justify-center gap-2 text-sm sm:text-base"
          >
            <RefreshIcon className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </div>

      {/* Deliveries List */}
      <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-green-500/20">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-semibold text-white">
            {activeFilter === 'all' ? 'All Deliveries' : `${activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1)} Deliveries`}
          </h2>
          <span className="text-sm text-gray-400">
            {filteredDeliveries.length} {filteredDeliveries.length === 1 ? 'delivery' : 'deliveries'}
          </span>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-800/50 rounded-lg sm:rounded-xl p-4 sm:p-5">
                  <div className="h-5 bg-gray-700 rounded w-32 mb-3"></div>
                  <div className="h-4 bg-gray-700 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredDeliveries.length === 0 ? (
          <div className="text-center py-12 sm:py-16">
            <EmptyIcon className="w-12 h-12 sm:w-16 sm:h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500 text-base sm:text-lg">
              {searchQuery || activeFilter !== 'all' 
                ? 'No deliveries found matching your criteria' 
                : 'No deliveries assigned to you'}
            </p>
            {(searchQuery || activeFilter !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveFilter('all');
                }}
                className="mt-4 text-green-400 hover:text-green-300 text-sm sm:text-base"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4 max-h-[calc(100vh-400px)] overflow-y-auto scrollbar-hide">
            {filteredDeliveries.map((delivery) => (
              <EnhancedDeliveryCard key={delivery._id} delivery={delivery} onUpdate={fetchAssignedDeliveries} />
            ))}
          </div>
        )}
      </div>
    </div>
    </DashboardLayout>
    </RoleGuard>
  );
}

// Enhanced Delivery Card with all functionality
function EnhancedDeliveryCard({ delivery, onUpdate }) {
  const [loading, setLoading] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [flightStatus, setFlightStatus] = useState(delivery.status);
  const [showDetails, setShowDetails] = useState(false);

  const handleStartFlight = async () => {
    if (!confirm('Are you ready to start the flight?')) return;
    
    setLoading(true);
    try {
      const res = await fetch(`/api/pilot/deliveries/${delivery._id}/start-flight`, {
        method: 'POST'
      });

      if (!res.ok) throw new Error('Failed to start flight');
      
      toast.success('Flight started successfully!');
      setFlightStatus('in_transit');
      onUpdate();
    } catch (error) {
      toast.error('Failed to start flight');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelFlight = async () => {
    if (cancelReason.trim().length < 5) {
      toast.error('Please provide a detailed reason (minimum 5 characters)');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/pilot/deliveries/${delivery._id}/cancel-flight`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: cancelReason })
      });

      if (!res.ok) throw new Error('Failed to cancel flight');
      
      toast.success('Flight cancelled');
      setFlightStatus('failed');
      setShowCancelModal(false);
      onUpdate();
    } catch (error) {
      toast.error('Failed to cancel flight');
    } finally {
      setLoading(false);
    }
  };

  const handleDeliveryDone = async () => {
    if (!confirm('Have you delivered the package?')) return;
    
    setLoading(true);
    try {
      const res = await fetch(`/api/pilot/deliveries/${delivery._id}/mark-delivered`, {
        method: 'POST'
      });

      if (!res.ok) throw new Error('Failed to mark delivery as done');
      
      toast.success('Awaiting confirmation from staff');
      setFlightStatus('pending_confirmation');
      onUpdate();
    } catch (error) {
      toast.error('Failed to mark delivery as done');
    } finally {
      setLoading(false);
    }
  };

  const priorityConfig = {
    routine: {
      border: 'border-gray-500',
      bg: 'bg-gray-500/10',
      text: 'text-gray-400',
      badge: 'bg-gray-500/20'
    },
    urgent: {
      border: 'border-orange-500',
      bg: 'bg-orange-500/10',
      text: 'text-orange-400',
      badge: 'bg-orange-500/20'
    },
    emergency: {
      border: 'border-red-500',
      bg: 'bg-red-500/10',
      text: 'text-red-400',
      badge: 'bg-red-500/20'
    }
  };

  const config = priorityConfig[delivery.priority] || priorityConfig.routine;

  return (
    <>
      <div className={`bg-gray-800/50 backdrop-blur rounded-lg sm:rounded-xl p-4 sm:p-5 border-l-4 ${config.border} hover:bg-gray-800/70 transition-all border-r border-t border-b border-green-500/10`}>
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-white font-semibold text-base sm:text-lg">{delivery.orderId}</h3>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${config.badge} ${config.text}`}>
                {delivery.priority.toUpperCase()}
              </span>
            </div>
            <p className="text-gray-400 text-sm mt-1">{delivery.packageType}</p>
          </div>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-gray-400 hover:text-white transition-colors sm:ml-4"
          >
            <ChevronIcon className={`w-5 h-5 transform transition-transform ${showDetails ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Main Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4">
          <div className="space-y-2">
            <div>
              <p className="text-xs text-gray-400 mb-1">Pickup Location</p>
              <p className="text-sm text-gray-300 flex items-start gap-1">
                <LocationIcon className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                {delivery.pickup}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">Delivery Location</p>
              <p className="text-sm text-gray-300 flex items-start gap-1">
                <LocationIcon className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                {delivery.delivery}
              </p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">Distance</span>
              <span className="text-sm text-gray-300 font-medium">{delivery.distance} km</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">Weight</span>
              <span className="text-sm text-gray-300 font-medium">{delivery.weight || 'N/A'} kg</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">Est. Time</span>
              <span className="text-sm text-gray-300 font-medium">{delivery.estimatedTime || 'N/A'} min</span>
            </div>
          </div>
        </div>

        {/* Expanded Details */}
        {showDetails && (
          <div className="border-t border-gray-700 pt-3 mb-4 space-y-2">
            {delivery.specialInstructions && (
              <div>
                <p className="text-xs text-gray-400 mb-1">Special Instructions</p>
                <p className="text-sm text-gray-300">{delivery.specialInstructions}</p>
              </div>
            )}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-gray-400">Created:</span>
                <span className="text-gray-300 ml-1">{new Date(delivery.createdAt).toLocaleString()}</span>
              </div>
              <div>
                <span className="text-gray-400">Status:</span>
                <span className="text-gray-300 ml-1">{flightStatus.replace('_', ' ')}</span>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          {flightStatus === 'assigned' ? (
            <button 
              onClick={handleStartFlight}
              disabled={loading}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-600 disabled:to-gray-700 text-white rounded-lg transition-all text-sm font-medium shadow-lg hover:shadow-green-500/25 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <LoadingIcon className="w-4 h-4 animate-spin" />
                  Starting...
                </>
              ) : (
                <>
                  <FlightIcon className="w-4 h-4" />
                  Start Flight
                </>
              )}
            </button>
          ) : flightStatus === 'in_transit' ? (
            <>
              <button 
                onClick={handleDeliveryDone}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-600 disabled:to-gray-700 text-white rounded-lg transition-all text-sm font-medium flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <LoadingIcon className="w-4 h-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CheckIcon className="w-4 h-4" />
                    Mark as Delivered
                  </>
                )}
              </button>
              <button 
                onClick={() => setShowCancelModal(true)}
                disabled={loading}
                className="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg transition-all text-sm font-medium flex items-center justify-center gap-2"
              >
                <CancelIcon className="w-4 h-4" />
                Cancel
              </button>
            </>
          ) : flightStatus === 'pending_confirmation' ? (
            <div className="flex-1 text-center py-2 bg-yellow-500/20 text-yellow-400 rounded-lg text-sm font-medium">
              Awaiting Staff Confirmation
            </div>
          ) : (
            <div className="flex-1 text-center py-2 bg-gray-700/50 text-gray-400 rounded-lg text-sm">
              Status: {flightStatus.replace('_', ' ')}
            </div>
          )}
        </div>
      </div>

      {/* Cancel Flight Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 rounded-xl sm:rounded-2xl p-4 sm:p-6 max-w-md w-full">
            <h2 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">Cancel Flight</h2>
            <p className="text-gray-400 mb-3 sm:mb-4 text-sm sm:text-base">
              Please provide a detailed reason for cancelling this flight:
            </p>
            
            <textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              className="w-full bg-gray-800 text-white rounded-lg px-3 sm:px-4 py-2 sm:py-3 focus:ring-2 focus:ring-red-500 focus:outline-none h-24 sm:h-32 resize-none text-sm sm:text-base"
              placeholder="Enter cancellation reason (minimum 5 characters)..."
            />
            
            <div className="flex gap-2 sm:gap-3 mt-4 sm:mt-6">
              <button
                onClick={handleCancelFlight}
                disabled={loading || cancelReason.trim().length < 5}
                className="flex-1 py-2 sm:py-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-all text-sm sm:text-base"
              >
                {loading ? 'Cancelling...' : 'Cancel Flight'}
              </button>
              <button
                onClick={() => {
                  setShowCancelModal(false);
                  setCancelReason('');
                }}
                disabled={loading}
                className="px-4 sm:px-6 py-2 sm:py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold transition-all text-sm sm:text-base"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Stat Card Component
function StatCard({ label, value, color, bgColor, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`p-3 sm:p-4 rounded-lg sm:rounded-xl transition-all ${
        active 
          ? `${bgColor}/30 ring-2 ring-offset-2 ring-offset-gray-900 ${bgColor.replace('bg-', 'ring-')}` 
          : 'bg-gray-800/50 hover:bg-gray-800/70'
      }`}
    >
      <p className={`text-xs sm:text-sm ${active ? color : 'text-gray-400'}`}>{label}</p>
      <p className={`text-2xl sm:text-3xl font-bold ${active ? color : 'text-white'} mt-1`}>{value}</p>
    </button>
  );
}

// Icon Components
const BackIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
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

const EmptyIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
  </svg>
);

const ChevronIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

const LocationIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const FlightIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
  </svg>
);

const CheckIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const CancelIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const LoadingIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);
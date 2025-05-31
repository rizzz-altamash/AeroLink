// app/dashboard/track-all/page.jsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import RoleGuard from '@/components/auth/RoleGuard';
import dynamic from 'next/dynamic';

// Dynamically import map component to avoid SSR issues
// const MapComponent = dynamic(() => import('@/components/MapComponent'), { 
//   ssr: false,
//   loading: () => <div className="h-full bg-gray-800 rounded-xl flex items-center justify-center"><p className="text-gray-500">Loading map...</p></div>
// });

// Icon Components
const BackIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
  </svg>
);

const RefreshIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

const DroneIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
  </svg>
);

const LocationIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const BatteryIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
  </svg>
);

const TimeIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const FilterIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
  </svg>
);

const ListIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

const GridIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
  </svg>
);

const MapIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
  </svg>
);

function TrackAllContent() {
  const router = useRouter();
  const { data: session } = useSession();
  const [activeDeliveries, setActiveDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // 'grid', 'list', or 'map'
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all', 'routine', 'urgent', 'emergency'
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    fetchActiveDeliveries();
    
    // Auto-refresh logic
    let interval;
    if (autoRefresh) {
      interval = setInterval(() => {
        fetchActiveDeliveries();
        setLastUpdated(new Date());
      }, 10000); // Refresh every 10 seconds
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh, filter]);

  const fetchActiveDeliveries = async () => {
    try {
      const res = await fetch(`/api/deliveries/active?extended=true`);
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setActiveDeliveries(data);
    } catch (error) {
      console.error('Failed to fetch active deliveries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    setLoading(true);
    fetchActiveDeliveries();
    setLastUpdated(new Date());
  };

  const filteredDeliveries = activeDeliveries.filter(delivery => {
    if (filter === 'all') return true;
    return delivery.package?.urgency === filter;
  });

  const statusColors = {
    pending: 'bg-yellow-500',
    approved: 'bg-blue-500',
    assigned: 'bg-purple-500',
    pickup: 'bg-orange-500',
    in_transit: 'bg-green-500'
  };

  const urgencyColors = {
    routine: 'from-blue-600 to-cyan-600',
    urgent: 'from-orange-600 to-amber-600',
    emergency: 'from-red-600 to-rose-600'
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <svg className="animate-spin h-12 w-12 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-gray-400">Loading active deliveries...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
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
              <h1 className="text-3xl font-bold text-white mb-2">Track All Deliveries</h1>
              <p className="text-gray-400">
                Monitoring {filteredDeliveries.length} active deliveries
                {autoRefresh && <span className="text-green-400 ml-2">• Live tracking enabled</span>}
              </p>
            </div>

            <div className="flex items-center gap-4">
              {/* Last Updated */}
              <div className="text-sm text-gray-500">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </div>

              {/* Refresh Button */}
              <button
                onClick={handleRefresh}
                className="p-2 bg-gray-800/50 hover:bg-gray-700/50 rounded-lg transition-all"
                title="Refresh"
              >
                <RefreshIcon className="w-5 h-5 text-gray-400" />
              </button>

              {/* Auto Refresh Toggle */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400">Auto-refresh</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoRefresh}
                    onChange={(e) => setAutoRefresh(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Controls Bar */}
        <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-4 border border-red-500/20 mb-6">
          <div className="flex items-center justify-between">
            {/* Filter Buttons */}
            <div className="flex items-center gap-2">
              <FilterIcon className="w-5 h-5 text-gray-400 mr-2" />
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg transition-all ${
                  filter === 'all' 
                    ? 'bg-red-600 text-white' 
                    : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50'
                }`}
              >
                All ({activeDeliveries.length})
              </button>
              <button
                onClick={() => setFilter('routine')}
                className={`px-4 py-2 rounded-lg transition-all ${
                  filter === 'routine' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50'
                }`}
              >
                Routine ({activeDeliveries.filter(d => d.package?.urgency === 'routine').length})
              </button>
              <button
                onClick={() => setFilter('urgent')}
                className={`px-4 py-2 rounded-lg transition-all ${
                  filter === 'urgent' 
                    ? 'bg-orange-600 text-white' 
                    : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50'
                }`}
              >
                Urgent ({activeDeliveries.filter(d => d.package?.urgency === 'urgent').length})
              </button>
              <button
                onClick={() => setFilter('emergency')}
                className={`px-4 py-2 rounded-lg transition-all ${
                  filter === 'emergency' 
                    ? 'bg-red-600 text-white' 
                    : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50'
                }`}
              >
                Emergency ({activeDeliveries.filter(d => d.package?.urgency === 'emergency').length})
              </button>
            </div>

            {/* View Mode Toggles */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === 'grid' 
                    ? 'bg-red-600 text-white' 
                    : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50'
                }`}
                title="Grid View"
              >
                <GridIcon className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === 'list' 
                    ? 'bg-red-600 text-white' 
                    : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50'
                }`}
                title="List View"
              >
                <ListIcon className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === 'map' 
                    ? 'bg-red-600 text-white' 
                    : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50'
                }`}
                title="Map View"
              >
                <MapIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        {viewMode === 'map' ? (
          <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-red-500/20">
            <div className="h-[600px] relative">
              <div className="absolute top-4 left-4 z-10 bg-gray-900/90 backdrop-blur rounded-xl p-4 max-w-sm">
                <h3 className="text-white font-semibold mb-2">Active Drones</h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {filteredDeliveries.map((delivery) => (
                    <div 
                      key={delivery._id}
                      className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all ${
                        selectedDelivery?._id === delivery._id 
                          ? 'bg-red-600/20 border border-red-500/30' 
                          : 'hover:bg-gray-800/50'
                      }`}
                      onClick={() => setSelectedDelivery(delivery)}
                    >
                      <DroneIcon className="w-4 h-4 text-red-400" />
                      <span className="text-white text-sm">{delivery.orderId}</span>
                      <span className={`ml-auto px-2 py-1 rounded text-xs ${statusColors[delivery.status]} text-white`}>
                        {delivery.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Map Placeholder */}
              <div className="h-full bg-gray-800 rounded-xl flex items-center justify-center">
                <div className="text-center">
                  <MapIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-500">Live map tracking coming soon</p>
                  <p className="text-gray-600 text-sm mt-2">
                    {filteredDeliveries.length} drones currently active
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : viewMode === 'list' ? (
          <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-red-500/20">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b border-gray-800">
                    <th className="pb-3 text-sm font-medium text-gray-400">Order ID</th>
                    <th className="pb-3 text-sm font-medium text-gray-400">Type</th>
                    <th className="pb-3 text-sm font-medium text-gray-400">Urgency</th>
                    <th className="pb-3 text-sm font-medium text-gray-400">Status</th>
                    <th className="pb-3 text-sm font-medium text-gray-400">Destination</th>
                    <th className="pb-3 text-sm font-medium text-gray-400">ETA</th>
                    <th className="pb-3 text-sm font-medium text-gray-400">Battery</th>
                    <th className="pb-3 text-sm font-medium text-gray-400">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {filteredDeliveries.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="py-8 text-center text-gray-500">
                        No active deliveries found
                      </td>
                    </tr>
                  ) : (
                    filteredDeliveries.map((delivery) => (
                      <DeliveryListRow 
                        key={delivery._id} 
                        delivery={delivery}
                        onTrack={() => router.push(`/dashboard/track/${delivery._id}`)}
                      />
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          // Grid View (default)
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredDeliveries.length === 0 ? (
              <div className="col-span-full bg-gray-900/50 backdrop-blur-xl rounded-2xl p-12 border border-red-500/20 text-center">
                <DroneIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No active deliveries found</p>
                <p className="text-gray-600 text-sm mt-2">
                  {filter !== 'all' && 'Try changing the filter or '}
                  Create a new delivery to see it here
                </p>
              </div>
            ) : (
              filteredDeliveries.map((delivery, index) => (
                <DeliveryTrackingCard 
                  key={delivery._id} 
                  delivery={delivery}
                  delay={index * 50}
                  onTrack={() => router.push(`/dashboard/track/${delivery._id}`)}
                />
              ))
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

// Delivery Tracking Card Component
function DeliveryTrackingCard({ delivery, delay, onTrack }) {
  const urgencyColors = {
    routine: 'from-blue-600 to-cyan-600',
    urgent: 'from-orange-600 to-amber-600',
    emergency: 'from-red-600 to-rose-600'
  };

  const statusColors = {
    pending_approval: 'bg-yellow-500',
    approved: 'bg-blue-500',
    assigned: 'bg-purple-500',
    pickup: 'bg-lime-300',
    in_transit: 'bg-lime-500',
    pending_confirmation: 'bg-teal-500',
    delivered: 'bg-green-500',
    failed: 'bg-red-500',
    cancelled: 'bg-rose-500'
  };

  const urgencyGradient = urgencyColors[delivery.package?.urgency] || urgencyColors.routine;
  const statusColor = statusColors[delivery.status] || 'bg-gray-500';

  return (
    <div 
      className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-red-500/20 hover:border-red-500/30 transition-all animate-fade-in-up group"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-semibold text-white group-hover:text-red-300 transition-colors">
            {delivery.orderId}
          </h3>
          <p className="text-gray-400 text-sm mt-1">{delivery.package?.type || 'Package'}</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${urgencyGradient} text-white`}>
            {delivery.package?.urgency || 'routine'}
          </span>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${statusColor} animate-pulse`}></div>
            <span className="text-gray-400 text-sm capitalize">{delivery.status.replace('_', ' ')}</span>
          </div>
        </div>
      </div>

      {/* Delivery Info */}
      <div className="space-y-3 mb-4">
        <div className="flex items-center gap-2">
          <LocationIcon className="w-4 h-4 text-gray-400" />
          <div className="flex-1">
            <p className="text-gray-500 text-xs">Destination</p>
            <p className="text-gray-300 text-sm truncate">
              {delivery.displayLocation || delivery.recipient?.name || 'Unknown'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <TimeIcon className="w-4 h-4 text-gray-400" />
          <div className="flex-1">
            <p className="text-gray-500 text-xs">ETA</p>
            <p className="text-gray-300 text-sm">
              {delivery.delivery?.scheduledTime ? 
                new Date(delivery.delivery.scheduledTime).toLocaleTimeString() : 
                'Calculating...'}
            </p>
          </div>
        </div>

        {/* Drone Status */}
        {delivery.droneId && (
          <div className="flex items-center gap-2">
            <DroneIcon className="w-4 h-4 text-gray-400" />
            <div className="flex-1">
              <p className="text-gray-500 text-xs">Drone</p>
              <p className="text-gray-300 text-sm">{delivery.droneId.registrationId}</p>
            </div>
          </div>
        )}

        {/* Battery Level */}
        {delivery.tracking?.battery !== undefined && (
          <div className="flex items-center gap-2">
            <BatteryIcon className="w-4 h-4 text-gray-400" />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-gray-700 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all ${
                      delivery.tracking.battery > 50 ? 'bg-green-500' : 
                      delivery.tracking.battery > 20 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${delivery.tracking.battery}%` }}
                  />
                </div>
                <span className="text-xs text-gray-400">{delivery.tracking.battery}%</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>Progress</span>
          <span>{getProgressPercentage(delivery.status)}%</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-1.5">
          <div 
            className="bg-gradient-to-r from-red-600 to-rose-600 h-1.5 rounded-full transition-all"
            style={{ width: `${getProgressPercentage(delivery.status)}%` }}
          />
        </div>
      </div>

      {/* Action Button */}
      <button
        onClick={onTrack}
        className="w-full py-3 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-xl transition-all font-medium group flex items-center justify-center gap-2"
      >
        <span>Track Delivery</span>
        <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}

// Delivery List Row Component
function DeliveryListRow({ delivery, onTrack }) {
  const statusColors = {
    pending_approval: 'text-yellow-400 bg-yellow-500/20',
    approved: 'text-blue-400 bg-blue-500/20',
    assigned: 'text-purple-400 bg-purple-500/20',
    pickup: 'text-lime-300 bg-lime-400/20',
    in_transit: 'text-lime-400 bg-lime-500/20',
    pending_confirmation: 'text-teal-400 bg-teal-500/20',
    delivered: 'text-green-400 bg-green-500/20',
    failed: 'text-red-400 bg-red-500/20',
    cancelled: 'text-rose-400 bg-rose-500/20'
  };

  const urgencyColors = {
    routine: 'text-blue-400 bg-blue-500/20',
    urgent: 'text-orange-400 bg-orange-500/20',
    emergency: 'text-red-400 bg-red-500/20'
  };

  const statusStyle = statusColors[delivery.status] || 'text-gray-400 bg-gray-500/20';
  const urgencyStyle = urgencyColors[delivery.package?.urgency] || urgencyColors.routine;

  return (
    <tr className="hover:bg-gray-800/50 transition-colors">
      <td className="py-3">
        <span className="text-white font-medium">{delivery.orderId}</span>
      </td>
      <td className="py-3">
        <span className="text-gray-300 capitalize">{delivery.package?.type}</span>
      </td>
      <td className="py-3">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${urgencyStyle}`}>
          {delivery.package?.urgency}
        </span>
      </td>
      <td className="py-3">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyle}`}>
          {delivery.status.replace('_', ' ')}
        </span>
      </td>
      <td className="py-3">
        <span className="text-gray-300 text-sm">
          {delivery.displayLocation || delivery.recipient?.name || 'Unknown'}
        </span>
      </td>
      <td className="py-3">
        <span className="text-gray-300 text-sm">
          {delivery.delivery?.scheduledTime ? 
            new Date(delivery.delivery.scheduledTime).toLocaleTimeString() : 
            'N/A'}
        </span>
      </td>
      <td className="py-3">
        {delivery.tracking?.battery !== undefined ? (
          <div className="flex items-center gap-2">
            <div className="w-16 bg-gray-700 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${
                  delivery.tracking.battery > 50 ? 'bg-green-500' : 
                  delivery.tracking.battery > 20 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${delivery.tracking.battery}%` }}
              />
            </div>
            <span className="text-xs text-gray-400">{delivery.tracking.battery}%</span>
          </div>
        ) : (
          <span className="text-gray-500 text-sm">N/A</span>
        )}
      </td>
      <td className="py-3">
        <button
          onClick={onTrack}
          className="text-red-400 hover:text-red-300 text-sm font-medium"
        >
          Track
        </button>
      </td>
    </tr>
  );
}

// Helper function to calculate progress
function getProgressPercentage(status) {
  const statusProgress = {
    pending: 0,
    pending_approval: 10,
    approved: 20,
    assigned: 30,
    pickup: 50,
    in_transit: 70,
    pending_confirmation: 90,
    delivered: 100,
    failed: 0,
    cancelled: 0
  };
  return statusProgress[status] || 0;
}

export default function TrackAllPage() {
  return (
    <RoleGuard allowedRoles={['medical_staff', 'admin']}>
      <TrackAllContent />
    </RoleGuard>
  );
}
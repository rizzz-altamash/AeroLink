// app/dashboard/admin/pending-assignments/page.jsx
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

// Loading Spinner Component
const LoadingSpinner = () => (
  <div className="flex flex-col items-center justify-center py-12">
    <div className="relative">
      <div className="w-16 h-16 border-4 border-purple-500/20 rounded-full"></div>
      <div className="w-16 h-16 border-4 border-purple-500 rounded-full animate-spin absolute top-0 left-0 border-t-transparent"></div>
    </div>
    <p className="text-gray-400 mt-4 animate-pulse">Loading deliveries...</p>
  </div>
);

export default function PendingAssignmentsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [needingAssignment, setNeedingAssignment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [availablePilots, setAvailablePilots] = useState([]);
  const [selectedPilot, setSelectedPilot] = useState('');
  const [filters, setFilters] = useState({
    urgency: 'all',
    hospital: 'all'
  });
  const [hospitals, setHospitals] = useState([]);

  useEffect(() => {
    fetchData();
  }, [filters]);

  const fetchData = async () => {
    await Promise.all([
      fetchNeedingAssignment(),
      fetchHospitals()
    ]);
  };

  const fetchNeedingAssignment = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams(filters);
      const res = await fetch(`/api/admin/deliveries-needing-assignment?${params}`);
      const data = await res.json();
      setNeedingAssignment(data.deliveries || []);
    } catch (error) {
      console.error('Failed to fetch deliveries:', error);
      toast.error('Failed to load deliveries');
    } finally {
      setLoading(false);
    }
  };

  const fetchHospitals = async () => {
    try {
      const res = await fetch('/api/admin/hospitals/list');
      if (res.ok) {
        const data = await res.json();
        setHospitals(data);
      }
    } catch (error) {
      console.error('Failed to fetch hospitals:', error);
    }
  };

  const fetchAvailableResources = async (deliveryId) => {
    try {
      const res = await fetch(`/api/admin/deliveries/${deliveryId}/assign-pilot`);
      const data = await res.json();
      setAvailablePilots(data.pilots || []);
    } catch (error) {
      console.error('Failed to fetch available resources:', error);
    }
  };

  const openAssignmentModal = async (delivery) => {
    setSelectedDelivery(delivery);
    setShowAssignmentModal(true);
    await fetchAvailableResources(delivery._id);
  };

  const assignPilot = async (deliveryId, pilotId) => {
    try {
      const res = await fetch(`/api/admin/deliveries/${deliveryId}/assign-pilot`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pilotId })
      });
      
      if (res.ok) {
        toast.success('Pilot assigned successfully');
        fetchNeedingAssignment();
        setShowAssignmentModal(false);
        setSelectedDelivery(null);
        setSelectedPilot('');
      } else {
        const error = await res.json();
        toast.error(error.error || 'Failed to assign pilot');
      }
    } catch (error) {
      toast.error('Failed to assign pilot');
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const urgencyStats = {
    total: needingAssignment.length,
    emergency: needingAssignment.filter(d => d.package?.urgency === 'emergency').length,
    urgent: needingAssignment.filter(d => d.package?.urgency === 'urgent').length,
    routine: needingAssignment.filter(d => d.package?.urgency === 'routine').length
  };

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Background Pattern and Gradient - Purple Theme for Admin */}
      <div className="fixed inset-0 bg-gray-950">
        {/* Grid Pattern */}
        <div 
          className="absolute inset-0 bg-[size:4rem_4rem] opacity-20"
          style={{
            backgroundImage: `linear-gradient(to right, #a855f715 1px, transparent 1px), linear-gradient(to bottom, #a855f715 1px, transparent 1px)`
          }}
        ></div>
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-950/50 via-gray-950 to-indigo-950/50"></div>
        
        {/* Animated Background Elements */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl animate-pulse-slow animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse-slow animation-delay-4000"></div>
      </div>

      <div className="relative z-10 p-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center gap-4 mb-2">
            <button
              onClick={() => router.back()}
              className="text-gray-400 hover:text-white transition-all hover:scale-110 group"
            >
              <BackIcon className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
            </button>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
              Deliveries Awaiting Pilot Assignment
            </h1>
          </div>
          <p className="text-gray-400 ml-10">Assign pilots to approved deliveries</p>
        </div>

        {/* Alert if there are emergency deliveries */}
        {urgencyStats.emergency > 0 && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6 flex items-center gap-3 animate-fade-in-up">
            <EmergencyIcon className="w-6 h-6 text-red-500 animate-pulse" />
            <div>
              <p className="text-white font-semibold">{urgencyStats.emergency} Emergency {urgencyStats.emergency === 1 ? 'Delivery' : 'Deliveries'} Pending!</p>
              <p className="text-gray-400 text-sm">Immediate pilot assignment required</p>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <StatCard
            title="Total Pending"
            value={urgencyStats.total}
            icon={TotalIcon}
            gradient="from-purple-600 to-indigo-600"
            delay="0"
          />
          <StatCard
            title="Emergency"
            value={urgencyStats.emergency}
            icon={EmergencyIcon}
            gradient="from-red-600 to-rose-600"
            delay="100"
            pulse={urgencyStats.emergency > 0}
          />
          <StatCard
            title="Urgent"
            value={urgencyStats.urgent}
            icon={UrgentIcon}
            gradient="from-orange-600 to-amber-600"
            delay="200"
          />
          <StatCard
            title="Routine"
            value={urgencyStats.routine}
            icon={RoutineIcon}
            gradient="from-green-600 to-emerald-600"
            delay="300"
          />
        </div>

        {/* Filters */}
        <div className="bg-gray-900/60 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/20 hover:border-purple-500/30 transition-all mb-6 animate-fade-in-up">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <FilterIcon className="w-5 h-5 text-purple-400" />
            Filter Deliveries
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="group">
              <label className="text-sm text-gray-400 block mb-2 group-hover:text-purple-400 transition-colors">
                Urgency Level
              </label>
              <select
                value={filters.urgency}
                onChange={(e) => handleFilterChange('urgency', e.target.value)}
                className="w-full bg-gray-800/70 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all hover:bg-gray-800"
              >
                <option value="all">All Levels</option>
                <option value="emergency">Emergency Only</option>
                <option value="urgent">Urgent Only</option>
                <option value="routine">Routine Only</option>
              </select>
            </div>

            <div className="group">
              <label className="text-sm text-gray-400 block mb-2 group-hover:text-purple-400 transition-colors">
                Hospital
              </label>
              <select
                value={filters.hospital}
                onChange={(e) => handleFilterChange('hospital', e.target.value)}
                className="w-full bg-gray-800/70 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all hover:bg-gray-800"
              >
                <option value="all">All Hospitals</option>
                {hospitals.map(hospital => (
                  <option key={hospital._id} value={hospital._id}>{hospital.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Deliveries Table */}
        <div className="bg-gray-900/60 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/20 hover:border-purple-500/30 transition-all animate-fade-in-up animation-delay-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Pending Assignments</h2>
            {!loading && needingAssignment.length > 0 && (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-gray-400">Action Required</span>
              </div>
            )}
          </div>

          {loading ? (
            <LoadingSpinner />
          ) : needingAssignment.length === 0 ? (
            <div className="text-center py-12">
              <CheckIcon className="w-16 h-16 text-gray-600 mx-auto mb-4 opacity-50" />
              <p className="text-gray-500 text-lg">All deliveries have been assigned!</p>
              <p className="text-gray-600 text-sm mt-1">Great job keeping up with assignments</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b border-gray-800">
                    <th className="pb-3 text-sm font-medium text-gray-400">Order ID</th>
                    <th className="pb-3 text-sm font-medium text-gray-400">Type</th>
                    <th className="pb-3 text-sm font-medium text-gray-400">Urgency</th>
                    <th className="pb-3 text-sm font-medium text-gray-400">Hospital</th>
                    <th className="pb-3 text-sm font-medium text-gray-400">Approved By</th>
                    <th className="pb-3 text-sm font-medium text-gray-400">Time Since Approval</th>
                    <th className="pb-3 text-sm font-medium text-gray-400">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {needingAssignment.map((delivery, index) => (
                    <AssignmentRow
                      key={delivery._id}
                      delivery={delivery}
                      onAssign={() => openAssignmentModal(delivery)}
                      delay={index * 50}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Assignment Modal */}
        {showAssignmentModal && selectedDelivery && (
          <AssignmentModal
            delivery={selectedDelivery}
            pilots={availablePilots}
            selectedPilot={selectedPilot}
            setSelectedPilot={setSelectedPilot}
            onAssign={() => assignPilot(selectedDelivery._id, selectedPilot)}
            onClose={() => {
              setShowAssignmentModal(false);
              setSelectedDelivery(null);
              setSelectedPilot('');
            }}
          />
        )}
      </div>

      {/* Animation Styles */}
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
  );
}

// Stat Card Component
function StatCard({ title, value, icon: Icon, gradient, delay, pulse = false }) {
  return (
    <div 
      className="bg-gray-900/60 backdrop-blur-xl rounded-xl p-4 border border-purple-500/20 hover:border-purple-500/30 transition-all hover:scale-105 animate-fade-in-up group"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm">{title}</p>
          <p className={`text-2xl font-bold text-white mt-1 ${pulse ? 'animate-pulse' : ''}`}>{value}</p>
        </div>
        <div className={`w-12 h-12 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
}

// Assignment Row Component
function AssignmentRow({ delivery, onAssign, delay }) {
  const urgencyColors = {
    routine: 'text-gray-400 bg-gray-500/20 border-gray-500/30',
    urgent: 'text-orange-400 bg-orange-500/20 border-orange-500/30',
    emergency: 'text-red-400 bg-red-500/20 border-red-500/30 animate-pulse'
  };

  const urgencyClass = urgencyColors[delivery.package?.urgency] || urgencyColors.routine;

  return (
    <tr 
      className="hover:bg-gray-800/50 transition-all hover:shadow-lg animate-fade-in group"
      style={{ animationDelay: `${delay}ms` }}
    >
      <td className="py-4">
        <span className="text-white font-medium">{delivery.orderId}</span>
      </td>
      <td className="py-4">
        <span className="text-gray-300">{delivery.package?.type}</span>
      </td>
      <td className="py-4">
        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${urgencyClass} backdrop-blur-sm`}>
          {delivery.package?.urgency}
        </span>
      </td>
      <td className="py-4">
        <span className="text-gray-300">{delivery.sender?.hospitalId?.name || 'Unknown'}</span>
      </td>
      <td className="py-4">
        <div className="flex items-center gap-2">
          <span className="text-gray-300">{delivery.approverName}</span>
          {delivery.isAutoApproved && (
            <span className="text-yellow-400 text-xs bg-yellow-500/20 px-2 py-0.5 rounded-full">(Auto)</span>
          )}
        </div>
      </td>
      <td className="py-4">
        <span className="text-gray-400 text-sm">{delivery.timeSinceApproval}</span>
      </td>
      <td className="py-4">
        <button
          onClick={onAssign}
          className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-lg text-sm font-medium transition-all hover:scale-105 shadow-lg hover:shadow-purple-500/25"
        >
          Assign Pilot
        </button>
      </td>
    </tr>
  );
}

// Assignment Modal Component
function AssignmentModal({ 
  delivery, 
  pilots, 
  selectedPilot, 
  setSelectedPilot,
  onAssign, 
  onClose 
}) {
  const canAssign = selectedPilot;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 rounded-2xl p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-purple-500/20 animate-scale-in">
        <h2 className="text-2xl font-bold text-white mb-4">Assign Pilot to Delivery</h2>
        
        {/* Delivery Details */}
        <div className="bg-gray-800/50 backdrop-blur rounded-xl p-4 mb-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-3">Delivery Details</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-400 text-sm">Order ID</p>
              <p className="text-white font-semibold">{delivery.orderId}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Urgency</p>
              <p className={`font-semibold ${
                delivery.package?.urgency === 'emergency' ? 'text-red-400 animate-pulse' :
                delivery.package?.urgency === 'urgent' ? 'text-orange-400' :
                'text-gray-300'
              }`}>
                {delivery.package?.urgency?.toUpperCase()}
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Package Type</p>
              <p className="text-white">{delivery.package?.type}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Weight</p>
              <p className="text-white">{delivery.package?.weight}g</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">From</p>
              <p className="text-white">{delivery.sender?.hospitalId?.name || 'Unknown'}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">To</p>
              <p className="text-white">{delivery.recipient?.hospitalId?.name || delivery.recipient?.name || 'Unknown'}</p>
            </div>
          </div>
        </div>

        {/* Pilot Selection */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-white mb-3">Select Pilot</h3>
          {pilots.length === 0 ? (
            <p className="text-gray-500">No pilots available</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {pilots.map((pilot) => (
                <div
                  key={pilot._id}
                  onClick={() => setSelectedPilot(pilot._id)}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    selectedPilot === pilot._id
                      ? 'border-purple-500 bg-purple-500/10'
                      : 'border-gray-700 hover:border-gray-600 hover:bg-gray-800/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">{pilot.name}</p>
                      <p className="text-gray-400 text-sm">{pilot.email}</p>
                      <p className="text-gray-500 text-xs mt-1">
                        Current assignments: {pilot.currentAssignments}
                      </p>
                    </div>
                    {selectedPilot === pilot._id && (
                      <CheckIcon className="w-5 h-5 text-purple-400" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onAssign}
            disabled={!canAssign}
            className={`flex-1 py-3 rounded-lg font-semibold transition-all ${
              canAssign
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-purple-500/25'
                : 'bg-gray-700 text-gray-400 cursor-not-allowed'
            }`}
          >
            Assign Pilot
          </button>
          <button
            onClick={onClose}
            className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold transition-all"
          >
            Cancel
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes scale-in {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-scale-in { animation: scale-in 0.3s ease-out; }
      `}</style>
    </div>
  );
}

// Icon Components
const BackIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
  </svg>
);

const TotalIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
  </svg>
);

const EmergencyIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);

const UrgentIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

const RoutineIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const FilterIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
  </svg>
);

const CheckIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);
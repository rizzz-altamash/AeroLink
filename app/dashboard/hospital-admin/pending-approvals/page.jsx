// app/dashboard/hospital-admin/pending-approvals/page.jsx
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

const AlertIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);

const CheckIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ClockIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const FilterIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
  </svg>
);

export default function PendingApprovalsPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [pendingDeliveries, setPendingDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [filter, setFilter] = useState('all'); // all, emergency, urgent, routine
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    fetchPendingApprovals();
    
    // Auto-refresh every 30 seconds
    let interval;
    if (autoRefresh) {
      interval = setInterval(fetchPendingApprovals, 30000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh]);

  const fetchPendingApprovals = async () => {
    try {
      const res = await fetch('/api/hospital-admin/pending-approvals');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setPendingDeliveries(data.all || []);
    } catch (error) {
      console.error('Failed to fetch pending approvals:', error);
      toast.error('Failed to load pending approvals');
    } finally {
      setLoading(false);
    }
  };

  const handleApproval = async (deliveryId, approved, reason = '') => {
    try {
      const res = await fetch(`/api/hospital-admin/deliveries/${deliveryId}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ approved, reason })
      });
      
      if (res.ok) {
        toast.success(approved ? 'Delivery approved successfully' : 'Delivery rejected');
        fetchPendingApprovals();
        setShowApprovalModal(false);
        setSelectedDelivery(null);
        setRejectionReason('');
      } else {
        const error = await res.json();
        toast.error(error.error || 'Failed to process approval');
      }
    } catch (error) {
      toast.error('Failed to process approval');
    }
  };

  const openApprovalModal = (delivery) => {
    setSelectedDelivery(delivery);
    setShowApprovalModal(true);
  };

  const handleBulkApprove = async (urgencyType) => {
    if (!confirm(`Are you sure you want to approve all ${urgencyType} deliveries?`)) return;
    
    const deliveriesToApprove = pendingDeliveries.filter(d => d.package?.urgency === urgencyType);
    
    for (const delivery of deliveriesToApprove) {
      await handleApproval(delivery._id, true);
    }
  };

  const filteredDeliveries = filter === 'all' 
    ? pendingDeliveries 
    : pendingDeliveries.filter(d => d.package?.urgency === filter);

  const urgencyColors = {
    routine: 'border-gray-500 bg-gray-500/10',
    urgent: 'border-orange-500 bg-orange-500/10',
    emergency: 'border-red-500 bg-red-500/10'
  };

  const urgencyTextColors = {
    routine: 'text-gray-400',
    urgent: 'text-orange-400',
    emergency: 'text-red-400'
  };

  // Helper function to calculate time remaining
  function getTimeRemaining(deadline) {
    const now = new Date();
    const deadlineTime = new Date(deadline);
    const remaining = deadlineTime - now;
    
    if (remaining <= 0) return 'Expired';
    
    const hours = Math.floor(remaining / (1000 * 60 * 60));
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  }

  return (
    <RoleGuard allowedRoles={['hospital_admin']}>
      <DashboardLayout>
        <div className="min-h-screen p-8">
          {/* Background elements */}
          <div className="fixed inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-yellow-500/5 rounded-full blur-3xl animate-pulse-slow"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-orange-500/5 rounded-full blur-3xl animate-pulse-slow animation-delay-2000"></div>
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
                <h1 className="text-3xl font-bold text-white mb-2">Pending Approvals</h1>
                <p className="text-gray-400">Review and approve delivery requests from medical staff</p>
              </div>

              <div className="flex items-center gap-4">
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
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-600"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl p-4 border border-yellow-500/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                  <AlertIcon className="w-6 h-6 text-yellow-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{pendingDeliveries.length}</p>
                  <p className="text-sm text-gray-400">Total Pending</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl p-4 border border-red-500/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
                  <AlertIcon className="w-6 h-6 text-red-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">
                    {pendingDeliveries.filter(d => d.package?.urgency === 'emergency').length}
                  </p>
                  <p className="text-sm text-gray-400">Emergency</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl p-4 border border-orange-500/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
                  <ClockIcon className="w-6 h-6 text-orange-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">
                    {pendingDeliveries.filter(d => d.package?.urgency === 'urgent').length}
                  </p>
                  <p className="text-sm text-gray-400">Urgent</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl p-4 border border-gray-500/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                  <CheckIcon className="w-6 h-6 text-cyan-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">
                    {pendingDeliveries.filter(d => d.package?.urgency === 'routine').length}
                  </p>
                  <p className="text-sm text-gray-400">Routine</p>
                </div>
              </div>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-4 border border-yellow-500/20 mb-6">
            <div className="flex items-center gap-2">
              <FilterIcon className="w-5 h-5 text-gray-400 mr-2" />
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg transition-all ${
                  filter === 'all' 
                    ? 'bg-yellow-600 text-white' 
                    : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50'
                }`}
              >
                All ({pendingDeliveries.length})
              </button>
              <button
                onClick={() => setFilter('emergency')}
                className={`px-4 py-2 rounded-lg transition-all ${
                  filter === 'emergency' 
                    ? 'bg-red-600 text-white' 
                    : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50'
                }`}
              >
                Emergency ({pendingDeliveries.filter(d => d.package?.urgency === 'emergency').length})
              </button>
              <button
                onClick={() => setFilter('urgent')}
                className={`px-4 py-2 rounded-lg transition-all ${
                  filter === 'urgent' 
                    ? 'bg-orange-600 text-white' 
                    : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50'
                }`}
              >
                Urgent ({pendingDeliveries.filter(d => d.package?.urgency === 'urgent').length})
              </button>
              <button
                onClick={() => setFilter('routine')}
                className={`px-4 py-2 rounded-lg transition-all ${
                  filter === 'routine' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50'
                }`}
              >
                Routine ({pendingDeliveries.filter(d => d.package?.urgency === 'routine').length})
              </button>

              {filter !== 'all' && filteredDeliveries.length > 1 && (
                <button
                  onClick={() => handleBulkApprove(filter)}
                  className="ml-auto px-4 py-2 bg-green-600/20 hover:bg-green-600/30 text-green-400 rounded-lg transition-all"
                >
                  Approve All {filter}
                </button>
              )}
            </div>
          </div>

          {/* Pending Approvals Grid */}
          <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-yellow-500/20">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <svg className="animate-spin h-8 w-8 text-yellow-500" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            ) : filteredDeliveries.length === 0 ? (
              <div className="text-center py-12">
                <CheckIcon className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-500">No pending approvals</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredDeliveries.map((delivery) => (
                  <PendingApprovalCard
                    key={delivery._id}
                    delivery={delivery}
                    onReview={() => openApprovalModal(delivery)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Approval Modal */}
          {showApprovalModal && selectedDelivery && (
            <ApprovalModal
              delivery={selectedDelivery}
              onApprove={() => handleApproval(selectedDelivery._id, true)}
              onReject={() => handleApproval(selectedDelivery._id, false, rejectionReason)}
              onClose={() => {
                setShowApprovalModal(false);
                setSelectedDelivery(null);
                setRejectionReason('');
              }}
              rejectionReason={rejectionReason}
              setRejectionReason={setRejectionReason}
            />
          )}
        </div>
      </DashboardLayout>
    </RoleGuard>
  );
}

// Pending Approval Card Component
function PendingApprovalCard({ delivery, onReview }) {
  const urgencyColors = {
    routine: 'border-gray-500 bg-gray-500/10',
    urgent: 'border-orange-500 bg-orange-500/10',
    emergency: 'border-red-500 bg-red-500/10'
  };

  const urgencyTextColors = {
    routine: 'text-gray-400',
    urgent: 'text-orange-400',
    emergency: 'text-red-400'
  };

  const isIncoming = delivery.metadata?.deliveryType === 'incoming' || delivery.isIncoming;

  return (
    <div className={`border rounded-xl p-4 ${urgencyColors[delivery.package?.urgency || 'routine']} hover:scale-[1.02] transition-all flex flex-col h-full`}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-white font-semibold">{delivery.orderId}</h3>
            <span className={`text-xs px-2 py-0.5 rounded-full ${
              isIncoming 
                ? 'bg-blue-500/20 text-blue-400' 
                : 'bg-orange-500/20 text-orange-400'
            }`}>
              {isIncoming ? 'Incoming' : 'Outgoing'}
            </span>
          </div>
          <p className="text-gray-400 text-sm">{delivery.package?.type}</p>
        </div>
        <span className={`text-sm font-medium ${urgencyTextColors[delivery.package?.urgency || 'routine']}`}>
          {delivery.package?.urgency?.toUpperCase()}
        </span>
      </div>
      
      <div className="space-y-2 mb-4 flex-1">
        <div className="text-sm">
          <span className="text-gray-400">Requested by:</span>
          <span className="text-gray-300 ml-2">
            {isIncoming
              ? delivery.metadata?.orderedBy?.name || delivery.sender?.userId?.name || 'Hospital Staff'
              : delivery.sender?.userId?.name || 'Unknown'}
          </span>
        </div>
        <div className="text-sm">
          <span className="text-gray-400">Weight:</span>
          <span className="text-gray-300 ml-2">{delivery.package?.weight}g</span>
        </div>
        <div className="text-sm">
          <span className="text-gray-400">Created:</span>
          <span className="text-gray-300 ml-2">{new Date(delivery.createdAt).toLocaleString()}</span>
        </div>
      </div>
      
      <button
        onClick={onReview}
        className="w-full py-2 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 rounded-lg transition-all font-medium mt-auto"
      >
        Review & Approve
      </button>
    </div>
  );
}

// Approval Modal Component (reuse from HospitalAdminDashboard)
function ApprovalModal({ delivery, onApprove, onReject, onClose, rejectionReason, setRejectionReason }) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 rounded-2xl p-6 max-w-2xl w-full">
        <h2 className="text-2xl font-bold text-white mb-4">Review Delivery Request</h2>
        
        <div className="space-y-4 mb-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-400 text-sm">Order ID</p>
              <p className="text-white font-semibold">{delivery.orderId}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Delivery Type</p>
              <p className={`font-semibold ${
                delivery.metadata?.deliveryType === 'incoming' ? 'text-blue-400' : 'text-orange-400'
              }`}>
                {delivery.metadata?.deliveryType === 'incoming' ? 'Incoming Order' : 'Outgoing Delivery'}
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Urgency</p>
              <p className={`font-semibold ${
                delivery.package?.urgency === 'emergency' ? 'text-red-400' :
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
              <p className="text-gray-400 text-sm">Requested By</p>
              <p className="text-white">{delivery.sender?.userId?.name || 'Unknown'}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Destination</p>
              <p className="text-white">{delivery.recipient?.name || 'Unknown'}</p>
            </div>
          </div>
          
          {delivery.package?.description && (
            <div>
              <p className="text-gray-400 text-sm mb-1">Description</p>
              <p className="text-white">{delivery.package.description}</p>
            </div>
          )}
          
          {delivery.metadata?.specialInstructions && (
            <div>
              <p className="text-gray-400 text-sm mb-1">Special Instructions</p>
              <p className="text-white">{delivery.metadata.specialInstructions}</p>
            </div>
          )}
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="text-gray-400 text-sm block mb-2">Rejection Reason (if rejecting)</label>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full bg-gray-800 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:outline-none"
              placeholder="Enter reason for rejection..."
              rows={3}
            />
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={onApprove}
              className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-all"
            >
              Approve Delivery
            </button>
            <button
              onClick={onReject}
              className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-all"
              disabled={!rejectionReason.trim()}
            >
              Reject Delivery
            </button>
            <button
              onClick={onClose}
              className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
// components/dashboard/HospitalAdminDashboard.jsx
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import NotificationBell from '@/components/NotificationBell';
import toast from 'react-hot-toast';

export default function HospitalAdminDashboard() {
  const router = useRouter();
  const { data: session } = useSession();
  const [hospitalStats, setHospitalStats] = useState({
    totalDeliveries: 0,
    activeDeliveries: 0,
    completedToday: 0,
    averageDeliveryTime: 0,
    totalStaff: 0,
    activeStaff: 0,
    pendingRequests: 0,
    monthlyBill: 0
  });

  const [recentDeliveries, setRecentDeliveries] = useState([]);
  const [staffActivity, setStaffActivity] = useState([]);
  const [pendingApprovals, setPendingApprovals] = useState([]);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');

  const [deliveryTypeStats, setDeliveryTypeStats] = useState([]);
  const [loadingDeliveryTypes, setLoadingDeliveryTypes] = useState(true);

  const [viewMode, setViewMode] = useState('chart'); // 'bars' or 'chart'

  const [orderStats, setOrderStats] = useState(null);
  const [loadingOrderStats, setLoadingOrderStats] = useState(true);
  const [showOrderStatus, setShowOrderStatus] = useState(false);

  useEffect(() => {
    fetchHospitalStats();
    fetchRecentDeliveries();
    fetchStaffActivity();
    fetchPendingApprovals();

    fetchDeliveryTypeStats();

    fetchOrderStatistics();

    // Set up auto-refresh for delivery types and order stats
    const interval = setInterval(() => {
      fetchDeliveryTypeStats();
      fetchOrderStatistics();
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const fetchHospitalStats = async () => {
    try {
      const res = await fetch('/api/hospital/stats');
      const data = await res.json();
      setHospitalStats(data);
    } catch (error) {
      console.error('Failed to fetch hospital stats:', error);
    }
  };

  const fetchRecentDeliveries = async () => {
    try {
      const res = await fetch('/api/hospital/deliveries/recent');
      const data = await res.json();
      setRecentDeliveries(data);
    } catch (error) {
      console.error('Failed to fetch deliveries:', error);
    }
  };

  const fetchStaffActivity = async () => {
    try {
      const res = await fetch('/api/hospital/staff/activity');
      const data = await res.json();
      setStaffActivity(data);
    } catch (error) {
      console.error('Failed to fetch staff activity:', error);
    }
  };

  const fetchPendingApprovals = async () => {
    try {
      // console.log('Fetching pending approvals...');
      const res = await fetch('/api/hospital-admin/pending-approvals');
      // console.log('Response status:', res.status);
      
      if (!res.ok) {
        const error = await res.text();
        console.error('API Error:', error);
        return;
      }
      
      const data = await res.json();
      // console.log('Pending approvals data:', data);
      setPendingApprovals(data.all || []);
    } catch (error) {
      console.error('Failed to fetch pending approvals:', error);
    }
  };

  const fetchDeliveryTypeStats = async () => {
    try {
      const res = await fetch('/api/hospital/delivery-types-stats');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setDeliveryTypeStats(data.stats);
    } catch (error) {
      console.error('Failed to fetch delivery type stats:', error);
    } finally {
      setLoadingDeliveryTypes(false);
    }
  };

  // Add this function to fetch order statistics:
  const fetchOrderStatistics = async () => {
    try {
      const res = await fetch('/api/hospital/orders-statistics');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setOrderStats(data);
    } catch (error) {
      console.error('Failed to fetch order statistics:', error);
    } finally {
      setLoadingOrderStats(false);
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
        fetchHospitalStats();
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

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2 flex justify-between">
          Hospital Dashboard 
          <NotificationBell />
        </h1>
        <p className="text-gray-400">Manage deliveries and staff for your hospital</p>
      </div>

      {/* Hospital Info Banner */}
      <div className="bg-gradient-to-r from-red-600/10 to-yellow-600/20 rounded-2xl p-6 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">{session?.user?.hospitalName || 'City General Hospital'}</h2>
            <p className="text-red-100">Registration: #HOS2024001</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-red-100">Subscription Plan</p>
            <p className="text-xl font-bold text-white">Premium</p>
          </div>
        </div>
      </div>

      {/* Pending Approvals Alert */}
      {pendingApprovals.length > 0 && (
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertIcon className="w-6 h-6 text-yellow-500" />
            <div>
              <p className="text-white font-semibold">{pendingApprovals.length} Deliveries Pending Approval</p>
              <p className="text-gray-400 text-sm">Review and approve delivery requests from medical staff</p>
            </div>
          </div>
          <a href="#pending-approvals" className="bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 px-4 py-2 rounded-lg transition-all">
            Review Now
          </a>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Active Deliveries"
          value={hospitalStats.activeDeliveries}
          subtitle="In progress"
          icon={ActiveIcon}
          gradient="from-green-600 to-emerald-600"
          change="+12%"
        />
        <StatCard
          title="Completed Today"
          value={hospitalStats.completedToday}
          subtitle="Deliveries"
          icon={CheckIcon}
          gradient="from-blue-600 to-cyan-600"
          change="+8%"
        />
        <StatCard
          title="Avg. Delivery Time"
          value={`${hospitalStats.averageDeliveryTime} min`}
          subtitle="This month"
          icon={TimeIcon}
          gradient="from-purple-600 to-pink-600"
          change="-5%"
        />
        <StatCard
          title="Active Staff"
          value={`${hospitalStats.activeStaff}/${hospitalStats.totalStaff}`}
          subtitle="On duty"
          icon={UsersIcon}
          gradient="from-orange-600 to-yellow-600"
        />
      </div>

      {/* Pending Approvals Section */}
      <div id="pending-approvals" className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-yellow-500/20 hover:border-yellow-500/30 transition-all mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">Pending Approvals</h2>
          <div className="flex items-center gap-3">
            {pendingApprovals.length > 0 && (
              <span className="bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full text-sm font-medium">
                {pendingApprovals.length} Pending
              </span>
            )}
            <button 
              onClick={() => router.push('/dashboard/hospital-admin/pending-approvals')}
              className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors"
            >
              View All
            </button>
          </div>
        </div>
        
        {pendingApprovals.length === 0 ? (
          <div className="text-center py-8">
            <CheckIcon className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500">No deliveries pending approval</p>
          </div>
        ) : (
          <div className="max-h-130 overflow-y-auto p-2 scrollbar-hide">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pendingApprovals.map((delivery) => (
              <PendingApprovalCard
                key={delivery._id}
                delivery={delivery}
                onReview={() => openApprovalModal(delivery)}
              />
            ))}
          </div>
          </div>
        )}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Recent Deliveries - Takes 2 columns */}
        <div className="lg:col-span-2 bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-red-500/20 hover:border-red-500/30 transition-all">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">Recent Deliveries</h2>
            <button 
            onClick={() => router.push('/dashboard/hospital-admin/deliveries')}
            className="text-red-400 hover:text-red-300 text-sm font-medium">View All</button>
          </div>
          <div className="overflow-x-auto max-h-130 overflow-y-auto p-2 scrollbar-hide">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-gray-800">
                  <th className="pb-3 text-sm font-medium text-gray-400">Order ID</th>
                  <th className="pb-3 text-sm font-medium text-gray-400">Type</th>
                  <th className="pb-3 text-sm font-medium text-gray-400">Recipient</th>
                  <th className="pb-3 text-sm font-medium text-gray-400">Status</th>
                  <th className="pb-3 text-sm font-medium text-gray-400">ETA</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {recentDeliveries.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="py-4 text-center text-gray-500">No recent deliveries</td>
                  </tr>
                ) : (
                  recentDeliveries.map((delivery) => (
                    <DeliveryRow key={delivery._id} delivery={delivery} />
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Staff Activity */}
        <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-red-500/20 hover:border-red-500/30 transition-all">
          {/* <h2 className="text-xl font-semibold text-white mb-4">Staff Activity</h2> */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">Staff Activity</h2>
            <button 
              onClick={() => router.push('/dashboard/hospital-admin/staff-activity')}
              className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors"
            >
              View All
            </button>
          </div>
          <div className="space-y-4 max-h-130 overflow-y-auto p-1 scrollbar-hide">
            {staffActivity.length === 0 ? (
              <p className="text-gray-500">No recent activity</p>
            ) : (
              staffActivity.map((activity, index) => (
                <StaffActivityItem key={index} activity={activity} />
              ))
            )}
          </div>
        </div>
      </div>

      {/* Delivery Types Chart and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Delivery Types Distribution */}
        <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-red-500/20 hover:border-red-500/30 transition-all">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">Delivery Types</h2>
            <div className="flex items-center gap-4">
              {!loadingDeliveryTypes && (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-xs text-gray-400">Live</span>
                </div>
              )}
              <button
                onClick={() => setViewMode(viewMode === 'bars' ? 'chart' : 'bars')}
                className="text-xs text-red-400 hover:text-red-300 transition-colors"
              >
                {viewMode === 'bars' ? 'Show Chart' : 'Show Bars'}
              </button>
            </div>
          </div>
          
          {loadingDeliveryTypes ? (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="animate-pulse">
                  <div className="flex justify-between mb-1">
                    <div className="h-4 bg-gray-700 rounded w-32"></div>
                    <div className="h-4 bg-gray-700 rounded w-12"></div>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2"></div>
                </div>
              ))}
            </div>
          ) : deliveryTypeStats.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No delivery data available</p>
            </div>
          ) : viewMode === 'bars' ? (
            <div className="space-y-4">
              {deliveryTypeStats.map((typeStat, index) => (
                <DeliveryTypeTooltip key={typeStat.type} stat={typeStat}>
                  <div className="cursor-pointer">
                    <DeliveryTypeBar 
                      type={typeStat.label}
                      count={typeStat.count}
                      percentage={typeStat.percentage}
                      color={typeStat.color}
                      delay={index * 100}
                    />
                  </div>
                </DeliveryTypeTooltip>
              ))}
            </div>
          ) : (
            <DeliveryTypeChart stats={deliveryTypeStats} />
          )}
          
          <div className="mt-6 pt-4 border-t border-gray-800">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center justify-evenly">
                <span className="text-gray-400">Total Deliveries</span>
                <span className="text-white font-semibold">
                  {deliveryTypeStats.reduce((sum, stat) => sum + stat.count, 0)}
                </span>
              </div>
              <div className="flex items-center justify-evenly">
                <span className="text-gray-400">Most Common</span>
                <span className="text-white font-semibold">
                  {deliveryTypeStats.length > 0 
                    ? deliveryTypeStats.reduce((max, stat) => stat.count > max.count ? stat : max).label
                    : 'N/A'
                  }
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Orders Report Card - Replaces Quick Actions */}
        <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-red-500/20 hover:border-red-500/30 transition-all">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">Orders Report</h2>
            <div className="flex items-center gap-4">
              {!loadingOrderStats && (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-xs text-gray-400">Live</span>
                </div>
              )}
              <button
                onClick={() => setShowOrderStatus(!showOrderStatus)}
                className="text-xs text-red-400 hover:text-red-300 transition-colors"
              >
                {showOrderStatus ? 'Hide Status' : 'Show Status'}
              </button>
            </div>
          </div>
          
          {loadingOrderStats ? (
            <div className="grid grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-4 bg-gray-700 rounded w-24 mb-2"></div>
                  <div className="h-8 bg-gray-700 rounded w-16"></div>
                </div>
              ))}
            </div>
          ) : orderStats ? (
            <div className="space-y-6">
              {/* Toggle between Direction/Priority and Status views */}
              {!showOrderStatus ? (
                <>
                  {/* Direction Stats */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-400 mb-3">Order Direction</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <OrderStatCard
                        label="Outgoing Orders"
                        value={orderStats.direction.outgoing}
                        icon={OutgoingIcon}
                        color="text-orange-400"
                        bgColor="bg-orange-500/20"
                        total={orderStats.total}
                      />
                      <OrderStatCard
                        label="Incoming Orders"
                        value={orderStats.direction.incoming}
                        icon={IncomingIcon}
                        color="text-blue-400"
                        bgColor="bg-blue-500/20"
                        total={orderStats.total}
                      />
                    </div>
                  </div>

                  {/* Urgency Stats */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-400 mb-3">Order Priority</h3>
                    <div className="grid grid-cols-3 gap-3">
                      <OrderStatCard
                        label="Routine"
                        value={orderStats.urgency.routine}
                        icon={RoutineIcon}
                        color="text-gray-400"
                        bgColor="bg-gray-500/20"
                        small
                        total={orderStats.total}
                      />
                      <OrderStatCard
                        label="Urgent"
                        value={orderStats.urgency.urgent}
                        icon={UrgentIcon}
                        color="text-yellow-400"
                        bgColor="bg-yellow-500/20"
                        small
                        total={orderStats.total}
                      />
                      <OrderStatCard
                        label="Emergency"
                        value={orderStats.urgency.emergency}
                        icon={EmergencyStatIcon}
                        color="text-red-400"
                        bgColor="bg-red-500/20"
                        small
                        total={orderStats.total}
                      />
                    </div>
                  </div>
                </>
              ) : (
                /* Order Status - Shows instead of Direction/Priority */
                <div>
                  <h3 className="text-sm font-medium text-gray-400 mb-3">Order Status</h3>
                  <div className="grid grid-cols-3 gap-3">
                    <OrderStatCard
                      label="Approved"
                      value={orderStats.status.approved}
                      icon={ApprovedIcon}
                      color="text-green-400"
                      bgColor="bg-green-500/20"
                      small
                      total={orderStats.total}
                    />
                    <OrderStatCard
                      label="Rejected"
                      value={orderStats.status.rejected}
                      icon={RejectedIcon}
                      color="text-red-400"
                      bgColor="bg-red-500/20"
                      small
                      total={orderStats.total}
                    />
                    <OrderStatCard
                      label="Delivered"
                      value={orderStats.status.delivered}
                      icon={DeliveredIcon}
                      color="text-emerald-400"
                      bgColor="bg-emerald-500/20"
                      small
                      total={orderStats.total}
                    />
                    <OrderStatCard
                      label="Failed"
                      value={orderStats.status.failed}
                      icon={FailedIcon}
                      color="text-rose-400"
                      bgColor="bg-rose-500/20"
                      small
                      total={orderStats.total}
                    />
                    <OrderStatCard
                      label="In Transit"
                      value={orderStats.status.in_transit}
                      icon={TransitIcon}
                      color="text-purple-400"
                      bgColor="bg-purple-500/20"
                      small
                      total={orderStats.total}
                    />
                    <OrderStatCard
                      label="Cancelled"
                      value={orderStats.status.cancelled}
                      icon={CancelledIcon}
                      color="text-gray-400"
                      bgColor="bg-gray-500/20"
                      small
                      total={orderStats.total}
                    />
                  </div>
                </div>
              )}

              {/* Summary Stats */}
              <div className="pt-4 border-t border-gray-800">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <p className="text-gray-400 text-sm">Total Orders</p>
                    <p className="text-2xl font-bold text-white">{orderStats.total}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-400 text-sm">Success Rate</p>
                    <p className="text-2xl font-bold text-green-400">{orderStats.successRate}%</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">Failed to load order statistics</p>
            </div>
          )}
        </div>
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

  // Determine delivery type
  const isIncoming = delivery.metadata?.deliveryType === 'incoming' || delivery.isIncoming;

  return (
    <div className={`border rounded-xl p-4 ${urgencyColors[delivery.package?.urgency || 'routine']} hover:scale-[1.02] transition-all flex flex-col h-full`}>
      <div className="flex items-start justify-between mb-3">
        <div>
          {/* <h3 className="text-white font-semibold">{delivery.orderId}</h3> */}
          <div className="flex items-center gap-2">
            <h3 className="text-white font-semibold">{delivery.orderId}</h3>
            {/* Show delivery type badge */}
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
            {/* {delivery.metadata?.deliveryType === 'incoming' 
              ? delivery.metadata?.orderedBy?.name || 'Hospital Staff'
              : delivery.sender?.userId?.name || 'Unknown'} */}

            {isIncoming
              ? delivery.metadata?.orderedBy?.name || delivery.sender?.userId?.name || 'Hospital Staff'
              : delivery.sender?.userId?.name || 'Unknown'}
          </span>
        </div>
        <div className="text-sm">
          <span className="text-gray-400">Weight:</span>
          <span className="text-gray-300 ml-2">{delivery.package?.weight}g</span>
        </div>
        <div className="text-sm min-h-[20px]">
          {delivery.metadata?.approvalDeadline ? (
            <>
              <span className="text-yellow-400">Auto-approval in:</span>
              <span className="text-yellow-300 ml-2">
                {getTimeRemaining(delivery.metadata.approvalDeadline)}
              </span>
            </>
          ) : (
            <span className="text-gray-500 text-xs">*Needs your approval</span>
          )}
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

// Approval Modal Component
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

// Stat Card Component
function StatCard({ title, value, subtitle, icon: Icon, gradient, change }) {
  const isPositive = change && change.startsWith('+');
  
  return (
    <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-red-500/20 hover:border-red-500/30 transition-all group">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {change && (
          <span className={`text-sm font-medium ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
            {change}
          </span>
        )}
      </div>
      <h3 className="text-2xl font-bold text-white">{value}</h3>
      <p className="text-gray-400 text-sm mt-1">{title}</p>
      <p className="text-gray-500 text-xs mt-1">{subtitle}</p>
    </div>
  );
}

// Delivery Row Component
function DeliveryRow({ delivery }) {
  const statusColors = {
    pending: 'text-yellow-400 bg-yellow-500/20',
    pending_approval: 'text-yellow-400 bg-yellow-500/20',
    approved: 'text-blue-400 bg-blue-500/20',
    in_transit: 'text-blue-400 bg-blue-500/20',
    delivered: 'text-green-400 bg-green-500/20',
    failed: 'text-red-400 bg-red-500/20'
  };

  const statusClass = statusColors[delivery.status] || 'text-gray-400 bg-gray-500/20';
  const isIncoming = delivery.metadata?.deliveryType === 'incoming';

  return (
    <tr className="hover:bg-gray-800/50 transition-colors">
      <td className="py-3">
        {/* <span className="text-white font-medium">{delivery.orderId}</span> */}
        <div className="flex items-center gap-2">
          <span className="text-white font-medium">{delivery.orderId}</span>
          <span className={`text-xs px-2 py-0.5 rounded-full ${
            isIncoming 
              ? 'bg-blue-500/20 text-blue-400' 
              : 'bg-orange-500/20 text-orange-400'
          }`}>
            {isIncoming ? 'Incoming' : 'Outgoing'}
          </span>
        </div>
      </td>
      <td className="py-3">
        <span className="text-gray-300">{delivery.type}</span>
      </td>
      <td className="py-3">
        <span className="text-gray-300">{delivery.recipient}</span>
      </td>
      <td className="py-3">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClass}`}>
          {delivery.status.replace('_', ' ')}
        </span>
      </td>
      <td className="py-3">
        <span className="text-gray-300">{delivery.eta}</span>
      </td>
    </tr>
  );
}

// Staff Activity Item Component
function StaffActivityItem({ activity }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0">
        <UserIcon className="w-4 h-4 text-red-400" />
      </div>
      <div className="flex-1">
        <p className="text-white text-sm">{activity.staffName}</p>
        <p className="text-gray-400 text-xs">{activity.action}</p>
        <p className="text-gray-500 text-xs mt-1">{activity.time}</p>
      </div>
    </div>
  );
}

// Update the DeliveryTypeBar component to include count and animation
function DeliveryTypeBar({ type, count, percentage, color, delay }) {
  return (
    <div 
      className="animate-fade-in-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex justify-between mb-1">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-300">{type}</span>
          <span className="text-xs text-gray-500">({count})</span>
        </div>
        <span className="text-sm text-gray-400">{percentage}%</span>
      </div>
      <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
        <div 
          className={`${color} h-2 rounded-full transition-all duration-1000 ease-out`} 
          style={{ 
            width: `${percentage}%`,
            animation: 'growWidth 1s ease-out forwards'
          }}
        ></div>
      </div>
    </div>
  );
}

// DeliveryTypeChart Component
function DeliveryTypeChart({ stats }) {
  const maxCount = Math.max(...stats.map(s => s.count), 1);
  
  // Icon components for each delivery type
  const typeIcons = {
    medication: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
        <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
      </svg>
    ),
    blood: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        {/* Small drop in top left */}
        <path d="M6 1.5C5.5 0.5 2 4 2 6.5c0 2.5 1.8 4.5 4 4.5s4-2 4-4.5C10 4 6.5 0.5 6 1.5z" fillOpacity="0.85"/>
        {/* Main blood drop with cubic bezier curves */}
        <path d="M12 2C11.5 1 4 8.5 4 15c0 4.4 3.6 8 8 8s8-3.6 8-8C20 8.5 12.5 1 12 2zm0 18c-3.3 0-6-2.7-6-6 0-4.5 4.5-10 6-11.5 1.5 1.5 6 7 6 11.5 0 3.3-2.7 6-6 6z"/>
        {/* Glossy highlight with curve */}
        <path d="M8.5 12C8 13 8 15 9 16.5c1 1 2.5 0 2.5-1.5S10 11 9 11C8.5 11 8.5 11.5 8.5 12z" fillOpacity="0.35"/>
      </svg>
    ),
    organ: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
      </svg>
    ),
    medical_supplies: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
        <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
      </svg>
    ),
    documents: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
      </svg>
    ),
    other: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
      </svg>
    )
  };
  
  return (
    <div className="grid grid-cols-2 gap-4 mt-6 p-4 bg-gray-800/30 rounded-xl">
      {stats.map((stat, index) => (
        <DeliveryTypeTooltip key={stat.type} stat={stat}>
          <div 
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-700/50 transition-all cursor-pointer animate-fade-in-up"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="relative">
              <div className={`w-14 h-14 ${stat.color} ${stat.color.replace('bg-', 'bg-opacity-20 border-2 border-')} rounded-xl flex items-center justify-center text-white`}>
                {typeIcons[stat.type] || typeIcons.other}
              </div>
              {stat.count > 0 && (
                <div className="absolute -top-1 -right-1 bg-white text-gray-900 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {stat.count}
                </div>
              )}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-white">{stat.label}</p>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex-1 bg-gray-700 rounded-full h-1.5 overflow-hidden">
                  <div 
                    className={`${stat.color} h-1.5 rounded-full transition-all duration-700`}
                    style={{ width: `${(stat.count / maxCount) * 22.22}%` }}
                  />
                </div>
                <span className="text-xs text-gray-400">{stat.percentage}%</span>
              </div>
            </div>
          </div>
        </DeliveryTypeTooltip>
      ))}
    </div>
  );
}

// DeliveryTypeTooltip Component
function DeliveryTypeTooltip({ children, stat }) {
  const [isVisible, setIsVisible] = useState(false);
  
  return (
    <div 
      className="relative"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-50 animate-fade-in">
          <div className="bg-gray-800 border border-gray-700 text-white text-xs rounded-lg px-4 py-3 whitespace-nowrap shadow-xl">
            <p className="font-semibold text-sm mb-1">{stat.label}</p>
            <div className="space-y-1">
              <p className="flex justify-between gap-4">
                <span className="text-gray-400">Total Deliveries:</span>
                <span className="font-medium">{stat.count}</span>
              </p>
              <p className="flex justify-between gap-4">
                <span className="text-gray-400">Percentage:</span>
                <span className="font-medium">{stat.percentage}%</span>
              </p>
              {stat.count > 0 && (
                <p className="flex justify-between gap-4">
                  <span className="text-gray-400">Status:</span>
                  <span className="text-green-400 font-medium">Active</span>
                </p>
              )}
            </div>
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
              <div className="w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-gray-800"></div>
              <div className="w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-gray-700 -mt-px"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// // Quick Action Button Component
// function QuickActionButton({ title, icon: Icon, gradient, onClick }) {
//   return (
//     <button
//       onClick={onClick}
//       className="bg-gray-800/50 backdrop-blur hover:bg-gray-700/50 rounded-xl p-4 transition-all group border border-red-500/10 hover:border-red-500/20"
//     >
//       <div className={`w-10 h-10 bg-gradient-to-br ${gradient} rounded-lg flex items-center justify-center mb-2 group-hover:scale-110 transition-transform shadow-lg`}>
//         <Icon className="w-5 h-5 text-white" />
//       </div>
//       <p className="text-white text-sm font-medium">{title}</p>
//     </button>
//   );
// }


// Add this new component for Order Stat Cards:
function OrderStatCard({ label, value, icon: Icon, color, bgColor, small = false, total = 0 }) {
  return (
    <div className={`${bgColor} backdrop-blur rounded-xl ${small ? 'p-3' : 'p-4'} group hover:scale-105 transition-transform`}>
      <div className="flex items-center justify-between mb-2">
        <Icon className={`${small ? 'w-4 h-4' : 'w-5 h-5'} ${color}`} />
        <span className={`${small ? 'text-xs' : 'text-sm'} ${color} font-medium`}>
          {total > 0 && value > 0 ? `${Math.round((value / total) * 100)}%` : '0%'}
        </span>
      </div>
      <p className={`${small ? 'text-xs' : 'text-sm'} text-gray-400`}>{label}</p>
      <p className={`${small ? 'text-lg' : 'text-xl'} font-bold text-white`}>{value}</p>
    </div>
  );
}

// Icon Components
const ActiveIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

const CheckIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const TimeIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const UsersIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const UserIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const PlusIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
  </svg>
);

const UserPlusIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
  </svg>
);

const InventoryIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
  </svg>
);

const ReportIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const AlertIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);

// Add these icon components at the end of the file:
const OutgoingIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4-4m0 0l-4-4m4 4H3" />
  </svg>
);

const IncomingIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
  </svg>
);

const ApprovedIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const RejectedIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const DeliveredIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const FailedIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const TransitIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
  </svg>
);

const CancelledIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const RoutineIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const UrgentIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

const EmergencyStatIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);
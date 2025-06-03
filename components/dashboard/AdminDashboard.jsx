// components/dashboard/AdminDashboard.jsx
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import NotificationBell from '@/components/NotificationBell';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import RevenueOverview from '@/components/dashboard/RevenueOverview';

export default function AdminDashboard() {
  const router = useRouter();
  const { data: session } = useSession();
  const [stats, setStats] = useState({
    totalDeliveries: 0,
    activeDeliveries: 0,
    totalDrones: 0,
    activeDrones: 0,
    totalHospitals: 0,
    verifiedHospitals: 0,
    totalUsers: 0,
    revenue: 0
  });

  const [recentActivity, setRecentActivity] = useState([]);
  const [droneStatus, setDroneStatus] = useState([]);
  const [needingAssignment, setNeedingAssignment] = useState([]);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [availablePilots, setAvailablePilots] = useState([]);
  const [selectedPilot, setSelectedPilot] = useState('');

  useEffect(() => {
    // Fetch dashboard data
    fetchDashboardStats();
    fetchRecentActivity();
    fetchDroneStatus();
    fetchNeedingAssignment();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const res = await fetch('/api/admin/stats');
      const data = await res.json();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const fetchRecentActivity = async () => {
    try {
      const res = await fetch('/api/admin/activity');
      const data = await res.json();
      setRecentActivity(data);
    } catch (error) {
      console.error('Failed to fetch activity:', error);
    }
  };

  const fetchDroneStatus = async () => {
    try {
      const res = await fetch('/api/admin/drones/status');
      const data = await res.json();
      setDroneStatus(data);
    } catch (error) {
      console.error('Failed to fetch drone status:', error);
    }
  };

  const fetchNeedingAssignment = async () => {
    try {
      const res = await fetch('/api/admin/deliveries-needing-assignment');
      const data = await res.json();
      setNeedingAssignment(data.deliveries || []);
    } catch (error) {
      console.error('Failed to fetch deliveries needing assignment:', error);
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
        fetchDashboardStats();
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

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2 flex justify-between">
          System Overview 
          <NotificationBell />
        </h1>
        <p className="text-gray-400">Welcome back, {session?.user?.name}</p>
      </div>

      {/* Assignment Alert */}
      {needingAssignment.length > 0 && (
        <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AssignmentIcon className="w-6 h-6 text-purple-500" />
            <div>
              <p className="text-white font-semibold">{needingAssignment.length} Deliveries Need Pilot Assignment</p>
              <p className="text-gray-400 text-sm">Approved deliveries waiting for pilot assignment</p>
            </div>
          </div>
          <a href="#pilot-assignments" className="bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 px-4 py-2 rounded-lg transition-all">
            Assign Pilots
          </a>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Deliveries"
          value={stats.totalDeliveries}
          subtitle="All time"
          icon={DeliveryIcon}
          gradient="from-purple-600 to-indigo-600"
        />
        <StatCard
          title="Active Deliveries"
          value={stats.activeDeliveries}
          subtitle="In progress"
          icon={ActiveDeliveryIcon}
          gradient="from-green-600 to-emerald-600"
        />
        <StatCard
          title="Drone Fleet"
          value={`${stats.activeDrones}/${stats.totalDrones}`}
          subtitle="Active / Total"
          icon={DroneIcon}
          gradient="from-blue-600 to-cyan-600"
        />
        <StatCard
          title="Hospitals"
          value={`${stats.verifiedHospitals}/${stats.totalHospitals}`}
          subtitle="Verified / Total"
          icon={HospitalIcon}
          gradient="from-red-600 to-rose-600"
        />
      </div>

      {/* Pilot Assignment Section */}
      <div id="pilot-assignments" className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/20 hover:border-purple-500/30 transition-all mb-8">
        
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">Deliveries Awaiting Pilot Assignment</h2>
          <div className="flex items-center gap-4">
            {needingAssignment.length > 0 && (
              <span className="bg-purple-500/20 text-purple-400 px-3 py-1 rounded-full text-sm font-medium">
                {needingAssignment.length} Pending
              </span>
            )}
            <button 
              onClick={() => router.push('/dashboard/admin/pending-assignments')}
              className="text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors"
            >
              View All
            </button>
          </div>
        </div>
        
        {needingAssignment.length === 0 ? (
          <div className="text-center py-8">
            <CheckIcon className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500">All deliveries have been assigned</p>
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
                {needingAssignment.map((delivery) => (
                  <AssignmentRow
                    key={delivery._id}
                    delivery={delivery}
                    onAssign={() => openAssignmentModal(delivery)}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Charts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Delivery Trends Chart */}
        <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/20 hover:border-purple-500/30 transition-all">
          <h2 className="text-xl font-semibold text-white mb-4">Delivery Trends</h2>
          <div className="h-64 flex items-center justify-center text-gray-500">
            {/* Chart placeholder - integrate with a charting library */}
            <p>Delivery trends chart</p>
          </div>
        </div>

        {/* Revenue Chart */}
        {/* <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/20 hover:border-purple-500/30 transition-all">
          <h2 className="text-xl font-semibold text-white mb-4">Revenue Overview</h2>
          <div className="h-64 flex items-center justify-center text-gray-500">
            <p>Revenue chart</p>
          </div>
        </div> */}

        <RevenueOverview />

      </div>

      <div className="mb-8">
        <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/20 hover:border-purple-500/30 transition-all animate-fade-in-up">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-semibold text-white">Recent System Activity</h2>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-gray-400">Live</span>
              </div>
            </div>
            <button 
              onClick={() => router.push('/dashboard/admin/recent-activity')}
              className="text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors flex items-center gap-1 group"
            >
              View All Activity
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          
          {recentActivity.length === 0 ? (
            <div className="text-center py-8">
              <ActivityIcon className="w-12 h-12 text-gray-600 mx-auto mb-3 opacity-50" />
              <p className="text-gray-500">No recent activity</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b border-gray-800">
                    <th className="pb-2 text-xs font-medium text-gray-400">Time</th>
                    <th className="pb-2 text-xs font-medium text-gray-400">User</th>
                    <th className="pb-2 text-xs font-medium text-gray-400">Activity</th>
                    <th className="pb-2 text-xs font-medium text-gray-400">Order ID</th>
                    <th className="pb-2 text-xs font-medium text-gray-400">Type</th>
                    <th className="pb-2 text-xs font-medium text-gray-400">Priority</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {recentActivity.slice(0, 8).map((activity, index) => (
                    <EnhancedActivityRow key={index} activity={activity} index={index} />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      

      {/* Quick Actions */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <QuickActionCard
            title="Add New Drone"
            description="Register a new drone to the fleet"
            icon={PlusIcon}
            href="/dashboard/drones/new"
            gradient="from-purple-600 to-indigo-600"
          />
          <QuickActionCard
            title="Verify Hospital"
            description="Review pending hospital verifications"
            icon={CheckIcon}
            href="/dashboard/hospitals/verify"
            gradient="from-purple-600 to-indigo-600"
          />
          <QuickActionCard
            title="System Settings"
            description="Configure system parameters"
            icon={SettingsIcon}
            href="/dashboard/settings"
            gradient="from-purple-600 to-indigo-600"
          />
        </div>
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
  );
}

// Assignment Row Component
function AssignmentRow({ delivery, onAssign }) {
  const urgencyColors = {
    routine: 'text-gray-400 bg-gray-500/20',
    urgent: 'text-orange-400 bg-orange-500/20',
    emergency: 'text-red-400 bg-red-500/20'
  };

  const urgencyClass = urgencyColors[delivery.package?.urgency] || urgencyColors.routine;

  return (
    <tr className="hover:bg-gray-800/50 transition-colors">
      <td className="py-3">
        <span className="text-white font-medium">{delivery.orderId}</span>
      </td>
      <td className="py-3">
        <span className="text-gray-300">{delivery.package?.type}</span>
      </td>
      <td className="py-3">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${urgencyClass}`}>
          {delivery.package?.urgency}
        </span>
      </td>
      <td className="py-3">
        <span className="text-gray-300">{delivery.sender?.hospitalId?.name || 'Unknown'}</span>
      </td>
      <td className="py-3">
        <span className="text-gray-300">
          {delivery.approverName}
          {delivery.isAutoApproved && (
            <span className="text-yellow-400 text-xs ml-1">(Auto)</span>
          )}
        </span>
      </td>
      <td className="py-3">
        <span className="text-gray-400 text-sm">{delivery.timeSinceApproval}</span>
      </td>
      <td className="py-3">
        <button
          onClick={onAssign}
          className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-all"
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
      <div className="bg-gray-900 rounded-2xl p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold text-white mb-4">Assign Pilot to Delivery</h2>
        
        {/* Delivery Details */}
        <div className="bg-gray-800/50 rounded-xl p-4 mb-6">
          <h3 className="text-lg font-semibold text-white mb-3">Delivery Details</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-400 text-sm">Order ID</p>
              <p className="text-white font-semibold">{delivery.orderId}</p>
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
                      : 'border-gray-700 hover:border-gray-600'
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
                ? 'bg-purple-600 hover:bg-purple-700 text-white'
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
    </div>
  );
}

// Stat Card Component
function StatCard({ title, value, subtitle, icon: Icon, gradient }) {
  return (
    <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/20 hover:border-purple-500/30 transition-all group">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <span className="text-sm text-gray-500">{subtitle}</span>
      </div>
      <h3 className="text-2xl font-bold text-white">{value}</h3>
      <p className="text-gray-400 text-sm mt-1">{title}</p>
    </div>
  );
}

// Activity Item Component
function ActivityItem({ activity }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
        <ActivityIcon className="w-4 h-4 text-purple-400" />
      </div>
      <div className="flex-1">
        <p className="text-white text-sm">{activity.description}</p>
        <p className="text-gray-500 text-xs mt-1">{activity.timestamp}</p>
      </div>
    </div>
  );
}

// New Enhanced Activity Row Component
function EnhancedActivityRow({ activity, index }) {
  const roleIcons = {
    'medical_staff': MedicalStaffIcon,
    'hospital_admin': HospitalAdminIcon,
    'admin': AdminIcon,
    'pilot': PilotIcon
  };

  const activityColors = {
    'created_delivery': 'text-blue-400 bg-blue-500/20',
    'placed_order': 'text-cyan-400 bg-cyan-500/20',
    'approved_delivery': 'text-green-400 bg-green-500/20',
    'rejected_delivery': 'text-red-400 bg-red-500/20',
    'assigned_pilot': 'text-purple-400 bg-purple-500/20',
    'started_flight': 'text-yellow-400 bg-yellow-500/20',
    'marked_delivered': 'text-emerald-400 bg-emerald-500/20',
    'cancelled_flight': 'text-orange-400 bg-orange-500/20'
  };

  const urgencyColors = {
    routine: 'text-gray-400 bg-gray-500/20',
    urgent: 'text-orange-400 bg-orange-500/20',
    emergency: 'text-red-400 bg-red-500/20 animate-pulse'
  };

  const RoleIcon = roleIcons[activity.userRole] || ActivityIcon;
  const activityColor = activityColors[activity.activityType] || 'text-gray-400 bg-gray-500/20';
  const urgencyColor = urgencyColors[activity.urgency] || urgencyColors.routine;

  return (
    <tr 
      className="hover:bg-gray-800/50 transition-all animate-fade-in group"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <td className="py-2">
        <span className="text-gray-400 text-xs">{activity.timeAgo}</span>
      </td>
      <td className="py-2">
        <div className="flex items-center gap-2">
          <div className={`w-6 h-6 rounded-full ${getRoleColor(activity.userRole)} bg-opacity-20 flex items-center justify-center`}>
            <RoleIcon className="w-3.5 h-3.5" style={{ color: getRoleColor(activity.userRole).replace('bg-', '') }} />
          </div>
          <div>
            <p className="text-white text-sm font-medium">{activity.userName}</p>
            <p className="text-gray-500 text-xs capitalize">{activity.userRole?.replace('_', ' ')}</p>
          </div>
        </div>
      </td>
      <td className="py-2">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${activityColor}`}>
          {activity.action}
        </span>
      </td>
      <td className="py-2">
        <span className="text-white font-mono text-xs">{activity.orderId}</span>
      </td>
      <td className="py-2">
        <span className="text-gray-300 text-xs capitalize">{activity.packageType}</span>
      </td>
      <td className="py-2">
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${urgencyColor}`}>
          {activity.urgency}
        </span>
      </td>
    </tr>
  );
}

// Helper function to get role color
function getRoleColor(role) {
  const colors = {
    'medical_staff': 'bg-blue-500',
    'hospital_admin': 'bg-red-500',
    'admin': 'bg-purple-500',
    'pilot': 'bg-green-500'
  };
  return colors[role] || 'bg-gray-500';
}

// Quick Action Card Component
function QuickActionCard({ title, description, icon: Icon, href, gradient }) {
  return (
    <a
      href={href}
      className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/20 hover:border-purple-500/30 transition-all group hover:shadow-lg hover:shadow-purple-500/10"
    >
      <div className={`w-12 h-12 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <h3 className="text-white font-semibold mb-1">{title}</h3>
      <p className="text-gray-400 text-sm">{description}</p>
    </a>
  );
}

// Icon Components
const DeliveryIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
  </svg>
);

const ActiveDeliveryIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

const DroneIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
  </svg>
);

const HospitalIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

const ActivityIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const PlusIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
  </svg>
);

const CheckIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const SettingsIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const AssignmentIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
  </svg>
);

const MedicalStaffIcon = ({ className, style }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20" style={style}>
    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
  </svg>
);

const HospitalAdminIcon = ({ className, style }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20" style={style}>
    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm3 1h6v4H7V5zm6 6H7v2h6v-2z" clipRule="evenodd" />
  </svg>
);

const AdminIcon = ({ className, style }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20" style={style}>
    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
  </svg>
);

const PilotIcon = ({ className, style }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20" style={style}>
    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
  </svg>
);
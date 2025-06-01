// app/dashboard/hospital-admin/staff-activity/page.jsx
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

const UserIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const FilterIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
  </svg>
);

const ActivityIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

const CalendarIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const SearchIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

export default function StaffActivityPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [activities, setActivities] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    staffId: 'all',
    activityType: 'all', // all, deliveries, logins
    dateRange: '7days',
    search: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50,
    total: 0
  });

  useEffect(() => {
    fetchStaffList();
    fetchActivities();
  }, [filters, pagination.page]);

  const fetchStaffList = async () => {
    try {
      const res = await fetch('/api/hospital-admin/staff/list');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setStaffList(data);
    } catch (error) {
      console.error('Error fetching staff list:', error);
    }
  };

  const fetchActivities = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page: pagination.page,
        limit: pagination.limit,
        ...filters
      });

      const res = await fetch(`/api/hospital-admin/staff/activity/detailed?${queryParams}`);
      if (!res.ok) throw new Error('Failed to fetch');
      
      const data = await res.json();
      setActivities(data.activities);
      setPagination(prev => ({ ...prev, total: data.total }));
    } catch (error) {
      console.error('Error fetching activities:', error);
      toast.error('Failed to load staff activities');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'delivery_created':
        return { icon: ActivityIcon, color: 'text-green-400', bg: 'bg-green-500/20' };
      case 'delivery_cancelled':
        return { icon: ActivityIcon, color: 'text-red-400', bg: 'bg-red-500/20' };
      case 'login':
        return { icon: UserIcon, color: 'text-blue-400', bg: 'bg-blue-500/20' };
      default:
        return { icon: ActivityIcon, color: 'text-gray-400', bg: 'bg-gray-500/20' };
    }
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
                <h1 className="text-3xl font-bold text-white mb-2">Staff Activity</h1>
                <p className="text-gray-400">Monitor all staff activities and actions</p>
              </div>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className="px-4 py-2 bg-gray-800/50 text-white rounded-xl hover:bg-gray-700/50 transition-all flex items-center gap-2"
              >
                <FilterIcon className="w-5 h-5" />
                Filters
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl p-4 border border-red-500/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
                  <UserIcon className="w-6 h-6 text-red-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{staffList.length}</p>
                  <p className="text-sm text-gray-400">Total Staff</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl p-4 border border-green-500/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <UserIcon className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">
                    {staffList.filter(s => s.isActive).length}
                  </p>
                  <p className="text-sm text-gray-400">Active Now</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl p-4 border border-blue-500/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <ActivityIcon className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{pagination.total}</p>
                  <p className="text-sm text-gray-400">Total Activities</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl p-4 border border-yellow-500/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                  <CalendarIcon className="w-6 h-6 text-yellow-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">
                    {activities.filter(a => {
                      const activityDate = new Date(a.timestamp);
                      const today = new Date();
                      return activityDate.toDateString() === today.toDateString();
                    }).length}
                  </p>
                  <p className="text-sm text-gray-400">Today's Activities</p>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-red-500/20 mb-6 animate-fade-in-up">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Staff Member</label>
                  <select
                    value={filters.staffId}
                    onChange={(e) => handleFilterChange('staffId', e.target.value)}
                    className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-red-500"
                  >
                    <option value="all">All Staff</option>
                    {staffList.map(staff => (
                      <option key={staff._id} value={staff._id}>{staff.name}</option>
                    ))}
                  </select>
                </div>

                {/* <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Activity Type</label>
                  <select
                    value={filters.activityType}
                    onChange={(e) => handleFilterChange('activityType', e.target.value)}
                    className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-red-500"
                  >
                    <option value="all">All Activities</option>
                    <option value="deliveries">Deliveries</option>
                    <option value="logins">Logins</option>
                  </select>
                </div> */}

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Date Range</label>
                  <select
                    value={filters.dateRange}
                    onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                    className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-red-500"
                  >
                    <option value="today">Today</option>
                    <option value="7days">Last 7 Days</option>
                    <option value="30days">Last 30 Days</option>
                    <option value="90days">Last 90 Days</option>
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-400 mb-2">Search</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={filters.search}
                      onChange={(e) => handleFilterChange('search', e.target.value)}
                      placeholder="Search activities..."
                      className="w-full px-4 py-2 pl-10 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-red-500"
                    />
                    <SearchIcon className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Activity Timeline */}
          <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-red-500/20">
            <h2 className="text-xl font-semibold text-white mb-6">Activity Timeline</h2>
            
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <svg className="animate-spin h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            ) : activities.length === 0 ? (
              <div className="text-center py-12">
                <ActivityIcon className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-500">No activities found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {activities.map((activity, index) => {
                  const { icon: Icon, color, bg } = getActivityIcon(activity.type);
                  
                  return (
                    <div key={activity._id || index} className="flex gap-4 animate-fade-in">
                      <div className="flex flex-col items-center">
                        <div className={`w-10 h-10 rounded-full ${bg} flex items-center justify-center flex-shrink-0`}>
                          <Icon className={`w-5 h-5 ${color}`} />
                        </div>
                        {index < activities.length - 1 && (
                          <div className="w-0.5 h-full bg-gray-700 mt-2"></div>
                        )}
                      </div>
                      
                      <div className="flex-1 pb-8">
                        <div className="bg-gray-800/50 rounded-xl p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-white font-semibold">
                              {activity.staffName || 'Unknown Staff'}
                            </h4>
                            <span className="text-xs text-gray-400">
                              {activity.timeAgo}
                            </span>
                          </div>
                          <p className="text-gray-300">{activity.action}</p>
                          {activity.details && (
                            <p className="text-gray-500 text-sm mt-2">{activity.details}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6 flex items-center justify-center">
                <div className="flex gap-2">
                  <button
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                    disabled={pagination.page === 1}
                    className="px-3 py-1 bg-gray-800/50 text-white rounded-lg hover:bg-gray-700/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    Previous
                  </button>
                  
                  <span className="px-3 py-1 text-gray-400">
                    Page {pagination.page} of {totalPages}
                  </span>
                  
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
          </div>
        </div>
      </DashboardLayout>
    </RoleGuard>
  );
}
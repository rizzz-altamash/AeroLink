// app/dashboard/hospital-admin/payments/page.jsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import RoleGuard from '@/components/auth/RoleGuard';
import toast from 'react-hot-toast';

export default function PaymentsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('pending');
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalSpent: 0,
    pendingAmount: 0,
    completedDeliveries: 0,
    averagePerDelivery: 0
  });

  useEffect(() => {
    fetchPayments();
    fetchStats();
  }, [activeTab]);

  const fetchPayments = async () => {
    try {
      const res = await fetch(`/api/hospital-admin/payments?status=${activeTab}`);
      const data = await res.json();
      setPayments(data.payments);
    } catch (error) {
      toast.error('Failed to load payments');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/hospital-admin/payment-stats');
      const data = await res.json();
      setStats(data);
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  return (
    <RoleGuard allowedRoles={['hospital_admin']}>
      <DashboardLayout>
        <div className="p-4 sm:p-6 lg:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-6">Payment Management</h1>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl p-6 border border-red-500/20">
              <p className="text-gray-400 text-sm">Total Spent</p>
              <p className="text-2xl font-bold text-white">₹{stats.totalSpent.toFixed(2)}</p>
            </div>
            <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl p-6 border border-yellow-500/20">
              <p className="text-gray-400 text-sm">Pending Amount</p>
              <p className="text-2xl font-bold text-yellow-400">₹{stats.pendingAmount.toFixed(2)}</p>
            </div>
            <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl p-6 border border-green-500/20">
              <p className="text-gray-400 text-sm">Completed Deliveries</p>
              <p className="text-2xl font-bold text-white">{stats.completedDeliveries}</p>
            </div>
            <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl p-6 border border-blue-500/20">
              <p className="text-gray-400 text-sm">Avg. Per Delivery</p>
              <p className="text-2xl font-bold text-white">₹{stats.averagePerDelivery.toFixed(2)}</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setActiveTab('pending')}
              className={`px-4 py-2 rounded-lg font-medium ${
                activeTab === 'pending'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              Pending Orders
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`px-4 py-2 rounded-lg font-medium ${
                activeTab === 'completed'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              Completed Payments
            </button>
          </div>

          {/* Payment List */}
          <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl border border-red-500/20">
            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin h-8 w-8 border-b-2 border-red-500 rounded-full mx-auto"></div>
              </div>
            ) : payments.length === 0 ? (
              <div className="p-8 text-center text-gray-400">
                No {activeTab} payments found
              </div>
            ) : (
              <div className="divide-y divide-gray-800">
                {payments.map((payment) => (
                  <PaymentCard key={payment._id} payment={payment} />
                ))}
              </div>
            )}
          </div>
        </div>
      </DashboardLayout>
    </RoleGuard>
  );
}

function PaymentCard({ payment }) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-white font-semibold">Order #{payment.orderId}</h3>
          <p className="text-sm text-gray-400">
            {new Date(payment.createdAt).toLocaleString()}
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-white">₹ {payment.amount.toFixed(2)}</p>
          <p className={`text-sm ${
            payment.status === 'completed' ? 'text-green-400' : 'text-yellow-400'
          }`}>
            {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-400">
          <p>Staff: {payment.staffDetails.name}</p>
          <p>Type: {payment.deliveryDetails.packageType} ({payment.deliveryDetails.urgency})</p>
        </div>
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-red-400 hover:text-red-300 text-sm"
        >
          {showDetails ? 'Hide' : 'View'} Details
        </button>
      </div>

      {showDetails && (
        <div className="mt-4 p-4 bg-gray-800/50 rounded-lg">
          <h4 className="text-white font-medium mb-3">Price Breakdown</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Base Price</span>
              <span className="text-white">₹ {payment.priceBreakdown.basePrice}</span>
            </div>
            {payment.priceBreakdown.urgencyCharge > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-400">Urgency Charge</span>
                <span className="text-white">₹ {payment.priceBreakdown.urgencyCharge}</span>
              </div>
            )}
            {payment.priceBreakdown.distanceCharge > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-400">Distance Charge</span>
                <span className="text-white">₹ {payment.priceBreakdown.distanceCharge}</span>
              </div>
            )}
            {payment.priceBreakdown.weightCharge > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-400">Weight Charge</span>
                <span className="text-white">₹ {payment.priceBreakdown.weightCharge}</span>
              </div>
            )}
            {payment.priceBreakdown.temperatureCharge > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-400">Temperature Charge</span>
                <span className="text-white">₹ {payment.priceBreakdown.temperatureCharge}</span>
              </div>
            )}
            {payment.priceBreakdown.fragileCharge > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-400">Fragile Charge</span>
                <span className="text-white">₹ {payment.priceBreakdown.fragileCharge}</span>
              </div>
            )}
            {payment.priceBreakdown.timeBasedCharge > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-400">Time-Based Charge</span>
                <span className="text-white">₹ {payment.priceBreakdown.timeBasedCharge}</span>
              </div>
            )}
            {/* Add other charges */}
            <div className="border-t border-gray-700 pt-2 flex justify-between font-semibold">
              <span className="text-white">Total</span>
              <span className="text-white">₹ {payment.priceBreakdown.totalPrice}</span>
            </div>
          </div>
          
          {payment.status === 'completed' && payment.receiptUrl && (
            <button className="mt-4 text-red-400 hover:text-red-300 text-sm">
              Download Receipt
            </button>
          )}
        </div>
      )}
    </div>
  );
}
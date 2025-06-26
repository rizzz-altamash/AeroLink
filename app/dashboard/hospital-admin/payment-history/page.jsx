// app/dashboard/hospital-admin/payment-history/page.jsx
'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import RoleGuard from '@/components/auth/RoleGuard';
import toast from 'react-hot-toast';

export default function PaymentHistoryPage() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    dateFrom: '',
    dateTo: '',
    status: 'all',
    urgency: 'all'
  });

  useEffect(() => {
    fetchPaymentHistory();
  }, [filters]);

  const fetchPaymentHistory = async () => {
    try {
      const params = new URLSearchParams(filters);
      const res = await fetch(`/api/hospital-admin/payment-history?${params}`);
      const data = await res.json();
      setPayments(data.payments);
    } catch (error) {
      toast.error('Failed to load payment history');
    } finally {
      setLoading(false);
    }
  };

  const downloadReport = async () => {
    try {
      const params = new URLSearchParams(filters);
      const res = await fetch(`/api/hospital-admin/payment-report?${params}`);
      const blob = await res.blob();
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `payment-report-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
    } catch (error) {
      toast.error('Failed to download report');
    }
  };

  return (
    <RoleGuard allowedRoles={['hospital_admin']}>
      <DashboardLayout>
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Payment History</h1>
            <button
              onClick={downloadReport}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium"
            >
              Download Report
            </button>
          </div>

          {/* Filters */}
          <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl p-6 mb-6 border border-red-500/20">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="text-sm text-gray-400 block mb-2">From Date</label>
                <input
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => setFilters({...filters, dateFrom: e.target.value})}
                  className="w-full bg-gray-800 text-white rounded-lg px-4 py-2"
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 block mb-2">To Date</label>
                <input
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => setFilters({...filters, dateTo: e.target.value})}
                  className="w-full bg-gray-800 text-white rounded-lg px-4 py-2"
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 block mb-2">Status</label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters({...filters, status: e.target.value})}
                  className="w-full bg-gray-800 text-white rounded-lg px-4 py-2"
                >
                  <option value="all">All</option>
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-400 block mb-2">Urgency</label>
                <select
                  value={filters.urgency}
                  onChange={(e) => setFilters({...filters, urgency: e.target.value})}
                  className="w-full bg-gray-800 text-white rounded-lg px-4 py-2"
                >
                  <option value="all">All</option>
                  <option value="routine">Routine</option>
                  <option value="urgent">Urgent</option>
                  <option value="emergency">Emergency</option>
                </select>
              </div>
            </div>
          </div>

          {/* Payment Table */}
          <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl border border-red-500/20 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="text-left p-4 text-gray-400 font-medium">Order ID</th>
                    <th className="text-left p-4 text-gray-400 font-medium">Date</th>
                    <th className="text-left p-4 text-gray-400 font-medium">Staff</th>
                    <th className="text-left p-4 text-gray-400 font-medium">Type</th>
                    <th className="text-left p-4 text-gray-400 font-medium">Amount</th>
                    <th className="text-left p-4 text-gray-400 font-medium">Status</th>
                    <th className="text-left p-4 text-gray-400 font-medium">Receipt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {payments.map((payment) => (
                    <tr key={payment._id} className="hover:bg-gray-800/50">
                      <td className="p-4 text-white">{payment.orderId}</td>
                      <td className="p-4 text-white">
                        {new Date(payment.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4 text-white">{payment.staffDetails.name}</td>
                      <td className="p-4 text-white">
                        {payment.deliveryDetails.packageType}
                      </td>
                      <td className="p-4 text-white font-semibold">
                        ₹{payment.amount.toFixed(2)}
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          payment.status === 'completed' 
                            ? 'bg-green-500/20 text-green-400'
                            : payment.status === 'pending'
                            ? 'bg-yellow-500/20 text-yellow-400'
                            : 'bg-red-500/20 text-red-400'
                        }`}>
                          {payment.status}
                        </span>
                      </td>
                      <td className="p-4">
                        {payment.receiptUrl && (
                          <a>
                            href={payment.receiptUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-red-400 hover:text-red-300"
                          
                            Download
                          </a>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </RoleGuard>
  );
}
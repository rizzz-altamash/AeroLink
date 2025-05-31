// app/dashboard/confirm-delivery/[id]/page.jsx
'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import RoleGuard from '@/components/auth/RoleGuard';
import toast from 'react-hot-toast';

export default function ConfirmDeliveryPage({ params }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { data: session } = useSession();
  const [delivery, setDelivery] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [denialReason, setDenialReason] = useState('');

  useEffect(() => {
    if (resolvedParams?.id) {
      fetchDeliveryData();
    }
  }, [resolvedParams?.id]);

  const fetchDeliveryData = async () => {
    try {
      const res = await fetch(`/api/deliveries/${resolvedParams.id}/track`);
      if (!res.ok) throw new Error('Failed to fetch');
      
      const data = await res.json();
      setDelivery(data);
    } catch (error) {
      console.error('Error fetching delivery:', error);
      toast.error('Failed to load delivery details');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async (confirmed) => {
    if (!confirmed && denialReason.trim().length < 5) {
      toast.error('Please provide a reason for denial');
      return;
    }

    setProcessing(true);
    try {
      const res = await fetch(`/api/staff/deliveries/${resolvedParams.id}/confirm`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          confirmed,
          reason: confirmed ? null : denialReason 
        })
      });

      if (!res.ok) throw new Error('Failed to process confirmation');
      
      toast.success(confirmed ? 'Delivery confirmed successfully!' : 'Delivery confirmation denied');
      router.push('/dashboard');
    } catch (error) {
      toast.error('Failed to process confirmation');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <RoleGuard allowedRoles={['medical_staff']}>
        <DashboardLayout>
          <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin h-12 w-12 border-4 border-red-500 border-t-transparent rounded-full"></div>
          </div>
        </DashboardLayout>
      </RoleGuard>
    );
  }

  if (!delivery || delivery.status !== 'pending_confirmation') {
    return (
      <RoleGuard allowedRoles={['medical_staff']}>
        <DashboardLayout>
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <p className="text-gray-400 mb-4">This delivery is not pending confirmation</p>
              <button
                onClick={() => router.push('/dashboard')}
                className="text-red-400 hover:text-red-300"
              >
                Return to Dashboard
              </button>
            </div>
          </div>
        </DashboardLayout>
      </RoleGuard>
    );
  }

  return (
    <RoleGuard allowedRoles={['medical_staff']}>
      <DashboardLayout>
        <div className="min-h-screen p-8">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-white mb-8">Confirm Delivery Receipt</h1>

            <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-8 border border-red-500/20">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-white mb-4">Delivery Details</h2>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Order ID</span>
                    <span className="text-white font-medium">{delivery.orderId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Package Type</span>
                    <span className="text-white capitalize">{delivery.package?.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Description</span>
                    <span className="text-white">{delivery.package?.description}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Weight</span>
                    <span className="text-white">{delivery.package?.weight}g</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-800 pt-6">
                <h3 className="text-lg font-semibold text-white mb-4">Have you received this package?</h3>
                
                <div className="space-y-4">
                  <button
                    onClick={() => handleConfirm(true)}
                    disabled={processing}
                    className="w-full py-4 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white rounded-xl font-semibold transition-all"
                  >
                    {processing ? 'Processing...' : 'Yes, I confirm receipt'}
                  </button>

                  <div>
                    <button
                      onClick={() => setDenialReason(denialReason ? '' : 'show')}
                      disabled={processing}
                      className="w-full py-4 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-xl font-semibold transition-all"
                    >
                      No, package not received
                    </button>
                    
                    {denialReason !== '' && (
                      <div className="mt-4 space-y-4 animate-fade-in-up">
                        <textarea
                          value={denialReason === 'show' ? '' : denialReason}
                          onChange={(e) => setDenialReason(e.target.value)}
                          className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-red-500 focus:outline-none h-24 resize-none"
                          placeholder="Please provide a reason..."
                        />
                        <button
                          onClick={() => handleConfirm(false)}
                          disabled={processing || (denialReason === 'show' || denialReason.trim().length < 5)}
                          className="w-full py-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-xl font-semibold transition-all"
                        >
                          Submit
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </RoleGuard>
  );
}
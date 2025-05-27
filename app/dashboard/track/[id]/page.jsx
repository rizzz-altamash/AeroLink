// app/dashboard/track/[id]/page.jsx
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import dynamic from 'next/dynamic';
import RoleGuard from '@/components/auth/RoleGuard';

// Dynamically import map component to avoid SSR issues
const MapComponent = dynamic(() => import('@/components/MapComponent'), { ssr: false });

// Icon Components
const BackIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
  </svg>
);

const DroneIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
  </svg>
);

const BatteryIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
  </svg>
);

const SpeedIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

const AltitudeIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
  </svg>
);

export default function TrackDeliveryPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [delivery, setDelivery] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mapView, setMapView] = useState('2d'); // '2d' or '3d'

  useEffect(() => {
    fetchDeliveryData();
    const interval = setInterval(fetchDeliveryData, 5000); // Update every 5 seconds
    return () => clearInterval(interval);
  }, [params.id]);

  const fetchDeliveryData = async () => {
    try {
      const res = await fetch(`/api/deliveries/${params.id}/track`);
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setDelivery(data);
    } catch (error) {
      console.error('Error fetching delivery:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelDelivery = async () => {
    if (!confirm('Are you sure you want to cancel this delivery?')) return;

    try {
      const res = await fetch(`/api/deliveries/${params.id}/cancel`, {
        method: 'POST'
      });

      if (!res.ok) throw new Error('Failed to cancel');
      
      alert('Delivery cancelled successfully');
      router.push('/dashboard');
    } catch (error) {
      alert('Failed to cancel delivery');
    }
  };

  if (loading) {
    return (
      <RoleGuard allowedRoles={['medical_staff', 'admin']}>
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <svg className="animate-spin h-12 w-12 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-gray-400">Loading delivery details...</p>
          </div>
        </div>
      </DashboardLayout>
      </RoleGuard>  
    );
  }

  if (!delivery) {
    return (
      <RoleGuard allowedRoles={['medical_staff', 'admin']}>  
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <p className="text-gray-400">Delivery not found</p>
            <button
              onClick={() => router.push('/dashboard')}
              className="mt-4 text-red-400 hover:text-red-300"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      </DashboardLayout>
      </RoleGuard>  
    );
  }

  const statusColors = {
    pending: 'bg-yellow-500',
    approved: 'bg-blue-500',
    assigned: 'bg-purple-500',
    pickup: 'bg-orange-500',
    in_transit: 'bg-green-500',
    delivered: 'bg-green-600',
    failed: 'bg-red-500',
    cancelled: 'bg-gray-500'
  };

  const currentStatusColor = statusColors[delivery.status] || 'bg-gray-500';

  return (
    <RoleGuard allowedRoles={['medical_staff', 'admin']}>
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
            <span>Back</span>
          </button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Live Tracking</h1>
              <p className="text-gray-400">Order ID: {delivery.orderId}</p>
            </div>

            <div className="flex items-center gap-4">
              <div className={`px-4 py-2 rounded-full ${currentStatusColor} text-white font-medium animate-pulse`}>
                {delivery.status.replace('_', ' ').toUpperCase()}
              </div>
              {['pending', 'approved'].includes(delivery.status) && (
                <button
                  onClick={handleCancelDelivery}
                  className="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg transition-all"
                >
                  Cancel Delivery
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map Section */}
          <div className="lg:col-span-2">
            <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-red-500/20 h-[600px]">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-white">Live Map</h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => setMapView('2d')}
                    className={`px-3 py-1 rounded-lg transition-all ${
                      mapView === '2d' ? 'bg-red-600 text-white' : 'bg-gray-800 text-gray-400'
                    }`}
                  >
                    2D
                  </button>
                  <button
                    onClick={() => setMapView('3d')}
                    className={`px-3 py-1 rounded-lg transition-all ${
                      mapView === '3d' ? 'bg-red-600 text-white' : 'bg-gray-800 text-gray-400'
                    }`}
                  >
                    3D
                  </button>
                </div>
              </div>
              
              <div className="h-[500px] bg-gray-800 rounded-xl flex items-center justify-center">
                {/* Map placeholder - integrate with real map service */}
                <div className="text-center">
                  <DroneIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-500">Map integration coming soon</p>
                  <p className="text-gray-600 text-sm mt-2">
                    Current Location: {delivery.tracking?.realTimeLocation?.coordinates?.join(', ') || 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div className="space-y-6">
            {/* Drone Status */}
            {delivery.droneId && (
              <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-red-500/20">
                <h3 className="text-lg font-semibold text-white mb-4">Drone Status</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <DroneIcon className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-400">Drone ID</span>
                    </div>
                    <span className="text-white font-medium">{delivery.droneId.registrationId}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <BatteryIcon className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-400">Battery</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-700 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all ${
                            delivery.tracking?.battery > 50 ? 'bg-green-500' : 
                            delivery.tracking?.battery > 20 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${delivery.tracking?.battery || 0}%` }}
                        />
                      </div>
                      <span className="text-white font-medium">{delivery.tracking?.battery || 0}%</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <SpeedIcon className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-400">Speed</span>
                    </div>
                    <span className="text-white font-medium">{delivery.tracking?.speed || 0} km/h</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AltitudeIcon className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-400">Altitude</span>
                    </div>
                    <span className="text-white font-medium">{delivery.tracking?.altitude || 0} m</span>
                  </div>
                </div>
              </div>
            )}

            {/* Package Details */}
            <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-red-500/20">
              <h3 className="text-lg font-semibold text-white mb-4">Package Details</h3>
              
              <div className="space-y-3">
                <div>
                  <p className="text-gray-400 text-sm">Type</p>
                  <p className="text-white font-medium capitalize">{delivery.package?.type}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Description</p>
                  <p className="text-white">{delivery.package?.description}</p>
                </div>
                <div className="flex gap-4">
                  <div>
                    <p className="text-gray-400 text-sm">Weight</p>
                    <p className="text-white font-medium">{delivery.package?.weight}g</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Urgency</p>
                    <p className="text-white font-medium capitalize">{delivery.package?.urgency}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-red-500/20">
              <h3 className="text-lg font-semibold text-white mb-4">Delivery Timeline</h3>
              
              <div className="space-y-4">
                {delivery.timeline?.map((event, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-3 h-3 rounded-full ${
                        index === 0 ? 'bg-red-500 animate-pulse' : 'bg-gray-600'
                      }`}></div>
                      {index < delivery.timeline.length - 1 && (
                        <div className="w-0.5 h-16 bg-gray-700"></div>
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <p className="text-white font-medium capitalize">{event.status.replace('_', ' ')}</p>
                      <p className="text-gray-400 text-sm">
                        {new Date(event.timestamp).toLocaleString()}
                      </p>
                      {event.notes && (
                        <p className="text-gray-500 text-sm mt-1">{event.notes}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
    </RoleGuard>  
  );
}
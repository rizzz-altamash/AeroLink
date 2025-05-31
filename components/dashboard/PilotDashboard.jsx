// components/dashboard/PilotDashboard.jsx
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import NotificationBell from '@/components/NotificationBell';
import toast from 'react-hot-toast';

export default function PilotDashboard() {
  const { data: session } = useSession();
  const [assignedDeliveries, setAssignedDeliveries] = useState([]);
  const [currentDrone, setCurrentDrone] = useState(null);
  const [flightStats, setFlightStats] = useState({
    totalFlights: 0,
    flightHours: 0,
    successRate: 0,
    todayFlights: 0
  });
  const [weatherData, setWeatherData] = useState(null);

  useEffect(() => {
    fetchAssignedDeliveries();
    fetchDroneStatus();
    fetchFlightStats();
    fetchWeatherData();
  }, []);

  const fetchAssignedDeliveries = async () => {
    try {
      const res = await fetch('/api/pilot/deliveries');
      const data = await res.json();
      setAssignedDeliveries(data);
    } catch (error) {
      console.error('Failed to fetch deliveries:', error);
    }
  };

  const fetchDroneStatus = async () => {
    try {
      const res = await fetch('/api/pilot/drone-status');
      const data = await res.json();
      setCurrentDrone(data);
    } catch (error) {
      console.error('Failed to fetch drone status:', error);
    }
  };

  const fetchFlightStats = async () => {
    try {
      const res = await fetch('/api/pilot/stats');
      const data = await res.json();
      setFlightStats(data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const fetchWeatherData = async () => {
    try {
      const res = await fetch('/api/weather/current');
      const data = await res.json();
      setWeatherData(data);
    } catch (error) {
      console.error('Failed to fetch weather:', error);
    }
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2 flex justify-between">Pilot Dashboard <NotificationBell /></h1>
        <p className="text-gray-400">Monitor flights and manage drone operations</p>
      </div>

      {/* Drone Status Card */}
      {currentDrone && (
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-6 mb-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-circuit-pattern opacity-10"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">Active Drone</h2>
                <p className="text-green-100">{currentDrone.model} - {currentDrone.registrationId}</p>
              </div>
              <div className="text-right">
                <DroneStatusIndicator status={currentDrone.status} />
              </div>
            </div>
            
            {/* Drone Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <DroneMetric label="Battery" value={`${currentDrone.battery}%`} icon={BatteryIcon} />
              <DroneMetric label="Altitude" value={`${currentDrone.altitude}m`} icon={AltitudeIcon} />
              <DroneMetric label="Speed" value={`${currentDrone.speed}km/h`} icon={SpeedIcon} />
              <DroneMetric label="Signal" value="Strong" icon={SignalIcon} />
            </div>
            
            <div className="flex gap-4">
              <button className="px-6 py-3 bg-white text-green-600 rounded-xl font-semibold hover:bg-green-50 transition-all">
                Pre-flight Check
              </button>
              <button className="px-6 py-3 bg-green-700 text-white rounded-xl font-semibold hover:bg-green-800 transition-all">
                Emergency Protocol
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stats and Weather */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Flight Stats */}
        <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            title="Total Flights"
            value={flightStats.totalFlights}
            icon={FlightIcon}
            color="text-green-400"
            bgColor="bg-green-500/20"
          />
          <StatCard
            title="Flight Hours"
            value={`${flightStats.flightHours}h`}
            icon={ClockIcon}
            color="text-blue-400"
            bgColor="bg-blue-500/20"
          />
          <StatCard
            title="Success Rate"
            value={`${flightStats.successRate}%`}
            icon={SuccessIcon}
            color="text-purple-400"
            bgColor="bg-purple-500/20"
          />
          <StatCard
            title="Today's Flights"
            value={flightStats.todayFlights}
            icon={TodayIcon}
            color="text-orange-400"
            bgColor="bg-orange-500/20"
          />
        </div>

        {/* Weather Widget */}
        <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-green-500/20 hover:border-green-500/30 transition-all">
          <h3 className="text-lg font-semibold text-white mb-4">Weather Conditions</h3>
          {weatherData ? (
            <div className="space-y-3">
              <WeatherItem label="Temperature" value={`${weatherData.temp}°C`} />
              <WeatherItem label="Wind Speed" value={`${weatherData.windSpeed} km/h`} />
              <WeatherItem label="Visibility" value={`${weatherData.visibility} km`} />
              <WeatherItem label="Conditions" value={weatherData.conditions} />
              <div className={`mt-4 p-3 rounded-lg backdrop-blur ${weatherData.flyable ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                {weatherData.flyable ? '✓ Safe to fly' : '✗ Not recommended for flight'}
              </div>
            </div>
          ) : (
            <p className="text-gray-500">Loading weather data...</p>
          )}
        </div>
      </div>

      {/* Assigned Deliveries */}
      <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-green-500/20 hover:border-green-500/30 transition-all mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">Assigned Deliveries</h2>
          <span className="text-sm text-gray-400">{assignedDeliveries.length} active</span>
        </div>
        
        {assignedDeliveries.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No deliveries assigned</p>
          </div>
        ) : (
          <div className="space-y-4">
            {assignedDeliveries.map((delivery) => (
              <AssignedDeliveryCard key={delivery._id} delivery={delivery} />
            ))}
          </div>
        )}
      </div>

      {/* Flight Map */}
      <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-green-500/20 hover:border-green-500/30 transition-all">
        <h2 className="text-xl font-semibold text-white mb-4">Flight Routes</h2>
        <div className="h-96 bg-gray-800/50 backdrop-blur rounded-xl flex items-center justify-center border border-green-500/10">
          <p className="text-gray-500">Flight map visualization</p>
        </div>
      </div>
    </div>
  );
}

// Drone Status Indicator Component
function DroneStatusIndicator({ status }) {
  const statusConfig = {
    available: { color: 'bg-green-400', text: 'Ready', pulse: true },
    in_flight: { color: 'bg-blue-400', text: 'In Flight', pulse: true },
    charging: { color: 'bg-orange-400', text: 'Charging', pulse: false },
    maintenance: { color: 'bg-red-400', text: 'Maintenance', pulse: false }
  };

  const config = statusConfig[status] || statusConfig.available;

  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <div className={`w-3 h-3 ${config.color} rounded-full`}></div>
        {config.pulse && (
          <div className={`absolute inset-0 w-3 h-3 ${config.color} rounded-full animate-ping`}></div>
        )}
      </div>
      <span className="text-white font-medium">{config.text}</span>
    </div>
  );
}

// Drone Metric Component
function DroneMetric({ label, value, icon: Icon }) {
  return (
    <div className="bg-green-800/30 rounded-xl p-3">
      <div className="flex items-center gap-2 mb-1">
        <Icon className="w-4 h-4 text-green-200" />
        <p className="text-green-200 text-xs">{label}</p>
      </div>
      <p className="text-white font-bold text-lg">{value}</p>
    </div>
  );
}

// Stat Card Component
function StatCard({ title, value, icon: Icon, color, bgColor }) {
  return (
    <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-green-500/20 hover:border-green-500/30 transition-all group">
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 ${bgColor} backdrop-blur rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
        <div>
          <p className="text-gray-400 text-sm">{title}</p>
          <p className="text-2xl font-bold text-white">{value}</p>
        </div>
      </div>
    </div>
  );
}

// Weather Item Component
function WeatherItem({ label, value }) {
  return (
    <div className="flex justify-between">
      <span className="text-gray-400">{label}</span>
      <span className="text-white font-medium">{value}</span>
    </div>
  );
}

// Assigned Delivery Card Component
function AssignedDeliveryCard({ delivery }) {

  const [loading, setLoading] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [flightStatus, setFlightStatus] = useState(delivery.status);

  const handleStartFlight = async () => {
    if (!confirm('Are you ready to start the flight?')) return;
    
    setLoading(true);
    try {
      const res = await fetch(`/api/pilot/deliveries/${delivery._id}/start-flight`, {
        method: 'POST'
      });

      if (!res.ok) throw new Error('Failed to start flight');
      
      toast.success('Flight started successfully!');
      setFlightStatus('in_transit');
    } catch (error) {
      toast.error('Failed to start flight');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelFlight = async () => {
    if (cancelReason.trim().length < 5) {
      toast.error('Please provide a detailed reason (minimum 5 characters)');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/pilot/deliveries/${delivery._id}/cancel-flight`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: cancelReason })
      });

      if (!res.ok) throw new Error('Failed to cancel flight');
      
      toast.success('Flight cancelled');
      setFlightStatus('failed');
      setShowCancelModal(false);
    } catch (error) {
      toast.error('Failed to cancel flight');
    } finally {
      setLoading(false);
    }
  };

  const handleDeliveryDone = async () => {
    if (!confirm('Have you delivered the package?')) return;
    
    setLoading(true);
    try {
      const res = await fetch(`/api/pilot/deliveries/${delivery._id}/mark-delivered`, {
        method: 'POST'
      });

      if (!res.ok) throw new Error('Failed to mark delivery as done');
      
      toast.success('Awaiting confirmation from staff');
      setFlightStatus('pending_confirmation');
    } catch (error) {
      toast.error('Failed to mark delivery as done');
    } finally {
      setLoading(false);
    }
  };

  const priorityColors = {
    routine: 'border-gray-500',
    urgent: 'border-orange-500',
    emergency: 'border-red-500'
  };

  const borderColor = priorityColors[delivery.priority] || 'border-gray-500';

  return (
    <>
      <div className={`bg-gray-800/50 backdrop-blur rounded-xl p-5 border-l-4 ${borderColor} hover:bg-gray-800/70 transition-all border-r border-t border-b border-green-500/10`}>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-white font-semibold">{delivery.orderId}</h3>
            <p className="text-gray-400 text-sm">{delivery.packageType}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-400">Priority</p>
            <p className={`text-sm font-medium ${delivery.priority === 'emergency' ? 'text-red-400' : delivery.priority === 'urgent' ? 'text-orange-400' : 'text-gray-300'}`}>
              {delivery.priority}
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-xs text-gray-400 mb-1">Pickup</p>
            <p className="text-sm text-gray-300">{delivery.pickup}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-1">Delivery</p>
            <p className="text-sm text-gray-300">{delivery.delivery}</p>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DistanceIcon className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-300">{delivery.distance} km</span>
          </div>
          
          {/* Action buttons based on flight status */}
          {flightStatus === 'assigned' ? (
            <button 
              onClick={handleStartFlight}
              disabled={loading}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white rounded-lg transition-all text-sm font-medium shadow-lg hover:shadow-green-500/25"
            >
              {loading ? 'Starting...' : 'Start Flight'}
            </button>
          ) : flightStatus === 'in_transit' ? (
            <div className="flex gap-2">
              <button 
                onClick={handleDeliveryDone}
                disabled={loading}
                className="px-3 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:bg-gray-600 text-white rounded-lg transition-all text-sm font-medium"
              >
                {loading ? '...' : 'Delivery Done'}
              </button>
              <button 
                onClick={() => setShowCancelModal(true)}
                disabled={loading}
                className="px-3 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg transition-all text-sm font-medium"
              >
                Cancel Flight
              </button>
            </div>
          ) : flightStatus === 'pending_confirmation' ? (
            <div className="text-sm text-yellow-400">
              Awaiting Confirmation
            </div>
          ) : (
            <div className="text-sm text-gray-500">
              Status: {flightStatus}
            </div>
          )}
        </div>
      </div>

      {/* Cancel Flight Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 rounded-2xl p-6 max-w-md w-full">
            <h2 className="text-xl font-bold text-white mb-4">Cancel Flight</h2>
            <p className="text-gray-400 mb-4">Please provide a detailed reason for cancelling this flight:</p>
            
            <textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-red-500 focus:outline-none h-32 resize-none"
              placeholder="Enter cancellation reason (minimum 10 characters)..."
            />
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleCancelFlight}
                disabled={loading || cancelReason.trim().length < 10}
                className="flex-1 py-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-all"
              >
                {loading ? 'Cancelling...' : 'Cancel Flight'}
              </button>
              <button
                onClick={() => setShowCancelModal(false)}
                disabled={loading}
                className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Icon Components
const BatteryIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-3-3v6m8-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const AltitudeIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
  </svg>
);

const SpeedIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

const SignalIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
  </svg>
);

const FlightIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
  </svg>
);

const ClockIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const SuccessIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const TodayIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const DistanceIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
)
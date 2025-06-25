// // components/dashboard/PilotDashboard.jsx
// 'use client';

// import { useState, useEffect } from 'react';
// import { useSession } from 'next-auth/react';
// import NotificationBell from '@/components/NotificationBell';
// import toast from 'react-hot-toast';
// import { WeatherService } from '@/lib/weather-service';

// export default function PilotDashboard() {
//   const { data: session } = useSession();
//   const [assignedDeliveries, setAssignedDeliveries] = useState([]);
//   const [currentDrone, setCurrentDrone] = useState(null);
//   const [flightStats, setFlightStats] = useState({
//     totalFlights: 0,
//     flightHours: 0,
//     successRate: 0,
//     todayFlights: 0
//   });
//   const [weatherData, setWeatherData] = useState(null);
//   const [weatherLoading, setWeatherLoading] = useState(true);

//   useEffect(() => {
//     fetchAssignedDeliveries();
//     fetchDroneStatus();
//     fetchFlightStats();
//     fetchWeatherData();

//     // Refresh weather every 5 minutes
//     const weatherInterval = setInterval(fetchWeatherData, 5 * 60 * 1000);
    
//     return () => clearInterval(weatherInterval);
//   }, []);

//   const fetchAssignedDeliveries = async () => {
//     try {
//       const res = await fetch('/api/pilot/deliveries');
//       const data = await res.json();
//       setAssignedDeliveries(data);
//     } catch (error) {
//       console.error('Failed to fetch deliveries:', error);
//     }
//   };

//   const fetchDroneStatus = async () => {
//     try {
//       const res = await fetch('/api/pilot/drone-status');
//       const data = await res.json();
//       setCurrentDrone(data);
//     } catch (error) {
//       console.error('Failed to fetch drone status:', error);
//     }
//   };

//   const fetchFlightStats = async () => {
//     try {
//       const res = await fetch('/api/pilot/stats');
//       const data = await res.json();
//       setFlightStats(data);
//     } catch (error) {
//       console.error('Failed to fetch stats:', error);
//     }
//   };

//   // const fetchWeatherData = async () => {
//   //   try {
//   //     const res = await fetch('/api/weather/current');
//   //     const data = await res.json();
//   //     setWeatherData(data);
//   //   } catch (error) {
//   //     console.error('Failed to fetch weather:', error);
//   //   }
//   // };

//   const fetchWeatherData = async () => {
//     try {
//       setWeatherLoading(true);
//       const res = await fetch('/api/weather/current');
//       const data = await res.json();
//       setWeatherData(data);
//     } catch (error) {
//       console.error('Failed to fetch weather:', error);
//     } finally {
//       setWeatherLoading(false);
//     }
//   };

//   return (
//     <div className="p-8">
//       {/* Header */}
//       <div className="mb-8">
//         <h1 className="text-3xl font-bold text-white mb-2 flex justify-between">Pilot Dashboard <NotificationBell /></h1>
//         <p className="text-gray-400">Monitor flights and manage drone operations</p>
//       </div>

//         {/* Flight Stats */}
//         <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
//           <StatCard
//             title="Total Flights"
//             value={flightStats.totalFlights}
//             icon={FlightIcon}
//             color="text-green-400"
//             bgColor="bg-green-500/20"
//           />
//           <StatCard
//             title="Flight Hours"
//             value={`${flightStats.flightHours}h`}
//             icon={ClockIcon}
//             color="text-blue-400"
//             bgColor="bg-blue-500/20"
//           />
//           <StatCard
//             title="Success Rate"
//             value={`${flightStats.successRate}%`}
//             icon={SuccessIcon}
//             color="text-purple-400"
//             bgColor="bg-purple-500/20"
//           />
//           <StatCard
//             title="Today's Flights"
//             value={flightStats.todayFlights}
//             icon={TodayIcon}
//             color="text-orange-400"
//             bgColor="bg-orange-500/20"
//           />
//         </div>

//       {/* Weather Widget */}
//         {/* <div className="bg-gray-900/50 mb-8 backdrop-blur-xl rounded-2xl p-6 border border-green-500/20 hover:border-green-500/30 transition-all">
//           <h3 className="text-lg font-semibold text-white mb-4">Weather Conditions</h3>
//           {weatherData ? (
//             <div className="space-y-3">
//               <WeatherItem label="Temperature" value={`${weatherData.temp}°C`} />
//               <WeatherItem label="Wind Speed" value={`${weatherData.windSpeed} km/h`} />
//               <WeatherItem label="Visibility" value={`${weatherData.visibility} km`} />
//               <WeatherItem label="Conditions" value={weatherData.conditions} />
//               <div className={`mt-4 p-3 rounded-lg backdrop-blur ${weatherData.flyable ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
//                 {weatherData.flyable ? '✓ Safe to fly' : '✗ Not recommended for flight'}
//               </div>
//             </div>
//           ) : (
//             <p className="text-gray-500">Loading weather data...</p>
//           )}
//         </div> */}

//       {/* Assigned Deliveries */}
//       <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-green-500/20 hover:border-green-500/30 transition-all mb-8">
//         <div className="flex items-center justify-between mb-6">
//           <h2 className="text-xl font-semibold text-white">Assigned Deliveries</h2>
//           <span className="text-sm text-gray-400">{assignedDeliveries.length} active</span>
//         </div>
        
//         {assignedDeliveries.length === 0 ? (
//           <div className="text-center py-8">
//             <p className="text-gray-500">No deliveries assigned</p>
//           </div>
//         ) : (
//           <div className="space-y-4">
//             {assignedDeliveries.map((delivery) => (
//               <AssignedDeliveryCard key={delivery._id} delivery={delivery} />
//             ))}
//           </div>
//         )}
//       </div>

//       <div className="mb-8">
//         <EnhancedWeatherWidget weatherData={weatherData} loading={weatherLoading} />
//       </div>

//       {/* Flight Map */}
//       <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-green-500/20 hover:border-green-500/30 transition-all">
//         <h2 className="text-xl font-semibold text-white mb-4">Flight Routes</h2>
//         <div className="h-96 bg-gray-800/50 backdrop-blur rounded-xl flex items-center justify-center border border-green-500/10">
//           <p className="text-gray-500">Flight map visualization</p>
//         </div>
//       </div>
//     </div>
//   );
// }

// function EnhancedWeatherWidget({ weatherData, loading }) {
//   if (loading) {
//     return (
//       <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-green-500/20 hover:border-green-500/30 transition-all">
//         <div className="animate-pulse">
//           <div className="h-6 bg-gray-700 rounded w-40 mb-4"></div>
//           <div className="space-y-3">
//             <div className="h-4 bg-gray-700 rounded w-full"></div>
//             <div className="h-4 bg-gray-700 rounded w-3/4"></div>
//             <div className="h-4 bg-gray-700 rounded w-1/2"></div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (!weatherData) {
//     return (
//       <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-green-500/20">
//         <h3 className="text-lg font-semibold text-white mb-4">Weather Conditions</h3>
//         <p className="text-gray-500">Unable to fetch weather data</p>
//       </div>
//     );
//   }

//   const flightConditionColors = {
//     excellent: 'from-green-500 to-emerald-500',
//     good: 'from-blue-500 to-cyan-500',
//     fair: 'from-yellow-500 to-amber-500',
//     poor: 'from-red-500 to-rose-500'
//   };

//   const conditionBgColors = {
//     excellent: 'bg-green-500/20 border-green-500/30',
//     good: 'bg-blue-500/20 border-blue-500/30',
//     fair: 'bg-yellow-500/20 border-yellow-500/30',
//     poor: 'bg-red-500/20 border-red-500/30'
//   };

//   const conditionTextColors = {
//     excellent: 'text-green-400',
//     good: 'text-blue-400',
//     fair: 'text-yellow-400',
//     poor: 'text-red-400'
//   };

//   return (
//     <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-green-500/20 hover:border-green-500/30 transition-all">
//       {/* Header with Location */}
//       <div className="flex items-center justify-between mb-6">
//         <div>
//           <h3 className="text-lg font-semibold text-white">Weather Conditions</h3>
//           <p className="text-sm text-gray-400 flex items-center gap-1 mt-1">
//             <LocationPinIcon className="w-4 h-4" />
//             {weatherData.city}, {weatherData.pilotLocation?.state || weatherData.country}
//           </p>
//         </div>
//         <div className="text-4xl">{WeatherService.getWeatherIcon(weatherData.icon)}</div>
//       </div>

//       {/* Main Temperature Display */}
//       <div className="flex items-start justify-between mb-6">
//         <div>
//           <div className="flex items-baseline gap-2">
//             <span className="text-5xl font-bold text-white">{weatherData.temp}°</span>
//             <span className="text-2xl text-gray-400">C</span>
//           </div>
//           <p className="text-gray-400 capitalize mt-1">{weatherData.description}</p>
//           <p className="text-sm text-gray-500 mt-1">
//             Feels like {weatherData.feelsLike}°C
//           </p>
//         </div>
        
//         {/* High/Low */}
//         <div className="text-right">
//           <div className="flex items-center gap-2 text-sm">
//             <ArrowUpIcon className="w-4 h-4 text-red-400" />
//             <span className="text-gray-300">{weatherData.tempMax}°</span>
//           </div>
//           <div className="flex items-center gap-2 text-sm mt-1">
//             <ArrowDownIcon className="w-4 h-4 text-blue-400" />
//             <span className="text-gray-300">{weatherData.tempMin}°</span>
//           </div>
//         </div>
//       </div>

//       {/* Weather Details Grid */}
//       <div className="grid grid-cols-2 gap-4 mb-6">
//         <WeatherDetailCard
//           icon={WindIcon}
//           label="Wind"
//           value={`${weatherData.windSpeed} km/h`}
//           subValue={WeatherService.getWindDirectionText(weatherData.windDirection)}
//           iconColor="text-blue-400"
//         />
//         <WeatherDetailCard
//           icon={EyeIcon}
//           label="Visibility"
//           value={`${weatherData.visibility} km`}
//           iconColor="text-purple-400"
//         />
//         <WeatherDetailCard
//           icon={DropletIcon}
//           label="Humidity"
//           value={`${weatherData.humidity}%`}
//           iconColor="text-cyan-400"
//         />
//         <WeatherDetailCard
//           icon={CloudIcon}
//           label="Cloud Cover"
//           value={`${weatherData.clouds}%`}
//           iconColor="text-gray-400"
//         />
//       </div>

//       {/* Sun Times */}
//       <div className="flex items-center justify-between mb-6 p-3 bg-gray-800/30 rounded-lg">
//         <div className="flex items-center gap-2">
//           <SunriseIcon className="w-5 h-5 text-yellow-400" />
//           <div>
//             <p className="text-xs text-gray-400">Sunrise</p>
//             <p className="text-sm text-white">{weatherData.sunrise}</p>
//           </div>
//         </div>
//         <div className="flex items-center gap-2">
//           <SunsetIcon className="w-5 h-5 text-orange-400" />
//           <div>
//             <p className="text-xs text-gray-400">Sunset</p>
//             <p className="text-sm text-white">{weatherData.sunset}</p>
//           </div>
//         </div>
//       </div>

//       {/* Flight Condition Status */}
//       <div className={`mt-4 p-4 rounded-xl border ${conditionBgColors[weatherData.flightConditions.rating]}`}>
//         <div className="flex items-center justify-between">
//           <div className="flex items-center gap-3">
//             {weatherData.flyable ? (
//               <CheckCircleIcon className={`w-6 h-6 ${conditionTextColors[weatherData.flightConditions.rating]}`} />
//             ) : (
//               <XCircleIcon className="w-6 h-6 text-red-400" />
//             )}
//             <div>
//               <p className={`font-semibold ${conditionTextColors[weatherData.flightConditions.rating]}`}>
//                 {weatherData.flightConditions.message}
//               </p>
//               <p className="text-sm text-gray-400 mt-0.5">
//                 {weatherData.flyable ? 'Safe to fly' : 'Not recommended for flight'}
//               </p>
//             </div>
//           </div>
//           <div className={`px-3 py-1 rounded-full bg-gradient-to-r ${flightConditionColors[weatherData.flightConditions.rating]} text-white text-xs font-medium uppercase`}>
//             {weatherData.flightConditions.rating}
//           </div>
//         </div>
//       </div>

//       {/* Last Updated */}
//       <p className="text-xs text-gray-500 text-center mt-4">
//         Updated: {new Date().toLocaleTimeString()}
//       </p>
//     </div>
//   );
// }

// // Weather Detail Card Component
// function WeatherDetailCard({ icon: Icon, label, value, subValue, iconColor }) {
//   return (
//     <div className="bg-gray-800/30 rounded-lg p-3">
//       <div className="flex items-center gap-2 mb-1">
//         <Icon className={`w-4 h-4 ${iconColor}`} />
//         <p className="text-xs text-gray-400">{label}</p>
//       </div>
//       <p className="text-lg font-semibold text-white">{value}</p>
//       {subValue && <p className="text-xs text-gray-500">{subValue}</p>}
//     </div>
//   );
// }

// // Drone Status Indicator Component
// function DroneStatusIndicator({ status }) {
//   const statusConfig = {
//     available: { color: 'bg-green-400', text: 'Ready', pulse: true },
//     in_flight: { color: 'bg-blue-400', text: 'In Flight', pulse: true },
//     charging: { color: 'bg-orange-400', text: 'Charging', pulse: false },
//     maintenance: { color: 'bg-red-400', text: 'Maintenance', pulse: false }
//   };

//   const config = statusConfig[status] || statusConfig.available;

//   return (
//     <div className="flex items-center gap-2">
//       <div className="relative">
//         <div className={`w-3 h-3 ${config.color} rounded-full`}></div>
//         {config.pulse && (
//           <div className={`absolute inset-0 w-3 h-3 ${config.color} rounded-full animate-ping`}></div>
//         )}
//       </div>
//       <span className="text-white font-medium">{config.text}</span>
//     </div>
//   );
// }

// // Drone Metric Component
// function DroneMetric({ label, value, icon: Icon }) {
//   return (
//     <div className="bg-green-800/30 rounded-xl p-3">
//       <div className="flex items-center gap-2 mb-1">
//         <Icon className="w-4 h-4 text-green-200" />
//         <p className="text-green-200 text-xs">{label}</p>
//       </div>
//       <p className="text-white font-bold text-lg">{value}</p>
//     </div>
//   );
// }

// // Stat Card Component
// function StatCard({ title, value, icon: Icon, color, bgColor }) {
//   return (
//     <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-green-500/20 hover:border-green-500/30 transition-all group">
//       <div className="flex items-center gap-4">
//         <div className={`w-12 h-12 ${bgColor} backdrop-blur rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
//           <Icon className={`w-6 h-6 ${color}`} />
//         </div>
//         <div>
//           <p className="text-gray-400 text-sm">{title}</p>
//           <p className="text-2xl font-bold text-white">{value}</p>
//         </div>
//       </div>
//     </div>
//   );
// }

// // Weather Item Component
// function WeatherItem({ label, value }) {
//   return (
//     <div className="flex justify-between">
//       <span className="text-gray-400">{label}</span>
//       <span className="text-white font-medium">{value}</span>
//     </div>
//   );
// }

// // Assigned Delivery Card Component
// function AssignedDeliveryCard({ delivery }) {

//   const [loading, setLoading] = useState(false);
//   const [showCancelModal, setShowCancelModal] = useState(false);
//   const [cancelReason, setCancelReason] = useState('');
//   const [flightStatus, setFlightStatus] = useState(delivery.status);

//   const handleStartFlight = async () => {
//     if (!confirm('Are you ready to start the flight?')) return;
    
//     setLoading(true);
//     try {
//       const res = await fetch(`/api/pilot/deliveries/${delivery._id}/start-flight`, {
//         method: 'POST'
//       });

//       if (!res.ok) throw new Error('Failed to start flight');
      
//       toast.success('Flight started successfully!');
//       setFlightStatus('in_transit');
//     } catch (error) {
//       toast.error('Failed to start flight');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCancelFlight = async () => {
//     if (cancelReason.trim().length < 5) {
//       toast.error('Please provide a detailed reason (minimum 5 characters)');
//       return;
//     }

//     setLoading(true);
//     try {
//       const res = await fetch(`/api/pilot/deliveries/${delivery._id}/cancel-flight`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ reason: cancelReason })
//       });

//       if (!res.ok) throw new Error('Failed to cancel flight');
      
//       toast.success('Flight cancelled');
//       setFlightStatus('failed');
//       setShowCancelModal(false);
//     } catch (error) {
//       toast.error('Failed to cancel flight');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDeliveryDone = async () => {
//     if (!confirm('Have you delivered the package?')) return;
    
//     setLoading(true);
//     try {
//       const res = await fetch(`/api/pilot/deliveries/${delivery._id}/mark-delivered`, {
//         method: 'POST'
//       });

//       if (!res.ok) throw new Error('Failed to mark delivery as done');
      
//       toast.success('Awaiting confirmation from staff');
//       setFlightStatus('pending_confirmation');
//     } catch (error) {
//       toast.error('Failed to mark delivery as done');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const priorityColors = {
//     routine: 'border-gray-500',
//     urgent: 'border-orange-500',
//     emergency: 'border-red-500'
//   };

//   const borderColor = priorityColors[delivery.priority] || 'border-gray-500';

//   return (
//     <>
//       <div className={`bg-gray-800/50 backdrop-blur rounded-xl p-5 border-l-4 ${borderColor} hover:bg-gray-800/70 transition-all border-r border-t border-b border-green-500/10`}>
//         <div className="flex items-center justify-between mb-3">
//           <div>
//             <h3 className="text-white font-semibold">{delivery.orderId}</h3>
//             <p className="text-gray-400 text-sm">{delivery.packageType}</p>
//           </div>
//           <div className="text-right">
//             <p className="text-sm text-gray-400">Priority</p>
//             <p className={`text-sm font-medium ${delivery.priority === 'emergency' ? 'text-red-400' : delivery.priority === 'urgent' ? 'text-orange-400' : 'text-gray-300'}`}>
//               {delivery.priority}
//             </p>
//           </div>
//         </div>
        
//         <div className="grid grid-cols-2 gap-4 mb-4">
//           <div>
//             <p className="text-xs text-gray-400 mb-1">Pickup</p>
//             <p className="text-sm text-gray-300">{delivery.pickup}</p>
//           </div>
//           <div>
//             <p className="text-xs text-gray-400 mb-1">Delivery</p>
//             <p className="text-sm text-gray-300">{delivery.delivery}</p>
//           </div>
//         </div>
        
//         <div className="flex items-center justify-between">
//           <div className="flex items-center gap-2">
//             <DistanceIcon className="w-4 h-4 text-gray-400" />
//             <span className="text-sm text-gray-300">{delivery.distance} km</span>
//           </div>
          
//           {/* Action buttons based on flight status */}
//           {flightStatus === 'assigned' ? (
//             <button 
//               onClick={handleStartFlight}
//               disabled={loading}
//               className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white rounded-lg transition-all text-sm font-medium shadow-lg hover:shadow-green-500/25"
//             >
//               {loading ? 'Starting...' : 'Start Flight'}
//             </button>
//           ) : flightStatus === 'in_transit' ? (
//             <div className="flex gap-2">
//               <button 
//                 onClick={handleDeliveryDone}
//                 disabled={loading}
//                 className="px-3 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:bg-gray-600 text-white rounded-lg transition-all text-sm font-medium"
//               >
//                 {loading ? '...' : 'Delivery Done'}
//               </button>
//               <button 
//                 onClick={() => setShowCancelModal(true)}
//                 disabled={loading}
//                 className="px-3 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg transition-all text-sm font-medium"
//               >
//                 Cancel Flight
//               </button>
//             </div>
//           ) : flightStatus === 'pending_confirmation' ? (
//             <div className="text-sm text-yellow-400">
//               Awaiting Confirmation
//             </div>
//           ) : (
//             <div className="text-sm text-gray-500">
//               Status: {flightStatus}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Cancel Flight Modal */}
//       {showCancelModal && (
//         <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
//           <div className="bg-gray-900 rounded-2xl p-6 max-w-md w-full">
//             <h2 className="text-xl font-bold text-white mb-4">Cancel Flight</h2>
//             <p className="text-gray-400 mb-4">Please provide a detailed reason for cancelling this flight:</p>
            
//             <textarea
//               value={cancelReason}
//               onChange={(e) => setCancelReason(e.target.value)}
//               className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-red-500 focus:outline-none h-32 resize-none"
//               placeholder="Enter cancellation reason (minimum 10 characters)..."
//             />
            
//             <div className="flex gap-3 mt-6">
//               <button
//                 onClick={handleCancelFlight}
//                 disabled={loading || cancelReason.trim().length < 10}
//                 className="flex-1 py-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-all"
//               >
//                 {loading ? 'Cancelling...' : 'Cancel Flight'}
//               </button>
//               <button
//                 onClick={() => setShowCancelModal(false)}
//                 disabled={loading}
//                 className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold transition-all"
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }

// // Icon Components
// const BatteryIcon = ({ className }) => (
//   <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-3-3v6m8-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//   </svg>
// );

// const AltitudeIcon = ({ className }) => (
//   <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
//   </svg>
// );

// const SpeedIcon = ({ className }) => (
//   <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
//   </svg>
// );

// const SignalIcon = ({ className }) => (
//   <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
//   </svg>
// );

// const FlightIcon = ({ className }) => (
//   <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
//   </svg>
// );

// const ClockIcon = ({ className }) => (
//   <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//   </svg>
// );

// const SuccessIcon = ({ className }) => (
//   <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//   </svg>
// );

// const TodayIcon = ({ className }) => (
//   <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
//   </svg>
// );

// const DistanceIcon = ({ className }) => (
//   <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
//   </svg>
// );

// // Additional Icon Components
// const LocationPinIcon = ({ className }) => (
//   <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
//   </svg>
// );

// const WindIcon = ({ className }) => (
//   <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.59 4.59A2 2 0 1111 8H2m10.59 11.41A2 2 0 1014 16H2m15.73-8.27A2.5 2.5 0 1119.5 12H2" />
//   </svg>
// );

// const EyeIcon = ({ className }) => (
//   <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
//   </svg>
// );

// const DropletIcon = ({ className }) => (
//   <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-2.21 0-4 1.79-4 4 0 2.21 1.79 4 4 4s4-1.79 4-4c0-2.21-1.79-4-4-4z" />
//   </svg>
// );

// const CloudIcon = ({ className }) => (
//   <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
//   </svg>
// );

// const SunriseIcon = ({ className }) => (
//   <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
//   </svg>
// );

// const SunsetIcon = ({ className }) => (
//   <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707" />
//   </svg>
// );

// const ArrowUpIcon = ({ className }) => (
//   <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
//   </svg>
// );

// const ArrowDownIcon = ({ className }) => (
//   <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
//   </svg>
// );

// const CheckCircleIcon = ({ className }) => (
//   <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//   </svg>
// );

// const XCircleIcon = ({ className }) => (
//   <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
//   </svg>
// );

















// Responsive 
// components/dashboard/PilotDashboard.jsx
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import NotificationBell from '@/components/NotificationBell';
import toast from 'react-hot-toast';
import { WeatherService } from '@/lib/weather-service';

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
  const [weatherLoading, setWeatherLoading] = useState(true);

  useEffect(() => {
    fetchAssignedDeliveries();
    fetchDroneStatus();
    fetchFlightStats();
    fetchWeatherData();

    // Refresh weather every 5 minutes
    const weatherInterval = setInterval(fetchWeatherData, 5 * 60 * 1000);
    
    return () => clearInterval(weatherInterval);
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
      setWeatherLoading(true);
      const res = await fetch('/api/weather/current');
      const data = await res.json();
      setWeatherData(data);
    } catch (error) {
      console.error('Failed to fetch weather:', error);
    } finally {
      setWeatherLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2 flex justify-between items-center">
          <span className="truncate mr-2">Pilot Dashboard</span>
          <NotificationBell />
        </h1>
        <p className="text-gray-400 text-sm sm:text-base">Monitor flights and manage drone operations</p>
      </div>

      {/* Flight Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
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

      {/* Assigned Deliveries */}
      <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-green-500/20 hover:border-green-500/30 transition-all mb-6 sm:mb-8">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-semibold text-white">Assigned Deliveries</h2>
          <span className="text-xs sm:text-sm text-gray-400">{assignedDeliveries.length} active</span>
        </div>
        
        {assignedDeliveries.length === 0 ? (
          <div className="text-center py-6 sm:py-8">
            <p className="text-gray-500 text-sm sm:text-base">No deliveries assigned</p>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {assignedDeliveries.map((delivery) => (
              <AssignedDeliveryCard key={delivery._id} delivery={delivery} />
            ))}
          </div>
        )}
      </div>

      <div className="mb-6 sm:mb-8">
        <EnhancedWeatherWidget weatherData={weatherData} loading={weatherLoading} />
      </div>

      {/* Flight Map */}
      <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-green-500/20 hover:border-green-500/30 transition-all">
        <h2 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4">Flight Routes</h2>
        <div className="h-64 sm:h-80 lg:h-96 bg-gray-800/50 backdrop-blur rounded-lg sm:rounded-xl flex items-center justify-center border border-green-500/10">
          <p className="text-gray-500 text-sm sm:text-base">Flight map visualization</p>
        </div>
      </div>
    </div>
  );
}

function EnhancedWeatherWidget({ weatherData, loading }) {
  if (loading) {
    return (
      <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-green-500/20 hover:border-green-500/30 transition-all">
        <div className="animate-pulse">
          <div className="h-5 sm:h-6 bg-gray-700 rounded w-32 sm:w-40 mb-3 sm:mb-4"></div>
          <div className="space-y-2 sm:space-y-3">
            <div className="h-3 sm:h-4 bg-gray-700 rounded w-full"></div>
            <div className="h-3 sm:h-4 bg-gray-700 rounded w-3/4"></div>
            <div className="h-3 sm:h-4 bg-gray-700 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!weatherData) {
    return (
      <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-green-500/20">
        <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">Weather Conditions</h3>
        <p className="text-gray-500 text-sm sm:text-base">Unable to fetch weather data</p>
      </div>
    );
  }

  const flightConditionColors = {
    excellent: 'from-green-500 to-emerald-500',
    good: 'from-blue-500 to-cyan-500',
    fair: 'from-yellow-500 to-amber-500',
    poor: 'from-red-500 to-rose-500'
  };

  const conditionBgColors = {
    excellent: 'bg-green-500/20 border-green-500/30',
    good: 'bg-blue-500/20 border-blue-500/30',
    fair: 'bg-yellow-500/20 border-yellow-500/30',
    poor: 'bg-red-500/20 border-red-500/30'
  };

  const conditionTextColors = {
    excellent: 'text-green-400',
    good: 'text-blue-400',
    fair: 'text-yellow-400',
    poor: 'text-red-400'
  };

  return (
    <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-green-500/20 hover:border-green-500/30 transition-all">
      {/* Header with Location */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mb-4 sm:mb-6">
        <div>
          <h3 className="text-base sm:text-lg font-semibold text-white">Weather Conditions</h3>
          <p className="text-xs sm:text-sm text-gray-400 flex items-center gap-1 mt-0.5 sm:mt-1">
            <LocationPinIcon className="w-3 h-3 sm:w-4 sm:h-4" />
            {weatherData.city}, {weatherData.pilotLocation?.state || weatherData.country}
          </p>
        </div>
        <div className="text-3xl sm:text-4xl">{WeatherService.getWeatherIcon(weatherData.icon)}</div>
      </div>

      {/* Main Temperature Display */}
      <div className="flex items-start justify-between mb-4 sm:mb-6">
        <div>
          <div className="flex items-baseline gap-1 sm:gap-2">
            <span className="text-4xl sm:text-5xl font-bold text-white">{weatherData.temp}°</span>
            <span className="text-xl sm:text-2xl text-gray-400">C</span>
          </div>
          <p className="text-gray-400 capitalize mt-0.5 sm:mt-1 text-sm sm:text-base">{weatherData.description}</p>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1">
            Feels like {weatherData.feelsLike}°C
          </p>
        </div>
        
        {/* High/Low */}
        <div className="text-right">
          <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
            <ArrowUpIcon className="w-3 h-3 sm:w-4 sm:h-4 text-red-400" />
            <span className="text-gray-300">{weatherData.tempMax}°</span>
          </div>
          <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm mt-0.5 sm:mt-1">
            <ArrowDownIcon className="w-3 h-3 sm:w-4 sm:h-4 text-blue-400" />
            <span className="text-gray-300">{weatherData.tempMin}°</span>
          </div>
        </div>
      </div>

      {/* Weather Details Grid */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
        <WeatherDetailCard
          icon={WindIcon}
          label="Wind"
          value={`${weatherData.windSpeed} km/h`}
          subValue={WeatherService.getWindDirectionText(weatherData.windDirection)}
          iconColor="text-blue-400"
        />
        <WeatherDetailCard
          icon={EyeIcon}
          label="Visibility"
          value={`${weatherData.visibility} km`}
          iconColor="text-purple-400"
        />
        <WeatherDetailCard
          icon={DropletIcon}
          label="Humidity"
          value={`${weatherData.humidity}%`}
          iconColor="text-cyan-400"
        />
        <WeatherDetailCard
          icon={CloudIcon}
          label="Cloud Cover"
          value={`${weatherData.clouds}%`}
          iconColor="text-gray-400"
        />
      </div>

      {/* Sun Times */}
      <div className="flex items-center justify-between mb-4 sm:mb-6 p-2 sm:p-3 bg-gray-800/30 rounded-lg">
        <div className="flex items-center gap-1 sm:gap-2">
          <SunriseIcon className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
          <div>
            <p className="text-xs text-gray-400">Sunrise</p>
            <p className="text-xs sm:text-sm text-white">{weatherData.sunrise}</p>
          </div>
        </div>
        <div className="flex items-center gap-1 sm:gap-2">
          <SunsetIcon className="w-4 h-4 sm:w-5 sm:h-5 text-orange-400" />
          <div>
            <p className="text-xs text-gray-400">Sunset</p>
            <p className="text-xs sm:text-sm text-white">{weatherData.sunset}</p>
          </div>
        </div>
      </div>

      {/* Flight Condition Status */}
      <div className={`mt-3 sm:mt-4 p-3 sm:p-4 rounded-lg sm:rounded-xl border ${conditionBgColors[weatherData.flightConditions.rating]}`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
          <div className="flex items-center gap-2 sm:gap-3">
            {weatherData.flyable ? (
              <CheckCircleIcon className={`w-5 h-5 sm:w-6 sm:h-6 ${conditionTextColors[weatherData.flightConditions.rating]}`} />
            ) : (
              <XCircleIcon className="w-5 h-5 sm:w-6 sm:h-6 text-red-400" />
            )}
            <div>
              <p className={`font-semibold text-sm sm:text-base ${conditionTextColors[weatherData.flightConditions.rating]}`}>
                {weatherData.flightConditions.message}
              </p>
              <p className="text-xs sm:text-sm text-gray-400 mt-0.5">
                {weatherData.flyable ? 'Safe to fly' : 'Not recommended for flight'}
              </p>
            </div>
          </div>
          <div className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full bg-gradient-to-r ${flightConditionColors[weatherData.flightConditions.rating]} text-white text-xs font-medium uppercase`}>
            {weatherData.flightConditions.rating}
          </div>
        </div>
      </div>

      {/* Last Updated */}
      <p className="text-xs text-gray-500 text-center mt-3 sm:mt-4">
        Updated: {new Date().toLocaleTimeString()}
      </p>
    </div>
  );
}

// Weather Detail Card Component
function WeatherDetailCard({ icon: Icon, label, value, subValue, iconColor }) {
  return (
    <div className="bg-gray-800/30 rounded-lg p-2 sm:p-3">
      <div className="flex items-center gap-1 sm:gap-2 mb-0.5 sm:mb-1">
        <Icon className={`w-3 h-3 sm:w-4 sm:h-4 ${iconColor}`} />
        <p className="text-xs text-gray-400">{label}</p>
      </div>
      <p className="text-base sm:text-lg font-semibold text-white">{value}</p>
      {subValue && <p className="text-xs text-gray-500">{subValue}</p>}
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
    <div className="flex items-center gap-1 sm:gap-2">
      <div className="relative">
        <div className={`w-2 h-2 sm:w-3 sm:h-3 ${config.color} rounded-full`}></div>
        {config.pulse && (
          <div className={`absolute inset-0 w-2 h-2 sm:w-3 sm:h-3 ${config.color} rounded-full animate-ping`}></div>
        )}
      </div>
      <span className="text-white font-medium text-sm sm:text-base">{config.text}</span>
    </div>
  );
}

// Drone Metric Component
function DroneMetric({ label, value, icon: Icon }) {
  return (
    <div className="bg-green-800/30 rounded-lg sm:rounded-xl p-2 sm:p-3">
      <div className="flex items-center gap-1 sm:gap-2 mb-0.5 sm:mb-1">
        <Icon className="w-3 h-3 sm:w-4 sm:h-4 text-green-200" />
        <p className="text-green-200 text-xs">{label}</p>
      </div>
      <p className="text-white font-bold text-base sm:text-lg">{value}</p>
    </div>
  );
}

// Stat Card Component
function StatCard({ title, value, icon: Icon, color, bgColor }) {
  return (
    <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 border border-green-500/20 hover:border-green-500/30 transition-all group">
      <div className="flex items-center gap-3 sm:gap-4">
        <div className={`w-10 h-10 sm:w-12 sm:h-12 ${bgColor} backdrop-blur rounded-lg sm:rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
          <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${color}`} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-gray-400 text-xs sm:text-sm truncate">{title}</p>
          <p className="text-xl sm:text-2xl font-bold text-white">{value}</p>
        </div>
      </div>
    </div>
  );
}

// Weather Item Component
function WeatherItem({ label, value }) {
  return (
    <div className="flex justify-between">
      <span className="text-gray-400 text-sm sm:text-base">{label}</span>
      <span className="text-white font-medium text-sm sm:text-base">{value}</span>
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
      <div className={`bg-gray-800/50 backdrop-blur rounded-lg sm:rounded-xl p-4 sm:p-5 border-l-4 ${borderColor} hover:bg-gray-800/70 transition-all border-r border-t border-b border-green-500/10`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 mb-2 sm:mb-3">
          <div className="min-w-0 flex-1">
            <h3 className="text-white font-semibold text-sm sm:text-base">{delivery.orderId}</h3>
            <p className="text-gray-400 text-xs sm:text-sm">{delivery.packageType}</p>
          </div>
          <div className="text-right">
            <p className="text-xs sm:text-sm text-gray-400">Priority</p>
            <p className={`text-xs sm:text-sm font-medium ${delivery.priority === 'emergency' ? 'text-red-400' : delivery.priority === 'urgent' ? 'text-orange-400' : 'text-gray-300'}`}>
              {delivery.priority}
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4">
          <div>
            <p className="text-xs text-gray-400 mb-0.5 sm:mb-1">Pickup</p>
            <p className="text-xs sm:text-sm text-gray-300">{delivery.pickup}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-0.5 sm:mb-1">Delivery</p>
            <p className="text-xs sm:text-sm text-gray-300">{delivery.delivery}</p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
          <div className="flex items-center gap-1 sm:gap-2">
            <DistanceIcon className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
            <span className="text-xs sm:text-sm text-gray-300">{delivery.distance} km</span>
          </div>
          
          {/* Action buttons based on flight status */}
          {flightStatus === 'assigned' ? (
            <button 
              onClick={handleStartFlight}
              disabled={loading}
              className="w-full sm:w-auto px-3 sm:px-4 py-1.5 sm:py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white rounded-lg transition-all text-xs sm:text-sm font-medium shadow-lg hover:shadow-green-500/25"
            >
              {loading ? 'Starting...' : 'Start Flight'}
            </button>
          ) : flightStatus === 'in_transit' ? (
            <div className="flex gap-2 w-full sm:w-auto">
              <button 
                onClick={handleDeliveryDone}
                disabled={loading}
                className="flex-1 sm:flex-initial px-2 sm:px-3 py-1.5 sm:py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:bg-gray-600 text-white rounded-lg transition-all text-xs sm:text-sm font-medium"
              >
                {loading ? '...' : 'Delivery Done'}
              </button>
              <button 
                onClick={() => setShowCancelModal(true)}
                disabled={loading}
                className="px-2 sm:px-3 py-1.5 sm:py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg transition-all text-xs sm:text-sm font-medium"
              >
                Cancel
              </button>
            </div>
          ) : flightStatus === 'pending_confirmation' ? (
            <div className="text-xs sm:text-sm text-yellow-400">
              Awaiting Confirmation
            </div>
          ) : (
            <div className="text-xs sm:text-sm text-gray-500">
              Status: {flightStatus}
            </div>
          )}
        </div>
      </div>

      {/* Cancel Flight Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 rounded-xl sm:rounded-2xl p-4 sm:p-6 max-w-md w-full">
            <h2 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">Cancel Flight</h2>
            <p className="text-gray-400 mb-3 sm:mb-4 text-sm sm:text-base">Please provide a detailed reason for cancelling this flight:</p>
            
            <textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              className="w-full bg-gray-800 text-white rounded-lg px-3 sm:px-4 py-2 sm:py-3 focus:ring-2 focus:ring-red-500 focus:outline-none h-24 sm:h-32 resize-none text-sm sm:text-base"
              placeholder="Enter cancellation reason (minimum 10 characters)..."
            />
            
            <div className="flex gap-2 sm:gap-3 mt-4 sm:mt-6">
              <button
                onClick={handleCancelFlight}
                disabled={loading || cancelReason.trim().length < 10}
                className="flex-1 py-2 sm:py-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-all text-sm sm:text-base"
              >
                {loading ? 'Cancelling...' : 'Cancel Flight'}
              </button>
              <button
                onClick={() => setShowCancelModal(false)}
                disabled={loading}
                className="px-4 sm:px-6 py-2 sm:py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold transition-all text-sm sm:text-base"
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
);

const LocationPinIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const WindIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.59 4.59A2 2 0 1111 8H2m10.59 11.41A2 2 0 1014 16H2m15.73-8.27A2.5 2.5 0 1119.5 12H2" />
  </svg>
);

const EyeIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const DropletIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-2.21 0-4 1.79-4 4 0 2.21 1.79 4 4 4s4-1.79 4-4c0-2.21-1.79-4-4-4z" />
  </svg>
);

const CloudIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
  </svg>
);

const SunriseIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const SunsetIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707" />
  </svg>
);

const ArrowUpIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
  </svg>
);

const ArrowDownIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
  </svg>
);

const CheckCircleIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const XCircleIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);
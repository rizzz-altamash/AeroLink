// // components/dashboard/RevenueOverview.jsx
// 'use client';

// import { useState, useEffect } from 'react';
// import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart, ComposedChart } from 'recharts';
// import toast from 'react-hot-toast';

// // Icon Components
// const ChartLineIcon = ({ className }) => (
//   <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
//   </svg>
// );

// const ChartBarIcon = ({ className }) => (
//   <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
//   </svg>
// );

// const ChartPieIcon = ({ className }) => (
//   <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
//   </svg>
// );

// const DownloadIcon = ({ className }) => (
//   <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
//   </svg>
// );

// const TrendingUpIcon = ({ className }) => (
//   <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
//   </svg>
// );

// const TrendingDownIcon = ({ className }) => (
//   <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
//   </svg>
// );

// export default function RevenueOverview() {
//   const [chartType, setChartType] = useState('line'); // line, mixed, donut
//   const [timeRange, setTimeRange] = useState('week'); // today, week, month, year
//   const [loading, setLoading] = useState(true);
//   const [revenueData, setRevenueData] = useState({
//     chartData: [],
//     metrics: {
//       total: 0,
//       average: 0,
//       growth: 0,
//       todayRevenue: 0,
//       weekRevenue: 0,
//       monthRevenue: 0
//     },
//     urgencyBreakdown: [],
//     hospitalRevenue: [],
//     deliveryTypeSplit: {},
//     peakHours: [],
//     distanceRevenue: [],
//     forecast: {}
//   });

//   useEffect(() => {
//     fetchRevenueData();
//   }, [timeRange]);

//   const fetchRevenueData = async () => {
//     setLoading(true);
//     try {
//       const res = await fetch(`/api/admin/revenue/overview?timeRange=${timeRange}`);
//       if (!res.ok) throw new Error('Failed to fetch revenue data');
//       const data = await res.json();
//       setRevenueData(data);
//     } catch (error) {
//       console.error('Error fetching revenue:', error);
//       toast.error('Failed to load revenue data');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const exportData = async (format) => {
//     try {
//       const res = await fetch(`/api/admin/revenue/export?format=${format}&timeRange=${timeRange}`);
//       if (!res.ok) throw new Error('Failed to export');
      
//       const blob = await res.blob();
//       const url = URL.createObjectURL(blob);
//       const a = document.createElement('a');
//       a.href = url;
//       a.download = `revenue-report-${timeRange}-${new Date().toISOString().split('T')[0]}.${format}`;
//       a.click();
//       toast.success(`Revenue report exported as ${format.toUpperCase()}`);
//     } catch (error) {
//       toast.error('Failed to export revenue data');
//     }
//   };

//   // Chart colors
//   const COLORS = {
//     primary: '#a855f7',
//     secondary: '#8b5cf6',
//     accent: '#7c3aed',
//     emergency: '#ef4444',
//     urgent: '#f97316',
//     routine: '#6b7280',
//     positive: '#10b981',
//     negative: '#ef4444'
//   };

//   // Custom tooltip
//   const CustomTooltip = ({ active, payload, label }) => {
//     if (active && payload && payload.length) {
//       return (
//         <div className="bg-gray-900/95 backdrop-blur-xl p-3 rounded-lg border border-purple-500/30">
//           <p className="text-white font-medium">{label}</p>
//           {payload.map((entry, index) => (
//             <p key={index} className="text-sm" style={{ color: entry.color }}>
//               {entry.name}: ${entry.value.toFixed(2)}
//             </p>
//           ))}
//         </div>
//       );
//     }
//     return null;
//   };

//   // Line Chart Component
//   const LineChartView = () => (
//     <ResponsiveContainer width="100%" height={300}>
//       <LineChart data={revenueData.chartData}>
//         <defs>
//           <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
//             <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.8}/>
//             <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0.1}/>
//           </linearGradient>
//         </defs>
//         <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
//         <XAxis dataKey="date" stroke="#9ca3af" />
//         <YAxis stroke="#9ca3af" />
//         <Tooltip content={<CustomTooltip />} />
//         <Area type="monotone" dataKey="revenue" stroke={COLORS.primary} fillOpacity={1} fill="url(#colorRevenue)" />
//         <Line type="monotone" dataKey="revenue" stroke={COLORS.primary} strokeWidth={3} dot={{ fill: COLORS.primary, r: 4 }} />
//         {revenueData.forecast.data && (
//           <Line type="monotone" dataKey="forecast" stroke={COLORS.secondary} strokeWidth={2} strokeDasharray="5 5" />
//         )}
//       </LineChart>
//     </ResponsiveContainer>
//   );

//   // Mixed Chart Component
//   const MixedChartView = () => (
//     <ResponsiveContainer width="100%" height={300}>
//       <ComposedChart data={revenueData.chartData}>
//         <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
//         <XAxis dataKey="date" stroke="#9ca3af" />
//         <YAxis yAxisId="left" stroke="#9ca3af" />
//         <YAxis yAxisId="right" orientation="right" stroke="#9ca3af" />
//         <Tooltip content={<CustomTooltip />} />
//         <Legend />
//         <Bar yAxisId="left" dataKey="emergency" stackId="a" fill={COLORS.emergency} />
//         <Bar yAxisId="left" dataKey="urgent" stackId="a" fill={COLORS.urgent} />
//         <Bar yAxisId="left" dataKey="routine" stackId="a" fill={COLORS.routine} />
//         <Line yAxisId="right" type="monotone" dataKey="cumulative" stroke={COLORS.primary} strokeWidth={3} />
//       </ComposedChart>
//     </ResponsiveContainer>
//   );

//   // Donut Chart Component
//   const DonutChartView = () => (
//   <div className="flex items-center justify-between gap-6">
//     {/* Pie Chart without labels - Clean look */}
//     <div className="flex-1 max-w-sm">
//       <ResponsiveContainer width="100%" height={300}>
//         <PieChart>
//           <Pie
//             data={revenueData.urgencyBreakdown}
//             cx="50%"
//             cy="50%"
//             labelLine={false}
//             label={false} // Labels removed for clean look
//             outerRadius={90}
//             fill="#8884d8"
//             dataKey="value"
//             animationBegin={0}
//             animationDuration={800}
//           >
//             {revenueData.urgencyBreakdown.map((entry, index) => (
//               <Cell 
//                 key={`cell-${index}`} 
//                 fill={entry.color}
//                 // style={{ cursor: 'pointer' }}
//               />
//             ))}
//           </Pie>
//           <Tooltip 
//             contentStyle={{
//               backgroundColor: 'rgba(255, 255, 255, 0.95)',
//               borderRadius: '8px',
//               padding: '8px 12px'
//             }}
//             formatter={(value) => [`$${value.toFixed(2)}`, 'Revenue']}
//           />
//         </PieChart>
//       </ResponsiveContainer>
//     </div>
    
//     {/* Enhanced Stats Panel with Legend */}
//     <div className="flex-1 max-w-xs">
//       <div className="bg-gray-800/30 rounded-xl p-4">
//         <div className="text-center mb-4">
//           <p className="text-gray-400 text-sm">Total Revenue</p>
//           <p className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
//             ${revenueData.metrics.total.toFixed(2)}
//           </p>
//         </div>
        
//         {/* Legend Items */}
//         <div className="space-y-2">
//           {revenueData.urgencyBreakdown.map((item, index) => (
//             <div 
//               key={index} 
//               className="flex items-center justify-between p-2 rounded hover:bg-gray-700/30 transition-colors cursor-pointer"
//             >
//               <div className="flex items-center gap-2 flex-1 min-w-0">
//                 <div 
//                   className="w-3 h-3 rounded-full flex-shrink-0 shadow-sm" 
//                   style={{ backgroundColor: item.color }}
//                 />
//                 <span className="text-gray-300 text-sm truncate">{item.name}</span>
//               </div>
//               <div className="text-right ml-2 flex-shrink-0">
//                 <span className="text-white font-medium">${item.value.toFixed(2)}</span>
//                 <span className="text-gray-400 text-xs ml-1">
//                   ({((item.value / revenueData.metrics.total) * 100).toFixed(1)}%)
//                 </span>
//               </div>
//             </div>
//           ))}
//         </div>
        
//         {/* Additional Metrics */}
//         <div className="mt-4 pt-3 border-t border-gray-700">
//           <div className="flex items-center justify-evenly text-sm">
//             <span className="text-gray-400">Average</span>
//             <span className="text-white font-medium">
//               ${(revenueData.metrics.total / revenueData.urgencyBreakdown.length).toFixed(2)}
//             </span>
//           </div>
//         </div>
//       </div>
//     </div>
//   </div>
// );

//   if (loading) {
//     return (
//       <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/20 h-[600px] flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
//           <p className="text-gray-400 mt-4">Loading revenue data...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/20 hover:border-purple-500/30 transition-all">
//       {/* Header */}
//       <div className="flex items-center justify-between mb-6">
//         <h2 className="text-xl font-semibold text-white">Revenue Overview</h2>
//         <div className="flex items-center gap-4">
//           {/* Time Range Selector */}
//           <div className="flex items-center gap-2 bg-gray-800/50 rounded-lg p-1">
//             {['today', 'week', 'month', 'year'].map((range) => (
//               <button
//                 key={range}
//                 onClick={() => setTimeRange(range)}
//                 className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
//                   timeRange === range
//                     ? 'bg-purple-600 text-white'
//                     : 'text-gray-400 hover:text-white'
//                 }`}
//               >
//                 {range.charAt(0).toUpperCase() + range.slice(1)}
//               </button>
//             ))}
//           </div>

//           {/* Export Options */}
//           <div className="relative group">
//             <button className="p-2 bg-gray-800/50 rounded-lg hover:bg-gray-700/50 transition-all">
//               <DownloadIcon className="w-4 h-4 text-gray-400" />
//             </button>
//             <div className="absolute right-0 mt-2 w-32 bg-gray-800 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-all pointer-events-none group-hover:pointer-events-auto">
//               <button
//                 onClick={() => exportData('csv')}
//                 className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-gray-700 rounded-t-lg"
//               >
//                 Export CSV
//               </button>
//               <button
//                 onClick={() => exportData('pdf')}
//                 className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-gray-700 rounded-b-lg"
//               >
//                 Export PDF
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Metrics Cards */}
//       <div className="grid grid-cols-4 gap-4 mb-6">
//         <MetricCard
//           title="Total Revenue"
//           value={`$${revenueData.metrics.total.toFixed(2)}`}
//           change={revenueData.metrics.growth}
//           icon={TrendingUpIcon}
//         />
//         <MetricCard
//           title="Average per Delivery"
//           value={`$${revenueData.metrics.average.toFixed(2)}`}
//           subtitle="Per delivery"
//         />
//         <MetricCard
//           title="Today's Revenue"
//           value={`$${revenueData.metrics.todayRevenue.toFixed(2)}`}
//           subtitle="So far"
//         />
//         <MetricCard
//           title="Forecast"
//           value={`$${revenueData.forecast.nextPeriod?.toFixed(2) || 0}`}
//           subtitle={`Next ${timeRange}`}
//         />
//       </div>

//       {/* Chart Type Selector */}
//       <div className="flex items-center gap-2 mb-4">
//         <button
//           onClick={() => setChartType('line')}
//           className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
//             chartType === 'line'
//               ? 'bg-purple-600 text-white'
//               : 'bg-gray-800/50 text-gray-400 hover:text-white'
//           }`}
//         >
//           <ChartLineIcon className="w-4 h-4" />
//           Line Chart
//         </button>
//         <button
//           onClick={() => setChartType('mixed')}
//           className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
//             chartType === 'mixed'
//               ? 'bg-purple-600 text-white'
//               : 'bg-gray-800/50 text-gray-400 hover:text-white'
//           }`}
//         >
//           <ChartBarIcon className="w-4 h-4" />
//           Mixed Chart
//         </button>
//         <button
//           onClick={() => setChartType('donut')}
//           className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
//             chartType === 'donut'
//               ? 'bg-purple-600 text-white'
//               : 'bg-gray-800/50 text-gray-400 hover:text-white'
//           }`}
//         >
//           <ChartPieIcon className="w-4 h-4" />
//           Donut Chart
//         </button>
//       </div>

//       {/* Chart Display */}
//       <div className="bg-gray-800/30 rounded-xl p-4 mb-6">
//         {chartType === 'line' && <LineChartView />}
//         {chartType === 'mixed' && <MixedChartView />}
//         {chartType === 'donut' && <DonutChartView />}
//       </div>

//       {/* Additional Analytics Grid */}
//       <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
//         {/* Top Hospitals */}
//         <div className="bg-gray-800/30 rounded-xl p-4">
//           <h3 className="text-sm font-medium text-gray-400 mb-3">Top Hospitals</h3>
//           <div className="space-y-2">
//             {revenueData.hospitalRevenue.slice(0, 5).map((hospital, index) => (
//               <div key={index} className="flex items-center justify-between">
//                 <span className="text-xs text-gray-300 truncate">{hospital.name}</span>
//                 <span className="text-xs text-white font-medium">${hospital.revenue.toFixed(0)}</span>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Delivery Type Split */}
//         <div className="bg-gray-800/30 rounded-xl p-4">
//           <h3 className="text-sm font-medium text-gray-400 mb-3">Delivery Types</h3>
//           <div className="space-y-2">
//             <div className="flex items-center justify-between">
//               <span className="text-xs text-gray-300">Outgoing</span>
//               <span className="text-xs text-orange-400 font-medium">
//                 ${revenueData.deliveryTypeSplit.outgoing?.toFixed(0) || 0}
//               </span>
//             </div>
//             <div className="flex items-center justify-between">
//               <span className="text-xs text-gray-300">Incoming</span>
//               <span className="text-xs text-blue-400 font-medium">
//                 ${revenueData.deliveryTypeSplit.incoming?.toFixed(0) || 0}
//               </span>
//             </div>
//           </div>
//         </div>

//         {/* Peak Hours */}
//         <div className="bg-gray-800/30 rounded-xl p-4">
//           <h3 className="text-sm font-medium text-gray-400 mb-3">Peak Hours</h3>
//           <div className="space-y-2">
//             {revenueData.peakHours.slice(0, 3).map((hour, index) => (
//               <div key={index} className="flex items-center justify-between">
//                 <span className="text-xs text-gray-300">{hour.hour}:00</span>
//                 <span className="text-xs text-white font-medium">${hour.revenue.toFixed(0)}</span>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Distance Revenue */}
//         <div className="bg-gray-800/30 rounded-xl p-4">
//           <h3 className="text-sm font-medium text-gray-400 mb-3">By Distance</h3>
//           <div className="space-y-2">
//             {revenueData.distanceRevenue.map((range, index) => (
//               <div key={index} className="flex items-center justify-between">
//                 <span className="text-xs text-gray-300">{range.range}</span>
//                 <span className="text-xs text-white font-medium">${range.revenue.toFixed(0)}</span>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// // Metric Card Component
// function MetricCard({ title, value, change, subtitle, icon: Icon }) {
//   const isPositive = change > 0;
  
//   return (
//     <div className="bg-gray-800/30 rounded-xl p-4">
//       <div className="flex items-center justify-between mb-2">
//         <p className="text-gray-400 text-sm">{title}</p>
//         {Icon && <Icon className={`w-4 h-4 ${isPositive ? 'text-green-400' : 'text-red-400'}`} />}
//       </div>
//       <p className="text-2xl font-bold text-white">{value}</p>
//       {change !== undefined && (
//         <p className={`text-sm mt-1 ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
//           {isPositive ? '+' : ''}{change.toFixed(1)}%
//         </p>
//       )}
//       {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
//     </div>
//   );
// }


















// Responsive 
// components/dashboard/RevenueOverview.jsx
'use client';

import { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart, ComposedChart } from 'recharts';
import toast from 'react-hot-toast';

// Icon Components
const ChartLineIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const ChartBarIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const ChartPieIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
  </svg>
);

const DownloadIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </svg>
);

const TrendingUpIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);

const TrendingDownIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
  </svg>
);

export default function RevenueOverview() {
  const [chartType, setChartType] = useState('line'); // line, mixed, donut
  const [timeRange, setTimeRange] = useState('week'); // today, week, month, year
  const [loading, setLoading] = useState(true);
  const [revenueData, setRevenueData] = useState({
    chartData: [],
    metrics: {
      total: 0,
      average: 0,
      growth: 0,
      todayRevenue: 0,
      weekRevenue: 0,
      monthRevenue: 0
    },
    urgencyBreakdown: [],
    hospitalRevenue: [],
    deliveryTypeSplit: {},
    peakHours: [],
    distanceRevenue: [],
    forecast: {}
  });

  useEffect(() => {
    fetchRevenueData();
  }, [timeRange]);

  const fetchRevenueData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/revenue/overview?timeRange=${timeRange}`);
      if (!res.ok) throw new Error('Failed to fetch revenue data');
      const data = await res.json();
      setRevenueData(data);
    } catch (error) {
      console.error('Error fetching revenue:', error);
      toast.error('Failed to load revenue data');
    } finally {
      setLoading(false);
    }
  };

  const exportData = async (format) => {
    try {
      const res = await fetch(`/api/admin/revenue/export?format=${format}&timeRange=${timeRange}`);
      if (!res.ok) throw new Error('Failed to export');
      
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `revenue-report-${timeRange}-${new Date().toISOString().split('T')[0]}.${format}`;
      a.click();
      toast.success(`Revenue report exported as ${format.toUpperCase()}`);
    } catch (error) {
      toast.error('Failed to export revenue data');
    }
  };

  // Chart colors
  const COLORS = {
    primary: '#a855f7',
    secondary: '#8b5cf6',
    accent: '#7c3aed',
    emergency: '#ef4444',
    urgent: '#f97316',
    routine: '#6b7280',
    positive: '#10b981',
    negative: '#ef4444'
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900/95 backdrop-blur-xl p-2 sm:p-3 rounded-lg border border-purple-500/30">
          <p className="text-white font-medium text-xs sm:text-sm">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-xs sm:text-sm" style={{ color: entry.color }}>
              {entry.name}: ${entry.value.toFixed(2)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Line Chart Component
  const LineChartView = () => (
    <ResponsiveContainer width="100%" height={window.innerWidth < 640 ? 250 : 300}>
      <LineChart data={revenueData.chartData}>
        <defs>
          <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.8}/>
            <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0.1}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
        <XAxis dataKey="date" stroke="#9ca3af" tick={{ fontSize: window.innerWidth < 640 ? 10 : 12 }} />
        <YAxis stroke="#9ca3af" tick={{ fontSize: window.innerWidth < 640 ? 10 : 12 }} />
        <Tooltip content={<CustomTooltip />} />
        <Area type="monotone" dataKey="revenue" stroke={COLORS.primary} fillOpacity={1} fill="url(#colorRevenue)" />
        <Line type="monotone" dataKey="revenue" stroke={COLORS.primary} strokeWidth={window.innerWidth < 640 ? 2 : 3} dot={{ fill: COLORS.primary, r: window.innerWidth < 640 ? 3 : 4 }} />
        {revenueData.forecast.data && (
          <Line type="monotone" dataKey="forecast" stroke={COLORS.secondary} strokeWidth={2} strokeDasharray="5 5" />
        )}
      </LineChart>
    </ResponsiveContainer>
  );

  // Mixed Chart Component
  const MixedChartView = () => (
    <ResponsiveContainer width="100%" height={window.innerWidth < 640 ? 250 : 300}>
      <ComposedChart data={revenueData.chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
        <XAxis dataKey="date" stroke="#9ca3af" tick={{ fontSize: window.innerWidth < 640 ? 10 : 12 }} />
        <YAxis yAxisId="left" stroke="#9ca3af" tick={{ fontSize: window.innerWidth < 640 ? 10 : 12 }} />
        <YAxis yAxisId="right" orientation="right" stroke="#9ca3af" tick={{ fontSize: window.innerWidth < 640 ? 10 : 12 }} />
        <Tooltip content={<CustomTooltip />} />
        <Legend wrapperStyle={{ fontSize: window.innerWidth < 640 ? '12px' : '14px' }} />
        <Bar yAxisId="left" dataKey="emergency" stackId="a" fill={COLORS.emergency} />
        <Bar yAxisId="left" dataKey="urgent" stackId="a" fill={COLORS.urgent} />
        <Bar yAxisId="left" dataKey="routine" stackId="a" fill={COLORS.routine} />
        <Line yAxisId="right" type="monotone" dataKey="cumulative" stroke={COLORS.primary} strokeWidth={window.innerWidth < 640 ? 2 : 3} />
      </ComposedChart>
    </ResponsiveContainer>
  );

  // Donut Chart Component
  const DonutChartView = () => (
    <div className="flex flex-col lg:flex-row items-center justify-between gap-4 lg:gap-6">
      {/* Pie Chart without labels - Clean look */}
      <div className="flex-1 w-full lg:max-w-sm">
        <ResponsiveContainer width="100%" height={window.innerWidth < 640 ? 250 : 300}>
          <PieChart>
            <Pie
              data={revenueData.urgencyBreakdown}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={false} // Labels removed for clean look
              outerRadius={window.innerWidth < 640 ? 80 : 90}
              fill="#8884d8"
              dataKey="value"
              animationBegin={0}
              animationDuration={800}
            >
              {revenueData.urgencyBreakdown.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color}
                  // style={{ cursor: 'pointer' }}
                />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '8px',
                padding: '8px 12px',
                fontSize: window.innerWidth < 640 ? '12px' : '14px'
              }}
              formatter={(value) => [`$${value.toFixed(2)}`, 'Revenue']}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      
      {/* Enhanced Stats Panel with Legend */}
      <div className="flex-1 w-full lg:max-w-xs">
        <div className="bg-gray-800/30 rounded-xl p-3 sm:p-4">
          <div className="text-center mb-3 sm:mb-4">
            <p className="text-gray-400 text-xs sm:text-sm">Total Revenue</p>
            <p className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
              ${revenueData.metrics.total.toFixed(2)}
            </p>
          </div>
          
          {/* Legend Items */}
          <div className="space-y-1.5 sm:space-y-2">
            {revenueData.urgencyBreakdown.map((item, index) => (
              <div 
                key={index} 
                className="flex items-center justify-between p-1.5 sm:p-2 rounded hover:bg-gray-700/30 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <div 
                    className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full flex-shrink-0 shadow-sm" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-gray-300 text-xs sm:text-sm truncate">{item.name}</span>
                </div>
                <div className="text-right ml-2 flex-shrink-0">
                  <span className="text-white font-medium text-xs sm:text-sm">${item.value.toFixed(2)}</span>
                  <span className="text-gray-400 text-xs ml-1">
                    ({((item.value / revenueData.metrics.total) * 100).toFixed(1)}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
          
          {/* Additional Metrics */}
          <div className="mt-3 sm:mt-4 pt-2 sm:pt-3 border-t border-gray-700">
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="text-gray-400">Average</span>
              <span className="text-white font-medium">
                ${(revenueData.metrics.total / revenueData.urgencyBreakdown.length).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-4 sm:p-6 border border-purple-500/20 h-[400px] sm:h-[600px] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-purple-500 mx-auto"></div>
          <p className="text-gray-400 mt-4 text-sm sm:text-base">Loading revenue data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-4 sm:p-6 border border-purple-500/20 hover:border-purple-500/30 transition-all">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-4">
        <h2 className="text-lg sm:text-xl font-semibold text-white">Revenue Overview</h2>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
          {/* Time Range Selector */}
          <div className="flex items-center justify-evenly gap-1 sm:gap-2 bg-gray-800/50 rounded-lg p-1 overflow-x-auto">
            {['today', 'week', 'month', 'year'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-2 sm:px-3 py-1 rounded-md text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
                  timeRange === range
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </button>
            ))}
          </div>

          {/* Export Options */}
          <div className="relative group self-center">
            <button className="p-1.5 sm:p-2 bg-gray-800/50 rounded-lg hover:bg-gray-700/50 transition-all">
              <DownloadIcon className="w-4 h-4 text-gray-400" />
            </button>
            <div className="absolute right-0 mt-2 w-32 bg-gray-800 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-all pointer-events-none group-hover:pointer-events-auto z-10">
              <button
                onClick={() => exportData('csv')}
                className="w-full px-4 py-2 text-left text-xs sm:text-sm text-gray-300 hover:bg-gray-700 rounded-t-lg"
              >
                Export CSV
              </button>
              <button
                onClick={() => exportData('pdf')}
                className="w-full px-4 py-2 text-left text-xs sm:text-sm text-gray-300 hover:bg-gray-700 rounded-b-lg"
              >
                Export PDF
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 mb-4 sm:mb-6">
        <MetricCard
          title="Total Revenue"
          value={`$${revenueData.metrics.total.toFixed(2)}`}
          change={revenueData.metrics.growth}
          icon={TrendingUpIcon}
        />
        <MetricCard
          title="Average"
          value={`$${revenueData.metrics.average.toFixed(2)}`}
          subtitle="Per delivery"
        />
        <MetricCard
          title="Today"
          value={`$${revenueData.metrics.todayRevenue.toFixed(2)}`}
          subtitle="So far"
        />
        <MetricCard
          title="Forecast"
          value={`$${revenueData.forecast.nextPeriod?.toFixed(2) || 0}`}
          subtitle={`Next ${timeRange}`}
        />
      </div>

      {/* Chart Type Selector */}
      <div className="flex items-center gap-2 mb-4 overflow-x-auto">
        <button
          onClick={() => setChartType('line')}
          className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg flex items-center gap-1 sm:gap-2 transition-all text-xs sm:text-sm whitespace-nowrap ${
            chartType === 'line'
              ? 'bg-purple-600 text-white'
              : 'bg-gray-800/50 text-gray-400 hover:text-white'
          }`}
        >
          <ChartLineIcon className="w-3 h-3 sm:w-4 sm:h-4" />
          <span className="hidden sm:inline">Line Chart</span>
          <span className="sm:hidden">Line</span>
        </button>
        <button
          onClick={() => setChartType('mixed')}
          className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg flex items-center gap-1 sm:gap-2 transition-all text-xs sm:text-sm whitespace-nowrap ${
            chartType === 'mixed'
              ? 'bg-purple-600 text-white'
              : 'bg-gray-800/50 text-gray-400 hover:text-white'
          }`}
        >
          <ChartBarIcon className="w-3 h-3 sm:w-4 sm:h-4" />
          <span className="hidden sm:inline">Mixed Chart</span>
          <span className="sm:hidden">Mixed</span>
        </button>
        <button
          onClick={() => setChartType('donut')}
          className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg flex items-center gap-1 sm:gap-2 transition-all text-xs sm:text-sm whitespace-nowrap ${
            chartType === 'donut'
              ? 'bg-purple-600 text-white'
              : 'bg-gray-800/50 text-gray-400 hover:text-white'
          }`}
        >
          <ChartPieIcon className="w-3 h-3 sm:w-4 sm:h-4" />
          <span className="hidden sm:inline">Donut Chart</span>
          <span className="sm:hidden">Donut</span>
        </button>
      </div>

      {/* Chart Display */}
      <div className="bg-gray-800/30 rounded-xl p-2 sm:p-4 mb-4 sm:mb-6">
        {chartType === 'line' && <LineChartView />}
        {chartType === 'mixed' && <MixedChartView />}
        {chartType === 'donut' && <DonutChartView />}
      </div>

      {/* Additional Analytics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
        {/* Top Hospitals */}
        <div className="bg-gray-800/30 rounded-xl p-3 sm:p-4">
          <h3 className="text-xs sm:text-sm font-medium text-gray-400 mb-2 sm:mb-3">Top Hospitals</h3>
          <div className="space-y-1.5 sm:space-y-2">
            {revenueData.hospitalRevenue.slice(0, 5).map((hospital, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-xs text-gray-300 truncate mr-2">{hospital.name}</span>
                <span className="text-xs text-white font-medium">${hospital.revenue.toFixed(0)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Delivery Type Split */}
        <div className="bg-gray-800/30 rounded-xl p-3 sm:p-4">
          <h3 className="text-xs sm:text-sm font-medium text-gray-400 mb-2 sm:mb-3">Delivery Types</h3>
          <div className="space-y-1.5 sm:space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-300">Outgoing</span>
              <span className="text-xs text-orange-400 font-medium">
                ${revenueData.deliveryTypeSplit.outgoing?.toFixed(0) || 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-300">Incoming</span>
              <span className="text-xs text-blue-400 font-medium">
                ${revenueData.deliveryTypeSplit.incoming?.toFixed(0) || 0}
              </span>
            </div>
          </div>
        </div>

        {/* Peak Hours */}
        <div className="bg-gray-800/30 rounded-xl p-3 sm:p-4">
          <h3 className="text-xs sm:text-sm font-medium text-gray-400 mb-2 sm:mb-3">Peak Hours</h3>
          <div className="space-y-1.5 sm:space-y-2">
            {revenueData.peakHours.slice(0, 3).map((hour, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-xs text-gray-300">{hour.hour}:00</span>
                <span className="text-xs text-white font-medium">${hour.revenue.toFixed(0)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Distance Revenue */}
        <div className="bg-gray-800/30 rounded-xl p-3 sm:p-4">
          <h3 className="text-xs sm:text-sm font-medium text-gray-400 mb-2 sm:mb-3">By Distance</h3>
          <div className="space-y-1.5 sm:space-y-2">
            {revenueData.distanceRevenue.map((range, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-xs text-gray-300">{range.range}</span>
                <span className="text-xs text-white font-medium">${range.revenue.toFixed(0)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Metric Card Component
function MetricCard({ title, value, change, subtitle, icon: Icon }) {
  const isPositive = change > 0;
  
  return (
    <div className="bg-gray-800/30 rounded-xl p-3 sm:p-4">
      <div className="flex items-center justify-between mb-1 sm:mb-2">
        <p className="text-gray-400 text-xs sm:text-sm">{title}</p>
        {Icon && <Icon className={`w-3 h-3 sm:w-4 sm:h-4 ${isPositive ? 'text-green-400' : 'text-red-400'}`} />}
      </div>
      <p className="text-lg sm:text-2xl font-bold text-white">{value}</p>
      {change !== undefined && (
        <p className={`text-xs sm:text-sm mt-0.5 sm:mt-1 ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
          {isPositive ? '+' : ''}{change.toFixed(1)}%
        </p>
      )}
      {subtitle && <p className="text-xs text-gray-500 mt-0.5 sm:mt-1">{subtitle}</p>}
    </div>
  );
}
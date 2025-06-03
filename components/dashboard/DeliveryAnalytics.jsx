// // components/dashboard/DeliveryAnalytics.jsx
// 'use client';

// import { useState, useEffect } from 'react';
// import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart, ComposedChart, Line } from 'recharts';
// import toast from 'react-hot-toast';

// // Icon Components
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

// export default function DeliveryAnalytics({ dashboardType = 'hospital_admin' }) {
//   const [chartType, setChartType] = useState('mixed'); // mixed, donut
//   const [timeRange, setTimeRange] = useState('week'); // today, week, month
//   const [loading, setLoading] = useState(true);
//   const [analyticsData, setAnalyticsData] = useState({
//     chartData: [],
//     metrics: {
//       total: 0,
//       incoming: 0,
//       outgoing: 0,
//       todayDeliveries: 0,
//       avgPerDay: 0
//     },
//     deliveryTypeBreakdown: [],
//     urgencyBreakdown: [],
//     packageTypeBreakdown: [],
//     peakHours: [],
//     timeDistribution: []
//   });

//   const isAdmin = dashboardType === 'admin';
//   const themeColor = isAdmin ? 'purple' : 'red';
  
//   // Theme-specific styles to avoid dynamic Tailwind classes
//   const themeStyles = {
//     border: isAdmin ? 'border-purple-500/20' : 'border-red-500/20',
//     borderHover: isAdmin ? 'hover:border-purple-500/30' : 'hover:border-red-500/30',
//     bg: isAdmin ? 'bg-purple-600' : 'bg-red-600',
//     spinner: isAdmin ? 'border-purple-500' : 'border-red-500',
//     barColor: isAdmin ? 'bg-purple-500' : 'bg-red-500'
//   };

//   useEffect(() => {
//     fetchAnalyticsData();
//   }, [timeRange, dashboardType]);

//   const fetchAnalyticsData = async () => {
//     setLoading(true);
//     try {
//       const endpoint = isAdmin 
//         ? `/api/admin/delivery-analytics?timeRange=${timeRange}`
//         : `/api/hospital/delivery-analytics?timeRange=${timeRange}`;
      
//       const res = await fetch(endpoint);
//       if (!res.ok) throw new Error('Failed to fetch analytics data');
//       const data = await res.json();
//       setAnalyticsData(data);
//     } catch (error) {
//       console.error('Error fetching analytics:', error);
//       toast.error('Failed to load analytics data');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const exportData = async (format) => {
//     try {
//       const endpoint = isAdmin
//         ? `/api/admin/delivery-analytics/export?format=${format}&timeRange=${timeRange}`
//         : `/api/hospital/delivery-analytics/export?format=${format}&timeRange=${timeRange}`;
      
//       const res = await fetch(endpoint);
//       if (!res.ok) throw new Error('Failed to export');
      
//       const blob = await res.blob();
//       const url = URL.createObjectURL(blob);
//       const a = document.createElement('a');
//       a.href = url;
//       a.download = `delivery-analytics-${timeRange}-${new Date().toISOString().split('T')[0]}.${format}`;
//       a.click();
//       toast.success(`Analytics report exported as ${format.toUpperCase()}`);
//     } catch (error) {
//       toast.error('Failed to export analytics data');
//     }
//   };

//   // Chart colors based on dashboard type
//   const COLORS = {
//     primary: isAdmin ? '#a855f7' : '#dc2626',
//     secondary: isAdmin ? '#8b5cf6' : '#b91c1c',
//     accent: isAdmin ? '#7c3aed' : '#991b1b',
//     emergency: '#ef4444',
//     urgent: '#f97316',
//     routine: '#6b7280',
//     incoming: '#3b82f6',
//     outgoing: '#f59e0b',
//     medication: '#10b981',
//     blood: '#ef4444',
//     organ: '#ec4899',
//     medical_supplies: '#6366f1',
//     documents: '#8b5cf6',
//     other: '#6b7280'
//   };

//   // Custom tooltip
//   const CustomTooltip = ({ active, payload, label }) => {
//     if (active && payload && payload.length) {
//       return (
//         <div className="bg-gray-900/95 backdrop-blur-xl p-3 rounded-lg border border-gray-700">
//           <p className="text-white font-medium">{label}</p>
//           {payload.map((entry, index) => (
//             <p key={index} className="text-sm" style={{ color: entry.color }}>
//               {entry.name}: {entry.value}
//             </p>
//           ))}
//         </div>
//       );
//     }
//     return null;
//   };

//   // Mixed Chart Component
//   const MixedChartView = () => (
//     <ResponsiveContainer width="100%" height={300}>
//       <ComposedChart data={analyticsData.chartData}>
//         <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
//         <XAxis dataKey="date" stroke="#9ca3af" />
//         <YAxis yAxisId="left" stroke="#9ca3af" />
//         <YAxis yAxisId="right" orientation="right" stroke="#9ca3af" />
//         <Tooltip content={<CustomTooltip />} />
//         <Legend />
        
//         {/* Stacked bars for urgency */}
//         <Bar yAxisId="left" dataKey="emergency" stackId="a" fill={COLORS.emergency} name="Emergency" />
//         <Bar yAxisId="left" dataKey="urgent" stackId="a" fill={COLORS.urgent} name="Urgent" />
//         <Bar yAxisId="left" dataKey="routine" stackId="a" fill={COLORS.routine} name="Routine" />
        
//         {/* Lines for delivery types */}
//         <Line yAxisId="right" type="monotone" dataKey="incoming" stroke={COLORS.incoming} strokeWidth={2} name="Incoming" />
//         <Line yAxisId="right" type="monotone" dataKey="outgoing" stroke={COLORS.outgoing} strokeWidth={2} name="Outgoing" />
//       </ComposedChart>
//     </ResponsiveContainer>
//   );

//   // Donut Chart Component
//   const DonutChartView = () => {
//     const [selectedCategory, setSelectedCategory] = useState('packageType');
    
//     const getDataForCategory = () => {
//       switch (selectedCategory) {
//         case 'packageType':
//           return analyticsData.packageTypeBreakdown;
//         case 'urgency':
//           return analyticsData.urgencyBreakdown;
//         case 'deliveryType':
//           return analyticsData.deliveryTypeBreakdown;
//         default:
//           return [];
//       }
//     };

//     const getCategoryColor = (item) => {
//       if (selectedCategory === 'packageType') {
//         return COLORS[item.type] || COLORS.other;
//       } else if (selectedCategory === 'urgency') {
//         return COLORS[item.type] || COLORS.routine;
//       } else {
//         return item.type === 'incoming' ? COLORS.incoming : COLORS.outgoing;
//       }
//     };

//     const data = getDataForCategory();

//     return (
//       <div>
//         {/* Category Selector */}
//         <div className="flex items-center gap-2 mb-4 justify-center">
//           <button
//             onClick={() => setSelectedCategory('packageType')}
//             className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
//               selectedCategory === 'packageType'
//                 ? `${themeStyles.bg} text-white`
//                 : 'bg-gray-700 text-gray-400 hover:text-white'
//             }`}
//           >
//             Package Type
//           </button>
//           <button
//             onClick={() => setSelectedCategory('urgency')}
//             className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
//               selectedCategory === 'urgency'
//                 ? `${themeStyles.bg} text-white`
//                 : 'bg-gray-700 text-gray-400 hover:text-white'
//             }`}
//           >
//             Urgency
//           </button>
//           <button
//             onClick={() => setSelectedCategory('deliveryType')}
//             className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
//               selectedCategory === 'deliveryType'
//                 ? `${themeStyles.bg} text-white`
//                 : 'bg-gray-700 text-gray-400 hover:text-white'
//             }`}
//           >
//             Delivery Type
//           </button>
//         </div>

//         <div className="flex items-center justify-between">
//           <ResponsiveContainer width="50%" height={300}>
//             <PieChart>
//               <Pie
//                 data={data}
//                 cx="50%"
//                 cy="50%"
//                 labelLine={false}
//                 label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
//                 outerRadius={80}
//                 fill="#8884d8"
//                 dataKey="value"
//               >
//                 {data.map((entry, index) => (
//                   <Cell key={`cell-${index}`} fill={getCategoryColor(entry)} />
//                 ))}
//               </Pie>
//               <Tooltip />
//             </PieChart>
//           </ResponsiveContainer>
          
//           {/* Stats Panel */}
//           <div className="flex-1 space-y-3">
//             <div className="text-center mb-4">
//               <p className="text-gray-400 text-sm">Total Deliveries</p>
//               <p className="text-3xl font-bold text-white">{analyticsData.metrics.total}</p>
//             </div>
//             {data.map((item, index) => (
//               <div key={index} className="flex items-center justify-between">
//                 <div className="flex items-center gap-2">
//                   <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getCategoryColor(item) }}></div>
//                   <span className="text-gray-300">{item.name}</span>
//                 </div>
//                 <div className="text-right">
//                   <span className="text-white font-medium">{item.value}</span>
//                   <span className="text-gray-400 text-sm ml-2">({item.percentage}%)</span>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     );
//   };

//   if (loading) {
//     return (
//       <div className={`bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 ${themeStyles.border} h-[600px] flex items-center justify-center`}>
//         <div className="text-center">
//           <div className={`animate-spin rounded-full h-12 w-12 border-b-2 ${themeStyles.spinner} mx-auto`}></div>
//           <p className="text-gray-400 mt-4">Loading analytics data...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className={`bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 ${themeStyles.border} ${themeStyles.borderHover} transition-all`}>
//       {/* Header */}
//       <div className="flex items-center justify-between mb-6">
//         <h2 className="text-xl font-semibold text-white">
//           {isAdmin ? 'Approved Deliveries Analytics' : 'Delivery Analytics'}
//         </h2>
//         <div className="flex items-center gap-4">
//           {/* Time Range Selector */}
//           <div className="flex items-center gap-2 bg-gray-800/50 rounded-lg p-1">
//             {['today', 'week', 'month'].map((range) => (
//               <button
//                 key={range}
//                 onClick={() => setTimeRange(range)}
//                 className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
//                   timeRange === range
//                     ? `${themeStyles.bg} text-white`
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
//       <div className="grid grid-cols-5 gap-4 mb-6">
//         <MetricCard
//           title="Total Deliveries"
//           value={analyticsData.metrics.total}
//           themeColor={themeColor}
//         />
//         <MetricCard
//           title="Incoming"
//           value={analyticsData.metrics.incoming}
//           subtitle={`${((analyticsData.metrics.incoming / analyticsData.metrics.total) * 100 || 0).toFixed(0)}%`}
//           themeColor="blue"
//         />
//         <MetricCard
//           title="Outgoing"
//           value={analyticsData.metrics.outgoing}
//           subtitle={`${((analyticsData.metrics.outgoing / analyticsData.metrics.total) * 100 || 0).toFixed(0)}%`}
//           themeColor="orange"
//         />
//         <MetricCard
//           title="Today"
//           value={analyticsData.metrics.todayDeliveries}
//           themeColor={themeColor}
//         />
//         <MetricCard
//           title="Avg/Day"
//           value={analyticsData.metrics.avgPerDay.toFixed(1)}
//           themeColor={themeColor}
//         />
//       </div>

//       {/* Chart Type Selector */}
//       <div className="flex items-center gap-2 mb-4">
//         <button
//           onClick={() => setChartType('mixed')}
//           className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
//             chartType === 'mixed'
//               ? `${themeStyles.bg} text-white`
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
//               ? `${themeStyles.bg} text-white`
//               : 'bg-gray-800/50 text-gray-400 hover:text-white'
//           }`}
//         >
//           <ChartPieIcon className="w-4 h-4" />
//           Donut Chart
//         </button>
//       </div>

//       {/* Chart Display */}
//       <div className="bg-gray-800/30 rounded-xl p-4 mb-6">
//         {chartType === 'mixed' && <MixedChartView />}
//         {chartType === 'donut' && <DonutChartView />}
//       </div>

//       {/* Additional Analytics Grid */}
//       <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
//         {/* Peak Hours */}
//         <div className="bg-gray-800/30 rounded-xl p-4">
//           <h3 className="text-sm font-medium text-gray-400 mb-3">Peak Hours</h3>
//           <div className="space-y-2">
//             {analyticsData.peakHours.slice(0, 5).map((hour, index) => (
//               <div key={index} className="flex items-center justify-between">
//                 <span className="text-xs text-gray-300">{hour.hour}:00</span>
//                 <div className="flex items-center gap-2">
//                   <div className="w-24 bg-gray-700 rounded-full h-1.5">
//                     <div 
//                       className={`${themeStyles.barColor} h-1.5 rounded-full`}
//                       style={{ width: `${(hour.count / Math.max(...analyticsData.peakHours.map(h => h.count))) * 100}%` }}
//                     />
//                   </div>
//                   <span className="text-xs text-white font-medium">{hour.count}</span>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Top Package Types */}
//         <div className="bg-gray-800/30 rounded-xl p-4">
//           <h3 className="text-sm font-medium text-gray-400 mb-3">Top Package Types</h3>
//           <div className="space-y-2">
//             {analyticsData.packageTypeBreakdown.slice(0, 5).map((pkg, index) => (
//               <div key={index} className="flex items-center justify-between">
//                 <span className="text-xs text-gray-300 truncate">{pkg.name}</span>
//                 <span className="text-xs text-white font-medium">{pkg.value}</span>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Urgency Distribution */}
//         <div className="bg-gray-800/30 rounded-xl p-4">
//           <h3 className="text-sm font-medium text-gray-400 mb-3">Urgency Levels</h3>
//           <div className="space-y-2">
//             {analyticsData.urgencyBreakdown.map((urgency, index) => (
//               <div key={index} className="flex items-center justify-between">
//                 <div className="flex items-center gap-2">
//                   <div 
//                     className="w-2 h-2 rounded-full" 
//                     style={{ backgroundColor: COLORS[urgency.type] }}
//                   />
//                   <span className="text-xs text-gray-300">{urgency.name}</span>
//                 </div>
//                 <span className="text-xs text-white font-medium">{urgency.value}</span>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Time Distribution */}
//         <div className="bg-gray-800/30 rounded-xl p-4">
//           <h3 className="text-sm font-medium text-gray-400 mb-3">Time Distribution</h3>
//           <div className="space-y-2">
//             {analyticsData.timeDistribution.map((time, index) => (
//               <div key={index} className="flex items-center justify-between">
//                 <span className="text-xs text-gray-300">{time.period}</span>
//                 <span className={`text-xs font-medium ${time.isActive ? 'text-green-400' : 'text-gray-400'}`}>
//                   {time.percentage}%
//                 </span>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// // Metric Card Component
// function MetricCard({ title, value, subtitle, themeColor = 'gray' }) {
//   const colorMap = {
//     purple: 'from-purple-600 to-indigo-600',
//     red: 'from-red-600 to-rose-600',
//     blue: 'from-blue-600 to-cyan-600',
//     orange: 'from-orange-600 to-yellow-600',
//     gray: 'from-gray-600 to-gray-700'
//   };
  
//   return (
//     <div className="bg-gray-800/30 rounded-xl p-4">
//       <p className="text-gray-400 text-sm mb-1">{title}</p>
//       <p className={`text-2xl font-bold text-white bg-gradient-to-r ${colorMap[themeColor]} bg-clip-text text-transparent`}>
//         {value}
//       </p>
//       {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
//     </div>
//   );
// }































// components/dashboard/DeliveryAnalytics.jsx
'use client';

import { useState, useEffect } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart, ComposedChart, Line } from 'recharts';
import toast from 'react-hot-toast';

// Icon Components
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

export default function DeliveryAnalytics({ dashboardType = 'hospital_admin' }) {
  const [chartType, setChartType] = useState('mixed'); // mixed, donut
  const [timeRange, setTimeRange] = useState('week'); // today, week, month
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState({
    chartData: [],
    metrics: {
      total: 0,
      incoming: 0,
      outgoing: 0,
      todayDeliveries: 0,
      avgPerDay: 0
    },
    deliveryTypeBreakdown: [],
    urgencyBreakdown: [],
    packageTypeBreakdown: [],
    peakHours: [],
    timeDistribution: []
  });

  const isAdmin = dashboardType === 'admin';
  const themeColor = isAdmin ? 'purple' : 'red';
  
  // Theme-specific styles to avoid dynamic Tailwind classes
  const themeStyles = {
    border: isAdmin ? 'border-purple-500/20' : 'border-red-500/20',
    borderHover: isAdmin ? 'hover:border-purple-500/30' : 'hover:border-red-500/30',
    bg: isAdmin ? 'bg-purple-600' : 'bg-red-600',
    spinner: isAdmin ? 'border-purple-500' : 'border-red-500',
    barColor: isAdmin ? 'bg-purple-500' : 'bg-red-500'
  };

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange, dashboardType]);

  const fetchAnalyticsData = async () => {
    setLoading(true);
    try {
      const endpoint = isAdmin 
        ? `/api/admin/delivery-analytics?timeRange=${timeRange}`
        : `/api/hospital/delivery-analytics?timeRange=${timeRange}`;
      
      console.log('Fetching analytics from:', endpoint);
      
      const res = await fetch(endpoint);
      
      if (!res.ok) {
        const errorText = await res.text();
        console.error('API Error:', res.status, errorText);
        throw new Error(`Failed to fetch analytics data: ${res.status}`);
      }
      
      const data = await res.json();
      console.log('Analytics data received:', data);
      setAnalyticsData(data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast.error(`Failed to load analytics data: ${error.message}`);
      
      // Set dummy data for testing
      setAnalyticsData({
        chartData: [],
        metrics: {
          total: 0,
          incoming: 0,
          outgoing: 0,
          todayDeliveries: 0,
          avgPerDay: 0
        },
        deliveryTypeBreakdown: [],
        urgencyBreakdown: [],
        packageTypeBreakdown: [],
        peakHours: [],
        timeDistribution: []
      });
    } finally {
      setLoading(false);
    }
  };

  const exportData = async (format) => {
    try {
      const endpoint = isAdmin
        ? `/api/admin/delivery-analytics/export?format=${format}&timeRange=${timeRange}`
        : `/api/hospital/delivery-analytics/export?format=${format}&timeRange=${timeRange}`;
      
      const res = await fetch(endpoint);
      if (!res.ok) throw new Error('Failed to export');
      
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `delivery-analytics-${timeRange}-${new Date().toISOString().split('T')[0]}.${format}`;
      a.click();
      toast.success(`Analytics report exported as ${format.toUpperCase()}`);
    } catch (error) {
      toast.error('Failed to export analytics data');
    }
  };

  // Chart colors based on dashboard type
  const COLORS = {
    primary: isAdmin ? '#a855f7' : '#dc2626',
    secondary: isAdmin ? '#8b5cf6' : '#b91c1c',
    accent: isAdmin ? '#7c3aed' : '#991b1b',
    emergency: '#ef4444',
    urgent: '#f97316',
    routine: '#6b7280',
    incoming: '#3b82f6',
    outgoing: '#f59e0b',
    medication: '#10b981',
    blood: '#ef4444',
    organ: '#ec4899',
    medical_supplies: '#6366f1',
    documents: '#8b5cf6',
    other: '#6b7280'
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900/95 backdrop-blur-xl p-3 rounded-lg border border-gray-700">
          <p className="text-white font-medium">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Mixed Chart Component
  const MixedChartView = () => (
    <ResponsiveContainer width="100%" height={300}>
      <ComposedChart data={analyticsData.chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
        <XAxis dataKey="date" stroke="#9ca3af" />
        <YAxis yAxisId="left" stroke="#9ca3af" />
        <YAxis yAxisId="right" orientation="right" stroke="#9ca3af" />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        
        {/* Stacked bars for urgency */}
        <Bar yAxisId="left" dataKey="emergency" stackId="a" fill={COLORS.emergency} name="Emergency" />
        <Bar yAxisId="left" dataKey="urgent" stackId="a" fill={COLORS.urgent} name="Urgent" />
        <Bar yAxisId="left" dataKey="routine" stackId="a" fill={COLORS.routine} name="Routine" />
        
        {/* Lines for delivery types */}
        <Line yAxisId="right" type="monotone" dataKey="incoming" stroke={COLORS.incoming} strokeWidth={2} name="Incoming" />
        <Line yAxisId="right" type="monotone" dataKey="outgoing" stroke={COLORS.outgoing} strokeWidth={2} name="Outgoing" />
      </ComposedChart>
    </ResponsiveContainer>
  );

  // Donut Chart Component
  const DonutChartView = () => {
    const [selectedCategory, setSelectedCategory] = useState('packageType');
    
    const getDataForCategory = () => {
      switch (selectedCategory) {
        case 'packageType':
          return analyticsData.packageTypeBreakdown;
        case 'urgency':
          return analyticsData.urgencyBreakdown;
        case 'deliveryType':
          return analyticsData.deliveryTypeBreakdown;
        default:
          return [];
      }
    };

    const getCategoryColor = (item) => {
      if (selectedCategory === 'packageType') {
        return COLORS[item.type] || COLORS.other;
      } else if (selectedCategory === 'urgency') {
        return COLORS[item.type] || COLORS.routine;
      } else {
        return item.type === 'incoming' ? COLORS.incoming : COLORS.outgoing;
      }
    };

    const data = getDataForCategory();

    return (
      <div>
        {/* Category Selector */}
        <div className="flex items-center gap-2 mb-4 justify-center">
          <button
            onClick={() => setSelectedCategory('packageType')}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
              selectedCategory === 'packageType'
                ? `${themeStyles.bg} text-white`
                : 'bg-gray-700 text-gray-400 hover:text-white'
            }`}
          >
            Package Type
          </button>
          <button
            onClick={() => setSelectedCategory('urgency')}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
              selectedCategory === 'urgency'
                ? `${themeStyles.bg} text-white`
                : 'bg-gray-700 text-gray-400 hover:text-white'
            }`}
          >
            Urgency
          </button>
          <button
            onClick={() => setSelectedCategory('deliveryType')}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
              selectedCategory === 'deliveryType'
                ? `${themeStyles.bg} text-white`
                : 'bg-gray-700 text-gray-400 hover:text-white'
            }`}
          >
            Delivery Type
          </button>
        </div>

        <div className="flex items-center justify-between">
          <ResponsiveContainer width="50%" height={300}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getCategoryColor(entry)} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          
          {/* Stats Panel */}
          <div className="flex-1 space-y-3">
            <div className="text-center mb-4">
              <p className="text-gray-400 text-sm">Total Deliveries</p>
              <p className="text-3xl font-bold text-white">{analyticsData.metrics.total}</p>
            </div>
            {data.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getCategoryColor(item) }}></div>
                  <span className="text-gray-300">{item.name}</span>
                </div>
                <div className="text-right">
                  <span className="text-white font-medium">{item.value}</span>
                  <span className="text-gray-400 text-sm ml-2">({item.percentage}%)</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className={`bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 ${themeStyles.border} h-[600px] flex items-center justify-center`}>
        <div className="text-center">
          <div className={`animate-spin rounded-full h-12 w-12 border-b-2 ${themeStyles.spinner} mx-auto`}></div>
          <p className="text-gray-400 mt-4">Loading analytics data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 ${themeStyles.border} ${themeStyles.borderHover} transition-all`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">
          {isAdmin ? 'Delivery Trends' : 'Delivery Analytics'}
        </h2>
        <div className="flex items-center gap-4">
          {/* Time Range Selector */}
          <div className="flex items-center gap-2 bg-gray-800/50 rounded-lg p-1">
            {['today', 'week', 'month'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
                  timeRange === range
                    ? `${themeStyles.bg} text-white`
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </button>
            ))}
          </div>

          {/* Export Options */}
          <div className="relative group">
            <button className="p-2 bg-gray-800/50 rounded-lg hover:bg-gray-700/50 transition-all">
              <DownloadIcon className="w-4 h-4 text-gray-400" />
            </button>
            <div className="absolute right-0 mt-2 w-32 bg-gray-800 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-all pointer-events-none group-hover:pointer-events-auto">
              <button
                onClick={() => exportData('csv')}
                className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-gray-700 rounded-t-lg"
              >
                Export CSV
              </button>
              <button
                onClick={() => exportData('pdf')}
                className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-gray-700 rounded-b-lg"
              >
                Export PDF
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-5 gap-4 mb-6">
        <MetricCard
          title="Total Deliveries"
          value={analyticsData.metrics.total}
          themeColor={themeColor}
        />
        <MetricCard
          title="Incoming"
          value={analyticsData.metrics.incoming}
          subtitle={`${((analyticsData.metrics.incoming / analyticsData.metrics.total) * 100 || 0).toFixed(0)}%`}
          themeColor="blue"
        />
        <MetricCard
          title="Outgoing"
          value={analyticsData.metrics.outgoing}
          subtitle={`${((analyticsData.metrics.outgoing / analyticsData.metrics.total) * 100 || 0).toFixed(0)}%`}
          themeColor="orange"
        />
        <MetricCard
          title="Today"
          value={analyticsData.metrics.todayDeliveries}
          themeColor={themeColor}
        />
        <MetricCard
          title="Avg/Day"
          value={analyticsData.metrics.avgPerDay.toFixed(1)}
          themeColor={themeColor}
        />
      </div>

      {/* Chart Type Selector */}
      <div className="flex items-center gap-2 mb-4">
        <button
          onClick={() => setChartType('mixed')}
          className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
            chartType === 'mixed'
              ? `${themeStyles.bg} text-white`
              : 'bg-gray-800/50 text-gray-400 hover:text-white'
          }`}
        >
          <ChartBarIcon className="w-4 h-4" />
          Mixed Chart
        </button>
        <button
          onClick={() => setChartType('donut')}
          className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
            chartType === 'donut'
              ? `${themeStyles.bg} text-white`
              : 'bg-gray-800/50 text-gray-400 hover:text-white'
          }`}
        >
          <ChartPieIcon className="w-4 h-4" />
          Donut Chart
        </button>
      </div>

      {/* Chart Display */}
      <div className="bg-gray-800/30 rounded-xl p-4 mb-6">
        {chartType === 'mixed' && <MixedChartView />}
        {chartType === 'donut' && <DonutChartView />}
      </div>

      {/* Additional Analytics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Peak Hours */}
        <div className="bg-gray-800/30 rounded-xl p-4">
          <h3 className="text-sm font-medium text-gray-400 mb-3">Peak Hours</h3>
          <div className="space-y-2">
            {analyticsData.peakHours.slice(0, 5).map((hour, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-xs text-gray-300">{hour.hour}:00</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-gray-700 rounded-full h-1.5">
                    <div 
                      className={`${themeStyles.barColor} h-1.5 rounded-full`}
                      style={{ width: `${(hour.count / Math.max(...analyticsData.peakHours.map(h => h.count))) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-white font-medium">{hour.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Package Types */}
        <div className="bg-gray-800/30 rounded-xl p-4">
          <h3 className="text-sm font-medium text-gray-400 mb-3">Top Package Types</h3>
          <div className="space-y-2">
            {analyticsData.packageTypeBreakdown.slice(0, 5).map((pkg, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-xs text-gray-300 truncate">{pkg.name}</span>
                <span className="text-xs text-white font-medium">{pkg.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Urgency Distribution */}
        <div className="bg-gray-800/30 rounded-xl p-4">
          <h3 className="text-sm font-medium text-gray-400 mb-3">Urgency Levels</h3>
          <div className="space-y-2">
            {analyticsData.urgencyBreakdown.map((urgency, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-2 h-2 rounded-full" 
                    style={{ backgroundColor: COLORS[urgency.type] }}
                  />
                  <span className="text-xs text-gray-300">{urgency.name}</span>
                </div>
                <span className="text-xs text-white font-medium">{urgency.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Time Distribution */}
        <div className="bg-gray-800/30 rounded-xl p-4">
          <h3 className="text-sm font-medium text-gray-400 mb-3">Time Distribution</h3>
          <div className="space-y-2">
            {analyticsData.timeDistribution.map((time, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-xs text-gray-300">{time.period}</span>
                <span className={`text-xs font-medium ${time.isActive ? 'text-green-400' : 'text-gray-400'}`}>
                  {time.percentage}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Metric Card Component
function MetricCard({ title, value, subtitle, themeColor = 'gray' }) {
  const colorMap = {
    purple: 'from-purple-600 to-indigo-600',
    red: 'from-red-600 to-rose-600',
    blue: 'from-blue-600 to-cyan-600',
    orange: 'from-orange-600 to-yellow-600',
    gray: 'from-gray-600 to-gray-700'
  };
  
  return (
    <div className="bg-gray-800/30 rounded-xl p-4">
      <p className="text-gray-400 text-sm mb-1">{title}</p>
      <p className={`text-2xl font-bold text-white bg-gradient-to-r ${colorMap[themeColor]} bg-clip-text text-transparent`}>
        {value}
      </p>
      {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
    </div>
  );
}
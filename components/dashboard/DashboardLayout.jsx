// // components/dashboard/DashboardLayout.jsx
// 'use client';

// import { useState } from 'react';
// import { useSession, signOut } from 'next-auth/react';
// import { useRouter, usePathname } from 'next/navigation';
// import Link from 'next/link';
// import NotificationBell from '@/components/NotificationBell';

// export default function DashboardLayout({ children }) {
//   const { data: session } = useSession();
//   const router = useRouter();
//   const pathname = usePathname();
//   const [sidebarOpen, setSidebarOpen] = useState(false);

//   const roleThemes = {
//     admin: {
//       primary: 'purple',
//       gradient: 'from-purple-600 to-indigo-600',
//       hover: 'hover:bg-purple-900/20',
//       text: 'text-purple-400',
//       border: 'border-purple-500/20',
//       bg: 'bg-purple-950/10',
//       bgGradient: 'from-purple-950/50 via-gray-950 to-indigo-950/50',
//       gridColor: '#a855f715',
//       floatColor: 'text-purple-500/10',
//       shadow: 'shadow-purple-500/25'
//     },
//     hospital_admin: {
//       primary: 'red',
//       gradient: 'from-red-600 to-rose-600',
//       hover: 'hover:bg-red-900/20',
//       text: 'text-red-400',
//       border: 'border-red-500/20',
//       bg: 'bg-red-950/10',
//       bgGradient: 'from-red-950/50 via-gray-950 to-rose-950/50',
//       gridColor: '#dc262615',
//       floatColor: 'text-red-500/10',
//       shadow: 'shadow-red-500/25'
//     },
//     medical_staff: {
//       primary: 'red',
//       gradient: 'from-red-600 to-rose-600',
//       hover: 'hover:bg-red-900/20',
//       text: 'text-red-400',
//       border: 'border-red-500/20',
//       bg: 'bg-red-950/10',
//       bgGradient: 'from-red-950/50 via-gray-950 to-rose-950/50',
//       gridColor: '#dc262615',
//       floatColor: 'text-red-500/10',
//       shadow: 'shadow-red-500/25'
//     },
//     customer: {
//       primary: 'blue',
//       gradient: 'from-blue-600 to-cyan-600',
//       hover: 'hover:bg-blue-900/20',
//       text: 'text-blue-400',
//       border: 'border-blue-500/20',
//       bg: 'bg-blue-950/10',
//       bgGradient: 'from-blue-950/50 via-gray-950 to-cyan-950/50',
//       gridColor: '#3b82f615',
//       floatColor: 'text-blue-500/10',
//       shadow: 'shadow-blue-500/25'
//     },
//     pilot: {
//       primary: 'green',
//       gradient: 'from-green-600 to-emerald-600',
//       hover: 'hover:bg-green-900/20',
//       text: 'text-green-400',
//       border: 'border-green-500/20',
//       bg: 'bg-green-950/10',
//       bgGradient: 'from-green-950/50 via-gray-950 to-emerald-950/50',
//       gridColor: '#10b98115',
//       floatColor: 'text-green-500/10',
//       shadow: 'shadow-green-500/25'
//     }
//   };

//   const theme = roleThemes[session?.user?.role] || roleThemes.customer;

//   const navigationItems = {
//     admin: [
//       { href: '/dashboard', label: 'Overview', icon: ChartIcon },
//       { href: '/dashboard/admin/pending-assignments', label: 'Awaiting Assignment', icon: AssignmentIcon },
//       { href: '/dashboard/admin/recent-activity', label: 'System Activity', icon: PerformanceIcon },
//       { href: '/dashboard/hospitals/verify', label: 'Verify Hospitals', icon: HospitalIcon },
//       { href: '/dashboard/admin/pricing', label: 'Pricing Config', icon: DollarIcon },
//     ],
//     hospital_admin: [
//       { href: '/dashboard', label: 'Overview', icon: ChartIcon },
//       { href: '/dashboard/new-delivery', label: 'New Delivery', icon: PlusIcon },
//       { href: '/dashboard/hospital-admin/pending-approvals', label: 'Pending Approvals', icon: PackageIcon },
//       { href: '/dashboard/hospital-admin/staff-activity', label: 'Staff Activity', icon: UsersIcon },
//       { href: '/dashboard/hospital-admin/deliveries', label: 'Delivery History', icon: HistoryIcon },
//     ],
//     medical_staff: [
//       { href: '/dashboard', label: 'Dashboard', icon: ChartIcon },
//       { href: '/dashboard/new-delivery', label: 'New Delivery', icon: PlusIcon },
//       { href: '/dashboard/track-all', label: 'Active Deliveries', icon: ActiveIcon },
//       { href: '/dashboard/delivery-history', label: 'Delivery History', icon: HistoryIcon },
//       { href: '/dashboard/new-delivery?urgency=emergency', label: 'Emergency Delivery', icon: EmergencyIcon }
//     ],
//     customer: [
//       { href: '/dashboard', label: 'Overview', icon: ChartIcon },
//       { href: '/dashboard/new-delivery', label: 'New Delivery', icon: PlusIcon },
//       { href: '/dashboard/track', label: 'Track Delivery', icon: TrackIcon },
//       { href: '/dashboard/history', label: 'History', icon: HistoryIcon },
//       { href: '/dashboard/profile', label: 'Profile', icon: ProfileIcon }
//     ],
//     pilot: [
//       { href: '/dashboard', label: 'Flight Dashboard', icon: ChartIcon },
//       { href: '/dashboard/assignments', label: 'Assignments', icon: AssignmentIcon },
//       { href: '/dashboard/routes', label: 'Flight Routes', icon: RouteIcon },
//     ]
//   };

//   const navItems = navigationItems[session?.user?.role] || navigationItems.customer;

//   const handleSignOut = async () => {
//     await signOut({ callbackUrl: '/' });
//   };

//   return (
//     <div className="min-h-screen bg-gray-950 relative overflow-hidden">
//       {/* Animated Background - Similar to Auth Pages */}
//       <div className="absolute inset-0 transition-all duration-700">
//         {/* Grid Pattern */}
//         <div 
//           className="absolute inset-0 bg-[size:4rem_4rem]"
//           style={{
//             backgroundImage: `linear-gradient(to right, ${theme.gridColor} 1px, transparent 1px), linear-gradient(to bottom, ${theme.gridColor} 1px, transparent 1px)`
//           }}
//         ></div>
        
//         {/* Gradient Overlay */}
//         <div className={`absolute inset-0 bg-gradient-to-br ${theme.bgGradient} transition-all duration-700`}></div>
        
//         {/* Animated Elements */}
//         <div className="absolute inset-0">
//           {/* Floating Drone Model */}
//           <div className="absolute bottom-20 left-10 animate-float-delayed">
//             <svg className={`w-40 h-40 ${theme.floatColor} transition-colors duration-700`} viewBox="0 0 24 24" fill="currentColor">
//               <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
//             </svg>
//           </div>

//           {/* Animated Circuit Lines */}
//           <svg className="absolute inset-0 w-full h-full opacity-5">
//             <pattern id="circuit" x="0" y="0" width="200" height="200" patternUnits="userSpaceOnUse">
//               <path d={`M0 100 L50 100 L50 50 L100 50`} stroke={theme.primary === 'purple' ? '#a855f7' : theme.primary === 'red' ? '#dc2626' : theme.primary === 'blue' ? '#3b82f6' : '#10b981'} strokeWidth="2" fill="none" />
//               <circle cx="50" cy="100" r="3" fill={theme.primary === 'purple' ? '#a855f7' : theme.primary === 'red' ? '#dc2626' : theme.primary === 'blue' ? '#3b82f6' : '#10b981'} />
//               <circle cx="100" cy="50" r="3" fill={theme.primary === 'purple' ? '#a855f7' : theme.primary === 'red' ? '#dc2626' : theme.primary === 'blue' ? '#3b82f6' : '#10b981'} />
//             </pattern>
//             <rect width="100%" height="100%" fill="url(#circuit)" />
//           </svg>

//           {/* Pulsing Rings */}
//           <div className="absolute top-1/3 right-1/4">
//             <div className={`w-64 h-64 rounded-full border ${theme.border} animate-pulse-slow`}></div>
//             <div className={`w-64 h-64 rounded-full border ${theme.border} animate-pulse-slow animation-delay-1000 absolute inset-0`}></div>
//           </div>

//           {/* Additional Animated Drone Path */}
//           <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
//             <defs>
//               <path id="dronePath" d="M100,500 Q400,300 700,500 T1300,500" />
//             </defs>
//             <g className="opacity-30">
//               <circle r="4" fill={theme.primary === 'purple' ? '#a855f7' : theme.primary === 'red' ? '#dc2626' : theme.primary === 'blue' ? '#3b82f6' : '#10b981'}>
//                 <animateMotion dur="30s" repeatCount="indefinite">
//                   <mpath href="#dronePath" />
//                 </animateMotion>
//               </circle>
//             </g>
//           </svg>
//         </div>
//       </div>

//       {/* Main Layout */}
//       <div className="relative z-10 flex h-screen">
//         {/* Sidebar */}
//         <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-gray-900/50 backdrop-blur-xl border-r ${theme.border} transition-all duration-300 flex flex-col`}>
//           <div className="h-full flex flex-col">
//             {/* Logo */}
//             <div className="p-6 border-b border-gray-800">
//               <div className="flex items-center justify-between">
//                 <div className={`flex items-center gap-3 ${!sidebarOpen && 'justify-center'}`}>
//                   <div className={`w-10 h-10 bg-gradient-to-br ${theme.gradient} rounded-xl flex items-center justify-center shadow-lg ${theme.shadow} relative`}>
//                     <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
//                     </svg>
//                     <div className="absolute inset-0 rounded-xl border-2 border-white/20 animate-spin-slow"></div>
//                   </div>
//                   {sidebarOpen && (
//                     <div>
//                       <h1 className="text-white font-bold">Vaayu</h1>
//                       <p className={`text-xs ${theme.text} opacity-60`}>{session?.user?.role?.replace('_', ' ')}</p>
//                     </div>
//                   )}
//                 </div>
//                 <button
//                   onClick={() => setSidebarOpen(!sidebarOpen)}
//                   className="text-gray-400 hover:text-white transition-colors"
//                 >
//                   <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={sidebarOpen ? "M11 19l-7-7 7-7m8 14l-7-7 7-7" : "M13 5l7 7-7 7M5 5l7 7-7 7"} />
//                   </svg>
//                 </button>
//               </div>
//             </div>

//             {/* Navigation */}
//             <nav className="flex-1 p-4 overflow-y-auto">
//               <ul className="space-y-2">
//                 {navItems.map((item) => (
//                   <li key={item.href}>
//                     <Link
//                       href={item.href}
//                       className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${
//                         pathname === item.href
//                           ? `bg-gradient-to-r ${theme.gradient} text-white shadow-lg ${theme.shadow}`
//                           : `text-gray-400 ${theme.hover} hover:text-white`
//                       } ${!sidebarOpen && 'justify-center'}`}
//                     >
//                       <item.icon className="w-5 h-5" />
//                       {sidebarOpen && <span>{item.label}</span>}
//                     </Link>
//                   </li>
//                 ))}
//               </ul>
//             </nav>

//             {/* User Profile */}
//             <div className={`p-4 border-t ${theme.border}`}>
//               <div className={`${theme.bg} backdrop-blur-xl rounded-xl p-4 border ${theme.border}`}>
//                 <div className={`flex items-center gap-3 ${!sidebarOpen && 'justify-center'}`}>
//                   <div className={`w-10 h-10 bg-gradient-to-br ${theme.gradient} rounded-full flex items-center justify-center shadow-lg ${theme.shadow}`}>
//                     <span className="text-white font-medium">
//                       {session?.user?.name?.charAt(0).toUpperCase()}
//                     </span>
//                   </div>
//                   {sidebarOpen && (
//                     <div className="flex-1">
//                       <p className="text-white text-sm font-medium truncate">{session?.user?.name}</p>
//                       <p className={`text-xs ${theme.text} opacity-60 truncate`}>{session?.user?.email}</p>
//                     </div>
//                   )}
//                 </div>
//                 {sidebarOpen && (
//                   <button
//                     onClick={handleSignOut}
//                     className="mt-4 w-full py-2 bg-gray-800/50 backdrop-blur hover:bg-gray-700/50 text-gray-300 rounded-lg transition-all text-sm border border-gray-700"
//                   >
//                     Sign Out
//                   </button>
//                 )}
//               </div>
//             </div>
//           </div>
//         </aside>

//         {/* Main Content */}
//         <main className="flex-1 overflow-hidden">
//           <div className="h-full overflow-y-auto">
//             {/* Content Wrapper with padding and max-width */}
//             <div className="relative z-10">
//               {children}
//             </div>
//           </div>
//         </main>
//       </div>

//       {/* Styles for animations */}
//       <style jsx>{`
//         @keyframes float {
//           0%, 100% { transform: translateY(0px) rotate(0deg); }
//           50% { transform: translateY(-20px) rotate(5deg); }
//         }
//         @keyframes float-delayed {
//           0%, 100% { transform: translateY(0px) rotate(0deg); }
//           50% { transform: translateY(-30px) rotate(-5deg); }
//         }
//         @keyframes pulse-slow {
//           0%, 100% { transform: scale(1); opacity: 0.2; }
//           50% { transform: scale(1.1); opacity: 0.1; }
//         }
//         @keyframes spin-slow {
//           from { transform: rotate(0deg); }
//           to { transform: rotate(360deg); }
//         }
//         .animate-float { animation: float 6s ease-in-out infinite; }
//         .animate-float-delayed { animation: float-delayed 8s ease-in-out infinite; }
//         .animate-pulse-slow { animation: pulse-slow 4s ease-in-out infinite; }
//         .animate-spin-slow { animation: spin-slow 20s linear infinite; }
//         .animation-delay-1000 { animation-delay: 1s; }
//       `}</style>
//     </div>
//   );
// }

// // Icon Components
// const ChartIcon = ({ className }) => (
//   <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
//   </svg>
// );

// const DroneIcon = ({ className }) => (
//   <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
//   </svg>
// );

// const HospitalIcon = ({ className }) => (
//   <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
//   </svg>
// );

// const UsersIcon = ({ className }) => (
//   <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
//   </svg>
// );

// const PackageIcon = ({ className }) => (
//   <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
//   </svg>
// );

// const AnalyticsIcon = ({ className }) => (
//   <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
//   </svg>
// );

// const SettingsIcon = ({ className }) => (
//   <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//   </svg>
// );

// const PlusIcon = ({ className }) => (
//   <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
//   </svg>
// );

// const ActiveIcon = ({ className }) => (
//   <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
//   </svg>
// );

// const HistoryIcon = ({ className }) => (
//   <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//   </svg>
// );

// const EmergencyIcon = ({ className }) => (
//   <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
//   </svg>
// );

// const TrackIcon = ({ className }) => (
//   <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
//   </svg>
// );

// const ProfileIcon = ({ className }) => (
//   <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//   </svg>
// );

// const AssignmentIcon = ({ className }) => (
//   <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
//   </svg>
// );

// const RouteIcon = ({ className }) => (
//   <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
//   </svg>
// );

// const PerformanceIcon = ({ className }) => (
//   <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
//   </svg>
// );

// const InventoryIcon = ({ className }) => (
//   <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
//   </svg>
// );

// const BillingIcon = ({ className }) => (
//   <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
//   </svg>
// );

// const DollarIcon = ({ className }) => (
//   <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//   </svg>
// );















// Responsive 
// components/dashboard/DashboardLayout.jsx
'use client';

import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import NotificationBell from '@/components/NotificationBell';

export default function DashboardLayout({ children }) {
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const roleThemes = {
    admin: {
      primary: 'purple',
      gradient: 'from-purple-600 to-indigo-600',
      hover: 'hover:bg-purple-900/20',
      text: 'text-purple-400',
      border: 'border-purple-500/20',
      bg: 'bg-purple-950/10',
      bgGradient: 'from-purple-950/50 via-gray-950 to-indigo-950/50',
      gridColor: '#a855f715',
      floatColor: 'text-purple-500/10',
      shadow: 'shadow-purple-500/25'
    },
    hospital_admin: {
      primary: 'red',
      gradient: 'from-red-600 to-rose-600',
      hover: 'hover:bg-red-900/20',
      text: 'text-red-400',
      border: 'border-red-500/20',
      bg: 'bg-red-950/10',
      bgGradient: 'from-red-950/50 via-gray-950 to-rose-950/50',
      gridColor: '#dc262615',
      floatColor: 'text-red-500/10',
      shadow: 'shadow-red-500/25'
    },
    medical_staff: {
      primary: 'red',
      gradient: 'from-red-600 to-rose-600',
      hover: 'hover:bg-red-900/20',
      text: 'text-red-400',
      border: 'border-red-500/20',
      bg: 'bg-red-950/10',
      bgGradient: 'from-red-950/50 via-gray-950 to-rose-950/50',
      gridColor: '#dc262615',
      floatColor: 'text-red-500/10',
      shadow: 'shadow-red-500/25'
    },
    customer: {
      primary: 'blue',
      gradient: 'from-blue-600 to-cyan-600',
      hover: 'hover:bg-blue-900/20',
      text: 'text-blue-400',
      border: 'border-blue-500/20',
      bg: 'bg-blue-950/10',
      bgGradient: 'from-blue-950/50 via-gray-950 to-cyan-950/50',
      gridColor: '#3b82f615',
      floatColor: 'text-blue-500/10',
      shadow: 'shadow-blue-500/25'
    },
    pilot: {
      primary: 'green',
      gradient: 'from-green-600 to-emerald-600',
      hover: 'hover:bg-green-900/20',
      text: 'text-green-400',
      border: 'border-green-500/20',
      bg: 'bg-green-950/10',
      bgGradient: 'from-green-950/50 via-gray-950 to-emerald-950/50',
      gridColor: '#10b98115',
      floatColor: 'text-green-500/10',
      shadow: 'shadow-green-500/25'
    }
  };

  const theme = roleThemes[session?.user?.role] || roleThemes.customer;

  const navigationItems = {
    admin: [
      { href: '/dashboard', label: 'Overview', icon: ChartIcon },
      { href: '/dashboard/admin/pending-assignments', label: 'Awaiting Assignment', icon: AssignmentIcon },
      { href: '/dashboard/admin/recent-activity', label: 'System Activity', icon: PerformanceIcon },
      { href: '/dashboard/hospitals/verify', label: 'Verify Hospitals', icon: HospitalIcon },
      { href: '/dashboard/admin/pricing', label: 'Pricing Config', icon: DollarIcon },
    ],
    hospital_admin: [
      { href: '/dashboard', label: 'Overview', icon: ChartIcon },
      { href: '/dashboard/hospital-admin/payments', label: 'Payments', icon: BillingIcon },
      { href: '/dashboard/hospital-admin/pending-approvals', label: 'Pending Approvals', icon: PackageIcon },
      { href: '/dashboard/hospital-admin/staff-activity', label: 'Staff Activity', icon: UsersIcon },
      { href: '/dashboard/hospital-admin/deliveries', label: 'Delivery History', icon: HistoryIcon },
    ],
    medical_staff: [
      { href: '/dashboard', label: 'Dashboard', icon: ChartIcon },
      { href: '/dashboard/new-delivery', label: 'New Delivery', icon: PlusIcon },
      { href: '/dashboard/track-all', label: 'Active Deliveries', icon: ActiveIcon },
      { href: '/dashboard/delivery-history', label: 'Delivery History', icon: HistoryIcon },
      { href: '/dashboard/new-delivery?urgency=emergency', label: 'Emergency Delivery', icon: EmergencyIcon }
    ],
    customer: [
      { href: '/dashboard', label: 'Overview', icon: ChartIcon },
      { href: '/dashboard/new-delivery', label: 'New Delivery', icon: PlusIcon },
      { href: '/dashboard/track', label: 'Track Delivery', icon: TrackIcon },
      { href: '/dashboard/history', label: 'History', icon: HistoryIcon },
      { href: '/dashboard/profile', label: 'Profile', icon: ProfileIcon }
    ],
    pilot: [
      { href: '/dashboard', label: 'Flight Dashboard', icon: ChartIcon },
      { href: '/dashboard/pilot/assigned-deliveries', label: 'Assignments', icon: AssignmentIcon },
      { href: '', label: 'Flight Routes', icon: RouteIcon },
    ]
  };

  const navItems = navigationItems[session?.user?.role] || navigationItems.customer;

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
  };

  return (
    <div className="min-h-screen bg-gray-950 relative overflow-hidden">
      {/* Animated Background - Similar to Auth Pages */}
      <div className="absolute inset-0 transition-all duration-700">
        {/* Grid Pattern */}
        <div 
          className="absolute inset-0 bg-[size:2rem_2rem] sm:bg-[size:3rem_3rem] md:bg-[size:4rem_4rem]"
          style={{
            backgroundImage: `linear-gradient(to right, ${theme.gridColor} 1px, transparent 1px), linear-gradient(to bottom, ${theme.gridColor} 1px, transparent 1px)`
          }}
        ></div>
        
        {/* Gradient Overlay */}
        <div className={`absolute inset-0 bg-gradient-to-br ${theme.bgGradient} transition-all duration-700`}></div>
        
        {/* Animated Elements */}
        <div className="absolute inset-0">
          {/* Floating Drone Model - Hidden on mobile */}
          <div className="absolute bottom-20 left-10 animate-float-delayed hidden md:block">
            <svg className={`w-20 h-20 md:w-32 md:h-32 lg:w-40 lg:h-40 ${theme.floatColor} transition-colors duration-700`} viewBox="0 0 24 24" fill="currentColor">
              <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
            </svg>
          </div>

          {/* Animated Circuit Lines - Reduced opacity on mobile */}
          <svg className="absolute inset-0 w-full h-full opacity-5">
            <pattern id="circuit" x="0" y="0" width="200" height="200" patternUnits="userSpaceOnUse">
              <path d={`M0 100 L50 100 L50 50 L100 50`} stroke={theme.primary === 'purple' ? '#a855f7' : theme.primary === 'red' ? '#dc2626' : theme.primary === 'blue' ? '#3b82f6' : '#10b981'} strokeWidth="2" fill="none" />
              <circle cx="50" cy="100" r="3" fill={theme.primary === 'purple' ? '#a855f7' : theme.primary === 'red' ? '#dc2626' : theme.primary === 'blue' ? '#3b82f6' : '#10b981'} />
              <circle cx="100" cy="50" r="3" fill={theme.primary === 'purple' ? '#a855f7' : theme.primary === 'red' ? '#dc2626' : theme.primary === 'blue' ? '#3b82f6' : '#10b981'} />
            </pattern>
            <rect width="100%" height="100%" fill="url(#circuit)" />
          </svg>

          {/* Pulsing Rings - Hidden on mobile */}
          <div className="absolute top-1/3 right-1/4 hidden md:block">
            <div className={`w-64 h-64 rounded-full border ${theme.border} animate-pulse-slow`}></div>
            <div className={`w-64 h-64 rounded-full border ${theme.border} animate-pulse-slow animation-delay-1000 absolute inset-0`}></div>
          </div>

          {/* Additional Animated Drone Path - Hidden on mobile */}
          <svg className="absolute inset-0 w-full h-full opacity-10 hidden md:block" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <path id="dronePath" d="M100,500 Q400,300 700,500 T1300,500" />
            </defs>
            <g className="opacity-30">
              <circle r="4" fill={theme.primary === 'purple' ? '#a855f7' : theme.primary === 'red' ? '#dc2626' : theme.primary === 'blue' ? '#3b82f6' : '#10b981'}>
                <animateMotion dur="30s" repeatCount="indefinite">
                  <mpath href="#dronePath" />
                </animateMotion>
              </circle>
            </g>
          </svg>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-gray-900/90 backdrop-blur-xl border-b border-gray-800">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 bg-gradient-to-br ${theme.gradient} rounded-lg flex items-center justify-center shadow-lg ${theme.shadow}`}>
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
              </svg>
            </div>
            <div>
              <h1 className="text-white font-bold text-sm">Vaayu</h1>
              <p className={`text-xs ${theme.text} opacity-60`}>{session?.user?.role?.replace('_', ' ')}</p>
            </div>
          </div>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-gray-900/95 backdrop-blur-xl pt-16">
          <div className="p-6 space-y-4">
            {/* Navigation Items */}
            <nav className="space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    pathname === item.href
                      ? `bg-gradient-to-r ${theme.gradient} text-white shadow-lg ${theme.shadow}`
                      : `text-gray-400 ${theme.hover} hover:text-white`
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>
            {/* User Profile */}
            <div className={`${theme.bg} backdrop-blur-xl rounded-xl p-4 border ${theme.border} mb-6`}>
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 bg-gradient-to-br ${theme.gradient} rounded-full flex items-center justify-center shadow-lg ${theme.shadow}`}>
                  <span className="text-white font-medium text-lg">
                    {session?.user?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-white font-medium">{session?.user?.name}</p>
                  <p className={`text-sm ${theme.text} opacity-60`}>{session?.user?.email}</p>
                </div>
              </div>
              <button
                onClick={handleSignOut}
                className="mt-4 w-full py-2 bg-gray-800/50 backdrop-blur hover:bg-gray-700/50 text-gray-300 rounded-lg transition-all text-sm border border-gray-700"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Layout */}
      <div className="relative z-10 flex h-screen">
        {/* Desktop Sidebar */}
        <aside className={`hidden md:flex ${sidebarOpen ? 'w-64' : 'w-20'} bg-gray-900/50 backdrop-blur-xl border-r ${theme.border} transition-all duration-300 flex-col`}>
          <div className="h-full flex flex-col">
            {/* Logo */}
            <div className="p-4 lg:p-6 border-b border-gray-800">
              <div className="flex items-center justify-between">
                <div className={`flex items-center gap-3 ${!sidebarOpen && 'justify-center'}`}>
                  <div className={`w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-br ${theme.gradient} rounded-xl flex items-center justify-center shadow-lg ${theme.shadow} relative`}>
                    <svg className="w-5 h-5 lg:w-6 lg:h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
                    </svg>
                    <div className="absolute inset-0 rounded-xl border-2 border-white/20 animate-spin-slow"></div>
                  </div>
                  {sidebarOpen && (
                    <div>
                      <h1 className="text-white font-bold text-sm lg:text-base">Vaayu</h1>
                      <p className={`text-xs ${theme.text} opacity-60`}>{session?.user?.role?.replace('_', ' ')}</p>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={sidebarOpen ? "M11 19l-7-7 7-7m8 14l-7-7 7-7" : "M13 5l7 7-7 7M5 5l7 7-7 7"} />
                  </svg>
                </button>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 overflow-y-auto">
              <ul className="space-y-2">
                {navItems.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3 px-3 py-2 lg:px-4 lg:py-3 rounded-xl transition-all group ${
                        pathname === item.href
                          ? `bg-gradient-to-r ${theme.gradient} text-white shadow-lg ${theme.shadow}`
                          : `text-gray-400 ${theme.hover} hover:text-white`
                      } ${!sidebarOpen && 'justify-center'}`}
                    >
                      <item.icon className="w-5 h-5" />
                      {sidebarOpen && <span className="text-sm lg:text-base">{item.label}</span>}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* User Profile */}
            <div className={`p-4 border-t ${theme.border}`}>
              <div className={`${theme.bg} backdrop-blur-xl rounded-xl p-3 lg:p-4 border ${theme.border}`}>
                <div className={`flex items-center gap-3 ${!sidebarOpen && 'justify-center'}`}>
                  <div className={`w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-br ${theme.gradient} rounded-full flex items-center justify-center shadow-lg ${theme.shadow}`}>
                    <span className="text-white font-medium text-sm lg:text-base">
                      {session?.user?.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  {sidebarOpen && (
                    <div className="flex-1">
                      <p className="text-white text-sm font-medium truncate">{session?.user?.name}</p>
                      <p className={`text-xs ${theme.text} opacity-60 truncate`}>{session?.user?.email}</p>
                    </div>
                  )}
                </div>
                {sidebarOpen && (
                  <button
                    onClick={handleSignOut}
                    className="mt-3 lg:mt-4 w-full py-2 bg-gray-800/50 backdrop-blur hover:bg-gray-700/50 text-gray-300 rounded-lg transition-all text-xs lg:text-sm border border-gray-700"
                  >
                    Sign Out
                  </button>
                )}
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto pt-16 md:pt-0 pb-20 md:pb-0">
            {/* Content Wrapper with padding and max-width */}
            <div className="relative z-10">
              {children}
            </div>
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-gray-900/90 backdrop-blur-xl border-t border-gray-800">
        <div className="flex justify-around items-center py-2">
          {navItems.slice(0, 5).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all ${
                pathname === item.href
                  ? `bg-gradient-to-r ${theme.gradient} text-white shadow-lg ${theme.shadow}`
                  : 'text-gray-500'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-xs">{item.label.split(' ')[0]}</span>
            </Link>
          ))}
        </div>
      </nav>

      {/* Styles for animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-30px) rotate(-5deg); }
        }
        @keyframes pulse-slow {
          0%, 100% { transform: scale(1); opacity: 0.2; }
          50% { transform: scale(1.1); opacity: 0.1; }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-delayed { animation: float-delayed 8s ease-in-out infinite; }
        .animate-pulse-slow { animation: pulse-slow 4s ease-in-out infinite; }
        .animate-spin-slow { animation: spin-slow 20s linear infinite; }
        .animation-delay-1000 { animation-delay: 1s; }
      `}</style>
    </div>
  );
}

// Icon Components
const ChartIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
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

const UsersIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const PackageIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
  </svg>
);

const AnalyticsIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const SettingsIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const PlusIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
  </svg>
);

const ActiveIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

const HistoryIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const EmergencyIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);

const TrackIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const ProfileIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const AssignmentIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
  </svg>
);

const RouteIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
  </svg>
);

const PerformanceIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);

const InventoryIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
  </svg>
);

const BillingIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
  </svg>
);

const DollarIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);
/* eslint-disable */

// // app/page.jsx
// 'use client';

// import { useState, useEffect } from 'react';
// import Link from 'next/link';
// import { useRouter } from 'next/navigation';

// export default function LandingPage() {
//   const router = useRouter();
//   const [activeFeature, setActiveFeature] = useState(0);
//   const [scrolled, setScrolled] = useState(false);
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

//   useEffect(() => {
//     const handleScroll = () => {
//       setScrolled(window.scrollY > 50);
//     };
//     window.addEventListener('scroll', handleScroll);
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, []);

//   const features = [
//     {
//       title: "Lightning-Fast Delivery",
//       description: "Emergency medical supplies delivered in minutes, not hours. Our V-TOL UAVs bypass traffic completely.",
//       icon: "⚡",
//       stats: "85% faster than ground transport"
//     },
//     {
//       title: "24/7 Operations",
//       description: "Round-the-clock availability ensures critical supplies reach when needed most, regardless of weather or traffic.",
//       icon: "🌙",
//       stats: "99.9% uptime guaranteed"
//     },
//     {
//       title: "Real-Time Tracking",
//       description: "Monitor your delivery from dispatch to destination with live GPS tracking and ETA updates.",
//       icon: "📍",
//       stats: "Sub-meter accuracy"
//     },
//     {
//       title: "Smart Prioritization",
//       description: "AI-powered system prioritizes emergency deliveries, ensuring life-saving supplies arrive first.",
//       icon: "🧠",
//       stats: "3-tier urgency system"
//     }
//   ];

//   const userTypes = [
//     {
//       role: "Hospitals",
//       color: "from-red-600 to-rose-600",
//       features: [
//         "Instant emergency supply ordering",
//         "Multi-level approval workflows",
//         "Automated billing & reports",
//         "Staff activity monitoring"
//       ]
//     },
//     {
//       role: "Medical Staff",
//       color: "from-blue-600 to-cyan-600",
//       features: [
//         "One-click emergency orders",
//         "Real-time delivery tracking",
//         "Direct hospital-to-hospital transfers",
//         "Delivery confirmation system"
//       ]
//     },
//     {
//       role: "Drone Pilots",
//       color: "from-green-600 to-emerald-600",
//       features: [
//         "Smart assignment algorithm",
//         "Weather-integrated dashboard",
//         "Performance analytics",
//         "State-based operations"
//       ]
//     }
//   ];

//   return (
//     <div className="min-h-screen bg-gray-950 relative overflow-hidden">
//       {/* Navigation */}
//       <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
//         scrolled ? 'bg-gray-900/90 backdrop-blur-xl border-b border-green-500/20' : ''
//       }`}>
//         <div className="container mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex items-center justify-between h-16 sm:h-20">
//             {/* Logo */}
//             <div className="flex items-center gap-3">
//               <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/25 relative">
//                 <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
//                 </svg>
//                 <div className="absolute inset-0 rounded-xl border-2 border-white/20 animate-spin-slow"></div>
//               </div>
//               <h1 className="text-xl sm:text-2xl font-bold text-white">AeroLink</h1>
//             </div>

//             {/* Desktop Menu */}
//             <div className="hidden md:flex items-center gap-8">
//               <a href="#features" className="text-gray-300 hover:text-white transition-colors">Features</a>
//               <a href="#how-it-works" className="text-gray-300 hover:text-white transition-colors">How it Works</a>
//               <a href="#for-you" className="text-gray-300 hover:text-white transition-colors">Solutions</a>
//               <a href="#stats" className="text-gray-300 hover:text-white transition-colors">Impact</a>
//               <Link href="/auth/signin" className="px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg shadow-green-500/25">
//                 Get Started
//               </Link>
//             </div>

//             {/* Mobile Menu Button */}
//             <button
//               onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
//               className="md:hidden text-gray-400 hover:text-white transition-colors"
//             >
//               <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
//               </svg>
//             </button>
//           </div>
//         </div>

//         {/* Mobile Menu */}
//         {mobileMenuOpen && (
//           <div className="md:hidden bg-gray-900/95 backdrop-blur-xl border-t border-green-500/20">
//             <div className="container mx-auto px-4 py-4 space-y-3">
//               <a href="#features" className="block text-gray-300 hover:text-white transition-colors py-2">Features</a>
//               <a href="#how-it-works" className="block text-gray-300 hover:text-white transition-colors py-2">How it Works</a>
//               <a href="#for-you" className="block text-gray-300 hover:text-white transition-colors py-2">Solutions</a>
//               <a href="#stats" className="block text-gray-300 hover:text-white transition-colors py-2">Impact</a>
//               <Link href="/auth/signin" className="block w-full px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg shadow-green-500/25 text-center">
//                 Get Started
//               </Link>
//             </div>
//           </div>
//         )}
//       </nav>

//       {/* Hero Section */}
//       <section className="relative min-h-screen flex items-center justify-center px-4 pt-20">
//         {/* Animated Background */}
//         <div className="absolute inset-0">
//           {/* Grid Pattern */}
//           <div className="absolute inset-0 bg-[linear-gradient(to_right,#10b98115_1px,transparent_1px),linear-gradient(to_bottom,#10b98115_1px,transparent_1px)] bg-[size:2rem_2rem] sm:bg-[size:3rem_3rem] md:bg-[size:4rem_4rem]"></div>
          
//           {/* Gradient Overlay */}
//           <div className="absolute inset-0 bg-gradient-to-br from-green-950/50 via-gray-950 to-emerald-950/50"></div>
          
//           {/* Animated Drone Path */}
//           <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
//             <defs>
//               <path id="heroPath" d="M100,300 Q400,100 700,300 T1300,300" />
//             </defs>
//             <g className="opacity-30">
//               <circle r="6" fill="#10b981">
//                 <animateMotion dur="15s" repeatCount="indefinite">
//                   <mpath href="#heroPath" />
//                 </animateMotion>
//               </circle>
//             </g>
//             <path d="M100,300 Q400,100 700,300 T1300,300" stroke="#10b981" strokeWidth="2" fill="none" opacity="0.2" strokeDasharray="10,5">
//               <animate attributeName="stroke-dashoffset" from="0" to="15" dur="0.5s" repeatCount="indefinite" />
//             </path>
//           </svg>

//           {/* Floating Elements */}
//           <div className="absolute top-1/4 right-1/4 animate-float hidden lg:block">
//             <div className="w-32 h-32 rounded-full bg-gradient-to-br from-green-600/20 to-emerald-600/20 blur-3xl"></div>
//           </div>
//           <div className="absolute bottom-1/4 left-1/4 animate-float-delayed hidden lg:block">
//             <div className="w-48 h-48 rounded-full bg-gradient-to-br from-emerald-600/20 to-green-600/20 blur-3xl"></div>
//           </div>
//         </div>

//         {/* Hero Content */}
//         <div className="relative z-10 max-w-6xl mx-auto text-center">
//           <div className="mb-8 inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 backdrop-blur border border-green-500/20 rounded-full text-green-400 text-sm">
//             <span className="relative flex h-2 w-2">
//               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
//               <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
//             </span>
//             Revolutionizing Medical Logistics
//           </div>

//           <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
//             The Future of Medical
//             <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent"> Delivery is Here</span>
//           </h1>

//           <p className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
//             Fixed-Wing V-TOL UAVs delivering critical medical supplies in minutes. 
//             When every second counts, we fly above the rest.
//           </p>

//           <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
//             <Link href="/auth/signup" className="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg shadow-green-500/25 font-semibold text-lg group relative overflow-hidden">
//               <span className="relative z-10 flex items-center justify-center gap-2">
//                 Start Flying Today
//                 <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
//                 </svg>
//               </span>
//               <div className="absolute inset-0 bg-gradient-to-r from-green-600/20 to-emerald-600/20 translate-y-full group-hover:translate-y-0 transition-transform"></div>
//             </Link>
//             <Link href="#demo" className="px-8 py-4 bg-gray-800/50 backdrop-blur border border-green-500/20 text-white rounded-xl hover:bg-gray-700/50 transition-all font-semibold text-lg">
//               Watch Demo
//             </Link>
//           </div>

//           {/* Quick Stats */}
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
//             {[
//               { value: "85%", label: "Faster Delivery" },
//               { value: "24/7", label: "Availability" },
//               { value: "99.9%", label: "Success Rate" },
//               { value: "500+", label: "Hospitals Ready" }
//             ].map((stat, index) => (
//               <div key={index} className="text-center">
//                 <div className="text-2xl md:text-4xl font-bold text-green-400 mb-1">{stat.value}</div>
//                 <div className="text-sm md:text-base text-gray-400">{stat.label}</div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Scroll Indicator */}
//         <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
//           <svg className="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 13l-7 7-7-7m14-8l-7 7-7-7" />
//           </svg>
//         </div>
//       </section>

//       {/* Features Section */}
//       <section id="features" className="relative py-20 px-4">
//         <div className="max-w-7xl mx-auto">
//           <div className="text-center mb-16">
//             <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
//               Why AeroLink is the Future
//             </h2>
//             <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
//               Traditional logistics can't keep up with medical emergencies. We're changing that.
//             </p>
//           </div>

//           <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
//             {/* Feature Cards */}
//             <div className="space-y-4">
//               {features.map((feature, index) => (
//                 <div
//                   key={index}
//                   onMouseEnter={() => setActiveFeature(index)}
//                   className={`p-6 rounded-2xl border transition-all cursor-pointer ${
//                     activeFeature === index
//                       ? 'bg-green-950/20 border-green-500/40 shadow-lg shadow-green-500/20'
//                       : 'bg-gray-900/50 border-gray-800 hover:border-green-500/20'
//                   }`}
//                 >
//                   <div className="flex items-start gap-4">
//                     <div className="text-3xl">{feature.icon}</div>
//                     <div className="flex-1">
//                       <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
//                       <p className="text-gray-400 mb-2">{feature.description}</p>
//                       <div className="text-sm text-green-400 font-medium">{feature.stats}</div>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {/* Visual Display */}
//             <div className="relative h-[400px] md:h-full min-h-[400px] rounded-2xl overflow-hidden">
//               <div className="absolute inset-0 bg-gradient-to-br from-green-950/50 to-emerald-950/50"></div>
//               <div className="absolute inset-0 bg-[linear-gradient(to_right,#10b98115_1px,transparent_1px),linear-gradient(to_bottom,#10b98115_1px,transparent_1px)] bg-[size:2rem_2rem]"></div>
              
//               {/* Animated Drone Visual */}
//               <div className="absolute inset-0 flex items-center justify-center">
//                 <div className="relative w-64 h-64">
//                   {/* Central Drone */}
//                   <div className="absolute inset-0 flex items-center justify-center">
//                     <svg className="w-32 h-32 text-green-400 animate-float" viewBox="0 0 24 24" fill="currentColor">
//                       <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
//                     </svg>
//                   </div>
                  
//                   {/* Rotating Rings */}
//                   <div className="absolute inset-0 rounded-full border-2 border-green-500/20 animate-spin-slow"></div>
//                   <div className="absolute inset-[-20px] rounded-full border border-green-500/10 animate-spin-slow" style={{ animationDirection: 'reverse', animationDuration: '30s' }}></div>
                  
//                   {/* Pulsing Circles */}
//                   <div className="absolute inset-0 rounded-full bg-green-500/10 animate-ping"></div>
                  
//                   {/* Stats Around Drone */}
//                   <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-green-500/20 backdrop-blur rounded-full text-green-400 text-sm font-medium">
//                     {features[activeFeature].stats}
//                   </div>
//                 </div>
//               </div>

//               {/* Feature Description */}
//               <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-gray-950 to-transparent">
//                 <h3 className="text-2xl font-bold text-white mb-2">{features[activeFeature].title}</h3>
//                 <p className="text-gray-300">{features[activeFeature].description}</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* How It Works */}
//       <section id="how-it-works" className="relative py-20 px-4 bg-gray-900/50">
//         <div className="max-w-7xl mx-auto">
//           <div className="text-center mb-16">
//             <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
//               How AeroLink Works
//             </h2>
//             <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
//               From order to delivery in 4 simple steps
//             </p>
//           </div>

//           <div className="grid md:grid-cols-4 gap-8">
//             {[
//               {
//                 step: "01",
//                 title: "Place Order",
//                 description: "Medical staff creates delivery request with urgency level",
//                 icon: "📦"
//               },
//               {
//                 step: "02",
//                 title: "Smart Approval",
//                 description: "AI-powered system or admin approves based on priority",
//                 icon: "✅"
//               },
//               {
//                 step: "03",
//                 title: "Pilot Assignment",
//                 description: "Nearest available pilot receives the mission instantly",
//                 icon: "👨‍✈️"
//               },
//               {
//                 step: "04",
//                 title: "Swift Delivery",
//                 description: "V-TOL UAV delivers directly to hospital helipad/designated area",
//                 icon: "🚁"
//               }
//             ].map((item, index) => (
//               <div key={index} className="relative">
//                 {/* Connection Line */}
//                 {index < 3 && (
//                   <div className="hidden md:block absolute top-12 left-1/2 w-full h-0.5 bg-gradient-to-r from-green-500/50 to-transparent"></div>
//                 )}
                
//                 <div className="relative bg-gray-800/50 backdrop-blur rounded-2xl p-6 border border-green-500/10 hover:border-green-500/30 transition-all group">
//                   <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-green-500/25">
//                     {item.step}
//                   </div>
                  
//                   <div className="text-3xl mb-4 mt-4">{item.icon}</div>
//                   <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
//                   <p className="text-gray-400 text-sm">{item.description}</p>
                  
//                   <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-green-600/0 to-emerald-600/0 group-hover:from-green-600/5 group-hover:to-emerald-600/5 transition-all"></div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* For Different Users */}
//       <section id="for-you" className="relative py-20 px-4">
//         <div className="max-w-7xl mx-auto">
//           <div className="text-center mb-16">
//             <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
//               Built for Everyone in Healthcare
//             </h2>
//             <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
//               Tailored solutions for every role in the medical delivery ecosystem
//             </p>
//           </div>

//           <div className="grid md:grid-cols-3 gap-8">
//             {userTypes.map((user, index) => (
//               <div key={index} className="group relative">
//                 <div className="absolute inset-0 bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl transform transition-transform group-hover:scale-105"></div>
//                 <div className="relative bg-gray-900/80 backdrop-blur rounded-2xl p-8 border border-gray-800 hover:border-gray-700 transition-all h-full">
//                   <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${user.color} rounded-xl mb-6 shadow-lg`}>
//                     <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
//                     </svg>
//                   </div>
                  
//                   <h3 className="text-2xl font-bold text-white mb-4">{user.role}</h3>
                  
//                   <ul className="space-y-3 mb-6">
//                     {user.features.map((feature, fIndex) => (
//                       <li key={fIndex} className="flex items-start gap-3">
//                         <svg className="w-5 h-5 text-green-400 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//                         </svg>
//                         <span className="text-gray-300">{feature}</span>
//                       </li>
//                     ))}
//                   </ul>
                  
//                   <Link href="/auth/signup" className={`inline-flex items-center gap-2 text-white font-medium group-hover:gap-3 transition-all`}>
//                     Get Started
//                     <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//                     </svg>
//                   </Link>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Stats Section */}
//       <section id="stats" className="relative py-20 px-4 bg-gradient-to-br from-green-950/20 to-emerald-950/20">
//         <div className="max-w-7xl mx-auto">
//           <div className="text-center mb-16">
//             <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
//               Making Real Impact
//             </h2>
//             <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
//               Our numbers speak for themselves
//             </p>
//           </div>

//           <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
//             {[
//               { number: "10K+", label: "Deliveries Completed", trend: "+23%" },
//               { number: "500+", label: "Partner Hospitals", trend: "+45%" },
//               { number: "50K", label: "Lives Impacted", trend: "+67%" },
//               { number: "99.9%", label: "Success Rate", trend: "+2%" }
//             ].map((stat, index) => (
//               <div key={index} className="text-center group">
//                 <div className="relative inline-block mb-2">
//                   <div className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
//                     {stat.number}
//                   </div>
//                   <div className="absolute -top-2 -right-8 text-xs text-green-400 bg-green-500/20 px-2 py-1 rounded-full">
//                     {stat.trend}
//                   </div>
//                 </div>
//                 <div className="text-gray-400">{stat.label}</div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* CTA Section */}
//       <section className="relative py-20 px-4">
//         <div className="max-w-4xl mx-auto text-center">
//           <div className="bg-gradient-to-br from-green-950/50 to-emerald-950/50 rounded-3xl p-8 md:p-16 border border-green-500/20 relative overflow-hidden">
//             {/* Background Pattern */}
//             <div className="absolute inset-0 bg-[linear-gradient(to_right,#10b98120_1px,transparent_1px),linear-gradient(to_bottom,#10b98120_1px,transparent_1px)] bg-[size:2rem_2rem]"></div>
            
//             <div className="relative z-10">
//               <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
//                 Ready to Transform Medical Logistics?
//               </h2>
//               <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
//                 Join hundreds of hospitals already using AeroLink to save lives faster than ever before.
//               </p>
              
//               <div className="flex flex-col sm:flex-row gap-4 justify-center">
//                 <Link href="/auth/signup" className="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg shadow-green-500/25 font-semibold text-lg">
//                   Start Free Trial
//                 </Link>
//                 <Link href="/contact" className="px-8 py-4 bg-gray-800/50 backdrop-blur border border-green-500/20 text-white rounded-xl hover:bg-gray-700/50 transition-all font-semibold text-lg">
//                   Schedule Demo
//                 </Link>
//               </div>
              
//               <p className="mt-6 text-sm text-gray-400">
//                 No credit card required • 30-day free trial • Cancel anytime
//               </p>
//             </div>
            
//             {/* Floating Elements */}
//             <div className="absolute -top-10 -right-10 w-40 h-40 bg-green-500/10 rounded-full blur-3xl"></div>
//             <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl"></div>
//           </div>
//         </div>
//       </section>

//       {/* Footer */}
//       <footer className="relative py-12 px-4 border-t border-gray-800">
//         <div className="max-w-7xl mx-auto">
//           <div className="grid md:grid-cols-4 gap-8 mb-8">
//             {/* Logo & Description */}
//             <div className="md:col-span-1">
//               <div className="flex items-center gap-3 mb-4">
//                 <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/25">
//                   <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
//                   </svg>
//                 </div>
//                 <h3 className="text-xl font-bold text-white">AeroLink</h3>
//               </div>
//               <p className="text-gray-400 text-sm">
//                 Revolutionizing medical deliveries with autonomous drone technology.
//               </p>
//             </div>

//             {/* Quick Links */}
//             <div>
//               <h4 className="text-white font-semibold mb-4">Product</h4>
//               <ul className="space-y-2">
//                 <li><a href="#" className="text-gray-400 hover:text-green-400 transition-colors text-sm">Features</a></li>
//                 <li><a href="#" className="text-gray-400 hover:text-green-400 transition-colors text-sm">Pricing</a></li>
//                 <li><a href="#" className="text-gray-400 hover:text-green-400 transition-colors text-sm">API Docs</a></li>
//                 <li><a href="#" className="text-gray-400 hover:text-green-400 transition-colors text-sm">Integration</a></li>
//               </ul>
//             </div>

//             {/* Company */}
//             <div>
//               <h4 className="text-white font-semibold mb-4">Company</h4>
//               <ul className="space-y-2">
//                 <li><a href="#" className="text-gray-400 hover:text-green-400 transition-colors text-sm">About Us</a></li>
//                 <li><a href="#" className="text-gray-400 hover:text-green-400 transition-colors text-sm">Careers</a></li>
//                 <li><a href="#" className="text-gray-400 hover:text-green-400 transition-colors text-sm">Blog</a></li>
//                 <li><a href="#" className="text-gray-400 hover:text-green-400 transition-colors text-sm">Contact</a></li>
//               </ul>
//             </div>

//             {/* Support */}
//             <div>
//               <h4 className="text-white font-semibold mb-4">Support</h4>
//               <ul className="space-y-2">
//                 <li><a href="#" className="text-gray-400 hover:text-green-400 transition-colors text-sm">Help Center</a></li>
//                 <li><a href="#" className="text-gray-400 hover:text-green-400 transition-colors text-sm">Safety</a></li>
//                 <li><a href="#" className="text-gray-400 hover:text-green-400 transition-colors text-sm">Terms</a></li>
//                 <li><a href="#" className="text-gray-400 hover:text-green-400 transition-colors text-sm">Privacy</a></li>
//               </ul>
//             </div>
//           </div>

//           {/* Bottom Footer */}
//           <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
//             <p className="text-gray-400 text-sm">
//               © 2024 AeroLink. All rights reserved.
//             </p>
//             <div className="flex gap-6">
//               <a href="#" className="text-gray-400 hover:text-green-400 transition-colors">
//                 <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
//                   <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
//                 </svg>
//               </a>
//               <a href="#" className="text-gray-400 hover:text-green-400 transition-colors">
//                 <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
//                   <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
//                 </svg>
//               </a>
//               <a href="#" className="text-gray-400 hover:text-green-400 transition-colors">
//                 <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
//                   <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
//                 </svg>
//               </a>
//             </div>
//           </div>
//         </div>
//       </footer>

//       {/* Styles for animations */}
//       <style jsx>{`
//         @keyframes float {
//           0%, 100% { transform: translateY(0px); }
//           50% { transform: translateY(-20px); }
//         }
//         @keyframes float-delayed {
//           0%, 100% { transform: translateY(0px); }
//           50% { transform: translateY(-30px); }
//         }
//         @keyframes spin-slow {
//           from { transform: rotate(0deg); }
//           to { transform: rotate(360deg); }
//         }
//         .animate-float { animation: float 6s ease-in-out infinite; }
//         .animate-float-delayed { animation: float-delayed 8s ease-in-out infinite; }
//         .animate-spin-slow { animation: spin-slow 20s linear infinite; }
//       `}</style>
//     </div>
//   );
// }








// Same 

// app/page.jsx
'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import ScrollTrigger from 'gsap/ScrollTrigger';

export default function LandingPage() {
  const router = useRouter();
  const [activeFeature, setActiveFeature] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);
    const tl = gsap.timeline();

    tl.from(".gsapNavOptions", {
      y: -70,
      opacity: 0,
      duration: 0.7,
      ease: "power2.out",
    })
    .from(".gsapAuth", {
      opacity: 0,
      duration: 0.7,
      ease: "power2.out",
    }, "-=0.3")
    .from(".gsapLogoBox", {
      opacity: 0,
      duration: 0.7,
      ease: "power2.out",
    }, "-=0.3")
    .from(".gsapLogo", {
      y: 900,
      scale: 7,
      opacity: 0,
      duration: 5,
      ease: "power2.out",
    }, "-=0.3")
    .from(".gsapAerolink", {
      opacity: 0,
      duration: 0.7,
      ease: "power2.out",
    }, "-=0.3")
    .from(".gsapBgBlurs", {
      opacity: 0,
      duration: 0.7,
      ease: "power2.out",
    }, "-=0.3")
    .from(".gsapHeading", {
      opacity: 0,
      duration: 0.7,
      ease: "power2.out",
    }, "-=0.7")
    .from(".gsapSubHeading", {
      opacity: 0,
      duration: 0.7,
      ease: "power2.out",
    }, "-=0.3")
    .from(".gsapQuickStats", {
      y: 70,
      opacity: 0,
      duration: 0.7,
      stagger: 0.2,
      ease: "power2.out",
    }, "-=0.3")
    .from(".gsapSubHeadingBtn", {
      opacity: 0,
      duration: 0.7,
      ease: "power2.out",
    }, "-=0.3")
    .from(".gsapMiniHeading", {
      opacity: 0,
      duration: 0.7,
      ease: "power2.out",
    }, "-=0.3")
    .from(".gsapScrollIndicator", {
      y: -150,
      opacity: 0,
      duration: 0.7,
      ease: "power2.out",
    }, "-=0.1")
    .to(".gsapScrollIndicatorDiv", {
      opacity: 0,
      duration: 0.7,
      ease: "power2.out",
      scrollTrigger:{
        trigger: ".gsapScrollIndicatorDiv",
        markers: false,
        start: "top 70%",
        end: "top 30%",
        scrub:2,
      }
    }, "-=0.1")
    .from(".gsapAeroFutureHeading", {
      opacity: 0,
      scale: 2,
      duration: 0.7,
      ease: "power2.out",
      scrollTrigger:{
        trigger: ".gsapAeroFutureHeading",
        markers: false,
        start: "top 85%",
        end: "top 70%",
        scrub:2,
      }
    }, "-=0.1")
    .from(".gsapFeatureCardsDiv", {
      x: -150,
      opacity: 0,
      duration: 0.7,
      stagger: 0.3,
      ease: "power2.out",
      scrollTrigger:{
        trigger: ".gsapFeatureCards2ndPage",
        markers: false,
        start: "top 75%",
        end: "top 30%",
        scrub:2,
      }
    }, "-=0.1")
    .from(".gsap2ndPagePlaneDiv", {
      y: 100,
      opacity: 0,
      duration: 0.7,
      ease: "power2.out",
      scrollTrigger:{
        trigger: ".gsap2ndPagePlane",
        markers: false,
        start: "top 90%",
        end: "top 65%",
        scrub:2,
      }
    }, "-=0.1")
    .from(".gsapRings", {
      opacity: 0,
      duration: 0.7,
      ease: "power2.out",
      scrollTrigger:{
        trigger: ".gsapRings",
        markers: false,
        start: "top 65%",
        end: "top 55%",
        scrub:2,
      }
    }, "-=0.1")
    .from(".gsapAeroGrid", {
      opacity: 0,
      duration: 0.7,
      ease: "power2.out",
      scrollTrigger:{
        trigger: ".gsapAeroGrid",
        markers: false,
        start: "top 40%",
        end: "top 35%",
        scrub:2,
      }
    }, "-=0.1")
    .from(".gsapAeroGridStats", {
      opacity: 0,
      duration: 0.7,
      ease: "power2.out",
      scrollTrigger:{
        trigger: ".gsapAeroGridStats",
        markers: false,
        start: "top 55%",
        end: "top 45%",
        scrub:2,
      }
    }, "-=0.1")
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      title: "Lightning-Fast Delivery",
      description: "Emergency medical supplies delivered in minutes, not hours. Our V-TOL UAVs bypass traffic completely.",
      icon: "⚡",
      stats: "75% faster than others"
    },
    {
      title: "24/7 Operations",
      description: "Round-the-clock availability ensures critical supplies reach when needed most, regardless of weather or traffic.",
      icon: "🌙",
      stats: "99.9% uptime guaranteed"
    },
    {
      title: "Real-Time Tracking",
      description: "Monitor your delivery from dispatch to destination with live GPS tracking and ETA updates.",
      icon: "🌐",
      stats: "Sub-meter accuracy"
    },
    {
      title: "Smart Prioritization",
      description: "AI-powered system prioritizes emergency deliveries, ensuring life-saving supplies arrive first.",
      icon: "⚖",
      stats: "3-tier urgency system"
    }
  ];

  const userTypes = [
    {
      role: "Hospitals",
      color: "from-red-600 to-rose-600",
      features: [
        "Instant emergency supply ordering",
        "Multi-level approval workflows",
        "Automated billing & reports",
        "Staff activity monitoring"
      ]
    },
    {
      role: "Medical Staff",
      color: "from-blue-600 to-cyan-600",
      features: [
        "One-click emergency orders",
        "Real-time delivery tracking",
        "Direct hospital-to-hospital transfers",
        "Delivery confirmation system"
      ]
    },
    {
      role: "Drone Pilots",
      color: "from-green-600 to-emerald-600",
      features: [
        "Smart assignment algorithm",
        "Weather-integrated dashboard",
        "Performance analytics",
        "State-based operations"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-950 relative overflow-hidden">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-gray-900/90 backdrop-blur-xl border-b border-lime-500/20' : ''
      }`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="gsapLogoBox w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-lime-600 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/25 relative">
                <svg className="gsapLogo w-6 h-6 sm:w-7 sm:h-7 text-white" fill="currentColor" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
                </svg>
                <div className="absolute inset-0 rounded-xl border-2 border-white/20 animate-spin-slow"></div>
              </div>
              <h1 className="gsapAerolink text-xl sm:text-2xl font-bold text-white">AeroLink</h1>
            </div>

            {/* Desktop Menu */}
            <div className="gsapNavOptions hidden md:flex items-center gap-8">
              <a href="#features" className="text-gray-300 hover:text-white transition-colors">Features</a>
              <a href="#how-it-works" className="text-gray-300 hover:text-white transition-colors">How it Works</a>
              <a href="#for-you" className="text-gray-300 hover:text-white transition-colors">Solutions</a>
              <a href="#stats" className="text-gray-300 hover:text-white transition-colors">Impact</a>
            </div>
            <div className="gsapAuth hidden md:flex">
              <Link href="/auth/signin" className="px-6 py-2 mr-3 text-lime-500 font-bold rounded-lg transition-all hover:shadow-lg shadow-lime-500/25">
                Sign In
              </Link>
              <Link href="/auth/signup" className="px-6 py-2 bg-gradient-to-r from-lime-600 to-emerald-600 text-white font-medium rounded-lg hover:from-lime-700 hover:to-emerald-700 transition-all shadow-lg shadow-lime-500/25">
                Get Started
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-gray-900/95 backdrop-blur-xl border-t border-green-500/20">
            <div className="container mx-auto px-4 py-4 space-y-3">
              <a href="#features" className="block text-gray-300 hover:text-white transition-colors py-2">Features</a>
              <a href="#how-it-works" className="block text-gray-300 hover:text-white transition-colors py-2">How it Works</a>
              <a href="#for-you" className="block text-gray-300 hover:text-white transition-colors py-2">Solutions</a>
              <a href="#stats" className="block text-gray-300 hover:text-white transition-colors py-2">Impact</a>
              <Link href="/auth/signin" className="block w-full px-6 py-3 bg-gradient-to-r from-lime-600 to-emerald-600 text-white rounded-lg hover:from-lime-700 hover:to-emerald-700 transition-all shadow-lg shadow-lime-500/25 text-center">
                Sign In
              </Link>
              <Link href="/auth/signup" className="block w-full px-6 py-3 bg-gradient-to-r from-lime-600 to-emerald-600 text-white rounded-lg hover:from-lime-700 hover:to-emerald-700 transition-all shadow-lg shadow-lime-500/25 text-center">
                Get Started
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 pt-20">
        {/* Animated Background */}
        <div className="absolute inset-0">
          {/* Grid Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#10b98115_1px,transparent_1px),linear-gradient(to_bottom,#10b98115_1px,transparent_1px)] bg-[size:2rem_2rem] sm:bg-[size:3rem_3rem] md:bg-[size:4rem_4rem]"></div>
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-lime-950/50 via-gray-950 to-emerald-950/50"></div>
          
          {/* Animated Drone Path */}
          <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <path id="heroPath" d="M100,300 Q400,100 700,300 T1300,300" />
            </defs>
            <g className="opacity-30">
              <circle r="6" fill="#10b981">
                <animateMotion dur="15s" repeatCount="indefinite">
                  <mpath href="#heroPath" />
                </animateMotion>
              </circle>
            </g>
            <path d="M100,300 Q400,100 700,300 T1300,300" stroke="#10b981" strokeWidth="2" fill="none" opacity="0.2" strokeDasharray="10,5">
              <animate attributeName="stroke-dashoffset" from="0" to="15" dur="0.5s" repeatCount="indefinite" />
            </path>
          </svg>

          {/* Floating Elements */}
          <div className="gsapBgBlurs absolute top-1/4 right-1/4 animate-float hidden lg:block">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-lime-600/20 to-emerald-600/20 blur-3xl"></div>
          </div>
          <div className="gsapBgBlurs absolute bottom-1/4 left-1/4 animate-float-delayed hidden lg:block">
            <div className="w-48 h-48 rounded-full bg-gradient-to-br from-emerald-600/20 to-lime-600/20 blur-3xl"></div>
          </div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-6xl mx-auto text-center">
          <div className="gsapMiniHeading mb-8 inline-flex items-center gap-2 px-4 py-2 bg-lime-500/10 backdrop-blur border border-lime-500/20 rounded-full text-lime-400 text-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
            Revolutionizing Medical Logistics
          </div>

          <h1 className="gsapHeading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            The
            <span className="bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent"> Future </span>
            of<br />
            <span className="bg-gradient-to-r from-red-400 to-rose-400 bg-clip-text text-transparent"> Medical </span>
            <span className=""> Delivery is </span>
            <span className="bg-gradient-to-r from-amber-400 to-lime-400 bg-clip-text text-transparent"> Here </span>
          </h1>

          <p className="gsapSubHeading text-lg sm:text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Fixed-Wing V-TOL UAVs delivering critical medical supplies in minutes. 
            When every second counts, we fly above the rest.
          </p>

          <div className="gsapSubHeadingBtn flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/auth/signup" className="px-8 py-4 bg-gradient-to-r from-lime-600 to-emerald-600 text-white rounded-xl hover:from-lime-700 hover:to-emerald-700 transition-all shadow-lg shadow-lime-500/25 font-semibold text-lg group relative overflow-hidden">
              <span className="relative z-10 flex items-center justify-center gap-2">
                Start Flying Today
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-lime-600/20 to-emerald-600/20 translate-y-full group-hover:translate-y-0 transition-transform"></div>
            </Link>
            <Link href="" className="px-8 py-4 bg-gray-800/50 backdrop-blur border border-lime-500/20 text-white rounded-xl hover:bg-gray-700/50 transition-all font-semibold text-lg">
              Watch Demo
            </Link>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {[
              { value: "75%", label: "Faster Delivery" },
              { value: "24/7", label: "Availability" },
              { value: "99.7%", label: "Success Rate" },
              { value: "15 min", label: "Avg. Delivery Time" }
            ].map((stat, index) => (
              <div key={index} className="gsapQuickStats text-center">
                <div className="text-2xl md:text-4xl font-bold text-lime-400 mb-1">{stat.value}</div>
                <div className="text-sm md:text-base text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="gsapScrollIndicatorDiv absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <svg className="gsapScrollIndicator w-6 h-6 text-lime-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 13l-7 7-7-7m14-8l-7 7-7-7" />
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="gsapAeroFutureHeading text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Why AeroLink is the Future
            </h2>
            <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
              Traditional logistics can't keep up with medical emergencies. We are changing that.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {/* Feature Cards */}
            <div className="gsapFeatureCards2ndPage space-y-4">
              {features.map((feature, index) => (
                <div className="gsapFeatureCardsDiv">
                <div
                  key={index}
                  onMouseEnter={() => setActiveFeature(index)}
                  className={`p-6 rounded-2xl border transition-all cursor-pointer ${
                    activeFeature === index
                      ? 'bg-lime-950/20 border-lime-500/40 shadow-lg shadow-lime-500/20'
                      : 'bg-gray-900/50 border-gray-800 hover:border-lime-500/20'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="text-3xl">{feature.icon}</div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                      <p className="text-gray-400 mb-2">{feature.description}</p>
                      <div className="text-sm text-lime-400 font-medium">{feature.stats}</div>
                    </div>
                  </div>
                </div>
                </div>
              ))}
            </div>

            {/* Visual Display */}
            <div className="relative h-[400px] md:h-full min-h-[400px] rounded-2xl overflow-hidden">
              <div className="gsapAeroGrid absolute inset-0 bg-gradient-to-br from-lime-950/50 to-emerald-950/50"></div>
              <div className="gsapAeroGrid animate-grid-scroll absolute inset-0 bg-[linear-gradient(to_right,#10b98115_1px,transparent_1px),linear-gradient(to_bottom,#10b98115_1px,transparent_1px)] bg-[size:2rem_2rem]"></div>
              
              {/* Animated Drone Visual */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-64 h-64">
                  {/* Central Drone */}
                  <div className="gsap2ndPagePlaneDiv absolute inset-0 flex items-center justify-center">
                    <svg className="gsap2ndPagePlane w-32 h-32 text-lime-400 animate-float" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
                    </svg>
                  </div>
                  
                  {/* Rotating Rings */}
                  <div className="gsapRings absolute inset-0 rounded-full border-2 border-lime-500/20"></div>
                  <div className="gsapRings absolute inset-[-20px] rounded-full border border-lime-500/10"></div>
                  
                  {/* Pulsing Circles */}
                  <div className="gsapRings absolute inset-0 rounded-full bg-lime-500/10 animate-ping"></div>
                  
                  {/* Stats Around Drone */}
                  <div className="gsapAeroGridStats absolute -top-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-lime-500/20 backdrop-blur rounded-full text-lime-400 text-sm font-medium">
                    {features[activeFeature].stats}
                  </div>
                </div>
              </div>

              {/* Feature Description */}
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-gray-950 to-transparent">
                <h3 className="text-2xl font-bold text-white mb-2">{features[activeFeature].title}</h3>
                <p className="text-gray-300">{features[activeFeature].description}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="relative z-10 py-20 px-4 bg-gradient-to-br from-lime-950/20 to-emerald-950/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">How AeroLink Works</h2>
            <p className="text-xl text-gray-400">Simple, efficient, and automated delivery process</p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            <StepCard
              number="1"
              title="Place Order"
              description="Hospital staff creates delivery request with urgency level through our platform"
              icon={OrderIcon}
              delay="0"
            />
            <StepCard
              number="2"
              title="Smart Approval"
              description="AI-powered auto-approval or hospital admin approves based on priority"
              icon={DeliveryIcon}
              delay="100"
            />
            <StepCard
              number="3"
              title="Nearest Pilot"
              description="Admin assigns the nearest available pilot for instant delivery"
              icon={DroneAssignIcon}
              delay="200"
            />
            <StepCard
              number="4"
              title="Swift Delivery"
              description="V-TOL UAV delivers directly to hospital with Real-time tracking until safe delivery"
              icon={PackageIcon}
              delay="300"
            />
          </div>
        </div>
      </section>

      {/* Stating Technology */}
      <section id="features" className="relative z-10 py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl font-bold text-white mb-4">
              Our Fixed Wing 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime-400 to-emerald-400"> V-TOL UAV </span>
              Technology
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Ensures the fastest, safest, and most reliable medical deliveries
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={LightningIcon}
              title="Ultra-Fast Delivery"
              description="Average delivery time of 15 minutes within 50km radius. No traffic, no delays."
              gradient="from-yellow-600 to-orange-600"
              delay="0"
            />
            <FeatureCard
              icon={ShieldIcon}
              title="Secure & Reliable"
              description="Temperature-controlled cargo bay, real-time tracking, and 99.7% delivery success rate."
              gradient="from-blue-600 to-cyan-600"
              delay="100"
            />
            <FeatureCard
              icon={ClockIcon}
              title="24/7 Operations"
              description="Round-the-clock availability for emergency medical supplies and critical deliveries."
              gradient="from-purple-600 to-pink-600"
              delay="200"
            />
            <FeatureCard
              icon={RouteIcon}
              title="Optimized Routes"
              description="AI-powered route optimization avoiding obstacles and weather conditions."
              gradient="from-green-600 to-emerald-600"
              delay="300"
            />
            <FeatureCard
              icon={EcoIcon}
              title="Eco-Friendly"
              description="Zero-emission electric drones reducing carbon footprint by 83% compared to traditional delivery."
              gradient="from-teal-600 to-green-600"
              delay="400"
            />
            <FeatureCard
              icon={ScaleIcon}
              title="Scalable Solution"
              description="From single urgent deliveries to bulk medical supply distribution across multiple facilities."
              gradient="from-red-600 to-rose-600"
              delay="500"
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="relative py-20 px-4 bg-gradient-to-br from-lime-950/20 to-emerald-950/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Transforming Future
            </h2>
            <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
              From order to delivery in 4 simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                step: "01",
                title: "Reduced Pollutions",
                description: "Our V-TOL UAV causes least carbon emission ",
                icon: ""
              },
              {
                step: "02",
                title: "Protect Lives",
                description: "Deliver critical supplies in minutes. Every second counts in emergencies.",
                icon: ""
              },
              {
                step: "03",
                title: "Expand Reach",
                description: "Access remote and hard-to-reach areas where traditional vehicles can't go.",
                icon: ""
              },
              {
                step: "04",
                title: "Save Time",
                description: "V-TOL UAV delivers directly to hospital helipad/designated area",
                icon: ""
              }
            ].map((item, index) => (
              <div key={index} className="relative">
                {/* Connection Line */}
                {index < 3 && (
                  <div className="hidden md:block absolute top-12 left-1/2 w-full h-0.5 bg-gradient-to-r from-lime-500/50 to-transparent"></div>
                )}
                
                <div className="relative bg-gray-800/50 backdrop-blur rounded-2xl p-6 border border-lime-500/10 hover:border-lime-500/30 transition-all group">
                  {/* <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-lime-600 to-emerald-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-lime-500/25">
                    {item.step}
                  </div> */}
                  
                  <div className="text-3xl mb-4 mt-4">{item.icon}</div>
                  <h3 className="text-xl font-semibold text-white mb-3">{item.title}</h3>
                  <p className="text-gray-400 text-sm">{item.description}</p>
                  
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-lime-600/0 to-emerald-600/0 group-hover:from-lime-600/5 group-hover:to-emerald-600/5 transition-all"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* For Different Users */}
      <section id="for-you" className="relative py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Built for Everyone in Healthcare
            </h2>
            <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
              Tailored solutions for every role in the medical delivery ecosystem
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {userTypes.map((user, index) => (
              <div key={index} className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl transform transition-transform group-hover:scale-105"></div>
                <div className="relative bg-gray-900/80 backdrop-blur rounded-2xl p-8 border border-gray-800 hover:border-gray-700 transition-all h-full">
                  <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${user.color} rounded-xl mb-6 shadow-lg`}>
                    <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-4">{user.role}</h3>
                  
                  <ul className="space-y-3 mb-6">
                    {user.features.map((feature, fIndex) => (
                      <li key={fIndex} className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-lime-400 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Link href="/auth/signup" className={`inline-flex items-center gap-2 text-white font-medium group-hover:gap-3 transition-all`}>
                    Get Started
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="relative py-20 px-4 bg-gradient-to-br from-lime-950/20 to-emerald-950/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Making Real Impact
            </h2>
            <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
              Our numbers speak for themselves
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: "10K+", label: "Deliveries Completed", trend: "+23%" },
              { number: "500+", label: "Partner Hospitals", trend: "+45%" },
              { number: "50K", label: "Lives Impacted", trend: "+67%" },
              { number: "99.7%", label: "Success Rate", trend: "+3%" }
            ].map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="relative inline-block mb-2">
                  <div className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-lime-400 to-emerald-400 bg-clip-text text-transparent">
                    {stat.number}
                  </div>
                  <div className="absolute -top-2 -right-8 text-xs text-lime-400 bg-lime-500/20 px-2 py-1 rounded-full">
                    {stat.trend}
                  </div>
                </div>
                <div className="text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-br from-lime-950/50 to-emerald-950/50 rounded-3xl p-8 md:p-16 border border-lime-500/20 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#10b98120_1px,transparent_1px),linear-gradient(to_bottom,#10b98120_1px,transparent_1px)] bg-[size:2rem_2rem]"></div>
            
            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                Ready to Transform Medical Logistics?
              </h2>
              <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Join hundreds of hospitals already using AeroLink to save lives faster than ever before.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/auth/signup" className="px-8 py-4 bg-gradient-to-r from-lime-600 to-emerald-600 text-white rounded-xl hover:from-lime-700 hover:to-emerald-700 transition-all shadow-lg shadow-lime-500/25 font-semibold text-lg">
                  Fly High
                </Link>
                <Link href="/contact" className="px-8 py-4 bg-gray-800/50 backdrop-blur border border-lime-500/20 text-white rounded-xl hover:bg-gray-700/50 transition-all font-semibold text-lg">
                  Demo
                </Link>
              </div>
              
              <p className="mt-6 text-sm text-gray-400">
                No registration charge • Cancel anytime
              </p>
            </div>
            
            {/* Floating Elements */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-lime-500/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl"></div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-12 px-4 border-t border-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* Logo & Description */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-lime-600 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-lime-500/25">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white">AeroLink</h3>
              </div>
              <p className="text-gray-400 text-sm">
                Revolutionizing medical deliveries with autonomous drone technology.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-lime-400 transition-colors text-sm">Features</a></li>
                <li><a href="#" className="text-gray-400 hover:text-lime-400 transition-colors text-sm">Pricing</a></li>
                <li><a href="#" className="text-gray-400 hover:text-lime-400 transition-colors text-sm">API Docs</a></li>
                <li><a href="#" className="text-gray-400 hover:text-lime-400 transition-colors text-sm">Integration</a></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-lime-400 transition-colors text-sm">About Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-lime-400 transition-colors text-sm">Careers</a></li>
                <li><a href="#" className="text-gray-400 hover:text-lime-400 transition-colors text-sm">Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-lime-400 transition-colors text-sm">Contact</a></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="text-white font-semibold mb-4">Support</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-lime-400 transition-colors text-sm">Help Center</a></li>
                <li><a href="#" className="text-gray-400 hover:text-lime-400 transition-colors text-sm">Safety</a></li>
                <li><a href="#" className="text-gray-400 hover:text-lime-400 transition-colors text-sm">Terms</a></li>
                <li><a href="#" className="text-gray-400 hover:text-lime-400 transition-colors text-sm">Privacy</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © 2025 AeroLink. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-gray-400 hover:text-lime-400 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-lime-400 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-lime-400 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Styles for animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-30px); }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-delayed { animation: float-delayed 8s ease-in-out infinite; }
        
        @keyframes grid-scroll {
            0% { transform: translateY(-2rem); }
            100% { transform: translateY(0); }
        }
        .animate-grid-scroll { animation: grid-scroll 0.7s linear infinite; }
      `}</style>
    </div>
  );
}

function StepCard({ number, title, description, icon: Icon, delay }) {
  return (
    <div 
      className="text-center animate-fade-in-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="relative mb-6">
        <div className="w-20 h-20 bg-gray-800/50 backdrop-blur rounded-2xl flex items-center justify-center mx-auto border border-green-500/20">
          <Icon className="w-10 h-10 text-green-400" />
        </div>
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-green-600 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
          {number}
        </div>
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-gray-400 text-sm">{description}</p>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description, gradient, delay }) {
  return (
    <div 
      className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-8 border border-green-500/20 hover:border-green-500/30 transition-all group hover:shadow-xl hover:shadow-green-500/10 hover:-translate-y-1 animate-fade-in-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className={`w-16 h-16 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
        <Icon className="w-8 h-8 text-white" />
      </div>
      <h3 className="text-xl font-semibold text-white mb-3">{title}</h3>
      <p className="text-gray-400 leading-relaxed">{description}</p>
    </div>
  );
}

// Icon Components
const DroneIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
  </svg>
);

const MedicalIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M19 8h-2v3h-3v2h3v3h2v-3h3v-2h-3zM2 12v2h8v-2z M13 2v8h8V2z M14 9V3h6v6z" />
  </svg>
);

const ArrowIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4-4m0 0l-4-4m4 4H3" />
  </svg>
);

const LightningIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

const ShieldIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const ClockIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const RouteIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
  </svg>
);

const EcoIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ScaleIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
  </svg>
);

const OrderIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
  </svg>
);

const DroneAssignIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const PackageIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
  </svg>
);

const DeliveryIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const CheckIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const SpeedIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

const QuoteIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
  </svg>
);

const TwitterIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
  </svg>
);

const LinkedInIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const GitHubIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
  </svg>
);
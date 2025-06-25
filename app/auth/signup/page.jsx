// // app/auth/signup/page.jsx
// 'use client';

// import { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import Link from 'next/link';
// import { signIn } from 'next-auth/react';

// export default function SignUpPage() {
//   const router = useRouter();
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [userType, setUserType] = useState('hospital');
//   const [formData, setFormData] = useState({
//     email: '',
//     password: '',
//     confirmPassword: '',
//     name: '',
//     phoneNumber: '',
//     hospitalData: {
//       name: '',
//       registrationNumber: '',
//       type: 'general',
//       contactPhone: '',
//       contactEmail: '',
//       website: '',
//       address: {
//         street: '',
//         city: '',
//         state: '',
//         zipCode: '',
//         country: ''
//       }
//     },
//     pilotData: {
//       licenseNumber: '',
//       experience: '',
//       certifications: [],
//       address: {
//         street: '',
//         city: '',
//         state: '',
//         zipCode: '',
//         country: ''
//       }
//     }
//   });

//   const themeColors = {
//     individual: {
//       primary: 'blue',
//       gradient: 'from-blue-600 to-cyan-600',
//       hover: 'from-blue-700 to-cyan-700',
//       bg: 'from-blue-950/50 via-gray-950 to-cyan-950/50',
//       border: 'border-blue-500/10',
//       text: 'text-blue-400',
//       shadow: 'shadow-blue-500/25'
//     },
//     hospital: {
//       primary: 'red',
//       gradient: 'from-red-600 to-rose-600',
//       hover: 'from-red-700 to-rose-700',
//       bg: 'from-red-950/50 via-gray-950 to-rose-950/50',
//       border: 'border-red-500/10',
//       text: 'text-red-400',
//       shadow: 'shadow-red-500/25'
//     },
//     pilot: {
//       primary: 'green',
//       gradient: 'from-green-600 to-emerald-600',
//       hover: 'from-green-700 to-emerald-700',
//       bg: 'from-green-950/50 via-gray-950 to-emerald-950/50',
//       border: 'border-green-500/10',
//       text: 'text-green-400',
//       shadow: 'shadow-green-500/25'
//     }
//   };

//   const theme = themeColors[userType];

//   const geocodeAddress = async (address) => {
//     const { street, city, state, zipCode, country } = address;
    
//     const queries = [
//       `${street}, ${city}, ${state}, ${zipCode}, ${country}`,
//       `${street}, ${city}, ${state}, ${country}`,
//       `${city}, ${state}, ${zipCode}, ${country}`,
//       `${city}, ${state}, ${country}`,
//     ];

//     console.log('Geocoding address:', queries);
    
//     for (const query of queries) {
//       console.log('Trying query:', query);

//       try {
//         const response = await fetch(
//           `https://nominatim.openstreetmap.org/search?` + 
//           `q=${encodeURIComponent(query)}&format=json&limit=1`,
//           {
//             headers: {
//               'Accept': 'application/json',
//               'Accept-Language': 'en',
//             }
//           }
//         );

//         console.log('API Response status:', response.status);
//         console.log('API Response OK:', response.ok);
        
//         if (!response.ok) {
//           console.error('API request failed:', response.statusText);
//           throw new Error(`API request failed: ${response.status}`);
//         }

//         const data = await response.json();

//         console.log('Geocoding response:', data);
        
//         if (data && data.length > 0) {
//           const coordinates = {
//             lat: parseFloat(data[0].lat),
//             lng: parseFloat(data[0].lon)
//           };
          
//           console.log('✅ Geocoding successful!');
//           console.log('Extracted coordinates:', coordinates);
//           console.log('Google Maps link:', `https://www.google.com/maps?q=${coordinates.lat},${coordinates.lng}`);
          
//           return coordinates;
//         }

//         throw new Error('Address not found');
//       } catch (error) {
//         console.error('Geocoding error:', error);
//       }
//     }
//     return null;
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     if (name.startsWith('hospital.')) {
//       const field = name.split('.')[1];
//       setFormData(prev => ({
//         ...prev,
//         hospitalData: {
//           ...prev.hospitalData,
//           [field]: value
//         }
//       }));
//     } else if (name.startsWith('address.')) {
//       const field = name.split('.')[1];
//       setFormData(prev => ({
//         ...prev,
//         hospitalData: {
//           ...prev.hospitalData,
//           address: {
//             ...prev.hospitalData.address,
//             [field]: value
//           }
//         }
//       }));
//     } else if (name.startsWith('pilot.')) {
//       const field = name.split('.')[1];
//       setFormData(prev => ({
//         ...prev,
//         pilotData: {
//           ...prev.pilotData,
//           [field]: value
//         }
//       }));
//     } else if (name.startsWith('pilotAddress.')) {
//       const field = name.split('.')[1];
//       setFormData(prev => ({
//         ...prev,
//         pilotData: {
//           ...prev.pilotData,
//           address: {
//             ...prev.pilotData.address,
//             [field]: value
//           }
//         }
//       }));
//     } else {
//       setFormData(prev => ({ ...prev, [name]: value }));
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     setLoading(true);

//     if (formData.password !== formData.confirmPassword) {
//       setError('Passwords do not match');
//       setLoading(false);
//       return;
//     }

//     try {
//       const payload = {
//         email: formData.email,
//         password: formData.password,
//         name: formData.name,
//         phoneNumber: formData.phoneNumber,
//         userType
//       };

//       if (userType === 'hospital') {
//         // Geocode the address
//         const coordinates = await geocodeAddress(formData.hospitalData.address);
        
//         if (!coordinates) {
//           setError('Unable to verify hospital address. Please check the address details.');
//           setLoading(false);
//           return;
//         }
//         payload.hospitalData = {
//           ...formData.hospitalData,
//           address: {
//             ...formData.hospitalData.address,
//             coordinates: {
//               type: 'Point',
//               coordinates: [coordinates.lng, coordinates.lat]
//             }
//           }
//         };
//       } else if (userType === 'pilot') {
//         // Geocode pilot address
//         const coordinates = await geocodeAddress(formData.pilotData.address);
        
//         if (!coordinates) {
//           setError('Unable to verify address. Please check the address details.');
//           setLoading(false);
//           return;
//         }
        
//         payload.pilotData = formData.pilotData;
//         payload.address = {
//           ...formData.pilotData.address,
//           coordinates: {
//             type: 'Point',
//             coordinates: [coordinates.lng, coordinates.lat]
//           }
//         };
//       }

//       const res = await fetch('/api/auth/register', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(payload)
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         throw new Error(data.error || 'Registration failed');
//       }

//       router.push('/auth/verify?email=' + encodeURIComponent(formData.email));
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-950 relative overflow-hidden">
//       {/* Dynamic Background based on user type */}
//       <div className="absolute inset-0 transition-all duration-700">
//         {/* Grid Pattern */}
//         <div className={`absolute inset-0 bg-[linear-gradient(to_right,${userType === 'individual' ? '#3b82f615' : userType === 'pilot' ? '#10b98115' : '#dc262615'}_1px,transparent_1px),linear-gradient(to_bottom,${userType === 'individual' ? '#3b82f615' : userType === 'pilot' ? '#10b98115' : '#dc262615'}_1px,transparent_1px)] bg-[size:4rem_4rem]`}></div>
        
//         {/* Gradient Overlay */}
//         <div className={`absolute inset-0 bg-gradient-to-br ${theme.bg} transition-all duration-700`}></div>
        
//         {/* Animated Elements */}
//         <div className="absolute inset-0">
//           {/* Floating Drone Models */}
//           <div className="absolute top-10 right-10 animate-float hidden md:block">
//             <svg className={`w-32 h-32 ${userType === 'individual' ? 'text-blue-500/10' : userType === 'pilot' ? 'text-green-500/10' : 'text-red-500/10'} transition-colors duration-700`} viewBox="0 0 100 100" fill="currentColor">
//               <circle cx="50" cy="50" r="45" opacity="0.5"/>
//               <path d="M50 20 L30 40 L30 60 L50 80 L70 60 L70 40 Z" />
//               <path d="M20 35 L30 40 M30 60 L20 65 M80 35 L70 40 M70 60 L80 65" stroke="currentColor" strokeWidth="2" fill="none"/>
//             </svg>
//           </div>
          
//           <div className="absolute bottom-20 left-10 animate-float-delayed">
//             <svg className={`w-40 h-40 ${userType === 'individual' ? 'text-cyan-500/10' : userType === 'pilot' ? 'text-emerald-500/10' : 'text-rose-500/10'} transition-colors duration-700`} viewBox="0 0 24 24" fill="currentColor">
//               <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
//             </svg>
//           </div>

//           {/* Animated Circuit Lines */}
//           <svg className="absolute inset-0 w-full h-full opacity-5">
//             <pattern id="circuit" x="0" y="0" width="200" height="200" patternUnits="userSpaceOnUse">
//               <path d="M0 100 L50 100 L50 50 L100 50" stroke={userType === 'individual' ? '#3b82f6' : userType === 'pilot' ? '#10b981' : '#dc2626'} strokeWidth="2" fill="none" />
//               <circle cx="50" cy="100" r="3" fill={userType === 'individual' ? '#3b82f6' : userType === 'pilot' ? '#10b981' : '#dc2626'} />
//               <circle cx="100" cy="50" r="3" fill={userType === 'individual' ? '#3b82f6' : userType === 'pilot' ? '#10b981' : '#dc2626'} />
//             </pattern>
//             <rect width="100%" height="100%" fill="url(#circuit)" />
//           </svg>

//           {/* Pulsing Rings */}
//           <div className="absolute top-1/3 right-1/4">
//             <div className={`w-64 h-64 rounded-full border ${theme.border} animate-pulse-slow`}></div>
//             <div className={`w-64 h-64 rounded-full border ${theme.border} animate-pulse-slow animation-delay-1000 absolute inset-0`}></div>
//           </div>
//         </div>
//       </div>

//       {/* Content */}
//       <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12">
//         <div className="max-w-2xl w-full">
//           {/* Logo/Brand */}
//           <div className="text-center mb-8">
//             <div className={`inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br ${theme.gradient} rounded-2xl mb-4 shadow-2xl ${theme.shadow} relative transition-all duration-700`}>
//               <svg className="w-15 h-15 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
//               </svg>
//               <div className="absolute inset-0 rounded-2xl border-2 border-white/20 animate-spin-slow"></div>
//             </div>
//             <h1 className="text-4xl font-bold text-white mb-2">Join the Future</h1>
//             <p className={`${theme.text} opacity-80 transition-colors duration-700`}>Register</p>
//           </div>

//           {/* User Type Selection */}
//           <div className="mb-6">
//             <div className="flex gap-4 justify-center flex-wrap">
//               <button
//                 type="button"
//                 onClick={() => setUserType('individual')}
//                 className={`hidden px-6 py-3 rounded-xl font-medium transition-all duration-500 ${
//                   userType === 'individual'
//                     ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-500/25'
//                     : 'bg-gray-800/50 backdrop-blur text-gray-400 hover:bg-gray-700/50 border border-gray-700'
//                 }`}
//               >
//                 <div className="flex items-center gap-2">
//                   <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//                   </svg>
//                   Individual
//                 </div>
//               </button>
//               <button
//                 type="button"
//                 onClick={() => setUserType('hospital')}
//                 className={`px-6 py-3 rounded-xl font-medium transition-all duration-500 ${
//                   userType === 'hospital'
//                     ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg shadow-red-500/25'
//                     : 'bg-gray-800/50 backdrop-blur text-gray-400 hover:bg-gray-700/50 border border-gray-700'
//                 }`}
//               >
//                 <div className="flex items-center gap-2">
//                   <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
//                   </svg>
//                   Hospital
//                 </div>
//               </button>
//               <button
//                 type="button"
//                 onClick={() => setUserType('pilot')}
//                 className={`px-6 py-3 rounded-xl font-medium transition-all duration-500 ${
//                   userType === 'pilot'
//                     ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg shadow-green-500/25'
//                     : 'bg-gray-800/50 backdrop-blur text-gray-400 hover:bg-gray-700/50 border border-gray-700'
//                 }`}
//               >
//                 <div className="flex items-center gap-2">
//                   <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
//                   </svg>
//                   Drone Pilot
//                 </div>
//               </button>
//             </div>
//           </div>

//           {/* Form */}
//           <form onSubmit={handleSubmit} className={`bg-gray-900/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border ${theme.border} transition-all duration-700`}>
//             {error && (
//               <div className="mb-6 p-4 bg-red-500/10 backdrop-blur border border-red-500/20 rounded-xl text-red-400 flex items-center gap-2">
//                 <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                 </svg>
//                 {error}
//               </div>
//             )}

//             {/* Basic Information */}
//             <div className="space-y-6 mb-8">
//               <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
//                 <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${theme.gradient} flex items-center justify-center`}>
//                   <span className="text-white text-sm font-bold">1</span>
//                 </div>
//                 Basic Information
//               </h2>
              
//               <div>
//                 <label className={`block text-sm font-medium ${theme.text} mb-2 transition-colors duration-700`}>
//                   Full Name
//                 </label>
//                 <div className="relative">
//                   <input
//                     type="text"
//                     name="name"
//                     value={formData.name}
//                     onChange={handleChange}
//                     required
//                     className={`w-full px-4 py-3 pl-12 bg-gray-800/50 backdrop-blur border ${theme.border} rounded-xl text-white focus:ring-2 focus:ring-${theme.primary}-500 focus:border-transparent transition-all`}
//                     placeholder="John Doe"
//                   />
//                   <svg className={`w-5 h-5 ${theme.text} opacity-50 absolute left-4 top-3.5`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//                   </svg>
//                 </div>
//               </div>

//               <div>
//                 <label className={`block text-sm font-medium ${theme.text} mb-2 transition-colors duration-700`}>
//                   Email Address
//                 </label>
//                 <div className="relative">
//                   <input
//                     type="email"
//                     name="email"
//                     value={formData.email}
//                     onChange={handleChange}
//                     required
//                     className={`w-full px-4 py-3 pl-12 bg-gray-800/50 backdrop-blur border ${theme.border} rounded-xl text-white focus:ring-2 focus:ring-${theme.primary}-500 focus:border-transparent transition-all`}
//                     placeholder="john@example.com"
//                   />
//                   <svg className={`w-5 h-5 ${theme.text} opacity-50 absolute left-4 top-3.5`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
//                   </svg>
//                 </div>
//               </div>

//               <div>
//                 <label className={`block text-sm font-medium ${theme.text} mb-2 transition-colors duration-700`}>
//                   Phone Number
//                 </label>
//                 <div className="relative">
//                   <input
//                     type="tel"
//                     name="phoneNumber"
//                     value={formData.phoneNumber}
//                     onChange={handleChange}
//                     required
//                     className={`w-full px-4 py-3 pl-12 bg-gray-800/50 backdrop-blur border ${theme.border} rounded-xl text-white focus:ring-2 focus:ring-${theme.primary}-500 focus:border-transparent transition-all`}
//                     placeholder="+1 (555) 000-0000"
//                   />
//                   <svg className={`w-5 h-5 ${theme.text} opacity-50 absolute left-4 top-3.5`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
//                   </svg>
//                 </div>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <label className={`block text-sm font-medium ${theme.text} mb-2 transition-colors duration-700`}>
//                     Password
//                   </label>
//                   <div className="relative">
//                     <input
//                       type="password"
//                       name="password"
//                       value={formData.password}
//                       onChange={handleChange}
//                       required
//                       minLength={8}
//                       className={`w-full px-4 py-3 pl-12 bg-gray-800/50 backdrop-blur border ${theme.border} rounded-xl text-white focus:ring-2 focus:ring-${theme.primary}-500 focus:border-transparent transition-all`}
//                       placeholder="••••••••"
//                     />
//                     <svg className={`w-5 h-5 ${theme.text} opacity-50 absolute left-4 top-3.5`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
//                     </svg>
//                   </div>
//                 </div>
//                 <div>
//                   <label className={`block text-sm font-medium ${theme.text} mb-2 transition-colors duration-700`}>
//                     Confirm Password
//                   </label>
//                   <div className="relative">
//                     <input
//                       type="password"
//                       name="confirmPassword"
//                       value={formData.confirmPassword}
//                       onChange={handleChange}
//                       required
//                       className={`w-full px-4 py-3 pl-12 bg-gray-800/50 backdrop-blur border ${theme.border} rounded-xl text-white focus:ring-2 focus:ring-${theme.primary}-500 focus:border-transparent transition-all`}
//                       placeholder="••••••••"
//                     />
//                     <svg className={`w-5 h-5 ${theme.text} opacity-50 absolute left-4 top-3.5`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
//                     </svg>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Hospital Information (conditional) */}
//             {userType === 'hospital' && (
//               <div className="space-y-6 mb-8 pt-8 border-t border-red-500/10">
//                 <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
//                   <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-600 to-rose-600 flex items-center justify-center">
//                     <span className="text-white text-sm font-bold">2</span>
//                   </div>
//                   Hospital Information
//                 </h2>
                
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium text-red-400 mb-2">
//                       Hospital Name
//                     </label>
//                     <input
//                       type="text"
//                       name="hospital.name"
//                       value={formData.hospitalData.name}
//                       onChange={handleChange}
//                       required
//                       className="w-full px-4 py-3 bg-gray-800/50 backdrop-blur border border-red-500/20 rounded-xl text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-red-400 mb-2">
//                       Registration Number
//                     </label>
//                     <input
//                       type="text"
//                       name="hospital.registrationNumber"
//                       value={formData.hospitalData.registrationNumber}
//                       onChange={handleChange}
//                       required
//                       className="w-full px-4 py-3 bg-gray-800/50 backdrop-blur border border-red-500/20 rounded-xl text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
//                     />
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium text-red-400 mb-2">
//                       Hospital Type
//                     </label>
//                     <select
//                       name="hospital.type"
//                       value={formData.hospitalData.type}
//                       onChange={handleChange}
//                       className="w-full px-4 py-3 bg-gray-800/50 backdrop-blur border border-red-500/20 rounded-xl text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
//                     >
//                       <option value="general">General Hospital</option>
//                       <option value="specialized">Specialized Hospital</option>
//                       <option value="clinic">Clinic</option>
//                       <option value="emergency">Emergency Center</option>
//                     </select>
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-red-400 mb-2">
//                       Contact Phone
//                     </label>
//                     <input
//                       type="tel"
//                       name="hospital.contactPhone"
//                       value={formData.hospitalData.contactPhone}
//                       onChange={handleChange}
//                       required
//                       className="w-full px-4 py-3 bg-gray-800/50 backdrop-blur border border-red-500/20 rounded-xl text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
//                     />
//                   </div>
//                 </div>

//                 {/* Address fields */}
//                 <div className="space-y-4">
//                   <h3 className="text-lg font-medium text-white flex items-center gap-2">
//                     <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
//                     </svg>
//                     Hospital Address
//                   </h3>
//                   <input
//                     type="text"
//                     name="address.street"
//                     placeholder="Street Address"
//                     value={formData.hospitalData.address.street}
//                     onChange={handleChange}
//                     required
//                     className="w-full px-4 py-3 bg-gray-800/50 backdrop-blur border border-red-500/20 rounded-xl text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
//                   />
//                   <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                     <input
//                       type="text"
//                       name="address.city"
//                       placeholder="City"
//                       value={formData.hospitalData.address.city}
//                       onChange={handleChange}
//                       required
//                       className="w-full px-4 py-3 bg-gray-800/50 backdrop-blur border border-red-500/20 rounded-xl text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
//                     />
//                     <input
//                       type="text"
//                       name="address.state"
//                       placeholder="State"
//                       value={formData.hospitalData.address.state}
//                       onChange={handleChange}
//                       required
//                       className="w-full px-4 py-3 bg-gray-800/50 backdrop-blur border border-red-500/20 rounded-xl text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
//                     />
//                     <input
//                       type="text"
//                       name="address.zipCode"
//                       placeholder="ZIP Code"
//                       value={formData.hospitalData.address.zipCode}
//                       onChange={handleChange}
//                       required
//                       className="w-full px-4 py-3 bg-gray-800/50 backdrop-blur border border-red-500/20 rounded-xl text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
//                     />
//                     <input
//                       type="text"
//                       name="address.country"
//                       placeholder="Country"
//                       value={formData.hospitalData.address.country}
//                       onChange={handleChange}
//                       required
//                       className="w-full px-4 py-3 bg-gray-800/50 backdrop-blur border border-red-500/20 rounded-xl text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
//                     />
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Pilot Information (conditional) */}
//             {userType === 'pilot' && (
//               <div className="space-y-6 mb-8 pt-8 border-t border-green-500/10">
//                 <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
//                   <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-600 to-emerald-600 flex items-center justify-center">
//                     <span className="text-white text-sm font-bold">2</span>
//                   </div>
//                   Pilot Information
//                 </h2>
                
//                 <div className="bg-green-500/10 backdrop-blur rounded-xl p-4 mb-4">
//                   <p className="text-green-400 text-sm flex items-start gap-2">
//                     <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                     </svg>
//                     Your pilot application will be reviewed by our team. You'll receive an email once your verification is complete.
//                   </p>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium text-green-400 mb-2">
//                       Pilot License Number
//                     </label>
//                     <input
//                       type="text"
//                       name="pilot.licenseNumber"
//                       value={formData.pilotData.licenseNumber}
//                       onChange={handleChange}
//                       required
//                       placeholder="FAA-123456789"
//                       className="w-full px-4 py-3 bg-gray-800/50 backdrop-blur border border-green-500/20 rounded-xl text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-green-400 mb-2">
//                       Years of Experience
//                     </label>
//                     <input
//                       type="number"
//                       name="pilot.experience"
//                       value={formData.pilotData.experience}
//                       onChange={handleChange}
//                       required
//                       min="0"
//                       placeholder="5"
//                       className="w-full px-4 py-3 bg-gray-800/50 backdrop-blur border border-green-500/20 rounded-xl text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-green-400 mb-2">
//                     Certifications (Optional)
//                   </label>
//                   <textarea
//                     name="pilot.certifications"
//                     value={formData.pilotData.certifications.join('\n')}
//                     onChange={(e) => {
//                       const certs = e.target.value.split('\n').filter(cert => cert.trim());
//                       setFormData(prev => ({
//                         ...prev,
//                         pilotData: {
//                           ...prev.pilotData,
//                           certifications: certs
//                         }
//                       }));
//                     }}
//                     placeholder="Enter each certification on a new line&#10;e.g., Part 107 Remote Pilot Certificate&#10;Night Operations Authorization"
//                     rows={4}
//                     className="w-full px-4 py-3 bg-gray-800/50 backdrop-blur border border-green-500/20 rounded-xl text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
//                   />
//                 </div>

//                 {/* Pilot Address fields */}
//                 <div className="space-y-4">
//                   <h3 className="text-lg font-medium text-white flex items-center gap-2">
//                     <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
//                     </svg>
//                     Pilot Address
//                   </h3>
//                   <input
//                     type="text"
//                     name="pilotAddress.street"
//                     placeholder="Street Address"
//                     value={formData.pilotData.address.street}
//                     onChange={handleChange}
//                     required
//                     className="w-full px-4 py-3 bg-gray-800/50 backdrop-blur border border-green-500/20 rounded-xl text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
//                   />
//                   <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                     <input
//                       type="text"
//                       name="pilotAddress.city"
//                       placeholder="City"
//                       value={formData.pilotData.address.city}
//                       onChange={handleChange}
//                       required
//                       className="w-full px-4 py-3 bg-gray-800/50 backdrop-blur border border-green-500/20 rounded-xl text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
//                     />
//                     <input
//                       type="text"
//                       name="pilotAddress.state"
//                       placeholder="State"
//                       value={formData.pilotData.address.state}
//                       onChange={handleChange}
//                       required
//                       className="w-full px-4 py-3 bg-gray-800/50 backdrop-blur border border-green-500/20 rounded-xl text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
//                     />
//                     <input
//                       type="text"
//                       name="pilotAddress.zipCode"
//                       placeholder="ZIP Code"
//                       value={formData.pilotData.address.zipCode}
//                       onChange={handleChange}
//                       required
//                       className="w-full px-4 py-3 bg-gray-800/50 backdrop-blur border border-green-500/20 rounded-xl text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
//                     />
//                     <input
//                       type="text"
//                       name="pilotAddress.country"
//                       placeholder="Country"
//                       value={formData.pilotData.address.country}
//                       onChange={handleChange}
//                       required
//                       className="w-full px-4 py-3 bg-gray-800/50 backdrop-blur border border-green-500/20 rounded-xl text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
//                     />
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Submit Button */}
//             <button
//               type="submit"
//               disabled={loading}
//               className={`w-full py-4 bg-gradient-to-r ${theme.gradient} hover:${theme.hover} text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg ${theme.shadow} relative overflow-hidden group`}
//             >
//               <span className="relative z-10 flex items-center justify-center gap-2">
//                 {loading ? (
//                   <>
//                     <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
//                       <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                       <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                     </svg>
//                     Creating Account...
//                   </>
//                 ) : (
//                   <>
//                     <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//                     </svg>
//                     Create Account
//                   </>
//                 )}
//               </span>
//               <div className={`absolute inset-0 bg-gradient-to-r ${theme.gradient} opacity-20 translate-y-full group-hover:translate-y-0 transition-transform`}></div>
//             </button>

//             {/* Divider */}
//             {/* <div className="relative my-8">
//               <div className="absolute inset-0 flex items-center">
//                 <div className={`w-full border-t ${theme.border}`}></div>
//               </div>
//               <div className="relative flex justify-center text-sm">
//                 <span className={`px-4 bg-gray-900/80 ${theme.text} opacity-60`}>Or continue with</span>
//               </div>
//             </div> */}

//             {/* Social Sign In */}
//             {/* <button
//               type="button"
//               onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
//               className={`w-full py-4 bg-gray-800/50 backdrop-blur hover:bg-gray-700/50 text-white font-medium rounded-xl transition-all flex items-center justify-center gap-3 border ${theme.border} hover:border-opacity-20`}
//             >
//               <svg className="w-5 h-5" viewBox="0 0 24 24">
//                 <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
//                 <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
//                 <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
//                 <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
//               </svg>
//               Continue with Google
//             </button> */}

//             {/* Sign In Link */}
//             <p className="text-center text-gray-400 mt-6">
//               Already have an account?{' '}
//               <Link href="/auth/signin" className={`${theme.text} hover:opacity-80 font-medium transition-all`}>
//                 Sign In
//               </Link>
//             </p>
//           </form>
//         </div>
//       </div>

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









// Responsive 
// app/auth/signup/page.jsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signIn } from 'next-auth/react';

export default function SignUpPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [userType, setUserType] = useState('hospital');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    phoneNumber: '',
    hospitalData: {
      name: '',
      registrationNumber: '',
      type: 'general',
      contactPhone: '',
      contactEmail: '',
      website: '',
      address: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: ''
      }
    },
    pilotData: {
      licenseNumber: '',
      experience: '',
      certifications: [],
      address: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: ''
      }
    }
  });

  const themeColors = {
    individual: {
      primary: 'blue',
      gradient: 'from-blue-600 to-cyan-600',
      hover: 'from-blue-700 to-cyan-700',
      bg: 'from-blue-950/50 via-gray-950 to-cyan-950/50',
      border: 'border-blue-500/10',
      text: 'text-blue-400',
      shadow: 'shadow-blue-500/25'
    },
    hospital: {
      primary: 'red',
      gradient: 'from-red-600 to-rose-600',
      hover: 'from-red-700 to-rose-700',
      bg: 'from-red-950/50 via-gray-950 to-rose-950/50',
      border: 'border-red-500/10',
      text: 'text-red-400',
      shadow: 'shadow-red-500/25'
    },
    pilot: {
      primary: 'green',
      gradient: 'from-green-600 to-emerald-600',
      hover: 'from-green-700 to-emerald-700',
      bg: 'from-green-950/50 via-gray-950 to-emerald-950/50',
      border: 'border-green-500/10',
      text: 'text-green-400',
      shadow: 'shadow-green-500/25'
    }
  };

  const theme = themeColors[userType];

  const geocodeAddress = async (address) => {
    const { street, city, state, zipCode, country } = address;
    
    const queries = [
      `${street}, ${city}, ${state}, ${zipCode}, ${country}`,
      `${street}, ${city}, ${state}, ${country}`,
      `${city}, ${state}, ${zipCode}, ${country}`,
      `${city}, ${state}, ${country}`,
    ];

    console.log('Geocoding address:', queries);
    
    for (const query of queries) {
      console.log('Trying query:', query);

      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?` + 
          `q=${encodeURIComponent(query)}&format=json&limit=1`,
          {
            headers: {
              'Accept': 'application/json',
              'Accept-Language': 'en',
            }
          }
        );

        console.log('API Response status:', response.status);
        console.log('API Response OK:', response.ok);
        
        if (!response.ok) {
          console.error('API request failed:', response.statusText);
          throw new Error(`API request failed: ${response.status}`);
        }

        const data = await response.json();

        console.log('Geocoding response:', data);
        
        if (data && data.length > 0) {
          const coordinates = {
            lat: parseFloat(data[0].lat),
            lng: parseFloat(data[0].lon)
          };
          
          console.log('✅ Geocoding successful!');
          console.log('Extracted coordinates:', coordinates);
          console.log('Google Maps link:', `https://www.google.com/maps?q=${coordinates.lat},${coordinates.lng}`);
          
          return coordinates;
        }

        throw new Error('Address not found');
      } catch (error) {
        console.error('Geocoding error:', error);
      }
    }
    return null;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('hospital.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        hospitalData: {
          ...prev.hospitalData,
          [field]: value
        }
      }));
    } else if (name.startsWith('address.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        hospitalData: {
          ...prev.hospitalData,
          address: {
            ...prev.hospitalData.address,
            [field]: value
          }
        }
      }));
    } else if (name.startsWith('pilot.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        pilotData: {
          ...prev.pilotData,
          [field]: value
        }
      }));
    } else if (name.startsWith('pilotAddress.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        pilotData: {
          ...prev.pilotData,
          address: {
            ...prev.pilotData.address,
            [field]: value
          }
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const payload = {
        email: formData.email,
        password: formData.password,
        name: formData.name,
        phoneNumber: formData.phoneNumber,
        userType
      };

      if (userType === 'hospital') {
        // Geocode the address
        const coordinates = await geocodeAddress(formData.hospitalData.address);
        
        if (!coordinates) {
          setError('Unable to verify hospital address. Please check the address details.');
          setLoading(false);
          return;
        }
        payload.hospitalData = {
          ...formData.hospitalData,
          address: {
            ...formData.hospitalData.address,
            coordinates: {
              type: 'Point',
              coordinates: [coordinates.lng, coordinates.lat]
            }
          }
        };
      } else if (userType === 'pilot') {
        // Geocode pilot address
        const coordinates = await geocodeAddress(formData.pilotData.address);
        
        if (!coordinates) {
          setError('Unable to verify address. Please check the address details.');
          setLoading(false);
          return;
        }
        
        payload.pilotData = formData.pilotData;
        payload.address = {
          ...formData.pilotData.address,
          coordinates: {
            type: 'Point',
            coordinates: [coordinates.lng, coordinates.lat]
          }
        };
      }

      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      router.push('/auth/verify?email=' + encodeURIComponent(formData.email));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 relative overflow-hidden">
      {/* Dynamic Background based on user type */}
      <div className="absolute inset-0 transition-all duration-700">
        {/* Grid Pattern */}
        <div className={`absolute inset-0 bg-[linear-gradient(to_right,${userType === 'individual' ? '#3b82f615' : userType === 'pilot' ? '#10b98115' : '#dc262615'}_1px,transparent_1px),linear-gradient(to_bottom,${userType === 'individual' ? '#3b82f615' : userType === 'pilot' ? '#10b98115' : '#dc262615'}_1px,transparent_1px)] bg-[size:2rem_2rem] sm:bg-[size:3rem_3rem] md:bg-[size:4rem_4rem]`}></div>
        
        {/* Gradient Overlay */}
        <div className={`absolute inset-0 bg-gradient-to-br ${theme.bg} transition-all duration-700`}></div>
        
        {/* Animated Elements */}
        <div className="absolute inset-0">
          {/* Floating Drone Models */}
          <div className="absolute top-5 sm:top-10 right-5 sm:right-10 animate-float hidden md:block lg:block">
            <svg className={`w-16 sm:w-24 md:w-32 h-16 sm:h-24 md:h-32 ${userType === 'individual' ? 'text-blue-500/10' : userType === 'pilot' ? 'text-green-500/10' : 'text-red-500/10'} transition-colors duration-700`} viewBox="0 0 100 100" fill="currentColor">
              <circle cx="50" cy="50" r="45" opacity="0.5"/>
              <path d="M50 20 L30 40 L30 60 L50 80 L70 60 L70 40 Z" />
              <path d="M20 35 L30 40 M30 60 L20 65 M80 35 L70 40 M70 60 L80 65" stroke="currentColor" strokeWidth="2" fill="none"/>
            </svg>
          </div>
          
          <div className="absolute bottom-10 sm:bottom-20 left-5 sm:left-10 animate-float-delayed hidden sm:block">
            <svg className={`w-20 sm:w-32 md:w-40 h-20 sm:h-32 md:h-40 ${userType === 'individual' ? 'text-cyan-500/10' : userType === 'pilot' ? 'text-emerald-500/10' : 'text-rose-500/10'} transition-colors duration-700`} viewBox="0 0 24 24" fill="currentColor">
              <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
            </svg>
          </div>

          {/* Animated Circuit Lines */}
          <svg className="absolute inset-0 w-full h-full opacity-5">
            <pattern id="circuit" x="0" y="0" width="200" height="200" patternUnits="userSpaceOnUse">
              <path d="M0 100 L50 100 L50 50 L100 50" stroke={userType === 'individual' ? '#3b82f6' : userType === 'pilot' ? '#10b981' : '#dc2626'} strokeWidth="2" fill="none" />
              <circle cx="50" cy="100" r="3" fill={userType === 'individual' ? '#3b82f6' : userType === 'pilot' ? '#10b981' : '#dc2626'} />
              <circle cx="100" cy="50" r="3" fill={userType === 'individual' ? '#3b82f6' : userType === 'pilot' ? '#10b981' : '#dc2626'} />
            </pattern>
            <rect width="100%" height="100%" fill="url(#circuit)" />
          </svg>

          {/* Pulsing Rings */}
          <div className="absolute top-1/4 sm:top-1/3 right-1/6 sm:right-1/4 hidden lg:block">
            <div className={`w-32 sm:w-48 md:w-64 h-32 sm:h-48 md:h-64 rounded-full border ${theme.border} animate-pulse-slow`}></div>
            <div className={`w-32 sm:w-48 md:w-64 h-32 sm:h-48 md:h-64 rounded-full border ${theme.border} animate-pulse-slow animation-delay-1000 absolute inset-0`}></div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-8 sm:py-12">
        <div className="max-w-2xl w-full">
          {/* Logo/Brand */}
          <div className="text-center mb-6 sm:mb-8">
            <div className={`inline-flex items-center justify-center w-16 sm:w-20 md:w-24 h-16 sm:h-20 md:h-24 bg-gradient-to-br ${theme.gradient} rounded-xl sm:rounded-2xl mb-3 sm:mb-4 shadow-2xl ${theme.shadow} relative transition-all duration-700`}>
              <svg className="w-10 sm:w-12 md:w-15 h-10 sm:h-12 md:h-15 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
              </svg>
              <div className="absolute inset-0 rounded-xl sm:rounded-2xl border-2 border-white/20 animate-spin-slow"></div>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-1 sm:mb-2">Join the Future</h1>
            <p className={`${theme.text} opacity-80 transition-colors duration-700 text-sm sm:text-base`}>Register</p>
          </div>

          {/* User Type Selection */}
          <div className="mb-4 sm:mb-6">
            <div className="flex gap-2 sm:gap-4 justify-center">
              <button
                type="button"
                onClick={() => setUserType('individual')}
                className={`hidden px-3 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-medium transition-all duration-500 text-xs sm:text-base ${
                  userType === 'individual'
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-500/25'
                    : 'bg-gray-800/50 backdrop-blur text-gray-400 hover:bg-gray-700/50 border border-gray-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <svg className="w-4 sm:w-5 h-4 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Individual
                </div>
              </button>
              <button
                type="button"
                onClick={() => setUserType('hospital')}
                className={`px-3 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-medium transition-all duration-500 text-xs sm:text-base ${
                  userType === 'hospital'
                    ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg shadow-red-500/25'
                    : 'bg-gray-800/50 backdrop-blur text-gray-400 hover:bg-gray-700/50 border border-gray-700'
                }`}
              >
                <div className="flex items-center gap-1 sm:gap-2">
                  <svg className="w-3.5 sm:w-5 h-3.5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  Hospital
                </div>
              </button>
              <button
                type="button"
                onClick={() => setUserType('pilot')}
                className={`px-3 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-medium transition-all duration-500 text-xs sm:text-base ${
                  userType === 'pilot'
                    ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg shadow-green-500/25'
                    : 'bg-gray-800/50 backdrop-blur text-gray-400 hover:bg-gray-700/50 border border-gray-700'
                }`}
              >
                <div className="flex items-center gap-1 sm:gap-2">
                  <svg className="w-3.5 sm:w-5 h-3.5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
                  </svg>
                  Pilot
                </div>
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className={`bg-gray-900/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 border ${theme.border} transition-all duration-700`}>
            {error && (
              <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-500/10 backdrop-blur border border-red-500/20 rounded-lg sm:rounded-xl text-red-400 flex items-center gap-2 text-sm sm:text-base">
                <svg className="w-4 sm:w-5 h-4 sm:h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="break-words">{error}</span>
              </div>
            )}

            {/* Basic Information */}
            <div className="space-y-4 sm:space-y-6 mb-6 sm:mb-8">
              <h2 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4 flex items-center gap-2">
                <div className={`w-6 sm:w-8 h-6 sm:h-8 rounded-md sm:rounded-lg bg-gradient-to-br ${theme.gradient} flex items-center justify-center`}>
                  <span className="text-white text-xs sm:text-sm font-bold">1</span>
                </div>
                Basic Information
              </h2>
              
              <div>
                <label className={`block text-xs sm:text-sm font-medium ${theme.text} mb-1.5 sm:mb-2 transition-colors duration-700`}>
                  Full Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 pl-10 sm:pl-12 bg-gray-800/50 backdrop-blur border ${theme.border} rounded-lg sm:rounded-xl text-white focus:ring-2 focus:ring-${theme.primary}-500 focus:border-transparent transition-all text-sm sm:text-base`}
                    placeholder="John Doe"
                  />
                  <svg className={`w-4 sm:w-5 h-4 sm:h-5 ${theme.text} opacity-50 absolute left-3 sm:left-4 top-2.5 sm:top-3.5`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>

              <div>
                <label className={`block text-xs sm:text-sm font-medium ${theme.text} mb-1.5 sm:mb-2 transition-colors duration-700`}>
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 pl-10 sm:pl-12 bg-gray-800/50 backdrop-blur border ${theme.border} rounded-lg sm:rounded-xl text-white focus:ring-2 focus:ring-${theme.primary}-500 focus:border-transparent transition-all text-sm sm:text-base`}
                    placeholder="john@example.com"
                  />
                  <svg className={`w-4 sm:w-5 h-4 sm:h-5 ${theme.text} opacity-50 absolute left-3 sm:left-4 top-2.5 sm:top-3.5`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>

              <div>
                <label className={`block text-xs sm:text-sm font-medium ${theme.text} mb-1.5 sm:mb-2 transition-colors duration-700`}>
                  Phone Number
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    required
                    className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 pl-10 sm:pl-12 bg-gray-800/50 backdrop-blur border ${theme.border} rounded-lg sm:rounded-xl text-white focus:ring-2 focus:ring-${theme.primary}-500 focus:border-transparent transition-all text-sm sm:text-base`}
                    placeholder="+1 (555) 000-0000"
                  />
                  <svg className={`w-4 sm:w-5 h-4 sm:h-5 ${theme.text} opacity-50 absolute left-3 sm:left-4 top-2.5 sm:top-3.5`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className={`block text-xs sm:text-sm font-medium ${theme.text} mb-1.5 sm:mb-2 transition-colors duration-700`}>
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      minLength={8}
                      className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 pl-10 sm:pl-12 pr-10 sm:pr-12 bg-gray-800/50 backdrop-blur border ${theme.border} rounded-lg sm:rounded-xl text-white focus:ring-2 focus:ring-${theme.primary}-500 focus:border-transparent transition-all text-sm sm:text-base`}
                      placeholder="••••••••"
                    />
                    <svg className={`w-4 sm:w-5 h-4 sm:h-5 ${theme.text} opacity-50 absolute left-3 sm:left-4 top-2.5 sm:top-3.5`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className={`absolute right-3 sm:right-4 top-2.5 sm:top-3.5 ${theme.text} opacity-50 hover:opacity-70 transition-opacity`}
                    >
                      {showPassword ? (
                        <svg className="w-4 sm:w-5 h-4 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      ) : (
                        <svg className="w-4 sm:w-5 h-4 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
                <div>
                  <label className={`block text-xs sm:text-sm font-medium ${theme.text} mb-1.5 sm:mb-2 transition-colors duration-700`}>
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 pl-10 sm:pl-12 pr-10 sm:pr-12 bg-gray-800/50 backdrop-blur border ${theme.border} rounded-lg sm:rounded-xl text-white focus:ring-2 focus:ring-${theme.primary}-500 focus:border-transparent transition-all text-sm sm:text-base`}
                      placeholder="••••••••"
                    />
                    <svg className={`w-4 sm:w-5 h-4 sm:h-5 ${theme.text} opacity-50 absolute left-3 sm:left-4 top-2.5 sm:top-3.5`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className={`absolute right-3 sm:right-4 top-2.5 sm:top-3.5 ${theme.text} opacity-50 hover:opacity-70 transition-opacity`}
                    >
                      {showConfirmPassword ? (
                        <svg className="w-4 sm:w-5 h-4 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      ) : (
                        <svg className="w-4 sm:w-5 h-4 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Hospital Information (conditional) */}
            {userType === 'hospital' && (
              <div className="space-y-4 sm:space-y-6 mb-6 sm:mb-8 pt-6 sm:pt-8 border-t border-red-500/10">
                <h2 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4 flex items-center gap-2">
                  <div className="w-6 sm:w-8 h-6 sm:h-8 rounded-md sm:rounded-lg bg-gradient-to-br from-red-600 to-rose-600 flex items-center justify-center">
                    <span className="text-white text-xs sm:text-sm font-bold">2</span>
                  </div>
                  Hospital Information
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-red-400 mb-1.5 sm:mb-2">
                      Hospital Name
                    </label>
                    <input
                      type="text"
                      name="hospital.name"
                      value={formData.hospitalData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-800/50 backdrop-blur border border-red-500/20 rounded-lg sm:rounded-xl text-white focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm sm:text-base"
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-red-400 mb-1.5 sm:mb-2">
                      Registration Number
                    </label>
                    <input
                      type="text"
                      name="hospital.registrationNumber"
                      value={formData.hospitalData.registrationNumber}
                      onChange={handleChange}
                      required
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-800/50 backdrop-blur border border-red-500/20 rounded-lg sm:rounded-xl text-white focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm sm:text-base"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-red-400 mb-1.5 sm:mb-2">
                      Hospital Type
                    </label>
                    <select
                      name="hospital.type"
                      value={formData.hospitalData.type}
                      onChange={handleChange}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-800/50 backdrop-blur border border-red-500/20 rounded-lg sm:rounded-xl text-white focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm sm:text-base"
                    >
                      <option value="general">General Hospital</option>
                      <option value="specialized">Specialized Hospital</option>
                      <option value="clinic">Clinic</option>
                      <option value="emergency">Emergency Center</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-red-400 mb-1.5 sm:mb-2">
                      Contact Phone
                    </label>
                    <input
                      type="tel"
                      name="hospital.contactPhone"
                      value={formData.hospitalData.contactPhone}
                      onChange={handleChange}
                      required
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-800/50 backdrop-blur border border-red-500/20 rounded-lg sm:rounded-xl text-white focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm sm:text-base"
                    />
                  </div>
                </div>

                {/* Address fields */}
                <div className="space-y-3 sm:space-y-4">
                  <h3 className="text-base sm:text-lg font-medium text-white flex items-center gap-2">
                    <svg className="w-4 sm:w-5 h-4 sm:h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Hospital Address
                  </h3>
                  <input
                    type="text"
                    name="address.street"
                    placeholder="Street Address"
                    value={formData.hospitalData.address.street}
                    onChange={handleChange}
                    required
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-800/50 backdrop-blur border border-red-500/20 rounded-lg sm:rounded-xl text-white focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm sm:text-base"
                  />
                  <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
                    <input
                      type="text"
                      name="address.city"
                      placeholder="City"
                      value={formData.hospitalData.address.city}
                      onChange={handleChange}
                      required
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-800/50 backdrop-blur border border-red-500/20 rounded-lg sm:rounded-xl text-white focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm sm:text-base"
                    />
                    <input
                      type="text"
                      name="address.state"
                      placeholder="State"
                      value={formData.hospitalData.address.state}
                      onChange={handleChange}
                      required
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-800/50 backdrop-blur border border-red-500/20 rounded-lg sm:rounded-xl text-white focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm sm:text-base"
                    />
                    <input
                      type="text"
                      name="address.zipCode"
                      placeholder="ZIP Code"
                      value={formData.hospitalData.address.zipCode}
                      onChange={handleChange}
                      required
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-800/50 backdrop-blur border border-red-500/20 rounded-lg sm:rounded-xl text-white focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm sm:text-base"
                    />
                    <input
                      type="text"
                      name="address.country"
                      placeholder="Country"
                      value={formData.hospitalData.address.country}
                      onChange={handleChange}
                      required
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-800/50 backdrop-blur border border-red-500/20 rounded-lg sm:rounded-xl text-white focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm sm:text-base"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Pilot Information (conditional) */}
            {userType === 'pilot' && (
              <div className="space-y-4 sm:space-y-6 mb-6 sm:mb-8 pt-6 sm:pt-8 border-t border-green-500/10">
                <h2 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4 flex items-center gap-2">
                  <div className="w-6 sm:w-8 h-6 sm:h-8 rounded-md sm:rounded-lg bg-gradient-to-br from-green-600 to-emerald-600 flex items-center justify-center">
                    <span className="text-white text-xs sm:text-sm font-bold">2</span>
                  </div>
                  Pilot Information
                </h2>
                
                <div className="bg-green-500/10 backdrop-blur rounded-lg sm:rounded-xl p-3 sm:p-4 mb-3 sm:mb-4">
                  <p className="text-green-400 text-xs sm:text-sm flex items-start gap-2">
                    <svg className="w-4 sm:w-5 h-4 sm:h-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="break-words">Your pilot application will be reviewed by our team. You'll receive an email once your verification is complete.</span>
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-green-400 mb-1.5 sm:mb-2">
                      Pilot License Number
                    </label>
                    <input
                      type="text"
                      name="pilot.licenseNumber"
                      value={formData.pilotData.licenseNumber}
                      onChange={handleChange}
                      required
                      placeholder="FAA-123456789"
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-800/50 backdrop-blur border border-green-500/20 rounded-lg sm:rounded-xl text-white focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base"
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-green-400 mb-1.5 sm:mb-2">
                      Years of Experience
                    </label>
                    <input
                      type="number"
                      name="pilot.experience"
                      value={formData.pilotData.experience}
                      onChange={handleChange}
                      required
                      min="0"
                      placeholder="5"
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-800/50 backdrop-blur border border-green-500/20 rounded-lg sm:rounded-xl text-white focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-green-400 mb-1.5 sm:mb-2">
                    Certifications (Optional)
                  </label>
                  <textarea
                    name="pilot.certifications"
                    value={formData.pilotData.certifications.join('\n')}
                    onChange={(e) => {
                      const certs = e.target.value.split('\n').filter(cert => cert.trim());
                      setFormData(prev => ({
                        ...prev,
                        pilotData: {
                          ...prev.pilotData,
                          certifications: certs
                        }
                      }));
                    }}
                    placeholder="Enter each certification on a new line&#10;e.g., Part 107 Remote Pilot Certificate&#10;Night Operations Authorization"
                    rows={4}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-800/50 backdrop-blur border border-green-500/20 rounded-lg sm:rounded-xl text-white focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base"
                  />
                </div>

                {/* Pilot Address fields */}
                <div className="space-y-3 sm:space-y-4">
                  <h3 className="text-base sm:text-lg font-medium text-white flex items-center gap-2">
                    <svg className="w-4 sm:w-5 h-4 sm:h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Pilot Address
                  </h3>
                  <input
                    type="text"
                    name="pilotAddress.street"
                    placeholder="Street Address"
                    value={formData.pilotData.address.street}
                    onChange={handleChange}
                    required
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-800/50 backdrop-blur border border-green-500/20 rounded-lg sm:rounded-xl text-white focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base"
                  />
                  <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
                    <input
                      type="text"
                      name="pilotAddress.city"
                      placeholder="City"
                      value={formData.pilotData.address.city}
                      onChange={handleChange}
                      required
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-800/50 backdrop-blur border border-green-500/20 rounded-lg sm:rounded-xl text-white focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base"
                    />
                    <input
                      type="text"
                      name="pilotAddress.state"
                      placeholder="State"
                      value={formData.pilotData.address.state}
                      onChange={handleChange}
                      required
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-800/50 backdrop-blur border border-green-500/20 rounded-lg sm:rounded-xl text-white focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base"
                    />
                    <input
                      type="text"
                      name="pilotAddress.zipCode"
                      placeholder="ZIP Code"
                      value={formData.pilotData.address.zipCode}
                      onChange={handleChange}
                      required
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-800/50 backdrop-blur border border-green-500/20 rounded-lg sm:rounded-xl text-white focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base"
                    />
                    <input
                      type="text"
                      name="pilotAddress.country"
                      placeholder="Country"
                      value={formData.pilotData.address.country}
                      onChange={handleChange}
                      required
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-800/50 backdrop-blur border border-green-500/20 rounded-lg sm:rounded-xl text-white focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 sm:py-4 bg-gradient-to-r ${theme.gradient} hover:${theme.hover} text-white font-semibold rounded-lg sm:rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg ${theme.shadow} relative overflow-hidden group text-sm sm:text-base`}
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <svg className="animate-spin h-4 sm:h-5 w-4 sm:w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Account...
                  </>
                ) : (
                  <>
                    <svg className="w-4 sm:w-5 h-4 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Create Account
                  </>
                )}
              </span>
              <div className={`absolute inset-0 bg-gradient-to-r ${theme.gradient} opacity-20 translate-y-full group-hover:translate-y-0 transition-transform`}></div>
            </button>

            {/* Divider */}
            {/* <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className={`w-full border-t ${theme.border}`}></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className={`px-4 bg-gray-900/80 ${theme.text} opacity-60`}>Or continue with</span>
              </div>
            </div> */}

            {/* Social Sign In */}
            {/* <button
              type="button"
              onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
              className={`w-full py-4 bg-gray-800/50 backdrop-blur hover:bg-gray-700/50 text-white font-medium rounded-xl transition-all flex items-center justify-center gap-3 border ${theme.border} hover:border-opacity-20`}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button> */}

            {/* Sign In Link */}
            <p className="text-center text-gray-400 mt-4 sm:mt-6 text-sm sm:text-base">
              Already have an account?{' '}
              <Link href="/auth/signin" className={`${theme.text} hover:opacity-80 font-medium transition-all`}>
                Sign In
              </Link>
            </p>
          </form>
        </div>
      </div>

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
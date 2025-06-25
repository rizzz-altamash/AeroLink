// // app/dashboard/new-delivery/page.jsx
// 'use client';

// import { useState, useEffect } from 'react';
// import { useRouter, useSearchParams } from 'next/navigation';
// import { useSession } from 'next-auth/react';
// import DashboardLayout from '@/components/dashboard/DashboardLayout';
// import RoleGuard from '@/components/auth/RoleGuard';
// import toast from 'react-hot-toast';
// import PricingBreakdown from '@/components/dashboard/PricingBreakdown';

// // Icon Components (same as before)
// const BackIcon = ({ className }) => (
//   <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
//   </svg>
// );

// const PackageIcon = ({ className }) => (
//   <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
//   </svg>
// );

// const ClockIcon = ({ className }) => (
//   <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//   </svg>
// );

// const LocationIcon = ({ className }) => (
//   <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
//   </svg>
// );

// const TemperatureIcon = ({ className }) => (
//   <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
//   </svg>
// );

// function NewDeliveryContent() {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const { data: session } = useSession();
//   const [loading, setLoading] = useState(false);
//   const [myHospital, setMyHospital] = useState(null);
//   const [step, setStep] = useState(0);
//   const [deliveryType, setDeliveryType] = useState('incoming'); // 'incoming' or 'outgoing'
  
//   const urgencyFromQuery = searchParams.get('urgency') || 'routine';
  
//   const [formData, setFormData] = useState({
//     // Package details
//     packageType: 'medication',
//     packageDescription: '',
//     packageWeight: '',
//     packageDimensions: {
//       length: '',
//       width: '',
//       height: ''
//     },
//     temperatureControlled: false,
//     temperatureRange: {
//       min: '',
//       max: ''
//     },
//     fragile: false,
//     urgency: urgencyFromQuery,
    
//     // For outgoing deliveries only
//     recipientType: 'hospital',
//     recipientHospitalId: '',
//     recipientUserId: '',
//     recipientName: '',
//     recipientPhone: '',
//     recipientEmail: '',
//     recipientAddress: '',
//     // Add hospital specific fields
//     hospitalName: '',
//     hospitalPhone: '',
//     hospitalAddress: '',
    
//     // Delivery details
//     scheduledTime: '',
//     specialInstructions: ''
//   });

//   const [errors, setErrors] = useState({});

//   // If urgency is provided in query, skip to step 1
//   useEffect(() => {
//     if (searchParams.get('urgency')) {
//       setStep(1);
//     }
//   }, [searchParams]);

//   useEffect(() => {
//     fetchMyHospital();
//   }, [session]);

//   const fetchMyHospital = async () => {
//     try {
//       const res = await fetch('/api/users/my-hospital');
//       if (res.ok) {
//         const data = await res.json();
//         setMyHospital(data);
//       }
//     } catch (error) {
//       console.error('Failed to fetch hospital:', error);
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value, type, checked } = e.target;
    
//     if (name.includes('.')) {
//       const [parent, child] = name.split('.');
//       setFormData(prev => ({
//         ...prev,
//         [parent]: {
//           ...prev[parent],
//           [child]: type === 'checkbox' ? checked : value
//         }
//       }));
//     } else {
//       setFormData(prev => ({
//         ...prev,
//         [name]: type === 'checkbox' ? checked : value
//       }));
//     }
//   };

//   const validateStep = (stepNumber) => {
//     const newErrors = {};
    
//     if (stepNumber === 1) {
//       if (!formData.packageType) newErrors.packageType = 'Package type is required';
//       if (!formData.packageDescription) newErrors.packageDescription = 'Description is required';
//       if (!formData.packageWeight || formData.packageWeight <= 0) {
//         newErrors.packageWeight = 'Valid weight is required';
//       }
//       if (formData.temperatureControlled) {
//         if (!formData.temperatureRange.min || !formData.temperatureRange.max) {
//           newErrors.temperatureRange = 'Temperature range is required';
//         }
//       }
//     }

//     // Add Step 2 validation
//     if (stepNumber === 2 && deliveryType === 'outgoing') {
//       if (formData.recipientType === 'hospital') {
//         // Hospital validation
//         if (!formData.hospitalName?.trim()) {
//           newErrors.hospitalName = 'Hospital name is required';
//         }
//         if (!formData.hospitalPhone?.trim()) {
//           newErrors.hospitalPhone = 'Hospital contact number is required';
//         }
//         if (!formData.hospitalAddress?.trim()) {
//           newErrors.hospitalAddress = 'Hospital address is required';
//         }
//       } else if (formData.recipientType === 'individual') {
//         // Individual validation
//         if (!formData.recipientName?.trim()) {
//           newErrors.recipientName = 'Recipient name is required';
//         }
//         if (!formData.recipientPhone?.trim()) {
//           newErrors.recipientPhone = 'Phone number is required';
//         }
//         if (!formData.recipientAddress?.trim()) {
//           newErrors.recipientAddress = 'Delivery address is required';
//         }
//       }
//     }
    
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleNextStep = () => {
//     if (validateStep(step)) {
//       // Skip step 2 for incoming deliveries
//       if (step === 1 && deliveryType === 'incoming') {
//         setStep(3);
//       } else {
//         setStep(step + 1);
//       }
//     }
//   };

//   const handlePreviousStep = () => {
//     // Handle back button for skipped step
//     if (step === 3 && deliveryType === 'incoming') {
//       setStep(1);
//     } else {
//       setStep(step - 1);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!validateStep(step)) return;
    
//     setLoading(true);
//     try {
//       let deliveryData;
      
//       if (deliveryType === 'incoming') {
//         // For incoming deliveries (ordering for own hospital)
//         deliveryData = {
//           deliveryType: 'incoming',
          
//           // Package info
//           packageType: formData.packageType,
//           packageDescription: formData.packageDescription,
//           packageWeight: parseInt(formData.packageWeight),
//           packageDimensions: formData.packageDimensions,
//           temperatureControlled: formData.temperatureControlled,
//           temperatureRange: formData.temperatureControlled ? formData.temperatureRange : undefined,
//           fragile: formData.fragile,
//           urgency: formData.urgency,
          
//           // Recipient is the sender's hospital
//           recipientHospitalId: session.user.hospitalId,
//           recipientCoordinates: myHospital?.address?.coordinates?.coordinates || [0, 0],
          
//           // Sender will be determined by admin/system
//           senderType: 'warehouse', // or 'supplier'
          
//           // Delivery info
//           scheduledTime: formData.scheduledTime || undefined,
//           specialInstructions: formData.specialInstructions
//         };
//       } else {
//         // For outgoing deliveries (sending to others)
//         // Include recipient details from step 2
//         deliveryData = {
//           deliveryType: 'outgoing',
//           // ... include all fields including recipient details
//           // Package info
//           packageType: formData.packageType,
//           packageDescription: formData.packageDescription,
//           packageWeight: parseInt(formData.packageWeight),
//           packageDimensions: formData.packageDimensions,
//           temperatureControlled: formData.temperatureControlled,
//           temperatureRange: formData.temperatureControlled ? formData.temperatureRange : undefined,
//           fragile: formData.fragile,
//           urgency: formData.urgency,
          
//           // Recipient details
//           recipientType: formData.recipientType,
//           recipientHospitalId: formData.recipientHospitalId,
//           recipientUserId: formData.recipientUserId,
//           recipientName: formData.recipientType === 'hospital' ? formData.hospitalName : formData.recipientName,
//           recipientPhone: formData.recipientType === 'hospital' ? formData.hospitalPhone : formData.recipientPhone,
//           recipientEmail: formData.recipientEmail,
//           recipientAddress: formData.recipientType === 'hospital' ? formData.hospitalAddress : formData.recipientAddress,
//           recipientCoordinates: formData.recipientCoordinates || [0, 0],
          
//           // Sender info
//           senderCoordinates: myHospital?.address?.coordinates?.coordinates || [0, 0],
          
//           // Delivery info
//           scheduledTime: formData.scheduledTime || undefined,
//           specialInstructions: formData.specialInstructions
//         };
//       }
      
//       const res = await fetch('/api/deliveries/create', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(deliveryData)
//       });
      
//       if (!res.ok) {
//         const error = await res.json();
//         throw new Error(error.error || 'Failed to create delivery');
//       }
      
//       const result = await res.json();
      
//       // Notify admin and pilots
//       await fetch('/api/notifications/delivery-created', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           deliveryId: result.delivery._id,
//           urgency: formData.urgency
//         })
//       });
      
//       // Show success message
//       toast.success('Order placed successfully');
      
//       // Redirect to tracking page
//       router.push(`/dashboard/track/${result.delivery._id}`);


//       // // Show success message with toast instead of alert
//       // toast.success(
//       //   `Order ${result.delivery.orderId} placed successfully! ` +
//       //   `${deliveryType === 'incoming' ? 'Admin will process your order and assign a drone.' : 'Relevant staff have been notified.'}`
//       // );
      
//       // // Redirect to tracking page after a short delay
//       // setTimeout(() => {
//       //   router.push(`/dashboard/track/${result.delivery._id}`);
//       // }, 1500);


//     } catch (error) {
//       toast.error(error.message || 'Failed to create delivery');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const urgencyInfo = {
//     routine: {
//       title: 'Standard Delivery',
//       description: 'Regular medical supplies and documents',
//       color: 'blue',
//       gradient: 'from-blue-600 to-cyan-600',
//       estimatedTime: '2-4 hours'
//     },
//     urgent: {
//       title: 'Urgent Delivery',
//       description: 'Time-sensitive medications and samples',
//       color: 'orange',
//       gradient: 'from-orange-600 to-amber-600',
//       estimatedTime: '1-2 hours'
//     },
//     emergency: {
//       title: 'Emergency Delivery',
//       description: 'Critical supplies, blood, organs',
//       color: 'red',
//       gradient: 'from-red-600 to-rose-600',
//       estimatedTime: '30-60 minutes'
//     }
//   };

//   const currentUrgency = urgencyInfo[formData.urgency];

//   return (
//     <DashboardLayout>
//       <div className="min-h-screen p-8">
//         {/* Background elements */}
//         <div className="fixed inset-0 overflow-hidden pointer-events-none">
//           <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-500/5 rounded-full blur-3xl animate-pulse-slow"></div>
//           <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-rose-500/5 rounded-full blur-3xl animate-pulse-slow animation-delay-2000"></div>
//         </div>

//         {/* Header */}
//         <div className="relative mb-8">
//           <button
//             onClick={() => router.back()}
//             className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
//           >
//             <BackIcon className="w-5 h-5" />
//             <span>Back to Dashboard</span>
//           </button>
          
//           <div className="flex items-center justify-between">
//             <div>
//               <h1 className="text-3xl font-bold text-white mb-2">Create New Delivery</h1>
//               <p className="text-gray-400">
//                 {deliveryType === 'incoming' 
//                   ? `Ordering supplies for ${myHospital?.name || 'your hospital'}`
//                   : 'Sending delivery to another location'}
//               </p>
//             </div>
            
//             {/* Urgency Badge */}
//             <div className={`px-6 py-3 bg-gradient-to-r ${currentUrgency.gradient} rounded-xl shadow-lg`}>
//               <p className="text-white font-semibold">{currentUrgency.title}</p>
//               <p className="text-white/80 text-sm">ETA: {currentUrgency.estimatedTime}</p>
//             </div>
//           </div>
//         </div>

//         {/* Delivery Type Selection (Before steps) */}
//         {step === 0 && (
//           <div className="max-w-3xl mx-auto">
//             <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-8 border border-red-500/20 animate-fade-in-up">
//               <h2 className="text-2xl font-semibold text-white mb-6">What type of delivery?</h2>
              
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <button
//                   onClick={() => {
//                     setDeliveryType('incoming');
//                     setStep(1);
//                   }}
//                   className="p-6 bg-gray-800/50 rounded-xl border-2 border-gray-700 hover:border-red-500 transition-all group"
//                 >
//                   <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform">
//                     <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
//                     </svg>
//                   </div>
//                   <h3 className="text-xl font-semibold text-white mb-2">Order Supplies</h3>
//                   <p className="text-gray-400 text-sm">Order medical supplies for your hospital</p>
//                   <p className="text-green-400 text-xs mt-2">Delivered to: {myHospital?.name}</p>
//                 </button>

//                 <button
//                   onClick={() => {
//                     setDeliveryType('outgoing');
//                     setStep(1);
//                   }}
//                   className="p-6 bg-gray-800/50 rounded-xl border-2 border-gray-700 hover:border-red-500 transition-all group"
//                 >
//                   <div className="w-16 h-16 bg-gradient-to-br from-orange-600 to-amber-600 rounded-xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform">
//                     <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
//                     </svg>
//                   </div>
//                   <h3 className="text-xl font-semibold text-white mb-2">Send Delivery</h3>
//                   <p className="text-gray-400 text-sm">Send items to another hospital or person</p>
//                   <p className="text-orange-400 text-xs mt-2">From: {myHospital?.name}</p>
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Progress Steps (only show for outgoing, or modified for incoming) */}
//         {step > 0 && (
//           <div className="flex items-center justify-between mb-8 max-w-3xl mx-auto">
//             {deliveryType === 'incoming' ? (
//               // Two steps for incoming
//               <>
//                 <div className="flex items-center flex-1">
//                   <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
//                     step >= 1 ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white' : 'bg-gray-800 text-gray-400'
//                   }`}>
//                     1
//                   </div>
//                   <div className={`flex-1 h-1 mx-4 transition-all ${
//                     step > 1 ? 'bg-gradient-to-r from-red-600 to-rose-600' : 'bg-gray-800'
//                   }`} />
//                 </div>
//                 <div className="flex items-center">
//                   <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
//                     step >= 3 ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white' : 'bg-gray-800 text-gray-400'
//                   }`}>
//                     2
//                   </div>
//                 </div>
//               </>
//             ) : (
//               // Three steps for outgoing
//               [1, 2, 3].map((i) => (
//                 <div key={i} className="flex items-center flex-1">
//                   <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
//                     step >= i ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white' : 'bg-gray-800 text-gray-400'
//                   }`}>
//                     {i}
//                   </div>
//                   {i < 3 && (
//                     <div className={`flex-1 h-1 mx-4 transition-all ${
//                       step > i ? 'bg-gradient-to-r from-red-600 to-rose-600' : 'bg-gray-800'
//                     }`} />
//                   )}
//                 </div>
//               ))
//             )}
//           </div>
//         )}

//         {/* Form */}
//         {step > 0 && (
//           <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
//             {/* Step 1: Package Details (Same for both) */}
//             {step === 1 && (
//             <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-8 border border-red-500/20 animate-fade-in-up">
//               <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-3">
//                 <PackageIcon className="w-8 h-8 text-red-400" />
//                 Package Details
//               </h2>

//               <div className="space-y-6">
//                 {/* Package Type */}
//                 <div>
//                   <label className="block text-sm font-medium text-red-400 mb-2">
//                     Package Type*
//                   </label>
//                   <select
//                     name="packageType"
//                     value={formData.packageType}
//                     onChange={handleInputChange}
//                     className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
//                   >
//                     <option value="medication">Medication</option>
//                     <option value="blood">Blood Samples</option>
//                     <option value="organ">Organ for Transplant</option>
//                     <option value="medical_supplies">Medical Supplies</option>
//                     <option value="documents">Medical Documents</option>
//                     <option value="other">Other</option>
//                   </select>
//                   {errors.packageType && (
//                     <p className="mt-1 text-sm text-red-400">{errors.packageType}</p>
//                   )}
//                 </div>

//                 {/* Description */}
//                 <div>
//                   <label className="block text-sm font-medium text-red-400 mb-2">
//                     Package Description*
//                   </label>
//                   <textarea
//                     name="packageDescription"
//                     value={formData.packageDescription}
//                     onChange={handleInputChange}
//                     rows={3}
//                     placeholder="Describe the contents of the package..."
//                     className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
//                   />
//                   {errors.packageDescription && (
//                     <p className="mt-1 text-sm text-red-400">{errors.packageDescription}</p>
//                   )}
//                 </div>

//                 {/* Weight and Dimensions */}
//                   <div>
//                     <label className="block text-sm font-medium text-red-400 mb-2">
//                       Weight (grams)*
//                     </label>
//                     <input
//                       type="number"
//                       name="packageWeight"
//                       value={formData.packageWeight}
//                       onChange={handleInputChange}
//                       placeholder="500"
//                       min="1"
//                       className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
//                     />
//                     {errors.packageWeight && (
//                       <p className="mt-1 text-sm text-red-400">{errors.packageWeight}</p>
//                     )}
//                   </div>

//                   {/* ADD PRICING BREAKDOWN HERE */}
//                   {formData.packageWeight && formData.urgency && (
//                     <PricingBreakdown 
//                       deliveryData={{
//                         package: {
//                           weight: parseInt(formData.packageWeight) || 0,
//                           urgency: formData.urgency,
//                           temperatureControlled: formData.temperatureControlled,
//                           fragile: formData.fragile
//                         },
//                         flightPath: { 
//                           estimatedDistance: 0 // Will be calculated after recipient details
//                         }
//                       }}
//                       className="mt-6 animate-fade-in"
//                     />
//                   )}
//                 <div className="">
//                   <div>
//                     <label className="block text-sm font-medium text-red-400 mb-2">
//                       Dimensions (cm)
//                     </label>
//                     <div className="flex flex-wrap gap-2">
//                       <input
//                         type="number"
//                         name="packageDimensions.length"
//                         value={formData.packageDimensions.length}
//                         onChange={handleInputChange}
//                         placeholder="L"
//                         className="flex-1 px-3 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
//                       />
//                       <input
//                         type="number"
//                         name="packageDimensions.width"
//                         value={formData.packageDimensions.width}
//                         onChange={handleInputChange}
//                         placeholder="W"
//                         className="flex-1 px-3 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
//                       />
//                       <input
//                         type="number"
//                         name="packageDimensions.height"
//                         value={formData.packageDimensions.height}
//                         onChange={handleInputChange}
//                         placeholder="H"
//                         className="flex-1 px-3 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
//                       />
//                     </div>
//                   </div>
//                 </div>

//                 {/* Special Requirements */}
//                 <div className="space-y-4">
//                   <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-xl">
//                     <div className="flex items-center gap-3">
//                       <TemperatureIcon className="w-5 h-5 text-blue-400" />
//                       <div>
//                         <p className="text-white font-medium">Temperature Controlled</p>
//                         <p className="text-gray-400 text-sm">Package requires specific temperature range</p>
//                       </div>
//                     </div>
//                     <label className="relative inline-flex items-center cursor-pointer">
//                       <input
//                         type="checkbox"
//                         name="temperatureControlled"
//                         checked={formData.temperatureControlled}
//                         onChange={handleInputChange}
//                         className="sr-only peer"
//                       />
//                       <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
//                     </label>
//                   </div>

//                   {formData.temperatureControlled && (
//                     <div className="ml-4 p-4 bg-blue-500/10 rounded-xl animate-fade-in">
//                       <label className="block text-sm font-medium text-blue-400 mb-2">
//                         Temperature Range (°C)
//                       </label>
//                       <div className="flex gap-4 items-center">
//                         <input
//                           type="number"
//                           name="temperatureRange.min"
//                           value={formData.temperatureRange.min}
//                           onChange={handleInputChange}
//                           placeholder="Min"
//                           className="flex-1 px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white"
//                         />
//                         <span className="text-gray-400">to</span>
//                         <input
//                           type="number"
//                           name="temperatureRange.max"
//                           value={formData.temperatureRange.max}
//                           onChange={handleInputChange}
//                           placeholder="Max"
//                           className="flex-1 px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white"
//                         />
//                       </div>
//                       {errors.temperatureRange && (
//                         <p className="mt-1 text-sm text-red-400">{errors.temperatureRange}</p>
//                       )}
//                     </div>
//                   )}

//                   <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-xl">
//                     <div className="flex items-center gap-3">
//                       <svg className="w-5 h-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
//                       </svg>
//                       <div>
//                         <p className="text-white font-medium">Fragile Package</p>
//                         <p className="text-gray-400 text-sm">Requires careful handling</p>
//                       </div>
//                     </div>
//                     <label className="relative inline-flex items-center cursor-pointer">
//                       <input
//                         type="checkbox"
//                         name="fragile"
//                         checked={formData.fragile}
//                         onChange={handleInputChange}
//                         className="sr-only peer"
//                       />
//                       <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
//                     </label>
//                   </div>
//                 </div>

//                 {/* Urgency Level */}
//                 <div>
//                   <label className="block text-sm font-medium text-red-400 mb-2">
//                     Urgency Level
//                   </label>
//                   <div className="grid lg:grid-cols-3 md:grid-cols-3 gap-4">
//                     {Object.entries(urgencyInfo).map(([key, info]) => (
//                       <button
//                         key={key}
//                         type="button"
//                         onClick={() => setFormData(prev => ({ ...prev, urgency: key }))}
//                         className={`p-4 rounded-xl border-2 transition-all ${
//                           formData.urgency === key
//                             ? `border-transparent bg-gradient-to-r ${info.gradient} text-white`
//                             : 'border-gray-700 bg-gray-800/30 text-gray-300 hover:bg-gray-800/50'
//                         }`}
//                       >
//                         <p className="font-semibold">{info.title}</p>
//                         <p className="text-sm mt-1 opacity-80">{info.estimatedTime}</p>
//                       </button>
//                     ))}
//                   </div>
//                 </div>
//               </div>

//               <div className="mt-8 flex justify-between">

//                 <button
//                     type="button"
//                     onClick={() => setStep(0)}
//                     className="px-8 py-3 bg-gray-800/50 text-white rounded-xl font-semibold hover:bg-gray-700/50 transition-all"
//                   >
//                     Back
//                   </button>
//                 <button
//                   type="button"
//                   onClick={handleNextStep}
//                   className="px-8 py-3 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-xl font-semibold hover:from-red-700 hover:to-rose-700 transition-all flex items-center gap-2"
//                 >
//                   Next Step
//                   <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//                   </svg>
//                 </button>
//               </div>
//             </div>
//           )}

//             {/* Step 2: Recipient Details (Only for outgoing) */}
//             {step === 2 && deliveryType === 'outgoing' && (
//               <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-8 border border-red-500/20 animate-fade-in-up">
//                 <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-3">
//                   <LocationIcon className="w-8 h-8 text-red-400" />
//                   Recipient Details
//                 </h2>

//                <div className="space-y-6">
//                  {/* Recipient Type */}
//                  <div>
//                    <label className="block text-sm font-medium text-red-400 mb-2">
//                      Delivery To
//                    </label>
//                    <div className="grid grid-cols-2 gap-4">
//                      <button
//                       type="button"
//                       onClick={() => setFormData(prev => ({ ...prev, recipientType: 'hospital' }))}
//                       className={`p-4 rounded-xl border-2 transition-all ${
//                         formData.recipientType === 'hospital'
//                           ? 'border-red-500 bg-red-500/10 text-red-400'
//                           : 'border-gray-700 bg-gray-800/30 text-gray-300 hover:bg-gray-800/50'
//                       }`}
//                     >
//                       <svg className="w-8 h-8 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
//                       </svg>
//                       <p className="font-semibold">Hospital/Clinic</p>
//                     </button>
//                     <button
//                       type="button"
//                       onClick={() => setFormData(prev => ({ ...prev, recipientType: 'individual' }))}
//                       className={`p-4 rounded-xl border-2 transition-all ${
//                         formData.recipientType === 'individual'
//                           ? 'border-red-500 bg-red-500/10 text-red-400'
//                           : 'border-gray-700 bg-gray-800/30 text-gray-300 hover:bg-gray-800/50'
//                       }`}
//                     >
//                       <svg className="w-8 h-8 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//                       </svg>
//                       <p className="font-semibold">Individual</p>
//                     </button>
//                   </div>
//                 </div>

//                 {formData.recipientType === 'hospital' ? (
//                   <>
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                       <div>
//                         <label className="block text-sm font-medium text-red-400 mb-2">
//                           Hospital Name*
//                         </label>
//                         <input
//                           type="text"
//                           name="hospitalName"
//                           value={formData.hospitalName}
//                           onChange={handleInputChange}
//                           placeholder="City Hospital"
//                           // className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
//                           className={`w-full px-4 py-3 bg-gray-800/50 border ${errors.hospitalName ? 'border-red-500' : 'border-gray-700'} rounded-xl text-white focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all`}
//                         />
//                         {errors.hospitalName && (
//                           <p className="mt-1 text-sm text-red-400">{errors.hospitalName}</p>
//                         )}
//                       </div>

//                       <div>
//                         <label className="block text-sm font-medium text-red-400 mb-2">
//                           Contact Number*
//                         </label>
//                         <div className="flex gap-2">
//                           <input
//                             type="tel"
//                             name="hospitalPhone"
//                             value={formData.hospitalPhone}
//                             onChange={handleInputChange}
//                             // onBlur={searchHospitalByPhone}
//                             placeholder="+1234567890"
//                             // className="flex-1 px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
//                             className={`w-full px-4 py-3 bg-gray-800/50 border ${errors.hospitalPhone ? 'border-red-500' : 'border-gray-700'} rounded-xl text-white focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all`}
//                           />
//                           {/* {searchingHospital && (
//                             <div className="flex items-center justify-center px-4">
//                               <svg className="animate-spin h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24">
//                                 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                                 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                               </svg>
//                             </div>
//                           )} */}
//                         </div>
//                         {errors.hospitalPhone && (
//                           <p className="mt-1 text-sm text-red-400">{errors.hospitalPhone}</p>
//                         )}
//                       </div>
//                     </div>

//                     <div>
//                       <label className="block text-sm font-medium text-red-400 mb-2">
//                         Location*
//                       </label>
//                       <textarea
//                         name="hospitalAddress"
//                         value={formData.hospitalAddress}
//                         onChange={handleInputChange}
//                         rows={3}
//                         placeholder="123 Main St, City, State 12345"
//                         // className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
//                         className={`w-full px-4 py-3 bg-gray-800/50 border ${errors.hospitalAddress ? 'border-red-500' : 'border-gray-700'} rounded-xl text-white focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all`}
//                       />
//                       {errors.hospitalAddress && (
//                         <p className="mt-1 text-sm text-red-400">{errors.hospitalAddress}</p>
//                       )}
//                     </div>
//                   </>
//                 ) : (
//                   <>
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                       <div>
//                         <label className="block text-sm font-medium text-red-400 mb-2">
//                           Recipient Name*
//                         </label>
//                         <input
//                           type="text"
//                           name="recipientName"
//                           value={formData.recipientName}
//                           onChange={handleInputChange}
//                           placeholder="John Doe"
//                           // className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
//                           className={`w-full px-4 py-3 bg-gray-800/50 border ${errors.recipientName ? 'border-red-500' : 'border-gray-700'} rounded-xl text-white focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all`}
//                         />
//                         {errors.recipientName && (
//                           <p className="mt-1 text-sm text-red-400">{errors.recipientName}</p>
//                         )}
//                       </div>

//                       <div>
//                         <label className="block text-sm font-medium text-red-400 mb-2">
//                           Phone Number*
//                         </label>
//                         <div className="flex gap-2">
//                           <input
//                             type="tel"
//                             name="recipientPhone"
//                             value={formData.recipientPhone}
//                             onChange={handleInputChange}
//                             // onBlur={searchRecipientByPhone}
//                             placeholder="+91"
//                             // className="flex-1 px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
//                             className={`w-full px-4 py-3 bg-gray-800/50 border ${errors.recipientPhone ? 'border-red-500' : 'border-gray-700'} rounded-xl text-white focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all`}
//                           />
//                           {/* {searchingRecipient && (
//                             <div className="flex items-center justify-center px-4">
//                               <svg className="animate-spin h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24">
//                                 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                                 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                               </svg>
//                             </div>
//                           )} */}
//                         </div>
//                         {errors.recipientPhone && (
//                           <p className="mt-1 text-sm text-red-400">{errors.recipientPhone}</p>
//                         )}
//                       </div>
//                     </div>

//                     <div>
//                       <label className="block text-sm font-medium text-red-400 mb-2">
//                         Delivery Address*
//                       </label>
//                       <textarea
//                         name="recipientAddress"
//                         value={formData.recipientAddress}
//                         onChange={handleInputChange}
//                         rows={3}
//                         placeholder="123 Main St, City, State 12345"
//                         // className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
//                         className={`w-full px-4 py-3 bg-gray-800/50 border ${errors.recipientAddress ? 'border-red-500' : 'border-gray-700'} rounded-xl text-white focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all`}
//                       />
//                       {errors.recipientAddress && (
//                         <p className="mt-1 text-sm text-red-400">{errors.recipientAddress}</p>
//                       )}
//                     </div>
//                   </>
//                 )}
//               </div>

//               <div className="mt-8 flex justify-between">
//                 <button
//                   type="button"
//                   onClick={handlePreviousStep}
//                   className="px-8 py-3 bg-gray-800/50 text-white rounded-xl font-semibold hover:bg-gray-700/50 transition-all flex items-center gap-2"
//                 >
//                   <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
//                   </svg>
//                   Previous
//                 </button>
//                 <button
//                   type="button"
//                   onClick={handleNextStep}
//                   className="px-8 py-3 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-xl font-semibold hover:from-red-700 hover:to-rose-700 transition-all flex items-center gap-2"
//                 >
//                   Next Step
//                   <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//                   </svg>
//                 </button>
//               </div>
//               </div>
//             )}

//             {/* Step 3: Review & Schedule */}
//             {step === 3 && (
//               <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-8 border border-red-500/20 animate-fade-in-up">
//                 <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-3">
//                   <ClockIcon className="w-8 h-8 text-red-400" />
//                   Review & Schedule
//                 </h2>

//                 {/* Delivery Summary */}
//                 <div className="space-y-6 mb-8">
//                   <div className="bg-gray-800/30 rounded-xl p-6">
//                     <h3 className="text-lg font-semibold text-white mb-4">Order Summary</h3>
                    
//                     <div className="space-y-4">
//                       {/* Package Info */}
//                       <div className="flex justify-between items-start">
//                         <div>
//                           <p className="text-gray-400 text-sm">Package</p>
//                           <p className="text-white font-medium">{formData.packageType.charAt(0).toUpperCase() + formData.packageType.slice(1)}</p>
//                           <p className="text-gray-300 text-sm">{formData.packageDescription}</p>
//                         </div>
//                         <div className="text-right">
//                           <p className="text-gray-400 text-sm">Weight</p>
//                           <p className="text-white font-medium">{formData.packageWeight}g</p>
//                         </div>
//                       </div>

//                       {/* Delivery Type Badge */}
//                       <div className="border-t border-gray-700 pt-4">
//                         <div className="flex items-center justify-between">
//                           <span className="text-gray-400 text-sm">Delivery Type</span>
//                           <span className={`px-3 py-1 rounded-full text-xs font-medium ${
//                             deliveryType === 'incoming' 
//                               ? 'bg-blue-500/20 text-blue-400' 
//                               : 'bg-orange-500/20 text-orange-400'
//                           }`}>
//                             {deliveryType === 'incoming' ? 'Incoming Order' : 'Outgoing Delivery'}
//                           </span>
//                         </div>
//                       </div>

//                       {/* Destination */}
//                       <div className="border-t border-gray-700 pt-4">
//                         <p className="text-gray-400 text-sm mb-2">Delivery Destination</p>
//                         <div className="flex items-center gap-2">
//                           <LocationIcon className="w-5 h-5 text-red-400" />
//                           <div>
//                             <p className="text-white font-medium">
//                               {deliveryType === 'incoming' 
//                                 ? myHospital?.name || 'Your Hospital'
//                                 : 'Recipient Location'}
//                             </p>
//                             {deliveryType === 'incoming' && (
//                               <p className="text-gray-300 text-sm">
//                                 {myHospital?.address?.street}, {myHospital?.address?.city}
//                               </p>
//                             )}
//                           </div>
//                         </div>
//                       </div>

//                       {/* Special Requirements */}
//                       {(formData.temperatureControlled || formData.fragile) && (
//                         <div className="border-t border-gray-700 pt-4">
//                           <p className="text-gray-400 text-sm mb-2">Special Requirements</p>
//                           <div className="flex flex-wrap gap-2">
//                             {formData.temperatureControlled && (
//                               <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm">
//                                 Temperature: {formData.temperatureRange.min}°C - {formData.temperatureRange.max}°C
//                               </span>
//                             )}
//                             {formData.fragile && (
//                               <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-sm">
//                                 Fragile
//                               </span>
//                             )}
//                           </div>
//                         </div>
//                       )}
//                     </div>
//                   </div>

//                   {/* Schedule Delivery */}
//                   <div>
//                     <label className="block text-sm font-medium text-red-400 mb-2">
//                       Schedule Delivery (Optional)
//                     </label>
//                     <input
//                       type="datetime-local"
//                       name="scheduledTime"
//                       value={formData.scheduledTime}
//                       onChange={handleInputChange}
//                       min={new Date().toISOString().slice(0, 16)}
//                       className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
//                     />
//                     <p className="mt-2 text-sm text-gray-400">
//                       Leave empty for immediate dispatch based on urgency level
//                     </p>
//                   </div>

//                   {/* Special Instructions */}
//                   <div>
//                     <label className="block text-sm font-medium text-red-400 mb-2">
//                       Special Instructions (Optional)
//                     </label>
//                     <textarea
//                       name="specialInstructions"
//                       value={formData.specialInstructions}
//                       onChange={handleInputChange}
//                       rows={3}
//                       placeholder="Any special handling or delivery instructions..."
//                       className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
//                     />
//                   </div>

//                   {/* Notification Info */}
//                   <div className="bg-green-500/10 rounded-xl p-4 border border-green-500/20">
//                     <div className="flex items-start gap-3">
//                       <svg className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                       </svg>
//                       <div>
//                         <p className="text-green-400 font-medium">Automatic Notifications</p>
//                         <p className="text-gray-300 text-sm mt-1">
//                           Upon placing this order:
//                         </p>
//                         <ul className="text-gray-400 text-sm mt-2 space-y-1">
//                           <li>• Admin will be notified to process the order</li>
//                           <li>• Available pilots will be alerted for {formData.urgency} delivery</li>
//                           <li>• You'll receive real-time tracking updates</li>
//                         </ul>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* ADD FINAL PRICING HERE */} 
//                 <PricingBreakdown 
//                   deliveryData={{
//                     package: {
//                       weight: parseInt(formData.packageWeight) || 0,
//                       urgency: formData.urgency,
//                       temperatureControlled: formData.temperatureControlled,
//                       fragile: formData.fragile
//                     },
//                     flightPath: { 
//                       estimatedDistance: formData.estimatedDistance || 0 
//                     },
//                     scheduledTime: formData.scheduledTime
//                   }}
//                   className="mb-6"
//                 />

//                 <div className="flex justify-between">
//                   <button
//                     type="button"
//                     onClick={handlePreviousStep}
//                     className="px-8 py-3 bg-gray-800/50 text-white rounded-xl font-semibold hover:bg-gray-700/50 transition-all flex items-center gap-2"
//                   >
//                     <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
//                     </svg>
//                     Previous
//                   </button>
//                   <button
//                     type="submit"
//                     disabled={loading}
//                     className="px-8 py-3 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-xl font-semibold hover:from-red-700 hover:to-rose-700 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
//                   >
//                     {loading ? (
//                       <>
//                         <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
//                           <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                           <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                         </svg>
//                         Placing Order...
//                       </>
//                     ) : (
//                       <>
//                         Place Order
//                         <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//                         </svg>
//                       </>
//                     )}
//                   </button>
//                 </div>
//               </div>
//             )}
//           </form>
//         )}
//       </div>
//     </DashboardLayout>
//   );
// }

// export default function NewDeliveryPage() {
//   return (
//     <RoleGuard allowedRoles={['medical_staff', 'hospital_admin']}>
//       <NewDeliveryContent />
//     </RoleGuard>
//   );
// }



















// Responsive 
// app/dashboard/new-delivery/page.jsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import RoleGuard from '@/components/auth/RoleGuard';
import toast from 'react-hot-toast';
import PricingBreakdown from '@/components/dashboard/PricingBreakdown';

// Icon Components (same as before)
const BackIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
  </svg>
);

const PackageIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
  </svg>
);

const ClockIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const LocationIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const TemperatureIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

function NewDeliveryContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [myHospital, setMyHospital] = useState(null);
  const [step, setStep] = useState(0);
  const [deliveryType, setDeliveryType] = useState('incoming'); // 'incoming' or 'outgoing'
  
  const urgencyFromQuery = searchParams.get('urgency') || 'routine';
  
  const [formData, setFormData] = useState({
    // Package details
    packageType: 'medication',
    packageDescription: '',
    packageWeight: '',
    packageDimensions: {
      length: '',
      width: '',
      height: ''
    },
    temperatureControlled: false,
    temperatureRange: {
      min: '',
      max: ''
    },
    fragile: false,
    urgency: urgencyFromQuery,
    
    // For outgoing deliveries only
    recipientType: 'hospital',
    recipientHospitalId: '',
    recipientUserId: '',
    recipientName: '',
    recipientPhone: '',
    recipientEmail: '',
    recipientAddress: '',
    // Add hospital specific fields
    hospitalName: '',
    hospitalPhone: '',
    hospitalAddress: '',
    
    // Delivery details
    scheduledTime: '',
    specialInstructions: ''
  });

  const [errors, setErrors] = useState({});

  // If urgency is provided in query, skip to step 1
  useEffect(() => {
    if (searchParams.get('urgency')) {
      setStep(1);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchMyHospital();
  }, [session]);

  const fetchMyHospital = async () => {
    try {
      const res = await fetch('/api/users/my-hospital');
      if (res.ok) {
        const data = await res.json();
        setMyHospital(data);
      }
    } catch (error) {
      console.error('Failed to fetch hospital:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const validateStep = (stepNumber) => {
    const newErrors = {};
    
    if (stepNumber === 1) {
      if (!formData.packageType) newErrors.packageType = 'Package type is required';
      if (!formData.packageDescription) newErrors.packageDescription = 'Description is required';
      if (!formData.packageWeight || formData.packageWeight <= 0) {
        newErrors.packageWeight = 'Valid weight is required';
      }
      if (formData.temperatureControlled) {
        if (!formData.temperatureRange.min || !formData.temperatureRange.max) {
          newErrors.temperatureRange = 'Temperature range is required';
        }
      }
    }

    // Add Step 2 validation
    if (stepNumber === 2 && deliveryType === 'outgoing') {
      if (formData.recipientType === 'hospital') {
        // Hospital validation
        if (!formData.hospitalName?.trim()) {
          newErrors.hospitalName = 'Hospital name is required';
        }
        if (!formData.hospitalPhone?.trim()) {
          newErrors.hospitalPhone = 'Hospital contact number is required';
        }
        if (!formData.hospitalAddress?.trim()) {
          newErrors.hospitalAddress = 'Hospital address is required';
        }
      } else if (formData.recipientType === 'individual') {
        // Individual validation
        if (!formData.recipientName?.trim()) {
          newErrors.recipientName = 'Recipient name is required';
        }
        if (!formData.recipientPhone?.trim()) {
          newErrors.recipientPhone = 'Phone number is required';
        }
        if (!formData.recipientAddress?.trim()) {
          newErrors.recipientAddress = 'Delivery address is required';
        }
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep(step)) {
      // Skip step 2 for incoming deliveries
      if (step === 1 && deliveryType === 'incoming') {
        setStep(3);
      } else {
        setStep(step + 1);
      }
    }
  };

  const handlePreviousStep = () => {
    // Handle back button for skipped step
    if (step === 3 && deliveryType === 'incoming') {
      setStep(1);
    } else {
      setStep(step - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep(step)) return;
    
    setLoading(true);
    try {
      let deliveryData;
      
      if (deliveryType === 'incoming') {
        // For incoming deliveries (ordering for own hospital)
        deliveryData = {
          deliveryType: 'incoming',
          
          // Package info
          packageType: formData.packageType,
          packageDescription: formData.packageDescription,
          packageWeight: parseInt(formData.packageWeight),
          packageDimensions: formData.packageDimensions,
          temperatureControlled: formData.temperatureControlled,
          temperatureRange: formData.temperatureControlled ? formData.temperatureRange : undefined,
          fragile: formData.fragile,
          urgency: formData.urgency,
          
          // Recipient is the sender's hospital
          recipientHospitalId: session.user.hospitalId,
          recipientCoordinates: myHospital?.address?.coordinates?.coordinates || [0, 0],
          
          // Sender will be determined by admin/system
          senderType: 'warehouse', // or 'supplier'
          
          // Delivery info
          scheduledTime: formData.scheduledTime || undefined,
          specialInstructions: formData.specialInstructions
        };
      } else {
        // For outgoing deliveries (sending to others)
        // Include recipient details from step 2
        deliveryData = {
          deliveryType: 'outgoing',
          // ... include all fields including recipient details
          // Package info
          packageType: formData.packageType,
          packageDescription: formData.packageDescription,
          packageWeight: parseInt(formData.packageWeight),
          packageDimensions: formData.packageDimensions,
          temperatureControlled: formData.temperatureControlled,
          temperatureRange: formData.temperatureControlled ? formData.temperatureRange : undefined,
          fragile: formData.fragile,
          urgency: formData.urgency,
          
          // Recipient details
          recipientType: formData.recipientType,
          recipientHospitalId: formData.recipientHospitalId,
          recipientUserId: formData.recipientUserId,
          recipientName: formData.recipientType === 'hospital' ? formData.hospitalName : formData.recipientName,
          recipientPhone: formData.recipientType === 'hospital' ? formData.hospitalPhone : formData.recipientPhone,
          recipientEmail: formData.recipientEmail,
          recipientAddress: formData.recipientType === 'hospital' ? formData.hospitalAddress : formData.recipientAddress,
          recipientCoordinates: formData.recipientCoordinates || [0, 0],
          
          // Sender info
          senderCoordinates: myHospital?.address?.coordinates?.coordinates || [0, 0],
          
          // Delivery info
          scheduledTime: formData.scheduledTime || undefined,
          specialInstructions: formData.specialInstructions
        };
      }
      
      const res = await fetch('/api/deliveries/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(deliveryData)
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to create delivery');
      }
      
      const result = await res.json();
      
      // Notify admin and pilots
      await fetch('/api/notifications/delivery-created', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deliveryId: result.delivery._id,
          urgency: formData.urgency
        })
      });
      
      // Show success message
      toast.success('Order placed successfully');
      
      // Redirect to tracking page
      router.push(`/dashboard/track/${result.delivery._id}`);


      // // Show success message with toast instead of alert
      // toast.success(
      //   `Order ${result.delivery.orderId} placed successfully! ` +
      //   `${deliveryType === 'incoming' ? 'Admin will process your order and assign a drone.' : 'Relevant staff have been notified.'}`
      // );
      
      // // Redirect to tracking page after a short delay
      // setTimeout(() => {
      //   router.push(`/dashboard/track/${result.delivery._id}`);
      // }, 1500);


    } catch (error) {
      toast.error(error.message || 'Failed to create delivery');
    } finally {
      setLoading(false);
    }
  };

  const urgencyInfo = {
    routine: {
      title: 'Standard Delivery',
      description: 'Regular medical supplies and documents',
      color: 'blue',
      gradient: 'from-blue-600 to-cyan-600',
      estimatedTime: '2-4 hours'
    },
    urgent: {
      title: 'Urgent Delivery',
      description: 'Time-sensitive medications and samples',
      color: 'orange',
      gradient: 'from-orange-600 to-amber-600',
      estimatedTime: '1-2 hours'
    },
    emergency: {
      title: 'Emergency Delivery',
      description: 'Critical supplies, blood, organs',
      color: 'red',
      gradient: 'from-red-600 to-rose-600',
      estimatedTime: '30-60 minutes'
    }
  };

  const currentUrgency = urgencyInfo[formData.urgency];

  return (
    <DashboardLayout>
      <div className="min-h-screen p-4 sm:p-6 lg:p-8">
        {/* Background elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-500/5 rounded-full blur-3xl animate-pulse-slow"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-rose-500/5 rounded-full blur-3xl animate-pulse-slow animation-delay-2000"></div>
        </div>

        {/* Header */}
        <div className="relative mb-6 sm:mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
          >
            <BackIcon className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-sm sm:text-base">Back to Dashboard</span>
          </button>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1 sm:mb-2">Create New Delivery</h1>
              <p className="text-gray-400 text-sm sm:text-base">
                {deliveryType === 'incoming' 
                  ? `Ordering supplies for ${myHospital?.name || 'your hospital'}`
                  : 'Sending delivery to another location'}
              </p>
            </div>
            
            {/* Urgency Badge */}
            <div className={`px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r ${currentUrgency.gradient} rounded-xl shadow-lg`}>
              <p className="text-white font-semibold text-sm sm:text-base">{currentUrgency.title}</p>
              <p className="text-white/80 text-xs sm:text-sm">ETA: {currentUrgency.estimatedTime}</p>
            </div>
          </div>
        </div>

        {/* Delivery Type Selection (Before steps) */}
        {step === 0 && (
          <div className="max-w-3xl mx-auto">
            <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 sm:p-8 border border-red-500/20 animate-fade-in-up">
              <h2 className="text-xl sm:text-2xl font-semibold text-white mb-4 sm:mb-6">What type of delivery?</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <button
                  onClick={() => {
                    setDeliveryType('incoming');
                    setStep(1);
                  }}
                  className="p-6 bg-gray-800/50 rounded-xl border-2 border-gray-700 hover:border-red-500 transition-all group"
                >
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">Order Supplies</h3>
                  <p className="text-gray-400 text-xs sm:text-sm">Order medical supplies for your hospital</p>
                  <p className="text-green-400 text-xs mt-2">Delivered to: {myHospital?.name}</p>
                </button>

                <button
                  onClick={() => {
                    setDeliveryType('outgoing');
                    setStep(1);
                  }}
                  className="p-6 bg-gray-800/50 rounded-xl border-2 border-gray-700 hover:border-red-500 transition-all group"
                >
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-orange-600 to-amber-600 rounded-xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                    </svg>
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">Send Delivery</h3>
                  <p className="text-gray-400 text-xs sm:text-sm">Send items to another hospital or person</p>
                  <p className="text-orange-400 text-xs mt-2">From: {myHospital?.name}</p>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Progress Steps (only show for outgoing, or modified for incoming) */}
        {step > 0 && (
          <div className="flex items-center justify-between mb-6 sm:mb-8 max-w-3xl mx-auto px-4 sm:px-0">
            {deliveryType === 'incoming' ? (
              // Two steps for incoming
              <>
                <div className="flex items-center flex-1">
                  <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-semibold text-sm sm:text-base transition-all ${
                    step >= 1 ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white' : 'bg-gray-800 text-gray-400'
                  }`}>
                    1
                  </div>
                  <div className={`flex-1 h-1 mx-2 sm:mx-4 transition-all ${
                    step > 1 ? 'bg-gradient-to-r from-red-600 to-rose-600' : 'bg-gray-800'
                  }`} />
                </div>
                <div className="flex items-center">
                  <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-semibold text-sm sm:text-base transition-all ${
                    step >= 3 ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white' : 'bg-gray-800 text-gray-400'
                  }`}>
                    2
                  </div>
                </div>
              </>
            ) : (
              // Three steps for outgoing
              [1, 2, 3].map((i) => (
                <div key={i} className="flex items-center flex-1">
                  <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-semibold text-sm sm:text-base transition-all ${
                    step >= i ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white' : 'bg-gray-800 text-gray-400'
                  }`}>
                    {i}
                  </div>
                  {i < 3 && (
                    <div className={`flex-1 h-1 mx-2 sm:mx-4 transition-all ${
                      step > i ? 'bg-gradient-to-r from-red-600 to-rose-600' : 'bg-gray-800'
                    }`} />
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* Form */}
        {step > 0 && (
          <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
            {/* Step 1: Package Details (Same for both) */}
            {step === 1 && (
            <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 sm:p-8 border border-red-500/20 animate-fade-in-up">
              <h2 className="text-xl sm:text-2xl font-semibold text-white mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
                <PackageIcon className="w-6 h-6 sm:w-8 sm:h-8 text-red-400" />
                Package Details
              </h2>

              <div className="space-y-4 sm:space-y-6">
                {/* Package Type */}
                <div>
                  <label className="block text-sm font-medium text-red-400 mb-2">
                    Package Type*
                  </label>
                  <select
                    name="packageType"
                    value={formData.packageType}
                    onChange={handleInputChange}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white text-sm sm:text-base focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                  >
                    <option value="medication">Medication</option>
                    <option value="blood">Blood Samples</option>
                    <option value="organ">Organ for Transplant</option>
                    <option value="medical_supplies">Medical Supplies</option>
                    <option value="documents">Medical Documents</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.packageType && (
                    <p className="mt-1 text-xs sm:text-sm text-red-400">{errors.packageType}</p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-red-400 mb-2">
                    Package Description*
                  </label>
                  <textarea
                    name="packageDescription"
                    value={formData.packageDescription}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="Describe the contents of the package..."
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white text-sm sm:text-base focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                  />
                  {errors.packageDescription && (
                    <p className="mt-1 text-xs sm:text-sm text-red-400">{errors.packageDescription}</p>
                  )}
                </div>

                {/* Weight and Dimensions */}
                  <div>
                    <label className="block text-sm font-medium text-red-400 mb-2">
                      Weight (grams)*
                    </label>
                    <input
                      type="number"
                      name="packageWeight"
                      value={formData.packageWeight}
                      onChange={handleInputChange}
                      placeholder="500"
                      min="1"
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white text-sm sm:text-base focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                    />
                    {errors.packageWeight && (
                      <p className="mt-1 text-xs sm:text-sm text-red-400">{errors.packageWeight}</p>
                    )}
                  </div>

                  {/* ADD PRICING BREAKDOWN HERE */}
                  {formData.packageWeight && formData.urgency && (
                    <PricingBreakdown 
                      deliveryData={{
                        package: {
                          weight: parseInt(formData.packageWeight) || 0,
                          urgency: formData.urgency,
                          temperatureControlled: formData.temperatureControlled,
                          fragile: formData.fragile
                        },
                        flightPath: { 
                          estimatedDistance: 0 // Will be calculated after recipient details
                        }
                      }}
                      className="mt-4 sm:mt-6 animate-fade-in"
                    />
                  )}
                <div className="">
                  <div>
                    <label className="block text-sm font-medium text-red-400 mb-2">
                      Dimensions (cm)
                    </label>
                    <div className="flex flex-wrap gap-2">
                      <input
                        type="number"
                        name="packageDimensions.length"
                        value={formData.packageDimensions.length}
                        onChange={handleInputChange}
                        placeholder="L"
                        className="flex-1 min-w-[60px] px-2 sm:px-3 py-2.5 sm:py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white text-sm sm:text-base focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                      />
                      <input
                        type="number"
                        name="packageDimensions.width"
                        value={formData.packageDimensions.width}
                        onChange={handleInputChange}
                        placeholder="W"
                        className="flex-1 min-w-[60px] px-2 sm:px-3 py-2.5 sm:py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white text-sm sm:text-base focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                      />
                      <input
                        type="number"
                        name="packageDimensions.height"
                        value={formData.packageDimensions.height}
                        onChange={handleInputChange}
                        placeholder="H"
                        className="flex-1 min-w-[60px] px-2 sm:px-3 py-2.5 sm:py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white text-sm sm:text-base focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Special Requirements */}
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 bg-gray-800/30 rounded-xl gap-3">
                    <div className="flex items-center gap-3">
                      <TemperatureIcon className="w-5 h-5 text-blue-400 flex-shrink-0" />
                      <div>
                        <p className="text-white font-medium text-sm sm:text-base">Temperature Controlled</p>
                        <p className="text-gray-400 text-xs sm:text-sm">Package requires specific temperature range</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="temperatureControlled"
                        checked={formData.temperatureControlled}
                        onChange={handleInputChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                    </label>
                  </div>

                  {formData.temperatureControlled && (
                    <div className="ml-0 sm:ml-4 p-3 sm:p-4 bg-blue-500/10 rounded-xl animate-fade-in">
                      <label className="block text-sm font-medium text-blue-400 mb-2">
                        Temperature Range (°C)
                      </label>
                      <div className="flex gap-2 sm:gap-4 items-center">
                        <input
                          type="number"
                          name="temperatureRange.min"
                          value={formData.temperatureRange.min}
                          onChange={handleInputChange}
                          placeholder="Min"
                          className="w-25 sm:w-50 px-3 sm:px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white text-sm sm:text-base"
                        />
                        <span className="text-gray-400 text-sm sm:text-base">to</span>
                        <input
                          type="number"
                          name="temperatureRange.max"
                          value={formData.temperatureRange.max}
                          onChange={handleInputChange}
                          placeholder="Max"
                          className="w-full px-3 sm:px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white text-sm sm:text-base"
                        />
                      </div>
                      {errors.temperatureRange && (
                        <p className="mt-1 text-xs sm:text-sm text-red-400">{errors.temperatureRange}</p>
                      )}
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 bg-gray-800/30 rounded-xl gap-3">
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-yellow-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <div>
                        <p className="text-white font-medium text-sm sm:text-base">Fragile Package</p>
                        <p className="text-gray-400 text-xs sm:text-sm">Requires careful handling</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="fragile"
                        checked={formData.fragile}
                        onChange={handleInputChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                    </label>
                  </div>
                </div>

                {/* Urgency Level */}
                <div>
                  <label className="block text-sm font-medium text-red-400 mb-2">
                    Urgency Level
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                    {Object.entries(urgencyInfo).map(([key, info]) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, urgency: key }))}
                        className={`p-3 sm:p-4 rounded-xl border-2 transition-all ${
                          formData.urgency === key
                            ? `border-transparent bg-gradient-to-r ${info.gradient} text-white`
                            : 'border-gray-700 bg-gray-800/30 text-gray-300 hover:bg-gray-800/50'
                        }`}
                      >
                        <p className="font-semibold text-sm sm:text-base">{info.title}</p>
                        <p className="text-xs sm:text-sm mt-1 opacity-80">{info.estimatedTime}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 sm:justify-between">

                <button
                    type="button"
                    onClick={() => setStep(0)}
                    className="px-6 sm:px-8 py-2.5 sm:py-3 bg-gray-800/50 text-white rounded-xl font-semibold text-sm sm:text-base hover:bg-gray-700/50 transition-all order-2 sm:order-1"
                  >
                    Back
                  </button>
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="px-6 sm:px-8 py-2.5 sm:py-3 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-xl font-semibold text-sm sm:text-base hover:from-red-700 hover:to-rose-700 transition-all flex items-center justify-center gap-2 order-1 sm:order-2"
                >
                  Next Step
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          )}

            {/* Step 2: Recipient Details (Only for outgoing) */}
            {step === 2 && deliveryType === 'outgoing' && (
              <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 sm:p-8 border border-red-500/20 animate-fade-in-up">
                <h2 className="text-xl sm:text-2xl font-semibold text-white mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
                  <LocationIcon className="w-6 h-6 sm:w-8 sm:h-8 text-red-400" />
                  Recipient Details
                </h2>

               <div className="space-y-4 sm:space-y-6">
                 {/* Recipient Type */}
                 <div>
                   <label className="block text-sm font-medium text-red-400 mb-2">
                     Delivery To
                   </label>
                   <div className="grid grid-cols-2 gap-3 sm:gap-4">
                     <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, recipientType: 'hospital' }))}
                      className={`p-3 sm:p-4 rounded-xl border-2 transition-all ${
                        formData.recipientType === 'hospital'
                          ? 'border-red-500 bg-red-500/10 text-red-400'
                          : 'border-gray-700 bg-gray-800/30 text-gray-300 hover:bg-gray-800/50'
                      }`}
                    >
                      <svg className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-1 sm:mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      <p className="font-semibold text-sm sm:text-base">Hospital/Clinic</p>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, recipientType: 'individual' }))}
                      className={`p-3 sm:p-4 rounded-xl border-2 transition-all ${
                        formData.recipientType === 'individual'
                          ? 'border-red-500 bg-red-500/10 text-red-400'
                          : 'border-gray-700 bg-gray-800/30 text-gray-300 hover:bg-gray-800/50'
                      }`}
                    >
                      <svg className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-1 sm:mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <p className="font-semibold text-sm sm:text-base">Individual</p>
                    </button>
                  </div>
                </div>

                {formData.recipientType === 'hospital' ? (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                      <div>
                        <label className="block text-sm font-medium text-red-400 mb-2">
                          Hospital Name*
                        </label>
                        <input
                          type="text"
                          name="hospitalName"
                          value={formData.hospitalName}
                          onChange={handleInputChange}
                          placeholder="City Hospital"
                          className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-800/50 border ${errors.hospitalName ? 'border-red-500' : 'border-gray-700'} rounded-xl text-white text-sm sm:text-base focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all`}
                        />
                        {errors.hospitalName && (
                          <p className="mt-1 text-xs sm:text-sm text-red-400">{errors.hospitalName}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-red-400 mb-2">
                          Contact Number*
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="tel"
                            name="hospitalPhone"
                            value={formData.hospitalPhone}
                            onChange={handleInputChange}
                            placeholder="+1234567890"
                            className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-800/50 border ${errors.hospitalPhone ? 'border-red-500' : 'border-gray-700'} rounded-xl text-white text-sm sm:text-base focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all`}
                          />
                        </div>
                        {errors.hospitalPhone && (
                          <p className="mt-1 text-xs sm:text-sm text-red-400">{errors.hospitalPhone}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-red-400 mb-2">
                        Location*
                      </label>
                      <textarea
                        name="hospitalAddress"
                        value={formData.hospitalAddress}
                        onChange={handleInputChange}
                        rows={3}
                        placeholder="123 Main St, City, State 12345"
                        className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-800/50 border ${errors.hospitalAddress ? 'border-red-500' : 'border-gray-700'} rounded-xl text-white text-sm sm:text-base focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all`}
                      />
                      {errors.hospitalAddress && (
                        <p className="mt-1 text-xs sm:text-sm text-red-400">{errors.hospitalAddress}</p>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                      <div>
                        <label className="block text-sm font-medium text-red-400 mb-2">
                          Recipient Name*
                        </label>
                        <input
                          type="text"
                          name="recipientName"
                          value={formData.recipientName}
                          onChange={handleInputChange}
                          placeholder="John Doe"
                          className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-800/50 border ${errors.recipientName ? 'border-red-500' : 'border-gray-700'} rounded-xl text-white text-sm sm:text-base focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all`}
                        />
                        {errors.recipientName && (
                          <p className="mt-1 text-xs sm:text-sm text-red-400">{errors.recipientName}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-red-400 mb-2">
                          Phone Number*
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="tel"
                            name="recipientPhone"
                            value={formData.recipientPhone}
                            onChange={handleInputChange}
                            placeholder="+91"
                            className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-800/50 border ${errors.recipientPhone ? 'border-red-500' : 'border-gray-700'} rounded-xl text-white text-sm sm:text-base focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all`}
                          />
                        </div>
                        {errors.recipientPhone && (
                          <p className="mt-1 text-xs sm:text-sm text-red-400">{errors.recipientPhone}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-red-400 mb-2">
                        Delivery Address*
                      </label>
                      <textarea
                        name="recipientAddress"
                        value={formData.recipientAddress}
                        onChange={handleInputChange}
                        rows={3}
                        placeholder="123 Main St, City, State 12345"
                        className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-800/50 border ${errors.recipientAddress ? 'border-red-500' : 'border-gray-700'} rounded-xl text-white text-sm sm:text-base focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all`}
                      />
                      {errors.recipientAddress && (
                        <p className="mt-1 text-xs sm:text-sm text-red-400">{errors.recipientAddress}</p>
                      )}
                    </div>
                  </>
                )}
              </div>

              <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 sm:justify-between">
                <button
                  type="button"
                  onClick={handlePreviousStep}
                  className="px-6 sm:px-8 py-2.5 sm:py-3 bg-gray-800/50 text-white rounded-xl font-semibold text-sm sm:text-base hover:bg-gray-700/50 transition-all flex items-center justify-center gap-2 order-2 sm:order-1"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Previous
                </button>
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="px-6 sm:px-8 py-2.5 sm:py-3 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-xl font-semibold text-sm sm:text-base hover:from-red-700 hover:to-rose-700 transition-all flex items-center justify-center gap-2 order-1 sm:order-2"
                >
                  Next Step
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
              </div>
            )}

            {/* Step 3: Review & Schedule */}
            {step === 3 && (
              <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 sm:p-8 border border-red-500/20 animate-fade-in-up">
                <h2 className="text-xl sm:text-2xl font-semibold text-white mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
                  <ClockIcon className="w-6 h-6 sm:w-8 sm:h-8 text-red-400" />
                  Review & Schedule
                </h2>

                {/* Delivery Summary */}
                <div className="space-y-4 sm:space-y-6 mb-6 sm:mb-8">
                  <div className="bg-gray-800/30 rounded-xl p-4 sm:p-6">
                    <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">Order Summary</h3>
                    
                    <div className="space-y-3 sm:space-y-4">
                      {/* Package Info */}
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                        <div>
                          <p className="text-gray-400 text-xs sm:text-sm">Package</p>
                          <p className="text-white font-medium text-sm sm:text-base">{formData.packageType.charAt(0).toUpperCase() + formData.packageType.slice(1)}</p>
                          <p className="text-gray-300 text-xs sm:text-sm">{formData.packageDescription}</p>
                        </div>
                        <div className="text-left sm:text-right">
                          <p className="text-gray-400 text-xs sm:text-sm">Weight</p>
                          <p className="text-white font-medium text-sm sm:text-base">{formData.packageWeight}g</p>
                        </div>
                      </div>

                      {/* Delivery Type Badge */}
                      <div className="border-t border-gray-700 pt-3 sm:pt-4">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400 text-xs sm:text-sm">Delivery Type</span>
                          <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${
                            deliveryType === 'incoming' 
                              ? 'bg-blue-500/20 text-blue-400' 
                              : 'bg-orange-500/20 text-orange-400'
                          }`}>
                            {deliveryType === 'incoming' ? 'Incoming Order' : 'Outgoing Delivery'}
                          </span>
                        </div>
                      </div>

                      {/* Destination */}
                      <div className="border-t border-gray-700 pt-3 sm:pt-4">
                        <p className="text-gray-400 text-xs sm:text-sm mb-2">Delivery Destination</p>
                        <div className="flex items-center gap-2">
                          <LocationIcon className="w-4 h-4 sm:w-5 sm:h-5 text-red-400 flex-shrink-0" />
                          <div>
                            <p className="text-white font-medium text-sm sm:text-base">
                              {deliveryType === 'incoming' 
                                ? myHospital?.name || 'Your Hospital'
                                : 'Recipient Location'}
                            </p>
                            {deliveryType === 'incoming' && (
                              <p className="text-gray-300 text-xs sm:text-sm">
                                {myHospital?.address?.street}, {myHospital?.address?.city}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Special Requirements */}
                      {(formData.temperatureControlled || formData.fragile) && (
                        <div className="border-t border-gray-700 pt-3 sm:pt-4">
                          <p className="text-gray-400 text-xs sm:text-sm mb-2">Special Requirements</p>
                          <div className="flex flex-wrap gap-2">
                            {formData.temperatureControlled && (
                              <span className="px-2 sm:px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs sm:text-sm">
                                Temperature: {formData.temperatureRange.min}°C - {formData.temperatureRange.max}°C
                              </span>
                            )}
                            {formData.fragile && (
                              <span className="px-2 sm:px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs sm:text-sm">
                                Fragile
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Schedule Delivery */}
                  <div>
                    <label className="block text-sm font-medium text-red-400 mb-2">
                      Schedule Delivery (Optional)
                    </label>
                    <input
                      type="datetime-local"
                      name="scheduledTime"
                      value={formData.scheduledTime}
                      onChange={handleInputChange}
                      min={new Date().toISOString().slice(0, 16)}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white text-sm sm:text-base focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                    />
                    <p className="mt-2 text-xs sm:text-sm text-gray-400">
                      Leave empty for immediate dispatch based on urgency level
                    </p>
                  </div>

                  {/* Special Instructions */}
                  <div>
                    <label className="block text-sm font-medium text-red-400 mb-2">
                      Special Instructions (Optional)
                    </label>
                    <textarea
                      name="specialInstructions"
                      value={formData.specialInstructions}
                      onChange={handleInputChange}
                      rows={3}
                      placeholder="Any special handling or delivery instructions..."
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white text-sm sm:text-base focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                    />
                  </div>

                  {/* Notification Info */}
                  <div className="bg-green-500/10 rounded-xl p-3 sm:p-4 border border-green-500/20">
                    <div className="flex items-start gap-3">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <p className="text-green-400 font-medium text-sm sm:text-base">Automatic Notifications</p>
                        <p className="text-gray-300 text-xs sm:text-sm mt-1">
                          Upon placing this order:
                        </p>
                        <ul className="text-gray-400 text-xs sm:text-sm mt-2 space-y-1">
                          <li>• Admin will be notified to process the order</li>
                          <li>• Available pilots will be alerted for {formData.urgency} delivery</li>
                          <li>• You'll receive real-time tracking updates</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ADD FINAL PRICING HERE */} 
                <PricingBreakdown 
                  deliveryData={{
                    package: {
                      weight: parseInt(formData.packageWeight) || 0,
                      urgency: formData.urgency,
                      temperatureControlled: formData.temperatureControlled,
                      fragile: formData.fragile
                    },
                    flightPath: { 
                      estimatedDistance: formData.estimatedDistance || 0 
                    },
                    scheduledTime: formData.scheduledTime
                  }}
                  className="mb-4 sm:mb-6"
                />

                <div className="flex flex-col sm:flex-row gap-3 sm:justify-between">
                  <button
                    type="button"
                    onClick={handlePreviousStep}
                    className="px-6 sm:px-8 py-2.5 sm:py-3 bg-gray-800/50 text-white rounded-xl font-semibold text-sm sm:text-base hover:bg-gray-700/50 transition-all flex items-center justify-center gap-2 order-2 sm:order-1"
                  >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Previous
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 sm:px-8 py-2.5 sm:py-3 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-xl font-semibold text-sm sm:text-base hover:from-red-700 hover:to-rose-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed order-1 sm:order-2"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Placing Order...
                      </>
                    ) : (
                      <>
                        Place Order
                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </form>
        )}
      </div>
    </DashboardLayout>
  );
}

export default function NewDeliveryPage() {
  return (
    <RoleGuard allowedRoles={['medical_staff', 'hospital_admin']}>
      <NewDeliveryContent />
    </RoleGuard>
  );
}
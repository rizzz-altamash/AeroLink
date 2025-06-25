// // app/dashboard/hospitals/verify/page.jsx
// 'use client';

// import { useState, useEffect } from 'react';
// import { useSession } from 'next-auth/react';
// import { useRouter } from 'next/navigation';
// import toast from 'react-hot-toast';

// export default function VerifyHospitalsPage() {
//   const router = useRouter();
//   const { data: session, status } = useSession();
//   const [hospitals, setHospitals] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedHospital, setSelectedHospital] = useState(null);
//   const [showModal, setShowModal] = useState(false);
//   const [verificationNotes, setVerificationNotes] = useState('');
//   const [filter, setFilter] = useState('pending'); // pending, verified, all

//   useEffect(() => {

//     // Wait for session to load
//     if (status === 'loading') return;

//     // Check if user is admin
//     if (status === 'unauthenticated' || session?.user?.role !== 'admin') {
//       router.push('/dashboard');
//       return;
//     }

//     // Fetch hospitals only if user is admin
//     fetchHospitals();
//   }, [session, status, filter, router]);

//   const fetchHospitals = async () => {
//     setLoading(true);
//     try {
//       const res = await fetch(`/api/admin/hospitals?status=${filter}`);
//       if (!res.ok) throw new Error('Failed to fetch hospitals');
//       const data = await res.json();
//       setHospitals(data);
//     } catch (error) {
//       console.error('Error:', error);
//       toast.error('Failed to load hospitals');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleVerification = async (hospitalId, status) => {
//     try {
//       const res = await fetch(`/api/admin/hospitals/${hospitalId}/verify`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ 
//           status, 
//           notes: verificationNotes 
//         })
//       });

//       if (!res.ok) throw new Error('Failed to update verification');
      
//       toast.success(`Hospital ${status === 'verified' ? 'verified' : 'suspended'} successfully`);
//       setShowModal(false);
//       setSelectedHospital(null);
//       setVerificationNotes('');
//       fetchHospitals();
//     } catch (error) {
//       toast.error('Failed to update hospital status');
//     }
//   };

//   const openVerificationModal = (hospital) => {
//     setSelectedHospital(hospital);
//     setShowModal(true);
//   };

//   // Show loading while checking session
//   if (status === 'loading') {
//     return (
//       <div className="min-h-screen bg-gray-950 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
//           <p className="text-gray-400 mt-4">Checking authorization...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-950 relative overflow-hidden">
//       {/* Animated Background - Same as Dashboard */}
//       <div className="absolute inset-0 transition-all duration-700">
//         {/* Grid Pattern */}
//         <div 
//           className="absolute inset-0 bg-[size:4rem_4rem]"
//           style={{
//             backgroundImage: `linear-gradient(to right, #a855f715 1px, transparent 1px), linear-gradient(to bottom, #a855f715 1px, transparent 1px)`
//           }}
//         ></div>
        
//         {/* Gradient Overlay */}
//         <div className="absolute inset-0 bg-gradient-to-br from-purple-950/50 via-gray-950 to-indigo-950/50 transition-all duration-700"></div>
        
//         {/* Animated Elements */}
//         <div className="absolute inset-0">
//           {/* Floating Elements */}
//           <div className="absolute top-20 right-20 animate-float">
//             <div className="w-32 h-32 bg-purple-500/10 rounded-full blur-3xl"></div>
//           </div>
//           <div className="absolute bottom-20 left-20 animate-float-delayed">
//             <div className="w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl"></div>
//           </div>
          
//           {/* Floating Hospital Icon */}
//           <div className="absolute top-1/4 right-1/3 animate-float opacity-10">
//             <svg className="w-24 h-24 text-purple-500" fill="currentColor" viewBox="0 0 24 24">
//               <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
//             </svg>
//           </div>
          
//           {/* Circuit Pattern */}
//           <svg className="absolute inset-0 w-full h-full opacity-5">
//             <pattern id="circuit-pattern" x="0" y="0" width="200" height="200" patternUnits="userSpaceOnUse">
//               <path d="M0 100 L50 100 L50 50 L100 50" stroke="#a855f7" strokeWidth="1" fill="none" />
//               <circle cx="50" cy="100" r="2" fill="#a855f7" />
//               <circle cx="100" cy="50" r="2" fill="#a855f7" />
//             </pattern>
//             <rect width="100%" height="100%" fill="url(#circuit-pattern)" />
//           </svg>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="relative z-10 p-8">
//         {/* Header */}
//         <div className="mb-8">
//           <div className="flex items-start gap-4">
//             <button
//               onClick={() => router.back()}
//               className="p-2 bg-gray-800/50 backdrop-blur-xl hover:bg-gray-700/50 text-gray-400 hover:text-white rounded-lg transition-all group"
//             >
//               <svg className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
//               </svg>
//             </button>
//             <div>
//               <h1 className="text-3xl font-bold text-white mb-2">Hospital Verification</h1>
//               <p className="text-gray-400">Review and verify hospital registrations</p>
//             </div>
//           </div>
//         </div>

//       {/* Filter Tabs */}
//       <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl p-1 inline-flex mb-6">
//         <button
//           onClick={() => setFilter('pending')}
//           className={`px-4 py-2 rounded-lg font-medium transition-all ${
//             filter === 'pending' 
//               ? 'bg-purple-600 text-white' 
//               : 'text-gray-400 hover:text-white'
//           }`}
//         >
//           Pending
//         </button>
//         <button
//           onClick={() => setFilter('verified')}
//           className={`px-4 py-2 rounded-lg font-medium transition-all ${
//             filter === 'verified' 
//               ? 'bg-purple-600 text-white' 
//               : 'text-gray-400 hover:text-white'
//           }`}
//         >
//           Verified
//         </button>
//         <button
//           onClick={() => setFilter('all')}
//           className={`px-4 py-2 rounded-lg font-medium transition-all ${
//             filter === 'all' 
//               ? 'bg-purple-600 text-white' 
//               : 'text-gray-400 hover:text-white'
//           }`}
//         >
//           All
//         </button>
//       </div>

//       {/* Hospitals Grid */}
//       {loading ? (
//         <div className="text-center py-12">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
//           <p className="text-gray-400 mt-4">Loading hospitals...</p>
//         </div>
//       ) : hospitals.length === 0 ? (
//         <div className="text-center py-12 bg-gray-900/50 backdrop-blur-xl rounded-2xl border border-purple-500/20">
//           <HospitalIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
//           <p className="text-gray-400">No hospitals found</p>
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {hospitals.map((hospital, index) => (
//             <div 
//               key={hospital._id}
//               className="animate-fade-in-up"
//               style={{ animationDelay: `${index * 100}ms` }}
//             >
//               <HospitalCard 
//                 hospital={hospital} 
//                 onVerify={() => openVerificationModal(hospital)}
//               />
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Verification Modal */}
//       {showModal && selectedHospital && (
//         <VerificationModal
//           hospital={selectedHospital}
//           notes={verificationNotes}
//           setNotes={setVerificationNotes}
//           onVerify={(status) => handleVerification(selectedHospital._id, status)}
//           onClose={() => {
//             setShowModal(false);
//             setSelectedHospital(null);
//             setVerificationNotes('');
//           }}
//           />
//         )}
//   </div>

//   {/* Styles for animations */}
//   <style jsx>{`
//     @keyframes float {
//       0%, 100% { transform: translateY(0px); }
//       50% { transform: translateY(-20px); }
//     }
//     @keyframes float-delayed {
//       0%, 100% { transform: translateY(0px); }
//       50% { transform: translateY(-30px); }
//     }
//     @keyframes fade-in-up {
//       0% { 
//         opacity: 0;
//         transform: translateY(20px);
//       }
//       100% { 
//         opacity: 1;
//         transform: translateY(0);
//       }
//     }
//     .animate-float { animation: float 6s ease-in-out infinite; }
//     .animate-float-delayed { animation: float-delayed 8s ease-in-out infinite; }
//     .animate-fade-in-up { 
//       animation: fade-in-up 0.5s ease-out forwards;
//       opacity: 0;
//     }
//   `}</style>
// </div>
// );
// }

// // Hospital Card Component
// function HospitalCard({ hospital, onVerify }) {
//   const statusColors = {
//     pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
//     verified: 'bg-green-500/20 text-green-400 border-green-500/30',
//     suspended: 'bg-red-500/20 text-red-400 border-red-500/30'
//   };

//   const statusClass = statusColors[hospital.verificationStatus] || statusColors.pending;

//   return (
//     <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/20 hover:border-purple-500/30 transition-all hover:transform hover:-translate-y-1 hover:shadow-lg hover:shadow-purple-500/10">
//       <div className="flex items-start justify-between mb-4">
//         <div>
//           <h3 className="text-lg font-semibold text-white">{hospital.name}</h3>
//           <p className="text-sm text-gray-400">Reg: {hospital.registrationNumber}</p>
//         </div>
//         <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusClass}`}>
//           {hospital.verificationStatus}
//         </span>
//       </div>

//       <div className="space-y-2 mb-4">
//         <InfoItem label="Type" value={hospital.type} />
//         <InfoItem label="City" value={`${hospital.address?.city}, ${hospital.address?.state}`} />
//         <InfoItem label="Email" value={hospital.contactInfo?.email} />
//         <InfoItem label="Phone" value={hospital.contactInfo?.primaryPhone} />
//         <InfoItem 
//           label="Registered" 
//           value={new Date(hospital.createdAt).toLocaleDateString()} 
//         />
//       </div>

//       <div className="flex gap-2">
//         <button
//           onClick={onVerify}
//           className="flex-1 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-all"
//         >
//           Review
//         </button>
//         {hospital.contactInfo?.website && (
//           <a
//             href={hospital.contactInfo.website}
//             target="_blank"
//             rel="noopener noreferrer"
//             className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-all flex items-center justify-center group"
//             title="Visit Website"
//           >
//             <LinkIcon className="w-4 h-4 group-hover:scale-110 transition-transform" />
//           </a>
//         )}
//       </div>
//     </div>
//   );
// }

// // Info Item Component
// function InfoItem({ label, value }) {
//   return (
//     <div className="flex justify-between text-sm">
//       <span className="text-gray-500">{label}:</span>
//       <span className="text-gray-300 text-right">{value || 'N/A'}</span>
//     </div>
//   );
// }

// // Verification Modal
// function VerificationModal({ hospital, notes, setNotes, onVerify, onClose }) {
//   return (
//     <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
//       <div className="bg-gray-900 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
//         <h2 className="text-2xl font-bold text-white mb-4">Verify Hospital</h2>
        
//         {/* Hospital Details */}
//         <div className="bg-gray-800/50 rounded-xl p-4 mb-6">
//           <h3 className="text-lg font-semibold text-white mb-3">{hospital.name}</h3>
          
//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <p className="text-gray-400 text-sm">Registration Number</p>
//               <p className="text-white font-medium">{hospital.registrationNumber}</p>
//             </div>
//             <div>
//               <p className="text-gray-400 text-sm">Type</p>
//               <p className="text-white font-medium capitalize">{hospital.type}</p>
//             </div>
//             <div>
//               <p className="text-gray-400 text-sm">Email</p>
//               <p className="text-white">{hospital.contactInfo?.email}</p>
//             </div>
//             <div>
//               <p className="text-gray-400 text-sm">Phone</p>
//               <p className="text-white">{hospital.contactInfo?.primaryPhone}</p>
//             </div>
//             <div className="col-span-2">
//               <p className="text-gray-400 text-sm">Address</p>
//               <p className="text-white">
//                 {hospital.address?.street}, {hospital.address?.city}, {' '}
//                 {hospital.address?.state} - {hospital.address?.zipCode}
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Verification Notes */}
//         <div className="mb-6">
//           <label className="text-gray-400 text-sm block mb-2">
//             Verification Notes (Optional)
//           </label>
//           <textarea
//             value={notes}
//             onChange={(e) => setNotes(e.target.value)}
//             className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:outline-none"
//             placeholder="Add any notes about this verification..."
//             rows={3}
//           />
//         </div>

//         {/* Actions */}
//         <div className="flex gap-3">
//           <button
//             onClick={() => onVerify('verified')}
//             className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-all"
//           >
//             Verify Hospital
//           </button>
//           <button
//             onClick={() => onVerify('suspended')}
//             className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-all"
//           >
//             Suspend Hospital
//           </button>
//           <button
//             onClick={onClose}
//             className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold transition-all"
//           >
//             Cancel
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// // Icons
// const HospitalIcon = ({ className }) => (
//   <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
//   </svg>
// );

// const LinkIcon = ({ className }) => (
//   <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
//   </svg>
// );








// Responsive 
// app/dashboard/hospitals/verify/page.jsx
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function VerifyHospitalsPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [verificationNotes, setVerificationNotes] = useState('');
  const [filter, setFilter] = useState('pending'); // pending, verified, all

  useEffect(() => {

    // Wait for session to load
    if (status === 'loading') return;

    // Check if user is admin
    if (status === 'unauthenticated' || session?.user?.role !== 'admin') {
      router.push('/dashboard');
      return;
    }

    // Fetch hospitals only if user is admin
    fetchHospitals();
  }, [session, status, filter, router]);

  const fetchHospitals = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/hospitals?status=${filter}`);
      if (!res.ok) throw new Error('Failed to fetch hospitals');
      const data = await res.json();
      setHospitals(data);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to load hospitals');
    } finally {
      setLoading(false);
    }
  };

  const handleVerification = async (hospitalId, status) => {
    try {
      const res = await fetch(`/api/admin/hospitals/${hospitalId}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          status, 
          notes: verificationNotes 
        })
      });

      if (!res.ok) throw new Error('Failed to update verification');
      
      toast.success(`Hospital ${status === 'verified' ? 'verified' : 'suspended'} successfully`);
      setShowModal(false);
      setSelectedHospital(null);
      setVerificationNotes('');
      fetchHospitals();
    } catch (error) {
      toast.error('Failed to update hospital status');
    }
  };

  const openVerificationModal = (hospital) => {
    setSelectedHospital(hospital);
    setShowModal(true);
  };

  // Show loading while checking session
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-purple-500 mx-auto"></div>
          <p className="text-gray-400 mt-4 text-sm sm:text-base">Checking authorization...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 relative overflow-hidden">
      {/* Animated Background - Same as Dashboard */}
      <div className="absolute inset-0 transition-all duration-700">
        {/* Grid Pattern */}
        <div 
          className="absolute inset-0 bg-[size:3rem_3rem] sm:bg-[size:4rem_4rem]"
          style={{
            backgroundImage: `linear-gradient(to right, #a855f715 1px, transparent 1px), linear-gradient(to bottom, #a855f715 1px, transparent 1px)`
          }}
        ></div>
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-950/50 via-gray-950 to-indigo-950/50 transition-all duration-700"></div>
        
        {/* Animated Elements */}
        <div className="absolute inset-0">
          {/* Floating Elements */}
          <div className="absolute top-10 right-10 sm:top-20 sm:right-20 animate-float">
            <div className="w-20 h-20 sm:w-32 sm:h-32 bg-purple-500/10 rounded-full blur-3xl"></div>
          </div>
          <div className="absolute bottom-10 left-10 sm:bottom-20 sm:left-20 animate-float-delayed">
            <div className="w-24 h-24 sm:w-40 sm:h-40 bg-indigo-500/10 rounded-full blur-3xl"></div>
          </div>
          
          {/* Floating Hospital Icon */}
          <div className="absolute top-1/4 right-1/3 animate-float opacity-10 hidden sm:block">
            <svg className="w-16 h-16 sm:w-24 sm:h-24 text-purple-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
            </svg>
          </div>
          
          {/* Circuit Pattern */}
          <svg className="absolute inset-0 w-full h-full opacity-5">
            <pattern id="circuit-pattern" x="0" y="0" width="200" height="200" patternUnits="userSpaceOnUse">
              <path d="M0 100 L50 100 L50 50 L100 50" stroke="#a855f7" strokeWidth="1" fill="none" />
              <circle cx="50" cy="100" r="2" fill="#a855f7" />
              <circle cx="100" cy="50" r="2" fill="#a855f7" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#circuit-pattern)" />
          </svg>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-start gap-3 sm:gap-4">
            <button
              onClick={() => router.back()}
              className="p-1.5 sm:p-2 bg-gray-800/50 backdrop-blur-xl hover:bg-gray-700/50 text-gray-400 hover:text-white rounded-lg transition-all group"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1 sm:mb-2">Hospital Verification</h1>
              <p className="text-sm sm:text-base text-gray-400">Review and verify hospital registrations</p>
            </div>
          </div>
        </div>

      {/* Filter Tabs */}
      <div className="bg-gray-900/50 backdrop-blur-xl rounded-lg sm:rounded-xl p-1 inline-flex mb-4 sm:mb-6 w-full sm:w-auto overflow-x-auto">
        <button
          onClick={() => setFilter('pending')}
          className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-md sm:rounded-lg font-medium transition-all text-sm sm:text-base whitespace-nowrap ${
            filter === 'pending' 
              ? 'bg-purple-600 text-white' 
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Pending
        </button>
        <button
          onClick={() => setFilter('verified')}
          className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-md sm:rounded-lg font-medium transition-all text-sm sm:text-base whitespace-nowrap ${
            filter === 'verified' 
              ? 'bg-purple-600 text-white' 
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Verified
        </button>
        <button
          onClick={() => setFilter('all')}
          className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-md sm:rounded-lg font-medium transition-all text-sm sm:text-base whitespace-nowrap ${
            filter === 'all' 
              ? 'bg-purple-600 text-white' 
              : 'text-gray-400 hover:text-white'
          }`}
        >
          All
        </button>
      </div>

      {/* Hospitals Grid */}
      {loading ? (
        <div className="text-center py-8 sm:py-12">
          <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-purple-500 mx-auto"></div>
          <p className="text-gray-400 mt-3 sm:mt-4 text-sm sm:text-base">Loading hospitals...</p>
        </div>
      ) : hospitals.length === 0 ? (
        <div className="text-center py-8 sm:py-12 bg-gray-900/50 backdrop-blur-xl rounded-xl sm:rounded-2xl border border-purple-500/20">
          <HospitalIcon className="w-12 h-12 sm:w-16 sm:h-16 text-gray-600 mx-auto mb-3 sm:mb-4" />
          <p className="text-gray-400 text-sm sm:text-base">No hospitals found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          {hospitals.map((hospital, index) => (
            <div 
              key={hospital._id}
              className="animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <HospitalCard 
                hospital={hospital} 
                onVerify={() => openVerificationModal(hospital)}
              />
            </div>
          ))}
        </div>
      )}

      {/* Verification Modal */}
      {showModal && selectedHospital && (
        <VerificationModal
          hospital={selectedHospital}
          notes={verificationNotes}
          setNotes={setVerificationNotes}
          onVerify={(status) => handleVerification(selectedHospital._id, status)}
          onClose={() => {
            setShowModal(false);
            setSelectedHospital(null);
            setVerificationNotes('');
          }}
          />
        )}
  </div>

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
    @keyframes fade-in-up {
      0% { 
        opacity: 0;
        transform: translateY(20px);
      }
      100% { 
        opacity: 1;
        transform: translateY(0);
      }
    }
    .animate-float { animation: float 6s ease-in-out infinite; }
    .animate-float-delayed { animation: float-delayed 8s ease-in-out infinite; }
    .animate-fade-in-up { 
      animation: fade-in-up 0.5s ease-out forwards;
      opacity: 0;
    }
  `}</style>
</div>
);
}

// Hospital Card Component
function HospitalCard({ hospital, onVerify }) {
  const statusColors = {
    pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    verified: 'bg-green-500/20 text-green-400 border-green-500/30',
    suspended: 'bg-red-500/20 text-red-400 border-red-500/30'
  };

  const statusClass = statusColors[hospital.verificationStatus] || statusColors.pending;

  return (
    <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-purple-500/20 hover:border-purple-500/30 transition-all hover:transform hover:-translate-y-1 hover:shadow-lg hover:shadow-purple-500/10">
      <div className="flex items-start justify-between mb-3 sm:mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-base sm:text-lg font-semibold text-white truncate">{hospital.name}</h3>
          <p className="text-xs sm:text-sm text-gray-400">Reg: {hospital.registrationNumber}</p>
        </div>
        <span className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-medium border ${statusClass} ml-2`}>
          {hospital.verificationStatus}
        </span>
      </div>

      <div className="space-y-1.5 sm:space-y-2 mb-3 sm:mb-4">
        <InfoItem label="Type" value={hospital.type} />
        <InfoItem label="City" value={`${hospital.address?.city}, ${hospital.address?.state}`} />
        <InfoItem label="Email" value={hospital.contactInfo?.email} />
        <InfoItem label="Phone" value={hospital.contactInfo?.primaryPhone} />
        <InfoItem 
          label="Registered" 
          value={new Date(hospital.createdAt).toLocaleDateString()} 
        />
      </div>

      <div className="flex gap-2">
        <button
          onClick={onVerify}
          className="flex-1 py-1.5 sm:py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-all text-sm sm:text-base"
        >
          Review
        </button>
        {hospital.contactInfo?.website && (
          <a
            href={hospital.contactInfo.website}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-all flex items-center justify-center group"
            title="Visit Website"
          >
            <LinkIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:scale-110 transition-transform" />
          </a>
        )}
      </div>
    </div>
  );
}

// Info Item Component
function InfoItem({ label, value }) {
  return (
    <div className="flex justify-between text-xs sm:text-sm gap-2">
      <span className="text-gray-500 whitespace-nowrap">{label}:</span>
      <span className="text-gray-300 text-right truncate">{value || 'N/A'}</span>
    </div>
  );
}

// Verification Modal
function VerificationModal({ hospital, notes, setNotes, onVerify, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 rounded-xl sm:rounded-2xl p-4 sm:p-6 max-w-full sm:max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">Verify Hospital</h2>
        
        {/* Hospital Details */}
        <div className="bg-gray-800/50 rounded-lg sm:rounded-xl p-3 sm:p-4 mb-4 sm:mb-6">
          <h3 className="text-base sm:text-lg font-semibold text-white mb-2 sm:mb-3">{hospital.name}</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <p className="text-gray-400 text-xs sm:text-sm">Registration Number</p>
              <p className="text-white font-medium text-sm sm:text-base truncate">{hospital.registrationNumber}</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs sm:text-sm">Type</p>
              <p className="text-white font-medium capitalize text-sm sm:text-base">{hospital.type}</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs sm:text-sm">Email</p>
              <p className="text-white text-sm sm:text-base truncate">{hospital.contactInfo?.email}</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs sm:text-sm">Phone</p>
              <p className="text-white text-sm sm:text-base">{hospital.contactInfo?.primaryPhone}</p>
            </div>
            <div className="col-span-1 sm:col-span-2">
              <p className="text-gray-400 text-xs sm:text-sm">Address</p>
              <p className="text-white text-sm sm:text-base">
                {hospital.address?.street}, {hospital.address?.city}, {' '}
                {hospital.address?.state} - {hospital.address?.zipCode}
              </p>
            </div>
          </div>
        </div>

        {/* Verification Notes */}
        <div className="mb-4 sm:mb-6">
          <label className="text-gray-400 text-xs sm:text-sm block mb-1.5 sm:mb-2">
            Verification Notes (Optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full bg-gray-800 text-white rounded-lg px-3 sm:px-4 py-2 sm:py-3 focus:ring-2 focus:ring-purple-500 focus:outline-none text-sm sm:text-base"
            placeholder="Add any notes about this verification..."
            rows={3}
          />
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <button
            onClick={() => onVerify('verified')}
            className="flex-1 py-2.5 sm:py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-all text-sm sm:text-base"
          >
            Verify Hospital
          </button>
          <button
            onClick={() => onVerify('suspended')}
            className="flex-1 py-2.5 sm:py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-all text-sm sm:text-base"
          >
            Suspend Hospital
          </button>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold transition-all text-sm sm:text-base"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// Icons
const HospitalIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

const LinkIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
  </svg>
);
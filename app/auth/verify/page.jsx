// // app/auth/verify/page.jsx
// 'use client';

// import { useState, useEffect } from 'react';
// import { useSearchParams, useRouter } from 'next/navigation';
// import Link from 'next/link';

// export default function VerifyEmailPage() {
//   const searchParams = useSearchParams();
//   const router = useRouter();
//   const token = searchParams.get('token');
//   const email = searchParams.get('email');
  
//   const [status, setStatus] = useState('verifying'); // verifying, success, error, pending
//   const [error, setError] = useState('');
//   const [countdown, setCountdown] = useState(10);

//   useEffect(() => {
//     if (token) {
//       verifyEmail();
//     } else {
//       setStatus('pending');
//     }
//   }, [token]);

//   useEffect(() => {
//     if (status === 'success' && countdown > 0) {
//       const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
//       return () => clearTimeout(timer);
//     } else if (status === 'success' && countdown === 0) {
//       router.push('/auth/signin');
//     }
//   }, [status, countdown, router]);

//   const verifyEmail = async () => {
//     try {
//       const res = await fetch('/api/auth/verify-email', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ token })
//       });

//       const data = await res.json();

//       if (res.ok) {
//         setStatus('success');
//       } else {
//         setError(data.error || 'Verification failed');
//         setStatus('error');
//       }
//     } catch (err) {
//       setError('Network error. Please try again.');
//       setStatus('error');
//     }
//   };

//   const resendVerification = async () => {
//     if (!email) {
//       setError('Email address not found');
//       return;
//     }

//     setStatus('verifying');
//     try {
//       const res = await fetch('/api/auth/resend-verification', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ email })
//       });

//       const data = await res.json();

//       if (res.ok) {
//         setStatus('pending');
//         setError('');
//       } else {
//         setError(data.error || 'Failed to resend verification');
//         setStatus('error');
//       }
//     } catch (err) {
//       setError('Network error. Please try again.');
//       setStatus('error');
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-950 relative overflow-hidden">
//       {/* Animated Background */}
//       <div className="absolute inset-0">
//         <div className="absolute inset-0 bg-[linear-gradient(to_right,#10b98115_1px,transparent_1px),linear-gradient(to_bottom,#10b98115_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
//         <div className="absolute inset-0 bg-gradient-to-br from-blue-950/50 via-gray-950 to-blue-950/50"></div>
        
//         {/* Floating Elements */}
//         <div className="hidden md:block absolute top-20 left-20 animate-float">
//           <svg className="w-24 h-24 text-cyan-500/10" viewBox="0 0 24 24" fill="currentColor">
//             <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
//           </svg>
//         </div>
//         <div className="hidden md:block absolute bottom-32 right-20 animate-float-delayed">
//           <svg className="w-32 h-32 text-cyan-500/10" viewBox="0 0 24 24" fill="currentColor">
//             <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
//           </svg>
//         </div>
//         <div className="hidden md:block absolute bottom-32 left-20 animate-float-delayed">
//           <svg className="w-32 h-32 text-cyan-500/10" fill="currentColor" viewBox="0 0 24 24">
//             <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/>
//           </svg>
//         </div>
//       </div>

//       {/* Content */}
//       <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12">
//         <div className="max-w-md w-full">
//           <div className="bg-gray-900/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-gray-800">
//             {/* Status Icons */}
//             <div className="text-center mb-6">
//               {status === 'verifying' && (
//                 <div className="inline-flex items-center justify-center w-24 h-24 bg-blue-600/20 rounded-full mb-4">
//                   <svg className="w-12 h-12 text-blue-500 animate-spin" fill="none" viewBox="0 0 24 24">
//                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                   </svg>
//                 </div>
//               )}
              
//               {status === 'success' && (
//                 <div className="inline-flex items-center justify-center w-24 h-24 bg-green-600/20 rounded-full mb-4">
//                   <svg className="w-12 h-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//                   </svg>
//                 </div>
//               )}
              
//               {status === 'error' && (
//                 <div className="inline-flex items-center justify-center w-24 h-24 bg-red-600/20 rounded-full mb-4">
//                   <svg className="w-12 h-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                   </svg>
//                 </div>
//               )}
              
//               {status === 'pending' && (
//                 <div className="inline-flex items-center justify-center w-24 h-24 bg-yellow-600/20 rounded-full mb-4">
//                   <svg className="w-12 h-12 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
//                   </svg>
//                 </div>
//               )}
//             </div>

//             {/* Content based on status */}
//             {status === 'verifying' && (
//               <>
//                 <h1 className="text-2xl font-bold text-white text-center mb-4">
//                   Verifying Your Email
//                 </h1>
//                 <p className="text-gray-400 text-center">
//                   Please wait while we verify your email address...
//                 </p>
//               </>
//             )}

//             {status === 'success' && (
//               <>
//                 <h1 className="text-2xl font-bold text-white text-center mb-4">
//                   Email Verified!
//                 </h1>
//                 <p className="text-gray-400 text-center mb-6">
//                   Your email has been successfully verified. You can now sign in to your account.
//                 </p>
//                 <div className="text-center">
//                   <p className="text-sm text-gray-500 mb-4">
//                     Redirecting to sign in page in {countdown} seconds...
//                   </p>
//                   <Link 
//                     href="/auth/signin"
//                     className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold rounded-xl transition-all"
//                   >
//                     <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
//                     </svg>
//                     Sign In Now
//                   </Link>
//                 </div>
//               </>
//             )}

//             {status === 'error' && (
//               <>
//                 <h1 className="text-2xl font-bold text-white text-center mb-4">
//                   Verification Failed
//                 </h1>
//                 <p className="text-red-400 text-center mb-6">
//                   {error}
//                 </p>
//                 <div className="space-y-3">
//                   {email && (
//                     <button
//                       onClick={resendVerification}
//                       className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all"
//                     >
//                       Resend Verification Email
//                     </button>
//                   )}
//                   <Link 
//                     href="/auth/signup"
//                     className="block w-full py-3 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-xl transition-all text-center"
//                   >
//                     Back to Sign Up
//                   </Link>
//                 </div>
//               </>
//             )}

//             {status === 'pending' && (
//               <>
//                 <h1 className="text-2xl font-bold text-white text-center mb-4">
//                   Check Your Email
//                 </h1>
//                 {email ? (
//                   <>
//                     <p className="text-gray-400 text-center mb-2">
//                       We've sent a verification email to:
//                     </p>
//                     <p className="text-white text-center font-medium mb-6">
//                       {email}
//                     </p>
//                     <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 mb-6">
//                       <p className="text-blue-400 text-sm">
//                         <strong>Tip:</strong> Check your spam folder if you don't see the email in your inbox.
//                       </p>
//                     </div>
//                     <button
//                       onClick={resendVerification}
//                       className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all"
//                     >
//                       Resend Verification Email
//                     </button>
//                   </>
//                 ) : (
//                   <>
//                     <p className="text-gray-400 text-center mb-6">
//                       Please check your email for the verification link we sent you.
//                     </p>
//                     <Link 
//                       href="/auth/signin"
//                       className="block w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all text-center"
//                     >
//                       Go to Sign In
//                     </Link>
//                   </>
//                 )}
//               </>
//             )}
//           </div>
//         </div>
//       </div>

//       <style jsx>{`
//         @keyframes float {
//           0%, 100% { transform: translateY(0px); }
//           50% { transform: translateY(-20px); }
//         }
//         @keyframes float-delayed {
//           0%, 100% { transform: translateY(0px); }
//           50% { transform: translateY(-30px); }
//         }
//         .animate-float { animation: float 6s ease-in-out infinite; }
//         .animate-float-delayed { animation: float-delayed 8s ease-in-out infinite; }
//       `}</style>
//     </div>
//   );
// }










// Responsive 
// app/auth/verify/page.jsx
'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');
  const email = searchParams.get('email');
  
  const [status, setStatus] = useState('verifying'); // verifying, success, error, pending
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    if (token) {
      verifyEmail();
    } else {
      setStatus('pending');
    }
  }, [token]);

  useEffect(() => {
    if (status === 'success' && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (status === 'success' && countdown === 0) {
      router.push('/auth/signin');
    }
  }, [status, countdown, router]);

  const verifyEmail = async () => {
    try {
      const res = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      });

      const data = await res.json();

      if (res.ok) {
        setStatus('success');
      } else {
        setError(data.error || 'Verification failed');
        setStatus('error');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      setStatus('error');
    }
  };

  const resendVerification = async () => {
    if (!email) {
      setError('Email address not found');
      return;
    }

    setStatus('verifying');
    try {
      const res = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await res.json();

      if (res.ok) {
        setStatus('pending');
        setError('');
      } else {
        setError(data.error || 'Failed to resend verification');
        setStatus('error');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#10b98115_1px,transparent_1px),linear-gradient(to_bottom,#10b98115_1px,transparent_1px)] bg-[size:2rem_2rem] sm:bg-[size:3rem_3rem] md:bg-[size:4rem_4rem]"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950/50 via-gray-950 to-green-950/50"></div>
        
        {/* Floating Elements */}
        <div className="hidden md:block absolute top-10 sm:top-20 left-10 sm:left-20 animate-float">
          <svg className="w-16 sm:w-24 h-16 sm:h-24 text-cyan-500/10" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
          </svg>
        </div>
        <div className="hidden md:block absolute bottom-20 sm:bottom-32 right-10 sm:right-20 animate-float-delayed">
          <svg className="w-20 sm:w-32 h-20 sm:h-32 text-cyan-500/10" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
          </svg>
        </div>
        <div className="hidden md:block absolute bottom-20 sm:bottom-32 left-10 sm:left-20 animate-float-delayed">
          <svg className="w-20 sm:w-32 h-20 sm:h-32 text-cyan-500/10" fill="currentColor" viewBox="0 0 24 24">
            <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/>
          </svg>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-8 sm:py-12">
        <div className="max-w-md w-full">
          <div className="bg-gray-900/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 border border-gray-800">
            {/* Status Icons */}
            <div className="text-center mb-4 sm:mb-6">
              {status === 'verifying' && (
                <div className="inline-flex items-center justify-center w-16 sm:w-20 md:w-24 h-16 sm:h-20 md:h-24 bg-blue-600/20 rounded-full mb-3 sm:mb-4">
                  <svg className="w-8 sm:w-10 md:w-12 h-8 sm:h-10 md:h-12 text-blue-500 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
              )}
              
              {status === 'success' && (
                <div className="inline-flex items-center justify-center w-16 sm:w-20 md:w-24 h-16 sm:h-20 md:h-24 bg-green-600/20 rounded-full mb-3 sm:mb-4">
                  <svg className="w-8 sm:w-10 md:w-12 h-8 sm:h-10 md:h-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              )}
              
              {status === 'error' && (
                <div className="inline-flex items-center justify-center w-16 sm:w-20 md:w-24 h-16 sm:h-20 md:h-24 bg-red-600/20 rounded-full mb-3 sm:mb-4">
                  <svg className="w-8 sm:w-10 md:w-12 h-8 sm:h-10 md:h-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              )}
              
              {status === 'pending' && (
                <div className="inline-flex items-center justify-center w-16 sm:w-20 md:w-24 h-16 sm:h-20 md:h-24 bg-yellow-600/20 rounded-full mb-3 sm:mb-4">
                  <svg className="w-8 sm:w-10 md:w-12 h-8 sm:h-10 md:h-12 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
            </div>

            {/* Content based on status */}
            {status === 'verifying' && (
              <>
                <h1 className="text-xl sm:text-2xl font-bold text-white text-center mb-3 sm:mb-4">
                  Verifying Your Email
                </h1>
                <p className="text-gray-400 text-center text-sm sm:text-base">
                  Please wait while we verify your email address...
                </p>
              </>
            )}

            {status === 'success' && (
              <>
                <h1 className="text-xl sm:text-2xl font-bold text-white text-center mb-3 sm:mb-4">
                  Email Verified!
                </h1>
                <p className="text-gray-400 text-center mb-4 sm:mb-6 text-sm sm:text-base">
                  Your email has been successfully verified. You can now sign in to your account.
                </p>
                <div className="text-center">
                  <p className="text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4">
                    Redirecting to sign in page in {countdown} seconds...
                  </p>
                  <Link 
                    href="/auth/signin"
                    className="inline-flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold rounded-lg sm:rounded-xl transition-all text-sm sm:text-base"
                  >
                    <svg className="w-4 sm:w-5 h-4 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    Sign In Now
                  </Link>
                </div>
              </>
            )}

            {status === 'error' && (
              <>
                <h1 className="text-xl sm:text-2xl font-bold text-white text-center mb-3 sm:mb-4">
                  Verification Failed
                </h1>
                <p className="text-red-400 text-center mb-4 sm:mb-6 text-sm sm:text-base">
                  {error}
                </p>
                <div className="space-y-3">
                  {email && (
                    <>
                      <button
                        onClick={resendVerification}
                        className="w-full py-2.5 sm:py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg sm:rounded-xl transition-all text-sm sm:text-base"
                      >
                        Resend Verification Email
                      </button>
                      <div className="text-center">
                        <p className="text-xs sm:text-sm text-gray-400 mb-2">Already verified?</p>
                        <Link 
                          href="/auth/signin"
                          className="inline-flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold rounded-lg sm:rounded-xl transition-all text-sm sm:text-base"
                        >
                          <svg className="w-4 sm:w-5 h-4 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                          </svg>
                          Sign In Now
                        </Link>
                      </div>
                    </>
                  )}
                  <Link 
                    href="/auth/signup"
                    className="block w-full py-2.5 sm:py-3 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-lg sm:rounded-xl transition-all text-center text-sm sm:text-base"
                  >
                    Back to Sign Up
                  </Link>
                </div>
              </>
            )}

            {status === 'pending' && (
              <>
                <h1 className="text-xl sm:text-2xl font-bold text-white text-center mb-3 sm:mb-4">
                  Check Your Email
                </h1>
                {email ? (
                  <>
                    <p className="text-gray-400 text-center mb-2 text-sm sm:text-base">
                      We've sent a verification email to:
                    </p>
                    <p className="text-white text-center font-medium mb-4 sm:mb-6 text-sm sm:text-base break-all">
                      {email}
                    </p>
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg sm:rounded-xl p-3 sm:p-4 mb-4 sm:mb-6">
                      <p className="text-blue-400 text-xs sm:text-sm">
                        <strong>Tip:</strong> Check your spam folder if you don't see the email in your inbox.
                      </p>
                    </div>
                    <button
                      onClick={resendVerification}
                      className="w-full py-2.5 sm:py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg sm:rounded-xl transition-all text-sm sm:text-base mb-3"
                    >
                      Resend Verification Email
                    </button>

                    {/* Divider */}
                    <div className="relative my-8">
                      <div className="absolute inset-0 flex items-center">
                        <div className={`w-full border-t border-blue-500/30`}></div>
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className={`px-4 bg-gray-900/80 text-white opacity-60`}>Already verified?</span>
                      </div>
                    </div>

                    <div className="text-center">
                      {/* <p className="text-xs sm:text-sm text-gray-400 mb-2">Already verified?</p> */}
                      <Link 
                        href="/auth/signin"
                        className="inline-flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold rounded-lg sm:rounded-xl transition-all text-sm sm:text-base"
                      >
                        <svg className="w-4 sm:w-5 h-4 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                        </svg>
                        Sign In Now
                      </Link>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="text-gray-400 text-center mb-4 sm:mb-6 text-sm sm:text-base">
                      Please check your email for the verification link we sent you.
                    </p>
                    <Link 
                      href="/auth/signin"
                      className="block w-full py-2.5 sm:py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg sm:rounded-xl transition-all text-center text-sm sm:text-base"
                    >
                      Go to Sign In
                    </Link>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>

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
      `}</style>
    </div>
  );
}
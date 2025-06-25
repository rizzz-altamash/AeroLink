// app/auth/signin/page.jsx
'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#10b98115_1px,transparent_1px),linear-gradient(to_bottom,#10b98115_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-950/50 via-gray-950 to-emerald-950/50"></div>
        
        {/* Animated Drone Paths */}
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <path id="dronePath1" d="M0,200 Q400,100 800,200 T1600,200" />
            <path id="dronePath2" d="M0,400 Q400,300 800,400 T1600,400" />
          </defs>
          
          {/* Animated Drones */}
          <g className="opacity-20">
            <circle r="3" fill="#10b981">
              <animateMotion dur="20s" repeatCount="indefinite">
                <mpath href="#dronePath1" />
              </animateMotion>
            </circle>
            <circle r="3" fill="#34d399">
              <animateMotion dur="25s" repeatCount="indefinite">
                <mpath href="#dronePath2" />
              </animateMotion>
            </circle>
          </g>
          
          {/* Drone Flight Lines */}
          <path d="M0,200 Q400,100 800,200 T1600,200" stroke="#10b981" strokeWidth="1" fill="none" opacity="0.1" strokeDasharray="5,5">
            <animate attributeName="stroke-dashoffset" from="0" to="10" dur="1s" repeatCount="indefinite" />
          </path>
          <path d="M0,400 Q400,300 800,400 T1600,400" stroke="#34d399" strokeWidth="1" fill="none" opacity="0.1" strokeDasharray="5,5">
            <animate attributeName="stroke-dashoffset" from="0" to="10" dur="1.5s" repeatCount="indefinite" />
          </path>
        </svg>

        {/* Floating Drone Icons */}
        <div className="absolute top-20 left-20 animate-float hidden md:block">
          <svg className="w-24 h-24 text-green-500/10" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
            <path d="M8 12l2-2 2 2 2-2 2 2-4 4z"/>
          </svg>
        </div>
        <div className="absolute bottom-32 right-20 animate-float-delayed">
          <svg className="w-32 h-32 text-emerald-500/10" viewBox="0 0 24 24" fill="currentColor">
            <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
          </svg>
        </div>

        {/* Radar Effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="w-96 h-96 rounded-full border border-green-500/10 animate-radar"></div>
          <div className="w-96 h-96 rounded-full border border-green-500/10 animate-radar animation-delay-1000"></div>
          <div className="w-96 h-96 rounded-full border border-green-500/10 animate-radar animation-delay-2000"></div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full">
          {/* Logo/Brand */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl mb-4 shadow-2xl shadow-green-500/25 relative">
              <svg className="w-15 h-15 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
              </svg>
              {/* Rotating Ring */}
              <div className="absolute inset-0 rounded-2xl border-2 border-green-400/20 animate-spin-slow"></div>
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">Welcome Back</h1>
            <p className="text-green-400/80">Sign In</p> {/* Access your drone delivery dashboard */}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-gray-900/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-green-500/10">
            {error && (
              <div className="mb-6 p-4 bg-red-500/10 backdrop-blur border border-red-500/20 rounded-xl text-red-400 flex items-center gap-2">
                <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            )}

            <div className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-green-400 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 pl-12 bg-gray-800/50 backdrop-blur border border-green-500/20 rounded-xl text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    placeholder="pilot@dronestartup.com"
                  />
                  <svg className="w-5 h-5 text-green-500/50 absolute left-4 top-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-green-400 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-4 py-3 pl-12 bg-gray-800/50 backdrop-blur border border-green-500/20 rounded-xl text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    placeholder="••••••••"
                  />
                  <svg className="w-5 h-5 text-green-500/50 absolute left-4 top-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input type="checkbox" className="w-4 h-4 bg-gray-800 border-green-500/20 rounded focus:ring-green-500 focus:ring-offset-0 text-green-600" />
                  <span className="ml-2 text-sm text-gray-300">Remember me</span>
                </label>
                <Link href="/auth/forgot-password" className="text-sm text-green-400 hover:text-green-300 transition-colors">
                  Forgot password?
                </Link>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-green-500/25 relative overflow-hidden group"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Authenticating...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Launch Dashboard
                  </>
                )}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-green-600/20 to-emerald-600/20 translate-y-full group-hover:translate-y-0 transition-transform"></div>
            </button>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-green-500/10"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-gray-900/80 text-green-400/60">Or continue with</span>
              </div>
            </div>

            {/* Social Sign In */}
            <button
              type="button"
              onClick={() => signIn('google', { callbackUrl })}
              className="w-full py-4 bg-gray-800/50 backdrop-blur hover:bg-gray-700/50 text-white font-medium rounded-xl transition-all flex items-center justify-center gap-3 border border-green-500/10 hover:border-green-500/20"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>

            {/* Sign Up Link */}
            <p className="text-center text-gray-400 mt-6">
              Don't have an account?{' '}
              <Link href="/auth/signup" className="text-green-400 hover:text-green-300 font-medium transition-colors">
                Create Account
              </Link>
            </p>
          </form>
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
        @keyframes radar {
          0% { transform: scale(0.5); opacity: 0.5; }
          100% { transform: scale(2); opacity: 0; }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-delayed { animation: float-delayed 8s ease-in-out infinite; }
        .animate-radar { animation: radar 3s ease-out infinite; }
        .animate-spin-slow { animation: spin-slow 20s linear infinite; }
        .animation-delay-1000 { animation-delay: 1s; }
        .animation-delay-2000 { animation-delay: 2s; }
      `}</style>
    </div>
  );
}
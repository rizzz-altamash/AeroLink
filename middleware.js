// // middleware.js
// import { withAuth } from 'next-auth/middleware';
// import { NextResponse } from 'next/server';

// export default withAuth(
//   function middleware(req) {
//     const token = req.nextauth.token;
//     const path = req.nextUrl.pathname;

//     // Check if accessing admin routes
//     if (path.startsWith('/admin') && token?.role !== 'admin') {
//       return NextResponse.redirect(new URL('/unauthorized', req.url));
//     }

//     // Check if accessing hospital routes
//     if (path.startsWith('/hospital') && !['hospital_admin', 'medical_staff'].includes(token?.role)) {
//       return NextResponse.redirect(new URL('/unauthorized', req.url));
//     }

//     // Check if accessing pilot routes
//     if (path.startsWith('/pilot') && token?.role !== 'pilot') {
//       return NextResponse.redirect(new URL('/unauthorized', req.url));
//     }

//     return NextResponse.next();
//   },
//   {
//     callbacks: {
//       authorized: ({ token }) => !!token,
//     },
//   }
// );

// export const config = {
//   matcher: [
//     '/dashboard/:path*',
//     '/admin/:path*',
//     '/hospital/:path*',
//     '/pilot/:path*',
//     '/api/protected/:path*'
//   ]
// }
















// middleware.js
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Admin-only routes
    if (path.startsWith('/dashboard/admin') || 
        path.startsWith('/dashboard/users') || 
        path.startsWith('/dashboard/system')) {
      if (token?.role !== 'admin') {
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }
    }

    // Hospital admin routes
    if (path.startsWith('/dashboard/staff') || 
        path.startsWith('/dashboard/billing') ||
        path.startsWith('/dashboard/hospital-settings')) {
      if (token?.role !== 'hospital_admin') {
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }
    }

    // Hospital staff routes (both admin and medical staff)
    if (path.startsWith('/dashboard/inventory') ||
        path.startsWith('/dashboard/emergency')) {
      if (!['hospital_admin', 'medical_staff'].includes(token?.role)) {
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }
    }

    // Pilot-only routes
    if (path.startsWith('/dashboard/drone-status') ||
        path.startsWith('/dashboard/flight') ||
        path.startsWith('/dashboard/assignments')) {
      if (token?.role !== 'pilot') {
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }
    }

    // Customer routes (accessible by all authenticated users)
    // No additional checks needed

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

// Specify which routes should be protected
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/api/admin/:path*',
    '/api/hospital/:path*',
    '/api/pilot/:path*',
    '/api/deliveries/:path*'
  ]
}
// // app/api/auth/verify-email/route.js
// import { NextResponse } from 'next/server';
// import { connectDB } from '@/lib/mongodb';
// import User from '@/models/User';

// export async function POST(request) {
//   try {
//     const { token } = await request.json();

//     if (!token) {
//       return NextResponse.json(
//         { error: 'Verification token is required' },
//         { status: 400 }
//       );
//     }

//     await connectDB();

//     const user = await User.findOne({
//       emailVerificationToken: token,
//       emailVerificationExpires: { $gt: Date.now() }
//     });

//     if (!user) {
//       return NextResponse.json(
//         { error: 'Invalid or expired verification token' },
//         { status: 400 }
//       );
//     }

//     // Update user
//     user.emailVerified = true;
//     user.emailVerificationToken = undefined;
//     user.emailVerificationExpires = undefined;
//     await user.save();

//     return NextResponse.json(
//       { message: 'Email verified successfully' },
//       { status: 200 }
//     );

//   } catch (error) {
//     console.error('Email verification error:', error);
//     return NextResponse.json(
//       { error: 'Failed to verify email' },
//       { status: 500 }
//     );
//   }
// }




















// app/api/auth/verify-email/route.js
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import crypto from 'crypto';

export async function POST(request) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { error: 'Verification token is required' },
        { status: 400 }
      );
    }

    await connectDB();

    // Hash the token to match what's stored in the database
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      emailVerificationToken: hashedToken,
      emailVerificationExpires: { $gt: Date.now() }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid or expired verification token' },
        { status: 400 }
      );
    }

    // Update user
    user.emailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    return NextResponse.json(
      { message: 'Email verified successfully' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Email verification error:', error);
    return NextResponse.json(
      { error: 'Failed to verify email' },
      { status: 500 }
    );
  }
}
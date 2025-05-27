// // app/api/auth/register/route.js
// import { NextResponse } from 'next/server';
// import bcrypt from 'bcryptjs';
// import crypto from 'crypto';
// import { connectDB } from '@/lib/mongodb';
// import User from '@/models/User';
// import Hospital from '@/models/Hospital';
// import { sendVerificationEmail } from '@/lib/email';

// export async function POST(request) {
//   try {
//     const { email, password, name, userType, phoneNumber, hospitalData } = await request.json();

//     // Validate input
//     if (!email || !password || !name || !userType || !phoneNumber) {
//       return NextResponse.json(
//         { error: 'Missing required fields' },
//         { status: 400 }
//       );
//     }

//     // Validate password strength
//     if (password.length < 8) {
//       return NextResponse.json(
//         { error: 'Password must be at least 8 characters long' },
//         { status: 400 }
//       );
//     }

//     await connectDB();

//     // Check if user already exists
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return NextResponse.json(
//         { error: 'User already exists with this email' },
//         { status: 400 }
//       );
//     }

//     // Hash password
//     const hashedPassword = await bcrypt.hash(password, 12);

//     // Generate email verification token
//     const verificationToken = crypto.randomBytes(32).toString('hex');
//     const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

//     let hospitalId = null;

//     // If registering as hospital user, create or link hospital
//     if (userType === 'hospital' && hospitalData) {
//       // Check if hospital exists
//       let hospital = await Hospital.findOne({ 
//         registrationNumber: hospitalData.registrationNumber 
//       });

//       if (!hospital) {
//         // Create new hospital
//         hospital = await Hospital.create({
//           name: hospitalData.name,
//           registrationNumber: hospitalData.registrationNumber,
//           type: hospitalData.type,
//           address: hospitalData.address,
//           contactInfo: {
//             primaryPhone: hospitalData.contactPhone,
//             email: hospitalData.contactEmail,
//             website: hospitalData.website
//           },
//           verificationStatus: 'pending'
//         });
//       }

//       hospitalId = hospital._id;
//     }

//     // Create user
//     const newUser = await User.create({
//       email,
//       password: hashedPassword,
//       name,
//       userType,
//       phoneNumber,
//       hospitalId,
//       role: userType === 'hospital' ? 'hospital_admin' : 'customer',
//       emailVerificationToken: verificationToken,
//       emailVerificationExpires: verificationExpires,
//       metadata: {
//         registrationIP: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip')
//       }
//     });

//     // Send verification email
//     await sendVerificationEmail(email, verificationToken);

//     return NextResponse.json(
//       { 
//         message: 'Registration successful. Please check your email for verification.',
//         userId: newUser._id 
//       },
//       { status: 201 }
//     );

//   } catch (error) {
//     console.error('Registration error:', error);
//     return NextResponse.json(
//       { error: error.message || 'Failed to register user' },
//       { status: 500 }
//     );
//   }
// }














// app/api/auth/register/route.js
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import Hospital from '@/models/Hospital';
import crypto from 'crypto';
import { sendVerificationEmail } from '@/lib/email'; // You'll need to implement this

export async function POST(req) {
  try {
    await connectDB();
    
    const body = await req.json();
    const { 
      email, 
      password, 
      name, 
      phoneNumber, 
      userType,
      hospitalData,
      pilotData
    } = body;

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists with this email' },
        { status: 400 }
      );
    }

    // Determine role based on userType and other factors
    let role = 'customer'; // default
    let hospitalId = null;
    let additionalData = {};

    if (userType === 'hospital') {
      // Create or find hospital
      let hospital;
      
      if (hospitalData.registrationNumber) {
        // Check if hospital already exists
        hospital = await Hospital.findOne({ 
          registrationNumber: hospitalData.registrationNumber 
        });
        
        if (hospital) {
          // Hospital exists, check if this is the first user
          const existingHospitalUsers = await User.countDocuments({ 
            hospitalId: hospital._id 
          });
          
          // First user becomes admin, others are medical staff
          role = existingHospitalUsers === 0 ? 'hospital_admin' : 'medical_staff';
          hospitalId = hospital._id;
        } else {
          // Create new hospital
          hospital = new Hospital({
            name: hospitalData.name,
            registrationNumber: hospitalData.registrationNumber,
            type: hospitalData.type,
            address: hospitalData.address,
            contactInfo: {
              primaryPhone: hospitalData.contactPhone,
              email: hospitalData.contactEmail || email,
              website: hospitalData.website
            },
            verificationStatus: 'pending'
          });
          
          await hospital.save();
          role = 'hospital_admin'; // First user is admin
          hospitalId = hospital._id;
        }
      }
    } else if (userType === 'pilot') {
      role = 'pilot';
      
      // Store pilot-specific data
      additionalData = {
        pilotLicense: pilotData?.licenseNumber,
        droneExperience: pilotData?.experience,
        certifications: pilotData?.certifications || [],
        // Pilots need verification before they can fly
        isActive: false,
        verificationStatus: 'pending'
      };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Generate email verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(verificationToken).digest('hex');

    // Create user
    const user = new User({
      email: email.toLowerCase(),
      password: hashedPassword,
      name,
      phoneNumber,
      role,
      userType: userType === 'hospital' ? 'hospital' : 'individual',
      hospitalId,
      emailVerificationToken: hashedToken,
      emailVerificationExpires: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
      metadata: {
        registrationIP: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip'),
        ...additionalData
      }
    });

    await user.save();

    // Send verification email
    try {
      await sendVerificationEmail(email, verificationToken);
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
      // Don't fail registration if email fails
    }

    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Registration successful. Please check your email to verify your account.',
      userId: user._id,
      role: user.role,
      requiresVerification: role === 'pilot' || userType === 'hospital'
    });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Registration failed. Please try again.' },
      { status: 500 }
    );
  }
}
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
      pilotData,
      address // For pilots
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
    let userAddress = null;

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
      
      // Store pilot address
      if (address) {
        userAddress = {
          street: address.street,
          city: address.city,
          state: address.state,
          zipCode: address.zipCode,
          country: address.country,
          coordinates: address.coordinates || {
            type: 'Point',
            coordinates: [0, 0]
          }
        };
      }
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
      address: userAddress, // Add address for pilots
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
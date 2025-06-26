// app/api/payments/setup/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import Razorpay from 'razorpay';
import { connectDB } from '@/lib/mongodb';
import Hospital from '@/models/Hospital';
import User from '@/models/User';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'hospital_admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    // IMPORTANT: session.user.hospitalId is just an ID, not the hospital object
    // You need to fetch the hospital using this ID
    const hospital = await Hospital.findById(session.user.hospitalId);
    
    if (!hospital) {
      return NextResponse.json({ error: 'Hospital not found' }, { status: 404 });
    }
    
    let customerId = hospital.payment?.razorpayCustomerId;
    
    if (!customerId) {
      // Add safety checks for contactInfo
      const customer = await razorpay.customers.create({
        name: hospital.name,
        email: hospital.contactInfo?.email || session.user.email || 'noemail@hospital.com',
        contact: hospital.contactInfo?.primaryPhone || '+919999999999',
        notes: {
          hospitalId: hospital._id.toString()
        }
      });
      customerId = customer.id;
      
      // Save the customer ID to hospital
      await Hospital.findByIdAndUpdate(hospital._id, {
        'payment.razorpayCustomerId': customerId
      });
    }

    // Create verification order
    const order = await razorpay.orders.create({
      amount: 100, // ₹1 for verification
      currency: 'INR',
      receipt: `verify_${Date.now()}`,
      notes: {
        hospitalId: hospital._id.toString(),
        purpose: 'payment_method_verification'
      }
    });

    return NextResponse.json({
      success: true,
      customerId,
      orderId: order.id,
      email: hospital.contactInfo?.email || session.user.email,
      phone: hospital.contactInfo?.primaryPhone || '+919999999999',
      hospitalId: hospital._id,
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID // ← Add this for frontend
    });
  } catch (error) {
    console.error('Payment setup error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to setup payment',
        details: error.message // ← Add error details for debugging
      },
      { status: 500 }
    );
  }
}












// // app/api/payments/setup/route.js
// import { NextResponse } from 'next/server';
// import { getServerSession } from 'next-auth';
// import { authOptions } from '@/app/api/auth/[...nextauth]/route';
// import Razorpay from 'razorpay';
// import { connectDB } from '@/lib/mongodb';
// import Hospital from '@/models/Hospital';
// import User from '@/models/User';

// export async function POST(req) {
//   console.log('=== Payment Setup Started ===');
  
//   try {
//     // Step 1: Check session
//     console.log('Step 1: Checking session...');
//     const session = await getServerSession(authOptions);
    
//     if (!session) {
//       console.error('No session found');
//       return NextResponse.json({ error: 'Unauthorized - No session' }, { status: 401 });
//     }
    
//     console.log('Session found:', {
//       userId: session.user.id,
//       role: session.user.role,
//       hospitalId: session.user.hospitalId
//     });
    
//     if (session.user.role !== 'hospital_admin') {
//       console.error('User is not hospital admin:', session.user.role);
//       return NextResponse.json({ error: 'Unauthorized - Not hospital admin' }, { status: 403 });
//     }

//     // Step 2: Connect to database
//     console.log('Step 2: Connecting to database...');
//     await connectDB();
//     console.log('Database connected');

//     // Step 3: Check if hospital ID exists in session
//     if (!session.user.hospitalId) {
//       console.error('No hospitalId in session. User might not be properly associated with a hospital.');
      
//       // Try to find hospital from user record
//       const user = await User.findById(session.user.id);
//       if (!user || !user.hospitalId) {
//         return NextResponse.json({ 
//           error: 'No hospital associated with this account',
//           details: 'Please contact support to link your account to a hospital'
//         }, { status: 400 });
//       }
      
//       // Update session hospitalId for future use
//       session.user.hospitalId = user.hospitalId.toString();
//     }

//     // Step 4: Get hospital
//     console.log('Step 3: Fetching hospital with ID:', session.user.hospitalId);
//     const hospital = await Hospital.findById(session.user.hospitalId);
    
//     if (!hospital) {
//       console.error('Hospital not found for ID:', session.user.hospitalId);
//       return NextResponse.json({ 
//         error: 'Hospital not found',
//         details: 'The hospital associated with your account does not exist'
//       }, { status: 404 });
//     }
    
//     console.log('Hospital found:', {
//       id: hospital._id.toString(),
//       name: hospital.name,
//       hasContactInfo: !!hospital.contactInfo,
//       email: hospital.contactInfo?.email,
//       phone: hospital.contactInfo?.primaryPhone
//     });

//     // Step 5: Check if payment is already setup
//     if (hospital.payment?.isSetup) {
//       console.log('Payment already setup for this hospital');
//       return NextResponse.json({
//         success: true,
//         alreadySetup: true,
//         message: 'Payment method is already configured',
//         redirectUrl: '/dashboard'
//       });
//     }

//     // Step 6: Initialize Razorpay
//     console.log('Step 4: Initializing Razorpay...');
    
//     if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
//       console.error('Razorpay credentials missing:', {
//         hasKeyId: !!process.env.RAZORPAY_KEY_ID,
//         hasKeySecret: !!process.env.RAZORPAY_KEY_SECRET
//       });
//       return NextResponse.json({ 
//         error: 'Razorpay configuration missing',
//         details: 'Server configuration error - Please contact support'
//       }, { status: 500 });
//     }
    
//     const razorpay = new Razorpay({
//       key_id: process.env.RAZORPAY_KEY_ID,
//       key_secret: process.env.RAZORPAY_KEY_SECRET
//     });
//     console.log('Razorpay initialized successfully');

//     // Step 7: Create or get customer
//     console.log('Step 5: Managing Razorpay customer...');
//     let customerId = hospital.payment?.razorpayCustomerId;
    
//     if (!customerId) {
//       console.log('Creating new Razorpay customer...');
      
//       // Prepare customer data with fallbacks
//       const customerData = {
//         name: hospital.name || 'Hospital',
//         email: hospital.contactInfo?.email || session.user.email || `hospital${Date.now()}@example.com`,
//         contact: hospital.contactInfo?.primaryPhone || '+919999999999',
//         notes: {
//           hospitalId: hospital._id.toString(),
//           createdAt: new Date().toISOString()
//         }
//       };
      
//       console.log('Customer data prepared:', {
//         name: customerData.name,
//         email: customerData.email,
//         contact: customerData.contact
//       });
      
//       try {
//         const customer = await razorpay.customers.create(customerData);
//         customerId = customer.id;
//         console.log('Customer created successfully:', customerId);
        
//         // Save customer ID to hospital
//         await Hospital.findByIdAndUpdate(hospital._id, {
//           'payment.razorpayCustomerId': customerId
//         });
//         console.log('Customer ID saved to hospital record');
//       } catch (razorpayError) {
//         console.error('Razorpay customer creation error:', {
//           message: razorpayError.message,
//           statusCode: razorpayError.statusCode,
//           error: razorpayError.error
//         });
        
//         // If customer creation fails, continue without it
//         console.log('Continuing without customer ID due to error');
//         customerId = null;
//       }
//     } else {
//       console.log('Using existing customer:', customerId);
//     }

//     // Step 8: Create order
//     console.log('Step 6: Creating Razorpay order...');
    
//     try {
//       const orderData = {
//         amount: 100, // ₹1 in paise
//         currency: 'INR',
//         receipt: `verify_${Date.now()}`,
//         notes: {
//           hospitalId: hospital._id.toString(),
//           hospitalName: hospital.name,
//           purpose: 'payment_method_verification'
//         }
//       };
      
//       // Only add customer_id if we have one
//       if (customerId) {
//         orderData.customer_id = customerId;
//       }
      
//       console.log('Creating order with data:', {
//         amount: orderData.amount,
//         currency: orderData.currency,
//         hasCustomerId: !!orderData.customer_id
//       });
      
//       const order = await razorpay.orders.create(orderData);
//       console.log('Order created successfully:', {
//         id: order.id,
//         amount: order.amount,
//         currency: order.currency
//       });

//       // Step 9: Prepare response
//       const response = {
//         success: true,
//         customerId: customerId || null,
//         orderId: order.id,
//         email: hospital.contactInfo?.email || session.user.email || `hospital${Date.now()}@example.com`,
//         phone: hospital.contactInfo?.primaryPhone || '+919999999999',
//         hospitalId: hospital._id.toString(),
//         hospitalName: hospital.name,
//         key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID
//       };
      
//       console.log('=== Payment Setup Completed Successfully ===');
      
//       return NextResponse.json(response);
      
//     } catch (orderError) {
//       console.error('Razorpay order creation error:', {
//         message: orderError.message,
//         statusCode: orderError.statusCode,
//         error: orderError.error
//       });
      
//       return NextResponse.json({ 
//         error: 'Failed to create payment order',
//         details: orderError.message || 'Razorpay order creation failed',
//         razorpayError: orderError.error
//       }, { status: 500 });
//     }
    
//   } catch (error) {
//     console.error('=== Payment Setup Failed ===');
//     console.error('Unexpected error:', {
//       name: error.name,
//       message: error.message,
//       stack: error.stack
//     });
    
//     return NextResponse.json(
//       { 
//         error: 'Failed to setup payment',
//         details: error.message || 'An unexpected error occurred',
//         type: error.constructor.name
//       },
//       { status: 500 }
//     );
//   }
// }

// // Test endpoint
// export async function GET() {
//   try {
//     // Test Razorpay connection
//     const razorpay = new Razorpay({
//       key_id: process.env.RAZORPAY_KEY_ID,
//       key_secret: process.env.RAZORPAY_KEY_SECRET
//     });
    
//     // Try to create a test order
//     let testOrderSuccess = false;
//     try {
//       const testOrder = await razorpay.orders.create({
//         amount: 100,
//         currency: 'INR',
//         receipt: 'test_' + Date.now()
//       });
//       testOrderSuccess = !!testOrder.id;
//     } catch (e) {
//       console.error('Test order failed:', e.message);
//     }
    
//     return NextResponse.json({
//       status: 'Payment setup endpoint is active',
//       method: 'Use POST to setup payment',
//       razorpay: {
//         configured: !!process.env.RAZORPAY_KEY_ID && !!process.env.RAZORPAY_KEY_SECRET,
//         publicKey: !!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
//         testOrderSuccess
//       },
//       environment: {
//         nodeEnv: process.env.NODE_ENV,
//         hasKeys: {
//           keyId: !!process.env.RAZORPAY_KEY_ID,
//           keySecret: !!process.env.RAZORPAY_KEY_SECRET,
//           publicKey: !!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID
//         }
//       }
//     });
//   } catch (error) {
//     return NextResponse.json({
//       status: 'Error',
//       error: error.message
//     });
//   }
// }
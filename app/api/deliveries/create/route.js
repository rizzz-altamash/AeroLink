// // app/api/deliveries/create/route.js
// import { NextResponse } from 'next/server';
// import { getServerSession } from 'next-auth';
// import { authOptions } from '@/app/api/auth/[...nextauth]/route';
// import { connectDB } from '@/lib/mongodb';
// import Delivery from '@/models/Delivery';
// import User from '@/models/User';
// import Hospital from '@/models/Hospital';
// import Drone from '@/models/Drone';
// import { checkRole } from '@/lib/auth-helpers';

// export async function POST(req) {

//   // Check role authorization
//   const { authorized, response, session } = await checkRole(req, ['medical_staff']);
//   if (!authorized) return response;
  
  
//   try {
//     const session = await getServerSession(authOptions);
//     if (!session || session.user.role !== 'medical_staff') {
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//     }

//     const data = await req.json();
//     await connectDB();

//     // Get sender details
//     const sender = await User.findById(session.user.id);
//     if (!sender) {
//       return NextResponse.json({ error: 'Sender not found' }, { status: 404 });
//     }



//     let deliveryData;

//     if (data.deliveryType === 'incoming') {
//       // For incoming deliveries (hospital ordering supplies)
//       const hospital = await Hospital.findById(session.user.hospitalId);
      
//       deliveryData = {
//         // For incoming orders, sender is warehouse/supplier (to be assigned by admin)
//         sender: {
//           userId: null, // Will be assigned by admin
//           hospitalId: null, // Warehouse/supplier ID
//           location: {
//             type: 'Point',
//             coordinates: [0, 0] // Will be updated when admin assigns
//           }
//         },
        
//         // Recipient is the ordering hospital
//         recipient: {
//           userId: sender._id,
//           hospitalId: hospital._id,
//           name: hospital.name,
//           phone: hospital.contactInfo.primaryPhone,
//           location: {
//             type: 'Point',
//             coordinates: hospital.address.coordinates.coordinates
//           }
//         },
        
//         // Package details
//         package: {
//           type: data.packageType,
//           description: data.packageDescription,
//           weight: data.packageWeight,
//           dimensions: data.packageDimensions,
//           temperatureControlled: data.temperatureControlled || false,
//           temperatureRange: data.temperatureRange,
//           fragile: data.fragile || false,
//           urgency: data.urgency || 'routine'
//         },
        
//         // Mark as incoming order
//         metadata: {
//           deliveryType: 'incoming',
//           orderedBy: sender._id,
//           orderingHospital: hospital._id,
//           specialInstructions: data.specialInstructions
//         },
        
//         status: 'pending',
//         timeline: [{
//           status: 'pending',
//           timestamp: new Date(),
//           notes: `Order placed by ${sender.name} from ${hospital.name}`
//         }],
        
//         delivery: {
//           scheduledTime: data.scheduledTime || new Date(Date.now() + 2 * 60 * 60 * 1000)
//         }
//       };
//     } else {
//       // For outgoing deliveries (existing logic)
//       // ... existing outgoing delivery logic

//       deliveryData = {
//       sender: {
//         userId: sender._id,
//         hospitalId: sender.hospitalId,
//         location: {
//           type: 'Point',
//           coordinates: data.senderCoordinates || [0, 0]
//         }
//       },
//       recipient: {
//         userId: data.recipientUserId,
//         hospitalId: data.recipientHospitalId,
//         name: data.recipientName,
//         phone: data.recipientPhone,
//         location: {
//           type: 'Point',
//           coordinates: data.recipientCoordinates || [0, 0]
//         }
//       },
//       package: {
//         type: data.packageType,
//         description: data.packageDescription,
//         weight: data.packageWeight,
//         dimensions: data.packageDimensions,
//         temperatureControlled: data.temperatureControlled || false,
//         temperatureRange: data.temperatureRange,
//         fragile: data.fragile || false,
//         urgency: data.urgency || 'routine'
//       },
//       status: 'pending',
//       timeline: [{
//         status: 'pending',
//         timestamp: new Date(),
//         notes: 'Delivery request created'
//       }],
//       delivery: {
//         scheduledTime: data.scheduledTime || new Date(Date.now() + 2 * 60 * 60 * 1000) // Default 2 hours
//       }
//     };
//     }

    

//     // Calculate estimated distance and price
//     if (data.senderCoordinates && data.recipientCoordinates) {
//       const distance = calculateDistance(
//         data.senderCoordinates,
//         data.recipientCoordinates
//       );
//       deliveryData.flightPath = {
//         estimatedDistance: distance,
//         estimatedDuration: Math.ceil(distance / 500) // Assume 500m/min
//       };
//     }

//     const delivery = new Delivery(deliveryData);
    
//     // Calculate price (will be updated when admin assigns source)
//     delivery.calculatePrice();

//     await delivery.save();

//     // Auto-assign drone for emergency deliveries
//     if (data.urgency === 'emergency') {
//       const availableDrone = await Drone.findOne({
//         status: 'available',
//         'specifications.maxPayload': { $gte: data.packageWeight }
//       }).sort({ 'health.batteryLevel': -1 });

//       if (availableDrone) {
//         delivery.droneId = availableDrone._id;
//         delivery.status = 'assigned';
//         await delivery.save();
        
//         await availableDrone.startDelivery(delivery._id);
//       }
//     }

//     return NextResponse.json({ success: true, delivery });
//   } catch (error) {
//     console.error('Error creating delivery:', error);
//     return NextResponse.json(
//       { error: 'Failed to create delivery' },
//       { status: 500 }
//     );
//   }
// }

// // Helper function to calculate distance between coordinates
// function calculateDistance(coord1, coord2) {
//   const R = 6371e3; // Earth radius in meters
//   const φ1 = coord1[1] * Math.PI/180;
//   const φ2 = coord2[1] * Math.PI/180;
//   const Δφ = (coord2[1] - coord1[1]) * Math.PI/180;
//   const Δλ = (coord2[0] - coord1[0]) * Math.PI/180;

//   const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
//             Math.cos(φ1) * Math.cos(φ2) *
//             Math.sin(Δλ/2) * Math.sin(Δλ/2);
//   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

//   return Math.round(R * c); // Distance in meters
// }































// app/api/deliveries/create/route.js
// import { NextResponse } from 'next/server';
// import { getServerSession } from 'next-auth';
// import { authOptions } from '@/app/api/auth/[...nextauth]/route';
// import { connectDB } from '@/lib/mongodb';
// import Delivery from '@/models/Delivery';
// import User from '@/models/User';
// import Hospital from '@/models/Hospital';
// import Drone from '@/models/Drone';
// import { checkRole } from '@/lib/auth-helpers';

// export async function POST(req) {
//   try {
//     const session = await getServerSession(authOptions);
//     if (!session || session.user.role !== 'medical_staff') {
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//     }

//     const data = await req.json();
//     await connectDB();

//     // Get sender details
//     const sender = await User.findById(session.user.id);
//     if (!sender) {
//       return NextResponse.json({ error: 'Sender not found' }, { status: 404 });
//     }

//     // Generate orderId here instead of relying on pre-save hook
//     const generateOrderId = () => {
//       const date = new Date();
//       const year = date.getFullYear().toString().substr(-2);
//       const month = (date.getMonth() + 1).toString().padStart(2, '0');
//       const random = Math.random().toString(36).substr(2, 6).toUpperCase();
//       return `DRN${year}${month}${random}`;
//     };

//     let deliveryData;

//     if (data.deliveryType === 'incoming') {
//       // For incoming deliveries (hospital ordering supplies)
//       const hospital = await Hospital.findById(session.user.hospitalId);
//       if (!hospital) {
//         return NextResponse.json({ error: 'Hospital not found' }, { status: 404 });
//       }
      
//       // Create a system user ID for warehouse/supplier if it doesn't exist
//       let warehouseUser = await User.findOne({ email: 'warehouse@system.local' });
//       if (!warehouseUser) {
//         warehouseUser = await User.create({
//           email: 'warehouse@system.local',
//           password: 'system-generated-' + Math.random().toString(36),
//           name: 'Central Warehouse',
//           role: 'admin',
//           userType: 'business',
//           phoneNumber: '+1234567890',
//           isActive: true
//         });
//       }
      
//       deliveryData = {
//         orderId: generateOrderId(),
        
//         // For incoming orders, sender is warehouse/supplier
//         sender: {
//           userId: warehouseUser._id, // Use system warehouse user
//           hospitalId: null,
//           location: {
//             type: 'Point',
//             coordinates: [0, 0] // Will be updated when admin assigns actual location
//           }
//         },
        
//         // Recipient is the ordering hospital
//         recipient: {
//           userId: sender._id,
//           hospitalId: hospital._id,
//           name: hospital.name,
//           phone: hospital.contactInfo.primaryPhone,
//           location: {
//             type: 'Point',
//             coordinates: hospital.address.coordinates.coordinates
//           }
//         },
        
//         // Package details
//         package: {
//           type: data.packageType,
//           description: data.packageDescription,
//           weight: parseInt(data.packageWeight),
//           dimensions: data.packageDimensions || {},
//           temperatureControlled: data.temperatureControlled || false,
//           temperatureRange: data.temperatureControlled ? data.temperatureRange : undefined,
//           fragile: data.fragile || false,
//           urgency: data.urgency || 'routine'
//         },
        
//         // Initial pricing (will be updated when admin assigns actual source)
//         pricing: {
//           basePrice: 10,
//           urgencyCharge: 0,
//           distanceCharge: 0,
//           totalPrice: 10,
//           currency: 'USD'
//         },
        
//         // Flight path placeholder
//         flightPath: {
//           estimatedDistance: 0,
//           estimatedDuration: 0,
//           waypoints: []
//         },
        
//         // Mark as incoming order
//         metadata: {
//           deliveryType: 'incoming',
//           orderedBy: sender._id,
//           orderingHospital: hospital._id,
//           specialInstructions: data.specialInstructions || ''
//         },
        
//         status: 'pending',
//         timeline: [{
//           status: 'pending',
//           timestamp: new Date(),
//           notes: `Order placed by ${sender.name} from ${hospital.name}`
//         }],
        
//         delivery: {
//           scheduledTime: data.scheduledTime ? new Date(data.scheduledTime) : new Date(Date.now() + 2 * 60 * 60 * 1000)
//         }
//       };
//     } else {
//       // For outgoing deliveries
//       const senderHospital = await Hospital.findById(sender.hospitalId);
      
//       deliveryData = {
//         orderId: generateOrderId(),
        
//         sender: {
//           userId: sender._id,
//           hospitalId: sender.hospitalId,
//           location: {
//             type: 'Point',
//             coordinates: senderHospital?.address?.coordinates?.coordinates || [0, 0]
//           }
//         },
        
//         recipient: {
//           userId: data.recipientUserId || null,
//           hospitalId: data.recipientHospitalId || null,
//           name: data.recipientName,
//           phone: data.recipientPhone,
//           location: {
//             type: 'Point',
//             coordinates: data.recipientCoordinates || [0, 0]
//           }
//         },
        
//         package: {
//           type: data.packageType,
//           description: data.packageDescription,
//           weight: parseInt(data.packageWeight),
//           dimensions: data.packageDimensions || {},
//           temperatureControlled: data.temperatureControlled || false,
//           temperatureRange: data.temperatureControlled ? data.temperatureRange : undefined,
//           fragile: data.fragile || false,
//           urgency: data.urgency || 'routine'
//         },
        
//         // Initial pricing
//         pricing: {
//           basePrice: 10,
//           urgencyCharge: 0,
//           distanceCharge: 0,
//           totalPrice: 10,
//           currency: 'USD'
//         },
        
//         flightPath: {
//           estimatedDistance: 0,
//           estimatedDuration: 0,
//           waypoints: []
//         },
        
//         metadata: {
//           deliveryType: 'outgoing',
//           specialInstructions: data.specialInstructions || ''
//         },
        
//         status: 'pending',
//         timeline: [{
//           status: 'pending',
//           timestamp: new Date(),
//           notes: 'Delivery request created'
//         }],
        
//         delivery: {
//           scheduledTime: data.scheduledTime ? new Date(data.scheduledTime) : new Date(Date.now() + 2 * 60 * 60 * 1000)
//         }
//       };
//     }

//     // Calculate distance and update pricing only if we have valid coordinates
//     if (deliveryData.sender.location.coordinates[0] !== 0 && 
//         deliveryData.recipient.location.coordinates[0] !== 0) {
//       try {
//         const distance = calculateDistance(
//           deliveryData.sender.location.coordinates,
//           deliveryData.recipient.location.coordinates
//         );
        
//         deliveryData.flightPath.estimatedDistance = distance;
//         deliveryData.flightPath.estimatedDuration = Math.ceil(distance / 500); // 500m/min
        
//         // Calculate pricing with urgency multiplier
//         const urgencyMultiplier = {
//           routine: 1,
//           urgent: 1.5,
//           emergency: 2
//         };
        
//         const basePrice = 10;
//         const distanceRate = 0.002; // $0.002 per meter
        
//         deliveryData.pricing.basePrice = basePrice;
//         deliveryData.pricing.urgencyCharge = basePrice * (urgencyMultiplier[data.urgency] - 1);
//         deliveryData.pricing.distanceCharge = Math.round(distance * distanceRate * 100) / 100;
//         deliveryData.pricing.totalPrice = deliveryData.pricing.basePrice + 
//                                         deliveryData.pricing.urgencyCharge + 
//                                         deliveryData.pricing.distanceCharge;
//       } catch (error) {
//         console.log('Distance calculation skipped:', error);
//       }
//     }

//     // Create delivery
//     const delivery = new Delivery(deliveryData);
//     await delivery.save();

//     // Send notifications
//     await sendNotifications(delivery, sender, data.urgency);

//     // Auto-assign drone for emergency deliveries
//     if (data.urgency === 'emergency' && data.deliveryType !== 'incoming') {
//       try {
//         const availableDrone = await Drone.findOne({
//           status: 'available',
//           'specifications.maxPayload': { $gte: parseInt(data.packageWeight) }
//         }).sort({ 'health.batteryLevel': -1 });

//         if (availableDrone) {
//           delivery.droneId = availableDrone._id;
//           delivery.status = 'assigned';
//           await delivery.save();
//           await availableDrone.startDelivery(delivery._id);
//         }
//       } catch (error) {
//         console.log('Auto-assign drone failed:', error);
//       }
//     }

//     return NextResponse.json({ 
//       success: true, 
//       delivery: {
//         _id: delivery._id,
//         orderId: delivery.orderId,
//         status: delivery.status
//       }
//     });
//   } catch (error) {
//     console.error('Error creating delivery:', error);
//     return NextResponse.json(
//       { error: error.message || 'Failed to create delivery' },
//       { status: 500 }
//     );
//   }
// }

// // Helper function to send notifications
// async function sendNotifications(delivery, sender, urgency) {
//   try {
//     // Get all relevant users to notify
//     const usersToNotify = await User.find({
//       $or: [
//         { role: 'admin' },
//         { role: 'hospital_admin', hospitalId: sender.hospitalId },
//         { role: 'pilot', isActive: true }
//       ]
//     });

//     // Group users by role
//     const admins = usersToNotify.filter(u => u.role === 'admin');
//     const hospitalAdmins = usersToNotify.filter(u => u.role === 'hospital_admin');
//     const pilots = usersToNotify.filter(u => u.role === 'pilot');

//     // Create notification data
//     const notificationData = {
//       type: 'new_delivery',
//       deliveryId: delivery._id,
//       orderId: delivery.orderId,
//       urgency: urgency,
//       packageType: delivery.package.type,
//       sender: {
//         name: sender.name,
//         hospital: sender.hospitalId
//       },
//       timestamp: new Date()
//     };

//     // In a real implementation, you would:
//     // 1. Save notifications to a Notification collection
//     // 2. Send emails using SendGrid/AWS SES
//     // 3. Send SMS using Twilio
//     // 4. Send push notifications
//     // 5. Emit socket events for real-time updates

//     console.log(`Notifications sent:
//       - ${admins.length} admins notified
//       - ${hospitalAdmins.length} hospital admins notified
//       - ${pilots.length} pilots notified (${urgency} priority)`);

//     // For now, we'll just log the notifications
//     // In production, implement actual notification service
    
//     return {
//       notifiedAdmins: admins.length,
//       notifiedHospitalAdmins: hospitalAdmins.length,
//       notifiedPilots: pilots.length
//     };
//   } catch (error) {
//     console.error('Error sending notifications:', error);
//     // Don't fail the delivery creation if notifications fail
//   }
// }

// // Helper function to calculate distance between coordinates
// function calculateDistance(coord1, coord2) {
//   if (!coord1 || !coord2 || coord1.length < 2 || coord2.length < 2) {
//     return 0;
//   }
  
//   const R = 6371e3; // Earth radius in meters
//   const φ1 = coord1[1] * Math.PI/180;
//   const φ2 = coord2[1] * Math.PI/180;
//   const Δφ = (coord2[1] - coord1[1]) * Math.PI/180;
//   const Δλ = (coord2[0] - coord1[0]) * Math.PI/180;

//   const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
//             Math.cos(φ1) * Math.cos(φ2) *
//             Math.sin(Δλ/2) * Math.sin(Δλ/2);
//   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

//   return Math.round(R * c); // Distance in meters
// }
































// app/api/deliveries/create/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { connectDB } from '@/lib/mongodb';
import Delivery from '@/models/Delivery';
import User from '@/models/User';
import Hospital from '@/models/Hospital';
import Drone from '@/models/Drone';
import { checkRole } from '@/lib/auth-helpers';

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'medical_staff') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await req.json();
    await connectDB();

    // Get sender details
    const sender = await User.findById(session.user.id);
    if (!sender) {
      return NextResponse.json({ error: 'Sender not found' }, { status: 404 });
    }

    // Generate orderId here instead of relying on pre-save hook
    const generateOrderId = () => {
      const date = new Date();
      const year = date.getFullYear().toString().substr(-2);
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const random = Math.random().toString(36).substr(2, 6).toUpperCase();
      return `DRN${year}${month}${random}`;
    };

    let deliveryData;

    if (data.deliveryType === 'incoming') {
      // For incoming deliveries (hospital ordering supplies)
      const hospital = await Hospital.findById(session.user.hospitalId);
      if (!hospital) {
        return NextResponse.json({ error: 'Hospital not found' }, { status: 404 });
      }
      
      // Create a system user ID for warehouse/supplier if it doesn't exist
      let warehouseUser = await User.findOne({ email: 'warehouse@system.local' });
      if (!warehouseUser) {
        warehouseUser = await User.create({
          email: 'warehouse@system.local',
          password: 'system-generated-' + Math.random().toString(36),
          name: 'Central Warehouse',
          role: 'admin',
          userType: 'business',
          phoneNumber: '+1234567890',
          isActive: true
        });
      }
      
      deliveryData = {
        orderId: generateOrderId(),
        
        // For incoming orders, sender is warehouse/supplier
        sender: {
          userId: warehouseUser._id, // Use system warehouse user
          hospitalId: null,
          location: {
            type: 'Point',
            coordinates: [0, 0] // Will be updated when admin assigns actual location
          }
        },
        
        // Recipient is the ordering hospital
        recipient: {
          userId: sender._id,
          hospitalId: hospital._id,
          name: hospital.name,
          phone: hospital.contactInfo.primaryPhone,
          location: {
            type: 'Point',
            coordinates: hospital.address.coordinates.coordinates
          }
        },
        
        // Package details
        package: {
          type: data.packageType,
          description: data.packageDescription,
          weight: parseInt(data.packageWeight),
          dimensions: data.packageDimensions || {},
          temperatureControlled: data.temperatureControlled || false,
          temperatureRange: data.temperatureControlled ? data.temperatureRange : undefined,
          fragile: data.fragile || false,
          urgency: data.urgency || 'routine'
        },
        
        // Initial pricing (will be updated when admin assigns actual source)
        pricing: {
          basePrice: 10,
          urgencyCharge: 0,
          distanceCharge: 0,
          totalPrice: 10,
          currency: 'USD'
        },
        
        // Flight path placeholder
        flightPath: {
          estimatedDistance: 0,
          estimatedDuration: 0,
          waypoints: []
        },
        
        // Mark as incoming order
        metadata: {
          deliveryType: 'incoming',
          orderedBy: sender._id,
          orderingHospital: hospital._id,
          specialInstructions: data.specialInstructions || ''
        },
        
        status: 'pending',
        timeline: [{
          status: 'pending',
          timestamp: new Date(),
          notes: `Order placed by ${sender.name} from ${hospital.name}`
        }],
        
        delivery: {
          scheduledTime: data.scheduledTime ? new Date(data.scheduledTime) : new Date(Date.now() + 2 * 60 * 60 * 1000)
        }
      };
    } else {
      // For outgoing deliveries
      const senderHospital = await Hospital.findById(sender.hospitalId);
      
      deliveryData = {
        orderId: generateOrderId(),
        
        sender: {
          userId: sender._id,
          hospitalId: sender.hospitalId,
          location: {
            type: 'Point',
            coordinates: senderHospital?.address?.coordinates?.coordinates || [0, 0]
          }
        },
        
        recipient: {
          userId: data.recipientUserId || null,
          hospitalId: data.recipientHospitalId || null,
          name: data.recipientName,
          phone: data.recipientPhone,
          location: {
            type: 'Point',
            coordinates: data.recipientCoordinates || [0, 0]
          }
        },
        
        package: {
          type: data.packageType,
          description: data.packageDescription,
          weight: parseInt(data.packageWeight),
          dimensions: data.packageDimensions || {},
          temperatureControlled: data.temperatureControlled || false,
          temperatureRange: data.temperatureControlled ? data.temperatureRange : undefined,
          fragile: data.fragile || false,
          urgency: data.urgency || 'routine'
        },
        
        // Initial pricing
        pricing: {
          basePrice: 10,
          urgencyCharge: 0,
          distanceCharge: 0,
          totalPrice: 10,
          currency: 'USD'
        },
        
        flightPath: {
          estimatedDistance: 0,
          estimatedDuration: 0,
          waypoints: []
        },
        
        metadata: {
          deliveryType: 'outgoing',
          specialInstructions: data.specialInstructions || ''
        },
        
        status: 'pending',
        timeline: [{
          status: 'pending',
          timestamp: new Date(),
          notes: 'Delivery request created'
        }],
        
        delivery: {
          scheduledTime: data.scheduledTime ? new Date(data.scheduledTime) : new Date(Date.now() + 2 * 60 * 60 * 1000)
        }
      };
    }

    // Calculate distance and update pricing only if we have valid coordinates
    if (deliveryData.sender.location.coordinates[0] !== 0 && 
        deliveryData.recipient.location.coordinates[0] !== 0) {
      try {
        const distance = calculateDistance(
          deliveryData.sender.location.coordinates,
          deliveryData.recipient.location.coordinates
        );
        
        deliveryData.flightPath.estimatedDistance = distance;
        deliveryData.flightPath.estimatedDuration = Math.ceil(distance / 500); // 500m/min
        
        // Calculate pricing with urgency multiplier
        const urgencyMultiplier = {
          routine: 1,
          urgent: 1.5,
          emergency: 2
        };
        
        const basePrice = 10;
        const distanceRate = 0.002; // $0.002 per meter
        
        deliveryData.pricing.basePrice = basePrice;
        deliveryData.pricing.urgencyCharge = basePrice * (urgencyMultiplier[data.urgency] - 1);
        deliveryData.pricing.distanceCharge = Math.round(distance * distanceRate * 100) / 100;
        deliveryData.pricing.totalPrice = deliveryData.pricing.basePrice + 
                                        deliveryData.pricing.urgencyCharge + 
                                        deliveryData.pricing.distanceCharge;
      } catch (error) {
        console.log('Distance calculation skipped:', error);
      }
    }

    // Create delivery
    const delivery = new Delivery(deliveryData);
    await delivery.save();

    // Send notifications
    await sendNotifications(delivery, sender, data.urgency);

    // Auto-assign drone for emergency deliveries
    if (data.urgency === 'emergency' && data.deliveryType !== 'incoming') {
      try {
        const availableDrone = await Drone.findOne({
          status: 'available',
          'specifications.maxPayload': { $gte: parseInt(data.packageWeight) }
        }).sort({ 'health.batteryLevel': -1 });

        if (availableDrone) {
          delivery.droneId = availableDrone._id;
          delivery.status = 'assigned';
          await delivery.save();
          await availableDrone.startDelivery(delivery._id);
        }
      } catch (error) {
        console.log('Auto-assign drone failed:', error);
      }
    }

    return NextResponse.json({ 
      success: true, 
      delivery: {
        _id: delivery._id,
        orderId: delivery.orderId,
        status: delivery.status
      }
    });
  } catch (error) {
    console.error('Error creating delivery:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create delivery' },
      { status: 500 }
    );
  }
}

// Import Notification model at the top of the file
import Notification from '@/models/Notification';

// Helper function to send notifications
async function sendNotifications(delivery, sender, urgency) {
  try {
    // Get all relevant users to notify
    const query = {
      isActive: true,
      $or: []
    };

    // Always notify admins
    query.$or.push({ role: 'admin' });

    // Notify hospital admin of the sender's hospital
    if (sender.hospitalId) {
      query.$or.push({ 
        role: 'hospital_admin', 
        hospitalId: sender.hospitalId 
      });
    }

    // For urgent/emergency deliveries, notify all active pilots
    if (['urgent', 'emergency'].includes(urgency)) {
      query.$or.push({ role: 'pilot' });
    }

    const usersToNotify = await User.find(query);

    // Create notifications for each user
    const notifications = await Promise.all(
      usersToNotify.map(user => 
        Notification.createDeliveryNotification(
          user._id,
          delivery,
          'new_delivery'
        )
      )
    );

    // Group users by role for logging
    const admins = usersToNotify.filter(u => u.role === 'admin');
    const hospitalAdmins = usersToNotify.filter(u => u.role === 'hospital_admin');
    const pilots = usersToNotify.filter(u => u.role === 'pilot');

    console.log(`Notifications created:
      - ${admins.length} admins notified
      - ${hospitalAdmins.length} hospital admins notified
      - ${pilots.length} pilots notified (${urgency} priority)`);

    // In production, also implement:
    // - Email notifications using SendGrid/AWS SES
    // - SMS for urgent/emergency using Twilio
    // - Push notifications
    // - WebSocket events for real-time updates
    
    return {
      notifiedAdmins: admins.length,
      notifiedHospitalAdmins: hospitalAdmins.length,
      notifiedPilots: pilots.length,
      totalNotifications: notifications.length
    };
  } catch (error) {
    console.error('Error sending notifications:', error);
    // Don't fail the delivery creation if notifications fail
  }
}

// Helper function to calculate distance between coordinates
function calculateDistance(coord1, coord2) {
  if (!coord1 || !coord2 || coord1.length < 2 || coord2.length < 2) {
    return 0;
  }
  
  const R = 6371e3; // Earth radius in meters
  const φ1 = coord1[1] * Math.PI/180;
  const φ2 = coord2[1] * Math.PI/180;
  const Δφ = (coord2[1] - coord1[1]) * Math.PI/180;
  const Δλ = (coord2[0] - coord1[0]) * Math.PI/180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return Math.round(R * c); // Distance in meters
}
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

  // Check role authorization
  const { authorized, response, session } = await checkRole(req, ['medical_staff']);
  if (!authorized) return response;
  
  
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



    let deliveryData;

    if (data.deliveryType === 'incoming') {
      // For incoming deliveries (hospital ordering supplies)
      const hospital = await Hospital.findById(session.user.hospitalId);
      
      deliveryData = {
        // For incoming orders, sender is warehouse/supplier (to be assigned by admin)
        sender: {
          userId: null, // Will be assigned by admin
          hospitalId: null, // Warehouse/supplier ID
          location: {
            type: 'Point',
            coordinates: [0, 0] // Will be updated when admin assigns
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
          weight: data.packageWeight,
          dimensions: data.packageDimensions,
          temperatureControlled: data.temperatureControlled || false,
          temperatureRange: data.temperatureRange,
          fragile: data.fragile || false,
          urgency: data.urgency || 'routine'
        },
        
        // Mark as incoming order
        metadata: {
          deliveryType: 'incoming',
          orderedBy: sender._id,
          orderingHospital: hospital._id,
          specialInstructions: data.specialInstructions
        },
        
        status: 'pending',
        timeline: [{
          status: 'pending',
          timestamp: new Date(),
          notes: `Order placed by ${sender.name} from ${hospital.name}`
        }],
        
        delivery: {
          scheduledTime: data.scheduledTime || new Date(Date.now() + 2 * 60 * 60 * 1000)
        }
      };
    } else {
      // For outgoing deliveries (existing logic)
      // ... existing outgoing delivery logic

      deliveryData = {
      sender: {
        userId: sender._id,
        hospitalId: sender.hospitalId,
        location: {
          type: 'Point',
          coordinates: data.senderCoordinates || [0, 0]
        }
      },
      recipient: {
        userId: data.recipientUserId,
        hospitalId: data.recipientHospitalId,
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
        weight: data.packageWeight,
        dimensions: data.packageDimensions,
        temperatureControlled: data.temperatureControlled || false,
        temperatureRange: data.temperatureRange,
        fragile: data.fragile || false,
        urgency: data.urgency || 'routine'
      },
      status: 'pending',
      timeline: [{
        status: 'pending',
        timestamp: new Date(),
        notes: 'Delivery request created'
      }],
      delivery: {
        scheduledTime: data.scheduledTime || new Date(Date.now() + 2 * 60 * 60 * 1000) // Default 2 hours
      }
    };
    }





    // Create delivery object
    // const deliveryData = {
    //   sender: {
    //     userId: sender._id,
    //     hospitalId: sender.hospitalId,
    //     location: {
    //       type: 'Point',
    //       coordinates: data.senderCoordinates || [0, 0]
    //     }
    //   },
    //   recipient: {
    //     userId: data.recipientUserId,
    //     hospitalId: data.recipientHospitalId,
    //     name: data.recipientName,
    //     phone: data.recipientPhone,
    //     location: {
    //       type: 'Point',
    //       coordinates: data.recipientCoordinates || [0, 0]
    //     }
    //   },
    //   package: {
    //     type: data.packageType,
    //     description: data.packageDescription,
    //     weight: data.packageWeight,
    //     dimensions: data.packageDimensions,
    //     temperatureControlled: data.temperatureControlled || false,
    //     temperatureRange: data.temperatureRange,
    //     fragile: data.fragile || false,
    //     urgency: data.urgency || 'routine'
    //   },
    //   status: 'pending',
    //   timeline: [{
    //     status: 'pending',
    //     timestamp: new Date(),
    //     notes: 'Delivery request created'
    //   }],
    //   delivery: {
    //     scheduledTime: data.scheduledTime || new Date(Date.now() + 2 * 60 * 60 * 1000) // Default 2 hours
    //   }
    // };

    

    // Calculate estimated distance and price
    if (data.senderCoordinates && data.recipientCoordinates) {
      const distance = calculateDistance(
        data.senderCoordinates,
        data.recipientCoordinates
      );
      deliveryData.flightPath = {
        estimatedDistance: distance,
        estimatedDuration: Math.ceil(distance / 500) // Assume 500m/min
      };
    }

    const delivery = new Delivery(deliveryData);
    
    // Calculate price (will be updated when admin assigns source)
    delivery.calculatePrice();

    await delivery.save();

    // Auto-assign drone for emergency deliveries
    if (data.urgency === 'emergency') {
      const availableDrone = await Drone.findOne({
        status: 'available',
        'specifications.maxPayload': { $gte: data.packageWeight }
      }).sort({ 'health.batteryLevel': -1 });

      if (availableDrone) {
        delivery.droneId = availableDrone._id;
        delivery.status = 'assigned';
        await delivery.save();
        
        await availableDrone.startDelivery(delivery._id);
      }
    }

    return NextResponse.json({ success: true, delivery });
  } catch (error) {
    console.error('Error creating delivery:', error);
    return NextResponse.json(
      { error: 'Failed to create delivery' },
      { status: 500 }
    );
  }
}

// Helper function to calculate distance between coordinates
function calculateDistance(coord1, coord2) {
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
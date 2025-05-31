// app/api/deliveries/create/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { connectDB } from '@/lib/mongodb';
import Delivery from '@/models/Delivery';
import User from '@/models/User';
import Hospital from '@/models/Hospital';
import Drone from '@/models/Drone';
import Notification from '@/models/Notification';
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
          specialInstructions: data.specialInstructions || '',
          requiresApproval: data.urgency !== 'emergency', // Emergency bypasses approval
          // approvalDeadline: data.urgency === 'urgent' ? new Date(Date.now() + 2 * 60 * 60 * 1000) : null // 2 hours for urgent
        },
        
        // Set initial status based on urgency
        status: data.urgency === 'emergency' ? 'approved' : 'pending_approval',
        timeline: [{
          status: data.urgency === 'emergency' ? 'approved' : 'pending_approval',
          timestamp: new Date(),
          notes: data.urgency === 'emergency' 
            ? `Emergency order auto-approved - placed by ${sender.name} from ${hospital.name}`
            : `Order placed by ${sender.name} from ${hospital.name} - awaiting hospital admin approval`
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
          address: data.recipientAddress,
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
          specialInstructions: data.specialInstructions || '',
          requiresApproval: data.urgency !== 'emergency',
          // approvalDeadline: data.urgency === 'urgent' ? new Date(Date.now() + 2 * 60 * 60 * 1000) : null
        },
        
        // Set initial status based on urgency
        status: data.urgency === 'emergency' ? 'approved' : 'pending_approval',
        timeline: [{
          status: data.urgency === 'emergency' ? 'approved' : 'pending_approval',
          timestamp: new Date(),
          notes: data.urgency === 'emergency' 
            ? 'Emergency delivery auto-approved'
            : 'Delivery request created - awaiting hospital admin approval'
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

    // Send notifications based on urgency
    if (data.urgency === 'emergency') {
      // For emergency: Notify both hospital admin (for awareness) and system admin (for pilot assignment)
      
      // Notify hospital admins for awareness
      if (sender.hospitalId) {
        await notifyHospitalAdminsForEmergency(delivery, sender.hospitalId);
      }
      
      // Notify system admins for immediate pilot assignment
      await notifySystemAdminsForAssignment(delivery, 'emergency_delivery');
    
    } else {
      // For routine/urgent: Notify hospital admin first
      await notifyHospitalAdmins(delivery, sender.hospitalId);
    }

    return NextResponse.json({ 
      success: true, 
      delivery: {
        _id: delivery._id,
        orderId: delivery.orderId,
        status: delivery.status,
        requiresApproval: delivery.metadata.requiresApproval
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

// Helper function to notify hospital admins
async function notifyHospitalAdmins(delivery, hospitalId) {
  try {
    const hospitalAdmins = await User.find({
      role: 'hospital_admin',
      hospitalId: hospitalId,
      isActive: true
    });

    const notifications = await Promise.all(
      hospitalAdmins.map(admin => 
        Notification.create({
          userId: admin._id,
          type: 'new_delivery',
          title: 'New Delivery Requires Approval',
          message: `${delivery.package.urgency} delivery order ${delivery.orderId} requires your approval`,
          data: {
            deliveryId: delivery._id,
            orderId: delivery.orderId,
            urgency: delivery.package.urgency,
            packageType: delivery.package.type,
            status: delivery.status
          },
          priority: delivery.package.urgency === 'urgent' ? 'high' : 'medium',
          actionRequired: true,
          actionUrl: `/dashboard/hospital-admin/approve-delivery/${delivery._id}`
        })
      )
    );

    console.log(`Notified ${hospitalAdmins.length} hospital admins for approval`);
    return notifications;
  } catch (error) {
    console.error('Error notifying hospital admins:', error);
  }
}

// Add this helper function for emergency notifications to hospital admins
async function notifyHospitalAdminsForEmergency(delivery, hospitalId) {
  try {
    const hospitalAdmins = await User.find({
      role: 'hospital_admin',
      hospitalId: hospitalId,
      isActive: true
    });

    const notifications = await Promise.all(
      hospitalAdmins.map(admin => 
        Notification.create({
          userId: admin._id,
          type: 'urgent_alert',
          title: 'Emergency Delivery Auto-Approved',
          message: `Emergency delivery ${delivery.orderId} has been created and auto-approved. Admin will assign a pilot immediately.`,
          data: {
            deliveryId: delivery._id,
            orderId: delivery.orderId,
            urgency: 'emergency',
            packageType: delivery.package.type,
            status: delivery.status,
            autoApproved: true
          },
          priority: 'urgent',
          actionRequired: false,
          actionUrl: `/dashboard/delivery/${delivery._id}`
        })
      )
    );

    console.log(`Notified ${hospitalAdmins.length} hospital admins about emergency delivery`);
    return notifications;
  } catch (error) {
    console.error('Error notifying hospital admins about emergency:', error);
  }
}

// Update the existing notifySystemAdminsForAssignment function to handle emergency type
async function notifySystemAdminsForAssignment(delivery, notificationType = 'delivery_status') {
  try {
    const systemAdmins = await User.find({
      role: 'admin',
      isActive: true
    });

    const isEmergency = notificationType === 'emergency_delivery';
    
    const notifications = await Promise.all(
      systemAdmins.map(admin => 
        Notification.create({
          userId: admin._id,
          type: isEmergency ? 'urgent_alert' : 'delivery_status',
          title: isEmergency ? 'Emergency Delivery - Immediate Assignment Required' : 'Delivery Ready for Pilot Assignment',
          message: isEmergency 
            ? `URGENT: Emergency delivery ${delivery.orderId} requires immediate pilot assignment!`
            : `${delivery.package.urgency} delivery ${delivery.orderId} has been approved and requires pilot assignment`,
          data: {
            deliveryId: delivery._id,
            orderId: delivery.orderId,
            urgency: delivery.package.urgency,
            packageType: delivery.package.type,
            status: delivery.status,
            autoApproved: isEmergency
          },
          priority: isEmergency ? 'urgent' : (delivery.package.urgency === 'urgent' ? 'high' : 'medium'),
          actionRequired: true,
          actionUrl: `/dashboard/admin/assign-pilot/${delivery._id}`,
          // For emergency, set expiration time
          expiresAt: isEmergency ? new Date(Date.now() + 2 * 60 * 60 * 1000) : undefined // 2 hours
        })
      )
    );

    console.log(`Notified ${systemAdmins.length} system admins for ${isEmergency ? 'emergency' : 'regular'} pilot assignment`);
    return notifications;
  } catch (error) {
    console.error('Error notifying system admins:', error);
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
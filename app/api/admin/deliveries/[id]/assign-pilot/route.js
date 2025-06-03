// // app/api/admin/deliveries/[id]/assign-pilot/route.js
// import { NextResponse } from 'next/server';
// import { getServerSession } from 'next-auth';
// import { authOptions } from '@/app/api/auth/[...nextauth]/route';
// import { connectDB } from '@/lib/mongodb';
// import Delivery from '@/models/Delivery';
// import User from '@/models/User';
// import Notification from '@/models/Notification';

// export async function POST(req, { params }) {
//   try {
//     const session = await getServerSession(authOptions);
//     if (!session || session.user.role !== 'admin') {
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//     }

//     const { id } = await params;
//     const { pilotId } = await req.json();

//     await connectDB();

//     // Get delivery
//     const delivery = await Delivery.findById(id);
//     if (!delivery) {
//       return NextResponse.json({ error: 'Delivery not found' }, { status: 404 });
//     }

//     // Check if delivery is approved
//     if (delivery.status !== 'approved') {
//       return NextResponse.json({ 
//         error: 'Delivery must be approved before pilot assignment',
//         currentStatus: delivery.status 
//       }, { status: 400 });
//     }

//     // Verify pilot exists and is available
//     const pilot = await User.findById(pilotId);
//     if (!pilot || pilot.role !== 'pilot') {
//       return NextResponse.json({ error: 'Invalid pilot' }, { status: 400 });
//     }

//     if (!pilot.isActive) {
//       return NextResponse.json({ error: 'Pilot is not active' }, { status: 400 });
//     }

//     // Assign pilot to delivery
//     delivery.pilotId = pilotId;
//     delivery.status = 'assigned';
//     delivery.timeline.push({
//       status: 'assigned',
//       timestamp: new Date(),
//       notes: `Assigned to pilot ${pilot.name}`
//     });

//     // Update metadata
//     delivery.metadata.assignedBy = session.user.id;
//     delivery.metadata.assignmentTime = new Date();

//     await delivery.save();

//     // Notify the pilot
//     await notifyPilot(pilotId, delivery);

//     // Notify the medical staff who created the order
//     await notifyOriginator(delivery);

//     // If hospital admin exists, notify them too
//     if (delivery.sender.hospitalId) {
//       await notifyHospitalAdmin(delivery);
//     }

//     return NextResponse.json({ 
//       success: true,
//       message: 'Pilot assigned successfully',
//       delivery: {
//         _id: delivery._id,
//         orderId: delivery.orderId,
//         status: delivery.status,
//         pilot: {
//           _id: pilot._id,
//           name: pilot.name
//         }
//       }
//     });
//   } catch (error) {
//     console.error('Error assigning pilot:', error);
//     return NextResponse.json(
//       { error: 'Failed to assign pilot' },
//       { status: 500 }
//     );
//   }
// }

// // Get available pilots
// export async function GET(req, { params }) {
//   try {
//     const session = await getServerSession(authOptions);
//     if (!session || session.user.role !== 'admin') {
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//     }

//     const { id } = await params;

//     await connectDB();

//     // Get delivery to check requirements
//     const delivery = await Delivery.findById(id);
//     if (!delivery) {
//       return NextResponse.json({ error: 'Delivery not found' }, { status: 404 });
//     }

//     // Get available pilots
//     const availablePilots = await User.find({
//       role: 'pilot',
//       isActive: true
//     }).select('_id name email phoneNumber');

//     // Get pilots' current assignments count
//     const pilotAssignments = await Delivery.aggregate([
//       {
//         $match: {
//           pilotId: { $exists: true },
//           status: { $in: ['assigned', 'pickup', 'in_transit'] }
//         }
//       },
//       {
//         $group: {
//           _id: '$pilotId',
//           count: { $sum: 1 }
//         }
//       }
//     ]);

//     const pilotAssignmentMap = {};
//     pilotAssignments.forEach(pa => {
//       pilotAssignmentMap[pa._id.toString()] = pa.count;
//     });

//     // Add assignment count to pilots
//     const pilotsWithAssignments = availablePilots.map(pilot => ({
//       ...pilot.toObject(),
//       currentAssignments: pilotAssignmentMap[pilot._id.toString()] || 0
//     }));

//     return NextResponse.json({
//       pilots: pilotsWithAssignments
//     });
//   } catch (error) {
//     console.error('Error fetching available pilots:', error);
//     return NextResponse.json(
//       { error: 'Failed to fetch available pilots' },
//       { status: 500 }
//     );
//   }
// }

// // Helper function to notify pilot
// async function notifyPilot(pilotId, delivery) {
//   try {
//     await Notification.create({
//       userId: pilotId,
//       type: 'delivery_assigned',
//       title: 'New Delivery Assigned',
//       message: `You have been assigned ${delivery.package.urgency} delivery ${delivery.orderId}`,
//       data: {
//         deliveryId: delivery._id,
//         orderId: delivery.orderId,
//         urgency: delivery.package.urgency,
//         packageType: delivery.package.type,
//         status: delivery.status
//       },
//       priority: delivery.package.urgency === 'emergency' ? 'urgent' : 
//                delivery.package.urgency === 'urgent' ? 'high' : 'medium',
//       actionRequired: true,
//       actionUrl: `/dashboard/pilot/delivery/${delivery._id}`
//     });

//     console.log('Pilot notified of assignment');
//   } catch (error) {
//     console.error('Error notifying pilot:', error);
//   }
// }

// // Helper function to notify originator
// async function notifyOriginator(delivery) {
//   try {
//     const userId = delivery.metadata?.orderedBy || delivery.sender.userId;
    
//     await Notification.create({
//       userId: userId,
//       type: 'delivery_status',
//       title: 'Pilot Assigned to Your Delivery',
//       message: `A pilot has been assigned to your delivery ${delivery.orderId}`,
//       data: {
//         deliveryId: delivery._id,
//         orderId: delivery.orderId,
//         urgency: delivery.package.urgency,
//         packageType: delivery.package.type,
//         status: delivery.status
//       },
//       priority: 'medium',
//       actionRequired: false,
//       actionUrl: `/dashboard/delivery/${delivery._id}`
//     });
//   } catch (error) {
//     console.error('Error notifying originator:', error);
//   }
// }

// // Helper function to notify hospital admin
// async function notifyHospitalAdmin(delivery) {
//   try {
//     const hospitalAdmins = await User.find({
//       role: 'hospital_admin',
//       hospitalId: delivery.sender.hospitalId,
//       isActive: true
//     });

//     await Promise.all(
//       hospitalAdmins.map(admin => 
//         Notification.create({
//           userId: admin._id,
//           type: 'delivery_status',
//           title: 'Pilot Assigned to Hospital Delivery',
//           message: `Delivery ${delivery.orderId} has been assigned to a pilot`,
//           data: {
//             deliveryId: delivery._id,
//             orderId: delivery.orderId,
//             urgency: delivery.package.urgency,
//             packageType: delivery.package.type,
//             status: delivery.status
//           },
//           priority: 'low',
//           actionRequired: false,
//           actionUrl: `/dashboard/delivery/${delivery._id}`
//         })
//       )
//     );
//   } catch (error) {
//     console.error('Error notifying hospital admin:', error);
//   }
// }





























// app/api/admin/deliveries/[id]/assign-pilot/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { connectDB } from '@/lib/mongodb';
import Delivery from '@/models/Delivery';
import User from '@/models/User';
import Hospital from '@/models/Hospital';
import Notification from '@/models/Notification';

export async function POST(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const { pilotId } = await req.json();

    await connectDB();

    // Get delivery
    const delivery = await Delivery.findById(id);
    if (!delivery) {
      return NextResponse.json({ error: 'Delivery not found' }, { status: 404 });
    }

    // Check if delivery is approved
    if (delivery.status !== 'approved') {
      return NextResponse.json({ 
        error: 'Delivery must be approved before pilot assignment',
        currentStatus: delivery.status 
      }, { status: 400 });
    }

    // Verify pilot exists and is available
    const pilot = await User.findById(pilotId);
    if (!pilot || pilot.role !== 'pilot') {
      return NextResponse.json({ error: 'Invalid pilot' }, { status: 400 });
    }

    if (!pilot.isActive) {
      return NextResponse.json({ error: 'Pilot is not active' }, { status: 400 });
    }

    // Assign pilot to delivery
    delivery.pilotId = pilotId;
    delivery.status = 'assigned';
    delivery.timeline.push({
      status: 'assigned',
      timestamp: new Date(),
      notes: `Assigned to pilot ${pilot.name}`
    });

    // Update metadata
    delivery.metadata.assignedBy = session.user.id;
    delivery.metadata.assignmentTime = new Date();

    await delivery.save();

    // Notify the pilot
    await notifyPilot(pilotId, delivery);

    // Notify the medical staff who created the order
    await notifyOriginator(delivery);

    // If hospital admin exists, notify them too
    if (delivery.sender.hospitalId) {
      await notifyHospitalAdmin(delivery);
    }

    return NextResponse.json({ 
      success: true,
      message: 'Pilot assigned successfully',
      delivery: {
        _id: delivery._id,
        orderId: delivery.orderId,
        status: delivery.status,
        pilot: {
          _id: pilot._id,
          name: pilot.name
        }
      }
    });
  } catch (error) {
    console.error('Error assigning pilot:', error);
    return NextResponse.json(
      { error: 'Failed to assign pilot' },
      { status: 500 }
    );
  }
}

// Get available pilots filtered by state
export async function GET(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    await connectDB();

    // Get delivery with populated hospital data
    const delivery = await Delivery.findById(id)
      .populate('sender.hospitalId')
      .populate('recipient.hospitalId')
      .populate('metadata.orderingHospital');
    
    if (!delivery) {
      return NextResponse.json({ error: 'Delivery not found' }, { status: 404 });
    }

    // Determine which hospital's state to use for filtering
    let hospitalState = null;
    let hospitalForFilter = null;

    if (delivery.metadata?.deliveryType === 'incoming') {
      // For incoming deliveries, use recipient hospital's state
      hospitalForFilter = delivery.recipient.hospitalId || delivery.metadata.orderingHospital;
    } else {
      // For outgoing deliveries, use sender hospital's state
      hospitalForFilter = delivery.sender.hospitalId;
    }

    if (hospitalForFilter) {
      hospitalState = hospitalForFilter.address?.state;
    }

    // Build pilot query
    const pilotQuery = {
      role: 'pilot',
      isActive: true
    };

    // Add state filter if we have a hospital state
    if (hospitalState) {
      pilotQuery['address.state'] = hospitalState;
    }

    // Get available pilots filtered by state
    const availablePilots = await User.find(pilotQuery)
      .select('_id name email phoneNumber address');

    // Get pilots' current assignments count
    const pilotAssignments = await Delivery.aggregate([
      {
        $match: {
          pilotId: { $exists: true },
          status: { $in: ['assigned', 'pickup', 'in_transit'] }
        }
      },
      {
        $group: {
          _id: '$pilotId',
          count: { $sum: 1 }
        }
      }
    ]);

    const pilotAssignmentMap = {};
    pilotAssignments.forEach(pa => {
      pilotAssignmentMap[pa._id.toString()] = pa.count;
    });

    // Add assignment count and format address for pilots
    const pilotsWithDetails = availablePilots.map(pilot => ({
      ...pilot.toObject(),
      currentAssignments: pilotAssignmentMap[pilot._id.toString()] || 0,
      displayAddress: pilot.address ? 
        `${pilot.address.street}, ${pilot.address.city}, ${pilot.address.state} ${pilot.address.zipCode}` : 
        'Address not available'
    }));

    // Get hospital details for display
    const hospitalDetails = {
      name: hospitalForFilter?.name || 'Unknown Hospital',
      address: hospitalForFilter?.address ? 
        `${hospitalForFilter.address.street}, ${hospitalForFilter.address.city}, ${hospitalForFilter.address.state} ${hospitalForFilter.address.zipCode}` :
        'Address not available',
      state: hospitalState || 'Unknown'
    };

    return NextResponse.json({
      pilots: pilotsWithDetails,
      hospitalDetails,
      filterInfo: {
        state: hospitalState,
        totalPilotsInState: pilotsWithDetails.length,
        deliveryType: delivery.metadata?.deliveryType || 'outgoing'
      }
    });
  } catch (error) {
    console.error('Error fetching available pilots:', error);
    return NextResponse.json(
      { error: 'Failed to fetch available pilots' },
      { status: 500 }
    );
  }
}

// Helper function to notify pilot
async function notifyPilot(pilotId, delivery) {
  try {
    await Notification.create({
      userId: pilotId,
      type: 'delivery_assigned',
      title: 'New Delivery Assigned',
      message: `You have been assigned ${delivery.package.urgency} delivery ${delivery.orderId}`,
      data: {
        deliveryId: delivery._id,
        orderId: delivery.orderId,
        urgency: delivery.package.urgency,
        packageType: delivery.package.type,
        status: delivery.status
      },
      priority: delivery.package.urgency === 'emergency' ? 'urgent' : 
               delivery.package.urgency === 'urgent' ? 'high' : 'medium',
      actionRequired: true,
      actionUrl: `/dashboard/pilot/delivery/${delivery._id}`
    });

    console.log('Pilot notified of assignment');
  } catch (error) {
    console.error('Error notifying pilot:', error);
  }
}

// Helper function to notify originator
async function notifyOriginator(delivery) {
  try {
    const userId = delivery.metadata?.orderedBy || delivery.sender.userId;
    
    await Notification.create({
      userId: userId,
      type: 'delivery_status',
      title: 'Pilot Assigned to Your Delivery',
      message: `A pilot has been assigned to your delivery ${delivery.orderId}`,
      data: {
        deliveryId: delivery._id,
        orderId: delivery.orderId,
        urgency: delivery.package.urgency,
        packageType: delivery.package.type,
        status: delivery.status
      },
      priority: 'medium',
      actionRequired: false,
      actionUrl: `/dashboard/delivery/${delivery._id}`
    });
  } catch (error) {
    console.error('Error notifying originator:', error);
  }
}

// Helper function to notify hospital admin
async function notifyHospitalAdmin(delivery) {
  try {
    const hospitalAdmins = await User.find({
      role: 'hospital_admin',
      hospitalId: delivery.sender.hospitalId,
      isActive: true
    });

    await Promise.all(
      hospitalAdmins.map(admin => 
        Notification.create({
          userId: admin._id,
          type: 'delivery_status',
          title: 'Pilot Assigned to Hospital Delivery',
          message: `Delivery ${delivery.orderId} has been assigned to a pilot`,
          data: {
            deliveryId: delivery._id,
            orderId: delivery.orderId,
            urgency: delivery.package.urgency,
            packageType: delivery.package.type,
            status: delivery.status
          },
          priority: 'low',
          actionRequired: false,
          actionUrl: `/dashboard/delivery/${delivery._id}`
        })
      )
    );
  } catch (error) {
    console.error('Error notifying hospital admin:', error);
  }
}
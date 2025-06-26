// // app/api/staff/deliveries/[id]/confirm/route.js
// import { NextResponse } from 'next/server';
// import { getServerSession } from 'next-auth';
// import { authOptions } from '@/app/api/auth/[...nextauth]/route';
// import { connectDB } from '@/lib/mongodb';
// import Delivery from '@/models/Delivery';
// import User from '@/models/User';
// import Notification from '@/models/Notification';
// import Hospital from '@/models/Hospital';
// import PaymentHistory from '@/models/PaymentHistory';
// import Razorpay from 'razorpay';

// // Initialize Razorpay
// const razorpay = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID,
//   key_secret: process.env.RAZORPAY_KEY_SECRET
// });

// export async function POST(req, { params }) {
//   try {
//     const session = await getServerSession(authOptions);
//     if (!session || session.user.role !== 'medical_staff') {
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//     }

//     const { id } = await params;
//     const { confirmed, reason } = await req.json();

//     await connectDB();

//     const delivery = await Delivery.findById(id)
//       .populate('pilotId', 'name')
//       .populate('sender.hospitalId')
//       .populate('recipient.hospitalId');

//     if (!delivery) {
//       return NextResponse.json({ error: 'Delivery not found' }, { status: 404 });
//     }

//     // Verify user has permission to confirm
//     const isAuthorized = 
//       delivery.sender.userId?.toString() === session.user.id ||
//       delivery.recipient.userId?.toString() === session.user.id ||
//       delivery.metadata?.orderedBy?.toString() === session.user.id;

//     if (!isAuthorized) {
//       return NextResponse.json({ error: 'Not authorized to confirm this delivery' }, { status: 403 });
//     }

//     // Check if delivery is pending confirmation
//     if (delivery.status !== 'pending_confirmation') {
//       return NextResponse.json({ 
//         error: 'Delivery is not pending confirmation',
//         currentStatus: delivery.status 
//       }, { status: 400 });
//     }

//     if (confirmed) {
//       // Mark as delivered
//       delivery.status = 'delivered';
//       delivery.timeline.push({
//         status: 'delivered',
//         timestamp: new Date(),
//         notes: `Delivery confirmed by ${session.user.name}`
//       });

//       // Create payment record
//       const paymentRecord = await PaymentHistory.create({
//         hospitalId: delivery.sender.hospitalId,
//         deliveryId: delivery._id,
//         orderId: delivery.orderId,
//         amount: delivery.pricing.totalPrice,
//         status: 'processing',
//         priceBreakdown: delivery.pricing.breakdown,
//         staffDetails: {
//           id: delivery.sender.userId._id,
//           name: delivery.sender.userId.name,
//           email: delivery.sender.userId.email
//         },
//         deliveryDetails: {
//           packageType: delivery.package.type,
//           urgency: delivery.package.urgency,
//           weight: delivery.package.weight,
//           deliveredAt: new Date()
//         }
//       });

//       // Process auto-deduction
//       try {
//         // Get hospital payment method
//         const hospital = await Hospital.findById(delivery.sender.hospitalId);
        
//         if (hospital.billing.autoDeduct && hospital.payment.isSetup) {
//           // Create Razorpay order
//           const order = await razorpay.orders.create({
//             amount: delivery.pricing.totalPrice * 100, // Convert to paise
//             currency: 'INR',
//             receipt: delivery.orderId,
//             notes: {
//               deliveryId: delivery._id.toString(),
//               hospitalId: hospital._id.toString()
//             }
//           });

//           // Process payment using saved payment method
//           // Implementation depends on Razorpay's recurring payment API
          
//           // Update payment record
//           await PaymentHistory.findByIdAndUpdate(paymentRecord._id, {
//             status: 'completed',
//             razorpayOrderId: order.id,
//             razorpayPaymentId: payment.id
//           });

//           // Update hospital billing
//           await Hospital.findByIdAndUpdate(hospital._id, {
//             $inc: {
//               'billing.totalSpent': delivery.pricing.totalPrice
//             }
//           });
//         }
//       } catch (error) {
//         console.error('Auto-deduction failed:', error);
//         // Payment remains in 'processing' status for manual processing
//       }

//       // Set actual delivery time
//       delivery.delivery.actualDeliveryTime = delivery.metadata.pendingDeliveryTime || new Date();
      
//       // Clear pending delivery time
//       delete delivery.metadata.pendingDeliveryTime;

//       await delivery.save();

//       // Send success notifications
//       await sendDeliverySuccessNotifications(delivery, session.user);

//       // Notify pilot of successful delivery
//       if (delivery.pilotId) {
//         await Notification.create({
//           userId: delivery.pilotId,
//           type: 'delivery_status',
//           title: 'Delivery Confirmed',
//           message: `Delivery ${delivery.orderId} has been confirmed as received`,
//           data: {
//             deliveryId: delivery._id,
//             orderId: delivery.orderId,
//             confirmedBy: session.user.name
//           },
//           priority: 'medium',
//           actionRequired: false
//         });
//       }

//       return NextResponse.json({ 
//         success: true, 
//         message: 'Delivery confirmed successfully' 
//       });
//     } else {
//       // Delivery not confirmed - revert to in_transit
//       delivery.status = 'in_transit';
//       delivery.timeline.push({
//         status: 'in_transit',
//         timestamp: new Date(),
//         notes: `Delivery confirmation denied by ${session.user.name}. Reason: ${reason || 'Not specified'}`
//       });

//       // Clear pending delivery time
//       delete delivery.metadata.pendingDeliveryTime;

//       await delivery.save();

//       // Notify pilot that delivery was not confirmed
//       if (delivery.pilotId) {
//         await Notification.create({
//           userId: delivery.pilotId,
//           type: 'urgent_alert',
//           title: 'Delivery Not Confirmed',
//           message: `Delivery ${delivery.orderId} was not confirmed. Reason: ${reason || 'Not specified'}`,
//           data: {
//             deliveryId: delivery._id,
//             orderId: delivery.orderId,
//             deniedBy: session.user.name,
//             reason: reason
//           },
//           priority: 'urgent',
//           actionRequired: true
//         });
//       }

//       return NextResponse.json({ 
//         success: true, 
//         message: 'Delivery confirmation denied' 
//       });
//     }
//   } catch (error) {
//     console.error('Error confirming delivery:', error);
//     return NextResponse.json(
//       { error: 'Failed to confirm delivery' },
//       { status: 500 }
//     );
//   }
// }

// async function sendDeliverySuccessNotifications(delivery, confirmedBy) {
//   try {
//     const notifications = [];

//     // Notify system admins
//     const admins = await User.find({ role: 'admin', isActive: true });
//     for (const admin of admins) {
//       notifications.push(
//         Notification.create({
//           userId: admin._id,
//           type: 'delivery_status',
//           title: 'Delivery Completed',
//           message: `Delivery ${delivery.orderId} has been successfully completed`,
//           data: {
//             deliveryId: delivery._id,
//             orderId: delivery.orderId,
//             urgency: delivery.package.urgency,
//             status: 'delivered',
//             completedTime: delivery.delivery.actualDeliveryTime
//           },
//           priority: 'low',
//           actionRequired: false
//         })
//       );
//     }

//     // Notify hospital admin
//     const hospitalId = delivery.metadata?.deliveryType === 'incoming' 
//       ? delivery.metadata?.orderingHospital || delivery.recipient.hospitalId
//       : delivery.sender.hospitalId;

//     if (hospitalId) {
//       const hospitalAdmins = await User.find({
//         role: 'hospital_admin',
//         hospitalId: hospitalId,
//         isActive: true
//       });

//       for (const admin of hospitalAdmins) {
//         notifications.push(
//           Notification.create({
//             userId: admin._id,
//             type: 'delivery_status',
//             title: 'Delivery Successfully Completed',
//             message: `${delivery.package.urgency} delivery ${delivery.orderId} has been delivered`,
//             data: {
//               deliveryId: delivery._id,
//               orderId: delivery.orderId,
//               urgency: delivery.package.urgency,
//               status: 'delivered',
//               deliveryTime: delivery.delivery.actualDeliveryTime
//             },
//             priority: 'low',
//             actionRequired: false
//           })
//         );
//       }
//     }

//     // Notify medical staff (if not the one who confirmed)
//     const staffUserId = delivery.metadata?.orderedBy || delivery.sender.userId;
//     if (staffUserId && staffUserId.toString() !== confirmedBy._id.toString()) {
//       notifications.push(
//         Notification.create({
//           userId: staffUserId,
//           type: 'delivery_status',
//           title: 'Delivery Completed Successfully!',
//           message: `Your delivery ${delivery.orderId} has been successfully delivered`,
//           data: {
//             deliveryId: delivery._id,
//             orderId: delivery.orderId,
//             urgency: delivery.package.urgency,
//             status: 'delivered',
//             deliveryTime: delivery.delivery.actualDeliveryTime
//           },
//           priority: 'medium',
//           actionRequired: false
//         })
//       );
//     }

//     await Promise.all(notifications);
//     console.log(`Sent ${notifications.length} delivery success notifications`);
//   } catch (error) {
//     console.error('Error sending success notifications:', error);
//   }
// }















// app/api/staff/deliveries/[id]/confirm/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { connectDB } from '@/lib/mongodb';
import Delivery from '@/models/Delivery';
import User from '@/models/User';
import Notification from '@/models/Notification';
import Hospital from '@/models/Hospital';
import PaymentHistory from '@/models/PaymentHistory';
import { processAutoDeduction } from '@/lib/payment-processor';

export async function POST(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'medical_staff') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const { confirmed, reason } = await req.json();

    await connectDB();

    const delivery = await Delivery.findById(id)
      .populate('pilotId', 'name')
      .populate('sender.userId', 'name email')
      .populate('sender.hospitalId')
      .populate('recipient.hospitalId');

    if (!delivery) {
      return NextResponse.json({ error: 'Delivery not found' }, { status: 404 });
    }

    // Verify user has permission to confirm
    const isAuthorized = 
      delivery.sender.userId?._id?.toString() === session.user.id ||
      delivery.recipient.userId?.toString() === session.user.id ||
      delivery.metadata?.orderedBy?.toString() === session.user.id;

    if (!isAuthorized) {
      return NextResponse.json({ error: 'Not authorized to confirm this delivery' }, { status: 403 });
    }

    // Check if delivery is pending confirmation
    if (delivery.status !== 'pending_confirmation') {
      return NextResponse.json({ 
        error: 'Delivery is not pending confirmation',
        currentStatus: delivery.status 
      }, { status: 400 });
    }

    if (confirmed) {
      // Mark as delivered
      delivery.status = 'delivered';
      delivery.timeline.push({
        status: 'delivered',
        timestamp: new Date(),
        notes: `Delivery confirmed by ${session.user.name}`
      });

      // Get the hospital ID correctly
      // const hospitalId = delivery.sender.hospitalId?._id || delivery.sender.hospitalId;

      let hospitalId;

      if (delivery.metadata?.deliveryType === 'incoming') {
        // For incoming orders, use recipient's hospital (ordering hospital)
        hospitalId = delivery.recipient.hospitalId?._id || 
                    delivery.recipient.hospitalId ||
                    delivery.metadata?.orderingHospital;
      } else {
        // For outgoing orders, use sender's hospital
        hospitalId = delivery.sender.hospitalId?._id || 
                    delivery.sender.hospitalId;
      }
      
      if (!hospitalId) {
        console.error('Hospital ID not found in delivery:', delivery.orderId);
        return NextResponse.json({ 
          error: 'Hospital information missing',
          details: 'Cannot process payment without hospital information'
        }, { status: 400 });
      }

      // Create payment record with proper hospital ID
      const paymentRecord = await PaymentHistory.create({
        hospitalId: hospitalId, // Fixed: Use the extracted hospital ID
        deliveryId: delivery._id,
        orderId: delivery.orderId,
        amount: delivery.pricing?.totalPrice || 0,
        currency: delivery.pricing?.currency || 'INR',
        status: 'processing',
        priceBreakdown: delivery.pricing?.breakdown || {
          basePrice: delivery.pricing?.basePrice || 0,
          urgencyCharge: delivery.pricing?.urgencyCharge || 0,
          distanceCharge: delivery.pricing?.distanceCharge || 0,
          weightCharge: delivery.pricing?.weightCharge || 0,
          temperatureCharge: delivery.pricing?.temperatureCharge || 0,
          fragileCharge: delivery.pricing?.fragileCharge || 0,
          timeBasedCharge: delivery.pricing?.timeBasedCharge || 0,
          totalPrice: delivery.pricing?.totalPrice || 0
        },
        staffDetails: {
          id: delivery.metadata?.orderedBy || delivery.recipient.userId?._id,
          name: delivery.recipient.userId?.name || 'Unknown',
          email: delivery.recipient.userId?.email || 'Unknown'
        },
        deliveryDetails: {
          packageType: delivery.package?.type || 'unknown',
          urgency: delivery.package?.urgency || 'routine',
          weight: delivery.package?.weight || 0,
          deliveredAt: new Date()
        },
        metadata: {
          deliveryType: delivery.metadata?.deliveryType || 'outgoing',
          confirmedBy: session.user.id,
          confirmedAt: new Date()
        }
      });

      console.log('Payment record created:', paymentRecord._id);

      // Process auto-deduction
      try {
        // Get full hospital details
        const hospital = await Hospital.findById(hospitalId);
        
        if (!hospital) {
          console.error('Hospital not found for auto-deduction:', hospitalId);
        } else if (hospital.billing?.autoDeduct && hospital.payment?.isSetup) {
          console.log('Processing auto-deduction for hospital:', hospital.name);
          
          // Use the payment processor
          const paymentResult = await processAutoDeduction(delivery, hospital);
          
          if (paymentResult.success) {
            console.log('Auto-deduction successful:', paymentResult);
            
            // Update payment record with success
            await PaymentHistory.findByIdAndUpdate(paymentRecord._id, {
              status: 'completed',
              razorpayOrderId: paymentResult.orderId,
              'metadata.autoDeductionSuccess': true,
              'metadata.paymentMethod': paymentResult.method
            });
          } else {
            console.log('Auto-deduction failed:', paymentResult.error);
            
            // Update payment record with failure reason
            await PaymentHistory.findByIdAndUpdate(paymentRecord._id, {
              'metadata.autoDeductionFailed': true,
              'metadata.failureReason': paymentResult.error
            });
          }
        } else {
          console.log('Auto-deduction not enabled or payment not setup for hospital');
          
          // Update payment record
          await PaymentHistory.findByIdAndUpdate(paymentRecord._id, {
            'metadata.autoDeductionSkipped': true,
            'metadata.skipReason': !hospital.billing?.autoDeduct ? 'Auto-deduct disabled' : 'Payment not setup'
          });
        }
      } catch (error) {
        console.error('Auto-deduction error:', error);
        
        // Update payment record with error
        await PaymentHistory.findByIdAndUpdate(paymentRecord._id, {
          'metadata.autoDeductionError': true,
          'metadata.errorMessage': error.message
        });
      }

      // Set actual delivery time
      delivery.delivery.actualDeliveryTime = delivery.metadata?.pendingDeliveryTime || new Date();
      
      // Clear pending delivery time
      if (delivery.metadata?.pendingDeliveryTime) {
        delete delivery.metadata.pendingDeliveryTime;
      }

      // Add payment status to delivery
      delivery.metadata.paymentRecordId = paymentRecord._id;
      delivery.metadata.paymentStatus = paymentRecord.status;

      await delivery.save();

      // Send success notifications
      await sendDeliverySuccessNotifications(delivery, session.user);

      // Notify pilot of successful delivery
      if (delivery.pilotId) {
        await Notification.create({
          userId: delivery.pilotId._id || delivery.pilotId,
          type: 'delivery_status',
          title: 'Delivery Confirmed',
          message: `Delivery ${delivery.orderId} has been confirmed as received`,
          data: {
            deliveryId: delivery._id,
            orderId: delivery.orderId,
            confirmedBy: session.user.name
          },
          priority: 'medium',
          actionRequired: false
        });
      }

      return NextResponse.json({ 
        success: true, 
        message: 'Delivery confirmed successfully',
        paymentStatus: paymentRecord.status,
        paymentId: paymentRecord._id
      });
    } else {
      // Delivery not confirmed - revert to in_transit
      delivery.status = 'in_transit';
      delivery.timeline.push({
        status: 'in_transit',
        timestamp: new Date(),
        notes: `Delivery confirmation denied by ${session.user.name}. Reason: ${reason || 'Not specified'}`
      });

      // Clear pending delivery time
      if (delivery.metadata?.pendingDeliveryTime) {
        delete delivery.metadata.pendingDeliveryTime;
      }

      await delivery.save();

      // Notify pilot that delivery was not confirmed
      if (delivery.pilotId) {
        await Notification.create({
          userId: delivery.pilotId._id || delivery.pilotId,
          type: 'urgent_alert',
          title: 'Delivery Not Confirmed',
          message: `Delivery ${delivery.orderId} was not confirmed. Reason: ${reason || 'Not specified'}`,
          data: {
            deliveryId: delivery._id,
            orderId: delivery.orderId,
            deniedBy: session.user.name,
            reason: reason
          },
          priority: 'urgent',
          actionRequired: true
        });
      }

      return NextResponse.json({ 
        success: true, 
        message: 'Delivery confirmation denied' 
      });
    }
  } catch (error) {
    console.error('Error confirming delivery:', error);
    console.error('Error stack:', error.stack);
    
    // Log validation errors if any
    if (error.name === 'ValidationError') {
      console.error('Validation errors:', error.errors);
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to confirm delivery',
        details: error.message
      },
      { status: 500 }
    );
  }
}

async function sendDeliverySuccessNotifications(delivery, confirmedBy) {
  try {
    const notifications = [];

    // Notify system admins
    const admins = await User.find({ role: 'admin', isActive: true });
    for (const admin of admins) {
      notifications.push(
        Notification.create({
          userId: admin._id,
          type: 'delivery_status',
          title: 'Delivery Completed',
          message: `Delivery ${delivery.orderId} has been successfully completed`,
          data: {
            deliveryId: delivery._id,
            orderId: delivery.orderId,
            urgency: delivery.package?.urgency,
            status: 'delivered',
            completedTime: delivery.delivery?.actualDeliveryTime
          },
          priority: 'low',
          actionRequired: false
        })
      );
    }

    // Get hospital ID correctly
    const hospitalId = delivery.metadata?.deliveryType === 'incoming' 
      ? delivery.metadata?.orderingHospital || 
        delivery.recipient?.hospitalId?._id || 
        delivery.recipient?.hospitalId
      : delivery.sender?.hospitalId?._id || 
        delivery.sender?.hospitalId;

    if (hospitalId) {
      const hospitalAdmins = await User.find({
        role: 'hospital_admin',
        hospitalId: hospitalId,
        isActive: true
      });

      for (const admin of hospitalAdmins) {
        notifications.push(
          Notification.create({
            userId: admin._id,
            type: 'delivery_status',
            title: 'Delivery Successfully Completed',
            message: `${delivery.package?.urgency || 'Standard'} delivery ${delivery.orderId} has been delivered`,
            data: {
              deliveryId: delivery._id,
              orderId: delivery.orderId,
              urgency: delivery.package?.urgency,
              status: 'delivered',
              deliveryTime: delivery.delivery?.actualDeliveryTime
            },
            priority: 'low',
            actionRequired: false
          })
        );
      }
    }

    // Notify medical staff (if not the one who confirmed)
    const staffUserId = delivery.metadata?.orderedBy || delivery.sender?.userId?._id || delivery.sender?.userId;
    if (staffUserId && staffUserId.toString() !== confirmedBy._id.toString()) {
      notifications.push(
        Notification.create({
          userId: staffUserId,
          type: 'delivery_status',
          title: 'Delivery Completed Successfully!',
          message: `Your delivery ${delivery.orderId} has been successfully delivered`,
          data: {
            deliveryId: delivery._id,
            orderId: delivery.orderId,
            urgency: delivery.package?.urgency,
            status: 'delivered',
            deliveryTime: delivery.delivery?.actualDeliveryTime
          },
          priority: 'medium',
          actionRequired: false
        })
      );
    }

    await Promise.all(notifications);
    console.log(`Sent ${notifications.length} delivery success notifications`);
  } catch (error) {
    console.error('Error sending success notifications:', error);
  }
}
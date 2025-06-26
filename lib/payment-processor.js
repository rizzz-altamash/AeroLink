// lib/payment-processor.js
import Razorpay from 'razorpay';
import PaymentHistory from '@/models/PaymentHistory';
import Hospital from '@/models/Hospital';
import Notification from '@/models/Notification';
import User from '@/models/User';

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

export async function processAutoDeduction(delivery, hospital) {
  try {
    console.log(`Processing auto-deduction for delivery ${delivery.orderId}`);
    
    // Check if auto-deduct is enabled
    if (!hospital.billing?.autoDeduct) {
      console.log('Auto-deduct is disabled for this hospital');
      return { success: false, error: 'Auto-deduct disabled' };
    }
    
    // Check if payment is already processed
    const existingPayment = await PaymentHistory.findOne({
      deliveryId: delivery._id,
      status: { $in: ['completed', 'processing'] }
    });
    
    if (existingPayment) {
      console.log('Payment already exists for this delivery');
      return { success: false, error: 'Payment already processed' };
    }
    
    // Get default payment method
    const defaultMethod = hospital.payment?.paymentMethods?.find(m => m.isDefault);
    if (!defaultMethod) {
      console.log('No default payment method found');
      await sendPaymentMethodNotification(hospital._id);
      return { success: false, error: 'No default payment method' };
    }
    
    // Create Razorpay order
    const orderOptions = {
      amount: Math.round(delivery.pricing.totalPrice * 100), // Convert to paise
      currency: delivery.pricing.currency || 'INR',
      receipt: `${delivery.orderId}_${Date.now()}`,
      notes: {
        deliveryId: delivery._id.toString(),
        hospitalId: hospital._id.toString(),
        orderId: delivery.orderId,
        packageType: delivery.package.type,
        urgency: delivery.package.urgency
      }
    };
    
    const order = await razorpay.orders.create(orderOptions);
    console.log('Razorpay order created:', order.id);
    
    // Create payment history record
    const paymentRecord = await PaymentHistory.create({
      hospitalId: hospital._id,
      deliveryId: delivery._id,
      orderId: delivery.orderId,
      amount: delivery.pricing.totalPrice,
      currency: delivery.pricing.currency || 'INR',
      status: 'processing',
      razorpayOrderId: order.id,
      priceBreakdown: delivery.pricing.breakdown || {
        basePrice: delivery.pricing.basePrice,
        urgencyCharge: delivery.pricing.urgencyCharge,
        distanceCharge: delivery.pricing.distanceCharge,
        weightCharge: delivery.pricing.weightCharge,
        temperatureCharge: delivery.pricing.temperatureCharge,
        fragileCharge: delivery.pricing.fragileCharge,
        timeBasedCharge: delivery.pricing.timeBasedCharge,
        totalPrice: delivery.pricing.totalPrice
      },
      staffDetails: {
        id: delivery.sender.userId._id,
        name: delivery.sender.userId.name,
        email: delivery.sender.userId.email
      },
      deliveryDetails: {
        packageType: delivery.package.type,
        urgency: delivery.package.urgency,
        weight: delivery.package.weight,
        deliveredAt: delivery.delivery.actualDeliveryTime || new Date()
      },
      metadata: {
        autoDeducted: true,
        processingStartedAt: new Date()
      }
    });
    
    // Process payment based on saved customer and method
    // Note: Actual implementation depends on your Razorpay plan
    // For recurring payments, you typically need:
    // 1. Razorpay Subscriptions API
    // 2. Saved card tokens (requires PCI compliance)
    // 3. Customer consent for auto-debit
    
    // Option 1: Using Razorpay Payment Links (simpler but manual)
    if (process.env.USE_PAYMENT_LINKS === 'true') {
      const paymentLink = await createPaymentLink(order, hospital, delivery);
      await notifyPaymentLink(hospital._id, paymentLink);
      return { 
        success: true, 
        method: 'payment_link',
        paymentLink,
        orderId: order.id 
      };
    }
    
    // Option 2: Direct charge using customer ID (requires additional setup)
    // This is a simplified example - actual implementation needs proper error handling
    try {
      // For UPI or saved cards, you'd typically use tokenization
      // This requires additional Razorpay configuration
      
      // Update hospital billing
      await Hospital.findByIdAndUpdate(hospital._id, {
        $inc: {
          'billing.pendingAmount': delivery.pricing.totalPrice
        }
      });
      
      // Send notification about pending payment
      await notifyPendingPayment(hospital._id, paymentRecord);
      
      return {
        success: true,
        method: 'auto_debit_queued',
        paymentId: paymentRecord._id,
        orderId: order.id,
        amount: delivery.pricing.totalPrice
      };
    } catch (paymentError) {
      console.error('Payment processing error:', paymentError);
      
      // Update payment record
      await PaymentHistory.findByIdAndUpdate(paymentRecord._id, {
        status: 'failed',
        'metadata.failureReason': paymentError.message,
        'metadata.failedAt': new Date()
      });
      
      throw paymentError;
    }
  } catch (error) {
    console.error('Auto-deduction failed:', error);
    
    // Send failure notification
    await notifyPaymentFailure(hospital._id, delivery, error.message);
    
    return {
      success: false,
      error: error.message
    };
  }
}

async function createPaymentLink(order, hospital, delivery) {
  try {
    const paymentLink = await razorpay.paymentLink.create({
      amount: order.amount,
      currency: order.currency,
      accept_partial: false,
      first_min_partial_amount: 0,
      description: `Payment for delivery ${delivery.orderId}`,
      customer: {
        name: hospital.name,
        email: hospital.contactInfo.email,
        contact: hospital.contactInfo.primaryPhone
      },
      notify: {
        sms: true,
        email: true
      },
      reminder_enable: true,
      notes: order.notes,
      callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment-success`,
      callback_method: 'get'
    });
    
    return paymentLink;
  } catch (error) {
    console.error('Failed to create payment link:', error);
    throw error;
  }
}

async function sendPaymentMethodNotification(hospitalId) {
  const admins = await User.find({
    hospitalId,
    role: 'hospital_admin',
    isActive: true
  });
  
  for (const admin of admins) {
    await Notification.create({
      userId: admin._id,
      type: 'urgent_alert',
      title: 'Payment Method Required',
      message: 'Please set up a default payment method to enable automatic payment processing',
      priority: 'urgent',
      actionRequired: true,
      data: {
        action: 'setup_payment_method'
      }
    });
  }
}

async function notifyPaymentLink(hospitalId, paymentLink) {
  const admins = await User.find({
    hospitalId,
    role: 'hospital_admin',
    isActive: true
  });
  
  for (const admin of admins) {
    await Notification.create({
      userId: admin._id,
      type: 'payment_required',
      title: 'Payment Required',
      message: 'A payment link has been generated for a recent delivery. Please complete the payment.',
      priority: 'high',
      actionRequired: true,
      data: {
        paymentLink: paymentLink.short_url,
        amount: paymentLink.amount / 100
      }
    });
  }
}

async function notifyPendingPayment(hospitalId, paymentRecord) {
  const admins = await User.find({
    hospitalId,
    role: 'hospital_admin',
    isActive: true
  });
  
  for (const admin of admins) {
    await Notification.create({
      userId: admin._id,
      type: 'payment_status',
      title: 'Payment Processing',
      message: `Payment of ₹${paymentRecord.amount} for delivery ${paymentRecord.orderId} is being processed`,
      priority: 'medium',
      data: {
        paymentId: paymentRecord._id,
        orderId: paymentRecord.orderId,
        amount: paymentRecord.amount
      }
    });
  }
}

async function notifyPaymentFailure(hospitalId, delivery, errorMessage) {
  const admins = await User.find({
    hospitalId,
    role: 'hospital_admin',
    isActive: true
  });
  
  for (const admin of admins) {
    await Notification.create({
      userId: admin._id,
      type: 'urgent_alert',
      title: 'Payment Failed',
      message: `Auto-deduction failed for delivery ${delivery.orderId}. Error: ${errorMessage}`,
      priority: 'urgent',
      actionRequired: true,
      data: {
        deliveryId: delivery._id,
        orderId: delivery.orderId,
        error: errorMessage
      }
    });
  }
}

// Additional utility functions for payment processing
export async function retryFailedPayment(paymentId) {
  try {
    const payment = await PaymentHistory.findById(paymentId)
      .populate('hospitalId')
      .populate('deliveryId');
    
    if (!payment || payment.status !== 'failed') {
      throw new Error('Invalid payment for retry');
    }
    
    // Retry the payment process
    return processAutoDeduction(payment.deliveryId, payment.hospitalId);
  } catch (error) {
    console.error('Payment retry failed:', error);
    throw error;
  }
}

export async function processManualPayment(paymentId, paymentDetails) {
  try {
    const payment = await PaymentHistory.findById(paymentId);
    
    if (!payment) {
      throw new Error('Payment record not found');
    }
    
    // Update payment with manual payment details
    payment.status = 'completed';
    payment.razorpayPaymentId = paymentDetails.paymentId;
    payment.paymentMethod = {
      type: paymentDetails.method,
      last4: paymentDetails.last4,
      upiId: paymentDetails.upiId
    };
    payment.metadata.manualPayment = true;
    payment.metadata.completedAt = new Date();
    
    await payment.save();
    
    // Update hospital billing
    await Hospital.findByIdAndUpdate(payment.hospitalId, {
      $inc: {
        'billing.totalSpent': payment.amount,
        'billing.pendingAmount': -payment.amount
      }
    });
    
    return { success: true, payment };
  } catch (error) {
    console.error('Manual payment processing failed:', error);
    throw error;
  }
}
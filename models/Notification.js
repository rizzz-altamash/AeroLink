// models/Notification.js
import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['new_delivery', 'delivery_assigned', 'delivery_status', 'system_alert', 'urgent_alert'],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  data: {
    deliveryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Delivery'
    },
    orderId: String,
    urgency: String,
    packageType: String,
    status: String,
    additionalInfo: mongoose.Schema.Types.Mixed
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  read: {
    type: Boolean,
    default: false
  },
  readAt: Date,
  actionRequired: {
    type: Boolean,
    default: false
  },
  actionUrl: String,
  expiresAt: Date
}, {
  timestamps: true
});

// Indexes
NotificationSchema.index({ userId: 1, read: 1, createdAt: -1 });
NotificationSchema.index({ userId: 1, type: 1 });
NotificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Methods
NotificationSchema.methods.markAsRead = async function() {
  this.read = true;
  this.readAt = new Date();
  return this.save();
};

// Static methods
NotificationSchema.statics.createDeliveryNotification = async function(userId, delivery, type = 'new_delivery') {
  const titles = {
    new_delivery: 'New Delivery Order',
    delivery_assigned: 'Delivery Assigned',
    delivery_status: 'Delivery Status Update'
  };

  const messages = {
    new_delivery: `New ${delivery.package.urgency} delivery order ${delivery.orderId} has been created`,
    delivery_assigned: `Delivery ${delivery.orderId} has been assigned to you`,
    delivery_status: `Delivery ${delivery.orderId} status updated to ${delivery.status}`
  };

  const priority = {
    routine: 'medium',
    urgent: 'high',
    emergency: 'urgent'
  };

  return this.create({
    userId,
    type,
    title: titles[type] || 'Notification',
    message: messages[type] || 'You have a new notification',
    data: {
      deliveryId: delivery._id,
      orderId: delivery.orderId,
      urgency: delivery.package.urgency,
      packageType: delivery.package.type,
      status: delivery.status
    },
    priority: priority[delivery.package.urgency] || 'medium',
    actionRequired: type === 'new_delivery' && ['admin', 'pilot'].includes(delivery.package.urgency),
    actionUrl: `/dashboard`
  });
};

NotificationSchema.statics.getUnreadCount = function(userId) {
  return this.countDocuments({ userId, read: false });
};

const Notification = mongoose.models.Notification || mongoose.model('Notification', NotificationSchema);

export default Notification;
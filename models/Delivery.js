// models/Delivery.js
import mongoose from 'mongoose';

const DeliverySchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    unique: true
  },
  sender: {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    hospitalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hospital'
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: [Number]
    }
  },
  recipient: {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    hospitalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hospital'
    },
    name: String,
    phone: String,
    address: String,
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: [Number]
    }
  },
  package: {
    type: {
      type: String,
      enum: ['medication', 'blood', 'organ', 'medical_supplies', 'documents', 'other'],
      required: true
    },
    description: String,
    weight: { type: Number, required: true }, // in grams
    dimensions: {
      length: Number,
      width: Number,
      height: Number
    },
    temperatureControlled: { type: Boolean, default: false },
    temperatureRange: {
      min: Number,
      max: Number
    },
    fragile: { type: Boolean, default: false },
    urgency: {
      type: String,
      enum: ['routine', 'urgent', 'emergency'],
      default: 'routine'
    }
  },
  droneId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Drone'
  },
  pilotId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  status: {
    type: String,
    enum: ['pending', 'pending_approval', 'approved', 'rejected', 'assigned', 'pickup', 'in_transit', 'pending_confirmation', 'delivered', 'failed', 'cancelled'],
    default: 'pending'
  },
  timeline: [{
    status: String,
    timestamp: Date,
    location: {
      type: {
        type: String,
        enum: ['Point']
      },
      coordinates: [Number]
    },
    notes: String
  }],
  flightPath: {
    estimatedDistance: Number, // in meters
    estimatedDuration: Number, // in minutes
    waypoints: [{
      coordinates: [Number],
      altitude: Number
    }]
  },
  tracking: {
    realTimeLocation: {
      type: {
        type: String,
        enum: ['Point']
      },
      coordinates: [Number]
    },
    altitude: Number,
    speed: Number,
    battery: Number,
    lastUpdated: Date
  },
  delivery: {
    scheduledTime: Date,
    actualPickupTime: Date,
    actualDeliveryTime: Date,
    signature: String,
    photo: String,
    feedback: {
      rating: { type: Number, min: 1, max: 5 },
      comment: String
    }
  },
  pricing: {
    basePrice: Number,
    urgencyCharge: Number,
    distanceCharge: Number,
    weightCharge: Number,     // Package weight ka charge
    temperatureCharge: Number,       // New field
    fragileCharge: Number,          // New field
    timeBasedCharge: Number,        // New field
    totalPrice: Number,
    currency: { type: String, default: 'INR' },
    breakdown: mongoose.Schema.Types.Mixed  // Store full breakdown
  },
  metadata: {
    deliveryType: {
      type: String,
      enum: ['incoming', 'outgoing'],
      default: 'outgoing'
    },
    orderedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    orderingHospital: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hospital'
    },
    // Approval workflow fields
    requiresApproval: { type: Boolean, default: true },
    approvalDeadline: Date, // For urgent deliveries - 2 hour deadline
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    approvalTime: Date,
    autoApproved: { type: Boolean, default: false },
    rejectedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rejectionReason: String,
    rejectionTime: Date,
    // Assignment fields
    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    assignmentTime: Date,
    // Other metadata
    weatherConditions: String,
    failureReason: String,
    specialInstructions: String,
    additionalInfo: mongoose.Schema.Types.Mixed
  }
}, {
  timestamps: true
});

// Indexes
DeliverySchema.index({ 'sender.location': '2dsphere' });
DeliverySchema.index({ 'recipient.location': '2dsphere' });
DeliverySchema.index({ 'tracking.realTimeLocation': '2dsphere' });
DeliverySchema.index({ status: 1 });
DeliverySchema.index({ createdAt: -1 });
DeliverySchema.index({ 'sender.userId': 1 });
DeliverySchema.index({ 'recipient.userId': 1 });
DeliverySchema.index({ droneId: 1 });
DeliverySchema.index({ 'metadata.orderedBy': 1 });
DeliverySchema.index({ 'metadata.deliveryType': 1 });
// New indexes for approval workflow
DeliverySchema.index({ 'metadata.requiresApproval': 1 });
DeliverySchema.index({ 'metadata.approvalDeadline': 1 });
DeliverySchema.index({ 'package.urgency': 1, status: 1 });

// Pre-save middleware to generate orderId
DeliverySchema.pre('save', async function(next) {
  if (!this.orderId) {
    const date = new Date();
    const year = date.getFullYear().toString().substr(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const random = Math.random().toString(36).substr(2, 6).toUpperCase();
    this.orderId = `DRN${year}${month}${random}`;
  }
  next();
});

// Methods
DeliverySchema.methods.updateStatus = async function(newStatus, notes = '') {
  this.status = newStatus;
  this.timeline.push({
    status: newStatus,
    timestamp: new Date(),
    location: this.tracking.realTimeLocation,
    notes
  });
  return this.save();
};

// Update the calculatePrice method to use PricingService:
DeliverySchema.methods.calculatePrice = async function() {
  const { PricingService } = require('@/lib/pricing-service');
  
  try {
    const breakdown = await PricingService.calculateDeliveryPrice(this);
    
    this.pricing = {
      basePrice: breakdown.basePrice,
      urgencyCharge: breakdown.urgencyCharge,
      distanceCharge: breakdown.distanceCharge,
      weightCharge: breakdown.weightCharge,
      temperatureCharge: breakdown.temperatureCharge,
      fragileCharge: breakdown.fragileCharge,
      timeBasedCharge: breakdown.timeBasedCharge,
      totalPrice: breakdown.totalPrice,
      currency: 'USD',
      breakdown: breakdown
    };
    
    return this.pricing.totalPrice;
  } catch (error) {
    console.error('Error calculating price:', error);
    // Fallback to simple calculation
    const basePrice = 10;
    const urgencyMultiplier = {
      routine: 1,
      urgent: 1.5,
      emergency: 2
    };
    const distanceRate = 0.002;
    const weightRate = 0.001;
    
    this.pricing.basePrice = basePrice;
    this.pricing.urgencyCharge = basePrice * (urgencyMultiplier[this.package.urgency] - 1);
    this.pricing.distanceCharge = (this.flightPath?.estimatedDistance || 0) * distanceRate;
    this.pricing.weightCharge = (this.package?.weight || 0) * weightRate;
    this.pricing.totalPrice = this.pricing.basePrice + 
                             this.pricing.urgencyCharge + 
                             this.pricing.distanceCharge +
                             this.pricing.weightCharge;
    
    return this.pricing.totalPrice;
  }
};


// New method to check if delivery needs approval
DeliverySchema.methods.needsApproval = function() {
  return this.status === 'pending_approval' && 
         this.metadata.requiresApproval && 
         this.package.urgency !== 'emergency';
};

// New method to check if eligible for auto-approval
DeliverySchema.methods.isEligibleForAutoApproval = function() {
  return this.status === 'pending_approval' && 
         this.package.urgency === 'urgent' && 
         this.metadata.approvalDeadline && 
         new Date() > new Date(this.metadata.approvalDeadline);
};

// Static methods
DeliverySchema.statics.findByDateRange = function(startDate, endDate) {
  return this.find({
    createdAt: {
      $gte: startDate,
      $lte: endDate
    }
  });
};

// New static method to find deliveries pending approval
DeliverySchema.statics.findPendingApproval = function(hospitalId) {
  const query = { status: 'pending_approval' };
  if (hospitalId) {
    query['sender.hospitalId'] = hospitalId;
  }
  return this.find(query).sort({ 'package.urgency': -1, createdAt: -1 });
};

// New static method to find deliveries needing pilot assignment
DeliverySchema.statics.findNeedingAssignment = function() {
  return this.find({ 
    status: 'approved',
    pilotId: { $exists: false }
  }).sort({ 'package.urgency': -1, createdAt: -1 });
};

const Delivery = mongoose.models.Delivery || mongoose.model('Delivery', DeliverySchema);

export default Delivery;
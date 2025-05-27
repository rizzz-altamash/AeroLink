// models/Hospital.js
import mongoose from 'mongoose';

const HospitalSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  registrationNumber: {
    type: String,
    required: true,
    unique: true
  },
  type: {
    type: String,
    enum: ['general', 'specialized', 'clinic', 'emergency'],
    required: true
  },
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    country: { type: String, required: true },
    coordinates: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number],
        required: true
        // default: [0, 0]
      }
    }
  },
  contactInfo: {
    primaryPhone: { type: String, required: true },
    emergencyPhone: String,
    email: { type: String,  }, // required: true
    website: String
  },
  deliveryZones: [{
    name: String,
    coordinates: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: [Number]
    },
    landingPadId: String,
    restrictions: [String],
    operatingHours: {
      start: String,
      end: String
    }
  }],
  verificationStatus: {
    type: String,
    enum: ['pending', 'verified', 'suspended'],
    default: 'pending'
  },
  verificationDocuments: [{
    type: String,
    url: String,
    uploadedAt: Date,
    verifiedAt: Date
  }],
  subscription: {
    plan: {
      type: String,
      enum: ['basic', 'premium', 'enterprise'],
      default: 'basic'
    },
    startDate: Date,
    endDate: Date,
    isActive: { type: Boolean, default: true }
  },
  settings: {
    autoApproveDeliveries: { type: Boolean, default: false },
    maxDailyDeliveries: { type: Number, default: 50 },
    priorityDeliveryEnabled: { type: Boolean, default: true },
    allowedDeliveryTypes: [{
      type: String,
      enum: ['medications', 'blood', 'organs', 'medical_supplies', 'documents']
    }]
  },
  stats: {
    totalDeliveries: { type: Number, default: 0 },
    successfulDeliveries: { type: Number, default: 0 },
    averageDeliveryTime: { type: Number, default: 0 }
  }
}, {
  timestamps: true
});

// Indexes
HospitalSchema.index({ 'address.coordinates': '2dsphere' });
HospitalSchema.index({ 'deliveryZones.coordinates': '2dsphere' });
// HospitalSchema.index({ registrationNumber: 1 });
HospitalSchema.index({ verificationStatus: 1 });

// Virtual for success rate
HospitalSchema.virtual('successRate').get(function() {
  if (this.stats.totalDeliveries === 0) return 0;
  return (this.stats.successfulDeliveries / this.stats.totalDeliveries * 100).toFixed(2);
});

// Methods
HospitalSchema.methods.canAcceptDelivery = function(deliveryType) {
  return this.settings.allowedDeliveryTypes.includes(deliveryType) && 
         this.verificationStatus === 'verified' &&
         this.subscription.isActive;
};

HospitalSchema.methods.updateDeliveryStats = async function(success) {
  this.stats.totalDeliveries += 1;
  if (success) {
    this.stats.successfulDeliveries += 1;
  }
  return this.save();
};

const Hospital = mongoose.models.Hospital || mongoose.model('Hospital', HospitalSchema);

export default Hospital;
// models/PricingConfig.js
import mongoose from 'mongoose';

const PricingConfigSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    unique: true,
    default: 'default' 
  },
  description: {
    type: String,
    default: 'Default pricing configuration'
  },
  
  // Base pricing
  basePrice: { 
    type: Number, 
    required: true,
    default: 10,
    min: 0
  },
  currency: {
    type: String,
    default: 'USD',
    enum: ['USD', 'INR', 'EUR', 'GBP']
  },
  
  // Urgency multipliers
  urgencyMultipliers: {
    routine: { 
      type: Number, 
      default: 1,
      min: 1 
    },
    urgent: { 
      type: Number, 
      default: 1.5,
      min: 1 
    },
    emergency: { 
      type: Number, 
      default: 2,
      min: 1 
    }
  },
  
  // Distance and weight rates
  distanceRate: { 
    type: Number, 
    default: 0.002, // per meter
    min: 0
  },
  weightRate: { 
    type: Number, 
    default: 0.001, // per gram
    min: 0
  },
  
  // Additional charges
  temperatureControlledCharge: { 
    type: Number, 
    default: 5,
    min: 0
  },
  fragileHandlingCharge: { 
    type: Number, 
    default: 3,
    min: 0
  },
  
  // Time-based charges
  peakHourMultiplier: { 
    type: Number, 
    default: 1.1,
    min: 1
  },
  peakHours: {
    start: { type: Number, default: 9 }, // 9 AM
    end: { type: Number, default: 18 }   // 6 PM
  },
  nightDeliveryCharge: { 
    type: Number, 
    default: 5,
    min: 0
  },
  weekendMultiplier: {
    type: Number,
    default: 1.1,
    min: 1
  },
  
  // Weight brackets (optional advanced pricing)
  weightBrackets: [{
    minWeight: { type: Number, default: 0 },      // grams
    maxWeight: { type: Number, default: 1000 },   // grams
    rate: { type: Number, default: 0.001 }       // per gram
  }],
  
  // Distance brackets (optional advanced pricing)
  distanceBrackets: [{
    minDistance: { type: Number, default: 0 },      // meters
    maxDistance: { type: Number, default: 5000 },   // meters
    rate: { type: Number, default: 0.002 }         // per meter
  }],
  
  // Status
  isActive: { 
    type: Boolean, 
    default: false 
  },
  isDefault: {
    type: Boolean,
    default: false
  },
  
  // Metadata
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    // required: true
  },
  lastModifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  effectiveFrom: {
    type: Date,
    default: Date.now
  },
  effectiveTo: {
    type: Date
  }
}, {
  timestamps: true
});

// Indexes
PricingConfigSchema.index({ isActive: 1 });
// PricingConfigSchema.index({ name: 1 });
PricingConfigSchema.index({ effectiveFrom: 1, effectiveTo: 1 });

// Methods
PricingConfigSchema.methods.activate = async function() {
  // Deactivate all other configs
  await this.constructor.updateMany(
    { _id: { $ne: this._id } }, 
    { isActive: false }
  );
  
  // Activate this config
  this.isActive = true;
  return this.save();
};

PricingConfigSchema.methods.calculatePrice = function(deliveryData) {
  const {
    urgency = 'routine',
    distance = 0,
    weight = 0,
    temperatureControlled = false,
    fragile = false,
    scheduledTime
  } = deliveryData;

  let totalPrice = this.basePrice;
  let breakdown = {
    basePrice: this.basePrice,
    urgencyCharge: 0,
    distanceCharge: 0,
    weightCharge: 0,
    temperatureCharge: 0,
    fragileCharge: 0,
    timeBasedCharge: 0,
    totalPrice: 0
  };

  // Urgency charge
  const urgencyMultiplier = this.urgencyMultipliers[urgency] || 1;
  breakdown.urgencyCharge = this.basePrice * (urgencyMultiplier - 1);
  totalPrice += breakdown.urgencyCharge;

  // Distance charge
  if (this.distanceBrackets && this.distanceBrackets.length > 0) {
    // Use bracket-based pricing
    let remainingDistance = distance;
    for (const bracket of this.distanceBrackets) {
      if (remainingDistance <= 0) break;
      
      const bracketDistance = Math.min(
        remainingDistance, 
        bracket.maxDistance - bracket.minDistance
      );
      breakdown.distanceCharge += bracketDistance * bracket.rate;
      remainingDistance -= bracketDistance;
    }
  } else {
    // Simple rate
    breakdown.distanceCharge = distance * this.distanceRate;
  }
  totalPrice += breakdown.distanceCharge;

  // Weight charge
  if (this.weightBrackets && this.weightBrackets.length > 0) {
    // Use bracket-based pricing
    const bracket = this.weightBrackets.find(
      b => weight >= b.minWeight && weight <= b.maxWeight
    );
    if (bracket) {
      breakdown.weightCharge = weight * bracket.rate;
    } else {
      // Use highest bracket rate for overweight
      const highestBracket = this.weightBrackets[this.weightBrackets.length - 1];
      breakdown.weightCharge = weight * highestBracket.rate;
    }
  } else {
    // Simple rate
    breakdown.weightCharge = weight * this.weightRate;
  }
  totalPrice += breakdown.weightCharge;

  // Temperature controlled charge
  if (temperatureControlled) {
    breakdown.temperatureCharge = this.temperatureControlledCharge;
    totalPrice += breakdown.temperatureCharge;
  }

  // Fragile handling charge
  if (fragile) {
    breakdown.fragileCharge = this.fragileHandlingCharge;
    totalPrice += breakdown.fragileCharge;
  }

  // Time-based charges
  if (scheduledTime) {
    const deliveryDate = new Date(scheduledTime);
    const hour = deliveryDate.getHours();
    const day = deliveryDate.getDay();

    // Peak hour charge
    if (hour >= this.peakHours.start && hour <= this.peakHours.end) {
      const peakCharge = totalPrice * (this.peakHourMultiplier - 1);
      breakdown.timeBasedCharge += peakCharge;
      totalPrice += peakCharge;
    }

    // Night delivery charge
    if (hour < 6 || hour > 22) {
      breakdown.timeBasedCharge += this.nightDeliveryCharge;
      totalPrice += this.nightDeliveryCharge;
    }

    // Weekend charge
    if (day === 0 || day === 6) { // Sunday or Saturday
      const weekendCharge = totalPrice * (this.weekendMultiplier - 1);
      breakdown.timeBasedCharge += weekendCharge;
      totalPrice += weekendCharge;
    }
  }

  breakdown.totalPrice = Math.round(totalPrice * 100) / 100; // Round to 2 decimals

  return breakdown;
};

// Static methods
PricingConfigSchema.statics.getActiveConfig = async function() {
  let config = await this.findOne({ isActive: true });
  
  // If no active config, get default
  if (!config) {
    config = await this.findOne({ isDefault: true });
  }
  
  // If still no config, create default
  if (!config) {
    config = await this.createDefaultConfig();
  }
  
  return config;
};

PricingConfigSchema.statics.createDefaultConfig = async function() {
  return this.create({
    name: 'default',
    description: 'System default pricing configuration',
    isActive: true,
    isDefault: true,
    createdBy: null // System created
  });
};

const PricingConfig = mongoose.models.PricingConfig || mongoose.model('PricingConfig', PricingConfigSchema);

export default PricingConfig;
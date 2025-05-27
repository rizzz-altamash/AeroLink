// models/Drone.js
import mongoose from 'mongoose';

const DroneSchema = new mongoose.Schema({
  registrationId: {
    type: String,
    required: true,
    unique: true
  },
  model: {
    type: String,
    required: true
  },
  manufacturer: String,
  type: {
    type: String,
    enum: ['fixed_wing_vtol', 'quadcopter', 'hexacopter'],
    default: 'fixed_wing_vtol'
  },
  specifications: {
    maxPayload: Number, // in grams
    maxRange: Number, // in km
    maxAltitude: Number, // in meters
    cruiseSpeed: Number, // in km/h
    batteryCapacity: Number, // in mAh
    flightTime: Number // in minutes
  },
  status: {
    type: String,
    enum: ['available', 'in_flight', 'maintenance', 'charging', 'offline'],
    default: 'available'
  },
  currentLocation: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: [Number]
  },
  homeBase: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hospital'
  },
  health: {
    batteryLevel: { type: Number, default: 100 },
    lastMaintenance: Date,
    nextMaintenance: Date,
    flightHours: { type: Number, default: 0 },
    totalDeliveries: { type: Number, default: 0 }
  },
  sensors: {
    gps: { type: Boolean, default: true },
    camera: { type: Boolean, default: true },
    lidar: { type: Boolean, default: true },
    temperatureSensor: { type: Boolean, default: true }
  },
  certifications: [{
    type: String,
    issuedBy: String,
    issuedDate: Date,
    expiryDate: Date
  }],
  currentDelivery: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Delivery'
  },
  maintenanceLog: [{
    date: Date,
    type: String,
    description: String,
    technician: String,
    cost: Number
  }]
}, {
  timestamps: true
});

// Indexes
DroneSchema.index({ 'currentLocation': '2dsphere' });
DroneSchema.index({ status: 1 });
DroneSchema.index({ homeBase: 1 });
DroneSchema.index({ registrationId: 1 });

// Virtual for maintenance due
DroneSchema.virtual('maintenanceDue').get(function() {
  if (!this.health.nextMaintenance) return false;
  return new Date() > new Date(this.health.nextMaintenance);
});

// Methods
DroneSchema.methods.canAcceptDelivery = function(delivery) {
  return this.status === 'available' &&
         this.health.batteryLevel > 20 &&
         !this.maintenanceDue &&
         this.specifications.maxPayload >= delivery.package.weight;
};

DroneSchema.methods.updateBatteryLevel = function(level) {
  this.health.batteryLevel = level;
  if (level < 20) {
    this.status = 'charging';
  }
  return this.save();
};

DroneSchema.methods.startDelivery = async function(deliveryId) {
  this.status = 'in_flight';
  this.currentDelivery = deliveryId;
  return this.save();
};

DroneSchema.methods.completeDelivery = async function() {
  this.status = 'available';
  this.currentDelivery = null;
  this.health.totalDeliveries += 1;
  this.health.flightHours += 0.5; // Approximate
  return this.save();
};

// Static methods
DroneSchema.statics.findAvailable = function() {
  return this.find({
    status: 'available',
    'health.batteryLevel': { $gt: 20 }
  });
};

DroneSchema.statics.findNearLocation = function(coordinates, maxDistance = 50000) { // 50km default
  return this.find({
    status: 'available',
    currentLocation: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: coordinates
        },
        $maxDistance: maxDistance
      }
    }
  });
};

const Drone = mongoose.models.Drone || mongoose.model('Drone', DroneSchema);

export default Drone;
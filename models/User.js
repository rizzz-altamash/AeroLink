// models/User.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: function() {
      return !this.provider; // Password not required for OAuth users
    }
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    enum: ['admin', 'hospital_admin', 'medical_staff', 'customer', 'pilot'],
    default: 'customer'
  },
  userType: {
    type: String,
    enum: ['individual', 'hospital', 'business'],
    required: true
  },
  hospitalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hospital',
    required: function() {
      return this.userType === 'hospital';
    }
  },
  phoneNumber: {
    type: String,
    required: true
  },
  emailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: String,
  emailVerificationExpires: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  isActive: {
    type: Boolean,
    default: true
  },
  provider: {
    type: String,
    enum: ['credentials', 'google', 'github'],
    default: 'credentials'
  },
  providerId: String,
  profileImage: String,
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
    coordinates: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number],
        default: [0, 0]
      }
    }
  },
  preferences: {
    notifications: {
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: true },
      push: { type: Boolean, default: true }
    },
    deliveryUpdates: { type: Boolean, default: true }
  },
  metadata: {
    lastLogin: Date,
    loginCount: { type: Number, default: 0 },
    registrationIP: String,
    lastIP: String
  }
}, {
  timestamps: true
});

// Indexes
UserSchema.index({ 'address.coordinates': '2dsphere' }); // geospatial index
// UserSchema.index({ email: 1 });
UserSchema.index({ role: 1 });
UserSchema.index({ hospitalId: 1 });

// Virtual for full address
UserSchema.virtual('fullAddress').get(function() {
  if (!this.address.street) return '';
  return `${this.address.street}, ${this.address.city}, ${this.address.state} ${this.address.zipCode}, ${this.address.country}`;
});

// Methods
UserSchema.methods.comparePassword = async function(candidatePassword) {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

UserSchema.methods.generatePasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  this.passwordResetExpires = Date.now() + 60 * 60 * 1000; // 1 hour
  return resetToken;
};

// Static methods
UserSchema.statics.findByEmail = function(email) {
  return this.findOne({ email: email.toLowerCase() });
};

// Don't recreate model if it already exists (important for Next.js)
const User = mongoose.models.User || mongoose.model('User', UserSchema);

export default User;
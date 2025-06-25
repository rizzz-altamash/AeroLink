// scripts/setup-pricing.js
// Run this script to create initial pricing configuration
// Usage: node scripts/setup-pricing.js

import mongoose from 'mongoose';
import PricingConfig from '../models/PricingConfig.js';
import dotenv from 'dotenv';

dotenv.config();

async function setupInitialPricing() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if default config exists
    const existingConfig = await PricingConfig.findOne({ name: 'default' });
    
    if (existingConfig) {
      console.log('Default pricing configuration already exists');
      return;
    }

    // Create default pricing configuration
    const defaultConfig = await PricingConfig.create({
      name: 'default',
      description: 'Default pricing configuration for deliveries',
      basePrice: 500,
      currency: 'INR',
      urgencyMultipliers: {
        routine: 1,
        urgent: 1.5,
        emergency: 2
      },
      distanceRate: 0.15,      // ₹ 0.15 per meter
      weightRate: 0.05,        // ₹ 0.05 per gram
      temperatureControlledCharge: 300,
      fragileHandlingCharge: 200,
      peakHourMultiplier: 1.2,
      peakHours: {
        start: 9,
        end: 18
      },
      nightDeliveryCharge: 150,
      weekendMultiplier: 1.1,
      isActive: true,
      isDefault: true,
      effectiveFrom: new Date()
    });

    console.log('Default pricing configuration created successfully');
    console.log('Configuration details:');
    console.log('- Base Price: ₹' + defaultConfig.basePrice);
    console.log('- Distance Rate: ₹' + defaultConfig.distanceRate + ' per meter');
    console.log('- Weight Rate: ₹' + defaultConfig.weightRate + ' per gram');
    console.log('- Urgency Multipliers:');
    console.log('  - Routine: ' + defaultConfig.urgencyMultipliers.routine + 'x');
    console.log('  - Urgent: ' + defaultConfig.urgencyMultipliers.urgent + 'x');
    console.log('  - Emergency: ' + defaultConfig.urgencyMultipliers.emergency + 'x');

    // Create a sample alternative configuration (inactive)
    const holidayConfig = await PricingConfig.create({
      name: 'holiday-season-2025',
      description: 'Special pricing for holiday season with increased rates',
      basePrice: 700,
      currency: 'INR',
      urgencyMultipliers: {
        routine: 1,
        urgent: 1.75,
        emergency: 2.5
      },
      distanceRate: 0.20,
      weightRate: 0.05,
      temperatureControlledCharge: 350,
      fragileHandlingCharge: 250,
      peakHourMultiplier: 1.5,
      peakHours: {
        start: 8,
        end: 20
      },
      nightDeliveryCharge: 200,
      weekendMultiplier: 1.25,
      isActive: false,
      isDefault: false,
      effectiveFrom: new Date('2024-12-01'),
      effectiveTo: new Date('2025-01-15')
    });

    console.log('\nHoliday season configuration created (inactive)');

  } catch (error) {
    console.error('Error setting up pricing:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  }
}

// Run the setup
// setupInitialPricing();
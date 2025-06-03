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
      description: 'Default pricing configuration for Vaayu deliveries',
      basePrice: 10,
      currency: 'USD',
      urgencyMultipliers: {
        routine: 1,
        urgent: 1.5,
        emergency: 2
      },
      distanceRate: 0.002,      // $0.002 per meter
      weightRate: 0.001,        // $0.001 per gram
      temperatureControlledCharge: 5,
      fragileHandlingCharge: 3,
      peakHourMultiplier: 1.2,
      peakHours: {
        start: 9,
        end: 18
      },
      nightDeliveryCharge: 5,
      weekendMultiplier: 1.1,
      isActive: true,
      isDefault: true,
      effectiveFrom: new Date()
    });

    console.log('Default pricing configuration created successfully');
    console.log('Configuration details:');
    console.log('- Base Price: $' + defaultConfig.basePrice);
    console.log('- Distance Rate: $' + defaultConfig.distanceRate + ' per meter');
    console.log('- Weight Rate: $' + defaultConfig.weightRate + ' per gram');
    console.log('- Urgency Multipliers:');
    console.log('  - Routine: ' + defaultConfig.urgencyMultipliers.routine + 'x');
    console.log('  - Urgent: ' + defaultConfig.urgencyMultipliers.urgent + 'x');
    console.log('  - Emergency: ' + defaultConfig.urgencyMultipliers.emergency + 'x');

    // Create a sample alternative configuration (inactive)
    const holidayConfig = await PricingConfig.create({
      name: 'holiday-season-2024',
      description: 'Special pricing for holiday season with increased rates',
      basePrice: 12,
      currency: 'USD',
      urgencyMultipliers: {
        routine: 1,
        urgent: 1.75,
        emergency: 2.5
      },
      distanceRate: 0.0025,
      weightRate: 0.0012,
      temperatureControlledCharge: 7,
      fragileHandlingCharge: 5,
      peakHourMultiplier: 1.5,
      peakHours: {
        start: 8,
        end: 20
      },
      nightDeliveryCharge: 8,
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
setupInitialPricing();
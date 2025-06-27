import dotenv from 'dotenv';
dotenv.config();

console.log('MONGODB_URI:', process.env.MONGODB_URI);  // ✅ Debug

import { connectDB } from './lib/mongodb.js';
import PricingConfig from './models/PricingConfig.js';

async function test() {
  await connectDB();
  const config = await PricingConfig.getActiveConfig();

  console.log('✔️ Type of config.calculatePrice:', typeof config?.calculatePrice);

  const breakdown = config.calculatePrice({
    urgency: 'urgent',
    distance: 10000,
    weight: 500,
    temperatureControlled: true,
    fragile: true,
    scheduledTime: new Date()
  });

  console.log('💰 Price breakdown:', breakdown);
}

test();
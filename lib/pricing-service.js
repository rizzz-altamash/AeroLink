// lib/pricing-service.js
import PricingConfig from '@/models/PricingConfig';
import { connectDB } from '@/lib/mongodb';

class PricingService {
  static async calculateDeliveryPrice(deliveryData) {
    await connectDB();
    
    // Get active pricing configuration
    const config = await PricingConfig.getActiveConfig();
    
    if (!config) {
      throw new Error('No active pricing configuration found');
    }

    // Extract delivery details
    const {
      package: pkg,
      flightPath,
      delivery: deliveryInfo
    } = deliveryData;

    // Prepare data for calculation
    const calculationData = {
      urgency: pkg?.urgency || 'routine',
      distance: flightPath?.estimatedDistance || 0,
      weight: pkg?.weight || 0,
      temperatureControlled: pkg?.temperatureControlled || false,
      fragile: pkg?.fragile || false,
      scheduledTime: deliveryInfo?.scheduledTime || null
    };

    // Calculate price using config method
    return config.calculatePrice(calculationData);
  }

  static async getActivePricingConfig() {
    await connectDB();
    return PricingConfig.getActiveConfig();
  }

  static async createPricingConfig(configData, userId) {
    await connectDB();
    
    const config = await PricingConfig.create({
      ...configData,
      createdBy: userId,
      isActive: false // Don't activate immediately
    });

    return config;
  }

  static async updatePricingConfig(configId, updates, userId) {
    await connectDB();
    
    const config = await PricingConfig.findByIdAndUpdate(
      configId,
      {
        ...updates,
        lastModifiedBy: userId
      },
      { new: true }
    );

    return config;
  }

  static async activatePricingConfig(configId) {
    await connectDB();
    
    const config = await PricingConfig.findById(configId);
    if (!config) {
      throw new Error('Pricing configuration not found');
    }

    return config.activate();
  }

  static async getPricingHistory(limit = 10) {
    await connectDB();
    
    return PricingConfig.find()
      .populate('createdBy', 'name email')
      .populate('lastModifiedBy', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit);
  }

  static async calculatePricePreview(configId, sampleDeliveries) {
    await connectDB();
    
    const config = await PricingConfig.findById(configId);
    if (!config) {
      throw new Error('Pricing configuration not found');
    }

    const previews = sampleDeliveries.map(delivery => {
      const price = config.calculatePrice(delivery);
      return {
        scenario: delivery.scenario || 'Sample',
        ...delivery,
        pricing: price
      };
    });

    return previews;
  }

  // Helper method to get price breakdown for display
  static formatPriceBreakdown(breakdown) {
    const items = [
      { label: 'Base Price', value: breakdown.basePrice, always: true },
      { label: 'Urgency Charge', value: breakdown.urgencyCharge },
      { label: 'Distance Charge', value: breakdown.distanceCharge },
      { label: 'Weight Charge', value: breakdown.weightCharge },
      { label: 'Temperature Control', value: breakdown.temperatureCharge },
      { label: 'Fragile Handling', value: breakdown.fragileCharge },
      { label: 'Time-based Charges', value: breakdown.timeBasedCharge }
    ];

    return items
      .filter(item => item.always || item.value > 0)
      .map(item => ({
        ...item,
        value: `₹${item.value.toFixed(2)}`
      }));
  }

  // Get pricing estimates for different scenarios
  static async getPricingEstimates() {
    await connectDB();
    
    const config = await PricingConfig.getActiveConfig();
    if (!config) {
      throw new Error('No active pricing configuration found');
    }

    const scenarios = [
      {
        name: 'Routine Local',
        urgency: 'routine',
        distance: 5000,  // 5km
        weight: 500      // 500g
      },
      {
        name: 'Urgent Medium',
        urgency: 'urgent',
        distance: 15000, // 15km
        weight: 1000     // 1kg
      },
      {
        name: 'Emergency Long',
        urgency: 'emergency',
        distance: 30000, // 30km
        weight: 2000     // 2kg
      }
    ];

    return scenarios.map(scenario => ({
      ...scenario,
      price: config.calculatePrice(scenario).totalPrice
    }));
  }
}

export default PricingService;
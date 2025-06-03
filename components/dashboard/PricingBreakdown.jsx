// components/dashboard/PricingBreakdown.jsx
import { useState, useEffect } from 'react';

// Component to display pricing breakdown in delivery creation
export default function PricingBreakdown({ deliveryData, className = '' }) {
  const [pricing, setPricing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [effectiveDeliveryTime, setEffectiveDeliveryTime] = useState(new Date());
  const [config, setConfig] = useState({
    basePrice: 10,
    urgencyMultipliers: {
      routine: 1,
      urgent: 1.5,
      emergency: 2
    },
    distanceRate: 0.002,
    weightRate: 0.001,
    temperatureControlledCharge: 5,
    fragileHandlingCharge: 3,
    peakHourMultiplier: 1.2,
    peakHours: { start: 9, end: 18 },
    nightDeliveryCharge: 5,
    weekendMultiplier: 1.1
  });

  useEffect(() => {
    // Set effective delivery time
    if (deliveryData?.scheduledTime) {
      // Use scheduled time if provided
      setEffectiveDeliveryTime(new Date(deliveryData.scheduledTime));
    } else {
      // Use current time + estimated delivery time based on urgency
      const now = new Date();
      const estimatedMinutes = {
        routine: 120,    // 2 hours
        urgent: 60,      // 1 hour
        emergency: 30    // 30 minutes
      };
      
      const urgency = deliveryData?.package?.urgency || 'routine';
      const deliveryTime = new Date(now.getTime() + estimatedMinutes[urgency] * 60000);
      setEffectiveDeliveryTime(deliveryTime);
    }
  }, [deliveryData?.scheduledTime, deliveryData?.package?.urgency]);

  useEffect(() => {
    if (deliveryData?.package?.weight && deliveryData?.package?.urgency) {
      calculatePricing();
    }
  }, [
    deliveryData?.package?.weight,
    deliveryData?.package?.urgency,
    deliveryData?.package?.temperatureControlled,
    deliveryData?.package?.fragile,
    deliveryData?.flightPath?.estimatedDistance,
    effectiveDeliveryTime
  ]);

  const calculatePricing = async () => {
    setLoading(true);
    try {
      const urgency = deliveryData.package.urgency || 'routine';
      const weight = deliveryData.package.weight || 0;
      const distance = deliveryData.flightPath?.estimatedDistance || 0;

      const breakdown = {
        basePrice: config.basePrice,
        urgencyCharge: config.basePrice * (config.urgencyMultipliers[urgency] - 1),
        distanceCharge: distance * config.distanceRate,
        weightCharge: weight * config.weightRate,
        temperatureCharge: deliveryData.package.temperatureControlled ? config.temperatureControlledCharge : 0,
        fragileCharge: deliveryData.package.fragile ? config.fragileHandlingCharge : 0,
        peakHourCharge: 0,
        nightDeliveryCharge: 0,
        weekendCharge: 0,
        totalPrice: 0
      };

      // Calculate time-based charges using effective delivery time
      const hour = effectiveDeliveryTime.getHours();
      const day = effectiveDeliveryTime.getDay();

      // Calculate subtotal before time-based multipliers
      const subtotal = breakdown.basePrice + breakdown.urgencyCharge + 
                      breakdown.distanceCharge + breakdown.weightCharge + 
                      breakdown.temperatureCharge + breakdown.fragileCharge;

      // Peak hour charge (9 AM - 6 PM, excluding 6 PM)
      if (hour >= config.peakHours.start && hour < config.peakHours.end) {
        breakdown.peakHourCharge = subtotal * (config.peakHourMultiplier - 1);
      }

      // Night delivery charge (before 6 AM or from 10 PM onwards)
      if (hour < 6 || hour >= 22) {
        breakdown.nightDeliveryCharge = config.nightDeliveryCharge;
      }

      // Weekend charge (Saturday or Sunday)
      if (day === 0 || day === 6) {
        breakdown.weekendCharge = subtotal * (config.weekendMultiplier - 1);
      }

      breakdown.totalPrice = 
        breakdown.basePrice +
        breakdown.urgencyCharge +
        breakdown.distanceCharge +
        breakdown.weightCharge +
        breakdown.temperatureCharge +
        breakdown.fragileCharge +
        breakdown.peakHourCharge +
        breakdown.nightDeliveryCharge +
        breakdown.weekendCharge;

      setPricing(breakdown);
    } catch (error) {
      console.error('Error calculating pricing:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDeliveryTime = () => {
    const hour = effectiveDeliveryTime.getHours();
    const day = effectiveDeliveryTime.getDay();
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    let timeDescription = '';
    let timeColor = 'text-gray-400';
    
    // Time of day description
    if (hour < 6 || hour >= 22) {
      timeDescription = 'Night delivery';
      timeColor = 'text-indigo-400';
    } else if (hour >= config.peakHours.start && hour < config.peakHours.end) {
      timeDescription = 'Peak hours';
      timeColor = 'text-red-400';
    } else {
      timeDescription = 'Regular hours';
      timeColor = 'text-green-400';
    }
    
    // Weekend check
    if (day === 0 || day === 6) {
      timeDescription += ' • Weekend';
      timeColor = 'text-pink-400';
    }
    
    const isScheduled = !!deliveryData?.scheduledTime;
    const timeString = effectiveDeliveryTime.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
    
    return {
      dayName: dayNames[day],
      timeString,
      description: timeDescription,
      color: timeColor,
      isScheduled,
      fullString: `${dayNames[day]}, ${timeString} (${timeDescription})`
    };
  };

  if (!pricing || loading) return null;

  const timeInfo = formatDeliveryTime();

  return (
    <div className={`bg-gray-800/50 rounded-xl p-4 ${className}`}>
      <h4 className="text-white font-medium mb-3 flex items-center gap-2">
        <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Estimated Pricing
      </h4>

      {/* Delivery time info */}
      <div className="mb-3 p-2 bg-gray-700/50 rounded-lg">
        <div className="flex items-center justify-between mb-1">
          <p className="text-xs text-gray-400">
            {timeInfo.isScheduled ? 'Scheduled Delivery:' : 'Estimated Delivery:'}
          </p>
          {!timeInfo.isScheduled && (
            <span className="text-xs text-gray-500">
              (Based on {deliveryData?.package?.urgency || 'routine'} priority)
            </span>
          )}
        </div>
        <p className={`text-sm font-medium ${timeInfo.color}`}>
          {timeInfo.dayName}, {timeInfo.timeString}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          {timeInfo.description}
        </p>
      </div>
      
      <div className="space-y-2 text-sm">
        {/* Base charges */}
        <div className="flex justify-between">
          <span className="text-gray-400">Base Price</span>
          <span className="text-white">${pricing.basePrice.toFixed(2)}</span>
        </div>
        
        {pricing.urgencyCharge > 0 && (
          <div className="flex justify-between">
            <span className="text-gray-400">Urgency Charge ({deliveryData.package.urgency})</span>
            <span className="text-orange-400">+${pricing.urgencyCharge.toFixed(2)}</span>
          </div>
        )}
        
        {pricing.distanceCharge > 0 && (
          <div className="flex justify-between">
            <span className="text-gray-400">Distance Charge</span>
            <span className="text-blue-400">+${pricing.distanceCharge.toFixed(2)}</span>
          </div>
        )}
        
        {pricing.weightCharge > 0 && (
          <div className="flex justify-between">
            <span className="text-gray-400">Weight Charge ({deliveryData.package.weight}g)</span>
            <span className="text-purple-400">+${pricing.weightCharge.toFixed(2)}</span>
          </div>
        )}
        
        {pricing.temperatureCharge > 0 && (
          <div className="flex justify-between">
            <span className="text-gray-400">Temperature Control</span>
            <span className="text-cyan-400">+${pricing.temperatureCharge.toFixed(2)}</span>
          </div>
        )}
        
        {pricing.fragileCharge > 0 && (
          <div className="flex justify-between">
            <span className="text-gray-400">Fragile Handling</span>
            <span className="text-yellow-400">+${pricing.fragileCharge.toFixed(2)}</span>
          </div>
        )}

        {/* Time-based charges separator */}
        {(pricing.peakHourCharge > 0 || pricing.nightDeliveryCharge > 0 || pricing.weekendCharge > 0) && (
          <div className="pt-2 mt-2 border-t border-gray-700">
            <p className="text-xs text-gray-500 mb-2">Time-based charges:</p>
          </div>
        )}

        {/* Time-based charges */}
        {pricing.peakHourCharge > 0 && (
          <div className="flex justify-between">
            <span className="text-gray-400">
              Peak Hour Charge 
              <span className="text-xs"> ({config.peakHourMultiplier}x)</span>
            </span>
            <span className="text-red-400">+${pricing.peakHourCharge.toFixed(2)}</span>
          </div>
        )}
        
        {pricing.nightDeliveryCharge > 0 && (
          <div className="flex justify-between">
            <span className="text-gray-400">Night Delivery Charge</span>
            <span className="text-indigo-400">+${pricing.nightDeliveryCharge.toFixed(2)}</span>
          </div>
        )}
        
        {pricing.weekendCharge > 0 && (
          <div className="flex justify-between">
            <span className="text-gray-400">
              Weekend Charge
              <span className="text-xs"> ({config.weekendMultiplier}x)</span>
            </span>
            <span className="text-pink-400">+${pricing.weekendCharge.toFixed(2)}</span>
          </div>
        )}
        
        {/* Total */}
        <div className="pt-2 mt-2 border-t border-gray-700">
          <div className="flex justify-between items-center">
            <span className="text-white font-medium">Total Estimate</span>
            <span className="text-xl font-bold text-green-400">
              ${pricing.totalPrice.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
      
      <div className="mt-3 space-y-1">
        <p className="text-xs text-gray-500">
          * Final price may vary based on actual distance and delivery conditions
        </p>
        {!timeInfo.isScheduled && (
          <p className="text-xs text-yellow-500/70">
            💡 Schedule a specific delivery time to customize when your package arrives
          </p>
        )}
      </div>

      {/* Pricing time slots info */}
      <div className="mt-4 p-3 bg-gray-900/50 rounded-lg border border-gray-700">
        <p className="text-xs font-medium text-gray-400 mb-2">Pricing Time Slots:</p>
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400"></div>
            <span className="text-gray-500">Regular hours: Standard pricing</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-400"></div>
            <span className="text-gray-500">Peak hours (9:00 AM - 5:59 PM): +20%</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-indigo-400"></div>
            <span className="text-gray-500">Night delivery (10:00 PM - 5:59 AM): +$5</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-pink-400"></div>
            <span className="text-gray-500">Weekend delivery: +10%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
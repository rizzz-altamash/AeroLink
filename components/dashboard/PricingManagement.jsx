import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

// Icon Components
const DollarIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const SaveIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
  </svg>
);

const ActivateIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const HistoryIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const PreviewIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

export default function PricingManagement() {
  const [loading, setLoading] = useState(true);
  const [currentConfig, setCurrentConfig] = useState(null);
  const [estimates, setEstimates] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState([]);
  const [showPreview, setShowPreview] = useState(false);
  const [previews, setPreviews] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
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
    nightDeliveryCharge: 5,
    weekendMultiplier: 1.1
  });

  useEffect(() => {
    fetchCurrentConfig();
  }, []);

  const fetchCurrentConfig = async () => {
    try {
      const res = await fetch('/api/admin/pricing/current');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setCurrentConfig(data.config);
      setEstimates(data.estimates);
      if (data.config) {
        setFormData({
          name: data.config.name,
          description: data.config.description || '',
          basePrice: data.config.basePrice,
          urgencyMultipliers: data.config.urgencyMultipliers,
          distanceRate: data.config.distanceRate,
          weightRate: data.config.weightRate,
          temperatureControlledCharge: data.config.temperatureControlledCharge,
          fragileHandlingCharge: data.config.fragileHandlingCharge,
          peakHourMultiplier: data.config.peakHourMultiplier,
          nightDeliveryCharge: data.config.nightDeliveryCharge,
          weekendMultiplier: data.config.weekendMultiplier
        });
      }
    } catch (error) {
      toast.error('Failed to load pricing configuration');
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = async () => {
    try {
      const res = await fetch('/api/admin/pricing/history');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setHistory(data.history);
    } catch (error) {
      toast.error('Failed to load pricing history');
    }
  };

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: parseFloat(value) || 0
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: field.includes('Price') || field.includes('Rate') || field.includes('Charge') || field.includes('Multiplier') 
          ? parseFloat(value) || 0 
          : value
      }));
    }
  };

  const handleSave = async () => {
    try {
      const endpoint = currentConfig && !editMode 
        ? `/api/admin/pricing/${currentConfig._id}/update`
        : '/api/admin/pricing/create';
      
      const method = currentConfig && !editMode ? 'PUT' : 'POST';
      
      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!res.ok) throw new Error('Failed to save');
      
      toast.success(editMode ? 'New configuration created' : 'Configuration updated');
      fetchCurrentConfig();
      setEditMode(false);
    } catch (error) {
      toast.error('Failed to save configuration');
    }
  };

  const handleActivate = async (configId) => {
    if (!confirm('Are you sure you want to activate this configuration? It will be used for all new deliveries.')) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/pricing/${configId}/activate`, {
        method: 'POST'
      });

      if (!res.ok) throw new Error('Failed to activate');
      
      toast.success('Configuration activated successfully');
      fetchCurrentConfig();
      setShowHistory(false);
    } catch (error) {
      toast.error('Failed to activate configuration');
    }
  };

  const showPricePreview = async (configId) => {
    try {
      const res = await fetch('/api/admin/pricing/preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ configId })
      });

      if (!res.ok) throw new Error('Failed to fetch preview');
      
      const data = await res.json();
      setPreviews(data.previews);
      setShowPreview(true);
    } catch (error) {
      toast.error('Failed to generate preview');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <DollarIcon className="w-8 h-8 text-purple-400" />
          Pricing Management
        </h1>
        <p className="text-gray-400">Configure delivery pricing and charges</p>
      </div>

      {/* Current Configuration */}
      <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/20 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">
            {currentConfig?.isActive ? 'Active Configuration' : 'Configuration'}
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => setEditMode(!editMode)}
              className="px-4 py-2 bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 rounded-lg transition-all"
            >
              {editMode ? 'Cancel' : 'Create New'}
            </button>
            <button
              onClick={() => {
                setShowHistory(true);
                fetchHistory();
              }}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-all flex items-center gap-2"
            >
              <HistoryIcon className="w-4 h-4" />
              History
            </button>
          </div>
        </div>

        {/* Configuration Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white mb-3">Basic Settings</h3>
            
            <div>
              <label className="block text-sm text-gray-400 mb-1">Configuration Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 rounded-lg text-white focus:ring-2 focus:ring-purple-500"
                placeholder="e.g., Holiday Season 2024"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">Base Price ($)</label>
              <input
                type="number"
                value={formData.basePrice}
                onChange={(e) => handleInputChange('basePrice', e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 rounded-lg text-white focus:ring-2 focus:ring-purple-500"
                step="0.01"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">Distance Rate ($ per meter)</label>
              <input
                type="number"
                value={formData.distanceRate}
                onChange={(e) => handleInputChange('distanceRate', e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 rounded-lg text-white focus:ring-2 focus:ring-purple-500"
                step="0.001"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">Weight Rate ($ per gram)</label>
              <input
                type="number"
                value={formData.weightRate}
                onChange={(e) => handleInputChange('weightRate', e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 rounded-lg text-white focus:ring-2 focus:ring-purple-500"
                step="0.001"
                min="0"
              />
            </div>
          </div>

          {/* Urgency Multipliers */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white mb-3">Urgency Multipliers</h3>
            
            <div>
              <label className="block text-sm text-gray-400 mb-1">Routine (1x)</label>
              <input
                type="number"
                value={formData.urgencyMultipliers.routine}
                onChange={(e) => handleInputChange('urgencyMultipliers.routine', e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 rounded-lg text-white focus:ring-2 focus:ring-purple-500"
                step="0.1"
                min="1"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">Urgent</label>
              <input
                type="number"
                value={formData.urgencyMultipliers.urgent}
                onChange={(e) => handleInputChange('urgencyMultipliers.urgent', e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 rounded-lg text-white focus:ring-2 focus:ring-purple-500"
                step="0.1"
                min="1"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">Emergency</label>
              <input
                type="number"
                value={formData.urgencyMultipliers.emergency}
                onChange={(e) => handleInputChange('urgencyMultipliers.emergency', e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 rounded-lg text-white focus:ring-2 focus:ring-purple-500"
                step="0.1"
                min="1"
              />
            </div>
          </div>

          {/* Additional Charges */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white mb-3">Additional Charges</h3>
            
            <div>
              <label className="block text-sm text-gray-400 mb-1">Temperature Control ($)</label>
              <input
                type="number"
                value={formData.temperatureControlledCharge}
                onChange={(e) => handleInputChange('temperatureControlledCharge', e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 rounded-lg text-white focus:ring-2 focus:ring-purple-500"
                step="0.01"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">Fragile Handling ($)</label>
              <input
                type="number"
                value={formData.fragileHandlingCharge}
                onChange={(e) => handleInputChange('fragileHandlingCharge', e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 rounded-lg text-white focus:ring-2 focus:ring-purple-500"
                step="0.01"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">Night Delivery ($)</label>
              <input
                type="number"
                value={formData.nightDeliveryCharge}
                onChange={(e) => handleInputChange('nightDeliveryCharge', e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 rounded-lg text-white focus:ring-2 focus:ring-purple-500"
                step="0.01"
                min="0"
              />
            </div>
          </div>

          {/* Time-based Multipliers */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white mb-3">Time-based Multipliers</h3>
            
            <div>
              <label className="block text-sm text-gray-400 mb-1">Peak Hour Multiplier</label>
              <input
                type="number"
                value={formData.peakHourMultiplier}
                onChange={(e) => handleInputChange('peakHourMultiplier', e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 rounded-lg text-white focus:ring-2 focus:ring-purple-500"
                step="0.1"
                min="1"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">Weekend Multiplier</label>
              <input
                type="number"
                value={formData.weekendMultiplier}
                onChange={(e) => handleInputChange('weekendMultiplier', e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 rounded-lg text-white focus:ring-2 focus:ring-purple-500"
                step="0.1"
                min="1"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex justify-between">
          <button
            onClick={() => currentConfig && showPricePreview(currentConfig._id)}
            className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-all flex items-center gap-2"
          >
            <PreviewIcon className="w-5 h-5" />
            Preview Prices
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-all flex items-center gap-2"
          >
            <SaveIcon className="w-5 h-5" />
            {editMode ? 'Create Configuration' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Current Estimates */}
      <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/20 mb-8">
        <h2 className="text-xl font-semibold text-white mb-4">Price Estimates</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {estimates.map((estimate, index) => (
            <div key={index} className="bg-gray-800/50 rounded-xl p-4">
              <h3 className="text-white font-medium mb-2">{estimate.name}</h3>
              <p className="text-gray-400 text-sm mb-1">Distance: {estimate.distance / 1000}km</p>
              <p className="text-gray-400 text-sm mb-2">Weight: {estimate.weight}g</p>
              <p className="text-2xl font-bold text-purple-400">${estimate.price.toFixed(2)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* History Modal */}
      {showHistory && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 rounded-2xl p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Pricing History</h2>
              <button
                onClick={() => setShowHistory(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              {history.map((config) => (
                <div key={config._id} className={`p-4 rounded-xl border ${
                  config.isActive ? 'border-purple-500 bg-purple-500/10' : 'border-gray-700 bg-gray-800/50'
                }`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-white font-medium">{config.name}</h3>
                      <p className="text-gray-400 text-sm">
                        Created by {config.createdBy?.name} on {new Date(config.createdAt).toLocaleDateString()}
                      </p>
                      <div className="mt-2 flex gap-4 text-sm">
                        <span className="text-gray-300">Base: ${config.basePrice}</span>
                        <span className="text-gray-300">Distance: ${config.distanceRate}/m</span>
                        <span className="text-gray-300">Weight: ${config.weightRate}/g</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => showPricePreview(config._id)}
                        className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-all"
                      >
                        Preview
                      </button>
                      {!config.isActive && (
                        <button
                          onClick={() => handleActivate(config._id)}
                          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-all flex items-center gap-2"
                        >
                          <ActivateIcon className="w-4 h-4" />
                          Activate
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 rounded-2xl p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Price Preview</h2>
              <button
                onClick={() => setShowPreview(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              {previews.map((preview, index) => (
                <div key={index} className="bg-gray-800/50 rounded-xl p-4">
                  <h3 className="text-white font-medium mb-3">{preview.scenario}</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-400">Base Price</p>
                      <p className="text-white font-medium">${preview.pricing.basePrice.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Urgency</p>
                      <p className="text-white font-medium">${preview.pricing.urgencyCharge.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Distance</p>
                      <p className="text-white font-medium">${preview.pricing.distanceCharge.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Weight</p>
                      <p className="text-white font-medium">${preview.pricing.weightCharge.toFixed(2)}</p>
                    </div>
                    {preview.pricing.temperatureCharge > 0 && (
                      <div>
                        <p className="text-gray-400">Temperature</p>
                        <p className="text-white font-medium">${preview.pricing.temperatureCharge.toFixed(2)}</p>
                      </div>
                    )}
                    {preview.pricing.fragileCharge > 0 && (
                      <div>
                        <p className="text-gray-400">Fragile</p>
                        <p className="text-white font-medium">${preview.pricing.fragileCharge.toFixed(2)}</p>
                      </div>
                    )}
                    {preview.pricing.timeBasedCharge > 0 && (
                      <div>
                        <p className="text-gray-400">Time-based</p>
                        <p className="text-white font-medium">${preview.pricing.timeBasedCharge.toFixed(2)}</p>
                      </div>
                    )}
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-700">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Total Price</span>
                      <span className="text-2xl font-bold text-purple-400">${preview.pricing.totalPrice.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
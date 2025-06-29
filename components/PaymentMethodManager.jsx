// components/PaymentMethodManager.jsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function PaymentMethodManager({ onClose }) {
  const router = useRouter();
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hospitalInfo, setHospitalInfo] = useState(null);
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);
  const [removingMethod, setRemovingMethod] = useState(null);
  const [razorpayReady, setRazorpayReady] = useState(false);

  useEffect(() => {
    fetchPaymentMethods();
    
    // Load Razorpay script if not already loaded
    if (!window.Razorpay) {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => setRazorpayReady(true);
      document.body.appendChild(script);
    } else {
      setRazorpayReady(true);
    }
  }, []);

  const fetchPaymentMethods = async () => {
    try {
      const res = await fetch('/api/hospital/payment-methods');
      const data = await res.json();
      setPaymentMethods(data.paymentMethods || []);
      setHospitalInfo(data.hospitalInfo);
    } catch (error) {
      toast.error('Failed to load payment methods');
    } finally {
      setLoading(false);
    }
  };

  const handleAddPaymentMethod = async () => {
    if (!razorpayReady) {
      toast.error('Payment system is loading. Please wait...');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/payments/add-method', {
        method: 'POST'
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to initialize payment');
      }

      const options = {
        key: data.key || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: 100,
        currency: 'INR',
        name: 'Add Payment Method',
        description: 'Add a new payment method',
        customer_id: data.customerId,
        order_id: data.orderId,
        handler: async function (response) {
          const verifyRes = await fetch('/api/payments/verify-method', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature
            })
          });

          if (verifyRes.ok) {
            toast.success('Payment method added successfully!');
            fetchPaymentMethods();
          } else {
            toast.error('Failed to add payment method');
          }
        },
        prefill: {
          email: data.email,
          contact: data.phone
        },
        theme: {
          color: '#DC2626'
        },
        modal: {
          ondismiss: function() {
            setLoading(false);
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      toast.error(error.message || 'Failed to add payment method');
      setLoading(false);
    }
  };

  const handleRemovePaymentMethod = async (methodId) => {
    try {
      const res = await fetch(`/api/hospital/payment-methods/${methodId}`, {
        method: 'DELETE'
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to remove payment method');
      }

      toast.success('Payment method removed');
      
      if (data.hospitalUnverified) {
        toast.warning('Hospital is now unverified. Please add a payment method.');
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 2000);
      }

      fetchPaymentMethods();
      setShowRemoveConfirm(false);
      setRemovingMethod(null);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleSetDefault = async (methodId) => {
    try {
      const res = await fetch(`/api/hospital/payment-methods/${methodId}/set-default`, {
        method: 'POST'
      });

      if (!res.ok) {
        throw new Error('Failed to set default payment method');
      }

      toast.success('Default payment method updated');
      fetchPaymentMethods();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getPaymentIcon = (type) => {
    switch (type) {
      case 'card':
        return (
          <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
        );
      case 'upi':
        return (
          <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        );
      default:
        return (
          <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 rounded-2xl p-6 sm:p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Payment Methods</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Hospital Payment Status */}
        {hospitalInfo && (
          <div className={`mb-6 p-4 rounded-lg border ${
            hospitalInfo.isVerified 
              ? 'bg-green-500/10 border-green-500/20' 
              : 'bg-yellow-500/10 border-yellow-500/20'
          }`}>
            <div className="flex items-center gap-3">
              {hospitalInfo.isVerified ? (
                <>
                  <svg className="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="text-green-400 font-semibold">Hospital Verified</p>
                    <p className="text-gray-300 text-sm">Auto-deduction is enabled for deliveries</p>
                  </div>
                </>
              ) : (
                <>
                  <svg className="w-6 h-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <div>
                    <p className="text-yellow-400 font-semibold">Hospital Unverified</p>
                    <p className="text-gray-300 text-sm">Add a payment method to verify your hospital</p>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Payment Methods List */}
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin h-8 w-8 border-b-2 border-red-500 rounded-full mx-auto"></div>
          </div>
        ) : paymentMethods.length === 0 ? (
          <div className="text-center py-8">
            <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
            <p className="text-gray-400 mb-4">No payment methods added yet</p>
          </div>
        ) : (
          <div className="space-y-4 mb-6">
            {paymentMethods.map((method) => (
              <div
                key={method.id}
                className={`p-4 rounded-lg border ${
                  method.isDefault 
                    ? 'border-blue-500/30 bg-blue-500/10' 
                    : 'border-gray-700 bg-gray-800/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {getPaymentIcon(method.type)}
                    <div>
                      <p className="text-white font-medium">
                        {method.type === 'card' 
                          ? `•••• ${method.last4}` 
                          : method.upiId || 'Payment Method'}
                      </p>
                      <p className="text-gray-400 text-sm">
                        Added on {new Date(method.addedAt).toLocaleDateString()}
                      </p>
                      {method.isDefault && (
                        <span className="text-xs text-blue-400 font-medium">Default</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {!method.isDefault && (
                      <button
                        onClick={() => handleSetDefault(method.id)}
                        className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm transition-all"
                      >
                        Set Default
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setRemovingMethod(method);
                        setShowRemoveConfirm(true);
                      }}
                      className="p-2 hover:bg-red-500/20 text-red-400 rounded-lg transition-all"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add Payment Method Button */}
        <button
          onClick={handleAddPaymentMethod}
          disabled={loading}
          className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Payment Method
        </button>

        {/* Remove Confirmation Modal */}
        {showRemoveConfirm && removingMethod && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-[60]">
            <div className="bg-gray-900 rounded-xl p-6 max-w-md w-full">
              <h3 className="text-xl font-bold text-white mb-4">Remove Payment Method?</h3>
              
              {paymentMethods.length === 1 ? (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-4">
                  <p className="text-red-400 font-semibold mb-2">⚠️ Warning</p>
                  <p className="text-gray-300 text-sm">
                    This is your only payment method. Removing it will:
                  </p>
                  <ul className="text-gray-300 text-sm mt-2 list-disc list-inside">
                    <li>Make your hospital unverified</li>
                    <li>Disable auto-deduction for deliveries</li>
                    <li>Require payment setup to continue services</li>
                  </ul>
                </div>
              ) : (
                <p className="text-gray-300 mb-4">
                  Are you sure you want to remove this payment method?
                </p>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowRemoveConfirm(false);
                    setRemovingMethod(null);
                  }}
                  className="flex-1 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleRemovePaymentMethod(removingMethod.id)}
                  className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-all"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
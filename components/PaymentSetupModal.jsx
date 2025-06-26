// components/PaymentSetupModal.jsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function PaymentSetupModal({ onClose, onComplete }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [razorpayReady, setRazorpayReady] = useState(false);

  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => setRazorpayReady(true);
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleSetupPayment = async () => {
    if (!razorpayReady) {
      toast.error('Payment system is loading. Please wait...');
      return;
    }

    setLoading(true);
    try {
      // Create Razorpay customer
      const res = await fetch('/api/payments/setup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = await res.json();
      
      if (!res.ok) {
        console.error('Payment setup failed:', data);
        throw new Error(data.error || data.details || 'Failed to initialize payment setup');
      }

      // Make sure we have the key
      const razorpayKey = data.key || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
      if (!razorpayKey) {
        throw new Error('Razorpay key not found');
      }

      // Open Razorpay checkout
      const options = {
        key: razorpayKey,
        amount: 100, // ₹1 for verification
        currency: 'INR',
        name: 'AeroLink Setup',
        description: 'One-time payment method verification',
        customer_id: data.customerId,
        order_id: data.orderId,
        handler: async function (response) {
          // Verify payment
          const verifyRes = await fetch('/api/payments/verify-setup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature
            })
          });

          if (verifyRes.ok) {
            const verifyData = await verifyRes.json();
            toast.success('Payment method setup successful!');
            
            // Call onComplete callback
            if (onComplete) {
              onComplete();
            }
            
            // Redirect to dashboard after a short delay
            setTimeout(() => {
              window.location.href = verifyData.redirectUrl || '/dashboard';
            }, 2000);
          } else {
            const error = await verifyRes.json();
            toast.error(error.error || 'Payment verification failed');
          }
        },
        prefill: {
          email: data.email,
          contact: data.phone
        },
        notes: {
          hospital_id: data.hospitalId
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
      toast.error(error.message || 'Failed to setup payment method');
      console.error('Payment setup error:', error);
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 rounded-2xl p-6 sm:p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Complete Payment Setup</h2>
          <p className="text-gray-400">Set up your payment method to start using our services</p>
        </div>

        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-6">
          <h3 className="text-blue-400 font-semibold mb-2 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            How it works:
          </h3>
          <ul className="text-sm text-gray-300 space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-0.5">✓</span>
              <span>One-time setup - add your card or UPI</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-0.5">✓</span>
              <span>Payment auto-deducted per successful delivery</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-0.5">✓</span>
              <span>Only charged after delivery confirmation</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-0.5">✓</span>
              <span>Secure payment via Razorpay</span>
            </li>
          </ul>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold transition-all"
          >
            Later
          </button>
          <button
            onClick={handleSetupPayment}
            disabled={loading || !razorpayReady}
            className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-all disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Setup Payment'}
          </button>
        </div>
      </div>
    </div>
  );
}
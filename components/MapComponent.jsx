// components/MapComponent.jsx
'use client';

import { useEffect, useState } from 'react';

const MapIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
  </svg>
);

export default function MapComponent({ deliveries = [], selectedDelivery, onSelectDelivery }) {
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    // Simulate map loading
    const timer = setTimeout(() => setMapLoaded(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="h-full bg-gray-800 rounded-xl flex items-center justify-center relative">
      {!mapLoaded ? (
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-2 border-red-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-500">Loading map...</p>
        </div>
      ) : (
        <>
          {/* Map Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-xl opacity-50"></div>
          
          {/* Grid Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="h-full w-full" style={{
              backgroundImage: `
                linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px'
            }}></div>
          </div>

          {/* Map Content */}
          <div className="relative z-10 text-center">
            <MapIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500 text-lg mb-2">Interactive Map Coming Soon</p>
            <p className="text-gray-600 text-sm">
              Track {deliveries.length} active deliveries in real-time
            </p>
            
            {/* Demo Animation */}
            <div className="mt-8 flex justify-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-ping animation-delay-200"></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping animation-delay-400"></div>
            </div>
          </div>

          {/* Integration Instructions */}
          <div className="absolute bottom-4 left-4 right-4 bg-gray-900/80 backdrop-blur rounded-lg p-4 text-xs text-gray-500">
            <p className="mb-1">To integrate a real map:</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Install Leaflet or Mapbox: <code className="text-red-400">npm install react-leaflet</code></li>
              <li>Add your API keys to environment variables</li>
              <li>Replace this component with actual map implementation</li>
            </ol>
          </div>
        </>
      )}
    </div>
  );
}
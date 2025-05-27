// components/ui/LoadingSpinner.jsx
export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center gap-4">
      {/* Drone-inspired loading animation */}
      <div className="relative w-24 h-24">
        {/* Rotating propellers */}
        <div className="absolute inset-0 animate-spin">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-10 bg-gradient-to-b from-blue-500 to-transparent rounded-full"></div>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-10 bg-gradient-to-t from-blue-500 to-transparent rounded-full"></div>
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-2 bg-gradient-to-r from-blue-500 to-transparent rounded-full"></div>
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-2 bg-gradient-to-l from-blue-500 to-transparent rounded-full"></div>
        </div>
        
        {/* Center drone body */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 bg-gradient-to-br from-gray-700 to-gray-900 rounded-lg shadow-lg"></div>
        </div>
        
        {/* Pulse effect */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 bg-blue-500/20 rounded-full animate-ping"></div>
        </div>
      </div>
      
      <p className="text-gray-400 animate-pulse">Loading...</p>
    </div>
  );
}
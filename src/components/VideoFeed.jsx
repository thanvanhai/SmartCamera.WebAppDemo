// src/components/VideoFeed.jsx
import React, { useEffect, useState } from 'react';
import { Camera } from 'lucide-react';

const StatusBadge = ({ status, aiEnabled = false }) => {
  const getStatusColor = () => {
    if (status === 'online') return aiEnabled ? 'bg-green-500' : 'bg-blue-500';
    return 'bg-red-500';
  };

  const getStatusText = () => {
    if (status === 'online') return aiEnabled ? 'AI Active' : 'Online';
    return 'Offline';
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-bold text-white ${getStatusColor()}`}>
      {getStatusText()}
    </span>
  );
};

const VideoFeed = ({ camera }) => {
  const [hasDetection, setHasDetection] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setHasDetection(camera.status === 'online' && Math.random() > 0.6);
    }, 2000);
    return () => clearInterval(interval);
  }, [camera.status]);

  // Mock detection count (you can replace with real data)
  const detectionCount = camera.detections || Math.floor(Math.random() * 50);

  return (
    <div className="relative bg-black rounded-lg overflow-hidden aspect-video border-2 border-gray-700 hover:border-blue-500 transition-colors">
      <div className="absolute inset-0 flex items-center justify-center text-gray-400">
        {camera.status === 'online' ? (
          <div className="text-center">
            <Camera className="w-12 h-12 mx-auto mb-2 text-blue-400" />
            <div className="text-sm">Live Stream</div>
            <div className="w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mt-2"></div>
          </div>
        ) : (
          <div className="text-center">
            <Camera className="w-12 h-12 mx-auto mb-2 text-red-400" />
            <div className="text-sm">Offline</div>
          </div>
        )}
      </div>
      
      <div className="absolute top-3 left-3 bg-black/70 text-white px-2 py-1 rounded text-sm">
        {camera.name} - {detectionCount} detections
      </div>

      <div className="absolute top-3 right-3">
        <StatusBadge status={camera.status} aiEnabled={camera.aiEnabled} />
      </div>

      {hasDetection && camera.status === 'online' && (
        <div 
          className="absolute border-2 border-red-500 bg-red-500/20 rounded animate-pulse"
          style={{
            top: `${Math.random() * 40 + 20}%`,
            left: `${Math.random() * 40 + 20}%`,
            width: `${Math.random() * 20 + 15}%`,
            height: `${Math.random() * 20 + 15}%`
          }}
        >
          <div className="absolute -top-6 left-0 bg-red-500 text-white px-2 py-1 rounded text-xs">
            Person
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoFeed;
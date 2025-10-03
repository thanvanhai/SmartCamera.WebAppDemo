// src/components/EnhancedVideoFeed.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Camera, Wifi, WifiOff, Eye, EyeOff, Zap } from 'lucide-react';
import DetectionOverlay from './DetectionOverlay';
import { signalRService } from '../services/signalr';

const EnhancedVideoFeed = ({ camera }) => {
  const [detections, setDetections] = useState([]);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [detectionCount, setDetectionCount] = useState(0);
  const videoRef = useRef(null);
  const [videoDimensions, setVideoDimensions] = useState({ width: 640, height: 480 });

  useEffect(() => {
    // Subscribe to real-time detection updates for this camera
    const unsubscribe = signalRService.onDetection((data) => {
      if (data.cameraId === camera.id) {
        console.log(`🎯 Detection for camera ${camera.id}:`, data);
        
        setDetections(data.detections || []);
        setDetectionCount(data.detectionCount || 0);
        setLastUpdate(new Date(data.timestamp));

        // Auto-clear detections after 3 seconds if no new updates
        setTimeout(() => {
          setDetections(prev => prev.length > 0 ? [] : prev);
        }, 3000);
      }
    });

    // Join camera group for targeted updates
    if (camera.status === 'online') {
      signalRService.joinCameraGroup(camera.id);
    }

    return () => {
      unsubscribe();
      signalRService.leaveCameraGroup(camera.id);
    };
  }, [camera.id, camera.status]);

  const handleVideoLoad = () => {
    if (videoRef.current) {
      const video = videoRef.current;
      setVideoDimensions({
        width: video.videoWidth || 640,
        height: video.videoHeight || 480
      });
    }
  };

  const getStatusColor = () => {
    if (camera.status === 'offline') return 'text-red-400';
    if (camera.aiEnabled && detections.length > 0) return 'text-green-400';
    if (camera.aiEnabled) return 'text-blue-400';
    return 'text-gray-400';
  };

  const getStatusIcon = () => {
    if (camera.status === 'offline') return WifiOff;
    if (camera.aiEnabled && detections.length > 0) return Eye;
    if (camera.aiEnabled) return Zap;
    return Wifi;
  };

  const StatusIcon = getStatusIcon();

  return (
    <div className="relative bg-gray-900 rounded-lg overflow-hidden border border-gray-700 hover:border-gray-600 transition-all duration-300">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/80 to-transparent p-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Camera className="w-4 h-4 text-white" />
            <span className="text-white font-medium text-sm">{camera.name}</span>
          </div>
          <div className="flex items-center space-x-2">
            <StatusIcon className={`w-4 h-4 ${getStatusColor()}`} />
            {camera.aiEnabled && (
              <div className="flex items-center space-x-1 bg-black/40 px-2 py-1 rounded text-xs">
                <Eye className="w-3 h-3 text-blue-400" />
                <span className="text-white">{detectionCount}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Video Container */}
      <div className="relative aspect-video bg-gray-800">
        {camera.status === 'online' ? (
          <>
            {/* Simulated Video Feed */}
            <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center">
              <div className="text-center text-gray-400">
                <Camera className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Live Feed - {camera.name}</p>
                {camera.rtspUrl && (
                  <video
                    ref={videoRef}
                    className="w-full h-full object-cover"
                    autoPlay
                    muted
                    onLoadedMetadata={handleVideoLoad}
                    style={{ display: 'none' }} // Hidden for demo, show in real implementation
                  >
                    <source src={camera.rtspUrl} type="video/mp4" />
                  </video>
                )}
              </div>
            </div>

            {/* AI Detection Overlay */}
            {camera.aiEnabled && (
              <DetectionOverlay 
                detections={detections}
                videoWidth={videoDimensions.width}
                videoHeight={videoDimensions.height}
              />
            )}

            {/* Real-time Detection Indicator */}
            {camera.aiEnabled && detections.length > 0 && (
              <div className="absolute top-12 right-3 bg-red-500/90 text-white px-2 py-1 rounded text-xs font-bold animate-pulse">
                🔴 DETECTING
              </div>
            )}
          </>
        ) : (
          /* Offline State */
          <div className="w-full h-full bg-gray-800 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <WifiOff className="w-12 h-12 mx-auto mb-2" />
              <p className="text-sm">Camera Offline</p>
            </div>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-black/80 to-transparent p-3">
        <div className="flex justify-between items-center text-xs">
          <div className="text-gray-300">
            {camera.location || 'No location set'}
          </div>
          {lastUpdate && (
            <div className="text-gray-400">
              Last: {lastUpdate.toLocaleTimeString()}
            </div>
          )}
        </div>
      </div>

      {/* AI Model Badge */}
      {camera.aiEnabled && (
        <div className="absolute bottom-3 left-3 bg-blue-600/90 text-white px-2 py-1 rounded-full text-xs font-medium">
          {camera.model || 'AI'}
        </div>
      )}
    </div>
  );
};

export default EnhancedVideoFeed;
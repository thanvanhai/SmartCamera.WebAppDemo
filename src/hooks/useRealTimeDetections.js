// src/hooks/useRealTimeDetections.js - UPDATED to match backend
import { useState, useEffect } from 'react';
import { signalRService } from '../services/signalr';

export const useRealTimeDetections = (token) => {
  const [isConnected, setIsConnected] = useState(false);
  const [detections, setDetections] = useState(new Map()); // cameraId -> detections
  const [alerts, setAlerts] = useState([]);
  const [connectionState, setConnectionState] = useState('Disconnected');

  useEffect(() => {
    let mounted = true;

    const connect = async () => {
      if (token) {
        const connected = await signalRService.connect(token);
        if (mounted) {
          setIsConnected(connected);
          setConnectionState(signalRService.getConnectionState());
        }
      }
    };

    connect();

    // Subscribe to detection results
    const unsubscribeDetection = signalRService.onDetection((data) => {
      if (mounted) {
        console.log('📊 Processing detection data:', data);
        
        setDetections(prev => {
          const newMap = new Map(prev);
          newMap.set(data.cameraId, {
            ...data,
            timestamp: new Date(data.timestamp),
            detections: data.detections || []
          });
          return newMap;
        });
      }
    });

    // Subscribe to alerts
    const unsubscribeAlert = signalRService.onAlert((alert) => {
      if (mounted) {
        console.log('🚨 Processing alert:', alert);
        
        setAlerts(prev => [...prev.slice(-9), { // Keep last 10 alerts
          ...alert,
          id: alert.id || Date.now().toString(),
          timestamp: new Date(alert.timestamp || Date.now())
        }]);
      }
    });

    // Subscribe to camera status
    const unsubscribeStatus = signalRService.onCameraStatus((statusData) => {
      if (mounted) {
        console.log('📹 Processing camera status:', statusData);
        // Handle camera status updates if needed
      }
    });

    // Update connection state periodically
    const stateInterval = setInterval(() => {
      if (mounted) {
        const currentState = signalRService.getConnectionState();
        setConnectionState(currentState);
        setIsConnected(currentState === 'Connected');
      }
    }, 2000);

    return () => {
      mounted = false;
      unsubscribeDetection();
      unsubscribeAlert();
      unsubscribeStatus();
      clearInterval(stateInterval);
      signalRService.disconnect();
    };
  }, [token]);

  const clearAlerts = () => setAlerts([]);
  
  const getDetectionsForCamera = (cameraId) => {
    const cameraData = detections.get(cameraId);
    return cameraData?.detections || [];
  };

  const getTotalDetections = () => {
    let total = 0;
    detections.forEach(data => {
      total += data.detectionCount || 0;
    });
    return total;
  };

  const getLatestDetectionTime = (cameraId) => {
    const cameraData = detections.get(cameraId);
    return cameraData?.timestamp || null;
  };

  const reconnect = async () => {
    return await signalRService.reconnect();
  };

  return {
    isConnected,
    connectionState,
    detections,
    alerts,
    clearAlerts,
    getDetectionsForCamera,
    getTotalDetections,
    getLatestDetectionTime,
    reconnect
  };
};
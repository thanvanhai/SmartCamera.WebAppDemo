// src/components/DetectionOverlay.jsx
import React from 'react';

const DetectionOverlay = ({ detections, videoWidth, videoHeight }) => {
  if (!detections || detections.length === 0) {
    return null;
  }

  const getColorByType = (type) => {
    const colors = {
      'person': '#00ff00',
      'car': '#ff0000', 
      'truck': '#ff8800',
      'bicycle': '#0088ff',
      'motorcycle': '#ff00ff',
      'default': '#ffff00'
    };
    return colors[type] || colors.default;
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 0.8) return '#00ff00';
    if (confidence >= 0.6) return '#ffff00';
    return '#ff8800';
  };

  return (
    <div className="absolute inset-0 pointer-events-none">
      {detections.map((detection, index) => {
        const { boundingBox, type, confidence, id } = detection;
        const { x, y, width, height } = boundingBox;
        
        // Convert to percentage for responsive overlay
        const left = (x / videoWidth) * 100;
        const top = (y / videoHeight) * 100;
        const w = (width / videoWidth) * 100;
        const h = (height / videoHeight) * 100;

        const color = getColorByType(type);
        const confidenceColor = getConfidenceColor(confidence);

        return (
          <div
            key={id || index}
            className="absolute border-2 animate-pulse"
            style={{
              left: `${left}%`,
              top: `${top}%`,
              width: `${w}%`,
              height: `${h}%`,
              borderColor: color,
              boxShadow: `0 0 10px ${color}40`
            }}
          >
            {/* Detection Label */}
            <div 
              className="absolute -top-6 left-0 px-2 py-1 text-xs font-bold rounded text-black"
              style={{ backgroundColor: color }}
            >
              {type} ({(confidence * 100).toFixed(0)}%)
            </div>
            
            {/* Confidence Bar */}
            <div 
              className="absolute -bottom-1 left-0 h-1"
              style={{ 
                width: `${confidence * 100}%`,
                backgroundColor: confidenceColor
              }}
            />
          </div>
        );
      })}
    </div>
  );
};

export default DetectionOverlay;
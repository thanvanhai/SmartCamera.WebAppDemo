// src/components/CameraControlPanel.jsx
import React from 'react';
import { Settings, Play, Pause, Brain } from 'lucide-react';

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

const CameraControlPanel = ({ cameras, onAddCamera, onToggleCamera, onToggleAI, onEditCamera }) => {
  const handleToggleCamera = (cameraId) => {
    if (onToggleCamera) {
      onToggleCamera(cameraId);
    }
  };

  const handleToggleAI = (cameraId) => {
    if (onToggleAI) {
      onToggleAI(cameraId);
    }
  };

  const takeSnapshot = () => {
    alert("📸 Snapshots captured for all active cameras!\nImages saved to storage.");
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Settings className="w-5 h-5" />
        Camera Management
      </h3>
      
      <div className="space-y-3 mb-4">
        {cameras.map(camera => (
          <div key={camera.id} className="bg-gray-700/50 p-4 rounded-lg">
            <div className="flex justify-between items-start mb-2">
              <div>
                <div className="font-medium">{camera.name}</div>
                <div className="text-sm text-gray-400">
                  {camera.location || camera.stream || 'RTSP Stream'}
                </div>
              </div>
              <StatusBadge status={camera.status} aiEnabled={camera.aiEnabled} />
            </div>
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => handleToggleCamera(camera.id)}
                className={`flex items-center gap-1 px-3 py-1 rounded text-xs font-medium transition-colors ${
                  camera.status === 'online' 
                    ? 'bg-red-600 hover:bg-red-700' 
                    : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                {camera.status === 'online' ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                {camera.status === 'online' ? 'Stop' : 'Start'}
              </button>
              <button
                onClick={() => handleToggleAI(camera.id)}
                className={`flex items-center gap-1 px-3 py-1 rounded text-xs font-medium transition-colors ${
                  camera.aiEnabled 
                    ? 'bg-blue-600 hover:bg-blue-700' 
                    : 'bg-gray-600 hover:bg-gray-700'
                }`}
                disabled={camera.status === 'offline'}
              >
                <Brain className="w-3 h-3" />
                {camera.aiEnabled ? 'AI On' : 'AI Off'}
              </button>
              <button
                onClick={() => onEditCamera(camera)}
                className="px-3 py-1 bg-gray-600 hover:bg-gray-700 rounded text-xs font-medium transition-colors"
              >
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <button 
          onClick={onAddCamera}
          className="flex-1 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          + Add Camera
        </button>
        <button 
          onClick={takeSnapshot}
          className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          📸 Snapshot
        </button>
      </div>
    </div>
  );
};

export default CameraControlPanel;
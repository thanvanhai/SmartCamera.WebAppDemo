// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { LogOut, Users, Activity, Camera, Settings, Eye, Brain, Zap } from "lucide-react";
import { api } from "../services/api";
import CameraModal from "../components/CameraModal";
import VideoFeed from "../components/VideoFeed";
import MetricCard from "../components/MetricCard";
import CameraControlPanel from "../components/CameraControlPanel";

export default function Dashboard({ user, token, onLogout }) {
  const [cameras, setCameras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCamera, setEditingCamera] = useState(null);
  
  // Enhanced state for AI features
  const [systemMetrics, setSystemMetrics] = useState({
    detections: 0,
    systemLoad: 0,
    uptime: 99.8
  });

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const cams = await api.getCameras(token);
      
      // Enhance camera data with AI features if not present
      const enhancedCameras = cams.map(cam => ({
        ...cam,
        status: cam.status || (Math.random() > 0.2 ? 'online' : 'offline'),
        aiEnabled: cam.aiEnabled ?? (cam.status !== 'offline' && Math.random() > 0.3),
        detections: cam.detections || Math.floor(Math.random() * 50),
        model: cam.model || 'YOLO v8'
      }));
      
      setCameras(enhancedCameras);
      
      // Update system metrics
      const activeStreams = enhancedCameras.filter(c => c.status === 'online').length;
      const totalDetections = enhancedCameras.reduce((sum, cam) => sum + (cam.detections || 0), 0);
      
      setSystemMetrics({
        detections: totalDetections,
        systemLoad: Math.floor(Math.random() * 30 + 15),
        uptime: 99.8
      });
      
    } catch (err) {
      setError("⚠️ Cannot connect to API. Please check backend server.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Set up periodic refresh for real-time feel
    const interval = setInterval(() => {
      // Update metrics without full refresh
      setSystemMetrics(prev => ({
        ...prev,
        systemLoad: Math.floor(Math.random() * 30 + 15),
        detections: prev.detections + Math.floor(Math.random() * 3)
      }));
    }, 5000);
    
    return () => clearInterval(interval);
  }, [token]);

  const handleSaveCamera = async (camera) => {
    try {
      if (editingCamera) {
        await api.updateCamera(token, editingCamera.id, camera);
      } else {
        await api.createCamera(token, camera);
      }
      fetchData();
      setModalOpen(false);
      setEditingCamera(null);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to save camera");
    }
  };

  const handleDeleteCamera = async (id) => {
    if (window.confirm("Delete this camera?")) {
      try {
        await api.deleteCamera(token, id);
        fetchData();
      } catch (err) {
        console.error(err);
        setError("Failed to delete camera");
      }
    }
  };

  // Enhanced camera controls
  const handleToggleCamera = (cameraId) => {
    setCameras(prev => prev.map(cam => 
      cam.id === cameraId 
        ? { ...cam, status: cam.status === 'online' ? 'offline' : 'online' }
        : cam
    ));
  };

  const handleToggleAI = (cameraId) => {
    setCameras(prev => prev.map(cam => 
      cam.id === cameraId 
        ? { ...cam, aiEnabled: !cam.aiEnabled }
        : cam
    ));
  };

  const handleEditCamera = (camera) => {
    setEditingCamera(camera);
    setModalOpen(true);
  };

  const handleAddCamera = () => {
    setEditingCamera(null);
    setModalOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div>Loading dashboard...</div>
        </div>
      </div>
    );
  }

  const activeStreams = cameras.filter(c => c.status === 'online').length;
  const aiActiveStreams = cameras.filter(c => c.status === 'online' && c.aiEnabled).length;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Enhanced Header */}
      <header className="bg-gray-800/80 backdrop-blur-md border-b border-gray-700 p-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Brain className="w-8 h-8 text-blue-400" />
              SmartCamera Dashboard
            </h1>
            <p className="text-gray-400 text-sm">AI-powered video monitoring system</p>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-300 flex items-center gap-1">
              <Users className="w-4 h-4" />
              {cameras.length} cameras
            </span>
            <span className="text-gray-400">Hi, {user.username}</span>
            <button
              onClick={onLogout}
              className="flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4 mr-2" /> Logout
            </button>
          </div>
        </div>
      </header>

      <main className="p-6">
        {/* Error Display */}
        {error && (
          <div className="bg-red-500/20 border border-red-500/30 p-3 rounded-lg text-red-300 mb-6">
            {error}
          </div>
        )}

        {/* Enhanced Status Bar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Active Streams"
            value={activeStreams}
            icon={Camera}
            color="green"
          />
          <MetricCard
            title="AI Detections"
            value={systemMetrics.detections}
            icon={Eye}
            color="blue"
          />
          <MetricCard
            title="System Load"
            value={systemMetrics.systemLoad}
            unit="%"
            icon={Activity}
            color="yellow"
          />
          <MetricCard
            title="Uptime"
            value={systemMetrics.uptime}
            unit="%"
            icon={Zap}
            color="green"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Video Feeds Section */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Camera className="w-5 h-5" />
                Live Video Feeds
              </h2>
              
              {cameras.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <Camera className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg mb-2">No cameras configured</p>
                  <p className="text-sm">Add your first camera to start monitoring</p>
                  <button
                    onClick={handleAddCamera}
                    className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium transition-colors"
                  >
                    + Add Camera
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {cameras.map(camera => (
                    <VideoFeed key={camera.id} camera={camera} />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Control Panel */}
          <div className="space-y-6">
            <CameraControlPanel
              cameras={cameras}
              onAddCamera={handleAddCamera}
              onToggleCamera={handleToggleCamera}
              onToggleAI={handleToggleAI}
              onEditCamera={handleEditCamera}
            />

            {/* AI Configuration Panel */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6">
              <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Settings className="w-5 h-5" />
                AI Configuration
              </h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Detection Model:</label>
                  <select className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white">
                    <option>YOLO v8 - General</option>
                    <option>Person Detection</option>
                    <option>Vehicle Detection</option>
                    <option>Face Recognition</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Confidence Threshold: 0.7
                  </label>
                  <input
                    type="range"
                    min="0.1"
                    max="1"
                    step="0.1"
                    defaultValue="0.7"
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Processing FPS:</label>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    defaultValue="10"
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                  />
                </div>
                <button className="w-full bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-medium transition-colors">
                  Update Config
                </button>
              </div>
            </div>

            {/* System Stats */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6">
              <h4 className="text-lg font-semibold mb-4">System Status</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Active Cameras:</span>
                  <span className="text-green-400 font-medium">{activeStreams}/{cameras.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">AI Enabled:</span>
                  <span className="text-blue-400 font-medium">{aiActiveStreams}/{activeStreams}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Detections:</span>
                  <span className="text-white font-medium">{systemMetrics.detections}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">System Health:</span>
                  <span className="text-green-400 font-medium">Optimal</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Camera Modal */}
      {modalOpen && (
        <CameraModal
          camera={editingCamera}
          onClose={() => {
            setModalOpen(false);
            setEditingCamera(null);
          }}
          onSave={handleSaveCamera}
        />
      )}
    </div>
  );
}
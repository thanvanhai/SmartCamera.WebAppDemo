import React, { useEffect, useState } from "react";
import { LogOut, Users } from "lucide-react";
import { api } from "../services/api";
import CameraCard from "../components/CameraCard";
import CameraModal from "../components/CameraModal";

export default function Dashboard({ user, token, onLogout }) {
  const [cameras, setCameras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCamera, setEditingCamera] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const cams = await api.getCameras(token);
      setCameras(cams);
    } catch (err) {
      setError("⚠️ Cannot connect to API. Please check backend server.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [token]);

  const handleSaveCamera = async (camera) => {
    try {
      if (editingCamera) {
        await api.updateCamera(token, editingCamera.id, camera);
      } else {
        await api.createCamera(token, camera);
      }
      fetchData();
      setModalOpen(false);
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

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800/80 backdrop-blur-md border-b border-gray-700 p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">📹 Camera Dashboard</h1>
        <div className="flex items-center space-x-4">
          <span className="text-gray-300 flex items-center gap-1">
            <Users className="w-4 h-4" />
            {cameras.length} cameras
          </span>
          <span className="text-gray-400">Hi, {user.username}</span>
          <button
            onClick={onLogout}
            className="flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg"
          >
            <LogOut className="w-4 h-4 mr-2" /> Logout
          </button>
        </div>
      </header>

      <main className="p-6 space-y-8">
        {error && (
          <div className="bg-red-500/20 border border-red-500/30 p-3 rounded-lg text-red-300">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center text-gray-400">Loading...</div>
        ) : (
          <>
            <section>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Cameras</h2>
                <button
                  onClick={() => { setEditingCamera(null); setModalOpen(true); }}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg"
                >
                  + Add Camera
                </button>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {cameras.map((cam) => (
                  <CameraCard
                    key={cam.id}
                    camera={cam}
                    onEdit={() => { setEditingCamera(cam); setModalOpen(true); }}
                    onDelete={() => handleDeleteCamera(cam.id)}
                  />
                ))}
              </div>
            </section>
          </>
        )}
      </main>

      {modalOpen && (
        <CameraModal
          camera={editingCamera}
          onClose={() => setModalOpen(false)}
          onSave={handleSaveCamera}
        />
      )}
    </div>
  );
}

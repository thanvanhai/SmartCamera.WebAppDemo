import React, { useState, useEffect } from "react";

export default function CameraModal({ camera, onClose, onSave }) {
  const [form, setForm] = useState({
    name: "",
    ipAddress: "",
    port: 554,
    username: "",
    password: "",
    location: "",
    description: "",
    type: 1, // IP = 1
  });
  const [error, setError] = useState("");

  useEffect(() => {
    if (camera) {
      setForm({
        name: camera.name || "",
        ipAddress: camera.ipAddress || "",
        port: camera.port || 554,
        username: camera.username || "",
        password: camera.password || "",
        location: camera.location || "",
        description: camera.description || "",
        type: typeof camera.type === "number" ? camera.type : 1,
      });
    }
  }, [camera]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: name === "port" || name === "type" ? parseInt(value) : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validate frontend
    if (!form.name || !form.ipAddress) {
      setError("Name và IP Address là bắt buộc.");
      return;
    }

    try {
      await onSave(form);  // backend lỗi sẽ hiển thị modal, không crash
    } catch (err) {
      let message = err.message || "Failed to save camera";
      setError(message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-xl shadow-lg p-6 w-full max-w-lg">
        <h2 className="text-xl font-semibold mb-4">
          {camera ? "Edit Camera" : "Add Camera"}
        </h2>

        {error && (
          <div className="bg-red-500/20 border border-red-500/30 p-2 rounded-lg text-red-300 text-sm mb-3 whitespace-pre-wrap">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-300 mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg bg-gray-700 text-white"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-300 mb-1">IP Address</label>
              <input
                type="text"
                name="ipAddress"
                value={form.ipAddress}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg bg-gray-700 text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">Port</label>
              <input
                type="number"
                name="port"
                value={form.port}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg bg-gray-700 text-white"
                min={1}
                max={65535}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-300 mb-1">Username</label>
              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg bg-gray-700 text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg bg-gray-700 text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Location</label>
            <input
              type="text"
              name="location"
              value={form.location}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg bg-gray-700 text-white"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg bg-gray-700 text-white"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Camera Type</label>
            <select
              name="type"
              value={form.type}
              onChange={(e) => setForm({ ...form, type: parseInt(e.target.value) })}
              className="w-full px-3 py-2 rounded-lg bg-gray-700 text-white"
            >
              <option value={1}>IP</option>
              <option value={2}>USB</option>
              <option value={3}>Analog</option>
              <option value={4}>PTZ</option>
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

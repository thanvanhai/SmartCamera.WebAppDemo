const API_BASE = 'https://localhost:7217/api';

export const api = {
  login: async (credentials) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    if (!res.ok) throw new Error('Login failed');
    return res.json();
  },

  getCameras: async (token) => {
    const res = await fetch(`${API_BASE}/cameras`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Failed to fetch cameras');
    return res.json();
  },

  createCamera: async (token, camera) => {
    const res = await fetch(`${API_BASE}/cameras`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(camera),
    });
    if (!res.ok) {
      let text = "";
      try { text = await res.text(); } catch {}
      throw new Error(text || 'Failed to create camera');
    }
    return res.json();
  },

  updateCamera: async (token, id, camera) => {
    const res = await fetch(`${API_BASE}/cameras/${id}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(camera),
    });
    if (!res.ok) {
      let text = "";
      try { text = await res.text(); } catch {}
      throw new Error(text || 'Failed to update camera');
    }
    return res.json();
  },

  deleteCamera: async (token, id) => {
    const res = await fetch(`${API_BASE}/cameras/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.ok;
  },

  getRecordings: async (token, cameraId) => {
    const res = await fetch(`${API_BASE}/recordings${cameraId ? `/camera/${cameraId}` : ''}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Failed to fetch recordings');
    return res.json();
  },

  getUsers: async (token) => {
    const res = await fetch(`${API_BASE}/users`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Failed to fetch users');
    return res.json();
  },
};

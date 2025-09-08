import React, { useState } from "react";
import { Shield, User, Eye, EyeOff, AlertTriangle, Lock } from "lucide-react";
import { api } from "../services/api";

export default function LoginForm({ onLogin }) {
  const [credentials, setCredentials] = useState({
    username: "admin",
    password: "Admin@123",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const result = await api.login(credentials);
      if (result.token) {
        localStorage.setItem("token", result.token); // lưu token
        onLogin(result);
      } else {
        setError("Login failed. Please check credentials.");
      }
    } catch {
      setError("Connection error. Check API at https://localhost:7217");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 p-6">
      <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl w-full max-w-md p-8 border border-white/20">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Camera Monitor</h1>
          <p className="text-blue-200">AI-Powered Security System</p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-6">
          {/* Username */}
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-300 w-5 h-5" />
            <input
              type="text"
              value={credentials.username}
              onChange={(e) =>
                setCredentials({ ...credentials, username: e.target.value })
              }
              placeholder="Username"
              className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-200 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

          {/* Password */}
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-300 w-5 h-5" />
            <input
              type={showPassword ? "text" : "password"}
              value={credentials.password}
              onChange={(e) =>
                setCredentials({ ...credentials, password: e.target.value })
              }
              placeholder="Password"
              className="w-full pl-12 pr-12 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-200 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-300"
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </button>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-3 text-red-200 text-sm flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition text-white py-3 rounded-xl font-semibold shadow-lg"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* Demo note */}
        <div className="mt-6 text-center text-blue-200 text-sm">
          Demo credentials: <span className="font-mono">admin / Admin@123</span>
        </div>
      </div>
    </div>
  );
}

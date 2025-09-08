import React, { useState } from "react";
import LoginForm from "./components/LoginForm";
import Dashboard from "./pages/Dashboard";

export default function App() {
  const [auth, setAuth] = useState(null);

  const handleLogin = (authData) => setAuth(authData);
  const handleLogout = () => setAuth(null);

  return auth ? (
    <Dashboard user={{ username: auth.username || "Admin" }} token={auth.token} onLogout={handleLogout} />
  ) : (
    <LoginForm onLogin={handleLogin} />
  );
}

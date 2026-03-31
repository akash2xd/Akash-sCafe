// frontend/src/components/AdminLogin.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL;

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');
      localStorage.setItem('klubnikaAdminToken', data.token);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0d0b08] text-[#f0e6d8]">
      <div className="w-full max-w-md p-8 glass-card glow-warm-sm">
        <h2 className="text-3xl font-extrabold text-center mb-8 font-heading">
          Admin Login
        </h2>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-[#b8a898] mb-1">Username</label>
            <input
              type="text" value={username} onChange={(e) => setUsername(e.target.value)} required
              className="input-field" placeholder="admin"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#b8a898] mb-1">Password</label>
            <input
              type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
              className="input-field" placeholder="••••••••"
            />
          </div>

          {error && <p className="text-center text-[#e85d75]">{error}</p>}

          <button type="submit" disabled={loading} className="button-primary w-full cursor-pointer">
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axiosInstance';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      const { data } = await api.post('/auth/login', { username, password });
      login(data.token, data.username);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials');
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1 className="login-title">Mini CRM</h1>
        <p className="login-subtitle">Admin Login</p>

        {error && <p className="login-error">{error}</p>}

        <form onSubmit={handleSubmit}>
          <label className="login-field">
            <span className="login-label">Username</span>
            <input
              type="text"
              placeholder="admin"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </label>

          <label className="login-field">
            <span className="login-label">Password</span>
            <input
              type="password"
              placeholder="Minicrm@2026"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>

          <button type="submit" className="login-btn">Log In</button>
        </form>
      </div>
    </div>
  );
}

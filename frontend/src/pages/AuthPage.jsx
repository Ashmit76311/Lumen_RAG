import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import Logo from '../components/ui/Logo';
import './AuthPage.css';

export default function AuthPage() {
  const [mode, setMode] = useState('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (mode === 'signup' && password !== confirmPassword) {
      setError("Passwords don't match");
      setIsLoading(false);
      return;
    }

    try {
      const endpoint = mode === 'login' ? '/auth/login' : '/auth/register';
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      
      const response = await fetch(`${apiUrl}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Authentication failed");
      }

      if (mode === 'signup') {
        setMode('login');
        setPassword('');
        setConfirmPassword('');
        // TODO: Toast success
      } else {
        localStorage.setItem('lumen_token', data.token);
        navigate('/chat');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container bg-dot-grid">
      <div className="auth-card">
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '32px' }}>
          <Logo size="large" />
        </div>
        
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#F9FAFB', marginBottom: '8px' }}>
            {mode === 'login' ? 'Welcome back' : 'Create an account'}
          </h2>
          <p style={{ color: '#9CA3AF', fontSize: '14px', fontFamily: "'Inter', sans-serif" }}>
            {mode === 'login' ? 'Sign in to chat with your documents' : 'Sign up to start chatting with your files'}
          </p>
        </div>

        <div className="auth-toggle" style={{ marginBottom: '24px' }}>
          <button 
            type="button"
            className={`auth-toggle-btn ${mode === 'login' ? 'active' : 'inactive'}`}
            onClick={() => { setMode('login'); setError(null); }}
          >
            Login
          </button>
          <button 
            type="button"
            className={`auth-toggle-btn ${mode === 'signup' ? 'active' : 'inactive'}`}
            onClick={() => { setMode('signup'); setError(null); }}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="auth-input-group">
            <label>Username</label>
            <input 
              type="text" 
              className="auth-input" 
              placeholder="you@example.com" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="auth-input-group">
            <label>Password</label>
            <div className="password-wrapper">
              <input 
                type={showPassword ? "text" : "password"} 
                className="auth-input" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button 
                type="button" 
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {mode === 'signup' && (
            <div className="auth-input-group">
              <label>Confirm Password</label>
              <div className="password-wrapper">
                <input 
                  type={showPassword ? "text" : "password"} 
                  className="auth-input" 
                  placeholder="••••••••" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>
          )}

          <button 
            type="submit" 
            className="btn-primary" 
            disabled={isLoading || !username || !password || (mode === 'signup' && !confirmPassword)}
            style={{ marginTop: '8px' }}
          >
            {isLoading ? 'Processing...' : (mode === 'login' ? 'Launch app →' : 'Create account →')}
          </button>
        </form>

        {error && (
          <div className="auth-error" style={{ marginTop: '16px' }}>
            {error}
          </div>
        )}
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import {
  X,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Wrench,
  Gauge
} from 'lucide-react';
import { api } from '../services/api';

export function AuthModal({
  isOpen,
  onClose,
  initialMode = 'signin',
  onSuccess
}) {
  const [mode, setMode] = useState(initialMode); // 'signin' | 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('Garage Master');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    setMode(initialMode);
    setErrorMsg('');
    setSuccessMsg('');
  }, [initialMode, isOpen]);

  if (!isOpen) return null;

  // Compute password strength
  const getPasswordStrength = (pass) => {
    if (!pass) return 0;
    let score = 0;
    if (pass.length >= 6) score += 1;
    if (pass.length >= 10) score += 1;
    if (/[A-Z]/.test(pass) || /[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;
    return score; // 0 to 4
  };

  const strength = getPasswordStrength(password);
  const strengthLabels = ['Too short', 'Weak', 'Good', 'Strong', 'Ultra Secure'];
  const strengthColors = ['#94a3b8', '#ef4444', '#f59e0b', '#10b981', '#059669'];

  const handleDemoSignIn = async () => {
    setErrorMsg('');
    setSuccessMsg('');
    setEmail('24eg105t34@anurag.edu.in');
    setPassword('password123');
    setLoading(true);
    try {
      const res = await api.login({
        email: '24eg105t34@anurag.edu.in',
        password: 'password123'
      });
      setSuccessMsg('Welcome back, Geethika! Loading your garage fleet...');
      setTimeout(() => {
        if (onSuccess) onSuccess(res.user);
        onClose();
      }, 700);
    } catch (err) {
      setErrorMsg(err.message || 'Demo sign-in failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!email.trim() || !password) {
      setErrorMsg('Please enter both email address and password');
      return;
    }

    setLoading(true);
    try {
      const res = await api.login({ email, password });
      setSuccessMsg(`Welcome back, ${res.user.fullName}! Entering garage...`);
      setTimeout(() => {
        if (onSuccess) onSuccess(res.user);
        onClose();
      }, 700);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to sign in. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!fullName.trim()) {
      setErrorMsg('Please enter your full name');
      return;
    }
    if (!email.trim()) {
      setErrorMsg('Please enter a valid email address');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const res = await api.register({
        fullName: fullName.trim(),
        email: email.trim(),
        password,
        role
      });
      setSuccessMsg(`Account created successfully! Welcome to ModVault, ${res.user.fullName}!`);
      setTimeout(() => {
        if (onSuccess) onSuccess(res.user);
        onClose();
      }, 800);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to register account');
    } finally {
      setLoading(false);
    }
  };

  const avatarInitial = fullName.trim() ? fullName.trim().charAt(0).toUpperCase() : (email.trim() ? email.trim().charAt(0).toUpperCase() : 'M');

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-box auth-modal-box"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: 480, padding: '28px 26px' }}
      >
        {/* Top Header Bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.35)'
              }}
            >
              <Gauge size={20} />
            </div>
            <div>
              <div style={{ fontSize: 17, fontWeight: 700, letterSpacing: '-0.3px', color: 'var(--text-main)' }}>
                ModVault Garage Access
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-sub)' }}>
                {mode === 'signin' ? 'Sign in to access your build planner & fleet' : 'Create an account to track your builds & garage'}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="icon-btn"
            style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}
            title="Close"
          >
            <X size={19} />
          </button>
        </div>

        {/* Tab switch between Sign In & Sign Up */}
        <div className="auth-tabs-container">
          <button
            type="button"
            className={`auth-tab-button ${mode === 'signin' ? 'active' : ''}`}
            onClick={() => { setMode('signin'); setErrorMsg(''); setSuccessMsg(''); }}
          >
            Sign In
          </button>
          <button
            type="button"
            className={`auth-tab-button ${mode === 'signup' ? 'active' : ''}`}
            onClick={() => { setMode('signup'); setErrorMsg(''); setSuccessMsg(''); }}
          >
            Create Account
          </button>
        </div>

        {/* Quick Demo Login Pill */}
        <div
          onClick={handleDemoSignIn}
          className="auth-demo-banner"
          title="Click to sign in immediately with demo credentials"
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Sparkles size={16} color="#2563eb" />
            <div>
              <div style={{ fontSize: 12.5, fontWeight: 600, color: '#1e40af' }}>
                One-Click Demo Login as Geethika
              </div>
              <div style={{ fontSize: 11, color: '#64748b' }}>
                24eg105t34@anurag.edu.in (Pre-filled Garage Fleet)
              </div>
            </div>
          </div>
          <span className="auth-demo-badge">Instant Access →</span>
        </div>

        {/* Status messages */}
        {errorMsg && (
          <div className="auth-alert error">
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="auth-alert success">
            <CheckCircle2 size={16} style={{ flexShrink: 0 }} />
            <span>{successMsg}</span>
          </div>
        )}

        {/* FORM CONTENT */}
        {mode === 'signin' ? (
          <form onSubmit={handleSignIn}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div className="auth-input-wrapper">
                <Mail size={16} className="auth-input-icon" />
                <input
                  type="email"
                  className="form-input auth-styled-input"
                  placeholder="e.g. 24eg105t34@anurag.edu.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoFocus
                />
              </div>
            </div>

            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <label className="form-label" style={{ marginBottom: 0 }}>Password</label>
                <button
                  type="button"
                  onClick={() => alert('For demo, use password: password123')}
                  style={{ background: 'none', border: 'none', color: '#2563eb', fontSize: 11.5, cursor: 'pointer', padding: 0 }}
                >
                  Forgot password?
                </button>
              </div>
              <div className="auth-input-wrapper">
                <Lock size={16} className="auth-input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-input auth-styled-input"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="auth-password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '14px 0 20px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12.5, color: 'var(--text-sub)', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  style={{ accentColor: '#2563eb' }}
                />
                Remember me on this device
              </label>
              <span style={{ fontSize: 11.5, color: '#10b981', display: 'flex', alignItems: 'center', gap: 4 }}>
                <ShieldCheck size={13} /> Secure SSL & JWT
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary auth-submit-btn"
            >
              {loading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>Sign In to Garage</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>

            <div style={{ textAlign: 'center', marginTop: 18, fontSize: 12.5, color: 'var(--text-sub)' }}>
              Don't have an account yet?{' '}
              <button
                type="button"
                onClick={() => { setMode('signup'); setErrorMsg(''); setSuccessMsg(''); }}
                style={{ background: 'none', border: 'none', color: '#2563eb', fontWeight: 600, cursor: 'pointer', padding: 0 }}
              >
                Sign Up
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleSignUp}>
            {/* Dynamic Avatar Preview */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16, padding: '10px 14px', background: 'var(--bg-main)', borderRadius: 10, border: '1px solid var(--border-color)' }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  backgroundColor: '#2563eb',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: 18,
                  boxShadow: '0 3px 10px rgba(37, 99, 235, 0.3)'
                }}
              >
                {avatarInitial}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-main)' }}>
                  {fullName.trim() || 'Driver Name'}
                </div>
                <div style={{ fontSize: 11.5, color: '#64748b' }}>
                  Role: <span style={{ color: '#2563eb', fontWeight: 600 }}>{role}</span>
                </div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Full Name</label>
              <div className="auth-input-wrapper">
                <User size={16} className="auth-input-icon" />
                <input
                  type="text"
                  className="form-input auth-styled-input"
                  placeholder="e.g. Geethika or Alex Rivera"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  autoFocus
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div className="auth-input-wrapper">
                <Mail size={16} className="auth-input-icon" />
                <input
                  type="email"
                  className="form-input auth-styled-input"
                  placeholder="e.g. driver@garage.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Garage Role Selector */}
            <div className="form-group">
              <label className="form-label">Garage Role</label>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {[
                  { name: 'Garage Master', icon: '👑' },
                  { name: 'Performance Tuner', icon: '🏎️' },
                  { name: 'Mechanic', icon: '🔧' }
                ].map((r) => (
                  <button
                    key={r.name}
                    type="button"
                    onClick={() => setRole(r.name)}
                    className={`auth-role-chip ${role === r.name ? 'active' : ''}`}
                  >
                    <span>{r.icon}</span>
                    <span>{r.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password (min 6 chars)</label>
              <div className="auth-input-wrapper">
                <Lock size={16} className="auth-input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-input auth-styled-input"
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="auth-password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {/* Password strength bar */}
              {password && (
                <div style={{ marginTop: 6 }}>
                  <div style={{ display: 'flex', height: 4, borderRadius: 2, background: 'var(--border-color)', overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${(strength / 4) * 100}%`,
                        backgroundColor: strengthColors[strength],
                        transition: 'width 0.3s'
                      }}
                    />
                  </div>
                  <div style={{ fontSize: 11, color: strengthColors[strength], marginTop: 3, fontWeight: 500 }}>
                    Strength: {strengthLabels[strength]}
                  </div>
                </div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <div className="auth-input-wrapper">
                <Lock size={16} className="auth-input-icon" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  className="form-input auth-styled-input"
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="auth-password-toggle-btn"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  title={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {confirmPassword && (
                <div style={{ fontSize: 11.5, marginTop: 4, color: password === confirmPassword ? '#10b981' : '#ef4444' }}>
                  {password === confirmPassword ? '✓ Passwords match' : '✗ Passwords do not match'}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary auth-submit-btn"
              style={{ marginTop: 8 }}
            >
              {loading ? (
                <span>Creating Account...</span>
              ) : (
                <>
                  <span>Create ModVault Account</span>
                  <CheckCircle2 size={16} />
                </>
              )}
            </button>

            <div style={{ textAlign: 'center', marginTop: 18, fontSize: 12.5, color: 'var(--text-sub)' }}>
              Already registered?{' '}
              <button
                type="button"
                onClick={() => { setMode('signin'); setErrorMsg(''); setSuccessMsg(''); }}
                style={{ background: 'none', border: 'none', color: '#2563eb', fontWeight: 600, cursor: 'pointer', padding: 0 }}
              >
                Sign In
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

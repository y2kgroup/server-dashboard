import React, { useState } from 'react';
import GoogleSignIn from './GoogleSignIn';
import './LoginScreen.css';

interface LoginScreenProps {
  onSignIn: () => Promise<void>;
  loading: boolean;
  error: string;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onSignIn, loading, error }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [useFallback, setUseFallback] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      await onSignIn();
    } catch (err) {
      console.error('Google sign-in error:', err);
    }
  };

  return (
    <div className="login-screen">
      <div className="login-box">
        <div className="login-logo">⚡ Y2K Group</div>
        <div className="login-title">Server Management Dashboard</div>
        <div className="login-subtitle">Sign in to continue</div>

        {!useFallback ? (
          <>
            <GoogleSignIn onSignIn={handleGoogleSignIn} loading={loading} />
            {error && <div className="login-error">{error}</div>}

            <div className="login-divider">
              <span>or</span>
            </div>

            <button
              className="fallback-link-btn"
              onClick={() => setUseFallback(true)}
            >
              Use email and password instead
            </button>

            <div className="login-note">
              🔒 Secure sign-in with Google SSO
            </div>
          </>
        ) : (
          <>
            <input
              className="login-input"
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            <input
              className="login-input"
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  // Handle fallback login
                  console.log('Fallback login for:', email);
                }
              }}
            />
            {error && <div className="login-error">{error}</div>}

            <div className="login-note" style={{ marginTop: '12px', fontSize: '13px', color: '#64748b' }}>
              ⚠️ Email/password login is for backup access only
            </div>

            <button
              className="back-to-google-btn"
              onClick={() => setUseFallback(false)}
            >
              ← Back to Google Sign-In
            </button>
          </>
        )}

        <div className="login-footer">
          Access restricted to Y2K Group members only.
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
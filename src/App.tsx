import { useState, useEffect, useCallback } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginScreen from './components/LoginScreen';
import AuthCallback from './pages/AuthCallback';
import './App.css';

// Types
interface ChatMessage {
  role: 'user' | 'assistant';
  text: string;
  time: string;
}

interface SupabaseUser {
  id: string;
  email: string;
  user_metadata: {
    role?: string;
    [key: string]: any;
  };
  created_at: string;
}

const QUICK_LINKS = [
  { label: 'Portainer', url: 'https://76.13.98.118:9443', icon: '🐳', desc: 'Docker Manager' },
  { label: 'Nginx Proxy Manager', url: 'http://76.13.98.118:81', icon: '🔀', desc: 'Subdomain & SSL' },
  { label: 'Supabase Studio', url: `https://admin-db.y2khost.com`, icon: '🗄️', desc: 'Database Manager' },
];

const CONTAINERS = [
  { name: 'portainer', status: 'running' },
  { name: 'npm', status: 'running' },
  { name: 'Supabase-VPS-Admin-db', status: 'running' },
  { name: 'Supabase-VPS-Admin-rest', status: 'running' },
  { name: 'Supabase-VPS-Admin-studio', status: 'running' },
  { name: 'Supabase-VPS-Admin-meta', status: 'running' },
];

// Dashboard Component
const Dashboard: React.FC = () => {
  const { isAdmin, user, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'chat' | 'users'>('dashboard');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { role: 'assistant', text: 'Hello! I am David, your Y2K Group assistant. How can I help you today?', time: new Date().toLocaleTimeString() }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatMode, setChatMode] = useState<'chat' | 'embed'>('chat');

  // User management state
  const [users, setUsers] = useState<SupabaseUser[]>([]);
  const [userMsg, setUserMsg] = useState('');
  const [loadingUsers, setLoadingUsers] = useState(false);

  const loadUsers = useCallback(async () => {
    if (!isAdmin) return;

    setLoadingUsers(true);
    try {
      // Note: This requires the service_role key to list all users
      // For now, we'll show a message about admin requirements
      const response = await fetch('https://api.y2khost.com/auth/v1/admin/users', {
        headers: {
          'apikey': process.env.REACT_APP_SUPABASE_SERVICE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic2VydmljZV9yb2xlIiwiaWF0IjoxNjEzNTMxOTg1LCJleHAiOjE5MjkxMDc5ODV9.th84OKK0Hwa4Xws8SwlyoSD7ROqS4_z8hL91qJr6few',
          'Authorization': `Bearer ${process.env.REACT_APP_SUPABASE_SERVICE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic2VydmljZV9yb2xlIiwiaWF0IjoxNjEzNTMxOTg1LCJleHAiOjE5MjkxMDc5ODV9.th84OKK0Hwa4Xws8SwlyoSD7ROqS4_z8hL91qJr6few'}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
      } else {
        setUserMsg('⚠️ Admin access requires service role permissions');
      }
    } catch (error) {
      console.error('Error loading users:', error);
      setUserMsg('❌ Failed to load users. Check console for details.');
    } finally {
      setLoadingUsers(false);
    }
  }, [isAdmin]);

  useEffect(() => {
    if (isAdmin && activeTab === 'users') {
      loadUsers();
    }
  }, [activeTab, isAdmin, loadUsers]);

  const updateUserRole = async (userId: string, newRole: string) => {
    try {
      const serviceKey = process.env.REACT_APP_SUPABASE_SERVICE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic2VydmljZV9yb2xlIiwiaWF0IjoxNjEzNTMxOTg1LCJleHAiOjE5MjkxMDc5ODV9.th84OKK0Hwa4Xws8SwlyoSD7ROqS4_z8hL91qJr6few';
      const response = await fetch(`https://api.y2khost.com/auth/v1/admin/users/${userId}`, {
        method: 'PUT',
        headers: {
          'apikey': serviceKey,
          'Authorization': `Bearer ${serviceKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_metadata: { role: newRole }
        })
      });

      if (response.ok) {
        setUserMsg(`✅ User role updated to ${newRole}`);
        loadUsers();
      } else {
        setUserMsg('❌ Failed to update user role');
      }
    } catch (error) {
      console.error('Error updating user role:', error);
      setUserMsg('❌ Failed to update user role');
    }
  };

  const sendMessage = () => {
    if (!chatInput.trim()) return;
    setChatMessages(prev => [...prev, { role: 'user', text: chatInput, time: new Date().toLocaleTimeString() }]);
    setChatInput('');
    setTimeout(() => setChatMessages(prev => [...prev, { role: 'assistant', text: 'I received your message. To enable full AI responses, the OpenClaw API integration needs to be configured.', time: new Date().toLocaleTimeString() }]), 800);
  };

  if (!user) return null;

  return (
    <div className="app">
      <header className="header">
        <div className="header-left">
          <span className="logo">⚡ Y2K Group</span>
          <span className="subtitle">Server Management Dashboard</span>
        </div>
        <div className="header-right">
          <span className="user-badge">👤 {user.email}</span>
          <span className={`role-badge ${isAdmin ? 'admin' : 'user'}`}>{isAdmin ? 'Admin' : 'User'}</span>
          <button className="logout-btn" onClick={() => signOut()}>Sign Out</button>
        </div>
      </header>

      <nav className="nav-tabs">
        <button className={activeTab === 'dashboard' ? 'tab active' : 'tab'} onClick={() => setActiveTab('dashboard')}>📊 Dashboard</button>
        <button className={activeTab === 'chat' ? 'tab active' : 'tab'} onClick={() => setActiveTab('chat')}>💬 Chat with David</button>
        {isAdmin && <button className={activeTab === 'users' ? 'tab active' : 'tab'} onClick={() => setActiveTab('users')}>👥 User Management</button>}
      </nav>

      {activeTab === 'dashboard' && (
        <main className="main">
          <section className="section">
            <h2>🔗 Quick Access</h2>
            <div className="cards">
              {QUICK_LINKS.map(link => (
                <a key={link.label} href={link.url} target="_blank" rel="noreferrer" className="card link-card">
                  <span className="card-icon">{link.icon}</span>
                  <div><div className="card-title">{link.label}</div><div className="card-desc">{link.desc}</div></div>
                  <span className="arrow">↗</span>
                </a>
              ))}
            </div>
          </section>
          <section className="section">
            <h2>🐳 Container Status — server-management Stack</h2>
            <div className="container-list">
              {CONTAINERS.map(c => (
                <div key={c.name} className="container-item">
                  <span className="status-dot green"></span>
                  <span className="container-name">{c.name}</span>
                  <span className="status-badge running">{c.status}</span>
                </div>
              ))}
            </div>
          </section>
          <section className="section">
            <h2>🖥️ Server Info</h2>
            <div className="cards">
              <div className="card info-card"><div className="card-title">VPS IP</div><div className="card-value">76.13.98.118</div></div>
              <div className="card info-card"><div className="card-title">Domain</div><div className="card-value">y2khost.com</div></div>
              <div className="card info-card"><div className="card-title">Stack</div><div className="card-value">server-management</div></div>
              <div className="card info-card"><div className="card-title">SSL</div><div className="card-value">✅ Active</div></div>
            </div>
          </section>
        </main>
      )}

      {activeTab === 'chat' && (
        <main className="main chat-main">
          <div className="chat-mode-toggle">
            <button className={chatMode === 'chat' ? 'mode-btn active' : 'mode-btn'} onClick={() => setChatMode('chat')}>💬 Quick Chat</button>
            <button className={chatMode === 'embed' ? 'mode-btn active' : 'mode-btn'} onClick={() => setChatMode('embed')}>🖥️ Full OpenClaw UI</button>
          </div>
          {chatMode === 'chat' && (
            <div className="chat-container">
              <div className="chat-messages">
                {chatMessages.map((msg, i) => (
                  <div key={i} className={`message ${msg.role}`}>
                    <div className="message-bubble">
                      <span className="message-sender">{msg.role === 'assistant' ? '🤖 David' : '👤 You'}</span>
                      <p>{msg.text}</p>
                      <span className="message-time">{msg.time}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="chat-input-row">
                <input className="chat-input" value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendMessage()} placeholder="Type a message to David..." />
                <button className="send-btn" onClick={sendMessage}>Send ➤</button>
              </div>
            </div>
          )}
          {chatMode === 'embed' && (
            <div className="embed-container">
              <iframe src="https://76.13.98.118" title="OpenClaw Control UI" className="openclaw-embed" allow="microphone" />
            </div>
          )}
        </main>
      )}

      {activeTab === 'users' && isAdmin && (
        <main className="main">
          <section className="section">
            <h2>👥 User Management</h2>
            <div className="user-info">
              <div className="info-text">
                Users are managed through Supabase Auth. Use the interface below to update user roles.
                All users can sign in with Google SSO. Admin users have access to user management.
              </div>
            </div>
            {userMsg && <div className="user-msg">{userMsg}</div>}
            {loadingUsers ? (
              <div className="loading">Loading users...</div>
            ) : (
              <div className="container-list" style={{ marginTop: '16px' }}>
                {users.length === 0 && (
                  <div className="container-item" style={{ color: '#64748b' }}>
                    No users found or admin permissions not configured.
                  </div>
                )}
                {users.map(u => (
                  <div key={u.id} className="container-item">
                    <span className="status-dot green"></span>
                    <span className="container-name">{u.email}</span>
                    <span className={`status-badge ${u.user_metadata?.role === 'admin' ? 'admin' : 'running'}`}>
                      {u.user_metadata?.role || 'user'}
                    </span>
                    {u.email !== user?.email && (
                      <select
                        className="role-select"
                        value={u.user_metadata?.role || 'user'}
                        onChange={(e) => updateUserRole(u.id, e.target.value)}
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
        </main>
      )}
    </div>
  );
};

// Login Page Component
const LoginPage: React.FC = () => {
  const { signInWithGoogle, loading } = useAuth();
  const [error, setError] = useState('');

  const handleSignIn = async () => {
    setError('');
    try {
      await signInWithGoogle();
    } catch (err) {
      setError('Failed to sign in with Google. Please try again.');
    }
  };

  return <LoginScreen onSignIn={handleSignIn} loading={loading} error={error} />;
};

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '18px',
        color: '#64748b'
      }}>
        Loading...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// Main App Component
const AppContent: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
};

// Wrap with AuthProvider
const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
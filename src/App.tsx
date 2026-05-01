import React, { useState, useEffect } from 'react';
import './App.css';

// Types
interface User {
  id: string;
  email: string;
  role: string;
  created_at: string;
  is_active: boolean;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  text: string;
  time: string;
}

const SUPABASE_URL = 'https://api.y2kgroup.cloud';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic2VydmljZV9yb2xlIiwiaWF0IjoxNjEzNTMxOTg1LCJleHAiOjE5MjkxMDc5ODV9.th84OKK0Hwa4Xws8SwlyoSD7ROqS4_z8hL91qJr6few';

const QUICK_LINKS = [
  { label: 'Portainer', url: 'https://76.13.98.118:9443', icon: '🐳', desc: 'Docker Manager' },
  { label: 'Nginx Proxy Manager', url: 'http://76.13.98.118:81', icon: '🔀', desc: 'Subdomain & SSL' },
  { label: 'Supabase Studio', url: 'https://admin-db.y2kgroup.cloud', icon: '🗄️', desc: 'Database Manager' },
];

const CONTAINERS = [
  { name: 'portainer', status: 'running' },
  { name: 'npm', status: 'running' },
  { name: 'Supabase-VPS-Admin-db', status: 'running' },
  { name: 'Supabase-VPS-Admin-rest', status: 'running' },
  { name: 'Supabase-VPS-Admin-studio', status: 'running' },
  { name: 'Supabase-VPS-Admin-meta', status: 'running' },
];

// Simple hash function for demo (in production use proper bcrypt via backend)
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

function LoginScreen({ onLogin, loading, error }: { onLogin: (e: string, p: string) => void; loading: boolean; error: string }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  return (
    <div className="login-screen">
      <div className="login-box">
        <div className="login-logo">⚡ Y2K Group</div>
        <div className="login-title">Server Management Dashboard</div>
        <div className="login-subtitle">Sign in to continue</div>
        <input className="login-input" type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <input className="login-input" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === 'Enter' && onLogin(email, password)} />
        {error && <div className="login-error">{error}</div>}
        <button className="login-btn" onClick={() => onLogin(email, password)} disabled={loading}>{loading ? 'Signing in...' : 'Sign In →'}</button>
        <div className="login-note">Access restricted to Y2K Group members only.</div>
      </div>
    </div>
  );
}

function App() {
  const [currentUser, setCurrentUser] = useState<{ email: string; role: string } | null>(null);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'chat' | 'users'>('dashboard');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { role: 'assistant', text: 'Hello! I am David, your Y2K Group assistant. How can I help you today?', time: new Date().toLocaleTimeString() }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatMode, setChatMode] = useState<'chat' | 'embed'>('chat');
  const [users, setUsers] = useState<User[]>([]);
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState('user');
  const [userMsg, setUserMsg] = useState('');

  const handleLogin = async (email: string, password: string) => {
    setLoginLoading(true);
    setLoginError('');
    try {
      // Verify against Supabase auth.users table via REST API
      const hash = await hashPassword(password);
      const res = await fetch(`${SUPABASE_URL}/auth/users?email=eq.${encodeURIComponent(email)}&is_active=eq.true&select=email,role`, {
        headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` }
      });
      const data = await res.json();
      // For initial setup, check against known admin credentials
      if (email === 'yosi.nuri@y2kgroupit.com' && password === '+NimUv.uO4K3Wr;&DR&6') {
        setCurrentUser({ email, role: 'admin' });
      } else if (data && data.length > 0) {
        setCurrentUser({ email: data[0].email, role: data[0].role });
      } else {
        setLoginError('Invalid email or password.');
      }
    } catch {
      setLoginError('Connection error. Please try again.');
    }
    setLoginLoading(false);
  };

  const loadUsers = async () => {
    try {
      const res = await fetch(`${SUPABASE_URL}/auth/users?select=id,email,role,created_at,is_active&order=created_at.desc`, {
        headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` }
      });
      const data = await res.json();
      if (Array.isArray(data)) setUsers(data);
    } catch { setUsers([]); }
  };

  useEffect(() => {
    if (currentUser && activeTab === 'users') loadUsers();
  }, [activeTab, currentUser]);

  const addUser = async () => {
    if (!newEmail || !newPassword) { setUserMsg('Email and password required.'); return; }
    const hash = await hashPassword(newPassword);
    const res = await fetch(`${SUPABASE_URL}/auth/users`, {
      method: 'POST',
      headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}`, 'Content-Type': 'application/json', 'Prefer': 'return=representation' },
      body: JSON.stringify({ email: newEmail, password_hash: hash, role: newRole })
    });
    if (res.ok) { setUserMsg(`✅ User ${newEmail} created.`); setNewEmail(''); setNewPassword(''); loadUsers(); }
    else { setUserMsg('❌ Failed to create user. Email may already exist.'); }
  };

  const removeUser = async (id: string, email: string) => {
    if (email === 'yosi.nuri@y2kgroupit.com') { setUserMsg('❌ Cannot remove admin account.'); return; }
    const res = await fetch(`${SUPABASE_URL}/auth/users?id=eq.${id}`, {
      method: 'DELETE',
      headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` }
    });
    if (res.ok) { setUserMsg(`✅ User ${email} removed.`); loadUsers(); }
    else setUserMsg('❌ Failed to remove user.');
  };

  const sendMessage = () => {
    if (!chatInput.trim()) return;
    setChatMessages(prev => [...prev, { role: 'user', text: chatInput, time: new Date().toLocaleTimeString() }]);
    setChatInput('');
    setTimeout(() => setChatMessages(prev => [...prev, { role: 'assistant', text: 'I received your message. To enable full AI responses, the OpenClaw API integration needs to be configured.', time: new Date().toLocaleTimeString() }]), 800);
  };

  if (!currentUser) return <LoginScreen onLogin={handleLogin} loading={loginLoading} error={loginError} />;

  return (
    <div className="app">
      <header className="header">
        <div className="header-left">
          <span className="logo">⚡ Y2K Group</span>
          <span className="subtitle">Server Management Dashboard</span>
        </div>
        <div className="header-right">
          <span className="user-badge">👤 {currentUser.email}</span>
          <button className="logout-btn" onClick={() => setCurrentUser(null)}>Sign Out</button>
        </div>
      </header>

      <nav className="nav-tabs">
        <button className={activeTab === 'dashboard' ? 'tab active' : 'tab'} onClick={() => setActiveTab('dashboard')}>📊 Dashboard</button>
        <button className={activeTab === 'chat' ? 'tab active' : 'tab'} onClick={() => setActiveTab('chat')}>💬 Chat with David</button>
        {currentUser.role === 'admin' && <button className={activeTab === 'users' ? 'tab active' : 'tab'} onClick={() => setActiveTab('users')}>👥 User Management</button>}
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
              <div className="card info-card"><div className="card-title">Domain</div><div className="card-value">y2kgroup.cloud</div></div>
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

      {activeTab === 'users' && (
        <main className="main">
          <section className="section">
            <h2>👥 User Management</h2>
            <div className="user-form">
              <input className="login-input" type="email" placeholder="Email" value={newEmail} onChange={e => setNewEmail(e.target.value)} />
              <input className="login-input" type="password" placeholder="Password" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
              <select className="login-input" value={newRole} onChange={e => setNewRole(e.target.value)}>
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
              <button className="login-btn" onClick={addUser}>➕ Add User</button>
            </div>
            {userMsg && <div className="user-msg">{userMsg}</div>}
            <div className="container-list" style={{marginTop: '16px'}}>
              {users.length === 0 && <div className="container-item" style={{color:'#64748b'}}>No users found or loading...</div>}
              {users.map(u => (
                <div key={u.id} className="container-item">
                  <span className={`status-dot ${u.is_active ? 'green' : 'red'}`}></span>
                  <span className="container-name">{u.email}</span>
                  <span className="status-badge running">{u.role}</span>
                  <button className="remove-btn" onClick={() => removeUser(u.id, u.email)}>🗑️ Remove</button>
                </div>
              ))}
            </div>
          </section>
        </main>
      )}
    </div>
  );
}

export default App;

import React, { useState } from 'react';
import './App.css';

// Types
interface Container {
  name: string;
  status: string;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  text: string;
  time: string;
}

// Quick links config
const QUICK_LINKS = [
  { label: 'Portainer', url: 'https://76.13.98.118:9443', icon: '🐳', desc: 'Docker Manager' },
  { label: 'Nginx Proxy Manager', url: 'http://76.13.98.118:81', icon: '🔀', desc: 'Subdomain & SSL' },
  { label: 'Supabase Studio', url: 'https://admin-db.y2kgroup.cloud', icon: '🗄️', desc: 'Database Manager' },
];

const CONTAINERS: Container[] = [
  { name: 'portainer', status: 'running' },
  { name: 'npm', status: 'running' },
  { name: 'Supabase-VPS-Admin-db', status: 'running' },
  { name: 'Supabase-VPS-Admin-rest', status: 'running' },
  { name: 'Supabase-VPS-Admin-studio', status: 'running' },
  { name: 'Supabase-VPS-Admin-meta', status: 'running' },
];

// Allowed users
const ALLOWED_USERS = ['yosi.nuri@y2kgroupit.com'];

function LoginScreen({ onLogin }: { onLogin: (email: string, pass: string) => boolean }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    const ok = onLogin(email, password);
    if (!ok) setError('Invalid email or password.');
  };

  return (
    <div className="login-screen">
      <div className="login-box">
        <div className="login-logo">⚡ Y2K Group</div>
        <div className="login-title">Server Management Dashboard</div>
        <div className="login-subtitle">Sign in to continue</div>
        <input className="login-input" type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <input className="login-input" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleLogin()} />
        {error && <div className="login-error">{error}</div>}
        <button className="login-btn" onClick={handleLogin}>Sign In →</button>
        <div className="login-note">Access restricted to Y2K Group members only.</div>
      </div>
    </div>
  );
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { role: 'assistant', text: 'Hello Yosi! I am David, your Y2K Group assistant. How can I help you today?', time: new Date().toLocaleTimeString() }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatMode, setChatMode] = useState<'chat' | 'embed'>('chat');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'chat'>('dashboard');

  const handleLogin = (email: string, pass: string): boolean => {
    if (ALLOWED_USERS.includes(email.toLowerCase()) && pass === '+NimUv.uO4K3Wr;&DR&6') {
      setIsLoggedIn(true);
      return true;
    }
    return false;
  };

  const sendMessage = () => {
    if (!chatInput.trim()) return;
    const userMsg: ChatMessage = { role: 'user', text: chatInput, time: new Date().toLocaleTimeString() };
    setChatMessages(prev => [...prev, userMsg]);
    setChatInput('');
    setTimeout(() => {
      const reply: ChatMessage = {
        role: 'assistant',
        text: 'I received your message. To enable full AI responses, connect this dashboard to your OpenClaw API.',
        time: new Date().toLocaleTimeString()
      };
      setChatMessages(prev => [...prev, reply]);
    }, 800);
  };

  if (!isLoggedIn) return <LoginScreen onLogin={handleLogin} />;

  return (
    <div className="app">
      <header className="header">
        <div className="header-left">
          <span className="logo">⚡ Y2K Group</span>
          <span className="subtitle">Server Management Dashboard</span>
        </div>
        <div className="header-right">
          <span className="user-badge">👤 Yosi Nuri</span>
          <button className="logout-btn" onClick={() => setIsLoggedIn(false)}>Sign Out</button>
        </div>
      </header>

      <nav className="nav-tabs">
        <button className={activeTab === 'dashboard' ? 'tab active' : 'tab'} onClick={() => setActiveTab('dashboard')}>📊 Dashboard</button>
        <button className={activeTab === 'chat' ? 'tab active' : 'tab'} onClick={() => setActiveTab('chat')}>💬 Chat with David</button>
      </nav>

      {activeTab === 'dashboard' && (
        <main className="main">
          <section className="section">
            <h2>🔗 Quick Access</h2>
            <div className="cards">
              {QUICK_LINKS.map(link => (
                <a key={link.label} href={link.url} target="_blank" rel="noreferrer" className="card link-card">
                  <span className="card-icon">{link.icon}</span>
                  <div>
                    <div className="card-title">{link.label}</div>
                    <div className="card-desc">{link.desc}</div>
                  </div>
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
                  <span className={`status-dot ${c.status === 'running' ? 'green' : 'red'}`}></span>
                  <span className="container-name">{c.name}</span>
                  <span className={`status-badge ${c.status === 'running' ? 'running' : 'stopped'}`}>{c.status}</span>
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
                      <span className="message-sender">{msg.role === 'assistant' ? '🤖 David' : '👤 Yosi'}</span>
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
    </div>
  );
}

export default App;

import React, { useState } from 'react';
import './App.css';

// Types
interface Container {
  name: string;
  status: string;
  url?: string;
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

// Mock container data (in production, this would call your VPS API)
const CONTAINERS: Container[] = [
  { name: 'portainer', status: 'running' },
  { name: 'npm', status: 'running' },
  { name: 'Supabase-VPS-Admin-db', status: 'running' },
  { name: 'Supabase-VPS-Admin-rest', status: 'running' },
  { name: 'Supabase-VPS-Admin-studio', status: 'running' },
  { name: 'Supabase-VPS-Admin-meta', status: 'running' },
];

function App() {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { role: 'assistant', text: 'Hello Yosi! I am David, your Y2K Group assistant. How can I help you today?', time: new Date().toLocaleTimeString() }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatMode, setChatMode] = useState<'chat' | 'embed'>('chat');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'chat'>('dashboard');

  const sendMessage = () => {
    if (!chatInput.trim()) return;
    const userMsg: ChatMessage = { role: 'user', text: chatInput, time: new Date().toLocaleTimeString() };
    setChatMessages(prev => [...prev, userMsg]);
    setChatInput('');
    // Simulate response (in production, call OpenClaw API)
    setTimeout(() => {
      const reply: ChatMessage = {
        role: 'assistant',
        text: 'I received your message. To enable full AI responses, connect this dashboard to your OpenClaw API.',
        time: new Date().toLocaleTimeString()
      };
      setChatMessages(prev => [...prev, reply]);
    }, 800);
  };

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header-left">
          <span className="logo">⚡ Y2K Group</span>
          <span className="subtitle">Server Management Dashboard</span>
        </div>
        <div className="header-right">
          <span className="user-badge">👤 Yosi Nuri</span>
        </div>
      </header>

      {/* Nav Tabs */}
      <nav className="nav-tabs">
        <button className={activeTab === 'dashboard' ? 'tab active' : 'tab'} onClick={() => setActiveTab('dashboard')}>📊 Dashboard</button>
        <button className={activeTab === 'chat' ? 'tab active' : 'tab'} onClick={() => setActiveTab('chat')}>💬 Chat with David</button>
      </nav>

      {/* Dashboard Tab */}
      {activeTab === 'dashboard' && (
        <main className="main">
          {/* Quick Links */}
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

          {/* Container Status */}
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

          {/* Server Info */}
          <section className="section">
            <h2>🖥️ Server Info</h2>
            <div className="cards">
              <div className="card info-card">
                <div className="card-title">VPS IP</div>
                <div className="card-value">76.13.98.118</div>
              </div>
              <div className="card info-card">
                <div className="card-title">Domain</div>
                <div className="card-value">y2kgroup.cloud</div>
              </div>
              <div className="card info-card">
                <div className="card-title">Stack</div>
                <div className="card-value">server-management</div>
              </div>
              <div className="card info-card">
                <div className="card-title">SSL</div>
                <div className="card-value">✅ Active</div>
              </div>
            </div>
          </section>
        </main>
      )}

      {/* Chat Tab */}
      {activeTab === 'chat' && (
        <main className="main chat-main">
          {/* Chat Mode Toggle */}
          <div className="chat-mode-toggle">
            <button className={chatMode === 'chat' ? 'mode-btn active' : 'mode-btn'} onClick={() => setChatMode('chat')}>💬 Quick Chat</button>
            <button className={chatMode === 'embed' ? 'mode-btn active' : 'mode-btn'} onClick={() => setChatMode('embed')}>🖥️ Full OpenClaw UI</button>
          </div>

          {/* Quick Chat */}
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
                <input
                  className="chat-input"
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && sendMessage()}
                  placeholder="Type a message to David..."
                />
                <button className="send-btn" onClick={sendMessage}>Send ➤</button>
              </div>
            </div>
          )}

          {/* Full OpenClaw Embed */}
          {chatMode === 'embed' && (
            <div className="embed-container">
              <iframe
                src="https://76.13.98.118"
                title="OpenClaw Control UI"
                className="openclaw-embed"
                allow="microphone"
              />
            </div>
          )}
        </main>
      )}
    </div>
  );
}

export default App;

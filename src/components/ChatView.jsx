import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Terminal, 
  Code, 
  Heart, 
  Sparkles, 
  Bot, 
  Paperclip, 
  Coffee, 
  GitPullRequest,
  CheckCheck
} from 'lucide-react';
import Badge from './Badge';

export default function ChatView({ activeMatch, profiles, onSendMessage }) {
  const [inputText, setInputText] = useState('');
  const [selectedMatchId, setSelectedMatchId] = useState(activeMatch?.id || 'match-1');
  const messagesEndRef = useRef(null);

  const currentMatch = profiles.find(p => p.id === activeMatch?.profileId) || profiles[0];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeMatch?.messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText);
    setInputText('');
  };

  const insertSnippet = (snippet) => {
    setInputText(prev => prev ? `${prev} ${snippet}` : snippet);
  };

  return (
    <div style={{
      maxWidth: '1000px',
      margin: '0 auto',
      height: 'calc(100vh - 120px)',
      display: 'grid',
      gridTemplateColumns: '320px 1fr',
      gap: '1rem',
      padding: '0.5rem 1rem 1rem 1rem'
    }}>
      {/* Sidebar: Matches List */}
      <div className="glass-panel" style={{
        borderRadius: 'var(--radius-md)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        <div style={{
          padding: '1rem',
          borderBottom: '1px solid var(--border-glass)',
          background: 'rgba(0, 0, 0, 0.2)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: '#c084fc' }}>
            <Terminal size={16} />
            <span>Open Sockets ({profiles.length})</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-faint)', marginTop: '4px' }}>
            Active TCP connections established
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '0.5rem' }}>
          {profiles.map((p, idx) => {
            const isSelected = p.id === currentMatch.id;
            return (
              <div
                key={p.id}
                onClick={() => setSelectedMatchId(p.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer',
                  marginBottom: '0.4rem',
                  background: isSelected ? 'rgba(168, 85, 247, 0.15)' : 'transparent',
                  border: isSelected ? '1px solid rgba(168, 85, 247, 0.4)' : '1px solid transparent',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{ position: 'relative' }}>
                  <img
                    src={p.avatar}
                    alt={p.name}
                    style={{ width: '44px', height: '44px', borderRadius: '12px', objectFit: 'cover' }}
                  />
                  <span style={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    background: '#10b981',
                    border: '2px solid #0a0d14'
                  }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#ffffff' }}>
                      {p.name}
                    </span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-faint)', fontFamily: 'var(--font-mono)' }}>
                      98%
                    </span>
                  </div>
                  <div style={{
                    fontSize: '0.75rem',
                    color: 'var(--text-muted)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    fontFamily: 'var(--font-mono)'
                  }}>
                    @{p.handle}: {p.statusText}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Chat Terminal */}
      <div className="glass-panel" style={{
        borderRadius: 'var(--radius-md)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        {/* Chat Terminal Header */}
        <div style={{
          padding: '0.85rem 1.25rem',
          borderBottom: '1px solid var(--border-glass)',
          background: 'rgba(0, 0, 0, 0.4)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <img 
              src={currentMatch.avatar} 
              alt={currentMatch.name} 
              style={{ width: '38px', height: '38px', borderRadius: '10px', objectFit: 'cover' }} 
            />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#ffffff' }}>{currentMatch.name}</span>
                <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: '#06b6d4' }}>
                  @{currentMatch.handle}
                </span>
              </div>
              <div style={{ fontSize: '0.75rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px', fontFamily: 'var(--font-mono)' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }} />
                <span>SSL TLS 1.3 / E2E Encrypted</span>
              </div>
            </div>
          </div>

          {/* Quick Badges preview */}
          <div style={{ display: 'flex', gap: '0.4rem' }}>
            {currentMatch.tags.slice(0, 2).map(tag => (
              <Badge key={tag.id} tag={tag} size="sm" />
            ))}
          </div>
        </div>

        {/* Message Feed */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          background: 'rgba(5, 7, 12, 0.3)'
        }}>
          {/* PR Merge Notification Banner */}
          <div style={{
            background: 'rgba(168, 85, 247, 0.1)',
            border: '1px solid rgba(168, 85, 247, 0.25)',
            borderRadius: 'var(--radius-sm)',
            padding: '0.75rem 1rem',
            textAlign: 'center',
            fontSize: '0.8rem',
            fontFamily: 'var(--font-mono)',
            color: '#c084fc',
            margin: '0 auto',
            maxWidth: '85%'
          }}>
            <GitPullRequest size={14} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'text-bottom' }} />
            <span>PR Approved: Mutual interest verified with <strong>{currentMatch.compatibilityScore}% Synergy</strong></span>
          </div>

          {activeMatch?.messages?.map((msg) => {
            const isMe = msg.sender === 'me';
            return (
              <div
                key={msg.id}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: isMe ? 'flex-end' : 'flex-start',
                  maxWidth: '75%',
                  alignSelf: isMe ? 'flex-end' : 'flex-start'
                }}
              >
                <div style={{
                  padding: '0.75rem 1rem',
                  borderRadius: isMe ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                  background: isMe 
                    ? 'linear-gradient(135deg, #a855f7 0%, #7e22ce 100%)' 
                    : 'rgba(255, 255, 255, 0.07)',
                  border: isMe ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid var(--border-glass)',
                  color: '#ffffff',
                  fontSize: '0.9rem',
                  lineHeight: '1.45',
                  boxShadow: isMe ? '0 4px 15px rgba(168, 85, 247, 0.25)' : 'none'
                }}>
                  {msg.text}
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '0.7rem',
                  color: 'var(--text-faint)',
                  marginTop: '4px',
                  fontFamily: 'var(--font-mono)'
                }}>
                  <span>{msg.time}</span>
                  {isMe && <CheckCheck size={12} color="#06b6d4" />}
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Geek Snippets / Prompts */}
        <div style={{
          padding: '0.5rem 1rem',
          background: 'rgba(0, 0, 0, 0.2)',
          borderTop: '1px solid var(--border-glass)',
          display: 'flex',
          gap: '0.5rem',
          overflowX: 'auto',
          alignItems: 'center'
        }}>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-faint)', fontFamily: 'var(--font-mono)', flexShrink: 0 }}>
            Quick Prompts:
          </span>
          <button 
            onClick={() => insertSnippet("Can I see your dotfiles repo? 🖥️")}
            className="btn-glass"
            style={{ fontSize: '0.72rem', padding: '3px 8px', borderRadius: '4px', whiteSpace: 'nowrap', fontFamily: 'var(--font-mono)' }}
          >
            "Can I see your dotfiles?"
          </button>
          <button 
            onClick={() => insertSnippet("Coffee date and pair programming? ☕")}
            className="btn-glass"
            style={{ fontSize: '0.72rem', padding: '3px 8px', borderRadius: '4px', whiteSpace: 'nowrap', fontFamily: 'var(--font-mono)' }}
          >
            "Coffee date & pair code?"
          </button>
          <button 
            onClick={() => insertSnippet("What's your all-time favorite anime or sci-fi movie? 🍿")}
            className="btn-glass"
            style={{ fontSize: '0.72rem', padding: '3px 8px', borderRadius: '4px', whiteSpace: 'nowrap', fontFamily: 'var(--font-mono)' }}
          >
            "Favorite sci-fi movie?"
          </button>
        </div>

        {/* Terminal Input Box */}
        <form 
          onSubmit={handleSend}
          style={{
            padding: '0.85rem 1rem',
            background: 'rgba(10, 13, 20, 0.8)',
            borderTop: '1px solid var(--border-glass)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}
        >
          <div style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid var(--border-glass)',
            borderRadius: 'var(--radius-md)',
            padding: '0.5rem 0.85rem',
            gap: '0.5rem'
          }}>
            <span style={{ color: '#06b6d4', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>$</span>
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Send encrypted terminal message... (supports markdown)"
              style={{
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: '#ffffff',
                fontSize: '0.875rem',
                fontFamily: 'var(--font-mono)',
                width: '100%'
              }}
            />
          </div>

          <button
            type="submit"
            className="btn-neon-purple"
            style={{
              padding: '0.65rem 1.1rem',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.85rem'
            }}
          >
            <Send size={15} />
            <span>Send</span>
          </button>
        </form>
      </div>
    </div>
  );
}

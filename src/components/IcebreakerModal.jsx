import React, { useState } from 'react';
import { X, Send, Sparkles } from 'lucide-react';

export default function IcebreakerModal({ profile, prompt, onClose, onSend }) {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    onSend(profile, prompt, message);
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
      padding: '16px'
    }}>
      <div style={{
        background: 'var(--reddit-card)',
        border: '1px solid var(--reddit-border)',
        borderRadius: '16px',
        maxWidth: '480px',
        width: '100%',
        padding: '24px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.6)'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img 
              src={profile.avatar} 
              alt={profile.name}
              style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
            />
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#ffffff' }}>
                Break the ice with {profile.name}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--reddit-muted)' }}>
                @{profile.handle}
              </div>
            </div>
          </div>
          <button 
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: 'var(--reddit-muted)', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Selected Prompt Quote (Hinge style) */}
        {prompt && (
          <div style={{
            background: 'rgba(255, 255, 255, 0.03)',
            borderLeft: '3px solid var(--reddit-orange)',
            padding: '12px 14px',
            borderRadius: '4px',
            marginBottom: '16px'
          }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--reddit-muted)', fontWeight: 600 }}>
              {prompt.question}
            </div>
            <div style={{ fontSize: '0.92rem', color: '#e2e8f0', marginTop: '4px', fontWeight: 500 }}>
              "{prompt.answer}"
            </div>
          </div>
        )}

        {/* Reply Input Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={`Say something about their prompt, ask about their setup, or share a common interest...`}
            rows={4}
            style={{
              width: '100%',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--reddit-border)',
              borderRadius: '8px',
              padding: '12px',
              color: '#ffffff',
              fontSize: '0.88rem',
              outline: 'none',
              resize: 'none'
            }}
            required
            autoFocus
          />

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--reddit-muted)' }}>
              Takes the awkwardness out of saying hi 👋
            </span>

            <button
              type="submit"
              className="btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 18px' }}
            >
              <Send size={15} />
              <span>Send Request</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

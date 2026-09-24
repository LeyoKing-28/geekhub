import React from 'react';
import { 
  Heart, 
  MessageSquareCode, 
  Terminal, 
  Sparkles, 
  Filter, 
  GitPullRequest,
  Flame,
  ShieldCheck,
  UserCheck
} from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, matchCount, filterCategory, setFilterCategory }) {
  return (
    <header className="glass-panel" style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      borderBottom: '1px solid var(--border-glass)',
      padding: '0.85rem 1.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '1rem',
      flexWrap: 'wrap'
    }}>
      {/* Logo & Brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }} onClick={() => setActiveTab('discover')}>
        <div style={{
          width: '42px',
          height: '42px',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 50%, #06b6d4 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 15px rgba(168, 85, 247, 0.5)'
        }}>
          <GitPullRequest size={24} color="#ffffff" />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em', background: 'linear-gradient(90deg, #f1f5f9, #c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              GitMatch
            </span>
            <span style={{ 
              fontSize: '0.65rem', 
              fontFamily: 'var(--font-mono)', 
              background: 'rgba(168, 85, 247, 0.2)', 
              color: '#c084fc', 
              padding: '2px 6px', 
              borderRadius: '4px',
              border: '1px solid rgba(168, 85, 247, 0.4)'
            }}>
              v2.4.0-stable
            </span>
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-faint)', fontFamily: 'var(--font-mono)' }}>
            $ git merge heart --fast-forward
          </p>
        </div>
      </div>

      {/* Navigation Mode Switcher */}
      <nav style={{
        display: 'flex',
        alignItems: 'center',
        background: 'rgba(0, 0, 0, 0.35)',
        padding: '4px',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-glass)'
      }}>
        <button 
          onClick={() => setActiveTab('discover')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 1rem',
            borderRadius: '10px',
            fontSize: '0.875rem',
            fontFamily: 'var(--font-mono)',
            fontWeight: 600,
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.2s',
            background: activeTab === 'discover' ? 'linear-gradient(135deg, rgba(168,85,247,0.3), rgba(6,182,212,0.2))' : 'transparent',
            color: activeTab === 'discover' ? '#ffffff' : 'var(--text-muted)',
            boxShadow: activeTab === 'discover' ? '0 0 12px rgba(168, 85, 247, 0.3)' : 'none',
            borderBottom: activeTab === 'discover' ? '1px solid #a855f7' : '1px solid transparent'
          }}
        >
          <Sparkles size={16} color={activeTab === 'discover' ? '#c084fc' : 'currentColor'} />
          PR Review
        </button>

        <button 
          onClick={() => setActiveTab('quiz')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 1rem',
            borderRadius: '10px',
            fontSize: '0.875rem',
            fontFamily: 'var(--font-mono)',
            fontWeight: 600,
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.2s',
            background: activeTab === 'quiz' ? 'linear-gradient(135deg, rgba(168,85,247,0.3), rgba(6,182,212,0.2))' : 'transparent',
            color: activeTab === 'quiz' ? '#ffffff' : 'var(--text-muted)',
            boxShadow: activeTab === 'quiz' ? '0 0 12px rgba(168, 85, 247, 0.3)' : 'none',
            borderBottom: activeTab === 'quiz' ? '1px solid #a855f7' : '1px solid transparent'
          }}
        >
          <Terminal size={16} color={activeTab === 'quiz' ? '#06b6d4' : 'currentColor'} />
          Compatibility Test
        </button>

        <button 
          onClick={() => setActiveTab('chats')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 1rem',
            borderRadius: '10px',
            fontSize: '0.875rem',
            fontFamily: 'var(--font-mono)',
            fontWeight: 600,
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.2s',
            position: 'relative',
            background: activeTab === 'chats' ? 'linear-gradient(135deg, rgba(168,85,247,0.3), rgba(6,182,212,0.2))' : 'transparent',
            color: activeTab === 'chats' ? '#ffffff' : 'var(--text-muted)',
            boxShadow: activeTab === 'chats' ? '0 0 12px rgba(168, 85, 247, 0.3)' : 'none',
            borderBottom: activeTab === 'chats' ? '1px solid #a855f7' : '1px solid transparent'
          }}
        >
          <MessageSquareCode size={16} color={activeTab === 'chats' ? '#ec4899' : 'currentColor'} />
          Terminal Chats
          {matchCount > 0 && (
            <span style={{
              background: '#ec4899',
              color: 'white',
              fontSize: '0.7rem',
              fontWeight: 700,
              padding: '1px 6px',
              borderRadius: '999px',
              marginLeft: '4px'
            }}>
              {matchCount}
            </span>
          )}
        </button>
      </nav>

      {/* User profile preview & Quick Terminal status */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          background: 'rgba(255, 255, 255, 0.04)',
          border: '1px solid var(--border-glass)',
          padding: '0.4rem 0.8rem',
          borderRadius: 'var(--radius-full)'
        }}>
          <span style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: '#10b981',
            boxShadow: '0 0 8px #10b981'
          }}></span>
          <span style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
            user@localhost: <span style={{ color: '#06b6d4' }}>main</span>
          </span>
        </div>
      </div>
    </header>
  );
}

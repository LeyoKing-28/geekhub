import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  GitMerge, 
  GitPullRequest, 
  X, 
  Check, 
  GitCommit, 
  Sparkles, 
  MapPin, 
  Coffee, 
  Cpu, 
  Code, 
  Terminal, 
  ChevronRight,
  Flame,
  MessageSquare,
  ShieldCheck,
  Zap,
  Info
} from 'lucide-react';
import Badge from './Badge';

export default function ProfileCard({ profile, onApprove, onRequestChanges, onDirectMessage }) {
  const [activeTab, setActiveTab] = useState('pr'); // 'pr' | 'stats' | 'fandoms' | 'quiz'
  const [animating, setAnimating] = useState(null); // 'merged' | 'rejected'

  const handleApprove = () => {
    setAnimating('merged');
    // Launch celebratory developer confetti
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.7 },
      colors: ['#a855f7', '#06b6d4', '#ec4899', '#10b981']
    });
    setTimeout(() => {
      onApprove(profile);
      setAnimating(null);
    }, 450);
  };

  const handleReject = () => {
    setAnimating('rejected');
    setTimeout(() => {
      onRequestChanges(profile);
      setAnimating(null);
    }, 350);
  };

  return (
    <div style={{
      maxWidth: '650px',
      margin: '0 auto',
      position: 'relative',
      perspective: '1000px',
      transition: 'transform 0.4s ease, opacity 0.4s ease',
      transform: animating === 'merged' 
        ? 'translateY(-20px) scale(0.98)' 
        : animating === 'rejected' 
        ? 'translateX(-40px) rotate(-4deg) opacity(0)' 
        : 'none',
      opacity: animating === 'rejected' ? 0 : 1
    }}>
      {/* Outer Card with Glassmorphic & Neon Styling */}
      <div className="glass-panel" style={{
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        border: '1px solid rgba(168, 85, 247, 0.25)',
        boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.7), 0 0 25px rgba(168, 85, 247, 0.15)'
      }}>
        {/* Cover Image & Header Badges */}
        <div style={{
          position: 'relative',
          height: '200px',
          backgroundImage: `url(${profile.coverImg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          overflow: 'hidden'
        }}>
          {/* Dark gradient overlay */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to bottom, rgba(10, 13, 20, 0.3) 0%, rgba(10, 13, 20, 0.95) 100%)'
          }} />

          {/* Top Bar inside Cover */}
          <div style={{
            position: 'absolute',
            top: '1rem',
            left: '1rem',
            right: '1rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            zIndex: 2
          }}>
            <div style={{
              background: 'rgba(0, 0, 0, 0.65)',
              backdropFilter: 'blur(8px)',
              padding: '4px 10px',
              borderRadius: 'var(--radius-full)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.75rem',
              fontFamily: 'var(--font-mono)'
            }}>
              <MapPin size={12} color="#06b6d4" />
              <span>{profile.distance}</span>
            </div>

            <div style={{
              background: 'linear-gradient(135deg, rgba(168,85,247,0.9), rgba(236,72,153,0.9))',
              padding: '4px 12px',
              borderRadius: 'var(--radius-full)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontWeight: 700,
              fontSize: '0.8rem',
              fontFamily: 'var(--font-mono)',
              boxShadow: '0 0 15px rgba(168, 85, 247, 0.6)'
            }}>
              <Zap size={14} fill="currentColor" />
              <span>{profile.compatibilityScore}% Synergy</span>
            </div>
          </div>

          {/* Profile Identity Details at bottom of cover */}
          <div style={{
            position: 'absolute',
            bottom: '1rem',
            left: '1.25rem',
            right: '1.25rem',
            display: 'flex',
            alignItems: 'flex-end',
            gap: '1rem',
            zIndex: 2
          }}>
            {/* Avatar with Live Indicator */}
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <img 
                src={profile.avatar} 
                alt={profile.name}
                style={{
                  width: '84px',
                  height: '84px',
                  borderRadius: '20px',
                  objectFit: 'cover',
                  border: '3px solid #a855f7',
                  boxShadow: '0 0 20px rgba(168, 85, 247, 0.5)'
                }}
              />
              <span style={{
                position: 'absolute',
                bottom: '3px',
                right: '3px',
                width: '14px',
                height: '14px',
                borderRadius: '50%',
                background: '#10b981',
                border: '2px solid #0a0d14',
                boxShadow: '0 0 6px #10b981'
              }} />
            </div>

            {/* Name, Handle, Headline */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.01em' }}>
                  {profile.name}
                </h2>
                <span style={{ fontSize: '1.1rem', color: 'var(--text-muted)' }}>{profile.age}</span>
                <span style={{
                  fontSize: '0.75rem',
                  fontFamily: 'var(--font-mono)',
                  color: '#06b6d4',
                  background: 'rgba(6, 182, 212, 0.1)',
                  padding: '2px 8px',
                  borderRadius: '6px',
                  border: '1px solid rgba(6, 182, 212, 0.25)'
                }}>
                  @{profile.handle}
                </span>
              </div>
              <p style={{
                fontSize: '0.85rem',
                color: '#e2e8f0',
                marginTop: '2px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                {profile.headline}
              </p>
            </div>
          </div>
        </div>

        {/* Live Status Pill */}
        <div style={{
          padding: '0.6rem 1.25rem',
          background: 'rgba(0, 0, 0, 0.4)',
          borderBottom: '1px solid var(--border-glass)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.78rem'
        }}>
          <span style={{ color: 'var(--text-muted)' }}>Status Daemon:</span>
          <span style={{ color: '#c084fc', display: 'flex', alignItems: 'center', gap: '4px' }}>
            {profile.statusText}
          </span>
        </div>

        {/* Tab Switcher (PR View vs Stats vs Fandoms) */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid var(--border-glass)',
          background: 'rgba(255, 255, 255, 0.02)'
        }}>
          {[
            { id: 'pr', label: 'Pull Request #1', icon: GitPullRequest },
            { id: 'badges', label: 'Taxonomy & Stack', icon: Sparkles },
            { id: 'specs', label: 'System Specs', icon: Cpu },
            { id: 'quiz', label: 'Icebreaker Quiz', icon: Terminal }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  flex: 1,
                  padding: '0.65rem 0.5rem',
                  background: isActive ? 'rgba(168, 85, 247, 0.12)' : 'transparent',
                  border: 'none',
                  borderBottom: isActive ? '2px solid #a855f7' : '2px solid transparent',
                  color: isActive ? '#ffffff' : 'var(--text-faint)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <Icon size={14} color={isActive ? '#c084fc' : 'currentColor'} />
                <span className="tab-label">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Body */}
        <div style={{ padding: '1.25rem', minHeight: '260px' }}>
          {activeTab === 'pr' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Git PR Meta Header */}
              <div style={{
                background: 'rgba(0, 0, 0, 0.45)',
                padding: '0.85rem 1rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-glass)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.82rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10b981', fontWeight: 600 }}>
                  <GitCommit size={15} />
                  <span>{profile.prTitle}</span>
                </div>
                <div style={{ color: 'var(--text-faint)', fontSize: '0.75rem', marginTop: '6px' }}>
                  branch: <span style={{ color: '#06b6d4' }}>{profile.handle}/feature/date-night</span> into <span style={{ color: '#a855f7' }}>main</span>
                </div>
              </div>

              {/* Bio block */}
              <div>
                <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-faint)', fontWeight: 700 }}>
                  PR Description & Bio
                </span>
                <p style={{
                  fontSize: '0.92rem',
                  lineHeight: '1.6',
                  color: '#e2e8f0',
                  marginTop: '0.4rem',
                  background: 'rgba(255, 255, 255, 0.02)',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid rgba(255, 255, 255, 0.04)'
                }}>
                  {profile.bio}
                </p>
              </div>

              {/* PR Changelog Highlights */}
              <div style={{
                background: 'rgba(16, 185, 129, 0.05)',
                border: '1px solid rgba(16, 185, 129, 0.2)',
                borderRadius: 'var(--radius-sm)',
                padding: '0.75rem 1rem',
                fontSize: '0.82rem',
                fontFamily: 'var(--font-mono)'
              }}>
                <div style={{ color: '#34d399', fontWeight: 600, marginBottom: '4px' }}>
                  + Diff Changes Proposed:
                </div>
                <div style={{ color: '#94a3b8', lineHeight: '1.4' }}>
                  {profile.prDescription}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'badges' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-faint)', fontWeight: 700 }}>
                  Geek Taxonomy & Specializations
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
                  {profile.tags.map((tag) => (
                    <Badge key={tag.id} tag={tag} />
                  ))}
                </div>
              </div>

              <div>
                <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-faint)', fontWeight: 700 }}>
                  Favorite Fandoms & Universes
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.5rem' }}>
                  {profile.fandoms.map((fandom, i) => (
                    <span 
                      key={i} 
                      style={{
                        padding: '4px 10px',
                        borderRadius: '6px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid var(--border-glass)',
                        fontSize: '0.78rem',
                        color: 'var(--text-main)'
                      }}
                    >
                      🚀 {fandom}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'specs' && (
            <div>
              <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-faint)', fontWeight: 700 }}>
                Developer & Nerd Benchmarks
              </span>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                gap: '0.75rem',
                marginTop: '0.6rem'
              }}>
                <div style={{ background: 'rgba(0, 0, 0, 0.3)', padding: '0.75rem', borderRadius: '10px', border: '1px solid var(--border-glass)' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-faint)' }}>Commits This Year</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#10b981', fontFamily: 'var(--font-mono)', marginTop: '2px' }}>
                    {profile.stats.commitsThisYear}
                  </div>
                </div>

                <div style={{ background: 'rgba(0, 0, 0, 0.3)', padding: '0.75rem', borderRadius: '10px', border: '1px solid var(--border-glass)' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-faint)' }}>Indentation War</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#ec4899', fontFamily: 'var(--font-mono)', marginTop: '2px' }}>
                    {profile.stats.tabVsSpace}
                  </div>
                </div>

                <div style={{ background: 'rgba(0, 0, 0, 0.3)', padding: '0.75rem', borderRadius: '10px', border: '1px solid var(--border-glass)' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-faint)' }}>Primary Editor / IDE</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#a855f7', fontFamily: 'var(--font-mono)', marginTop: '2px' }}>
                    {profile.stats.favoriteIDE}
                  </div>
                </div>

                <div style={{ background: 'rgba(0, 0, 0, 0.3)', padding: '0.75rem', borderRadius: '10px', border: '1px solid var(--border-glass)' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-faint)' }}>D&D Alignment</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#f59e0b', fontFamily: 'var(--font-mono)', marginTop: '2px' }}>
                    {profile.stats.alignment}
                  </div>
                </div>

                <div style={{ background: 'rgba(0, 0, 0, 0.3)', padding: '0.75rem', borderRadius: '10px', border: '1px solid var(--border-glass)', gridColumn: 'span 2' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-faint)' }}>Caffeine Dependency</div>
                  <div style={{ fontSize: '0.9rem', color: '#06b6d4', marginTop: '2px' }}>
                    ☕ {profile.stats.coffeeIndex}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'quiz' && (
            <div style={{
              background: 'rgba(0, 0, 0, 0.4)',
              padding: '1rem',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid rgba(6, 182, 212, 0.25)',
              fontFamily: 'var(--font-mono)'
            }}>
              <div style={{ color: '#06b6d4', fontSize: '0.8rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Terminal size={14} />
                <span>Icebreaker Prompt</span>
              </div>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f1f5f9', marginTop: '8px' }}>
                "{profile.quiz.question}"
              </div>
              <div style={{
                marginTop: '10px',
                padding: '0.75rem',
                borderRadius: '6px',
                background: 'rgba(255, 255, 255, 0.04)',
                borderLeft: '3px solid #ec4899',
                color: '#cbd5e1',
                fontSize: '0.85rem'
              }}>
                💬 "{profile.quiz.answer}"
              </div>
            </div>
          )}
        </div>

        {/* Action Controls / PR Actions */}
        <div style={{
          padding: '1rem 1.25rem',
          background: 'rgba(10, 13, 20, 0.9)',
          borderTop: '1px solid var(--border-glass)',
          display: 'flex',
          gap: '1rem',
          alignItems: 'center'
        }}>
          {/* Request Changes / Skip */}
          <button
            onClick={handleReject}
            className="btn-glass"
            style={{
              flex: 1,
              padding: '0.85rem 1rem',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.875rem',
              fontWeight: 600,
              color: '#ef4444',
              borderColor: 'rgba(239, 68, 68, 0.3)'
            }}
            title="Request changes on this PR (Pass)"
          >
            <X size={18} />
            <span>Request Changes</span>
          </button>

          {/* Direct Message Prompt */}
          <button
            onClick={() => onDirectMessage(profile)}
            className="btn-glass"
            style={{
              padding: '0.85rem',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#06b6d4',
              borderColor: 'rgba(6, 182, 212, 0.3)'
            }}
            title="Send direct terminal ping"
          >
            <MessageSquare size={18} />
          </button>

          {/* Approve & Merge / Like */}
          <button
            onClick={handleApprove}
            className="btn-neon-purple"
            style={{
              flex: 1.4,
              padding: '0.85rem 1.25rem',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              fontSize: '0.9rem'
            }}
            title="Approve Pull Request (Match!)"
          >
            <GitMerge size={18} />
            <span>Merge Pull Request</span>
          </button>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { 
  MessageSquare, 
  Sparkles, 
  MapPin, 
  Terminal, 
  Send,
  Heart,
  Check
} from 'lucide-react';

export default function FriendCard({ profile, onOpenIcebreaker, isRequested }) {
  return (
    <div style={{
      background: 'var(--reddit-card)',
      border: '1px solid var(--reddit-border)',
      borderRadius: '16px',
      overflow: 'hidden',
      marginBottom: '28px',
      boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4)'
    }}>
      {/* 1. Profile Header / Intro */}
      <div style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <img 
            src={profile.avatar} 
            alt={profile.name}
            style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(255, 255, 255, 0.1)' }}
          />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ffffff' }}>
                {profile.name}
              </h2>
              <span style={{ fontSize: '1rem', color: 'var(--reddit-muted)' }}>{profile.age}</span>
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--reddit-muted)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
              <MapPin size={12} />
              <span>{profile.location}</span>
              <span>•</span>
              <span style={{ color: '#7193ff' }}>@{profile.handle}</span>
            </div>
          </div>
        </div>

        {/* Natural subtle affinity indicator */}
        <div style={{
          background: 'rgba(113, 147, 255, 0.1)',
          border: '1px solid rgba(113, 147, 255, 0.25)',
          padding: '4px 12px',
          borderRadius: '999px',
          fontSize: '0.78rem',
          fontWeight: 600,
          color: '#7193ff',
          display: 'flex',
          alignItems: 'center',
          gap: '5px'
        }}>
          <Sparkles size={13} />
          <span>{profile.matchPercentage}% Vibe Match</span>
        </div>
      </div>

      {/* 2. Skills & Fandom Pills Ribbon */}
      <div style={{ padding: '14px 24px', background: 'rgba(0, 0, 0, 0.15)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {profile.skills.map((skill, i) => (
            <span key={i} style={{
              fontSize: '0.75rem',
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              color: '#e2e8f0',
              padding: '3px 10px',
              borderRadius: '999px',
              fontWeight: 500
            }}>
              💻 {skill}
            </span>
          ))}
          {profile.fandoms.map((fandom, i) => (
            <span key={i} style={{
              fontSize: '0.75rem',
              background: 'rgba(255, 69, 0, 0.08)',
              border: '1px solid rgba(255, 69, 0, 0.2)',
              color: '#ff7043',
              padding: '3px 10px',
              borderRadius: '999px',
              fontWeight: 500
            }}>
              🎮 {fandom}
            </span>
          ))}
        </div>
      </div>

      {/* 3. Photo 1 (Instagram style showcase) */}
      {profile.photos[0] && (
        <div style={{ position: 'relative' }}>
          <img 
            src={profile.photos[0].url} 
            alt="Setup"
            style={{ width: '100%', height: '360px', objectFit: 'cover', display: 'block' }}
          />
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: '12px 20px',
            background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%)',
            fontSize: '0.85rem',
            color: '#ffffff'
          }}>
            {profile.photos[0].caption}
          </div>
        </div>
      )}

      {/* 4. Hinge Prompt 1 */}
      {profile.prompts[0] && (
        <div 
          onClick={() => onOpenIcebreaker(profile, profile.prompts[0])}
          style={{
            padding: '24px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
            cursor: 'pointer',
            position: 'relative',
            transition: 'background-color 0.15s'
          }}
          className="prompt-hover"
        >
          <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--reddit-muted)', fontWeight: 700 }}>
            {profile.prompts[0].question}
          </div>
          <div style={{ fontSize: '1.15rem', fontWeight: 600, color: '#ffffff', marginTop: '6px', lineHeight: '1.45' }}>
            "{profile.prompts[0].answer}"
          </div>

          <div style={{
            marginTop: '14px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.78rem',
            fontWeight: 600,
            color: 'var(--reddit-orange)',
            background: 'rgba(255, 69, 0, 0.1)',
            padding: '4px 12px',
            borderRadius: '999px'
          }}>
            <MessageSquare size={13} />
            <span>Reply to this prompt to break the ice</span>
          </div>
        </div>
      )}

      {/* 5. Photo 2 (Hobby / setup showcase) */}
      {profile.photos[1] && (
        <div style={{ position: 'relative' }}>
          <img 
            src={profile.photos[1].url} 
            alt="Hobby showcase"
            style={{ width: '100%', height: '320px', objectFit: 'cover', display: 'block' }}
          />
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: '12px 20px',
            background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%)',
            fontSize: '0.85rem',
            color: '#ffffff'
          }}>
            {profile.photos[1].caption}
          </div>
        </div>
      )}

      {/* 6. Hinge Prompt 2 */}
      {profile.prompts[1] && (
        <div 
          onClick={() => onOpenIcebreaker(profile, profile.prompts[1])}
          style={{
            padding: '24px',
            cursor: 'pointer',
            borderBottom: '1px solid rgba(255, 255, 255, 0.06)'
          }}
        >
          <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--reddit-muted)', fontWeight: 700 }}>
            {profile.prompts[1].question}
          </div>
          <div style={{ fontSize: '1.15rem', fontWeight: 600, color: '#ffffff', marginTop: '6px', lineHeight: '1.45' }}>
            "{profile.prompts[1].answer}"
          </div>

          <div style={{
            marginTop: '14px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.78rem',
            fontWeight: 600,
            color: 'var(--reddit-orange)',
            background: 'rgba(255, 69, 0, 0.1)',
            padding: '4px 12px',
            borderRadius: '999px'
          }}>
            <MessageSquare size={13} />
            <span>Reply to this prompt</span>
          </div>
        </div>
      )}

      {/* 7. Bottom Action Bar */}
      <div style={{
        padding: '16px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'rgba(0, 0, 0, 0.2)'
      }}>
        <div style={{ fontSize: '0.8rem', color: 'var(--reddit-muted)' }}>
          Editor: <span style={{ color: '#e2e8f0' }}>{profile.stats.editor}</span> • Indent: <span style={{ color: '#e2e8f0' }}>{profile.stats.tabVsSpace}</span>
        </div>

        <button
          onClick={() => onOpenIcebreaker(profile, profile.prompts[0])}
          disabled={isRequested}
          style={{
            background: isRequested ? 'rgba(34, 197, 94, 0.15)' : 'var(--reddit-orange)',
            border: isRequested ? '1px solid #22c55e' : 'none',
            color: isRequested ? '#4ade80' : '#ffffff',
            borderRadius: '999px',
            padding: '8px 18px',
            fontSize: '0.85rem',
            fontWeight: 600,
            cursor: isRequested ? 'default' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          {isRequested ? (
            <>
              <Check size={16} />
              <span>Friend Request Sent</span>
            </>
          ) : (
            <>
              <Send size={15} />
              <span>Send Friend Request</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

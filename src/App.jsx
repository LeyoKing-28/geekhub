import React, { useState } from 'react';
import FriendCard from './components/FriendCard';
import IcebreakerModal from './components/IcebreakerModal';
import { GEEK_FRIENDS_POOL, CURRENT_USER_PROFILE } from './data/friendProfiles';
import { rankFriendsFeed } from './algorithms/friendMatching';
import { 
  Users, 
  MessageSquare, 
  Sparkles, 
  Terminal, 
  Compass, 
  Search,
  Filter,
  CheckCircle2,
  Heart
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('discover'); // 'discover' | 'friends'
  const [icebreakerTarget, setIcebreakerTarget] = useState(null); // { profile, prompt }
  const [sentRequests, setSentRequests] = useState({});
  const [friendsList, setFriendsList] = useState([
    {
      id: "friend-1",
      name: "Marcus Vance",
      handle: "marcus_v",
      avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80",
      lastMessage: "I finished lubricating the Holy Panda switches! They sound amazing ⌨️",
      time: "10 mins ago"
    }
  ]);
  const [toast, setToast] = useState(null);

  // Background Feed Ranking based on AoA Similarity (Jaccard + Cosine metrics)
  const rankedFeed = rankFriendsFeed(CURRENT_USER_PROFILE, GEEK_FRIENDS_POOL);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const handleOpenIcebreaker = (profile, prompt) => {
    setIcebreakerTarget({ profile, prompt });
  };

  const handleSendIcebreaker = (profile, prompt, message) => {
    setSentRequests(prev => ({ ...prev, [profile.id]: true }));
    showToast(`Friend request & icebreaker sent to ${profile.name}!`);

    // Auto-accept after 3 seconds to demonstrate 1-on-1 friendship connection
    setTimeout(() => {
      setFriendsList(prev => [
        {
          id: `friend-${Date.now()}`,
          name: profile.name,
          handle: profile.handle,
          avatar: profile.avatar,
          lastMessage: `Accepted your icebreaker! Let's talk soon.`,
          time: 'Just now'
        },
        ...prev
      ]);
      showToast(`🎉 ${profile.name} accepted your friend request! Added to Friends.`);
    }, 3000);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--reddit-bg)' }}>
      {/* Toast popup */}
      {toast && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          background: 'var(--reddit-card)',
          border: '1px solid var(--reddit-orange)',
          color: '#ffffff',
          padding: '10px 18px',
          borderRadius: '10px',
          fontSize: '0.85rem',
          fontWeight: 600,
          zIndex: 1000,
          boxShadow: '0 8px 24px rgba(0,0,0,0.6)'
        }}>
          {toast}
        </div>
      )}

      {/* Top Navbar */}
      <header style={{
        height: '54px',
        background: 'var(--reddit-card)',
        borderBottom: '1px solid var(--reddit-border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 1.5rem',
        position: 'sticky',
        top: 0,
        zIndex: 50
      }}>
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #ff4500 0%, #ff8700 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            fontWeight: 800,
            fontSize: '1rem'
          }}>
            G
          </div>
          <span style={{ fontWeight: 800, fontSize: '1.15rem', color: '#ffffff', letterSpacing: '-0.02em' }}>
            GeekHub
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--reddit-muted)', marginLeft: '4px' }}>
            Friendships for Introverted Geeks
          </span>
        </div>

        {/* Navigation Tabs */}
        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            onClick={() => setActiveTab('discover')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: '999px',
              border: 'none',
              background: activeTab === 'discover' ? 'rgba(255, 69, 0, 0.15)' : 'transparent',
              color: activeTab === 'discover' ? 'var(--reddit-orange)' : 'var(--reddit-muted)',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer'
            }}
          >
            <Compass size={16} />
            <span>Discover Geeks</span>
          </button>

          <button
            onClick={() => setActiveTab('friends')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: '999px',
              border: 'none',
              background: activeTab === 'friends' ? 'rgba(255, 69, 0, 0.15)' : 'transparent',
              color: activeTab === 'friends' ? 'var(--reddit-orange)' : 'var(--reddit-muted)',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer'
            }}
          >
            <Users size={16} />
            <span>My Friends ({friendsList.length})</span>
          </button>
        </div>

        {/* Current User Pill */}
        <div style={{
          fontSize: '0.8rem',
          color: '#e2e8f0',
          background: 'rgba(255, 255, 255, 0.05)',
          padding: '4px 12px',
          borderRadius: '999px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e' }} />
          <span>@{CURRENT_USER_PROFILE.handle}</span>
        </div>
      </header>

      {/* Main Container */}
      <main style={{ flex: 1, maxWidth: '640px', margin: '0 auto', width: '100%', padding: '24px 16px' }}>
        {activeTab === 'discover' && (
          <div>
            {/* Feed Sub-header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '20px',
              padding: '0 4px'
            }}>
              <div>
                <h1 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff' }}>
                  Curated Geek Friends
                </h1>
                <p style={{ fontSize: '0.8rem', color: 'var(--reddit-muted)', marginTop: '2px' }}>
                  Ranked by shared tech stack, setups, & niche fandoms
                </p>
              </div>

              <div style={{
                fontSize: '0.75rem',
                color: 'var(--reddit-muted)',
                background: 'rgba(255, 255, 255, 0.04)',
                padding: '4px 10px',
                borderRadius: '6px'
              }}>
                Algorithmically ranked
              </div>
            </div>

            {/* Friend Cards Stack (Hinge + Instagram Style) */}
            {rankedFeed.map(profile => (
              <FriendCard
                key={profile.id}
                profile={profile}
                onOpenIcebreaker={handleOpenIcebreaker}
                isRequested={Boolean(sentRequests[profile.id])}
              />
            ))}
          </div>
        )}

        {activeTab === 'friends' && (
          <div>
            <div style={{ marginBottom: '20px', padding: '0 4px' }}>
              <h1 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff' }}>
                Your Friendships & Messages
              </h1>
              <p style={{ fontSize: '0.8rem', color: 'var(--reddit-muted)', marginTop: '2px' }}>
                1-on-1 connections with zero awkwardness
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {friendsList.map(friend => (
                <div
                  key={friend.id}
                  style={{
                    background: 'var(--reddit-card)',
                    border: '1px solid var(--reddit-border)',
                    borderRadius: '12px',
                    padding: '14px 18px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <img 
                      src={friend.avatar} 
                      alt={friend.name}
                      style={{ width: '46px', height: '46px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#ffffff' }}>{friend.name}</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--reddit-muted)' }}>@{friend.handle}</span>
                      </div>
                      <div style={{ fontSize: '0.82rem', color: '#c5ced6', marginTop: '3px' }}>
                        {friend.lastMessage}
                      </div>
                    </div>
                  </div>

                  <span style={{ fontSize: '0.72rem', color: 'var(--reddit-muted)' }}>
                    {friend.time}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Icebreaker Prompt Reply Modal */}
      {icebreakerTarget && (
        <IcebreakerModal
          profile={icebreakerTarget.profile}
          prompt={icebreakerTarget.prompt}
          onClose={() => setIcebreakerTarget(null)}
          onSend={handleSendIcebreaker}
        />
      )}
    </div>
  );
}

import React, { useState } from 'react';
import Navbar from './components/Navbar';
import ProfileCard from './components/ProfileCard';
import ChatView from './components/ChatView';
import CompatibilityQuiz from './components/CompatibilityQuiz';
import Badge from './components/Badge';
import { SAMPLE_PROFILES, CATEGORIES, INITIAL_MATCHES } from './data/profiles';
import { 
  Filter, 
  RotateCcw, 
  Sparkles, 
  Terminal, 
  GitMerge, 
  SlidersHorizontal,
  Heart,
  ChevronDown
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('discover'); // 'discover' | 'quiz' | 'chats'
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [profiles, setProfiles] = useState(SAMPLE_PROFILES);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [matches, setMatches] = useState(INITIAL_MATCHES);
  const [toastMessage, setToastMessage] = useState(null);

  // Filter profiles based on selected category
  const filteredProfiles = profiles.filter(profile => {
    if (selectedCategory === 'all') return true;
    return profile.tags.some(tag => tag.category === selectedCategory);
  });

  const currentProfile = filteredProfiles[currentIndex] || null;

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleApprove = (profile) => {
    showToast(`🎉 Pull Request merged with ${profile.name}! Added to Terminal Chats.`);
    // Add to matches if not already there
    const exists = matches.some(m => m.profileId === profile.id);
    if (!exists) {
      const newMatch = {
        id: `match-${Date.now()}`,
        profileId: profile.id,
        matchedAt: 'Just now',
        lastMessage: 'PR merged successfully! Say hello 👋',
        unread: 1,
        messages: [
          { id: 1, sender: 'them', text: `Hey! I saw you approved my pull request. Love your taste in tech! What projects are you hacking on lately? 🚀`, time: 'Just now' }
        ]
      };
      setMatches([newMatch, ...matches]);
    }

    if (currentIndex + 1 < filteredProfiles.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0); // loop or finish
    }
  };

  const handleRequestChanges = (profile) => {
    showToast(`Changes requested for ${profile.name}. Codebase remains pristine.`);
    if (currentIndex + 1 < filteredProfiles.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const handleDirectMessage = (profile) => {
    const existing = matches.find(m => m.profileId === profile.id);
    if (!existing) {
      const newMatch = {
        id: `match-${Date.now()}`,
        profileId: profile.id,
        matchedAt: 'Just now',
        lastMessage: 'Terminal ping sent...',
        unread: 0,
        messages: [
          { id: 1, sender: 'me', text: `Hi ${profile.name}! Saw your profile and had to ping you directly.`, time: 'Just now' }
        ]
      };
      setMatches([newMatch, ...matches]);
    }
    setActiveTab('chats');
  };

  const handleSendMessage = (text) => {
    if (!matches.length) return;
    const activeMatch = matches[0];
    const newMsg = {
      id: Date.now(),
      sender: 'me',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    // Auto-reply after 1.5s for realism
    setTimeout(() => {
      const replies = [
        "100% agreed! That is why open source will always prevail.",
        "Haha totally! Let's definitely grab boba or coffee and discuss this further.",
        "Wait, are you free this weekend? There's a retro arcade night happening downtown!",
        "Nice! Send me your GitHub username, I'll star your repo ⭐"
      ];
      const randomReply = replies[Math.floor(Math.random() * replies.length)];
      const responseMsg = {
        id: Date.now() + 1,
        sender: 'them',
        text: randomReply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMatches(prev => prev.map(m => m.id === activeMatch.id ? { ...m, messages: [...m.messages, responseMsg] } : m));
    }, 1500);

    setMatches(prev => prev.map(m => m.id === activeMatch.id ? { ...m, messages: [...m.messages, newMsg] } : m));
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div className="cyber-grid" />

      {/* Global Navigation Header */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        matchCount={matches.length}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 100,
          background: 'rgba(21, 28, 44, 0.95)',
          backdropFilter: 'blur(12px)',
          border: '1px solid #10b981',
          padding: '0.85rem 1.25rem',
          borderRadius: 'var(--radius-md)',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5), 0 0 20px rgba(16, 185, 129, 0.25)',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.85rem',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          animation: 'floatCard 0.3s ease'
        }}>
          <GitMerge size={16} color="#10b981" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Content Area */}
      <main style={{ flex: 1, padding: '1.25rem 1rem', position: 'relative', zIndex: 1 }}>
        {activeTab === 'discover' && (
          <div>
            {/* Geek Taxonomy & Fandom Filter Ribbon */}
            <div style={{
              maxWidth: '900px',
              margin: '0 auto 1.5rem auto',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              overflowX: 'auto',
              paddingBottom: '0.5rem'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.8rem',
                fontFamily: 'var(--font-mono)',
                color: 'var(--text-faint)',
                paddingRight: '0.5rem',
                borderRight: '1px solid var(--border-glass)'
              }}>
                <Filter size={14} />
                <span>Filter:</span>
              </div>

              {CATEGORIES.map(cat => {
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setSelectedCategory(cat.id);
                      setCurrentIndex(0);
                    }}
                    style={{
                      padding: '0.45rem 0.9rem',
                      borderRadius: 'var(--radius-full)',
                      border: isSelected ? '1px solid #a855f7' : '1px solid var(--border-glass)',
                      background: isSelected ? 'rgba(168, 85, 247, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                      color: isSelected ? '#ffffff' : 'var(--text-muted)',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.78rem',
                      fontWeight: isSelected ? 600 : 400,
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      transition: 'all 0.2s',
                      boxShadow: isSelected ? '0 0 12px rgba(168, 85, 247, 0.3)' : 'none'
                    }}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>

            {/* Profile PR Card Presentation */}
            {currentProfile ? (
              <ProfileCard
                profile={currentProfile}
                onApprove={handleApprove}
                onRequestChanges={handleRequestChanges}
                onDirectMessage={handleDirectMessage}
              />
            ) : (
              <div className="glass-panel" style={{
                maxWidth: '500px',
                margin: '3rem auto',
                padding: '2.5rem',
                borderRadius: 'var(--radius-lg)',
                textAlign: 'center'
              }}>
                <Terminal size={48} color="#a855f7" style={{ margin: '0 auto 1rem auto' }} />
                <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#ffffff' }}>End of Pull Request Queue</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.5rem', lineHeight: '1.5' }}>
                  No more PRs matching filter: <code style={{ color: '#06b6d4' }}>{selectedCategory}</code>. Reset filters or re-seed the queue.
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setCurrentIndex(0);
                  }}
                  className="btn-neon-purple"
                  style={{
                    marginTop: '1.5rem',
                    padding: '0.75rem 1.5rem',
                    borderRadius: 'var(--radius-md)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <RotateCcw size={16} />
                  <span>Reset All Filters</span>
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'quiz' && (
          <CompatibilityQuiz 
            onQuizCompleted={(score) => {
              showToast(`Quiz completed with ${score}% affinity! Matching engine calibrated.`);
            }} 
          />
        )}

        {activeTab === 'chats' && (
          <ChatView 
            activeMatch={matches[0]} 
            profiles={SAMPLE_PROFILES}
            onSendMessage={handleSendMessage}
          />
        )}
      </main>
    </div>
  );
}

import React, { useState } from 'react';
import { useAuth } from './context/AuthContext';
import { LoginPage, SignupPage } from './components/AuthPages';
import { ProfilePage } from './components/ProfilePage';
import { ChatPage } from './components/ChatPage';
import { PostsFeed } from './components/PostsFeed';
import { DiscoverPage } from './components/DiscoverPage';
import { AlgorithmLab } from './components/AlgorithmLab';

function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);
  return (
    <div>
      {isLogin ? <LoginPage /> : <SignupPage />}
      <p style={{ textAlign: 'center', color: '#64748b', marginTop: '16px' }}>
        {isLogin ? "Don't have an account? " : "Already have an account? "}
        <button style={{ background: 'none', border: 'none', color: '#ff4500', cursor: 'pointer', fontWeight: 600 }} onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? 'Sign Up' : 'Login'}
        </button>
      </p>
    </div>
  );
}

function MainApp() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('discover');
  const [viewingProfile, setViewingProfile] = useState(null);
  const [pendingConvo, setPendingConvo] = useState(null);

  const handleStartChat = (convoId) => {
    if (typeof convoId === 'number') setPendingConvo(convoId);
    setActiveTab('chat');
  };

  const handleViewProfile = (userId) => {
    setViewingProfile(userId);
    setActiveTab('profile');
  };

  const renderContent = () => {
    if (activeTab === 'profile') {
      return <ProfilePage userId={viewingProfile} onStartChat={handleStartChat} />;
    }
    switch (activeTab) {
      case 'discover':
        return <DiscoverPage onStartChat={handleStartChat} onViewProfile={handleViewProfile} />;
      case 'chat':
        return <ChatPage initialActive={pendingConvo} />;
      case 'feed':
        return <PostsFeed />;
      case 'lab':
        return <AlgorithmLab />;
      default:
        return <DiscoverPage onStartChat={handleStartChat} onViewProfile={handleViewProfile} />;
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a' }}>
      <header style={styles.header}>
        <div style={styles.brand}>
          <div style={styles.logo}>G</div>
          <span style={styles.brandName}>GeekHub</span>
        </div>
        <nav style={styles.nav}>
          {['discover', 'feed', 'chat', 'profile', 'lab'].map(tab => (
            <button
              key={tab}
              style={{ ...styles.navBtn, ...(activeTab === tab ? styles.navActive : {}) }}
              onClick={() => {
                if (tab === 'profile') setViewingProfile(null);
                setActiveTab(tab);
              }}
            >
              {tab === 'discover' && 'Discover'}
              {tab === 'feed' && 'Feed'}
              {tab === 'chat' && 'Chat'}
              {tab === 'profile' && 'Profile'}
              {tab === 'lab' && 'Lab'}
            </button>
          ))}
        </nav>
        <div style={styles.userSection}>
          <span style={styles.userName}>@{user?.username}</span>
          <button style={styles.logoutBtn} onClick={logout}>Logout</button>
        </div>
      </header>
      <main style={styles.main}>
        {renderContent()}
      </main>
    </div>
  );
}

export default function App() {
  const { user, loading } = useAuth();

  if (loading) return <div style={{ minHeight: '100vh', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>Loading...</div>;
  if (!user) return <AuthScreen />;
  return <MainApp />;
}

const styles = {
  header: { height: '54px', background: '#1e293b', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 1.5rem', position: 'sticky', top: 0, zIndex: 50 },
  brand: { display: 'flex', alignItems: 'center', gap: '8px' },
  logo: { width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg, #ff4500 0%, #ff8700 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800 },
  brandName: { color: '#fff', fontWeight: 800, fontSize: '1.1rem' },
  nav: { display: 'flex', gap: '4px' },
  navBtn: { padding: '6px 14px', borderRadius: '999px', border: 'none', background: 'transparent', color: '#94a3b8', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' },
  navActive: { background: 'rgba(255, 69, 0, 0.15)', color: '#ff4500' },
  userSection: { display: 'flex', alignItems: 'center', gap: '12px' },
  userName: { color: '#94a3b8', fontSize: '0.85rem' },
  logoutBtn: { padding: '6px 12px', borderRadius: '6px', border: 'none', background: '#334155', color: '#94a3b8', cursor: 'pointer', fontSize: '0.8rem' },
  main: { flex: 1 }
};

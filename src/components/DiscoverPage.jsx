import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { PostsFeed } from './PostsFeed';

function SuggestCarousel({ suggestions, onViewProfile, onFollow }) {
  if (!suggestions?.length) return null;
  return (
    <div style={s.suggestWrap}>
      <h3 style={s.suggestTitle}>Suggested geeks for you</h3>
      <div style={s.rail}>
        {suggestions.slice(0, 6).map(u => (
          <div key={u.id} style={s.card}>
            <img src={u.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${u.username}`} alt="" style={s.avatar} />
            <div style={s.name}>{u.display_name || u.username}</div>
            <div style={s.handle}>@{u.username}</div>
            <div style={s.pct}>{u.match_percentage}% match</div>
            <div style={s.why}>{u.recommend_reason}</div>
            <div style={{ display: 'flex', gap: '6px', marginTop: '10px' }}>
              <button style={s.follow} onClick={() => onFollow(u.id)}>Follow</button>
              <button style={s.view} onClick={() => onViewProfile(u.id)}>Profile</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function DiscoverPage({ onStartChat, onViewProfile }) {
  const [feed, setFeed] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const [f, sg] = await Promise.all([api.getFeed(), api.getSuggestions()]);
    setFeed(f); setSuggestions(sg); setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const handleFollow = async (userId) => {
    await api.toggleFollow(userId);
    load();
    onStartChat?.(userId);
  };

  if (loading) return <div style={{ textAlign: 'center', color: '#94a3b8', padding: '48px' }}>Finding your geek matches...</div>;

  // Interleave: carousel after every 4 posts
  const items = [];
  feed.forEach((p, i) => {
    items.push({ type: 'post', p });
    if ((i + 1) % 4 === 0 && i < feed.length - 1) items.push({ type: 'suggest', key: i });
  });

  return (
    <div style={s.container}>
      <h2 style={s.title}>Discover</h2>
      <p style={s.sub}>Ranked by your follows, likes & shared interests</p>
      {items.map((it, i) => it.type === 'suggest'
        ? <SuggestCarousel key={'sg' + it.key} suggestions={suggestions} onViewProfile={onViewProfile} onFollow={handleFollow} />
        : <SinglePost key={it.p.id} post={it.p} onViewProfile={onViewProfile} />)}
    </div>
  );
}

function SinglePost({ post, onViewProfile }) {
  return <PostsFeed posts={[post]} hideComposer onViewProfile={onViewProfile} />;
}

const s = {
  container: { maxWidth: '600px', margin: '0 auto', padding: '24px 0 40px' },
  title: { color: '#fff', fontSize: '1.25rem', fontWeight: 800, margin: '0 16px' },
  sub: { color: '#64748b', fontSize: '0.85rem', margin: '4px 16px 16px' },
  suggestWrap: { background: '#141b26', borderRadius: '12px', padding: '14px 0 14px 14px', margin: '4px 0' },
  suggestTitle: { color: '#fff', fontSize: '0.9rem', fontWeight: 700, margin: '0 0 10px 2px' },
  rail: { display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '6px', paddingRight: '14px' },
  card: { minWidth: '190px', maxWidth: '190px', background: '#1e293b', borderRadius: '12px', padding: '14px' },
  avatar: { width: '52px', height: '52px', borderRadius: '50%', objectFit: 'cover' },
  name: { color: '#fff', fontWeight: 700, fontSize: '0.88rem', marginTop: '8px' },
  handle: { color: '#64748b', fontSize: '0.75rem' },
  pct: { display: 'inline-block', marginTop: '6px', padding: '2px 10px', borderRadius: '999px', background: 'rgba(34,197,94,0.15)', color: '#22c55e', fontSize: '0.72rem', fontWeight: 700 },
  why: { color: '#94a3b8', fontSize: '0.72rem', marginTop: '6px', lineHeight: 1.4, minHeight: '40px' },
  follow: { flex: 1, padding: '7px 0', borderRadius: '8px', border: 'none', background: '#ff4500', color: '#fff', fontWeight: 600, cursor: 'pointer', fontSize: '0.78rem' },
  view: { flex: 1, padding: '7px 0', borderRadius: '8px', border: 'none', background: '#334155', color: '#fff', fontWeight: 600, cursor: 'pointer', fontSize: '0.78rem' },
};

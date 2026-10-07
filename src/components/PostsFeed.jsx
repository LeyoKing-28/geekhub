import React, { useState, useEffect } from 'react';
import { api } from '../api';

function PostCard({ post, onChanged, onViewProfile }) {
  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState(false);
  const [draft, setDraft] = useState('');
  const [counts, setCounts] = useState(post);

  const doLike = async () => {
    const r = await api.likePost(post.id);
    const liked = r.liked ?? !counts.liked_by_user;
    setCounts(c => ({ ...c, liked_by_user: liked, like_count: c.like_count + (liked ? 1 : -1) }));
  };
  const doShare = async () => {
    const r = await api.sharePost(post.id);
    setCounts(c => ({ ...c, share_count: r.share_count ?? c.share_count + 1 }));
  };

  const toggleComments = async () => {
    if (!showComments) setComments(await api.getComments(post.id));
    setShowComments(!showComments);
  };

  const submitComment = async (e) => {
    e.preventDefault();
    if (!draft.trim()) return;
    await api.addComment(post.id, draft);
    setDraft('');
    setComments(await api.getComments(post.id));
    onChanged();
  };

  return (
    <div style={s.post}>
      <div style={s.head}>
        <img src={post.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${post.username}`} alt="" style={s.avatar} />
        <div style={{ flex: 1 }}>
          <span style={s.name} onClick={() => onViewProfile?.(post.user_id)}>{post.display_name || post.username}</span>
          <span style={s.handle}>@{post.username}</span>
        </div>
      </div>
      {post.feed_reason && <div style={s.reason}>{post.feed_reason}</div>}
      <p style={s.content}>{post.content}</p>
      {post.image_url && <img src={post.image_url} alt="" style={s.image} />}
      {post.tags?.length > 0 && (
        <div style={s.tags}>{post.tags.map((t, i) => <span key={i} style={s.tag}>#{t}</span>)}</div>
      )}
      <div style={s.actions}>
        <button style={{ ...s.act, ...(counts.liked_by_user ? s.liked : {}) }} onClick={doLike}>
          {counts.liked_by_user ? '❤️' : '🤍'} {counts.like_count}
        </button>
        <button style={s.act} onClick={toggleComments}>💬 {counts.comment_count}</button>
        <button style={s.act} onClick={doShare}>🔁 {counts.share_count}</button>
      </div>
      {showComments && (
        <div style={s.commentBox}>
          {comments.map(c => (
            <div key={c.id} style={s.comment}>
              <b style={{ color: '#fff' }}>{c.display_name || c.username}</b>
              <span style={{ color: '#cbd5e1' }}> {c.content}</span>
            </div>
          ))}
          <form onSubmit={submitComment} style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
            <input style={s.cinput} placeholder="Write a comment..." value={draft} onChange={e => setDraft(e.target.value)} />
            <button style={s.cbtn} type="submit">Reply</button>
          </form>
        </div>
      )}
    </div>
  );
}

export function PostsFeed({ posts: extPosts, onViewProfile, hideComposer }) {
  const [posts, setPosts] = useState(extPosts || []);
  const [newPost, setNewPost] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState([]);

  const fetchPosts = async () => setPosts(await api.getPosts());
  useEffect(() => { if (!extPosts) fetchPosts(); }, []);
  useEffect(() => { if (extPosts) setPosts(extPosts); }, [extPosts]);

  const handlePost = async (e) => {
    e.preventDefault();
    if (!newPost.trim()) return;
    await api.createPost({ content: newPost, tags });
    setNewPost(''); setTags([]); fetchPosts();
  };

  return (
    <div style={s.wrap}>
      {!hideComposer && (
        <form style={s.composer} onSubmit={handlePost}>
          <textarea style={s.textarea} placeholder="What's happening in your world?" value={newPost} onChange={e => setNewPost(e.target.value)} />
          <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
            <input style={s.tagInput} placeholder="Add tags (Rust, One Piece, Elden Ring)..." value={tagInput}
              onChange={e => setTagInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); if (tagInput.trim()) { setTags([...tags, tagInput.trim()]); setTagInput(''); } } }} />
          </div>
          {tags.length > 0 && <div style={s.tags}>{tags.map((t, i) => <span key={i} style={s.tag}>#{t}</span>)}</div>}
          <button style={s.postBtn} type="submit">Post</button>
        </form>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {posts.map(p => <PostCard key={p.id} post={p} onChanged={extPosts ? () => {} : fetchPosts} onViewProfile={onViewProfile} />)}
      </div>
    </div>
  );
}

const s = {
  wrap: { maxWidth: '600px', margin: '0 auto', padding: '24px 16px' },
  composer: { background: '#1e293b', borderRadius: '12px', padding: '16px', marginBottom: '16px' },
  textarea: { width: '100%', minHeight: '80px', padding: '12px', borderRadius: '8px', border: 'none', outline: 'none', background: '#0f172a', color: '#fff', fontSize: '0.95rem', resize: 'vertical', boxSizing: 'border-box' },
  tagInput: { flex: '1', padding: '8px 12px', borderRadius: '8px', border: 'none', outline: 'none', background: '#0f172a', color: '#fff', fontSize: '0.85rem' },
  tags: { display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' },
  tag: { padding: '2px 10px', borderRadius: '999px', background: 'rgba(255,69,0,0.15)', color: '#ff4500', fontSize: '0.75rem', fontWeight: 600 },
  postBtn: { marginTop: '12px', padding: '10px 20px', borderRadius: '8px', border: 'none', background: '#ff4500', color: '#fff', fontWeight: 700, cursor: 'pointer' },
  post: { background: '#1e293b', borderRadius: '12px', padding: '16px' },
  head: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' },
  avatar: { width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' },
  name: { color: '#fff', fontWeight: 700, fontSize: '0.9rem', display: 'block', cursor: 'pointer' },
  handle: { color: '#64748b', fontSize: '0.8rem' },
  reason: { fontSize: '0.75rem', color: '#22c55e', marginBottom: '8px' },
  content: { color: '#e2e8f0', fontSize: '0.95rem', lineHeight: 1.5, margin: '0 0 12px' },
  image: { width: '100%', borderRadius: '8px', marginBottom: '12px' },
  actions: { display: 'flex', gap: '20px', marginTop: '12px' },
  act: { background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '0.9rem' },
  liked: { color: '#ef4444' },
  commentBox: { marginTop: '12px', paddingTop: '12px' },
  comment: { fontSize: '0.85rem', padding: '6px 0' },
  cinput: { flex: '1', padding: '8px 12px', borderRadius: '16px', border: 'none', outline: 'none', background: '#0f172a', color: '#fff', fontSize: '0.85rem' },
  cbtn: { padding: '8px 14px', borderRadius: '16px', border: 'none', background: '#ff4500', color: '#fff', cursor: 'pointer', fontSize: '0.8rem' },
};

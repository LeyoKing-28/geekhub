import React, { useState } from 'react';
import { 
  ArrowBigUp, 
  ArrowBigDown, 
  MessageSquare, 
  Share2, 
  Users, 
  UserCheck, 
  Sparkles,
  Send,
  Check
} from 'lucide-react';
import { generateSquadForPost } from '../algorithms/feedRanking';

export default function PostCard({ post, onPairRequest }) {
  const [votes, setVotes] = useState(post.upvotes);
  const [voteState, setVoteState] = useState(0); // 1 = up, -1 = down, 0 = none
  const [showComments, setShowComments] = useState(false);
  const [commentList, setCommentList] = useState(post.comments || []);
  const [newComment, setNewComment] = useState('');
  const [formedSquad, setFormedSquad] = useState(null);
  const [pairSent, setPairSent] = useState(false);

  const handleVote = (dir) => {
    if (voteState === dir) {
      setVoteState(0);
      setVotes(post.upvotes);
    } else {
      setVoteState(dir);
      setVotes(post.upvotes + dir);
    }
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    const comment = {
      id: `c-${Date.now()}`,
      author: 'alex_coder',
      text: newComment,
      timeAgo: 'Just now',
      upvotes: 1
    };
    setCommentList([...commentList, comment]);
    setNewComment('');
  };

  const handleAssembleSquad = () => {
    // Silently runs Greedy Bipartite Squad Formation in background
    const squad = generateSquadForPost(post);
    setFormedSquad(squad);
  };

  const handleDirectPair = () => {
    setPairSent(true);
    if (onPairRequest) onPairRequest(post.author);
  };

  return (
    <article className="reddit-card" style={{ marginBottom: '10px', overflow: 'hidden' }}>
      <div style={{ display: 'flex' }}>
        {/* Left Voting Column */}
        <div style={{
          width: '44px',
          background: 'rgba(0, 0, 0, 0.12)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '8px 4px',
          gap: '2px'
        }}>
          <button 
            onClick={() => handleVote(1)}
            className={`vote-btn ${voteState === 1 ? 'upvoted' : ''}`}
            title="Upvote"
          >
            <ArrowBigUp size={24} fill={voteState === 1 ? 'currentColor' : 'none'} />
          </button>

          <span style={{
            fontSize: '0.8rem',
            fontWeight: 700,
            color: voteState === 1 ? '#ff4500' : voteState === -1 ? '#7193ff' : 'var(--reddit-text)'
          }}>
            {votes}
          </span>

          <button 
            onClick={() => handleVote(-1)}
            className={`vote-btn ${voteState === -1 ? 'downvoted' : ''}`}
            title="Downvote"
          >
            <ArrowBigDown size={24} fill={voteState === -1 ? 'currentColor' : 'none'} />
          </button>
        </div>

        {/* Right Content Area */}
        <div style={{ flex: 1, padding: '10px 14px' }}>
          {/* Metadata header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--reddit-muted)', flexWrap: 'wrap' }}>
            <span style={{ fontWeight: 700, color: 'var(--reddit-text)' }}>
              r/{post.subgeek}
            </span>
            <span>•</span>
            <span>Posted by u/{post.author}</span>
            {post.authorRole && (
              <span style={{
                background: 'rgba(255, 69, 0, 0.15)',
                color: '#ff5414',
                fontSize: '0.68rem',
                padding: '1px 6px',
                borderRadius: '4px',
                fontWeight: 600
              }}>
                {post.authorRole}
              </span>
            )}
            <span>•</span>
            <span>{post.timeAgo}</span>

            {/* Subtle natural badge */}
            {post.badge && (
              <span className="tag-badge" style={{ marginLeft: 'auto' }}>
                {post.badge}
              </span>
            )}
          </div>

          {/* Title */}
          <h2 style={{
            fontSize: '1.05rem',
            fontWeight: 600,
            color: '#ffffff',
            margin: '8px 0 6px 0',
            lineHeight: '1.4'
          }}>
            {post.title}
          </h2>

          {/* Body content */}
          <p style={{
            fontSize: '0.88rem',
            color: '#c5ced6',
            lineHeight: '1.5',
            marginBottom: '10px',
            whiteSpace: 'pre-line'
          }}>
            {post.content}
          </p>

          {/* Formed Squad preview if user clicked Assemble Squad */}
          {formedSquad && (
            <div style={{
              background: 'rgba(34, 197, 94, 0.08)',
              border: '1px solid rgba(34, 197, 94, 0.25)',
              borderRadius: '6px',
              padding: '10px',
              marginBottom: '10px'
            }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#4ade80', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Users size={14} />
                <span>Squad Formed ({formedSquad.members.length} members ready)</span>
              </div>
              <div style={{ display: 'flex', gap: '8px', marginTop: '6px', flexWrap: 'wrap' }}>
                {formedSquad.members.map((m, i) => (
                  <span key={i} style={{ fontSize: '0.75rem', background: 'rgba(255, 255, 255, 0.05)', padding: '2px 8px', borderRadius: '4px' }}>
                    u/{m.name || m.handle}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Bottom Actions Row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
            <button 
              onClick={() => setShowComments(!showComments)}
              className="post-action-btn"
            >
              <MessageSquare size={16} />
              <span>{commentList.length} Comments</span>
            </button>

            {/* Action button based on post intent */}
            {post.badge === 'Squad Formation' ? (
              <button onClick={handleAssembleSquad} className="post-action-btn" style={{ color: '#4ade80' }}>
                <Users size={16} />
                <span>Join / Fill Squad</span>
              </button>
            ) : (
              <button 
                onClick={handleDirectPair} 
                className="post-action-btn"
                style={{ color: pairSent ? '#22c55e' : '#7193ff' }}
              >
                {pairSent ? <Check size={16} /> : <UserCheck size={16} />}
                <span>{pairSent ? 'Pair Request Sent' : 'Request 1-on-1 Pair'}</span>
              </button>
            )}

            <button className="post-action-btn">
              <Share2 size={16} />
              <span>Share</span>
            </button>
          </div>

          {/* Inline Comments Section */}
          {showComments && (
            <div style={{
              marginTop: '12px',
              paddingTop: '10px',
              borderTop: '1px solid var(--reddit-border)'
            }}>
              {/* Comment input form */}
              <form onSubmit={handleAddComment} style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="What are your thoughts?"
                  style={{
                    flex: 1,
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid var(--reddit-border)',
                    borderRadius: '999px',
                    padding: '6px 14px',
                    color: '#ffffff',
                    fontSize: '0.82rem',
                    outline: 'none'
                  }}
                />
                <button type="submit" className="btn-primary" style={{ padding: '4px 12px', fontSize: '0.8rem' }}>
                  Comment
                </button>
              </form>

              {/* Comment items */}
              {commentList.length === 0 ? (
                <div style={{ fontSize: '0.78rem', color: 'var(--reddit-muted)' }}>No comments yet. Be the first to reply!</div>
              ) : (
                commentList.map((c) => (
                  <div key={c.id} style={{
                    padding: '8px 10px',
                    background: 'rgba(255, 255, 255, 0.02)',
                    borderRadius: '6px',
                    marginBottom: '6px',
                    fontSize: '0.82rem'
                  }}>
                    <div style={{ color: 'var(--reddit-muted)', fontSize: '0.72rem', marginBottom: '3px' }}>
                      u/{c.author} • {c.timeAgo}
                    </div>
                    <div style={{ color: '#d1d5db' }}>{c.text}</div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

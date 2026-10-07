import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from './db.js';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: '*', methods: ['GET', 'POST'] } });
const JWT_SECRET = 'geekhub-secret-key-change-in-production';
const PORT = 3001;

app.use(cors());
app.use(express.json());

const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });
  try { req.user = jwt.verify(token, JWT_SECRET); next(); }
  catch { res.status(401).json({ error: 'Invalid token' }); }
};

const pub = (u) => u && { id: u.id, username: u.username, email: u.email, display_name: u.display_name, bio: u.bio, avatar_url: u.avatar_url, skills: u.skills || [], fandoms: u.fandoms || [], stats: u.stats || {} };

// ---------- Auth ----------
app.post('/api/auth/signup', async (req, res) => {
  const { username, email, password, displayName } = req.body;
  const hash = await bcrypt.hash(password, 10);
  try {
    const r = await pool.query(
      'INSERT INTO users (username, email, password_hash, display_name) VALUES ($1,$2,$3,$4) RETURNING *',
      [username, email, hash, displayName || username]);
    const token = jwt.sign({ id: r.rows[0].id, username }, JWT_SECRET);
    res.json({ token, user: pub(r.rows[0]) });
  } catch (e) { res.status(400).json({ error: e.message }); }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const r = await pool.query('SELECT * FROM users WHERE email=$1', [email]);
  const u = r.rows[0];
  if (!u || !await bcrypt.compare(password, u.password_hash)) return res.status(401).json({ error: 'Invalid credentials' });
  const token = jwt.sign({ id: u.id, username: u.username }, JWT_SECRET);
  res.json({ token, user: pub(u) });
});

// ---------- Users ----------
app.get('/api/users', authenticate, async (req, res) => {
  const r = await pool.query('SELECT * FROM users WHERE id!=$1 ORDER BY id LIMIT 100', [req.user.id]);
  res.json(r.rows.map(pub));
});

app.get('/api/users/:id', authenticate, async (req, res) => {
  const r = await pool.query('SELECT * FROM users WHERE id=$1', [req.params.id]);
  if (!r.rows[0]) return res.status(404).json({ error: 'Not found' });
  const u = pub(r.rows[0]);
  const stats = await pool.query(
    `SELECT (SELECT COUNT(*) FROM follows WHERE following_id=$1) AS followers,
            (SELECT COUNT(*) FROM follows WHERE follower_id=$1) AS following,
            (SELECT COUNT(*) FROM posts WHERE user_id=$1) AS posts`, [req.params.id]);
  const f = await pool.query('SELECT 1 FROM follows WHERE follower_id=$1 AND following_id=$2', [req.user.id, req.params.id]);
  res.json({ ...u, ...stats.rows[0], is_following: !!f.rows[0] });
});

app.put('/api/users/:id', authenticate, async (req, res) => {
  if (req.user.id !== parseInt(req.params.id)) return res.status(403).json({ error: 'Forbidden' });
  const { display_name, bio, avatar_url, skills, fandoms, stats } = req.body;
  const r = await pool.query(
    'UPDATE users SET display_name=COALESCE($1,display_name), bio=COALESCE($2,bio), avatar_url=COALESCE($3,avatar_url), skills=COALESCE($4,skills), fandoms=COALESCE($5,fandoms), stats=COALESCE($6,stats) WHERE id=$7 RETURNING *',
    [display_name, bio, avatar_url, skills, fandoms, stats, req.params.id]);
  res.json(pub(r.rows[0]));
});

// ---------- Follows ----------
app.post('/api/follows', authenticate, async (req, res) => {
  const { userId } = req.body;
  if (parseInt(userId) === req.user.id) return res.status(400).json({ error: 'Cannot follow yourself' });
  const ex = await pool.query('SELECT 1 FROM follows WHERE follower_id=$1 AND following_id=$2', [req.user.id, userId]);
  if (ex.rows[0]) {
    await pool.query('DELETE FROM follows WHERE follower_id=$1 AND following_id=$2', [req.user.id, userId]);
    return res.json({ following: false });
  }
  await pool.query('INSERT INTO follows (follower_id, following_id) VALUES ($1,$2) ON CONFLICT DO NOTHING', [req.user.id, userId]);
  res.json({ following: true });
});

app.get('/api/users/:id/followers', authenticate, async (req, res) => {
  const r = await pool.query('SELECT u.* FROM follows f JOIN users u ON u.id=f.follower_id WHERE f.following_id=$1', [req.params.id]);
  res.json(r.rows.map(pub));
});

app.get('/api/users/:id/following', authenticate, async (req, res) => {
  const r = await pool.query('SELECT u.* FROM follows f JOIN users u ON u.id=f.following_id WHERE f.follower_id=$1', [req.params.id]);
  res.json(r.rows.map(pub));
});

// ---------- Friendships (compat) ----------
app.post('/api/friendships', authenticate, async (req, res) => {
  const { friendId } = req.body;
  try {
    await pool.query('INSERT INTO follows (follower_id, following_id) VALUES ($1,$2) ON CONFLICT DO NOTHING', [req.user.id, friendId]);
    res.json({ following: true });
  } catch (e) { res.status(400).json({ error: e.message }); }
});
app.get('/api/friendships', authenticate, async (req, res) => {
  const r = await pool.query('SELECT u.* FROM follows f JOIN users u ON u.id=f.following_id WHERE f.follower_id=$1', [req.user.id]);
  res.json(r.rows.map(pub));
});

// ---------- Posts ----------
const enrichPosts = async (rows, meId) => {
  return Promise.all(rows.map(async (p) => {
    const [likes, comments, shares, liked] = await Promise.all([
      pool.query('SELECT COUNT(*) FROM post_likes WHERE post_id=$1', [p.id]),
      pool.query('SELECT COUNT(*) FROM comments WHERE post_id=$1', [p.id]),
      pool.query('SELECT COUNT(*) FROM post_shares WHERE post_id=$1', [p.id]),
      pool.query('SELECT 1 FROM post_likes WHERE post_id=$1 AND user_id=$2', [p.id, meId]),
    ]);
    return { ...p, like_count: +likes.rows[0].count, comment_count: +comments.rows[0].count, share_count: +shares.rows[0].count, liked_by_user: !!liked.rows[0] };
  }));
};

app.post('/api/posts', authenticate, async (req, res) => {
  const { content, image_url, tags } = req.body;
  const r = await pool.query('INSERT INTO posts (user_id, content, image_url, tags) VALUES ($1,$2,$3,$4) RETURNING *',
    [req.user.id, content, image_url || null, tags || []]);
  res.json(r.rows[0]);
});

app.get('/api/posts', authenticate, async (req, res) => {
  const r = await pool.query(
    `SELECT p.*, u.username, u.display_name, u.avatar_url FROM posts p JOIN users u ON u.id=p.user_id ORDER BY p.created_at DESC LIMIT 100`, []);
  res.json(await enrichPosts(r.rows, req.user.id));
});

app.post('/api/posts/:id/like', authenticate, async (req, res) => {
  const ex = await pool.query('SELECT 1 FROM post_likes WHERE post_id=$1 AND user_id=$2', [req.params.id, req.user.id]);
  if (ex.rows[0]) {
    await pool.query('DELETE FROM post_likes WHERE post_id=$1 AND user_id=$2', [req.params.id, req.user.id]);
    return res.json({ liked: false });
  }
  await pool.query('INSERT INTO post_likes (post_id, user_id) VALUES ($1,$2) ON CONFLICT DO NOTHING', [req.params.id, req.user.id]);
  res.json({ liked: true });
});

app.post('/api/posts/:id/share', authenticate, async (req, res) => {
  await pool.query('INSERT INTO post_shares (post_id, user_id) VALUES ($1,$2)', [req.params.id, req.user.id]);
  const r = await pool.query('SELECT COUNT(*) FROM post_shares WHERE post_id=$1', [req.params.id]);
  res.json({ share_count: +r.rows[0].count });
});

app.get('/api/posts/:id/comments', authenticate, async (req, res) => {
  const r = await pool.query(
    'SELECT c.*, u.username, u.display_name, u.avatar_url FROM comments c JOIN users u ON u.id=c.user_id WHERE c.post_id=$1 ORDER BY c.created_at ASC', [req.params.id]);
  res.json(r.rows);
});

app.post('/api/posts/:id/comments', authenticate, async (req, res) => {
  const { content } = req.body;
  const r = await pool.query('INSERT INTO comments (post_id, user_id, content) VALUES ($1,$2,$3) RETURNING *',
    [req.params.id, req.user.id, content]);
  res.json(r.rows[0]);
});

// ---------- Social feed: ranked posts ----------
app.get('/api/feed', authenticate, async (req, res) => {
  const meId = req.user.id;
  const me = (await pool.query('SELECT * FROM users WHERE id=$1', [meId])).rows[0];
  const myTags = new Set([...(me.skills || []), ...(me.fandoms || [])].map(t => String(t).toLowerCase()));
  const following = new Set((await pool.query('SELECT following_id FROM follows WHERE follower_id=$1', [meId])).rows.map(r => r.following_id));
  const likedByFollowing = await pool.query(
    `SELECT DISTINCT pl.post_id, u.username FROM post_likes pl JOIN users u ON u.id=pl.user_id WHERE pl.user_id = ANY($1)`, [ [...following] ]);
  const likedMap = {};
  likedByFollowing.rows.forEach(r => { (likedMap[r.post_id] = likedMap[r.post_id] || []).push(r.username); });

  const r = await pool.query(
    `SELECT p.*, u.username, u.display_name, u.avatar_url FROM posts p JOIN users u ON u.id=p.user_id ORDER BY p.created_at DESC LIMIT 200`, []);
  const enriched = await enrichPosts(r.rows, meId);
  const now = Date.now();
  const ranked = enriched.map(p => {
    const hours = Math.max(0.5, (now - new Date(p.created_at).getTime()) / 36e5);
    const tagOverlap = (p.tags || []).filter(t => myTags.has(String(t).toLowerCase())).length;
    const fromFollowed = following.has(p.user_id);
    const likedNames = likedMap[p.id] || [];
    let score = (p.like_count * 2 + p.comment_count * 3 + p.share_count * 4) / Math.pow(hours + 2, 1.2);
    if (fromFollowed) score += 25;
    if (likedNames.length) score += 15 + likedNames.length * 5;
    score += tagOverlap * 8;
    const reasons = [];
    if (fromFollowed) reasons.push(`From @${p.username} you follow`);
    if (likedNames.length) reasons.push(`Liked by ${likedNames.slice(0, 2).map(n => '@' + n).join(', ')}${likedNames.length > 2 ? ` +${likedNames.length - 2} more` : ''} you follow`);
    if (tagOverlap) reasons.push(`Matches your interests: ${(p.tags || []).filter(t => myTags.has(String(t).toLowerCase())).slice(0, 3).join(', ')}`);
    if (!reasons[0] && (p.like_count + p.comment_count) >= 5) reasons.push('Trending in GeekHub');
    return { ...p, feed_score: Math.round(score * 10) / 10, feed_reason: reasons[0] || null };
  }).sort((a, b) => b.feed_score - a.feed_score);
  res.json(ranked);
});

// ---------- Suggestions with reasons ----------
app.get('/api/suggestions', authenticate, async (req, res) => {
  const meId = req.user.id;
  const me = (await pool.query('SELECT * FROM users WHERE id=$1', [meId])).rows[0];
  const mySkills = new Set((me.skills || []).map(s => String(s).toLowerCase()));
  const myFandoms = new Set((me.fandoms || []).map(f => String(f).toLowerCase()));
  const following = new Set((await pool.query('SELECT following_id FROM follows WHERE follower_id=$1', [meId])).rows.map(r => r.following_id));
  const all = (await pool.query('SELECT * FROM users WHERE id!=$1 LIMIT 100', [meId])).rows;
  const out = [];
  for (const u of all) {
    if (following.has(u.id)) continue;
    const sharedSkills = (u.skills || []).filter(s => mySkills.has(String(s).toLowerCase()));
    const sharedFandoms = (u.fandoms || []).filter(f => myFandoms.has(String(f).toLowerCase()));
    // mutual: people I follow who also follow them
    const mutual = await pool.query(
      'SELECT u2.username FROM follows f1 JOIN follows f2 ON f2.following_id=$1 AND f2.follower_id=f1.following_id JOIN users u2 ON u2.id=f1.following_id WHERE f1.follower_id=$2 LIMIT 3',
      [u.id, meId]);
    const mutualNames = mutual.rows.map(r => r.username);
    let score = sharedSkills.length * 10 + sharedFandoms.length * 8 + mutualNames.length * 12;
    if (!score) continue;
    const reasons = [];
    if (sharedSkills.length || sharedFandoms.length)
      reasons.push(`Shares your interests: ${[...sharedSkills.slice(0, 2), ...sharedFandoms.slice(0, 2)].join(', ')}`);
    if (mutualNames.length) reasons.push(`Followed by ${mutualNames.slice(0, 2).map(n => '@' + n).join(', ')}${mutualNames.length > 2 ? ` +${mutualNames.length - 2}` : ''} — people you follow`);
    out.push({ ...pub(u), match_percentage: Math.min(99, 55 + score), recommend_reason: reasons.join(' · ') || 'Active in your communities' });
  }
  out.sort((a, b) => b.match_percentage - a.match_percentage);
  if (!out.length) {
    // Cold start: popular users for brand-new profiles with no tags/follows yet
    const pop = await pool.query(
      `SELECT u.*, (SELECT COUNT(*) FROM follows WHERE following_id=u.id) AS fc FROM users u
       WHERE u.id!=$1 AND u.id NOT IN (SELECT following_id FROM follows WHERE follower_id=$1)
       ORDER BY fc DESC LIMIT 6`, [meId]);
    return res.json(pop.rows.map(u => ({ ...pub(u), match_percentage: 60 + Math.min(30, +u.fc * 3), recommend_reason: 'Popular with geeks right now' })));
  }
  res.json(out.slice(0, 12));
});

app.get('/api/recommendations', authenticate, (req, res) => res.redirect('/api/suggestions'));

// ---------- Chat ----------
app.get('/api/conversations', authenticate, async (req, res) => {
  const r = await pool.query(
    `SELECT c.id, cp.user_id as other_user_id, u.username, u.display_name, u.avatar_url,
      (SELECT content FROM messages WHERE conversation_id=c.id ORDER BY created_at DESC LIMIT 1) as last_message,
      (SELECT created_at FROM messages WHERE conversation_id=c.id ORDER BY created_at DESC LIMIT 1) as last_message_at
     FROM conversations c JOIN conversation_participants cp ON cp.conversation_id=c.id
     JOIN users u ON u.id=cp.user_id
     WHERE c.id IN (SELECT conversation_id FROM conversation_participants WHERE user_id=$1) AND cp.user_id!=$1
     ORDER BY last_message_at DESC NULLS LAST`, [req.user.id]);
  res.json(r.rows);
});

app.get('/api/conversations/:id/messages', authenticate, async (req, res) => {
  const r = await pool.query(
    'SELECT m.*, u.username, u.display_name, u.avatar_url FROM messages m JOIN users u ON u.id=m.sender_id WHERE m.conversation_id=$1 ORDER BY m.created_at ASC', [req.params.id]);
  res.json(r.rows);
});

app.post('/api/conversations', authenticate, async (req, res) => {
  const { recipientId } = req.body;
  const ex = await pool.query(
    `SELECT c.id FROM conversations c JOIN conversation_participants cp1 ON cp1.conversation_id=c.id JOIN conversation_participants cp2 ON cp2.conversation_id=c.id WHERE cp1.user_id=$1 AND cp2.user_id=$2`,
    [req.user.id, recipientId]);
  if (ex.rows[0]) return res.json({ id: ex.rows[0].id });
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const conv = await client.query('INSERT INTO conversations DEFAULT VALUES RETURNING id');
    await client.query('INSERT INTO conversation_participants (conversation_id,user_id) VALUES ($1,$2)', [conv.rows[0].id, req.user.id]);
    await client.query('INSERT INTO conversation_participants (conversation_id,user_id) VALUES ($1,$2)', [conv.rows[0].id, recipientId]);
    await client.query('COMMIT');
    res.json({ id: conv.rows[0].id });
  } catch (e) { await client.query('ROLLBACK'); res.status(500).json({ error: e.message }); }
  finally { client.release(); }
});

io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) return next(new Error('No token'));
  try { socket.user = jwt.verify(token, JWT_SECRET); next(); }
  catch { next(new Error('Invalid token')); }
});

io.on('connection', (socket) => {
  socket.join(`user_${socket.user.id}`);
  socket.on('send_message', async ({ conversationId, content }) => {
    const r = await pool.query('INSERT INTO messages (conversation_id, sender_id, content) VALUES ($1,$2,$3) RETURNING *',
      [conversationId, socket.user.id, content]);
    const parts = await pool.query('SELECT user_id FROM conversation_participants WHERE conversation_id=$1', [conversationId]);
    parts.rows.forEach(p => io.to(`user_${p.user_id}`).emit('new_message', { ...r.rows[0], conversation_id: conversationId }));
  });
});

httpServer.listen(PORT, () => console.log(`GeekHub server on ${PORT}`));

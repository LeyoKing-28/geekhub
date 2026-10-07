import React, { useState, useEffect } from 'react';
import { api } from '../api';

// ---------- NotebookLM-style flow diagram: steps light up in sequence ----------
function Flow({ steps, speed = 950 }) {
  const [active, setActive] = useState(0);
  useEffect(() => { setActive(0); }, [steps]);
  useEffect(() => {
    if (active > steps.length) return;
    const t = setTimeout(() => setActive(a => a + 1), active === 0 ? 500 : speed);
    return () => clearTimeout(t);
  }, [active, steps, speed]);
  return (
    <div>
      {steps.map((s, i) => {
        const done = i < active, live = i === active;
        return (
          <div key={i} style={{ display: 'flex', gap: '12px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ ...f.dot, ...(done ? f.done : live ? f.live : {}) }}>{done ? '✓' : i + 1}</div>
              {i < steps.length - 1 && <div style={{ ...f.line, ...(done ? f.lineOn : {}) }} />}
            </div>
            <div style={{ ...f.node, ...(live ? f.nodeLive : {}), opacity: done || live ? 1 : 0.45, paddingBottom: 14 }}>
              <div style={f.stepTitle}>{s.t}</div>
              <div style={f.stepDetail}>{s.d}</div>
              {s.v != null && (done || live) && <div style={f.chip}>{s.v}</div>}
            </div>
          </div>
        );
      })}
      <button style={f.replay} onClick={() => setActive(0)}>↻ Replay flow</button>
    </div>
  );
}

function Doc({ d }) {
  return (
    <div style={f.doc}>
      <div style={f.docSec}><b>What it does — </b>{d.what}</div>
      <div style={f.docSec}><b>Why this one — </b>{d.why}</div>
      <div style={f.docSec}><b>Tradeoffs — </b>{d.trade}</div>
      <div style={f.cxRow}>
        {[['Best', d.cx.best], ['Worst', d.cx.worst], ['Space', d.cx.space]].map(([k, v]) => (
          <div key={k} style={f.cx}><span style={f.cxK}>{k}</span><span style={f.cxV}>{v}</span></div>
        ))}
      </div>
      <div style={f.cxNote}>{d.cx.note}</div>
    </div>
  );
}

const DOCS = {
  feed: { what: 'Scores every candidate post for YOU: engagement × recency decay, plus +25 if you follow the author, +15–40 if people you follow liked it, +8 per shared tag.',
    why: 'No ML training, no cold-start model. Fully explainable — every boost has a human-readable reason shown in the UI.',
    trade: 'Popularity bias (rich get richer); recency decay buries slow burners. Enrichment is N+1 queries (4 per post) — fine at 200 posts, must collapse into one aggregate query past ~10k.',
    cx: { best: 'Θ(P)', worst: 'Θ(P)', space: 'O(P)', note: 'P = candidate posts (capped at 200). Scoring itself is one linear pass.' } },
  suggest: { what: 'Scores every user you don\'t follow: +10 per shared skill, +8 per shared fandom, +12 per mutual (someone you follow who follows them), base 55, capped 99.',
    why: 'Combines interest similarity with social proof — the two strongest friendship signals. Mutuals come from a depth-2 walk of the follow graph.',
    trade: 'Echo chamber risk (recommends more of the same). Needs the popular-users fallback for brand-new profiles with no tags. O(U) indexed queries; super-connectors could blow up the mutual lookup, hence LIMIT 3.',
    cx: { best: 'Θ(U)', worst: 'Θ(U·F)', space: 'O(U)', note: 'U = users, F = avg follows. One indexed join per candidate.' } },
  jaccard: { what: 'J(A,B) = |A ∩ B| / |A ∪ B| over lowercase skill+fandom tag sets, via Set intersection.',
    why: 'Order-insensitive, length-normalized, O(n) and trivially interpretable — perfect for tag overlap.',
    trade: 'Treats all tags equally ("Rust" = "likes pizza"); misses synonyms ("K8s" vs "Kubernetes"). TF-IDF or embeddings would be richer but heavier and opaque.',
    cx: { best: 'Θ(|A|+|B|)', worst: 'Θ(|A|+|B|)', space: 'O(|A|+|B|)', note: 'Set build dominates; intersection is one pass.' } },
  graph: { what: 'Depth-2 breadth walk from you over the follows table: you → people you follow → who THEY follow. Those endpoints are friend-of-friend candidates.',
    why: 'Triadic closure — friends of friends convert to real connections at the highest rate of any signal.',
    trade: 'Quadratic blowup for super-connectors (capped at 3 per parent here). Stale if the graph is sparse — needs interest signals as backup.',
    cx: { best: 'Θ(F)', worst: 'Θ(F·k)', space: 'O(F·k)', note: 'F = your follows, k = cap per parent (3).' } },
  like: { what: 'Idempotent toggle: if a (post,user) row exists it is deleted (unlike), else inserted. Counters are COUNT(*) reads, never stored.',
    why: 'One endpoint instead of like/unlike pair — retry-safe, no double-like possible thanks to the composite primary key.',
    trade: 'COUNT(*) per read is O(L); fine now, needs a cached counter column + trigger past ~100k likes.',
    cx: { best: 'O(1)', worst: 'O(1)', space: 'O(1)', note: 'Single indexed PK lookup either way.' } },
  infra: { what: 'bcrypt(cost 10) password hashing + stateless JWT sessions; Socket.IO rooms (one per user id) for chat fan-out.',
    why: 'bcrypt is deliberately slow to resist brute force; JWTs need no session lookup; per-user rooms make DM delivery a direct emit.',
    trade: 'Login pays ~100ms of hashing. In-memory fan-out only works on one server — needs the Redis adapter to scale horizontally. JWTs cannot be revoked before expiry.',
    cx: { best: 'O(1) session verify', worst: 'O(2^cost) hash', space: 'O(1)', note: 'Chat fan-out is O(K) emits, K = participants (2 for DMs).' } },
};

function FeedPanel() {
  const [posts, setPosts] = useState([]);
  const [sel, setSel] = useState('');
  const [trace, setTrace] = useState(null);
  useEffect(() => { api.getFeed().then(f => { setPosts(f.slice(0, 12)); setSel(String(f[0]?.id || '')); }); }, []);
  const run = async (id) => {
    const t = await api.feedTrace(id || sel);
    const tr = t.trace;
    setTrace({ t, steps: [
      { t: '1 · Fetch candidates', d: `${t.total} latest posts joined with author profiles (single query, LIMIT 200).`, v: `${t.total} candidates` },
      { t: '2 · Tag overlap', d: `Your tags ∩ post tags = [${tr.sharedTags.join(', ') || '—'}]. Each shared tag is +8.`, v: `+${tr.sharedTags.length * 8}` },
      { t: '3 · Follow boost', d: tr.fromFollowed ? `You follow @${t.post.username}: flat +25.` : `You don't follow @${t.post.username}: no boost.`, v: tr.fromFollowed ? '+25' : '+0' },
      { t: '4 · Liked-by-your-follows', d: tr.likedNames.length ? `Liked by ${tr.likedNames.map(n => '@' + n).join(', ')} (people you follow): +${15 + tr.likedNames.length * 5}.` : 'Nobody you follow liked this: no boost.', v: tr.likedNames.length ? `+${15 + tr.likedNames.length * 5}` : '+0' },
      { t: '5 · Engagement × decay', d: `(${tr.likes}×2 + ${tr.comments}×3 + ${tr.shares}×4) / (${tr.hours}h + 2)^1.2 = ${tr.engagement} / ${tr.decay}`, v: `base ${tr.base}` },
      { t: '6 · Final score', d: `Ranked #${t.rank} of ${t.total}. Reason shown in feed:`, v: `${t.post.feed_score} — ${t.post.feed_reason || 'no boost, pure recency'}` },
    ]});
  };
  useEffect(() => { if (sel) run(sel); }, [sel]);
  return (
    <div>
      <Doc d={DOCS.feed} />
      <div style={f.pickRow}>
        <span style={f.pickLabel}>Trace post:</span>
        <select style={f.select} value={sel} onChange={e => run(e.target.value)}>
          {posts.map(p => <option key={p.id} value={p.id}>#{p.id} @{p.username} — {p.content.slice(0, 40)}…</option>)}
        </select>
      </div>
      {trace && <Flow steps={trace.steps} />}
    </div>
  );
}

function SuggestPanel() {
  const [users, setUsers] = useState([]);
  const [sel, setSel] = useState('');
  const [trace, setTrace] = useState(null);
  useEffect(() => { api.getSuggestions().then(s => { setUsers(s); setSel(String(s[0]?.id || '')); }); }, []);
  const run = async (id) => {
    const t = await api.suggestTrace(id || sel);
    const tr = t.trace;
    if (tr.coldStart) {
      setTrace({ t, steps: [
        { t: '1 · Cold start detected', d: 'Your profile has no tags or follows yet, so interest scoring returns nothing.', v: '0 scored' },
        { t: '2 · Popular fallback', d: 'Top users ordered by follower count instead.', v: `${tr.followerCount} followers` },
        { t: '3 · Final', d: `Ranked #${t.rank}. Add skills to your profile to switch to interest scoring.`, v: `${t.user.match_percentage}%` },
      ]});
      return;
    }
    setTrace({ t, steps: [
      { t: '1 · Candidates', d: 'All users minus you and everyone you already follow.', v: 'pool scanned' },
      { t: '2 · Shared skills (+10 each)', d: `[${tr.sharedSkills.join(', ') || '—'}]`, v: `+${tr.parts.skills}` },
      { t: '3 · Shared fandoms (+8 each)', d: `[${tr.sharedFandoms.join(', ') || '—'}]`, v: `+${tr.parts.fandoms}` },
      { t: '4 · Mutual follows (+12 each)', d: tr.mutualNames.length ? `People you follow who follow them: ${tr.mutualNames.map(n => '@' + n).join(', ')}` : 'No mutuals.', v: `+${tr.parts.mutuals}` },
      { t: '5 · Jaccard similarity', d: `|you ∩ them| = ${tr.interCount}, |union| = ${tr.unionCount}. Diagnostic gauge of pure tag overlap (score uses the weighted parts above).`, v: `J = ${tr.jaccard}` },
      { t: '6 · Final', d: `55 base + parts, capped at 99. Ranked #${t.rank}.`, v: `${t.user.match_percentage}% — ${t.user.recommend_reason}` },
    ]});
  };
  useEffect(() => { if (sel) run(sel); }, [sel]);
  return (
    <div>
      <Doc d={DOCS.suggest} />
      <div style={f.pickRow}>
        <span style={f.pickLabel}>Trace user:</span>
        <select style={f.select} value={sel} onChange={e => run(e.target.value)}>
          {users.map(u => <option key={u.id} value={u.id}>@{u.username} ({u.match_percentage}%)</option>)}
        </select>
      </div>
      {trace && <Flow steps={trace.steps} />}
    </div>
  );
}

function JaccardPanel() {
  const [me, setMe] = useState(null);
  const [cands, setCands] = useState([]);
  const [sel, setSel] = useState('');
  useEffect(() => { api.labOverview().then(o => setMe(o.me)); api.getSuggestions().then(s => { setCands(s); setSel(String(s[0]?.id || '')); }); }, []);
  const other = cands.find(c => String(c.id) === String(sel));
  const norm = a => (a || []).map(t => String(t).toLowerCase());
  const A = new Set([...norm(me?.skills), ...norm(me?.fandoms)]);
  const B = new Set([...norm(other?.skills), ...norm(other?.fandoms)]);
  const inter = [...B].filter(t => A.has(t));
  const union = new Set([...A, ...B]);
  const j = union.size ? inter.length / union.size : 0;
  return (
    <div>
      <Doc d={DOCS.jaccard} />
      <div style={f.pickRow}>
        <span style={f.pickLabel}>Compare me with:</span>
        <select style={f.select} value={sel} onChange={e => setSel(e.target.value)}>
          {cands.map(u => <option key={u.id} value={u.id}>@{u.username}</option>)}
        </select>
      </div>
      <div style={f.sets}>
        <div style={f.setBox}><b style={f.setT}>YOU ({A.size})</b>{[...A].join(', ') || '—'}</div>
        <div style={f.setBoxHi}><b style={f.setT}>∩ INTERSECTION ({inter.length})</b>{inter.join(', ') || '∅'}</div>
        <div style={f.setBox}><b style={f.setT}>@{other?.username} ({B.size})</b>{[...B].join(', ') || '—'}</div>
      </div>
      <div style={f.jScore}>J = {inter.length} / {union.size} = <b>{j.toFixed(3)}</b></div>
    </div>
  );
}

function GraphPanel() {
  const [g, setG] = useState(null);
  useEffect(() => { api.egoGraph().then(setG); }, []);
  if (!g) return <div style={f.loading}>Loading graph…</div>;
  const l1 = g.nodes.filter(n => n.kind === 'follows');
  const l2 = g.nodes.filter(n => n.kind === 'mutual');
  const H = Math.max(l1.length, l2.length, 1) * 30 + 40;
  const y = (i, n) => 20 + (i + 0.5) * ((H - 40) / Math.max(n, 1));
  const pos = { [g.nodes[0].id]: [50, H / 2] };
  l1.forEach((n, i) => pos[n.id] = [210, y(i, l1.length)]);
  l2.forEach((n, i) => pos[n.id] = [380, y(i, l2.length)]);
  const col = { me: '#ff4500', follows: '#22c55e', mutual: '#7193ff' };
  return (
    <div>
      <Doc d={DOCS.graph} />
      <svg viewBox={`0 0 460 ${H}`} style={{ width: '100%', background: '#141b26', borderRadius: 12, marginTop: 12 }}>
        {g.edges.map(([a, b], i) => pos[a] && pos[b] && (
          <line key={i} x1={pos[a][0]} y1={pos[a][1]} x2={pos[b][0]} y2={pos[b][1]} stroke="#334155" strokeWidth="1.5" />
        ))}
        {g.nodes.map(n => pos[n.id] && (
          <g key={n.id}>
            <circle cx={pos[n.id][0]} cy={pos[n.id][1]} r={n.kind === 'me' ? 12 : 8} fill={col[n.kind]} />
            <text x={pos[n.id][0] + 14} y={pos[n.id][1] + 4} fill="#e2e8f0" fontSize="10">{n.label}</text>
          </g>
        ))}
      </svg>
      <div style={f.legend}><span style={{ color: '#ff4500' }}>● you</span><span style={{ color: '#22c55e' }}>● you follow ({l1.length})</span><span style={{ color: '#7193ff' }}>● friends-of-friends ({l2.length})</span></div>
    </div>
  );
}

function InteractPanel() {
  const [log, setLog] = useState([]);
  const [busy, setBusy] = useState(false);
  const push = (t, d, v) => setLog(l => [...l, { t, d, v }]);

  const demoLike = async () => {
    setBusy(true); setLog([]);
    const feed = await api.getFeed();
    const p = feed.find(x => !x.liked_by_user) || feed[0];
    const before = (await api.feedTrace(p.id)).post.feed_score;
    push('YOU · tap 🤍 on post #' + p.id, `"${p.content.slice(0, 60)}…" by @${p.username}`, `score ${before}`);
    await api.likePost(p.id);
    push('BACKEND · INSERT INTO post_likes', 'Composite PK (post_id, user_id) — retry-safe, no double likes.', '1 row');
    const after = (await api.feedTrace(p.id)).post.feed_score;
    push('BACKEND · score recomputed', `Your like is someone else's social proof: engagement +2 → decay. Your own feed barely moves (you can't boost yourself).`, `${before} → ${after}`);
    await api.likePost(p.id); // restore
    push('CLEANUP · unlike (toggle back)', 'Demo data left exactly as found.', 'restored');
    setBusy(false);
  };

  const demoFollow = async () => {
    setBusy(true); setLog([]);
    const sugs = await api.getSuggestions();
    const u = sugs[0];
    push('YOU · tap Follow on @' + u.username, u.recommend_reason, `${u.match_percentage}%`);
    await api.toggleFollow(u.id);
    push('BACKEND · INSERT INTO follows', 'Composite PK (follower_id, following_id). Their posts instantly gain +25 in YOUR feed; their likes now boost YOUR feed (+15 each).', '1 row');
    const feed = await api.getFeed();
    const theirs = feed.find(x => x.user_id === u.id);
    push('BACKEND · feed recomputed', theirs ? `Their post now reads "${theirs.feed_reason}".` : 'Their posts surface at top on next Discover visit.', 'live');
    await api.toggleFollow(u.id); // restore
    push('CLEANUP · unfollow (toggle back)', 'Demo data left exactly as found.', 'restored');
    setBusy(false);
  };

  return (
    <div>
      <Doc d={DOCS.like} />
      <div style={{ display: 'flex', gap: 8, margin: '12px 0' }}>
        <button style={f.btn} disabled={busy} onClick={demoLike}>🤍 Like a post (live)</button>
        <button style={f.btn} disabled={busy} onClick={demoFollow}>＋ Follow a suggestion (live)</button>
      </div>
      {log.length > 0 && <Flow speed={1200} steps={log} />}
      <div style={f.docSec}>Comment = <b>INSERT INTO comments</b> O(1), read chronologically O(C). Share = <b>INSERT INTO post_shares</b> event log O(1). Both feed back into the engagement numerator (comments ×3, shares ×4).</div>
    </div>
  );
}

function InfraPanel() {
  return (
    <div>
      <Doc d={DOCS.infra} />
      <div style={f.twoCol}>
        <div>
          <div style={f.flowH}>Signup / Login</div>
          <Flow speed={700} steps={[
            { t: 'Client sends credentials', d: 'POST /api/auth/login { email, password } — password never stored, only compared.', v: 'HTTPS JSON' },
            { t: 'bcrypt.compare', d: 'Deliberately slow hash (~100ms at cost 10). Brute force costs 2^10 rounds per guess.', v: 'O(2^cost)' },
            { t: 'JWT issued', d: 'Signed { id, username }. Every later request verifies HMAC — no session table lookup.', v: 'O(1) verify' },
          ]} />
        </div>
        <div>
          <div style={f.flowH}>Chat message</div>
          <Flow speed={700} steps={[
            { t: 'Socket emits send_message', d: 'Authenticated at handshake; socket joins room user_<id>.', v: '1 socket' },
            { t: 'INSERT INTO messages', d: 'Durable write first — history survives disconnects.', v: 'O(1)' },
            { t: 'Fan-out to rooms', d: 'Participants looked up, message emitted to each user_<id> room. DMs: K = 2.', v: 'O(K) emits' },
          ]} />
        </div>
      </div>
    </div>
  );
}

const TABS = [
  ['feed', 'Feed Ranking', FeedPanel],
  ['suggest', 'Suggestions', SuggestPanel],
  ['jaccard', 'Jaccard', JaccardPanel],
  ['graph', 'Follow Graph', GraphPanel],
  ['interact', 'Try It Live', InteractPanel],
  ['infra', 'Auth & Chat', InfraPanel],
];

export function AlgorithmLab() {
  const [tab, setTab] = useState('feed');
  const [counts, setCounts] = useState(null);
  useEffect(() => { api.labOverview().then(o => setCounts(o.counts)); }, []);
  const Panel = TABS.find(t => t[0] === tab)[2];
  return (
    <div style={f.wrap}>
      <h2 style={f.title}>Algorithm Lab</h2>
      <p style={f.sub}>Every trace below runs against the live backend — same code path as Discover. {counts && `${counts.users} users · ${counts.posts} posts · ${counts.likes} likes · ${counts.follows} follows in the graph right now.`}</p>
      <div style={f.chips}>{TABS.map(([id, label]) => (
        <button key={id} style={{ ...f.chip, ...(tab === id ? f.chipOn : {}) }} onClick={() => setTab(id)}>{label}</button>
      ))}</div>
      <Panel key={tab} />
    </div>
  );
}

const f = {
  wrap: { maxWidth: '680px', margin: '0 auto', padding: '24px 16px 60px' },
  title: { color: '#fff', fontSize: '1.25rem', fontWeight: 800, margin: 0 },
  sub: { color: '#64748b', fontSize: '0.85rem', margin: '4px 0 16px', lineHeight: 1.5 },
  chips: { display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 },
  chip: { padding: '7px 14px', borderRadius: 999, border: 'none', background: '#1e293b', color: '#94a3b8', fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer' },
  chipOn: { background: 'rgba(255,69,0,0.15)', color: '#ff4500' },
  doc: { background: '#141b26', borderRadius: 12, padding: 14, marginBottom: 12 },
  docSec: { color: '#cbd5e1', fontSize: '0.83rem', lineHeight: 1.55, marginBottom: 8 },
  cxRow: { display: 'flex', gap: 8, marginTop: 10 },
  cx: { flex: 1, background: '#1e293b', borderRadius: 8, padding: '8px 10px', display: 'flex', flexDirection: 'column' },
  cxK: { color: '#64748b', fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase' },
  cxV: { color: '#22c55e', fontSize: '0.9rem', fontWeight: 800, fontFamily: 'monospace' },
  cxNote: { color: '#64748b', fontSize: '0.75rem', marginTop: 8, lineHeight: 1.5 },
  pickRow: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 },
  pickLabel: { color: '#94a3b8', fontSize: '0.8rem', fontWeight: 600 },
  select: { flex: 1, padding: '9px 12px', borderRadius: 8, border: 'none', outline: 'none', background: '#1e293b', color: '#fff', fontSize: '0.83rem' },
  dot: { width: 26, height: 26, borderRadius: '50%', background: '#1e293b', color: '#64748b', fontSize: '0.72rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all .3s' },
  live: { background: '#ff4500', color: '#fff', boxShadow: '0 0 14px rgba(255,69,0,.7)' },
  done: { background: 'rgba(34,197,94,.2)', color: '#22c55e' },
  line: { width: 2, flex: 1, minHeight: 14, background: '#1e293b', transition: 'all .3s' },
  lineOn: { background: '#22c55e' },
  node: { flex: 1, background: '#141b26', borderRadius: 10, padding: '10px 12px', transition: 'all .3s' },
  nodeLive: { background: '#1e293b' },
  stepTitle: { color: '#fff', fontSize: '0.85rem', fontWeight: 700 },
  stepDetail: { color: '#94a3b8', fontSize: '0.78rem', marginTop: 3, lineHeight: 1.5 },
  chip2: {},
  replay: { marginTop: 4, padding: '7px 14px', borderRadius: 8, border: 'none', background: '#334155', color: '#fff', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600 },
  sets: { display: 'flex', gap: 8, marginTop: 12 },
  setBox: { flex: 1, background: '#141b26', borderRadius: 10, padding: 10, color: '#94a3b8', fontSize: '0.75rem', lineHeight: 1.6 },
  setBoxHi: { flex: 1, background: 'rgba(34,197,94,.1)', borderRadius: 10, padding: 10, color: '#22c55e', fontSize: '0.75rem', lineHeight: 1.6 },
  setT: { display: 'block', fontSize: '0.68rem', marginBottom: 4 },
  jScore: { marginTop: 12, background: '#1e293b', borderRadius: 10, padding: 12, color: '#fff', fontSize: '0.95rem', fontFamily: 'monospace' },
  legend: { display: 'flex', gap: 14, fontSize: '0.75rem', marginTop: 8 },
  loading: { color: '#94a3b8', padding: 24, textAlign: 'center' },
  btn: { flex: 1, padding: '10px', borderRadius: 8, border: 'none', background: '#ff4500', color: '#fff', fontWeight: 700, cursor: 'pointer', fontSize: '0.83rem' },
  twoCol: { display: 'flex', flexDirection: 'column', gap: 20 },
  flowH: { color: '#fff', fontWeight: 700, fontSize: '0.9rem', marginBottom: 8 },
};

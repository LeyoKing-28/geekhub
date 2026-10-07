import pg from 'pg';

const { Pool } = pg;
const pool = new Pool({ host: 'localhost', port: 5432, database: 'geekhub', user: 'adityajadhav', password: '' });

let s = 7;
const R = () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296;
const pick = (a) => a[Math.floor(R() * a.length)];
const pickN = (a, n) => [...a].sort(() => R() - 0.5).slice(0, n);

// [caption, tags]
const IMG = [
  ['One Piece cosplay lineup finally came together', ['One Piece', 'Cosplay']],
  ['Demon Slayer figure shelf is complete', ['Demon Slayer', 'Anime']],
  ['Naruto ramen night with the squad', ['Naruto', 'Anime']],
  ['Bleach manga panel study — Kubo is unmatched', ['Bleach', 'Manga']],
  ['RAG pipeline whiteboard from today\'s deep dive', ['AI', 'Python']],
  ['4090 workstation finally assembled', ['CUDA', 'Hardware']],
  ['LoRA fine-tune loss curve looking clean', ['PyTorch', 'AI']],
  ['Hollow Knight fan art, ink stage WIP', ['Hollow Knight', 'Pixel Art']],
  ['Battlestation where the speedruns happen', ['Gaming', 'Hardware']],
  ['Elden Ring platinum screenshot dump', ['Elden Ring', 'Gaming']],
  ['Holy Panda build — sound test in comments', ['Keyboards', 'Hardware']],
  ['Brass plate Alice, fresh lube job', ['Keyboards', 'Custom Keyboards']],
  ['Neovim + tmux setup tour', ['Neovim', 'Linux']],
  ['New portfolio shipped, lighthouse 100s', ['React', 'TypeScript']],
  ['Rust WASM demo running at 60fps', ['Rust', 'WebGPU']],
  ['Flipper Zero + lab bench tour', ['Cybersec', 'Hardware']],
  ['CTF trophy wall update', ['CTF', 'Go']],
  ['Session 40 minis, fully painted', ['D&D', 'Warhammer 40k']],
  ['Terraforming Mars game night spread', ['Board Games', 'Tabletop RPGs']],
  ['3D printer farm running overnight', ['3D Printing', 'Hardware']],
  ['Attack on Titan finale rewatch hits hard', ['Attack on Titan', 'Anime']],
  ['My Hero Academia cosplay progress', ['My Hero Academia', 'Cosplay']],
  ['Agents demo: multi-step coding task done', ['AI', 'Python']],
  ['Celeste golden strawberry grind continues', ['Celeste', 'Gaming']],
  ['Stardew Valley farm year 3 layout', ['Stardew Valley', 'Gaming']],
];
const COMMENTS = ['This is elite', 'Tutorial when?', 'Instant follow for this', 'The details here are insane', 'Tried this last week, can confirm', 'Saving this for later', 'How long did this take?', 'Clean work'];

async function main() {
  const seeds = (await pool.query(`SELECT id, username FROM users WHERE email LIKE 'seed%@geekhub.test' ORDER BY id`)).rows;
  const seedIds = seeds.map((u) => u.id);

  // aditya (id 1): set interests so recommendations have signal
  await pool.query(`UPDATE users SET display_name='Aditya', bio='Systems + anime. Rust, keyboards, One Piece.',
    skills='{Rust,Neovim,Python}', fandoms='{"One Piece","Elden Ring","Ghost in the Shell"}' WHERE id=1`);

  // 50 image posts spread across seed users + 2 from aditya
  const imgPostIds = [];
  for (let i = 0; i < 50; i++) {
    const uid = i < 2 ? 1 : pick(seedIds);
    const [cap, tags] = IMG[i % IMG.length];
    const r = await pool.query(
      `INSERT INTO posts (user_id, content, image_url, tags, created_at)
       VALUES ($1,$2,$3,$4,NOW() - ($5 || ' minutes')::interval) RETURNING id`,
      [uid, i < 2 ? cap + ' (pinned from my setup)' : cap, `https://picsum.photos/seed/geekhub${i}/800/600`, tags, String(Math.floor(R() * 4000))]);
    imgPostIds.push(r.rows[0].id);
  }

  // Social storm: likes + comments + shares + follows on the new image posts
  for (const pid of imgPostIds) {
    for (const uid of pickN(seedIds, 3 + Math.floor(R() * 8)))
      await pool.query('INSERT INTO post_likes (post_id, user_id) VALUES ($1,$2) ON CONFLICT DO NOTHING', [pid, uid]);
    for (let c = 0; c < Math.floor(R() * 3); c++) {
      const author = (await pool.query('SELECT user_id FROM posts WHERE id=$1', [pid])).rows[0].user_id;
      const commenters = seedIds.filter((id) => id !== author);
      await pool.query('INSERT INTO comments (post_id, user_id, content) VALUES ($1,$2,$3)', [pid, pick(commenters), pick(COMMENTS)]);
    }
    if (R() < 0.4)
      await pool.query('INSERT INTO post_shares (post_id, user_id) VALUES ($1,$2)', [pid, pick(seedIds)]);
  }
  // aditya likes 15 posts, follows 10 users; 15 seed users follow aditya back
  const allPosts = (await pool.query('SELECT id FROM posts ORDER BY RANDOM() LIMIT 15')).rows;
  for (const p of allPosts)
    await pool.query('INSERT INTO post_likes (post_id, user_id) VALUES ($1,$2) ON CONFLICT DO NOTHING', [p.id, 1]);
  for (const fid of pickN(seedIds, 10))
    await pool.query('INSERT INTO follows (follower_id, following_id) VALUES (1,$1) ON CONFLICT DO NOTHING', [fid]);
  for (const fid of pickN(seedIds, 15))
    await pool.query('INSERT INTO follows (follower_id, following_id) VALUES ($1,1) ON CONFLICT DO NOTHING', [fid]);

  // Chats: 3 conversations involving aditya with real messages
  const chatPeers = pickN(seedIds, 3);
  const threads = [
    ['Hey! Loved your Rust WASM post', 'Thanks! The borrow checker fought me the whole way', 'Worth it, 60fps is smooth'],
    ['One Piece or Naruto, pick one', 'One Piece and it is not close', 'Correct answer'],
    ['What switches are you on?', 'Holy Pandas, lubed and filmed', 'Elite taste'],
  ];
  for (let i = 0; i < 3; i++) {
    const c = await pool.query('INSERT INTO conversations DEFAULT VALUES RETURNING id');
    await pool.query('INSERT INTO conversation_participants (conversation_id, user_id) VALUES ($1,1),($1,$2)', [c.rows[0].id, chatPeers[i]]);
    for (let m = 0; m < threads[i].length; m++)
      await pool.query('INSERT INTO messages (conversation_id, sender_id, content) VALUES ($1,$2,$3)',
        [c.rows[0].id, m % 2 === 0 ? chatPeers[i] : 1, threads[i][m]]);
  }

  const c = await pool.query('SELECT (SELECT COUNT(*) FROM posts WHERE image_url IS NOT NULL) img, (SELECT COUNT(*) FROM comments) cm, (SELECT COUNT(*) FROM conversations) cv');
  console.log('Phase2:', c.rows[0]);
  await pool.end();
}
main().catch((e) => { console.error(e); process.exit(1); });

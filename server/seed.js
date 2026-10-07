import pg from 'pg';
import bcrypt from 'bcryptjs';

const { Pool } = pg;
const pool = new Pool({ host: 'localhost', port: 5432, database: 'geekhub', user: 'adityajadhav', password: '' });

// Deterministic PRNG so reseeds are stable
let s = 42;
const R = () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296;
const pick = (a) => a[Math.floor(R() * a.length)];
const pickN = (a, n) => [...a].sort(() => R() - 0.5).slice(0, n);

const FIRST = ['Akira', 'Yuki', 'Sakura', 'Ren', 'Kai', 'Mei', 'Sora', 'Rin', 'Hana', 'Kenji', 'Aoi', 'Takumi', 'Mira', 'Dev', 'Zara', 'Leo'];
const LAST = ['tanaka', 'coder', 'senpai', 'bytes', '.exe'];

const N = {
  anime: { skills: ['Pixel Art', 'Video Editing'], fandoms: ['One Piece', 'Naruto', 'Bleach', 'Demon Slayer', 'Jujutsu Kaisen', 'Attack on Titan'], topics: ['One Piece', 'Naruto', 'Bleach', 'Demon Slayer', 'Jujutsu Kaisen', 'Chainsaw Man', 'Spy x Family', 'Frieren'], posts: ['Just caught up on {t} and the latest arc broke me. No spoilers but THAT fight??', '{t} reread hits different at 2am. The foreshadowing was there all along.', 'Unpopular opinion: {t} has the best opening arc in shonen. Fight me.', 'Cosplay progress for {t} — armor is 80% printed, wig styled tonight.', 'Ranked every {t} opening. Number 3 lives in my head rent-free.', 'The {t} manga paneling in this chapter is masterclass. Studied it for an hour.'] },
  ai: { skills: ['Python', 'PyTorch', 'CUDA'], fandoms: ['Neon Genesis Evangelion', 'Steins;Gate'], topics: ['transformers', 'diffusion models', 'LoRA fine-tuning', 'RAG pipelines', 'quantization', 'agents'], posts: ['Shipped a {t} side project this weekend. Loss curve finally behaving.', 'New paper on {t} just dropped — the eval section is worth your time.', 'My {t} notes repo hit 200 stars. Open-sourcing the rest tomorrow.', 'Hot take: {t} is overhyped for prod, underhyped for research.', 'Built a tiny {t} demo on a single 4090. Details in thread.', 'The {t} discourse is loud but the benchmarks speak for themselves.'] },
  gamedev: { skills: ['C++', 'Unreal Engine', 'Godot'], fandoms: ['Hollow Knight', 'Celeste', 'Zelda', 'Elden Ring'], topics: ['Hollow Knight', 'Celeste', 'Elden Ring', 'Hades', 'Stardew Valley'], posts: ['Speedrun PB on {t} tonight! Shaved 40 seconds off my split.', '{t} level design thread: why the verticality works so well.', 'My {t}-inspired prototype finally has working physics. Clips soon.', 'Trading Steam libraries — {t} fans, what should I play next?', 'Baked lightmaps for 6 hours. {t} devs, I feel your pain.', '{t} soundtrack on loop while I debug collision code.'] },
  kb: { skills: ['Soldering', 'QMK', 'CAD'], fandoms: ['Cyberpunk', 'Ghost in the Shell'], topics: ['Holy Pandas', 'brass plates', 'Alice layouts', 'PBT keycaps', 'lubing switches'], posts: ['Lubed {t} build complete. The thock is unreal.', 'My {t} setup finally done — sound test drops Friday.', 'Group buy for {t} parts arrived. Building all weekend.', 'Battlestation update: finally cable-managed the {t} rig.', '{t} vs stock switches — blind test results surprised me.'] },
  web: { skills: ['TypeScript', 'React', 'Rust', 'Neovim'], fandoms: ['Mr. Robot', 'Blade Runner'], topics: ['React Server Components', 'Rust WASM', 'edge rendering', 'type-safe APIs', 'HTMX'], posts: ['Rewrote my blog in {t}. Lighthouse 100s across the board.', '{t} deep-dive I wish existed when I started — writing it now.', 'My dotfiles + {t} setup tour. 400 lines of Lua, zero regrets.', 'Ask me about {t}. Been in the trenches for months.', 'Shipped {t} to prod at 2am. Zero memory leaks, one existential crisis.'] },
  sec: { skills: ['Go', 'Assembly', 'Flipper Zero'], fandoms: ['Mr. Robot', 'Tron'], topics: ['CTF binaries', 'Flipper Zero', 'zero-knowledge proofs', 'NixOS', 'Kali'], posts: ['Solved a nasty {t} challenge — 6 hours, ambient synthwave, glory.', 'My {t} homelab write-up is live. Full opsec included.', 'Hot take: {t} is the only sane way to run CTF tooling.', 'Picked 3 locks this weekend. {t} folks, lets trade notes.'] },
  table: { skills: ['Blender', '3D Printing'], fandoms: ['D&D', 'Warhammer 40k', 'Board Games'], topics: ['D&D campaign', 'Terraforming Mars', 'mini painting', 'homebrew rules'], posts: ['Session 40 of my {t} — the party finally met the BBEG.', 'Painted 12 minis this weekend for the {t}. Pics in replies.', '{t} night was elite. Betrayal at hour 3, alliances at hour 5.'] },
  sci: { skills: ['Python', 'R', 'BioPython'], fandoms: ['Doctor Who', 'Foundation', 'Dune'], topics: ['genome assembly', 'Dune lore', '3D printed lab gear', 'boba-fueled analysis'], posts: ['Pipeline for {t} finally reproducible. NixOS + containers.', '{t} reread + lab work is my whole personality now.', 'Printed custom {t} parts. Science is just crafting with data.'] },
};
const KEYS = Object.keys(N);
const EDITORS = ['Neovim', 'VS Code', 'Emacs', 'Helix', 'Vim'];
const INDENT = ['2 Spaces', '4 Spaces', 'Tabs'];

async function main() {
  await pool.query(`DELETE FROM users WHERE email LIKE 'seed%@geekhub.test'`);
  const hash = await bcrypt.hash('password123', 10);
  const users = [];
  for (let i = 0; i < 80; i++) {
    const fn = FIRST[i % FIRST.length], ln = LAST[Math.floor(i / FIRST.length) % LAST.length];
    const nk = KEYS[i % KEYS.length], niche = N[nk];
    const skills = pickN(niche.skills.concat(pick(KEYS) === nk ? [] : N[pick(KEYS)].skills), 2 + Math.floor(R() * 2));
    const fandoms = pickN(niche.fandoms.concat(pick(KEYS) === nk ? [] : N[pick(KEYS)].fandoms), 2 + Math.floor(R() * 2));
    const username = `${fn.toLowerCase()}_${ln}${i}`;
    const r = await pool.query(
      `INSERT INTO users (username, email, password_hash, display_name, bio, avatar_url, skills, fandoms, stats)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING id`,
      [username, `seed${i}@geekhub.test`, hash, `${fn} ${ln}`, `${pick(['Rustacean','ML tinkerer','Keyboard builder','Speedrunner','CTF player','DM','Cosplayer','Indie hacker'])} into ${niche.fandoms[0]}.`,
        `https://api.dicebear.com/7.x/bottts/svg?seed=${username}`, skills, fandoms,
        { tabVsSpace: pick(INDENT), editor: pick(EDITORS) }]);
    users.push({ id: r.rows[0].id, niche: nk, idx: i });
  }
  // Posts: ~2-3 per user = ~200
  let postCount = 0;
  const postIds = [];
  for (const u of users) {
    const niche = N[u.niche];
    const n = 2 + (u.idx % 2);
    for (let j = 0; j < n && postCount < 200; j++) {
      const t = pick(niche.posts).replace('{t}', pick(niche.topics));
      const tags = pickN(niche.topics.concat(niche.skills), 1 + Math.floor(R() * 2));
      const hoursAgo = Math.floor(R() * 340);
      const r = await pool.query(
        `INSERT INTO posts (user_id, content, tags, created_at) VALUES ($1,$2,$3,NOW() - ($4 || ' hours')::interval) RETURNING id`,
        [u.id, t, tags, String(hoursAgo)]);
      postIds.push({ id: r.rows[0].id, niche: u.niche });
      postCount++;
    }
  }
  // Likes: each post 1-8 likes, biased to same-niche users
  const byNiche = {};
  users.forEach((u) => { (byNiche[u.niche] = byNiche[u.niche] || []).push(u.id); });
  for (const p of postIds) {
    const pool_ids = (byNiche[p.niche] || []).concat(users.map((u) => u.id));
    for (const uid of pickN(pool_ids, 1 + Math.floor(R() * 7))) {
      await pool.query('INSERT INTO post_likes (post_id, user_id) VALUES ($1,$2) ON CONFLICT DO NOTHING', [p.id, uid]);
    }
  }
  // Follows: each user follows 5-10 others, biased same-niche
  for (const u of users) {
    const same = (byNiche[u.niche] || []).filter((id) => id !== u.id);
    const others = users.map((x) => x.id).filter((id) => id !== u.id && !same.includes(id));
    for (const fid of pickN(same.concat(others), 5 + Math.floor(R() * 6))) {
      await pool.query('INSERT INTO follows (follower_id, following_id) VALUES ($1,$2) ON CONFLICT DO NOTHING', [u.id, fid]);
    }
  }
  const c = await pool.query('SELECT (SELECT COUNT(*) FROM users WHERE email LIKE \'seed%@geekhub.test\') u, (SELECT COUNT(*) FROM posts p JOIN users x ON x.id=p.user_id WHERE x.email LIKE \'seed%@geekhub.test\') p');
  console.log('Seeded:', c.rows[0]);
  await pool.end();
}
main().catch((e) => { console.error(e); process.exit(1); });

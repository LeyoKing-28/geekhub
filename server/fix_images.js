import pg from 'pg';

const { Pool } = pg;
const pool = new Pool({ host: 'localhost', port: 5432, database: 'geekhub', user: 'adityajadhav', password: '' });
const U = (id) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=800&q=60`;

// [distinctive caption substring, photo id] — each caption gets a topical photo
const MAP = [
  ['cosplay lineup', '1606092195730-5d7b9af1efc5'],
  ['figure shelf', '1613376023733-0a73315d9b06'],
  ['ramen night', '1569718212165-3a8278d5f624'],
  ['manga panel study', '1612036782180-6f0b6cd846fe'],
  ['whiteboard', '1531482615713-2afd69097998'],
  ['4090 workstation', '1587202372634-32705e3bf49c'],
  ['Loss curve', '1461749280684-dccba630e2f6'],
  ['fan art, ink stage', '1511512578047-dfb367046420'],
  ['where the speedruns happen', '1593062096033-9a26b09da705'],
  ['platinum screenshot', '1552820728-8b83bb6b773f'],
  ['sound test in comments', '1587829741301-dc798b83add3'],
  ['fresh lube job', '1595225476474-87563907a212'],
  ['setup tour', '1555066931-4365d14bab8c'],
  ['lighthouse 100s', '1593642632823-8f785ba67e45'],
  ['60fps', '1517694712202-14dd9538aa97'],
  ['lab bench tour', '1518770660439-4636190af475'],
  ['trophy wall', '1550751827-4bd374c3f58b'],
  ['fully painted', '1610890716171-6b1bb98ffd09'],
  ['game night spread', '1560253023-3ec5d502959f'],
  ['printer farm', '1537462715879-360eeb61a0ad'],
  ['finale rewatch', '1542931287-023b922fa89b'],
  ['cosplay progress', '1542051841857-5f90071e7989'],
  ['coding task done', '1485827404703-89b55fcc595e'],
  ['golden strawberry', '1464822759023-fed622ff2c3b'],
  ['farm year 3', '1500382017468-9049fed747ef'],
];

async function main() {
  for (const [sub, pid] of MAP) {
    const r = await pool.query(
      `UPDATE posts SET image_url=$1 WHERE content LIKE $2 AND image_url LIKE '%picsum%'`,
      [U(pid), `%${sub}%`]);
    console.log(`${r.rowCount}x ${sub}`);
  }
  const c = await pool.query(
    `SELECT COUNT(*) total, COUNT(DISTINCT image_url) uniq,
      COUNT(*) FILTER (WHERE image_url LIKE '%picsum%') picsum_left FROM posts WHERE image_url IS NOT NULL`);
  console.log(c.rows[0]);
  await pool.end();
}
main().catch((e) => { console.error(e); process.exit(1); });

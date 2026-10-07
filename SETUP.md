# GeekHub — Setup & Run Guide

Friendship-first social app for developers, gamers, anime fans, and tech
enthusiasts. React frontend + Node/Express backend + local PostgreSQL +
WebSocket chat + interest/social-graph recommendations.

## Prerequisites

- Node.js 18+ and npm
- PostgreSQL 16 or 17 running locally (default: host `localhost`, port `5432`)
- A `geekhub` database owned by your OS user:

```bash
createdb geekhub
```

If your Postgres user differs from `adityajadhav`, edit the credentials in
`server/db.js`, `server/seed.js`, `server/seed_phase2.js`, and
`server/fix_images.js` (they all use the same `Pool` config).

## 1. Database schema

```bash
psql -d geekhub -f server/schema.sql
```

This creates `users`, `follows`, `posts`, `post_likes`, `comments`,
`post_shares`, `conversations`, `conversation_participants`, `messages`
(plus legacy `friendships`).

## 2. Backend (port 3001)

```bash
cd server
npm install
node index.js
```

Health check (expect `{"error":"Invalid token"}` — means it's up):

```bash
curl http://localhost:3001/api/users -H "Authorization: Bearer invalid"
```

## 3. Seed demo data (optional but recommended)

80 users + 200 niche posts across anime, AI, gamedev, keyboards, webdev,
security, tabletop, and science, with likes and follows:

```bash
cd server
node seed.js
```

Then 50 captioned image posts + social activity (comments, shares, follows,
chats). Re-runnable and idempotent:

```bash
node seed_phase2.js
node fix_images.js   # swaps placeholder images for verified topical photos
```

Seed accounts log in with email `seed<N>@geekhub.test` / password
`password123` (N = 0–79).

## 4. Frontend (port 5173)

```bash
npm install
npm run dev
```

Open http://localhost:5173, sign up, then set skills/fandoms on your
profile — recommendations personalize from those tags.

Other scripts: `npm run build` (production bundle into `dist/`),
`npm run preview` (serve the bundle), `npm run lint`.

## How the recommendations work

- `GET /api/feed` ranks posts by: follows (+25), likes from people you
  follow (+15 each), shared skill/fandom tags (+8 each), engagement with
  time decay. Every boosted post carries a `feed_reason` string shown
  in the UI.
- `GET /api/suggestions` returns up to 12 profiles with `recommend_reason`:
  shared interests and/or friends-of-friends ("Followed by @x — people
  you follow"). Brand-new users get popular-user fallback suggestions.
- Feed and suggestions are woven together in the Discover tab, with a
  suggested-profiles rail every 4 posts.

## Project layout

```
server/          Express + Socket.IO API (index.js), schema.sql, seed scripts
src/api.js       Frontend API client (backend at http://localhost:3001)
src/components/  AuthPages, DiscoverPage, PostsFeed, ProfilePage, ChatPage
src/context/     AuthContext (JWT in localStorage)
src/algorithms/  Original client-side matching algo prototypes
```

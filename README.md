# GitMatch (GeekHub) — Where Syntax Meets Soul

A front-end dating/discovery app for developers, gamers, anime fans, and tech enthusiasts. Profiles are presented as GitHub Pull Requests: approve to merge (match), request changes to skip, then continue the conversation in terminal-styled chats.

Built with React 19 + Vite. Client-side only — all profiles, matches, and chat replies are mocked locally in `src/data/profiles.js` and component state.

## Features

### 1. PR Review Discovery (`src/App.jsx`, `src/components/ProfileCard.jsx`)
- Tinder-style queue over `SAMPLE_PROFILES`, one profile at a time with loop-around.
- Actions per profile:
  - **Merge Pull Request** (`handleApprove`): fires `canvas-confetti`, creates a match entry, advances queue, shows toast.
  - **Request Changes** (`handleRequestChanges`): dismisses profile, advances queue, shows toast.
  - **Direct Message** (`handleDirectMessage`): creates a match if needed and switches to `chats` tab.
- Profile card tabs: `Pull Request`, `Taxonomy & Stack`, `System Specs`, `Icebreaker Quiz`.
- Profile content: avatar/cover, distance, compatibility score, headline/bio, PR title/description, geek tags, fandoms, dev stats (`commitsThisYear`, `topLangs`, `favoriteIDE`, `tabVsSpace`, `coffeeIndex`, `alignment`).

### 2. Fandom / Stack Filtering (`src/App.jsx:27-31`)
- Filter ribbon driven by `CATEGORIES` in `src/data/profiles.js`:
  `all, dev, gaming, anime, tabletop, hardware, science, security`.
- Filters on `profile.tags[].category`. Changing filter resets `currentIndex` to 0.
- Empty state with reset button when no profiles match.

### 3. Compatibility Test (`src/components/CompatibilityQuiz.jsx`)
- 4-question static quiz (`QUESTIONS`): editor setup, sci-fi marathon, 2AM prod bug, first-date itinerary.
- Each option carries a `score` and `vibe`. Final score is the mean, displayed as `% Geek Synergy`.
- Completion fires confetti and calls `onQuizCompleted(score)` to show a toast in `App.jsx`.
- Includes progress bar and re-run diagnostic reset.

### 4. Terminal Chats (`src/components/ChatView.jsx`, `src/App.jsx:92-121`)
- Two-pane layout: match sidebar + terminal message feed.
- Sidebar lists profiles; header shows active match, E2E/SSL indicator, and tag badges.
- Message input with `$` prompt, quick geek snippet buttons, and send handler.
- `handleSendMessage` appends user message to `matches[0]` and appends a random canned auto-reply after 1.5s.
- Toast system (`App.jsx:35-38`) for merge/skip/quiz events, auto-dismissed after 3.5s.

### 5. Design System
- Dark cyber-glass theme in `src/index.css`: CSS variables for colors, radii, fonts, `cyber-grid` overlay, custom scrollbars, glass/neon button classes.
- Fonts via Google Fonts in `index.html`: `Inter`, `JetBrains Mono`, `Fira Code`.
- Icons via `lucide-react`. Celebration effects via `canvas-confetti`.
- Navigation header (`src/components/Navbar.jsx`): brand `GitMatch v2.4.0-stable`, mode switcher (`PR Review` / `Compatibility Test` / `Terminal Chats`), match count badge, `user@localhost: main` status pill.

## Tech Stack

| Layer | Choice |
|---|---|
| Runtime / UI | React 19, React DOM 19 |
| Build / Dev server | Vite 8, `@vitejs/plugin-react` 6 |
| Icons | `lucide-react` |
| Effects | `canvas-confetti` |
| Lint | `oxlint` with `react`, `oxc` plugins (see `.oxlintrc.json`) |
| Styling | Plain CSS (`src/index.css` + inline styles), no CSS framework |
| Fonts | Google Fonts (Inter + JetBrains Mono + Fira Code) |
| Data | Static JS module, no backend / API |

Requirements: Node.js LTS + npm (see `package-lock.json`). No environment variables required.

## Project Structure

```
geekhub/
  index.html                 # title, meta, fonts
  vite.config.js             # Vite + React plugin
  .oxlintrc.json             # oxlint react/oxc rules
  package.json               # scripts and dependencies
  public/
    favicon.svg
    icons.svg
  src/
    main.jsx                 # React root mount
    App.jsx                  # tabs, filtering, matches, toasts, messaging state
    index.css                # theme variables, glass/neon utilities
    App.css                  # legacy template styles (largely unused)
    components/
      Navbar.jsx             # header + tab switcher + match badge
      ProfileCard.jsx        # PR card with 4 tabs + approve/reject/DM actions
      CompatibilityQuiz.jsx  # 4-question quiz + scored result
      ChatView.jsx           # match list + terminal chat UI
      Badge.jsx              # tag badge with lucide icon map
    data/
      profiles.js            # SAMPLE_PROFILES, CATEGORIES, INITIAL_MATCHES
```

Key state flow (`src/App.jsx:19-25`):

- `activeTab: 'discover' | 'quiz' | 'chats'`
- `selectedCategory`, `currentIndex`
- `profiles` (initialized from `SAMPLE_PROFILES`, currently read-only after init)
- `matches` (initialized from `INITIAL_MATCHES`, prepended on merge/DM)
- `toastMessage`

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Start dev server (HMR)
npm run dev

# 3. Lint
npm run lint

# 4. Production build
npm run build

# 5. Preview production build locally
npm run preview
```

Vite dev defaults to `http://localhost:5173`. Build output goes to `dist/` (gitignored).

## Scripts

| Script | Command | Purpose |
|---|---|---|
| `npm run dev` | `vite` | Local development with HMR |
| `npm run build` | `vite build` | Optimized static build to `dist/` |
| `npm run preview` | `vite preview` | Serve `dist/` locally for verification |
| `npm run lint` | `oxlint` | Lint with rules in `.oxlintrc.json` |

## Configuration

- `vite.config.js`: minimal — only `react()` plugin. No proxy, aliases, or env handling.
- `.oxlintrc.json`: enforces `react/rules-of-hooks: error`, warns on `react/only-export-components` (allows constant exports).
- `index.html`: sets `<title>GitMatch (GeekHub) | Where Syntax Meets Soul</title>`, meta description, inline SVG favicon, Google Fonts preconnect.
- Images in `src/data/profiles.js` are remote Unsplash URLs — network access required for avatars/covers.

## Data Model

`SAMPLE_PROFILES[]` shape (`src/data/profiles.js:1-179`):

```js
{
  id: "profile-1",
  name: "Elena Rostova",
  handle: "elena_rs",
  age: 24,
  headline: "...",
  bio: "...",
  avatar: "https://...",
  coverImg: "https://...",
  distance: "2.4 km away",
  statusText: "Compiling shaders...",
  compatibilityScore: 96,
  tags: [{ id, label, category, icon }],
  fandoms: ["..."],
  stats: {
    commitsThisYear, topLangs[],
    favoriteIDE, tabVsSpace,
    coffeeIndex, alignment
  },
  prTitle: "feat(relationship): ...",
  prDescription: "...",
  quiz: { question, answer }
}
```

`Badge.jsx` maps `tag.icon` strings to `lucide-react` components via `ICON_MAP`, falling back to `Sparkles`. `tag.category` also drives badge CSS class (`badge-{category}`) and filtering.

`INITIAL_MATCHES[]` shape (`src/data/profiles.js:192-206`):

```js
{
  id: "match-1",
  profileId: "profile-1",
  matchedAt: "10 mins ago",
  lastMessage: "...",
  unread: 1,
  messages: [{ id, sender: "me" | "them", text, time }]
}
```

## Deployment

This is a static SPA with no server code:

1. `npm run build`
2. Deploy `dist/` to any static host (Vercel, Netlify, Cloudflare Pages, GitHub Pages, S3+CloudFront).
3. No env vars, no API rewrites needed unless you later add a backend.
4. Verify with `npm run preview` before publishing.

## Known Limitations / Roadmap

- Frontend-only demo: matches, messages, and quiz scores live in React state; refresh loses changes. No persistence, auth, or real backend.
- `ChatView` always sends via `matches[0]` (`src/App.jsx:92-94`) and the sidebar selection (`selectedMatchId`) is not wired to message routing — multi-conversation support is incomplete.
- Unused imports exist (e.g. `Badge`, several icons in `App.jsx`); `profiles` setter is never used beyond init.
- Profile images depend on third-party Unsplash URLs; consider local `public/` assets or an image CDN with fallbacks.
- No tests, no TypeScript, no accessibility audit, no mobile-layout pass for the 2-column chat grid.
- Natural next steps: localStorage persistence, real match routing per conversation, filter by multiple categories, unit tests for scoring/filtering, TypeScript migration.

## Contributing

1. Fork / branch from `main`.
2. `npm install && npm run dev`.
3. Keep changes scoped; run `npm run lint` and `npm run build` before opening a PR.
4. Follow the existing pattern: presentational components in `src/components/`, static content in `src/data/`, shared theme tokens in `src/index.css`.

## License

No license file is currently present. All rights reserved by default — add a `LICENSE` (e.g. MIT) if you intend to open-source this project.

# ⚔️ LifeQuest — Level Up Your Life

A full-stack **Life RPG**: turn real-world tasks into quests, earn XP and gold, level up your hero's attributes, hold streaks, collect loot, and spend gold in the bazaar.

> "Brake the boredom of productivity. Level your life."

LifeQuest bridges the gap between mundane tasks and game-like feedback loops. The server is the referee — all XP, gold, and  streaks are computed server-side so stats are earned, never faked.

---

## ✨ Feature Highlights

- **Quest System** — one-time, daily, weekly and **Boss** quests across 4 difficulty tiers with fixed XP/Gold rewards.
- **Progression** — XP curve (`100 × (L−1)^2.5`), level-ups, and 5 independent attributes: Strength, Focus, Creativity, Social, Discipline.
- **Streaks** — daily streak tracking with milestone bonuses at day 7 / 30 / 100 (and a purchasable Streak Freeze).
- **Economy** — Gold currency, a bazaar (elixirs, streak freezes, cosmetic banner frames, titles), inventory with equip/use.
- **Loot** — Boss quests roll real loot (70/25/5 rarity split).
- **Achievements** — 16 unlockable badges checked server-side on every completion.
- **Arena — 1v1 Challenges** — every hero gets a unique `LQ-######` challenge code. Challenge anyone by code; the first to finish wins **double the stakes** (both players' XP + gold), declared duels run on a countdown timer, and unaccepted challenges expire after 24h.
- **The Hall — leaderboards** — community ranking computed server-side from a weighted mix of XP, streak, **total gold earned** and tasks completed, with per-metric sort tabs (Streak / Gold earned / XP / Tasks / Overall).
- **Archive** — completed quests can be archived to a vault (`/quests/archived`) to restore or hard-delete later, keeping the active journal tidy.
- **Themes** — hero-selected lofi palettes: Coffee, Meadow, Midnight.
- **Quick demo login** — first server boot seeds `demo@lifequest.app` / `demo1234` with starter quests, so you can poke around in one click.
- **Anti-cheat** — server-side math, per-quest cooldowns, hourly completion caps, audit logs for XP/Gold.
- **Auth** — email/password, bcrypt hashing, rotating refresh sessions.
- **Feel** — switchable lofi themes (Void/Coffee, Meadow, Midnight), Cinzel/Inter/JetBrains Mono typography, spring XP bars, checkmark-draw completions, confetti level-up overlays, floating runes, toasts, skeletons and optimistic-feeling micro-interactions.

---

## 🧱 Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18, Vite, Tailwind CSS, Framer Motion, Recharts |
| Backend | Node.js, Express |
| Database | MongoDB (Atlas) via Mongoose |
| Auth | JWT access + rotating refresh tokens (bcryptjs) |
| AI-assisted development | opencode — used to plan, build and tune the full codebase |

---

## 🚀 Getting Started

### 1. Prerequisites

- Node.js ≥ 18
- A MongoDB Atlas connection string (or any MongoDB URI)
  → create a free cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas), get `mongodb+srv://...`

### 2. Configure the database

```bash
cd server
copy .env.example .env
```

Open `server/.env` and set:

```env
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/lifequest
JWT_SECRET=<a-long-random-string>
JWT_REFRESH_SECRET=<another-long-random-string>
```

> Shop items and achievements seed automatically on first server start.

### 3. Install & run

```bash
# from the LifeQuest root
npm run setup        # installs root + server + client deps
npm run seed         # optional: force (re)seed shop + achievements
npm run dev          # starts API (:4000) + web (:5173)
```

Open **http://localhost:5173**, create an adventurer, forge a quest, and complete it. 🎉

> 💡 **Try it instantly** — the login screen has a **Quick demo login** button (`demo@lifequest.app` / `demo1234`, auto-seeded with 3 starter quests). Perfect for testing the Arena challenges and The Hall with friends: grab your challenge code from the Arena, and let connections sign up to duel you.

---

## 📁 Project Layout

```
LifeQuest/
├── server/
│   └── src/
│       ├── index.js            # Express bootstrap
│       ├── seed.js             # shop + achievement + demo user seeding
│       ├── config/db.js        # Mongo connection
│       ├── middleware/         # auth (JWT), error handler
│       ├── models/             # User, Profile, Quest, Completion, XpLog,
│       │                       # GoldLog, ShopItem, UserItem, Achievement,
│       │                       # UserAchievement, Session, Challenge
│       ├── routes/             # auth, profile, quests, completions,
│       │                       # shop, inventory, achievements,
│       │                       # challenges, leaderboard
│       └── utils/              # XP curve, streaks, tokens, loot, payloads,
│                               # challenge codes
└── client/
    └── src/
        ├── api/client.js       # axios + token refresh interceptor
        ├── context/            # Auth, Toast
        ├── hooks/              # useQuestActions (complete/archive), useChallengePoller
        ├── components/
        │   ├── layout/         # AppShell, Sidebar, Topbar
        │   ├── stats/          # XPBar, GoldCounter, StreakFlame, radar/bars
        │   ├── quests/         # QuestCard, form, filters
        │   ├── shop/ inventory/ achievements/
        │   ├── effects/        # LevelUpOverlay, ConfettiBurst, FloatingRunes
        │   └── ui/             # Button, Modal, Skeleton
        └── pages/              # Landing, Auth, Dashboard, Quests, ArchivedQuests,
                                # Arena, Shop, Inventory, Leaderboard (Hall), Profile
```

---

## 🧮 The XP Curve

`Total XP to reach level L = 100 × (L − 1)^2.5`

| Level | Total XP | XP to next |
|------:|---------:|-----------:|
| 1 | 0 | 100 |
| 2 | 100 | 351 |
| 3 | 451 | 782 |
| 5 | 2,628 | 2,191 |
| 10 | 13,528 | 6,239 |
| 20 | 68,528 | 17,641 |

Level re-computation and attribute level-ups are all performed server-side on every completion.

---

## 🛡️ API Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` · `/login` · `/refresh` · `/logout` | Auth flow |
| GET | `/api/auth/me` | Current user + profile |
| GET/PATCH | `/api/profile` | Fetch/update hero |
| GET/POST | `/api/quests` | List / create quests |
| PATCH/DELETE | `/api/quests/:id` | Edit quest |
| PATCH | `/api/quests/:id/archive` · `/unarchive` | Move to / restore from the archive vault |
| DELETE | `/api/quests/:id` | Hard-delete a quest |
| POST | `/api/completions/quests/:id/complete` | Grant XP/gold/streak/loot |
| GET | `/api/completions` | Recent victories |
| GET | `/api/shop` · POST `/api/shop/purchase` | Bazaar (flip cards for item details) |
| GET | `/api/inventory` · POST `/equip` · `/use` | Satchel |
| GET | `/api/achievements` | Badges |
| GET | `/api/challenges` | My pending/active/completed challenge list (+ expiry sweeps) |
| POST | `/api/challenges` | Create a challenge by opponent challenge code |
| POST | `/api/challenges/:id/accept` · `/decline` · `/complete` | Run a duel (winner takes both stakes) |
| GET | `/api/leaderboard` | Community standings (rank, name, streak, gold earned, XP, tasks, joined) |

All routes except auth/signup/login/refresh require `Authorization: Bearer <token>`.

---

## 🗺️ Roadmap

- Arena duels, The Hall leaderboards, archives, themes and the demo login already live in this build.
- Next: OAuth (Google/GitHub), cross-tab realtime sync, guilds/parties, custom theme builder, admin audit UI.

---

*LifeQuest v1.0 — built September 2026.*
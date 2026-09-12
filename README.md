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
- **Anti-cheat** — server-side math, per-quest cooldowns, hourly completion caps, audit logs for XP/Gold.
- **Auth** — email/password, bcrypt hashing, rotating refresh sessions.
- **Feel** — dark-fantasy "Void" theme, Cinzel/Inter/JetBrains Mono typography, spring XP bars, checkmark-draw completions, confetti level-up overlays, floating runes, toasts, skeletons and optimistic-feeling micro-interactions.

---

## 🧱 Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18, Vite, Tailwind CSS, Framer Motion, Recharts |
| Backend | Node.js, Express |
| Database | MongoDB (Atlas) via Mongoose |
| Auth | JWT access + rotating refresh tokens (bcryptjs) |

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

---

## 📁 Project Layout

```
LifeQuest/
├── server/
│   └── src/
│       ├── index.js            # Express bootstrap
│       ├── seed.js             # shop + achievement seeding
│       ├── config/db.js        # Mongo connection
│       ├── middleware/         # auth (JWT), error handler
│       ├── models/             # User, Profile, Quest, Completion, XpLog,
│       │                       # GoldLog, ShopItem, UserItem, Achievement,
│       │                       # UserAchievement, Session
│       ├── routes/             # auth, profile, quests, completions,
│       │                       # shop, inventory, achievements
│       └── utils/              # XP curve, streaks, tokens, loot, payloads
└── client/
    └── src/
        ├── api/client.js       # axios + token refresh interceptor
        ├── context/            # Auth, Toast
        ├── hooks/              # useQuestActions (complete/archive/level-up)
        ├── components/
        │   ├── layout/         # AppShell, Sidebar, Topbar
        │   ├── stats/          # XPBar, GoldCounter, StreakFlame, radar/bars
        │   ├── quests/         # QuestCard, form, filters
        │   ├── shop/ inventory/ achievements/
        │   ├── effects/        # LevelUpOverlay, ConfettiBurst, FloatingRunes
        │   └── ui/             # Button, Modal, Skeleton
        └── pages/              # Landing, Auth, Dashboard, Quests, Profile, Shop, Inventory
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
| PATCH/DELETE | `/api/quests/:id` | Edit / archive |
| POST | `/api/completions/quests/:id/complete` | Grant XP/gold/streak/loot |
| GET | `/api/completions` | Recent victories |
| GET | `/api/shop` · POST `/api/shop/purchase` | Bazaar |
| GET | `/api/inventory` · POST `/equip` · `/use` | Satchel |
| GET | `/api/achievements` | Badges |

All routes except auth/signup/login/refresh require `Authorization: Bearer <token>`.

---

## 🗺️ Roadmap

- Achievements/loot already live in this build (Phase 2 preview).
- Next: OAuth (Google/GitHub), cross-tab realtime sync, guilds/parties, leaderboards, custom themes, admin audit UI.

---

*LifeQuest v1.0 — built September 2026.*
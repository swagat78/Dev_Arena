# 🏟️ Dev Arena — Competitive Coding Platform

A production-grade, full-stack MERN competitive coding platform built for developers to practice algorithmic problems, participate in timed contests, track performance analytics, and climb the global leaderboard.

🔗 **Live Platform:** [https://dev-arena-topaz.vercel.app](https://dev-arena-topaz.vercel.app)

---

## ⚡ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18 (Vite), Tailwind CSS, React Router v6 |
| **Backend** | Node.js, Express.js, Socket.IO |
| **Database** | MongoDB Atlas + Mongoose ODM |
| **Authentication** | JWT (JSON Web Tokens), bcrypt (12 salt rounds) |
| **File Uploads** | Multer (local disk storage) |
| **Geolocation** | OpenStreetMap Nominatim API (reverse geocoding) |
| **Deployment** | Vercel (Frontend), Render + Cron-Job.org (Backend), MongoDB Atlas (Database) |

---

## 🚀 Core Features

### 🔐 Authentication & Security
- Secure user registration and login with **bcrypt-12 password hashing**
- **JWT-based stateless authentication** with Bearer token validation
- Protected frontend routes with `ProtectedRoute` and `GuestRoute` guards
- **CORS origin whitelisting** for production and development environments
- Forgot password flow with strict validation (uppercase + symbol enforcement)
- Login tracking with `lastLoginAt` timestamps and `loginCount` metrics

### 💻 Problem Workspace & Code Execution
- **Custom server-side JavaScript code execution engine** — evaluates user-submitted solutions directly on the backend
- Solutions validated against **hidden and visible test cases** with real-time verdict classification:
  - ✅ Accepted | ❌ Wrong Answer | ⚠️ Runtime Error | ⏱️ Time Limit Exceeded
- **Runtime profiling** (milliseconds) and **memory tracking** (KB) per submission
- **Multi-language starter code generation** — JavaScript, Python, Java, C++
- Problem filtering by **difficulty** (Easy / Medium / Hard), **tags** (Array, Stack, DP, etc.), and **keyword search**
- Pre-seeded with **10 classic algorithmic problems** (Two Sum, Valid Parentheses, Maximum Subarray, Binary Search, Climbing Stairs, etc.)
- Per-problem **acceptance rate computation** using virtual Mongoose fields

### 🏆 Leaderboard & Ranking System
- **Global leaderboard** powered by **MongoDB aggregation pipelines** (`$group`, `$lookup`, `$addFields`, `$sort`)
- **Weighted scoring algorithm**: `score = (accepted × 10) + (total × 2)`
- Dynamic ranking sorted by score, accepted count, and average runtime
- Top 3 users highlighted with gold, silver, and bronze visual indicators

### 🎖️ Achievement & Gamification Engine
- **Event-driven achievement engine** that runs asynchronously after each submission
- Milestone badge detection:
  - 🌟 **Getting Started** — Solve your first problem
  - 💪 **Consistency** — Solve 50 distinct problems
  - 🧠 **Algorithm Master** — Solve 100 distinct problems
  - 🔥 **Streak Starter** — 7 consecutive days of solving
- Achievements auto-trigger **real-time push notifications** to the user

### 📊 Analytics & Insights
- Personal coding stats dashboard: problems solved, acceptance rate, average runtime
- **Recent submission activity feed** with verdict badges and runtime display
- **Daily goal tracker** (solve 3 problems/day) with animated progress bar
- **User insights page** showing all registered users with login frequency data

### 🔔 Real-Time Notification System
- Notification pipeline with **5-second polling** for real-time updates
- Event types: submission success 🎉, submission failed ❌, achievement unlocked 🏆, contest added 🚀
- Mark individual or **mark all as read** functionality
- Animated unread badge with pulse indicator
- Welcome notification auto-generated on user registration

### 🏅 Contest System
- **Time-bound contests** with dynamic status computation (`upcoming` / `live` / `ended`)
- Contests linked to problem sets via **ObjectId references** with population
- Pre-seeded **Weekly Contest 1** with 6 mixed-difficulty problems

### 👤 Profile & Public Portfolio
- **GitHub-style 365-day submission activity heatmap** built with MongoDB date aggregation
- Public profile page with rank, problems solved, acceptance rate, and achievement showcase
- **Profile completion tracker** with percentage bar (13 configurable fields)
- **Multer-powered avatar upload** with file type validation (JPG, PNG, WebP) and 2MB size limit
- Social link integrations: GitHub, LinkedIn, X (Twitter), Personal Website
- **GPS-based geolocation detection** via OpenStreetMap reverse geocoding API
- Deep-linked public profiles with edit-in-place modal system

### 🎨 Premium UI/UX
- **Dark-mode glassmorphism design** with slate-900 color palette
- 14 dedicated pages with responsive layouts
- Animated modals with scale-in transitions
- Gradient hero sections, hover micro-animations, and backdrop blur effects
- Custom loading screens and contextual alert messages
- Mobile-responsive navigation with icon-based toolbar

---

## 📁 Project Structure

```
server/
  ├── config/           # MongoDB connection setup
  ├── controllers/      # Auth, Problems, Submissions, Contests, Analytics, Interviews, Projects, Notifications
  ├── middleware/        # JWT auth guard, error handler
  ├── models/           # User, Problem, Submission, Contest, Interview, Achievement, Notification, Project
  ├── routes/           # 9 RESTful API route files
  ├── utils/            # Code executor, achievement engine, token generator, seed data
  ├── scripts/          # User snapshot sync utility
  └── server.js         # Express + Socket.IO entry point

client/
  ├── src/
  │   ├── components/   # ProtectedRoute, GuestRoute, AlertMessage, LoadingScreen, UI kit
  │   ├── context/      # AuthContext, ThemeContext (dark/light mode)
  │   ├── layouts/      # AuthLayout wrapper
  │   ├── pages/        # 14 pages (Dashboard, Problems, Solve, Submissions, Contests, Leaderboard, Profile, Settings, etc.)
  │   ├── services/     # Centralized API service layer
  │   ├── App.jsx       # React Router configuration
  │   └── index.css     # Tailwind + custom styles
  ├── tailwind.config.js
  └── vite.config.js
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | User registration |
| `POST` | `/api/auth/login` | User login with JWT |
| `GET` | `/api/auth/me` | Get current authenticated user |
| `PUT` | `/api/auth/profile` | Update profile fields |
| `POST` | `/api/auth/forgot-password` | Reset password |
| `GET` | `/api/problems` | List all problems (filterable) |
| `GET` | `/api/problems/:slug` | Get problem details + user's best submission |
| `POST` | `/api/submissions` | Submit code for evaluation |
| `GET` | `/api/submissions/mine` | Get user's submission history |
| `GET` | `/api/contests` | List all contests |
| `GET` | `/api/analytics/stats` | Personal coding statistics |
| `GET` | `/api/analytics/leaderboard` | Global leaderboard |
| `GET` | `/api/notifications` | Get user notifications |
| `PATCH` | `/api/notifications/read-all` | Mark all notifications as read |
| `GET` | `/api/user/profile` | Full profile with heatmap + achievements |
| `PATCH` | `/api/user/avatar` | Upload profile avatar |

---

## 🛠️ Environment Setup

### Backend (`server/.env`)

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/dev_arena
JWT_SECRET=replace_with_a_long_secure_secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

### Frontend (`client/.env`)

```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🏃 Run Locally

### Backend
```bash
cd server
npm install
npm run dev
```

### Frontend
```bash
cd client
npm install
npm run dev
```

---

## 🔮 Future Roadmap

- [ ] **Live Interview Rooms** — WebRTC-powered video calls with synchronized code editing and in-room chat for real-time technical interviews
- [ ] **MNC Previous Year Questions (PYQs)** — Curated problem sets from Google, Amazon, Microsoft, Meta, and other top companies, categorized by company and role
- [ ] **AI-Powered Code Review** — Integrate Gemini / GPT to auto-analyze submitted solutions and provide optimization suggestions
- [ ] **Multi-Language Code Execution** — Extend the execution engine to natively support Python, Java, and C++ alongside JavaScript
- [ ] **Discussion Forum** — Community-driven solution discussions, upvoting, and editorial explanations per problem
- [ ] **Custom Contest Creation** — Allow users to create and host their own timed contests with custom problem sets
- [ ] **Real-Time Multiplayer Battles** — Head-to-head coding duels with live score tracking and countdown timers
- [ ] **Resume Builder Integration** — Auto-generate a developer portfolio from platform stats, solved problems, and achievements

---

## 📬 Contact

- **GitHub:** [github.com/swagat78](https://github.com/swagat78)
- **LinkedIn:** [linkedin.com/in/swagatnayak-](https://linkedin.com/in/swagatnayak-)
- **Email:** swagatnayak.xdev@gmail.com

---

> Built with 💻 by **Swagat Nayak**

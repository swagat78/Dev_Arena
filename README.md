# Dev_Arena

Production-ready MERN coding platform with JWT authentication, coding problems, contests, submissions, analytics, and real-time interview rooms.

## Tech Stack

- MongoDB + Mongoose
- Express.js + Node.js
- React (Vite) + Tailwind CSS
- JWT authentication + bcrypt password hashing

## Core Features

- Secure user registration and login
- JWT-protected API routes
- Coding problems and solution workflow
- Contests, submissions, and leaderboard-oriented modules
- Analytics and user insights
- Real-time interview room capabilities
- Protected frontend routes with loading and alert states

## Project Structure

```text
server/
  ├── config/
  ├── controllers/
  ├── middleware/
  ├── models/
  ├── routes/
  ├── utils/
  ├── scripts/
  ├── .env.example
  ├── package.json
  └── server.js

client/
  ├── src/
  │   ├── components/
  │   ├── context/
  │   ├── layouts/
  │   ├── pages/
  │   ├── services/
  │   ├── App.jsx
  │   ├── main.jsx
  │   └── index.css
  ├── .env.example
  ├── package.json
  ├── tailwind.config.js
  ├── postcss.config.js
  └── vite.config.js
```

## Environment Setup

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

## Run Locally

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

## GitHub

Repository: `https://github.com/swagat78/Dev_Arena`

Account: `swagatnayak.xdev@gmail.com`

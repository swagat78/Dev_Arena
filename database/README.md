# Database Folder

This project now includes a dedicated `database/` folder for database-related assets and documentation.

## Current Setup

- Database engine: **MongoDB**
- Connection source: `server/.env` (`MONGO_URI`)
- Active database: `mern_major_project`
- Auth/user login data collection: `users`

## Project snapshot file (requested)

To make login/profile data visible inside this repo, the backend now writes a sanitized snapshot file:

- Path: `database/mongodb/users.snapshot.json`
- Updated automatically on:
  - user register
  - user login
  - profile update
- Excludes password hash fields

## Why data is not stored as files here

MongoDB stores records in its own data directory managed by the MongoDB server (not inside this repo by default).
So this folder is used as the **project-level database workspace** (docs, seeds, future migrations/scripts).

## Quick inspect commands

```bash
mongosh "mongodb://127.0.0.1:27017/mern_major_project"
```

Then run:

```javascript
show collections
db.users.find().pretty()
```

You can also open the snapshot file directly in VS Code:

```text
database/mongodb/users.snapshot.json
```

If you feel it did not update after a new login/register, run a manual sync once:

```bash
npm run sync:users
```

## Suggested structure for future work

```text
database/
├── README.md
├── seeds/
├── migrations/
└── scripts/
```

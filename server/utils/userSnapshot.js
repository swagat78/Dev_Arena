import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

import { User } from '../models/User.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SNAPSHOT_DIR = path.resolve(__dirname, '../../database/mongodb');
const SNAPSHOT_FILE = path.join(SNAPSHOT_DIR, 'users.snapshot.json');

/**
 * Writes a safe JSON snapshot of users (no password hash) into project folder.
 * This is for local visibility/debugging only.
 */
export const writeUsersSnapshot = async () => {
  try {
    const users = await User.find({}, 'name email profile lastLoginAt loginCount createdAt updatedAt')
      .sort({ updatedAt: -1 })
      .lean();

    const payload = {
      generatedAt: new Date().toISOString(),
      totalUsers: users.length,
      users,
    };

    await fs.mkdir(SNAPSHOT_DIR, { recursive: true });
    await fs.writeFile(SNAPSHOT_FILE, JSON.stringify(payload, null, 2), 'utf-8');
  } catch (error) {
    console.error(`User snapshot write failed: ${error.message}`);
  }
};

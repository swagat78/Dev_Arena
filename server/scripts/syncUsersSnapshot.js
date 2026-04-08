import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import { connectDB } from '../config/db.js';
import { writeUsersSnapshot } from '../utils/userSnapshot.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const run = async () => {
  try {
    await connectDB();
    await writeUsersSnapshot();
    console.log('User snapshot synced: database/mongodb/users.snapshot.json');
    process.exit(0);
  } catch (error) {
    console.error(`Snapshot sync failed: ${error.message}`);
    process.exit(1);
  }
};

run();

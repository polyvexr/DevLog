import mongoose from 'mongoose';
import PlatformStat from '../src/models/PlatformStat.js';
import PlatformAction from '../src/models/PlatformAction.js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const MONGO = process.env.MONGO_URI || 'mongodb://localhost:27017/devlog';

async function run() {
  await mongoose.connect(MONGO, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('Connected');
  const stats = await PlatformStat.find({});
  for (const s of stats) {
    try {
      await PlatformAction.create({
        userId: s.userId,
        platform: s.platform,
        action: 'link',
        meta: { username: s.username },
        createdAt: s.lastUpdated || s._id.getTimestamp(),
      });
    } catch (err) {
      console.error('err', err.message || err);
    }
  }
  console.log('Done');
  process.exit(0);
}

run().catch((err) => { console.error(err); process.exit(1); });

require('dotenv').config();
const { connectDb } = require('../src/config/db');
const User = require('../src/models/User');

async function run() {
  await connectDb(process.env.MONGO_URI);
  const email = process.env.SEED_ADMIN_EMAIL || 'admin@example.com';
  const password = process.env.SEED_ADMIN_PASSWORD || 'Admin123!';

  const existing = await User.findOne({ email });
  if (existing) {
    console.log('Admin already exists:', email);
    process.exit(0);
  }

  const passwordHash = await User.hashPassword(password);
  await User.create({ name: 'System Admin', email, role: 'admin', passwordHash });
  console.log('Admin created:', email, 'password:', password);
  process.exit(0);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});

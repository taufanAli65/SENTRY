import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User, { UserRoles } from '../models/users';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const run = async () => {
  await mongoose.connect(`${process.env.MONGODB_URL}/${process.env.DB_NAME}`);
  const hashed = await bcrypt.hash('ownerpassword', 10);
  await User.create({
    email: 'owner@example.com',
    name: 'Owner 1',
    role: UserRoles.Owner,
    photoUrl: 'https://example.com/owner.png',
    password: hashed,
  });
  console.log('✅ Owner user injected.');
  process.exit(0);
};

run();

import mongoose from 'mongoose';

const url = process.env.MONGODB_URL as string;


export async function connectDB() {
    mongoose.connect(url)
    .then(() => console.log('✅ MongoDB connected'))
    .catch(err => console.error('❌ MongoDB connection error:', err));
}

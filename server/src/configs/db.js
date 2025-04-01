import mongoose from 'mongoose';
import { MONGO_URI } from './env.js';

async function connectDb() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
}

export default connectDb;
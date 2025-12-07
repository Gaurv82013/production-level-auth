import mongoose from "mongoose";    

const MONGODB_URI = process.env.MONGODB_URI!;
if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}
let isConnected = false;

const connectDB = async () => {
    if (isConnected) {
        console.log("Using existing MongoDB connection");
        return;
    }
    try {
        await mongoose.connect(MONGODB_URI);
        isConnected = true;
        console.log("MongoDB connected successfully");
        return;
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        isConnected = false;
        throw error;
    }
}

export default connectDB;
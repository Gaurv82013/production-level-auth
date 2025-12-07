import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    clerkId: { type: String, required: true, unique: true },
    email: String,
    name: String,
    image: String,
    createdAt: { type: Date, default: Date.now },
})

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
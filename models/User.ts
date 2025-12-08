import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  clerkId: { type: String, required: true, unique: true },
  email: String,
  firstName: String,
  lastName: String,
  image: String,
},{ timestamps: true});

export default mongoose.models.User || mongoose.model("User", UserSchema);

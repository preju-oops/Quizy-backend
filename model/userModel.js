import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  role: {
    type: String,
    enum: ["professional", "admin"],
    default: "professional",
  },
});

const User = mongoose.model("User", userSchema);

export default User;  // ✅ use default export for ESM

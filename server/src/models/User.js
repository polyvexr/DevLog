import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  oneTimeReaddUsed: { type: Map, of: Boolean, default: {} },
});

// Hash password
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

// Compare password
userSchema.methods.matchPassword = async function (entered) {
  return await bcrypt.compare(entered, this.password);
};

export default mongoose.model("User", userSchema);

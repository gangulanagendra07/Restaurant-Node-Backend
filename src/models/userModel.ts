import * as mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: { type: String, require: true },
  email_verified: { type: Boolean, require: true, default: false },
  verification_token: { type: Number, require: true },
  verification_token_time: { type: Date, require: true },
  password: { type: String, require: true },
  phone: { type: String, require: true },
  reset_password_token: { type: String, default: "" },
  reset_password_token_time: { type: Date, default: new Date() },
  name: { type: String, require: true },
  type: { type: String, require: true },
  status: { type: String, require: true },
  created_at: { type: Date, require: true, default: new Date() },
  updated_at: { type: Date, require: true, default: new Date() },
});

export const User = mongoose.model("User", userSchema);

import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
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
    },
    cartData: {
      type: Object,
      default: {},
    },

    verifyotp: {
      type: String,
      default: "",
    },
    verifyotpExpireAt: {
      type: Number,
      default: 0,
    },
    isAccountVerified: {
      type: Boolean,
      default: false,
    },
    resetotp: {
      type: String,
      default: "",
    },
    resetotpExpireAt: {
      type: Number,
      default: 0,
    },
  },
  { minimize: false }
);

const userModel = mongoose.models.User || mongoose.model("User", userSchema);
export default userModel;

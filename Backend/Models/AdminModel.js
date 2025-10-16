import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
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

    role: {
      type: String,
      enum: ["admin"],
      default: "admin",
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

const adminModel =
  mongoose.models.Admin || mongoose.model("Admin", adminSchema);
export default adminModel;

import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
    },
    birthday: {
      type: Date,
      required: true,
    },
    sex: {
      type: String,
      enum: ["male", "female"],
      required: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isDriver: {
      type: Boolean,
      default: false,
    },
    isCompany: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;

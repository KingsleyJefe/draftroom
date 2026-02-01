import mongoose, { Document } from "mongoose";

export interface IUser extends Document {
  state: string;
  email: string;
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  emailToken: string | null;
  phoneNumber: string;
  isVerified: boolean;
  resetPasswordExpiry: Date | null;
  resetPasswordToken: string | null;
  authProvider: "local" | "google";
}

const userSchema = new mongoose.Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
    },
    phoneNumber: {
      type: String,
    },
    state: {
      type: String,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    emailToken: {
      type: String,
      default: null,
    },
    resetPasswordToken: {
      type: String,
      default: null,
    },
    resetPasswordExpiry: {
      type: Date,
      default: null,
    },
    authProvider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },
  },
  { timestamps: true }
);

const UserModel = mongoose.model<IUser>("User", userSchema);
export default UserModel;

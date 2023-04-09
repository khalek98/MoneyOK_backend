import { Document, Model, Schema, model } from "mongoose";

export interface IUser extends Document {
  email: string;
  password?: string;
  username: string;
  isConfirmed: boolean;
  googleId?: string;
  avatarUrl?: string;
  accessToken?: string;
  refreshToken?: string;
  resetPasswordExpires?: Date;
}

const UserSchema: Schema<IUser> = new Schema(
  {
    email: { type: String, unique: true },
    password: String,
    username: { type: String, required: true },
    isConfirmed: { type: Boolean, default: false },
    googleId: { type: String, unique: true, sparse: true },
    avatarUrl: String,
    accessToken: { type: String },
    refreshToken: { type: String },
    resetPasswordExpires: { type: Date },
  },
  { timestamps: true },
);

const User: Model<IUser> = model<IUser>("User", UserSchema);

export default User;

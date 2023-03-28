import { Document, Model, Schema, model, Types } from "mongoose";
import { ICategory } from "./Category";
import { ITransaction } from "./Transaction";
import { IWallet } from "./Wallet";

export interface IUser extends Document {
  id: string;
  email: string;
  password?: string;
  username: string;
  isConfirmed: boolean;
  wallets: IWallet["_id"][];
  categories: ICategory["_id"][];
  // transactions: ITransaction["_id"][];
  googleId?: string;
  avatarUrl?: string;
  accessToken?: string;
  refreshToken?: string;
  resetPasswordExpires?: Date;
}

const UserSchema: Schema<IUser> = new Schema(
  {
    id: { type: String, unique: true },
    email: { type: String, unique: true },
    password: String,
    username: { type: String, required: true },
    isConfirmed: { type: Boolean, default: false },
    googleId: { type: String, unique: true },
    avatarUrl: String,
    wallets: [{ type: Schema.Types.ObjectId, ref: "Wallet" }],
    categories: [{ type: Schema.Types.ObjectId, ref: "Category" }],
    // transactions: [{ type: Schema.Types.ObjectId, ref: "Transaction" }],
    accessToken: { type: String },
    refreshToken: { type: String },
    resetPasswordExpires: { type: Date },
  },
  { timestamps: true },
);

const User: Model<IUser> = model<IUser>("User", UserSchema);

export default User;

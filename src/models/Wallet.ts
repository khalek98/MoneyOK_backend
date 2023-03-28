import { Document, Model, Schema, model } from "mongoose";
import { ITransaction } from "./Transaction";
import { IUser } from "./User";

export interface IWallet extends Document {
  id?: string;
  name: string;
  userId: IUser["_id"];
  balance?: number;
  transactions: ITransaction["_id"][];
}

// Wallet schema
const WalletSchema: Schema<IWallet> = new Schema(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    balance: { type: Number, default: 0 },
  },
  { timestamps: true },
);

const Wallet: Model<IWallet> = model("Wallet", WalletSchema);

export default Wallet;

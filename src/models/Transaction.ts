import { Document, Model, Schema, model } from "mongoose";
import { ICategory } from "./Category";
import { IUser } from "./User";
import { IWallet } from "./Wallet";

export enum TransactionType {
  INCOME = "income",
  EXPENSE = "expense",
}

export interface ITransaction extends Document {
  description?: string;
  amount: number;
  type: TransactionType;
  categoryId: ICategory["_id"];
  walletId: IWallet["_id"];
  userId: IUser["_id"];
  date?: Date;
}

// Transaction schema
const TransactionSchema: Schema<ITransaction> = new Schema(
  {
    description: { type: String, default: "" },
    amount: { type: Number, required: true },
    type: { type: String, enum: [TransactionType.INCOME, TransactionType.EXPENSE], required: true },
    categoryId: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    walletId: { type: Schema.Types.ObjectId, ref: "Wallet", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

const Transaction: Model<ITransaction> = model("Transaction", TransactionSchema);

export default Transaction;

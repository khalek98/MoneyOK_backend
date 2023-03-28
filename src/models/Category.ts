import { Document, Model, Schema, model } from "mongoose";
import { ITransaction, TransactionType } from "./Transaction";
import { IUser } from "./User";

// Category interface
export interface ICategory extends Document {
  id: string;
  name: string;
  type: TransactionType;
  userId: IUser["_id"];
  transactions: ITransaction["_id"][];
}

// Category schema
const CategorySchema: Schema<ICategory> = new Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  type: { type: String, enum: [TransactionType.INCOME, TransactionType.EXPENSE], required: true },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  transactions: [{ type: Schema.Types.ObjectId, ref: "Transaction", default: [] }],
});

const Category: Model<ICategory> = model("Category", CategorySchema);

export default Category;

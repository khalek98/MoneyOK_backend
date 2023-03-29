import { startSession } from "mongoose";
import { validationResult } from "express-validator";
import { randomUUID } from "crypto";
import { Response } from "express";

import { Request } from "express.interface";
import User, { IUser } from "../models/User";
import Transaction, { ITransaction, TransactionType } from "../models/Transaction";
import Category, { ICategory } from "../models/Category";
import Wallet, { IWallet } from "../models/Wallet";

export const allIncomeTransactions = async (req: Request, res: Response) => {
  try {
    const userId = req.user._id;
    const userTransactions = await Transaction.find({ userId, type: "income" });
    if (!userTransactions) {
      return res.status(404).json({ error: "User has no income transactions" });
    }

    res.status(200).json({ userTransactions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const allExpenseTransactions = async (req: Request, res: Response) => {
  try {
    const userId = req.user._id;
    const userTransactions = await Transaction.find({ userId, type: "expense" });
    if (!userTransactions) {
      return res.status(404).json({ error: "User has no expense transactions" });
    }

    res.status(200).json({ userTransactions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const createTransaction = async (req: Request, res: Response) => {
  const session = await startSession();
  session.startTransaction();

  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userId = req.user._id;
    const { amount, description, type, categoryId, walletId, date } = req.body as ITransaction;

    // const user: IUser = await User.findById(userId).populate("wallets categories");

    const category: ICategory = await Category.findById(categoryId);
    const wallet: IWallet = await Wallet.findById(walletId);

    if (!category) {
      return res.status(400).json({ msg: "Category not found" });
    }
    if (!wallet) {
      return res.status(400).json({ msg: "Wallet not found" });
    }

    const newTransaction = new Transaction({
      // id: randomUUID(),
      description,
      amount,
      type,
      categoryId,
      walletId,
      userId,
      date,
    });

    if (type === "income") {
      wallet.balance += amount;
    } else {
      wallet.balance -= amount;
    }

    // await Category.findByIdAndUpdate(
    //   categoryId,
    //   { $push: { transactions: newTransaction._id } },
    //   { new: true },
    // );

    await wallet.updateOne({ balance: wallet.balance }, { new: true }).session(session);

    // await Wallet.findByIdAndUpdate(walletId, { balance: wallet.balance }, { new: true })

    const result = await newTransaction.save({ session });

    await session.commitTransaction();

    res.status(201).json({ message: "Tansaction saved success", result });
  } catch (error) {
    await session.abortTransaction();
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  } finally {
    session.endSession();
  }
};

export const deleteTransaction = async (req: Request, res: Response) => {
  const session = await Transaction.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;
    const transaction = await Transaction.findById(id);
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    // Update the wallet balance based on the transaction type
    const wallet = await Wallet.findById(transaction.walletId).session(session);
    if (transaction.type === "income") {
      wallet.balance -= transaction.amount;
    } else {
      wallet.balance += transaction.amount;
    }

    // Update the wallet and delete the transaction
    await Wallet.findByIdAndUpdate(
      transaction.walletId,
      { balance: wallet.balance },
      { new: true },
    ).session(session);
    await transaction.deleteOne({ session });

    // Delete transaction from category
    // await Category.findByIdAndUpdate(
    //   transaction.categoryId,
    //   {
    //     $pull: { transactions: transaction._id },
    //   },
    //   { new: true },
    // ).session(session);

    // Commit the transaction
    await session.commitTransaction();

    res.status(200).json({ message: "Transaction deleted successfully" });
  } catch (error) {
    await session.abortTransaction();
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  } finally {
    session.endSession();
  }
};

export const readTransaction = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const transaction = await Transaction.findById(id);

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.status(200).json({ transaction });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateTransaction = async (req: Request, res: Response) => {
  const session = await startSession();
  session.startTransaction();

  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;

    const updateBody = req.body as ITransaction;

    const transaction = await Transaction.findById(id);

    if (!transaction) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    const updatedTransaction = await transaction
      .updateOne({ ...updateBody }, { new: true })
      .session(session);

    if ("amount" in updateBody) {
      const { walletId, type } = transaction;
      const wallet: IWallet = await Wallet.findById(walletId);

      const newAmount = updateBody.amount - transaction.amount;

      if (type === "income") {
        wallet.balance += newAmount;
      } else {
        wallet.balance -= newAmount;
      }

      await wallet.updateOne({ balance: wallet.balance }, { new: true }).session(session);
    }

    await session.commitTransaction();

    res.json({ message: "Transaction updated", transaction: updatedTransaction });
  } catch (error) {
    await session.abortTransaction();
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  } finally {
    session.endSession();
  }
};

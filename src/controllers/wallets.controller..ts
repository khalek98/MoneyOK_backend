import { Response } from "express";
import { validationResult } from "express-validator";

import Wallet, { IWallet } from "../models/Wallet";
import { Request } from "express.interface";
import Transaction from "../models/Transaction";

export const createWallet = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userId = req.user._id;

    const { name, balance } = req.body as IWallet;

    const newWallet = new Wallet({
      name,
      userId,
      balance,
    });

    // await User.findByIdAndUpdate(userId, { $push: { wallets: newWallet._id } }, { new: true });

    const result = await newWallet.save();
    res.status(201).json({ message: "Wallet saved success", result });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const readAllUserWallets = async (req: Request, res: Response) => {
  try {
    const userId = req.user._id;

    const allUserWallets = await Wallet.find({ userId });

    if (!allUserWallets) {
      return res.status(404).json({ error: "User has no wallets" });
    }

    res.status(200).json({ allUserWallets });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateWallet = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;

    const updateBody = req.body as IWallet;

    const updatedWallet = await Wallet.findByIdAndUpdate(id, { ...updateBody }, { new: true });

    if (!updatedWallet) {
      return res.status(404).json({ error: "Wallet not found" });
    }

    res.json({ message: "Wallet updated", wallet: updatedWallet });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteWallet = async (req: Request, res: Response) => {
  const session = await Transaction.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;

    const wallet = await Wallet.findById(id);

    if (!wallet) {
      return res.status(404).json({ message: "Wallet not found" });
    }

    const transactionsByWallet = await Transaction.find({ walletId: wallet._id });

    transactionsByWallet.forEach((transaction) => transaction.deleteOne({ session }));

    await Wallet.findByIdAndDelete(id);

    await session.commitTransaction();

    res.status(200).json({ message: "Wallet deleted successfully" });
  } catch (error) {
    await session.abortTransaction();
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  } finally {
    session.endSession();
  }
};

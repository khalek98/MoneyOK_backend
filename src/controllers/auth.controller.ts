import { ICategory } from "./../models/Category";
import { Response } from "express";
import { validationResult } from "express-validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { sendConfirmationEmail } from "../services/email.service";
import { logAuth } from "../utils/loggerAuth";
import User, { IUser } from "../models/User";
import { Request } from "express.interface";
import Category from "../models/Category";
import { TransactionType } from "../models/Transaction";
import Wallet, { IWallet } from "../models/Wallet";

export const getUser = async (req: Request, res: Response) => {
  const userId = req.user._id;

  const user = await User.findById(userId);

  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  const { username, isConfirmed, email } = user;

  return res.status(200).json({
    user: {
      isConfirmed,
      username,
      email,
    },
  });
};

export const authSignUp = async (req: Request, res: Response) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password, username } = req.body as IUser;
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new User({
    email,
    password: hashedPassword,
    username,
  });

  const categories = [
    {
      name: "Food & Products",
      type: TransactionType.EXPENSE,
      userId: user._id,
    },
    {
      name: "Entertainment",
      type: TransactionType.EXPENSE,
      userId: user._id,
    },
    {
      name: "Transportation",
      type: TransactionType.EXPENSE,
      userId: user._id,
    },
    {
      name: "Car",
      type: TransactionType.EXPENSE,
      userId: user._id,
    },
    {
      name: "Health",
      type: TransactionType.EXPENSE,
      userId: user._id,
    },
    {
      name: "Education",
      type: TransactionType.EXPENSE,
      userId: user._id,
    },
    {
      name: "Salary",
      type: TransactionType.INCOME,
      userId: user._id,
    },
    {
      name: "Freelance",
      type: TransactionType.INCOME,
      userId: user._id,
    },
    {
      name: "Cryptocurrency",
      type: TransactionType.INCOME,
      userId: user._id,
    },
    {
      name: "Gifts",
      type: TransactionType.INCOME,
      userId: user._id,
    },
    {
      name: "Gifts",
      type: TransactionType.EXPENSE,
      userId: user._id,
    },
    {
      name: "Dividends",
      type: TransactionType.INCOME,
      userId: user._id,
    },
  ] as ICategory[];

  const wallets = [
    {
      name: "Cash",
      balance: 0,
      userId: user._id,
    },
    {
      name: "Credit Card",
      balance: 0,
      userId: user._id,
    },
  ] as IWallet[];

  try {
    const [savedUser] = await Promise.all([
      user.save({ validateBeforeSave: true }),
      Category.insertMany(categories),
      Wallet.insertMany(wallets),
    ]);

    const token = jwt.sign({ email, _id: savedUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    sendConfirmationEmail(savedUser, token);

    return res.status(200).json({ message: "Confirmation email sent" });
  } catch (err) {
    if (err.code === 11000) {
      logAuth(err);
      return res.status(400).json({ message: "Email already registered" });
    }
    logAuth(err);
    return res.status(500).json({
      message: `Failure sign up. Open log in logs/auth.log. Err.message: ${err.message}`,
    });
  }
};

export const authSignIn = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = (await User.findOne({ email })) as IUser;

  if (!user) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const isValidPassword = await bcrypt.compare(password, user.password);

  if (!isValidPassword) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  if (!user.isConfirmed) {
    return res.status(400).json({ message: "Email not confirmed" });
  }

  const { _id } = user;
  const token = jwt.sign({ email, _id }, process.env.JWT_SECRET, { expiresIn: "1d" });
  res.cookie("token", token, {
    domain: process.env.CORS_URL,
    httpOnly: true,
    sameSite: "none",
    secure: true,
    maxAge: 24 * 60 * 60 * 1000,
  });

  return res.status(200).json({ token });
};

export const authConfirmToken = (req: Request, res: Response) => {
  const { token } = req.params;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as IUser;

    User.findByIdAndUpdate(decoded._id, { isConfirmed: true }, { new: true })
      .then((res) => console.log("Email confirmed", res))
      .catch((err) => console.log(err));
    return res.status(200).redirect(`${process.env.CORS_URL}/auth/confirmed`);
  } catch (err) {
    return res.status(400).send("<h1>Invalid token<h1/>");
  }
};

import { Response } from "express";
import { validationResult } from "express-validator";
// import { randomUUID } from "crypto";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { sendConfirmationEmail } from "../services/email.service";
import { logAuth } from "../utils/loggerAuth";
import User, { IUser } from "../models/User";
import { Request } from "express.interface";

export const authSignUp = async (req: Request, res: Response) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password, username } = req.body as IUser;
  const hashedPassword = await bcrypt.hash(password, 10);

  // const userId = randomUUID();

  const user = new User({
    // id: userId,
    email,
    password: hashedPassword,
    username,
  });

  user
    .save({ validateBeforeSave: true })
    .then(({ _id }) => {
      const token = jwt.sign({ email, _id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });

      sendConfirmationEmail(user, token);

      return res.status(200).json({ message: "Confirmation email sent", token });
    })
    .catch((err) => {
      if (err.code === 11000) {
        logAuth(err);
        return res.status(400).json({ message: "Email already registered" });
      }
      logAuth(err);
      return res.status(500).json({
        message: `Failure sign up. Open log in logs/auth.log. Err.message: ${err.message}`,
      });
    });
};

export const authLogin = async (req: Request, res: Response) => {
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

  return res.status(200).json({ token });
};

export const authConfirmToken = (req: Request, res: Response) => {
  const { token } = req.params;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as IUser;

    User.findByIdAndUpdate(decoded._id, { isConfirmed: true }, { new: true })
      .then((res) => console.log("Email confirmed", res))
      .catch((err) => console.log(err));
    return res.status(200).send("<h1>Email confirmed<h1/>");
  } catch (err) {
    return res.status(400).send("<h1>Invalid token<h1/>");
  }
};

import { Request, Response, NextFunction } from "express";
import User, { IUser } from "../models/User";

export const updateUserInReq = async (req: Request, res: Response, next: NextFunction) => {
  if (req.user) {
    console.log("middelware update", req.user);
    // const user = (await User.findById(req.user?.id)) as IUser;
    // req.user = user;
  }
  next();
};

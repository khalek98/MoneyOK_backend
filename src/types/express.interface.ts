import { Schema } from "mongoose";
import { Request as ExpressRequest } from "express";

export interface Request extends ExpressRequest {
  user?: { _id: Schema.Types.ObjectId; id: string; email: string };
}

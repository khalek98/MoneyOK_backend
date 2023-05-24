import express, { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import passport from "./passport";
import jwt from "jsonwebtoken";
import session from "express-session";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth";
import transactionsRoutes from "./routes/transactions";
import walletsRoutes from "./routes/wallets";
import categoriesRoutes from "./routes/categories";

dotenv.config();

const app = express();

app.use(express.json());

mongoose
  .connect(process.env.MONGODB_URI)
  .then((res) => console.log("DB OK!"))
  .catch((err) => console.log("DB error", err));

app.use(
  session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      domain: process.env.CORS_URL,
    },
  }),
);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

app.use(
  cors({
    origin: process.env.CORS_URL,
    credentials: true,
  }),
);

// Middleware to initialize Passport
app.use(passport.initialize());
app.use(passport.session());

app.use("/api/auth", authRoutes);

app.use("/api/transactions", transactionsRoutes);

app.use("/api/wallets", walletsRoutes);

app.use("/api/categories", categoriesRoutes);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

app.listen(process.env.PORT, () => {
  console.log(`Server started on http://localhost:${process.env.PORT}`);
});

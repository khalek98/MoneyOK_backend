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

// Подключение к MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then((res) => console.log("DB OK!"))
  .catch((err) => console.log("DB error", err));

// Настройка сессий
app.use(
  session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: false,
  }),
);

// Настройка bodyParser и cookieParser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

// Настройка CORS
app.use(cors());

// Middleware to initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Роуты для авторизации и регистрации пользователей
app.use("/api/auth", authRoutes);

// Защищенные роуты для просмотра расходов и доходов
app.use("/api/transactions", transactionsRoutes);

app.use("/api/wallets", walletsRoutes);

app.use("/api/categories", categoriesRoutes);

// Обработка ошибок
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

// Запуск сервера
app.listen(process.env.PORT, () => {
  console.log(`Server started on http://localhost:${process.env.PORT}`);
});

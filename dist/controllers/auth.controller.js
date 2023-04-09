"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authConfirmToken = exports.authSignIn = exports.authSignUp = exports.getUser = void 0;
const express_validator_1 = require("express-validator");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const email_service_1 = require("../services/email.service");
const loggerAuth_1 = require("../utils/loggerAuth");
const User_1 = __importDefault(require("../models/User"));
const Category_1 = __importDefault(require("../models/Category"));
const Transaction_1 = require("../models/Transaction");
const Wallet_1 = __importDefault(require("../models/Wallet"));
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user._id;
    const user = yield User_1.default.findById(userId);
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
});
exports.getUser = getUser;
const authSignUp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { email, password, username } = req.body;
    const hashedPassword = yield bcrypt_1.default.hash(password, 10);
    const user = new User_1.default({
        email,
        password: hashedPassword,
        username,
    });
    const categories = [
        {
            name: "Food & Products",
            type: Transaction_1.TransactionType.EXPENSE,
            userId: user._id,
        },
        {
            name: "Entertainment",
            type: Transaction_1.TransactionType.EXPENSE,
            userId: user._id,
        },
        {
            name: "Transportation",
            type: Transaction_1.TransactionType.EXPENSE,
            userId: user._id,
        },
        {
            name: "Car",
            type: Transaction_1.TransactionType.EXPENSE,
            userId: user._id,
        },
        {
            name: "Health",
            type: Transaction_1.TransactionType.EXPENSE,
            userId: user._id,
        },
        {
            name: "Education",
            type: Transaction_1.TransactionType.EXPENSE,
            userId: user._id,
        },
        {
            name: "Salary",
            type: Transaction_1.TransactionType.INCOME,
            userId: user._id,
        },
        {
            name: "Freelance",
            type: Transaction_1.TransactionType.INCOME,
            userId: user._id,
        },
        {
            name: "Cryptocurrency",
            type: Transaction_1.TransactionType.INCOME,
            userId: user._id,
        },
        {
            name: "Gifts",
            type: Transaction_1.TransactionType.INCOME,
            userId: user._id,
        },
        {
            name: "Gifts",
            type: Transaction_1.TransactionType.EXPENSE,
            userId: user._id,
        },
        {
            name: "Dividends",
            type: Transaction_1.TransactionType.INCOME,
            userId: user._id,
        },
    ];
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
    ];
    try {
        const [savedUser] = yield Promise.all([
            user.save({ validateBeforeSave: true }),
            Category_1.default.insertMany(categories),
            Wallet_1.default.insertMany(wallets),
        ]);
        const token = jsonwebtoken_1.default.sign({ email, _id: savedUser._id }, process.env.JWT_SECRET, {
            expiresIn: "1d",
        });
        (0, email_service_1.sendConfirmationEmail)(savedUser, token);
        return res.status(200).json({ message: "Confirmation email sent" });
    }
    catch (err) {
        if (err.code === 11000) {
            (0, loggerAuth_1.logAuth)(err);
            return res.status(400).json({ message: "Email already registered" });
        }
        (0, loggerAuth_1.logAuth)(err);
        return res.status(500).json({
            message: `Failure sign up. Open log in logs/auth.log. Err.message: ${err.message}`,
        });
    }
});
exports.authSignUp = authSignUp;
const authSignIn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const user = (yield User_1.default.findOne({ email }));
    if (!user) {
        return res.status(400).json({ message: "Invalid credentials" });
    }
    const isValidPassword = yield bcrypt_1.default.compare(password, user.password);
    if (!isValidPassword) {
        return res.status(400).json({ message: "Invalid credentials" });
    }
    if (!user.isConfirmed) {
        return res.status(400).json({ message: "Email not confirmed" });
    }
    const { _id } = user;
    const token = jsonwebtoken_1.default.sign({ email, _id }, process.env.JWT_SECRET, { expiresIn: "1d" });
    return res.status(200).json({ token });
});
exports.authSignIn = authSignIn;
const authConfirmToken = (req, res) => {
    const { token } = req.params;
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        User_1.default.findByIdAndUpdate(decoded._id, { isConfirmed: true }, { new: true })
            .then((res) => console.log("Email confirmed", res))
            .catch((err) => console.log(err));
        return res.status(200).redirect(`${process.env.CORS_URL}/auth/confirmed`);
    }
    catch (err) {
        return res.status(400).send("<h1>Invalid token<h1/>");
    }
};
exports.authConfirmToken = authConfirmToken;

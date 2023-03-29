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
exports.authConfirmToken = exports.authLogin = exports.authSignUp = void 0;
const express_validator_1 = require("express-validator");
// import { randomUUID } from "crypto";
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const email_service_1 = require("../services/email.service");
const loggerAuth_1 = require("../utils/loggerAuth");
const User_1 = __importDefault(require("../models/User"));
const authSignUp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { email, password, username } = req.body;
    const hashedPassword = yield bcrypt_1.default.hash(password, 10);
    // const userId = randomUUID();
    const user = new User_1.default({
        // id: userId,
        email,
        password: hashedPassword,
        username,
    });
    user
        .save({ validateBeforeSave: true })
        .then(({ _id }) => {
        const token = jsonwebtoken_1.default.sign({ email, _id }, process.env.JWT_SECRET, {
            expiresIn: "1d",
        });
        (0, email_service_1.sendConfirmationEmail)(user, token);
        return res.status(200).json({ message: "Confirmation email sent", token });
    })
        .catch((err) => {
        if (err.code === 11000) {
            (0, loggerAuth_1.logAuth)(err);
            return res.status(400).json({ message: "Email already registered" });
        }
        (0, loggerAuth_1.logAuth)(err);
        return res.status(500).json({
            message: `Failure sign up. Open log in logs/auth.log. Err.message: ${err.message}`,
        });
    });
});
exports.authSignUp = authSignUp;
const authLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
exports.authLogin = authLogin;
const authConfirmToken = (req, res) => {
    const { token } = req.params;
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        User_1.default.findByIdAndUpdate(decoded._id, { isConfirmed: true }, { new: true })
            .then((res) => console.log("Email confirmed", res))
            .catch((err) => console.log(err));
        return res.status(200).send("<h1>Email confirmed<h1/>");
    }
    catch (err) {
        return res.status(400).send("<h1>Invalid token<h1/>");
    }
};
exports.authConfirmToken = authConfirmToken;

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
exports.deleteWallet = exports.updateWallet = exports.readAllUserWallets = exports.createWallet = void 0;
const express_validator_1 = require("express-validator");
const Wallet_1 = __importDefault(require("../models/Wallet"));
const Transaction_1 = __importDefault(require("../models/Transaction"));
const createWallet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const userId = req.user._id;
        const { name } = req.body;
        const newWallet = new Wallet_1.default({
            name,
            userId,
            transactions: [],
        });
        // await User.findByIdAndUpdate(userId, { $push: { wallets: newWallet._id } }, { new: true });
        const result = yield newWallet.save();
        res.status(201).json({ message: "Wallet saved success", result });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.createWallet = createWallet;
const readAllUserWallets = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user._id;
        const allUserWallets = yield Wallet_1.default.find({ userId });
        if (!allUserWallets) {
            return res.status(404).json({ error: "User has no wallets" });
        }
        res.status(200).json({ allUserWallets });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.readAllUserWallets = readAllUserWallets;
const updateWallet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { id } = req.params;
        const updateBody = req.body;
        const updatedWallet = yield Wallet_1.default.findByIdAndUpdate(id, Object.assign({}, updateBody), { new: true });
        if (!updatedWallet) {
            return res.status(404).json({ error: "Wallet not found" });
        }
        res.json({ message: "Wallet updated", wallet: updatedWallet });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.updateWallet = updateWallet;
const deleteWallet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield Transaction_1.default.startSession();
    session.startTransaction();
    try {
        const { id } = req.params;
        const wallet = yield Wallet_1.default.findById(id);
        if (!wallet) {
            return res.status(404).json({ message: "Wallet not found" });
        }
        const transactionsByWallet = yield Transaction_1.default.find({ walletId: wallet._id });
        transactionsByWallet.forEach((transaction) => transaction.deleteOne({ session }));
        yield Wallet_1.default.findByIdAndDelete(id);
        yield session.commitTransaction();
        res.status(200).json({ message: "Wallet deleted successfully" });
    }
    catch (error) {
        yield session.abortTransaction();
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }
    finally {
        session.endSession();
    }
});
exports.deleteWallet = deleteWallet;

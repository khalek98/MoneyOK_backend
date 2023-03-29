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
exports.updateTransaction = exports.readTransaction = exports.deleteTransaction = exports.createTransaction = exports.allExpenseTransactions = exports.allIncomeTransactions = void 0;
const mongoose_1 = require("mongoose");
const express_validator_1 = require("express-validator");
const Transaction_1 = __importDefault(require("../models/Transaction"));
const Category_1 = __importDefault(require("../models/Category"));
const Wallet_1 = __importDefault(require("../models/Wallet"));
const allIncomeTransactions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user._id;
        const userTransactions = yield Transaction_1.default.find({ userId, type: "income" });
        if (!userTransactions) {
            return res.status(404).json({ error: "User has no income transactions" });
        }
        res.status(200).json({ userTransactions });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.allIncomeTransactions = allIncomeTransactions;
const allExpenseTransactions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user._id;
        const userTransactions = yield Transaction_1.default.find({ userId, type: "expense" });
        if (!userTransactions) {
            return res.status(404).json({ error: "User has no expense transactions" });
        }
        res.status(200).json({ userTransactions });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.allExpenseTransactions = allExpenseTransactions;
const createTransaction = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield (0, mongoose_1.startSession)();
    session.startTransaction();
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const userId = req.user._id;
        const { amount, description, type, categoryId, walletId, date } = req.body;
        // const user: IUser = await User.findById(userId).populate("wallets categories");
        const category = yield Category_1.default.findById(categoryId);
        const wallet = yield Wallet_1.default.findById(walletId);
        if (!category) {
            return res.status(400).json({ msg: "Category not found" });
        }
        if (!wallet) {
            return res.status(400).json({ msg: "Wallet not found" });
        }
        const newTransaction = new Transaction_1.default({
            // id: randomUUID(),
            description,
            amount,
            type,
            categoryId,
            walletId,
            userId,
            date,
        });
        if (type === "income") {
            wallet.balance += amount;
        }
        else {
            wallet.balance -= amount;
        }
        // await Category.findByIdAndUpdate(
        //   categoryId,
        //   { $push: { transactions: newTransaction._id } },
        //   { new: true },
        // );
        yield wallet.updateOne({ balance: wallet.balance }, { new: true }).session(session);
        // await Wallet.findByIdAndUpdate(walletId, { balance: wallet.balance }, { new: true })
        const result = yield newTransaction.save({ session });
        yield session.commitTransaction();
        res.status(201).json({ message: "Tansaction saved success", result });
    }
    catch (error) {
        yield session.abortTransaction();
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
    finally {
        session.endSession();
    }
});
exports.createTransaction = createTransaction;
const deleteTransaction = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield Transaction_1.default.startSession();
    session.startTransaction();
    try {
        const { id } = req.params;
        const transaction = yield Transaction_1.default.findById(id);
        if (!transaction) {
            return res.status(404).json({ message: "Transaction not found" });
        }
        // Update the wallet balance based on the transaction type
        const wallet = yield Wallet_1.default.findById(transaction.walletId).session(session);
        if (transaction.type === "income") {
            wallet.balance -= transaction.amount;
        }
        else {
            wallet.balance += transaction.amount;
        }
        // Update the wallet and delete the transaction
        yield Wallet_1.default.findByIdAndUpdate(transaction.walletId, { balance: wallet.balance }, { new: true }).session(session);
        yield transaction.deleteOne({ session });
        // Delete transaction from category
        // await Category.findByIdAndUpdate(
        //   transaction.categoryId,
        //   {
        //     $pull: { transactions: transaction._id },
        //   },
        //   { new: true },
        // ).session(session);
        // Commit the transaction
        yield session.commitTransaction();
        res.status(200).json({ message: "Transaction deleted successfully" });
    }
    catch (error) {
        yield session.abortTransaction();
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
    finally {
        session.endSession();
    }
});
exports.deleteTransaction = deleteTransaction;
const readTransaction = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const transaction = yield Transaction_1.default.findById(id);
        if (!transaction) {
            return res.status(404).json({ message: "Transaction not found" });
        }
        res.status(200).json({ transaction });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.readTransaction = readTransaction;
const updateTransaction = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield (0, mongoose_1.startSession)();
    session.startTransaction();
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { id } = req.params;
        const updateBody = req.body;
        const transaction = yield Transaction_1.default.findById(id);
        if (!transaction) {
            return res.status(404).json({ error: "Transaction not found" });
        }
        const updatedTransaction = yield transaction
            .updateOne(Object.assign({}, updateBody), { new: true })
            .session(session);
        if ("amount" in updateBody) {
            const { walletId, type } = transaction;
            const wallet = yield Wallet_1.default.findById(walletId);
            const newAmount = updateBody.amount - transaction.amount;
            if (type === "income") {
                wallet.balance += newAmount;
            }
            else {
                wallet.balance -= newAmount;
            }
            yield wallet.updateOne({ balance: wallet.balance }, { new: true }).session(session);
        }
        yield session.commitTransaction();
        res.json({ message: "Transaction updated", transaction: updatedTransaction });
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
exports.updateTransaction = updateTransaction;

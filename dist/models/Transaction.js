"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionType = void 0;
const mongoose_1 = require("mongoose");
var TransactionType;
(function (TransactionType) {
    TransactionType["INCOME"] = "income";
    TransactionType["EXPENSE"] = "expense";
})(TransactionType = exports.TransactionType || (exports.TransactionType = {}));
// Transaction schema
const TransactionSchema = new mongoose_1.Schema({
    description: { type: String, default: "" },
    amount: { type: Number, required: true },
    type: { type: String, enum: [TransactionType.INCOME, TransactionType.EXPENSE], required: true },
    categoryId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Category", required: true },
    walletId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Wallet", required: true },
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: Date, default: Date.now },
}, { timestamps: true });
const Transaction = (0, mongoose_1.model)("Transaction", TransactionSchema);
exports.default = Transaction;

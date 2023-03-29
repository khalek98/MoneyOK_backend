"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
// Wallet schema
const WalletSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User" },
    balance: { type: Number, default: 0 },
}, { timestamps: true });
const Wallet = (0, mongoose_1.model)("Wallet", WalletSchema);
exports.default = Wallet;

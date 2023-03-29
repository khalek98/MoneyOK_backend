"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const Transaction_1 = require("./Transaction");
// Category schema
const CategorySchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    type: { type: String, enum: [Transaction_1.TransactionType.INCOME, Transaction_1.TransactionType.EXPENSE], required: true },
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
});
const Category = (0, mongoose_1.model)("Category", CategorySchema);
exports.default = Category;

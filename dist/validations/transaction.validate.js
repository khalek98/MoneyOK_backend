"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUpdateTransaction = exports.validateCreateTransaction = void 0;
const express_validator_1 = require("express-validator");
const Transaction_1 = require("./../models/Transaction");
exports.validateCreateTransaction = [
    (0, express_validator_1.body)("description", "Description type must be string").isString().optional(),
    (0, express_validator_1.body)("amount", "Amount must be a number").isNumeric(),
    (0, express_validator_1.body)("type", "Type must be either income or expense").isIn([
        Transaction_1.TransactionType.EXPENSE,
        Transaction_1.TransactionType.INCOME,
    ]),
    (0, express_validator_1.body)("categoryId", "Category ID is required").isString().notEmpty(),
    (0, express_validator_1.body)("walletId", "Wallet ID is required").isString().notEmpty(),
];
exports.validateUpdateTransaction = [
    (0, express_validator_1.body)("description").optional().isString().withMessage("Description type must be string"),
    (0, express_validator_1.body)("amount")
        .optional()
        .isNumeric()
        .withMessage("Amount must be  a number")
        .isFloat({ min: 0 })
        .withMessage("Amount must be greater than or equal to 0"),
    (0, express_validator_1.body)("categoryId").optional().isString().notEmpty().withMessage("Category ID must no be empty"),
    (0, express_validator_1.body)("walletId").optional().isString().notEmpty().withMessage("Wallet ID must no be empty"),
];

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUpdateCaterory = exports.validateCreateCaterory = void 0;
const express_validator_1 = require("express-validator");
const Transaction_1 = require("./../models/Transaction");
exports.validateCreateCaterory = [
    (0, express_validator_1.body)("name", "Category Name is required").isString().notEmpty(),
    (0, express_validator_1.body)("type", "Type must be either income or expense").isIn([
        Transaction_1.TransactionType.EXPENSE,
        Transaction_1.TransactionType.INCOME,
    ]),
];
exports.validateUpdateCaterory = [
    (0, express_validator_1.body)("name").optional().isString().withMessage("Name type must be string"),
];

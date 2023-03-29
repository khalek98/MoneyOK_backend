"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUpdateWallet = exports.validateCreateWallet = void 0;
const express_validator_1 = require("express-validator");
exports.validateCreateWallet = [(0, express_validator_1.body)("name", "Wallet Name is required").isString().notEmpty()];
exports.validateUpdateWallet = [
    (0, express_validator_1.body)("name").optional().isString().withMessage("Name type must be string"),
    (0, express_validator_1.body)("balance").optional().isNumeric().withMessage("Balance must be a number"),
];

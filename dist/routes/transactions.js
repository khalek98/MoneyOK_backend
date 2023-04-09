"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = __importDefault(require("../middlewares/authMiddleware"));
const transactions_controller_1 = require("../controllers/transactions.controller");
const transaction_validate_1 = require("../validations/transaction.validate");
const validateKeyInBody_1 = require("../middlewares/validateKeyInBody");
const router = (0, express_1.Router)();
router.get("/", authMiddleware_1.default, transactions_controller_1.readAllTransactions);
// router.get("/expenseList", authMiddleware, allExpenseTransactions);
router.get("/:id", authMiddleware_1.default, transactions_controller_1.readTransaction);
router.post("/", authMiddleware_1.default, transaction_validate_1.validateCreateTransaction, transactions_controller_1.createTransaction);
router.patch("/:id", authMiddleware_1.default, validateKeyInBody_1.validatePropsTransaction, transaction_validate_1.validateUpdateTransaction, transactions_controller_1.updateTransaction);
router.delete("/:id", authMiddleware_1.default, transactions_controller_1.deleteTransaction);
exports.default = router;

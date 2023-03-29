import { body } from "express-validator";
import { TransactionType } from "./../models/Transaction";

export const validateCreateTransaction = [
  body("description", "Description type must be string").isString().optional(),
  body("amount", "Amount must be a number").isNumeric(),
  body("type", "Type must be either income or expense").isIn([
    TransactionType.EXPENSE,
    TransactionType.INCOME,
  ]),
  body("categoryId", "Category ID is required").isString().notEmpty(),
  body("walletId", "Wallet ID is required").isString().notEmpty(),
];

export const validateUpdateTransaction = [
  body("description").optional().isString().withMessage("Description type must be string"),
  body("amount")
    .optional()
    .isNumeric()
    .withMessage("Amount must be  a number")
    .isFloat({ min: 0 })
    .withMessage("Amount must be greater than or equal to 0"),
  body("categoryId").optional().isString().notEmpty().withMessage("Category ID must no be empty"),
  body("walletId").optional().isString().notEmpty().withMessage("Wallet ID must no be empty"),
];

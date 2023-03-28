import { body } from "express-validator";

export const validateCreateWallet = [body("name", "Wallet Name is required").isString().notEmpty()];

export const validateUpdateWallet = [
  body("name").optional().isString().withMessage("Name type must be string"),
  body("balance").optional().isNumeric().withMessage("Balance must be a number"),
];

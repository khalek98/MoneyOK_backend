import { body } from "express-validator";
import { TransactionType } from "./../models/Transaction";

export const validateCreateCaterory = [
  body("name", "Category Name is required").isString().notEmpty(),
  body("type", "Type must be either income or expense").isIn([
    TransactionType.EXPENSE,
    TransactionType.INCOME,
  ]),
];

export const validateUpdateCaterory = [
  body("name").optional().isString().withMessage("Name type must be string"),
];

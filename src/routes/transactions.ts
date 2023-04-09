import { Router } from "express";

import authMiddleware from "../middlewares/authMiddleware";

import {
  createTransaction,
  readAllTransactions,
  updateTransaction,
  deleteTransaction,
  readTransaction,
} from "../controllers/transactions.controller";
import {
  validateCreateTransaction,
  validateUpdateTransaction,
} from "../validations/transaction.validate";
import { validatePropsTransaction } from "../middlewares/validateKeyInBody";

const router = Router();

router.get("/", authMiddleware, readAllTransactions);

// router.get("/expenseList", authMiddleware, allExpenseTransactions);

router.get("/:id", authMiddleware, readTransaction);

router.post("/", authMiddleware, validateCreateTransaction, createTransaction);

router.patch(
  "/:id",
  authMiddleware,
  validatePropsTransaction,
  validateUpdateTransaction,
  updateTransaction,
);

router.delete("/:id", authMiddleware, deleteTransaction);

export default router;

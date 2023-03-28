import authMiddleware from "../middlewares/authMiddleware";
import { Router } from "express";

import { validateCreateCaterory, validateUpdateCaterory } from "../validations/categories.validate";
import {
  allIncomeCategories,
  allExpenseCategories,
  createCategory,
  readCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/categories.controller";
import { validateCategoryProps } from "../middlewares/validateKeyInBody";

const router = Router();

router.post("/", authMiddleware, validateCreateCaterory, createCategory);

router.get("/incomeList", authMiddleware, allIncomeCategories);

router.get("/expenseList", authMiddleware, allExpenseCategories);

router.get("/:id", authMiddleware, readCategory);

router.patch("/:id", authMiddleware, validateCategoryProps, validateUpdateCaterory, updateCategory);

router.delete("/:id", authMiddleware, deleteCategory);

export default router;

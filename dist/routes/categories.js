"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const authMiddleware_1 = __importDefault(require("../middlewares/authMiddleware"));
const express_1 = require("express");
const categories_validate_1 = require("../validations/categories.validate");
const categories_controller_1 = require("../controllers/categories.controller");
const validateKeyInBody_1 = require("../middlewares/validateKeyInBody");
const router = (0, express_1.Router)();
router.post("/", authMiddleware_1.default, categories_validate_1.validateCreateCaterory, categories_controller_1.createCategory);
router.get("/incomeList", authMiddleware_1.default, categories_controller_1.allIncomeCategories);
router.get("/expenseList", authMiddleware_1.default, categories_controller_1.allExpenseCategories);
router.get("/:id", authMiddleware_1.default, categories_controller_1.readCategory);
router.patch("/:id", authMiddleware_1.default, validateKeyInBody_1.validateCategoryProps, categories_validate_1.validateUpdateCaterory, categories_controller_1.updateCategory);
router.delete("/:id", authMiddleware_1.default, categories_controller_1.deleteCategory);
exports.default = router;

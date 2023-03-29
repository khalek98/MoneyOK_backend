"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategory = exports.updateCategory = exports.readCategory = exports.allExpenseCategories = exports.allIncomeCategories = exports.createCategory = void 0;
const express_validator_1 = require("express-validator");
const Category_1 = __importDefault(require("./../models/Category"));
const createCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const userId = req.user._id;
        const { name, type } = req.body;
        const newCategory = new Category_1.default({
            name,
            type,
            userId,
        });
        // await User.findByIdAndUpdate(userId, { $push: { categories: newCategory._id } }, { new: true });
        const result = yield newCategory.save();
        res.status(201).json({ message: "Category saved success", result });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.createCategory = createCategory;
const allIncomeCategories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user._id;
        const userIncomeCategories = yield Category_1.default.find({ userId, type: "income" });
        if (!userIncomeCategories) {
            return res.status(404).json({ error: "User has no income categories" });
        }
        res.status(200).json({ data: userIncomeCategories });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.allIncomeCategories = allIncomeCategories;
const allExpenseCategories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user._id;
        const userExpenseCategories = yield Category_1.default.find({ userId, type: "expense" });
        if (!userExpenseCategories) {
            return res.status(404).json({ error: "User has no expense categories" });
        }
        res.status(200).json({ data: userExpenseCategories });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.allExpenseCategories = allExpenseCategories;
const readCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const category = yield Category_1.default.findById(id);
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }
        res.status(200).json({ category });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.readCategory = readCategory;
const updateCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { id } = req.params;
        const updateBody = req.body;
        const updatedCategory = yield Category_1.default.findByIdAndUpdate(id, Object.assign({}, updateBody), { new: true });
        if (!updatedCategory) {
            return res.status(404).json({ error: "Category not found" });
        }
        res.json({ message: "Category updated", category: updatedCategory });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.updateCategory = updateCategory;
const deleteCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const category = yield Category_1.default.findByIdAndDelete(id);
        res.status(200).json({ message: "Transaction deleted successfully", response: category });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.deleteCategory = deleteCategory;

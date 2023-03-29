import { Response } from "express";
import { validationResult } from "express-validator";

import { Request } from "express.interface";
import Category, { ICategory } from "./../models/Category";

export const createCategory = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userId = req.user._id;

    const { name, type } = req.body as ICategory;

    const newCategory = new Category({
      name,
      type,
      userId,
    });

    // await User.findByIdAndUpdate(userId, { $push: { categories: newCategory._id } }, { new: true });

    const result = await newCategory.save();
    res.status(201).json({ message: "Category saved success", result });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const allIncomeCategories = async (req: Request, res: Response) => {
  try {
    const userId = req.user._id;

    const userIncomeCategories = await Category.find({ userId, type: "income" });

    if (!userIncomeCategories) {
      return res.status(404).json({ error: "User has no income categories" });
    }

    res.status(200).json({ data: userIncomeCategories });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const allExpenseCategories = async (req: Request, res: Response) => {
  try {
    const userId = req.user._id;

    const userExpenseCategories = await Category.find({ userId, type: "expense" });

    if (!userExpenseCategories) {
      return res.status(404).json({ error: "User has no expense categories" });
    }

    res.status(200).json({ data: userExpenseCategories });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const readCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json({ category });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;

    const updateBody = req.body as ICategory;

    const updatedCategory = await Category.findByIdAndUpdate(id, { ...updateBody }, { new: true });

    if (!updatedCategory) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.json({ message: "Category updated", category: updatedCategory });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const category = await Category.findByIdAndDelete(id);

    res.status(200).json({ message: "Transaction deleted successfully", response: category });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

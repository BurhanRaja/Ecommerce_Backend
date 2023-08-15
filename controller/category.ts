import { Request, Response } from "express";
import Category from "../model/Category.js";
import validateReq from "../utils/vaidation.js";
import { UpdateCategory } from "../utils/defineother.js";

// Get All Categories
export const getAllCategories = async (req: Request, res: Response) => {
  let success = false;
  try {
    const categories = await Category.find();
    if (!categories) {
      res.status(404).send({ success, error: "404 Not Found" });
    }
    success = true;
    return res.status(200).send({
      success,
      categories,
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      error: "Internal Server Error",
    });
  }
};

export const getCategoriesOfParent = async (req: Request, res: Response) => {
  let success = false;
  try {
    const parentId = req.params.parentId;
    const categories = await Category.find({ parent_id: parentId });

    success = true;

    return res.status(200).send({
      success,
      categories,
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      error: "Internal Server Error",
    });
  }
};

// Create Category
export const createCategory = async (req: Request, res: Response) => {
  let success = false;

  validateReq(req, res);

  try {
    const { name, description, parent_id } = req.body;

    let category = await Category.findOne({ name: name });

    if (category) {
      return res.status(400).send({
        success,
        message: "Category Already exists.",
      });
    }

    category = await Category.create({
      name,
      description,
      parent_id,
    });

    success = true;

    return res.status(200).send({
      success,
      category,
    });
  } catch (err) {
    res.status(500).send({ success: false, error: "Internal Server Error." });
  }
};

// Update Category
export const updateCategory = async (req: Request, res: Response) => {
  let success = false;

  validateReq(req, res);

  try {
    const { name, description, parent_id } = req.body;

    let updCat = {} as UpdateCategory;

    if (name) updCat.name = name;
    if (description) updCat.description = description;
    if (parent_id) updCat.parent_id = parent_id;

    let category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).send({ success, message: "404 Not Found." });
    }

    category = await Category.findByIdAndUpdate(
      req.params.id,
      { $set: updCat },
      { new: true }
    );

    success = true;

    return res.status(200).send({
      success,
      category,
    });
  } catch (err) {
    return res
      .status(500)
      .send({ success: false, message: "Internal Server Error." });
  }
};

// Delete Category
export const deleteCategory = async (req: Request, res: Response) => {
  let success = false;

  try {
    let category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).send({
        success,
        message: "404 Not Found",
      });
    }

    category = await Category.findOneAndDelete(
      { _id: req.params.id },
      { $set: null }
    );

    success = true;

    return res.status(200).send({
      success,
      category,
    });
  } catch (err) {
    return res
      .status(500)
      .send({ success: false, message: "Internal Server Error." });
  }
};

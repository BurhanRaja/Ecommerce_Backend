import { Request, Response } from "express";
import { SubCategoryFilter, UpdateSubCategory } from "../utils/defineother.js";
import { Types } from "mongoose";

import validateReq from "../utils/vaidation.js";
import Subcategory from "../model/Sub_Category.js";

// Get SubCategory based on category
export const getSubCategoriesofCategories = async (
  req: Request,
  res: Response
) => {
  let success = false;

  try {
    let subCategories = await Subcategory.find({
      category_id: req.params.catid,
    });

    success = true;

    return res.status(200).send({
      success,
      subCategories,
    });
  } catch (err) {
    return res
      .status(500)
      .send({ success: false, message: "Internal Server Error." });
  }
};

// Get SubCategory based on category
export const getAllSubCategories = async (req: Request, res: Response) => {
  let success = false;

  try {
    let subCategories = await Subcategory.find();

    success = true;

    return res.status(200).send({
      success,
      subCategories,
    });
  } catch (err) {
    return res
      .status(500)
      .send({ success: false, message: "Internal Server Error." });
  }
};

// Parent categories from Sub categories
export const getAllSubCategoriesfromParent = async (
  req: Request,
  res: Response
) => {
  let success = false;

  try {
    let { categories } = req.query;

    let params = {} as SubCategoryFilter;

    params["parent_category_id"] = req.params.id;
    if (categories) {
      params["category_id"] = { $in: (categories as string).split(",") };
    }

    let subcategories = await Subcategory.find({
      ...params,
    });

    success = true;

    return res.status(200).send({
      success,
      subcategories,
    });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .send({ success: false, message: "Internal Server Error." });
  }
};

// Create Sub Category
export const createSubCategory = async (req: Request, res: Response) => {
  let success = true;

  validateReq(req, res);

  try {
    const { name, description, category_id, parent_category_id } = req.body;

    let subCat = await Subcategory.findOne({
      name: name,
      category_id: category_id,
    });

    if (subCat) {
      return res.status(400).send({
        success: false,
        message: "Sub-category in Category Already Exists.",
      });
    }

    subCat = await Subcategory.create({
      name,
      description,
      category_id,
      parent_category_id,
    });

    success = true;

    return res.status(200).send({
      success,
      subCat,
    });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .send({ success: false, message: "Internal Server Error." });
  }
};

// Update Sub-category
export const updateSubCategory = async (req: Request, res: Response) => {
  let success = false;

  validateReq(req, res);

  try {
    const { name, description, category_id, parent_category_id } = req.body;

    let updSubCat = {} as UpdateSubCategory;

    if (name) updSubCat.name = name;
    if (description) updSubCat.description = description;
    if (category_id) updSubCat.category_id = new Types.ObjectId(category_id);
    if (parent_category_id)
      updSubCat.parent_category_id = new Types.ObjectId(parent_category_id);

    let subCat = await Subcategory.findById(req.params.id);

    if (!subCat) {
      return res.status(404).send({ success, message: "404 Not Found." });
    }

    subCat = await Subcategory.findByIdAndUpdate(
      req.params.id,
      { $set: updSubCat },
      { new: true }
    );

    success = true;

    return res.status(200).send({
      success,
      subCat,
    });
  } catch (err) {
    return res
      .status(500)
      .send({ success: false, message: "Internal Server Error." });
  }
};

// Delete Sub-category
export const deleteSubCategory = async (req: Request, res: Response) => {
  let success = false;

  try {
    let subCat = await Subcategory.findById(req.params.id);
    if (!subCat) {
      return res.status(404).send({ success, message: "404 Not Found." });
    }

    subCat = await Subcategory.findOneAndDelete(
      { _id: req.params.id },
      { $set: null }
    );

    success = true;

    return res.status(200).send({
      success,
      subCat,
    });
  } catch (err) {
    return res
      .status(500)
      .send({ success: false, message: "Internal Server Error." });
  }
};

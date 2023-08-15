import { Request, Response } from "express";
import ParentCategory from "../model/Parentcategory.js";
import validateReq from "../utils/vaidation.js";
import { UpdateParentCategory } from "../utils/defineother.js";

// Get Parent Categories
export const getAllParentCategories = async (req: Request, res: Response) => {
  let success = false;
  try {
    const pCategories = await ParentCategory.find();
    if (!pCategories) {
      res.status(404).send({ success, error: "404 Not Found" });
    }
    success = true;
    return res.status(200).send({
      success,
      pCategories,
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      error: "Internal Server Error",
    });
  }
};

export const getSingleParentCategory = async (req: Request, res: Response) => {
  let success = false;
  try {
    const pCategory = await ParentCategory.findOne({ _id: req.params.id });
    if (!pCategory) {
      res.status(404).send({ success, error: "404 Not Found" });
    }
    success = true;
    return res.status(200).send({
      success,
      pCategory,
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      error: "Internal Server Error",
    });
  }
};

// Create Parent Category
export const createParentCategory = async (req: Request, res: Response) => {
  let success = false;

  validateReq(req, res);

  try {
    const { name, description } = req.body;

    let pCategory = await ParentCategory.findOne({ name: name });

    if (pCategory) {
      return res.status(400).send({
        success,
        message: "Parent Category Already exists.",
      });
    }

    pCategory = await ParentCategory.create({
      name,
      description,
    });

    success = true;

    return res.status(200).send({
      success,
      pCategory,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({ success: false, error: "Internal Server Error." });
  }
};

// Update Parent Category
export const updateParentCategory = async (req: Request, res: Response) => {
  let success = false;

  validateReq(req, res);

  try {
    const { name, description } = req.body;

    let updCat = {} as UpdateParentCategory;

    if (name) updCat.name = name;
    if (description) updCat.description = description;

    let pCategory = await ParentCategory.findById(req.params.id);

    if (!pCategory) {
      return res.status(404).send({ success, message: "404 Not Found." });
    }

    pCategory = await ParentCategory.findByIdAndUpdate(
      req.params.id,
      { $set: updCat },
      { new: true }
    );

    success = true;

    return res.status(200).send({
      success,
      pCategory,
    });
  } catch (err) {
    return res
      .status(500)
      .send({ success: false, message: "Internal Server Error." });
  }
};

// Delete Parent Category
export const deleteCategory = async (req: Request, res: Response) => {
  let success = false;

  try {
    let pCategory = await ParentCategory.findById(req.params.id);

    if (!pCategory) {
      return res.status(404).send({
        success,
        message: "404 Not Found",
      });
    }

    pCategory = await ParentCategory.findOneAndDelete(
      { _id: req.params.id },
      {
        $set: null,
      }
    );

    success = true;

    return res.status(200).send({
      success,
      pCategory,
    });
  } catch (err) {
    return res
      .status(500)
      .send({ success: false, message: "Internal Server Error." });
  }
};

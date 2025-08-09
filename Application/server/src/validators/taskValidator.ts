import { body, param } from "express-validator";
import mongoose from "mongoose";

export const validatorTask = [
  body("title")
    .notEmpty()
    .optional()
    .isString()
    .withMessage("Title is required")
    .isLength({ min: 3 })
    .withMessage("Title must be at least 3 characters long"),

  body("completed")
    .optional()
    .isBoolean()
    .withMessage("Completed must be a boolean"),
];

export const updateTaskValidator = [
  param("id")
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage("Invalid task ID"),
];

import { body, param } from "express-validator";
import mongoose from "mongoose";

/**
 * General rules:
 * - title is mandatory at creation, string, without extra spaces, 1..100 characters.
 * - completed - boolean (may come during update)
 * - :id in url must be valid ObjectId
 */

export const idParamValidator = [
  param("id")
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage("Invalid task ID"),
];

export const createTaskValidator = [
  body("title")
    .exists({ checkFalsy: true })
    .withMessage("Title is required")
    .bail()
    .isString()
    .withMessage("Title must be a string")
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage("Title must be 1-100 characters long"),
  // we don't accept completed at creation (set false in the controller),
  // but if you really want to - you can uncomment:
  // body("completed").optional().isBoolean().withMessage("Completed must be boolean"),
];

export const updateTaskValidator = [
  // title — опционально, но если пришёл — валидируем
  body("title")
    .optional()
    .isString()
    .withMessage("Title must be a string")
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage("Title must be 1-100 characters long"),
  // completed — опционально, булево
  body("completed")
    .optional()
    .isBoolean()
    .withMessage("Completed must be boolean"),
];

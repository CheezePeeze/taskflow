import express from "express";
import { verifyToken } from "../middleware/verifyToken";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  getTaskByID,
} from "../controllers/taskController";
import { handleValidation } from "../middleware/handleValidation";

import {
  idParamValidator,
  createTaskValidator,
  updateTaskValidator,
} from "../validators/taskValidator";

const router = express.Router();

// All tasks of the current user
router.get("/", verifyToken, getTasks);

// Create a task
router.post(
  "/",
  verifyToken,
  createTaskValidator,
  handleValidation,
  createTask
);

// Get one task by id
router.get(
  "/:id",
  verifyToken,
  idParamValidator,
  handleValidation,
  getTaskByID
);

// Update Task
router.put(
  "/:id",
  verifyToken,
  idParamValidator,
  updateTaskValidator,
  handleValidation,
  updateTask
);

// Remove task
router.delete(
  "/:id",
  verifyToken,
  idParamValidator,
  handleValidation,
  deleteTask
);

export default router;

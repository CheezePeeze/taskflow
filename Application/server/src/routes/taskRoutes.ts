import express from "express";
import { verifyToken } from "../middleware/verifyToken";
import {
  createTask,
  deleteTask,
  getTaskByID,
  getTasks,
  updateTask,
} from "../controllers/taskController";
import {
  validatorTask,
  updateTaskValidator,
} from "../validators/taskValidator";
import { handleValidation } from "../middleware/handleValidation";

const router = express.Router();

router.get("/", verifyToken, getTasks);
router.get(
  "/:id",
  verifyToken,
  updateTaskValidator,
  handleValidation,
  getTaskByID
);

router.post("/", verifyToken, validatorTask, handleValidation, createTask);

router.put(
  "/:id",
  verifyToken,
  updateTaskValidator,
  handleValidation,
  updateTask
);

router.delete("/:id", verifyToken, deleteTask);

export default router;

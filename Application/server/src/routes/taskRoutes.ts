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

// Все задачи текущего пользователя
router.get("/", verifyToken, getTasks);

// Создать задачу
router.post(
  "/",
  verifyToken,
  createTaskValidator,
  handleValidation,
  createTask
);

// Получить одну задачу по id
router.get(
  "/:id",
  verifyToken,
  idParamValidator,
  handleValidation,
  getTaskByID
);

// Обновить задачу
router.put(
  "/:id",
  verifyToken,
  idParamValidator,
  updateTaskValidator,
  handleValidation,
  updateTask
);

// Удалить задачу
router.delete(
  "/:id",
  verifyToken,
  idParamValidator,
  handleValidation,
  deleteTask
);

export default router;

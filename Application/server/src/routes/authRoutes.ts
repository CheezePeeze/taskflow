import express from "express";
import { registerUser, loginUser } from "../controllers/authController";
import { verifyToken } from "../middleware/verifyToken";
import Task from "../models/Task";

const router = express.Router();

//POST /api/auth/register - registration
router.post("/register", registerUser);

//POST /api/auth/login - login
router.post("/login", loginUser);

//🔒 Example of a secure router
router.get("/protected", verifyToken, (req, res) => {
  res.status(200).json({
    message: "Welcome to the protected route!",
    userId: (req as any).userId,
  });
});

router.get("/tasks", verifyToken, async (req, res) => {
  const tasks = await Task.find({ userId: (req as any).userId });
  res.json(tasks);
});

// Get only your tasks
router.get("/", verifyToken, async (req, res) => {
  try {
    const tasks = await Task.find({ userId: (req as any).userId });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

//Creating a task for the current user
router.post("/", verifyToken, async (req, res) => {
  const { title } = req.body;
  if (!title) return res.status(400).json({ message: "Title is required" });
  try {
    const task = await Task.create({
      title,
      completed: false,
      userId: (req as any).userId,
    });
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;



import { Request, Response } from "express";
import Task from "../models/Task";
import { AuthRequest } from "../middleware/verifyToken";

export const getTasks = async (req: Request, res: Response) => {
  const userId = (req as any).userId;
  const { completed } = req.query;

  const filter: any = { userId };

  if (completed === "true") filter.completed = true;
  if (completed === "false") filter.completed = false;

  try {
    const tasks = await Task.find(filter);
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const createTask = async (req: AuthRequest, res: Response) => {
  const { title } = req.body;
  const task = await Task.create({
    title,
    completed: false,
    userId: (req as any).userId,
  });
  res.status(201).json(task);
};

export const updateTask = async (req: Request, res: Response) => {
  const { title, completed } = req.body;
  const task = await Task.findOneAndUpdate(
    { _id: req.params.id, userId: (req as any).userId },
    { title, completed },
    { new: true }
  );
  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }
  res.json(task);
};

export const deleteTask = async (req: Request, res: Response) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      userId: (req as any).userId,
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({ message: "Task deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getTaskByID = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const task = await Task.findOne({ _id: id, userId: (req as any).userId });
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

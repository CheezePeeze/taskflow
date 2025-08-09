import express from "express";
import { verifyToken } from "../middleware/verifyToken";
import { User } from "../models/User";
import bcrypt from "bcrypt";
const router = express.Router();

// Getting current User
router.get("/me", verifyToken, async (req, res) => {
  try {
    const userId = (req as any).userId;
    const user = await User.findById(userId).select("-password"); //filtering without password

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.json(user);
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
});

router.put("/me", verifyToken, async (req, res) => {
  try {
    const { username } = req.body;
    if (!username || !username.trim()) {
      return res.status(400).json({ message: "Username is required" });
    }

    const user = await User.findByIdAndUpdate(
      (req as any).userId,
      { username: username.trim() },
      { new: true, select: "email username" }
    );

    if (!user) return res.status(404).json({ message: "User not found" });

    return res.json(user);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Server error" });
  }
});

router.put("/password", verifyToken, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword)
    return res.status(400).json({ message: "Both passwords required" });

  const user = await User.findById((req as any).userId);
  if (!user) return res.status(404).json({ message: "User not found" });

  const ok = await (user as any).comparePassword(currentPassword);
  if (!ok)
    return res.status(400).json({ message: "Current password is wrong" });

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(newPassword, salt);
  await user.save();

  res.json({ message: "Password updated" });
});

export default router;

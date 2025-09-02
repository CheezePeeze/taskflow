// server/src/index.ts
import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";

import authRoutes from "./routes/authRoutes";
import taskRoutes from "./routes/taskRoutes";
import userRoutes from "./routes/userRoutes";
import { errorHandler } from "./middleware/errorHandler";

const app = express();

// 1) CORS settings (allow our front + desired headers/methods)
const ORIGIN = process.env.CORS_ORIGIN || "http://localhost:5173";
const corsOptions: cors.CorsOptions = {
  origin: ORIGIN,
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// 2) CORS must be BEFORE roots
app.use(cors(corsOptions));
// just in case, explicitly respond to preflight for any paths

// 3) JSON parsing
app.use(express.json());

// 4) Routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/users", userRoutes);

// 5) Health-check (handy for quick hand/monitoring checks)
app.get("/api/health", (_req, res) => {
  res.json({ ok: true, origin: ORIGIN });
});

// 6) Global error handler - after roots
app.use(errorHandler);

// 7) Connecting to the database and starting the server
const PORT = Number(process.env.PORT || 5050);
const MONGO_URI = process.env.MONGO_URI!;
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB is connected");
    app.listen(PORT, () => {
      console.log(`Server is working on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

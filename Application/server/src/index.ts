import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes";
import taskRoutes from "./routes/taskRoutes";
import userRoutes from "./routes/userRoutes"

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5050;

//Middleware
app.use(cors({
  origin: "http://localhost:5173", // твой фронт
  credentials: true
}));
app.use(express.json());
//Using routes
app.use("/api/auth", authRoutes);
//Simple Route testing

app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
  res.send("API is working!");
});

app.use("/api/tasks", taskRoutes);
//Connecting to the database

mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => console.log("MongoDB is connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

//JSON Parsingapp.use(express.json());

//Server launch
app.listen(PORT, () => {
  console.log(`Server is working on port ${PORT}`);
});

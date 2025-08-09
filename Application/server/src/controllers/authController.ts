import { Request, Response } from "express";
import { User } from "../models/User";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    //Checking if the user is exist
    const existingUser = await User.findOne({ email });
    console.log("req.body:", req.body);
    if (existingUser) {
      return res.status(400).json({ message: "User already exist" });
    }

    //Creating a new User
    const newUser = new User({ username, email, password });
    await newUser.save();

    //Successfull answer
    res.status(201).json({ message: "User is created", userId: newUser._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    //Searching user by Email
    const user = await User.findOne({ email });
    console.log("req.body:", req.body);
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Compare the entered password with the hashed password
    const isMatch = await user.comparePassword(password);
    console.log("req.body:", req.body);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // JWT token generation
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    );
    res.status(200).json({ token, userId: user._id });
  } catch (error) {
    console.log(error);
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.model.js";
import { z } from "zod";

// Register validation schema with Zod
const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  name: z.string().min(3, "Name must be at least 3 characters").max(30, "Name must be less than or equal to 30 characters"),
  age: z.preprocess((value) => {
    // Convert value to a number, if possible
    const num = Number(value);
    return Number.isNaN(num) ? undefined : num;
  }, z.number().min(11, "Age must be at least 11").max(150, "Age must be less than or equal to 150")),
  email: z.string().email("Invalid email address"),
  password: z.string().min(4, "Password must be at least 4 characters"),
});

export const register = async (req, res) => {
  try {
    const { username, name, age, email, password } = registerSchema.parse(req.body);

    let user = await User.findOne({ email });
    if (user) return res.status(400).send("User already exists.");

    user = new User({ username, name, age, email, password });
    await user.save();

    const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: "30d" });
    res.cookie("token", token, { httpOnly: true });

    res.redirect(`/profile/${user.username}`);
  } catch (err) {
    res.status(400).send(err.message);
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(400).send("Invalid credentials");

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).send("Invalid credentials");

    const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: "30d" });
    res.cookie("token", token, { httpOnly: true });

    res.redirect(`/profile/${user.username}`);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

export const logout = (req, res) => {
  try {
    res.clearCookie("token");
    res.redirect("/login");
  } catch (error) {
    res.status(500).send(err.message);
  }
};

export const checkAuth = (req, res) => {
  const token = req.cookies.token;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const username = decoded.username;
      return res.redirect(`/profile/${username}`);
    } catch (error) {
      return res.status(400).json({ message: "Invalid token." });
    }
  }

  res.render("register");
};

export const checkLogin = (req, res) => {
  const token = req.cookies.token;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const username = decoded.username;
      return res.redirect(`/profile/${username}`);
    } catch (error) {
      return res.status(400).json({ message: "Invalid token." });
    }
  }

  res.render("login");
};
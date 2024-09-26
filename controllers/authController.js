import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.model.js";
import Notes from "../models/Notes.model.js";
import { nanoid } from "nanoid";
import Guest from "../models/Guest.model.js";
import { userRegisterSchema } from "../utils/zodValidation.js";

// registration logic
export const register = async (req, res) => {
  try {
    const { username, name, age, email, password } = userRegisterSchema.parse(req.body);

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).render("register", { error: "User already exists." });
    }

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).render("register", { error: "Username already taken. Please choose another one." });
    }

    user = new User({ username, name, age, email, password });
    await user.save();

    const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: "30d" });
    res.cookie("token", token, { httpOnly: true });

    res.redirect(`/profile/${user.username}`);
  } catch (err) {
    // Handle Zod validation errors or any other errors
    const errorMessage = err.errors ? err.errors.map((e) => e.message).join(", ") : err.message;
    res.status(400).render("register", { error: errorMessage || "Something went wrong. Please try again." });
  }
};

// registration check
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

  res.render("register", { error: "" });
};

// login route
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).render("login", { error: "Invalid user", email });
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(400).render("login", { error: "Invalid credentials", email });
    }

    const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: "30d" });
    res.cookie("token", token, { httpOnly: true });

    res.redirect(`/profile/${user.username}`);
  } catch (err) {
    res.status(500).render("error");
  }
};

// login check
export const checkLogin = (req, res) => {
  const token = req.cookies.token;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const username = decoded.username;
      return res.redirect(`/profile/${username}`);
    } catch (error) {
      return res.status(400).render("error", { error: "Invalid token. Please log in again." });
    }
  }

  res.render("login", { error: "" });
};

// logout
export const logout = async (req, res) => {
  try {
    if (req.user.role === "guest") {
      const { username } = req.user;
      const guestUser = await Guest.findOne({ username });
      if (guestUser) {
        await Guest.deleteOne({ username });
        await Notes.deleteMany({ user: guestUser._id });
      }
    }

    res.clearCookie("token");
    res.redirect("/login");
  } catch (error) {
    console.log(error);
    res.status(500).render("error");
  }
};

// guest sign-in
const GUEST_JWT_SECRET = process.env.GUEST_JWT_SECRET;

export const guestSignIn = async (req, res) => {
  try {
    const username = nanoid();
    const email = `${username}@guestmail.com`;
    const password = Math.random().toString(36).substring(2, 6);

    const guestUser = new Guest({
      username,
      email,
      password,
    });

    await guestUser.save();

    const token = jwt.sign({ id: guestUser._id, username: guestUser.username }, GUEST_JWT_SECRET, { expiresIn: "10m" });

    res.cookie("token", token, { httpOnly: true, maxAge: 10 * 60 * 1000 }); // 10 minutes

    res.redirect(`/profile/${username}`);
  } catch (err) {
    console.error("Error signing in as guest:", err);
    res.status(500).render("error");
  }
};

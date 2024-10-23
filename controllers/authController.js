import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.model.js";
import Notes from "../models/Notes.model.js";
import Guest from "../models/Guest.model.js";
import { nanoid } from "nanoid";
import { userRegisterSchema } from "../utils/zodValidation.js";

// to generate JWT tokens
const generateToken = (id, username, role, secret, expiresIn) => {
  return jwt.sign({ id, username, role }, secret, { expiresIn });
};

//  to set JWT cookie
const setTokenCookie = (res, token, maxAge) => {
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Ensure secure cookie in production
    maxAge,
  });
};

//  for token verification
const verifyToken = (token, role) => {
  const secretKey = role === "guest" ? process.env.GUEST_JWT_SECRET : process.env.JWT_SECRET;
  return jwt.verify(token, secretKey);
};

//  to find user by email or username
const findUser = async (email, username) => {
  if (email) return await User.findOne({ email });
  if (username) return await User.findOne({ username });
};

// Registration logic
export const register = async (req, res) => {
  try {
    const { username, name, age, email, password } = userRegisterSchema.parse(req.body);

    if (await findUser(email, username)) return res.status(400).render("register", { error: "User or Username already exists." });

    const user = new User({ username, name, age, email, password });
    await user.save();

    const token = generateToken(user._id, user.username, "user", process.env.JWT_SECRET, "30d");
    setTokenCookie(res, token, 30 * 24 * 60 * 60 * 1000); // 30 days

    return res.status(201).redirect(`/profile/${user.username}`);
  } catch (err) {
    const errorMessage = err.errors ? err.errors.map((e) => e.message).join(", ") : err.message;
    return res.status(400).render("register", { error: errorMessage || "Something went wrong. Please try again." });
  }
};

// Check if user is authenticated
export const checkAuth = (req, res) => {
  const token = req.cookies.token;
  if (token) {
    try {
      const decoded = jwt.decode(token);
      const verified = verifyToken(token, decoded.role);
      return res.redirect(`/profile/${verified.username}`);
    } catch (error) {
      return res.status(401).json({ message: "Invalid token." });
    }
  }
  res.status(200).render("register", { error: "" });
};

// Login logic
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await findUser(email);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).render("login", { error: "Invalid credentials", email });
    }

    // Update lastLogin field for the user
    user.lastLogin = Date.now();
    await user.save();

    const token = generateToken(user._id, user.username, "user", process.env.JWT_SECRET, "30d");
    setTokenCookie(res, token, 30 * 24 * 60 * 60 * 1000); // 30 days

    return res.status(200).redirect(`/profile/${user.username}`);
  } catch (err) {
    return res.status(500).render("error", { message: "Internal Server Error" });
  }
};

// Check if user is logged in
export const checkLogin = (req, res) => {
  const token = req.cookies.token;
  if (token) {
    try {
      const decoded = jwt.decode(token);
      const verified = verifyToken(token, decoded.role);
      return res.redirect(`/profile/${verified.username}`);
    } catch (error) {
      return res.status(401).render("error", { error: "Invalid token. Please log in again." });
    }
  }
  return res.status(200).render("login", { error: "" });
};

// Logout logic
export const logout = async (req, res) => {
  try {
    if (req.user.role === "guest") {
      const guestUser = await Guest.findOneAndDelete({ username: req.user.username });
      if (guestUser) await Notes.deleteMany({ user: guestUser._id });
    }

    res.clearCookie("token");
    return res.status(200).redirect("/login");
  } catch (error) {
    console.error(error);
    return res.status(500).render("error", { message: "Internal Server Error" });
  }
};

// Guest sign-in logic
export const guestSignIn = async (req, res) => {
  try {
    const username = nanoid();
    const email = `${username}@guestmail.com`;
    const password = Math.random().toString(36).substring(2, 6);

    const guestUser = new Guest({ username, email, password });
    await guestUser.save();

    const token = generateToken(guestUser._id, guestUser.username, "guest", process.env.GUEST_JWT_SECRET, "10m");
    setTokenCookie(res, token, 10 * 60 * 1000); // 10 minutes

    return res.status(201).redirect(`/profile/${guestUser.username}`);
  } catch (err) {
    console.error("Error signing in as guest:", err);
    return res.status(500).render("error", { message: "Internal Server Error" });
  }
};

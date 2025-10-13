import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.model.js";
import Guest from "../models/Guest.model.js";
import Notes from "../models/Notes.model.js";
import { nanoid } from "nanoid";
import { userRegisterSchema } from "../utils/zodValidation.js";

// Generate JWT tokens
const generateToken = (id, username, role, secret, expiresIn) => jwt.sign({ id, username, role }, secret, { expiresIn });

// Set JWT cookie securely
const setTokenCookie = (res, token, maxAge) => {
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge,
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
  });
};

// Verify token with secret depending on role
const verifyToken = (token, role) => {
  const secretKey = role === "guest" ? process.env.GUEST_JWT_SECRET : process.env.JWT_SECRET;
  return jwt.verify(token, secretKey);
};

// Find user by email or username
const findUser = async (email, username) => {
  if (email) return await User.findOne({ email });
  if (username) return await User.findOne({ username });
};

// Register new user
export const register = async (req, res) => {
  try {
    const { username, name, age, email, password } = userRegisterSchema.parse(req.body);

    if (await findUser(email, username)) {
      return res.status(400).json({ success: false, message: "User or Username already exists." });
    }

    const user = new User({ username, name, age, email, password });
    await user.save();

    const token = generateToken(user._id, user.username, "user", process.env.JWT_SECRET, "30d");
    setTokenCookie(res, token, 30 * 24 * 60 * 60 * 1000);

    res.status(201).json({ success: true, user: { id: user._id, username: user.username } });
  } catch (err) {
    const errorMessage = err.errors ? err.errors.map((e) => e.message).join(", ") : err.message;
    res.status(400).json({ success: false, message: errorMessage || "Something went wrong." });
  }
};

// Check if user is authenticated (returns user info if valid token)
export const checkAuth = async (req, res) => {
  const token = req.cookies?.token;
  if (!token) {
    return res.status(401).json({ success: false, message: "No token provided." });
  }

  try {
    // First decode to know which secret to verify with
    const decoded = jwt.decode(token);
    if (!decoded || !decoded.role || !decoded.id) {
      return res.status(401).json({ success: false, message: "Invalid token." });
    }

    // Verify signature with role-specific secret
    const verified = verifyToken(token, decoded.role);
    // verified contains: id, username, role

    // Load full user document based on role
    let doc = null;
    if (verified.role === "guest") doc = await Guest.findById(verified.id).lean();
    else doc = await User.findById(verified.id).lean();

    if (!doc) return res.status(401).json({ success: false, message: "Account not found." });

    // Normalize response fields
    const payload = {
      id: String(doc._id),
      username: doc.username,
      name: doc.name ?? null,
      email: doc.email ?? null,
      age: doc.age ?? null,
      role: verified.role,
    };

    return res.status(200).json({ success: true, user: payload });
  } catch (err) {
    return res.status(401).json({ success: false, message: "Invalid or expired token." });
  }
};

// User login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await findUser(email);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    user.lastLogin = Date.now();
    await user.save();

    const token = generateToken(user._id, user.username, "user", process.env.JWT_SECRET, "30d");
    setTokenCookie(res, token, 30 * 24 * 60 * 60 * 1000);

    res.status(200).json({ success: true, user: { id: user._id, username: user.username } });
  } catch (err) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Logout user
export const logout = async (req, res) => {
  try {
    if (req.user.role === "guest") {
      const guestUser = await Guest.findOneAndDelete({ username: req.user.username });
      if (guestUser) await Notes.deleteMany({ user: guestUser._id });
    }

    res.clearCookie("token");
    res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Guest sign-in creates temporary guest user
export const guestSignIn = async (req, res) => {
  try {
    const username = nanoid();
    const email = `${username}@guestmail.com`;
    const password = Math.random().toString(36).substring(2, 6);

    const guestUser = new Guest({ username, email, password });
    await guestUser.save();

    const token = generateToken(guestUser._id, guestUser.username, "guest", process.env.GUEST_JWT_SECRET, "10m");
    setTokenCookie(res, token, 10 * 60 * 1000);

    res.status(201).json({ success: true, user: { id: guestUser._id, username: guestUser.username } });
  } catch (err) {
    console.error("Error signing in as guest:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

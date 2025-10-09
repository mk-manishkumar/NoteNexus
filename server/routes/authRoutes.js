import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import { register, login, logout, checkAuth, guestSignIn } from "../controllers/authController.js";

const authRouter = express.Router();

// Route to handle redirection to profile page based on authentication status
authRouter.get("/check-auth", checkAuth);

// POST route for handling registration logic
authRouter.post("/register", register);

// POST route for handling login logic
authRouter.post("/login", login);

// Logout route
authRouter.post("/logout", authMiddleware, logout);

// guest signin
authRouter.post("/guest-signin", guestSignIn);

export default authRouter;

import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import { register, login, logout, checkAuth, checkLogin, guestSignIn } from "../controllers/authController.js";

const authRouter = express.Router();

// Route to handle redirection to profile page based on authentication status
authRouter.get("/", checkAuth);

// GET route to render the login page
authRouter.get("/login", checkLogin);

// POST route for handling registration logic
authRouter.post("/", register);

// POST route for handling login logic
authRouter.post("/login", login);

// Logout route
authRouter.post("/logout", authMiddleware, logout);

// guest signin
authRouter.get("/guest-signin", guestSignIn);

export default authRouter;

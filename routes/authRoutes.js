import express from "express";
import { register, login, logout, checkAuth, checkLogin } from "../controllers/authController.js";

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
authRouter.post("/logout", logout);

export default authRouter;

import express from "express";
import { register, login } from "../controllers/authController.js";

const authRouter = express.Router();

// GET route to render the registration page
authRouter.get("/", (req, res) => {
  res.render("register");
});

// GET route to render the login page
authRouter.get("/login", (req, res) => {
  res.render("login");
});

// POST route for handling registration logic
authRouter.post("/", register);

// POST route for handling login logic
authRouter.post("/login", login);

export default authRouter;

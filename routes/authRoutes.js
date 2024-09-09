import express from "express";
import { register, login } from "../controllers/authController.js";

const router = express.Router();

// GET route to render the registration page
router.get("/", (req, res) => {
  res.render("register"); 
});

// GET route to render the login page
router.get("/login", (req, res) => {
  res.render("login"); 
});

// POST route for handling registration logic
router.post("/", register);

// POST route for handling login logic
router.post("/login", login);

export default router;

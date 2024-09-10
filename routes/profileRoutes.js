import express from "express";
import User from "../models/User.model.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const profileRouter = express.Router();

profileRouter.get("/profile/:username", authMiddleware, async (req, res) => {
  try {
    const { username } = req.params;

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).send("User not found");
    }

    res.render("profile", { user });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

export default profileRouter;

import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import { displayProfile, displayEditProfile, updateProfile } from "../controllers/profileController.js";

const profileRouter = express.Router();

profileRouter.use(authMiddleware);

// to display profile page
profileRouter.get("/profile/:username", displayProfile);

// to display edit page
profileRouter.get("/edit/:username", displayEditProfile);

// to updated changes in profile
profileRouter.post("/profile/edit/:username", updateProfile);

export default profileRouter;

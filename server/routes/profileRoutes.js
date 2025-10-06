import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import { displayProfile, updateProfile, updatePassword, deleteProfile } from "../controllers/profileController.js";
import { guestRestrictions } from "../middlewares/guestRestrictions.js";

const profileRouter = express.Router();

profileRouter.use(authMiddleware);
profileRouter.use(guestRestrictions);

// to display profile page
profileRouter.get("/:username", displayProfile);

// to updated changes in profile
profileRouter.put("/edit/:username", updateProfile);

// to update password
profileRouter.put("/:username/change-password", updatePassword);

// to delete the profile
profileRouter.delete("/:username/delete-profile", deleteProfile);

export default profileRouter;

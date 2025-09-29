import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import { displayProfile, displayEditProfile, updateProfile, changePassword, updatePassword, getDeletePage, deleteProfile } from "../controllers/profileController.js";
import { guestRestrictions } from "../middlewares/guestRestrictions.js";

const profileRouter = express.Router();

profileRouter.use(authMiddleware);
profileRouter.use(guestRestrictions);

// to display profile page
profileRouter.get("/:username", displayProfile);

// to display edit page
profileRouter.get("/edit/:username", displayEditProfile);

// to updated changes in profile
profileRouter.put("/edit/:username", updateProfile);

// to display change password page
profileRouter.get("/:username/change-password", changePassword);

// to update password
profileRouter.post("/:username/update-password", updatePassword);

// to display delete profile page
profileRouter.get("/:username/delete-profile", getDeletePage);

// to delete the profile
profileRouter.post("/:username/delete-profile", deleteProfile);

export default profileRouter;

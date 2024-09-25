import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import { displayProfile, displayEditProfile, updateProfile, changePassword, updatePassword, getDeletePage, deleteProfile } from "../controllers/profileController.js";
import { guestRestrictions } from "../middlewares/guestRestrictions.js";

const profileRouter = express.Router();

profileRouter.use(authMiddleware);

// to display profile page
profileRouter.get("/:username", displayProfile);

// to display edit page
profileRouter.get("/edit/:username", guestRestrictions, displayEditProfile);

// to updated changes in profile
profileRouter.post("/edit/:username", guestRestrictions, updateProfile);

// to display change password page
profileRouter.get("/:username/change-password", guestRestrictions, changePassword);

// to update password
profileRouter.post("/:username/update-password", guestRestrictions, updatePassword);

// to display delete profile page
profileRouter.get("/:username/delete-profile", guestRestrictions, getDeletePage);

// to delete the profile
profileRouter.post("/:username/delete-profile", guestRestrictions, deleteProfile);

export default profileRouter;

import User from "../models/User.model.js";
import Guest from "../models/Guest.model.js";
import Notes from "../models/Notes.model.js";
import bcrypt from "bcrypt";
import { userUpdateSchema } from "../utils/zodValidation.js";

// Get user profile
export const displayProfile = async (req, res) => {
  try {
    const { username } = req.params;
    const user = req.user.role === "guest" ? await Guest.findOne({ username }) : await User.findOne({ username });

    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    res.status(200).json({ success: true, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to fetch profile" });
  }
};

// Get user profile for editing
export const displayEditProfile = async (req, res) => {
  try {
    const { username } = req.params;
    const user = req.user.role === "guest" ? await Guest.findOne({ username }) : await User.findOne({ username });

    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    // Send guestMode flag for frontend if needed
    res.status(200).json({ success: true, user, guestMode: req.user.role === "guest" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to fetch profile for editing" });
  }
};

// Update user profile
export const updateProfile = async (req, res) => {
  try {
    const { username: oldUsername } = req.params;
    const { username: newUsername, age, name, email } = req.body;

    const validation = userUpdateSchema.safeParse({ username: newUsername, age, name, email });
    if (!validation.success) {
      const errors = validation.error.errors.map((err) => err.message).join(", ");
      return res.status(400).json({ success: false, message: errors });
    }

    const updatedUser = await User.findOneAndUpdate({ username: oldUsername }, { username: newUsername, age, name, email }, { new: true });

    if (!updatedUser) return res.status(404).json({ success: false, message: "User not found" });

    res.status(200).json({ success: true, message: "Profile updated", user: updatedUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to update profile" });
  }
};

// Display change password page (can be combined with profile display)
export const changePassword = async (req, res) => {
  try {
    const { username } = req.params;
    const user = req.user.role === "guest" ? await Guest.findOne({ username }) : await User.findOne({ username });

    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    res.status(200).json({ success: true, user, guestMode: req.user.role === "guest" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to fetch user for password change" });
  }
};

// Update password
export const updatePassword = async (req, res) => {
  try {
    const { username } = req.params;
    const { oldPassword, newPassword } = req.body;

    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    if (newPassword.length < 4) {
      return res.status(400).json({ success: false, message: "Password must be at least 4 characters." });
    }
    if (oldPassword === newPassword) {
      return res.status(400).json({ success: false, message: "Your old and new password is same." });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Old password is incorrect" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.clearCookie("token");

    res.status(200).json({ success: true, message: "Password updated, please login again." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to update password" });
  }
};

// Get user delete confirmation data
export const getDeletePage = async (req, res) => {
  try {
    const { username } = req.params;
    const user = req.user.role === "guest" ? await Guest.findOne({ username }) : await User.findOne({ username });

    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    res.status(200).json({ success: true, user, guestMode: req.user.role === "guest" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to fetch user for deletion" });
  }
};

// Delete user profile
export const deleteProfile = async (req, res) => {
  try {
    const { username } = req.params;
    const { password } = req.body;

    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ success: false, message: "User not found." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ success: false, message: "Password is incorrect." });

    await Notes.deleteMany({ user: user._id });
    await User.findOneAndDelete({ username });

    res.clearCookie("token");

    res.status(200).json({ success: true, message: "User deleted successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to delete user" });
  }
};

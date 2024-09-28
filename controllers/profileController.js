import User from "../models/User.model.js";
import Guest from "../models/Guest.model.js";
import Notes from "../models/Notes.model.js";
import bcrypt from "bcrypt";
import { userUpdateSchema } from "../utils/zodValidation.js";

export const displayProfile = async (req, res) => {
  try {
    const { username } = req.params;

    const user = req.user.role === "guest" ? await Guest.findOne({ username }) : await User.findOne({ username });

    if (!user) return res.status(404).render("error");

    res.status(200).render("profile", { user, error: "" });
  } catch (err) {
    console.error(err);
    res.status(500).render("error");
  }
};

export const displayEditProfile = async (req, res) => {
  try {
    const { username } = req.params;

    const user = req.user.role === "guest" ? await Guest.findOne({ username }) : await User.findOne({ username });

    if (!user) return res.status(404).send("User not found");

    const guestMode = req.user.role === "guest";

    res.status(200).render("editProfile", { user, guestMode, error: "" });
  } catch (err) {
    console.error(err);
    res.status(500).render("error");
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { username: oldUsername } = req.params;
    const { username: newUsername, age, name, email } = req.body;

    const validation = userUpdateSchema.safeParse({ username: newUsername, age, name, email });
    if (!validation.success) {
      const errors = validation.error.errors.map((err) => err.message).join(", ");
      return res.status(400).render("editProfile", { user: req.user, error: errors });
    }

    await User.findOneAndUpdate({ username: oldUsername }, { username: newUsername, age, name, email }, { new: true });

    res.status(200).redirect(`/profile/${newUsername}`);
  } catch (err) {
    console.error(err);
    res.status(500).render("error");
  }
};

export const changePassword = async (req, res) => {
  try {
    const { username } = req.params;

    const user = req.user.role === "guest" ? await Guest.findOne({ username }) : await User.findOne({ username });

    if (!user) return res.status(404).send("User not found");

    const guestMode = req.user.role === "guest";

    res.status(200).render("changePassword", { user, guestMode, error: "" });
  } catch (err) {
    console.error(err);
    res.status(500).render("error");
  }
};

export const updatePassword = async (req, res) => {
  try {
    const { username } = req.params;
    const { oldPassword, newPassword } = req.body;

    const user = await User.findOne({ username });

    if (newPassword.length < 4) return res.status(400).render("changePassword", { error: "Password must be at least 4 characters.", user });

    if (oldPassword === newPassword) return res.status(400).render("changePassword", { error: "Your old and new password is same.", user });

    // Check if the old password is correct
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(400).render("changePassword", { error: "Old password is incorrect", user });

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update the user's password
    user.password = hashedPassword;

    await user.save();

    res.clearCookie("token");

    res.status(200).redirect(`/login`);
  } catch (err) {
    console.error(err);
    res.status(500).render("error");
  }
};

// to display delete page
export const getDeletePage = async (req, res) => {
  try {
    const { username } = req.params;

    const user = req.user.role === "guest" ? await Guest.findOne({ username }) : await User.findOne({ username });

    if (!user) return res.status(404).send("User not found");

    const guestMode = req.user.role === "guest";

    res.status(200).render("deleteProfile", { user, guestMode, error: "" });
  } catch (err) {
    console.error(err);
    res.status(500).render("error");
  }
};

export const deleteProfile = async (req, res) => {
  try {
    const { username } = req.params;
    const { password } = req.body;

    const user = await User.findOne({ username });

    if (!user) return res.status(404).render("deleteProfile", { error: "User not found.", user });

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) return res.status(400).render("deleteProfile", { error: "Password is incorrect.", user });

    await Notes.deleteMany({ user: user._id });

    await User.findOneAndDelete({ username });

    res.clearCookie("token");
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.status(500).render("error");
  }
};

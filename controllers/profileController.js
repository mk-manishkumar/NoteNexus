import User from "../models/User.model.js";
import bcrypt from "bcrypt";

export const displayProfile = async (req, res) => {
  try {
    const { username } = req.params;

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).send("User not found");
    }

    res.render("profile", { user });
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
};

export const displayEditProfile = async (req, res) => {
  try {
    const { username } = req.params;

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).send("User not found");
    }

    res.render("editProfile", { user });
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { username: oldUsername } = req.params;
    const { username: newUsername, age, name, email } = req.body;

    await User.findOneAndUpdate({ username: oldUsername }, { username: newUsername, age, name, email }, { new: true });

    res.redirect(`/profile/${newUsername}`);
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
};

export const changePassword = async (req, res) => {
  try {
    const { username } = req.params;

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).send("User not found");
    }

    res.render("changePassword", { user });
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
};

export const updatePassword = async (req, res) => {
  try {
    const { username } = req.params;
    const { oldPassword, newPassword } = req.body;

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).send("User not found");
    }

    // Check if the old password is correct
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).send("Old password is incorrect");
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update the user's password
    user.password = hashedPassword;

    let match = await bcrypt.compare(newPassword, user.password);
    console.log(match);
    console.log(hashedPassword);
    console.log(user.password);

    await user.save();
    console.log(user.password);

    res.clearCookie("token");

    res.redirect(`/login`);
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
};

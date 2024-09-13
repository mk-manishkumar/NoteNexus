import User from "../models/User.model.js";

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
    const { username } = req.params;
    const { age, name, email } = req.body;

    

    await User.findOneAndUpdate({ username, age, name, email });
    console.log(username, age, name, email);

    res.redirect(`/profile/${username}`);
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
};

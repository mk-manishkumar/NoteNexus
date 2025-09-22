import Guest from "../models/Guest.model.js";
import User from "../models/User.model.js";

export const getUserForRole = async (role, username) => {
  return role === "guest" ? await Guest.findOne({ username }) : await User.findOne({ username });
};

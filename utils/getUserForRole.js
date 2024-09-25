import Guest from "../models/Guest.model.js";
import User from "../models/User.model.js";

export const getUserForRole = async (role, username) => {
  if (role === "guest") {
    return await Guest.findOne({ username });
  } else {
    return await User.findOne({ username });
  }
};

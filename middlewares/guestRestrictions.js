export const guestRestrictions = (req, res, next) => {
  if (req.user && req.user.role === "guest") {
    res.locals.guestMode = true; // Make guestMode available in all EJS templates
  } else {
    res.locals.guestMode = false; // Explicitly set false for non-guest users
  }
  next();
};

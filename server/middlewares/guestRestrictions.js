export const guestRestrictions = (req, res, next) => {
  if (req.user && req.user.role === "guest") {
    req.guestMode = true; 
  } else {
    req.guestMode = false;
  }
  next();
};

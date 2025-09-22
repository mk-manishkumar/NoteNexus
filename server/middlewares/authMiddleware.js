import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) return res.status(401).json({ message: "Access denied. No token provided." });

  try {
    let decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; 
    return next();
  } catch (err) {
    try {
      let decodedGuest = jwt.verify(token, process.env.GUEST_JWT_SECRET);
      req.user = decodedGuest;
      req.user.role = "guest";
      return next();
    } catch (guestError) {
      return res.status(400).json({ message: "Invalid token." });
    }
  }
};

export default authMiddleware;

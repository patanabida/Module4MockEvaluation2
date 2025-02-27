const jwt = require("jsonwebtoken");
require("dotenv").config();

const authMiddlewareToken = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }
  
    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Invalid token" });
      }
      req.user = decoded;
      next();
    });
};
const authorizeAdmin = (req,res,next)=>{
    if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Access denied, admin only" });
      }
      next();
};

module.exports = {authMiddlewareToken, authorizeAdmin};

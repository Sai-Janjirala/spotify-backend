const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");

const JWT_SECRET = process.env.JWT_SECRET || "dev_jwt_secret_change_me";

async function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  const tokenFromHeader = authHeader
    ? authHeader.toLowerCase().startsWith("bearer ")
      ? authHeader.split(" ")[1]
      : authHeader
    : null;
  const token = tokenFromHeader || req.cookies?.token;

  if (!token) {
    return res.status(401).json({ message: "not authorised" });
  }

  let decoded;
  try {
    decoded = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return res.status(401).json({ message: "invalid token" });
  }

  const tokenUserId = decoded.id || decoded._id || decoded.userId;
  if (!tokenUserId) {
    return res.status(401).json({ message: "invalid token payload" });
  }

  const user = await userModel.findById(tokenUserId).select("-password");
  if (!user) {
    return res.status(401).json({ message: "user not found" });
  }

  req.user = user;
  return next();
}

function requireArtist(req, res, next) {
  if (req.user?.role !== "artist") {
    return res.status(403).json({ message: "only artists can upload music" });
  }
  return next();
}

async function authUser(req, res, next) {
  const token = req.cookies?.token;
  if (!token) {
    return res.status(401).json({ message: "not authorised" });
  }
  let decoded;
  try {
    decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== "user") {
      return res.status(401).json({ message: "u don't have accesss" });
    }
    req.user = decoded;
    return next();
  } catch (err) {
    return res.status(401).json({ message: "invalid token" });
  }
}
module.exports = { requireAuth, requireArtist, authUser };

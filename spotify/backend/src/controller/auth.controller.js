const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const JWT_SECRET = process.env.JWT_SECRET || "dev_jwt_secret_change_me";


async function registerUser(req, res) {
  const { username, email, password, role } = req.body;
  const normalizedUsername = String(username || "").trim();
  const normalizedEmail = String(email || "").trim().toLowerCase();
  const normalizedRole = role === "artist" ? "artist" : "user";

  if (!normalizedUsername || !normalizedEmail || !password) {
    return res.status(400).json({
      message: "username, email and password are required",
    });
  }

  const existingUser = await userModel.findOne({
    $or: [{ username: normalizedUsername }, { email: normalizedEmail }],
  });
  if (existingUser) {
    return res
      .status(400)
      .json({ message: "Username or email already exists" });
  }

  const hash = await bcrypt.hash(password, 10);

  const user = await userModel.create({
    username: normalizedUsername,
    email: normalizedEmail,
    password : hash,
    role: normalizedRole,
  });

  const token = jwt.sign(
    { id: user._id, role: user.role },
    JWT_SECRET,
  );
  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
  });
  res.status(201).json({
    message: "User registered successfully",
    token,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    },
  });
}

async function loginUser (req,res){
  const { username, email, password } = req.body;

  if ((!username && !email) || !password) {
    return res.status(400).json({
      message: "username/email and password are required",
    });
  }

  const identifierQuery = [];
  if (username) identifierQuery.push({ username: String(username).trim() });
  if (email) identifierQuery.push({ email: String(email).trim().toLowerCase() });

  const user = await userModel.findOne({
    $or: identifierQuery,
  });
  if(!user){
    return res.status(400).json({message : "Invalid credentials"})
  }

  let isPassValid = false;
  if (user.password?.startsWith("$2a$") || user.password?.startsWith("$2b$")) {
    isPassValid = await bcrypt.compare(password, user.password);
  } else {
    // Support older plain-text passwords already stored in DB.
    isPassValid = password === user.password;
    if (isPassValid) {
      user.password = await bcrypt.hash(password, 10);
      await user.save();
    }
  }

  if(!isPassValid){
    return res.status(400).json({message : "Invalid credentials"})
  }
  const token = jwt.sign({
    id: user._id,
    role: user.role
  }, JWT_SECRET);
  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
  });

  res.status(200).json({
    message : "Login successful",
    token,
    user : {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role
    }
  })
}

async function logoutUser(req, res) {
  res.clearCookie("token");
  res.status(200).json({ message: "Logout successful" });
}

module.exports = {registerUser, loginUser, logoutUser}

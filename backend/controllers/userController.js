import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";
import userModel from "../models/userModel.js";
const TOKEN_EXPIRY = "12h";

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ success: false, message: "Email and password required" });

  try {
    const user = await userModel.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid user or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid user or password" });
    }

    const token = createToken(user._id);
    res.json({ success: true, token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ success: false, message: "All fields required" });

  if (!validator.isEmail(email))
    return res.status(400).json({ success: false, message: "Invalid email" });
  if (password.length < 8)
    return res.status(400).json({ success: false, message: "Password must be at least 8 characters" });

  try {
    const exists = await userModel.findOne({ email });
    if (exists) {
      return res.status(409).json({ success: false, message: "User already exists" });
    }

    // hashing user password
    const salt = await bcrypt.genSalt(10); // the more no. round the more time it will take
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({ name, email, password: hashedPassword });
    const user = await newUser.save();

    const token = createToken(user._id);
    res.status(201).json({ success: true, token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (error) {
    console.log(error);
    // handle duplicate key error (race)
    if (error.code === 11000){
      return res.status(409).json({ success: false, message: "Email already in use" });
    }
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export { loginUser, registerUser };

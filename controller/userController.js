import User from "../model/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";



export async function createUserController(req, res) {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All Fields are required" });
  }

  const checkUser = await User.findOne({ email });
  if (checkUser) {
    return res.status(400).json({ message: "User with this email already exists" });
  }

  const encryptPassword = await bcrypt.hash(password, 10);

  const user = new User({
    name,
    email,
    password: encryptPassword,
  });

  await user.save();

  res.status(201).json({
    message: "User Created",
    user,
  });
}

export async function loginHandleController(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "All Fields are required" });
  }

  const checkUser = await User.findOne({ email }).select("+password");
  if (!checkUser) {
    return res.status(400).json({ message: "User with this email does not exist" });
  }

  const comparePassword = await bcrypt.compare(password, checkUser.password);
  if (!comparePassword) {
    return res.status(400).json({ message: "Invalid Credentials" });
  }

  const token = jwt.sign(
    { id: checkUser._id, role: checkUser.role },
    process.env.AUTH_SECRET_KEY,
    { expiresIn: "1h" }
  );

  res.status(200).json({
    message: "Login Successful",
    accessToken: token,
  });
}

export async function getUserListController(req, res) {
  const userList = await User.find();

  res.status(200).json({
    message: "User List",
    users: userList,
  });
}

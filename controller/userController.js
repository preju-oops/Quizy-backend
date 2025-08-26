const User = require("../model/userModel");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const Profile = require("../model/ProfileModel");

async function createUserController(req, res) {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;

  if (!name || !email || !password) {
    return res.status(400).json({
      message: "All Fields are required",
    });
  }

  const checkUser = await User.findOne({ email });
  if (checkUser) {
    return res.status(400).json({
      message: "User with this email already exists",
    });
  }

  const encryptPassword = await bcrypt.hash(password, 10);

  const data = {
    name,
    email,
    password: encryptPassword,
  };

  const user = new User(data);
  await user.save();

  const profileData = {
    user: user?._id,
    bio: "",
    profilePicture: "",
    skills: [],
    github: "",
    linkedin: "",
    portfolioUrl: "",
  };
  const profile = new Profile(profileData);
  await profile.save();

  res.status(201).json({
    message: "User Created",
    user: user,
  });
}

async function loginHandleController(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "All Fields are required",
    });
  }

  const checkUser = await User.findOne({ email }).select("+password");
  if (!checkUser) {
    return res.status(400).json({
      message: "User with this email does not exist",
    });
  }

  const comparePassword = await bcrypt.compare(password, checkUser.password);
  if (comparePassword) {
    const token = jwt.sign(
      {
        id: checkUser._id,
        role: checkUser.role,
      },
      process.env.AUTH_SECRET_KEY,
      {
        expiresIn: "1h",
      }
    );

    res.status(200).json({
      message: "Login Successful",
      accessToken: token,
    });
  } else {
    return res.status(400).json({
      message: "Invalid Credentials",
    });
  }
}

async function getUserListController(req, res) {
  const userList = await User.find();

  res.status(200).json({
    message: "User List",
    users: userList,
  });
}

async function updateProfileMeController(req, res) {}

async function viewMyProfileController(req, res) {
  const { id } = req.user;

  // same logic
}

async function viewProfileofUserController(req, res) {
  const { id } = req.params;

  // same logic
}

module.exports = {
  createUserController,
  loginHandleController,
  getUserListController,
  updateProfileMeController,
  viewMyProfileController,
  viewProfileofUserController,
};
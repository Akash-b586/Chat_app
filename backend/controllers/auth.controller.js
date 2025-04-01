import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/genToken.js";
import {
  validateRegisterUser,
  validateLoginUser,
  validateUpdateUser,
} from "../../shared/userValidation.js";
import expressAsyncHandler from "express-async-handler";
import handleError from "../utils/handleError.js";
import cloudinary from "../utils/cloudinary.js";

export const signup = expressAsyncHandler(async (req, res) => {
  const { email, username, password, confirmPassword, gender } = req.body;

  //validate user data
  const { error } = validateRegisterUser(req.body);

  if (error) {
    const errors = error.details.map((err) => err.message);
    handleError(res, 400, errors);
  }

  const user = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (user) {
    const field = user.email === email ? "Email" : "Username";
    handleError(res, 400, `${field} already exists.`);
  }

  //password hashing
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  //Profile picture URL - it will make unique profile picture based on username
  const genderAvatars = {
    male: `https://avatar.iran.liara.run/public/boy?username=${username}`,
    female: `https://avatar.iran.liara.run/public/girl?username=${username}`,
  };

  const profilePicture = genderAvatars[gender];

  const newUser = new User({
    email,
    username,
    password: hashedPassword,
    gender,
    profilePicture,
  });

  //save user
  if (newUser) {
    await newUser.save();
    //jwt signature
    generateToken(newUser._id, res);
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        _id: newUser._id,
        email: newUser.email,
        username: newUser.username,
        profilePicture: newUser.profilePicture,
        friends: newUser.friends,
      },
    });
  } else handleError(res, 400, "User registration failed");
});
export const login = expressAsyncHandler(async (req, res) => {
  const { email, password } = req.body;

  //validate user data
  const { error } = validateLoginUser(req.body);

  if (error) {
    const errors = error.details.map((err) => err.message);
    handleError(res, 400, errors);
  }

  const user = await User.findOne({ email }).populate(
    "friends",
    "username profilePicture"
  );

  if (!user || !(await bcrypt.compare(password, user.password)))
    handleError(res, 400, "Invalid credentials");

  //jwt signature
  generateToken(user._id, res);
  res.status(200).json({
    success: true,
    message: "User logged in successfully",
    user: {
      _id: user._id,
      email: user.email,
      username: user.username,
      profilePicture: user.profilePicture,
      friends: user.friends,
    },
  });
});

export const logout = (req, res) => {
  try {
    res.clearCookie("token", {});
    res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    console.error("Error during logout:", error);
    handleError(res, 500, "Internal server error");
  }
};

export const auth = expressAsyncHandler(async (req, res) => {
  res.status(200).json(req.user);
});

export const updateProfile = expressAsyncHandler(async (req, res) => {
  const { error } = validateUpdateUser(req.body);
  if (error) {
    const errors = error.details.map((err) => err.message);
    handleError(res, 400, errors);
  }
  const { email, username, profilePicture, oldPassword, newPassword, gender } =
    req.body;

  if ((oldPassword && !newPassword) || (newPassword && !oldPassword)) {
    handleError(res, 400, "Both current and new passwords are required.");
  }

  // Find the user
  const user = await User.findById(req.user._id);
  if (!user) handleError(res, 404, "User not found");

  // Check if email is being updated and ensure uniqueness
  if (email && email !== user.email) {
    const emailExists = await User.findOne({ email });
    if (emailExists) handleError(res, 400, "Email already in use.");
    user.email = email;
  }

  // Check if username is being updated and ensure uniqueness
  if (username && username !== user.username) {
    const usernameExists = await User.findOne({ username });
    if (usernameExists) handleError(res, 400, "Username already in use.");
    user.username = username;
  }

  // Handle profile picture update
  if (profilePicture) {
    try {
      const uploadedResponse = await cloudinary.uploader.upload(profilePicture);
      user.profilePicture = uploadedResponse.secure_url;
    } catch (err) {
      handleError(res, 500, "Failed to upload profile picture.");
    }
  }

  if (gender) user.gender = gender;

  // Handle password update
  if (newPassword) {
    const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordMatch) handleError(res, 400, "Invalid current password.");

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
  }

  await user.save();

  res.status(200).json({
    success: true,
    message: "Profile updated successfully.",
    user: {
      _id: user._id,
      email: user.email,
      username: user.username,
      profilePicture: user.profilePicture,
      gender: user.gender,
      friends: user.friends,
    },
  });
});

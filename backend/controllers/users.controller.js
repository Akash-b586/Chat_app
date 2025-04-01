import expressAsyncHandler from "express-async-handler";
import User from "../models/user.model.js";
import handleError from "../utils/handleError.js";
import FriendRequest from "../models/friendRequest.model.js";

// Get all users who aren't friends and haven't sent a friend request
export const getUsers = expressAsyncHandler(async (req, res) => {
  const loggedUserId = req.user._id;

  // Get all friends of the logged-in user
  const user = await User.findById(loggedUserId).select("friends");
  const friends = user.friends;

  // Get all users who have sent a friend request to the logged-in user
  const friendRequests = await FriendRequest.find({
    receiver: loggedUserId,
    status: "pending",
  }).select("sender");

  const requestSenders = friendRequests.map((request) => request.sender);

  // Get all users who aren't friends and haven't sent a friend request
  const nonFriends = await User.find({
    _id: { $ne: loggedUserId, $nin: [...friends, ...requestSenders] },
  }).select("username profilePicture id");

  res.status(200).json({
    success: true,
    users: nonFriends,
  });
});

// Get a user by ID
export const getUser = expressAsyncHandler(async (req, res) => {
  const userId = req.params.userId;
  const user = await User.findById(userId)
    .select("-password")
    .populate({ friends: "username profilePicture" });

  if (!user) handleError(res, 404, "User not found.");

  res.status(200).json({ success: true, user });
});

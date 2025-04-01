import User from "../models/user.model.js";
import FriendRequest from "../models/friendRequest.model.js";
import expressAsyncHandler from "express-async-handler";
import handleError from "../utils/handleError.js";

// Find request and check permission
const requestAndPermission = async (requestId, userId, role, res) => {
  const request = await FriendRequest.findById(requestId);
  if (!request) handleError(res, 404, "Request not found.");
  if (request[role].toString() !== userId.toString())
    handleError(res, 403, "Unauthorized.");
  return request;
};

// Send friend request
export const sendFriendRequest = expressAsyncHandler(async (req, res) => {
  const senderId = req.user._id;
  const receiverId = req.params.userId;

  if (senderId === receiverId)
    handleError(res, 400, "Sender and receiver cannot be the same.");

  // Check if receiver exists
  const receiver = await User.findById(receiverId);
  if (!receiver) handleError(res, 404, "User not found.");

  // Check if receiver is the sender
  if (receiver.friends.includes(senderId))
    handleError(res, 400, "Already friends.");

  // Check if request already sent
  const existingRequest = await FriendRequest.findOne({
    sender: senderId,
    receiver: receiverId,
    status: "pending",
  });

  if (existingRequest) handleError(res, 400, "Request already sent.");

  // Create new request
  const friendRequest = await FriendRequest.create({
    sender: senderId,
    receiver: receiverId,
  });

  res.status(201).json({ success: true, message: "Friend request sent." });
});

// Accept friend request
export const acceptFriendRequest = expressAsyncHandler(async (req, res) => {
  const requestId = req.params.requestId;
  const userId = req.user._id;

  const request = await requestAndPermission(
    requestId,
    userId,
    "receiver",
    res
  );

  if (request.status == "pending") {
    request.status = "accepted";
    await Promise.all([
      request.save(),
      User.findByIdAndUpdate(request.sender, {
        $addToSet: { friends: request.receiver },
      }),
      User.findByIdAndUpdate(request.receiver, {
        $addToSet: { friends: request.sender },
      }),
    ]);

    res
      .status(200)
      .json({ success: true, message: "Friend request accepted." });
  }
});

// Reject friend request
export const rejectFriendRequest = expressAsyncHandler(async (req, res) => {
  const requestId = req.params.requestId;
  const userId = req.user._id;

  const request = await requestAndPermission(
    requestId,
    userId,
    "receiver",
    res
  );

  if (request.status == "pending") {
    request.status = "rejected";
    await request.save();
    res
      .status(200)
      .json({ success: true, message: "Friend request rejected." });
  }
});

// Cancel a friend request
export const cancelFriendRequest = expressAsyncHandler(async (req, res) => {
  const requestId = req.params.requestId;
  const userId = req.user._id;

  const request = await requestAndPermission(requestId, userId, "sender", res);

  if (request.status == "pending") {
    await request.deleteOne();
    res
      .status(200)
      .json({ success: true, message: "Friend request cancelled." });
  }
});

// Get all pending requests for the user and populate the sender field
export const getPendingRequests = expressAsyncHandler(async (req, res) => {
  const userId = req.user._id;

  const requests = await FriendRequest.find({
    receiver: userId,
    status: "pending",
  }).populate("sender", "username profilePicture");

  res.status(200).json({ success: true, requests });
});

// Delete a friend
export const deleteFriend = expressAsyncHandler(async (req, res) => {
  const userId = req.user._id;
  const friendId = req.params.friendId;

  const friend = await User.findById(friendId);
  if (!friend) handleError(res, 404, "Friend not found.");

  const isFriend = friend.friends.includes(userId);
  if (!isFriend) handleError(res, 400, "You are not friends with this user.");

  await Promise.all([
    User.findByIdAndUpdate(userId, { $pull: { friends: friendId } }),
    User.findByIdAndUpdate(friendId, { $pull: { friends: userId } }),
  ]);
  res.status(200).json({ success: true, message: "Friend deleted." });
});

// Get all sent requests for the user and populate the receiver field
export const getSentRequests = expressAsyncHandler(async (req, res) => {
  const userId = req.user._id;

  const requests = await FriendRequest.find({
    sender: userId,
    status: "pending",
  })
    .select("receiver")
    .populate("receiver", "username");

  res.status(200).json({ success: true, requests });
});

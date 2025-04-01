import express from "express";
import protect from "../middleware/auth.middleware.js";
import {
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  getPendingRequests,
  cancelFriendRequest,
  deleteFriend,
  getSentRequests,
} from "../controllers/friends.controller.js";

const router = express.Router();

router.post("/send/:userId", protect, sendFriendRequest);
router.post("/accept/:requestId", protect, acceptFriendRequest);
router.post("/reject/:requestId", protect, rejectFriendRequest);
router.get("/pending", protect, getPendingRequests);
router.get("/sent", protect, getSentRequests);
router.delete("/cancel/:requestId", protect, cancelFriendRequest);
router.delete("/remove/:friendId", protect, deleteFriend);

export default router;

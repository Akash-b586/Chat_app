import express from "express";
import protect from "../middleware/auth.middleware.js";
import {
  getConversations,
  createConversation,
  updateConversation,
  deleteConversation,
  addParticipantToGroup,
  removeParticipantFromGroup,
  addAdminToGroup,
  removeAdminFromGroup,
  leaveGroup,
  muteConversation,
  unmuteConversation,
} from "../controllers/conversations.controller.js";

const router = express.Router();

router.use(protect);

// GET routes
router.get("/", protect, getConversations);

// POST routes
router.post("/", createConversation);
router.post("/:conversationId/participants", addParticipantToGroup);
router.post("/:conversationId/admins", addAdminToGroup);

// PATCH routes
router.patch("/:conversationId", updateConversation); // Update conversation details (name, avatar, etc.)
router.patch("/:conversationId/mute", muteConversation);
router.patch("/:conversationId/unmute", unmuteConversation);

// DELETE routes
router.delete("/:conversationId", deleteConversation);
router.delete(
  "/:conversationId/participants/:userId",
  removeParticipantFromGroup
);
router.delete("/:conversationId/admins/:userId", removeAdminFromGroup);
router.delete("/:conversationId/leave", leaveGroup);

export default router;

import express from "express";
import protect from "../middleware/auth.middleware.js";
import {
  getMessages,
  sendMessage,
  editMessage,
  deleteMessage,
  replyToMessage,
  // searchMessages,
  pinMessage,
  unPinMessage,
} from "../controllers/message.controller.js";

const router = express.Router();

// Apply auth middleware to all routes
router.use(protect);

// GET routes
// router.get("/search", searchMessages);
router.get("/:conversationId", getMessages);

// POST routes
router.post(":conversationId", sendMessage);
router.post("/:messageId/reply", replyToMessage);

// PATCH routes
router.patch("/:messageId/edit", editMessage);
router.patch("/:messageId/pin", pinMessage);
router.patch("/:messageId/unpin", unPinMessage);

// DELETE routes
router.delete("/:messageId", deleteMessage);

export default router;

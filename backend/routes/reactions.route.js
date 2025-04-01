import express from "express";
import protect from "../middleware/auth.middleware.js";
import {
  getReactions,
  addReaction,
  removeReaction,
} from "../controllers/reactions.controller.js";

const router = express.Router();

router.get("/message/:messageId", protect, getReactions);
router.post("/add/:messageId", protect, addReaction);
router.delete("/remove/:reactionId", protect, removeReaction);

export default router;

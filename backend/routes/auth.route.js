import express from "express";
import protect from "../middleware/auth.middleware.js";
import {
  login,
  logout,
  signup,
  auth,
  updateProfile,
} from "../controllers/auth.controller.js";

export const router = express.Router();

router.get("/user", protect, auth);
router.patch("/update", protect, updateProfile);
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

export default router;

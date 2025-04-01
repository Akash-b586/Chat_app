import expressAsyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import handleError from "../utils/handleError.js";

const protect = expressAsyncHandler(async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) handleError(res, 401, "Unauthorized - No token provided");

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  if (!decoded) handleError(res, 401, "Unauthorized - Invalid token");

  const user = await User.findById(decoded.userId)
    .select("-password")
    .populate("friends", "_id username profilePicture");
  if (!user) handleError(res, 401, "Unauthorized - No user found");
  req.user = user;

  next();
});

export default protect;

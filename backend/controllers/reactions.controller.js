import Reaction from "../models/reaction.model";
import handleError from "../utils/handleError";
import expressAsyncHandler from "express-async-handler";
import { validateReaction } from "../../shared/reactionValidation";

export const addReaction = expressAsyncHandler(async (req, res) => {
  const messageId = req.params.messageId;
  const { reaction } = req.body;

  const { error } = validateReaction({ reaction });
  if (error) handleError(400, error.details[0].message, res);

  const newReaction = new Reaction({
    reaction,
    message: messageId,
    user: req.user._id,
  });

  if (newReaction) await newReaction.save();

  res.status(201).json({
    success: true,
    message: "Reaction added successfully",
  });
});

export const removeReaction = expressAsyncHandler(async (req, res) => {
  const reactionId = req.params.reactionId;

  const reaction = await Reaction.findById(reactionId);

  if (!reaction) return handleError(404, "Reaction not found", res);

  if (reaction.userId.toString() !== req.user._id.toString())
    return handleError(
      403,
      "You are not authorized to delete this reaction",
      res
    );

  await reaction.remove();

  res.status(200).json({
    success: true,
    message: "Reaction removed successfully",
  });
});

export const getReactions = expressAsyncHandler(async (req, res) => {
  const messageId = req.params.messageId;

  const reactions = await Reaction.find({ message: messageId });

  res.status(200).json({
    success: true,
    reactions,
  });
});

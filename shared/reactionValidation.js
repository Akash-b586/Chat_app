import Joi from "joi";
import { validator } from "./validator";

const reactionSchema = Joi.object({
  reaction: Joi.string().valid("👍", "❤️", "😂", "😢", "😮", "🔥").required(),
});

export const validateReaction = validator(reactionSchema);

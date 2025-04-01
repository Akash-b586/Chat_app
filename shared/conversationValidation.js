import Joi from "joi";

import { validator } from "./validator.js";

const conversationSchema = Joi.object({
  participants: Joi.array().items(Joi.string()).required().min(1),
  name: Joi.string().required(),
});

export const validateConversation = validator(conversationSchema);

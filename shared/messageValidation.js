import Joi from "joi";
import { validator } from "./validator.js";

const sendMessageSchema = Joi.object({
  message: Joi.string().min(1).max(1000).required(),
});

export const validateSendMessage = validator(sendMessageSchema);

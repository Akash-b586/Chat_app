import Joi from "joi";
import passwordComplexity from "joi-password-complexity";
import { validator } from "./validator.js";

//instead of writing patterns for password validation, we can use joi-password-complexity library
const passwordSchema = passwordComplexity(undefined, "Password").messages({
  "string.base": "Password should be a string.",
  "string.empty": "Password is required.",
  "string.min": "Password must be at least {#min} characters long.",
  "string.max": "Password must be no more than {#max} characters long.",
  "string.pattern.base":
    "Password must include at least one uppercase letter, one lowercase letter, one number, and one special character.",
  "any.required": "Password is required.",
});

const usernameSchema = Joi.string()
  .alphanum()
  .min(4)
  .max(30)
  .required()
  .messages({
    "string.alphanum": "Username should only contain letters and numbers.",
    "string.min": "Username must be at least 4 characters long.",
    "string.max": "Username must be less than 30 characters.",
    "any.required": "Username is required.",
    "string.empty": "Username is required.",
  });

const emailSchema = Joi.string()
  .email({ tlds: { allow: false } })
  .required()
  .messages({
    "string.email": "Email must be a valid email address.",
    "any.required": "Email is required.",
    "string.empty": "Email is required.",
  });

const genderSchema = Joi.string().valid("male", "female").required().messages({
  "any.only": "Gender must be either male or female.",
  "any.required": "Gender is required.",
});

export const registerUserSchema = Joi.object({
  username: usernameSchema,
  password: passwordSchema,
  email: emailSchema,
  confirmPassword: Joi.string().required().valid(Joi.ref("password")).messages({
    "any.required": "Confirm password is required.",
    "string.empty": "Confirm password is required.",
    "any.only": "Passwords do not match.",
  }),
  gender: genderSchema,
});

export const loginUserSchema = Joi.object({
  email: emailSchema,
  password: passwordSchema,
});

export const updateUserSchema = Joi.object({
  username: usernameSchema.optional(),
  email: emailSchema.optional(),
  oldPassword: passwordSchema.optional().allow(""),
  newPassword: passwordSchema.optional().allow(""),
  profilePicture: Joi.string().uri().optional().messages({
    "string.uri": "Profile picture must be a valid URL",
  }),
  gender: genderSchema.optional(),
});

export const validateRegisterUser = validator(registerUserSchema);
export const validateLoginUser = validator(loginUserSchema);
export const validateUpdateUser = validator(updateUserSchema);

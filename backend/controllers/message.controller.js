import { validateSendMessage } from "../../shared/messageValidation.js";
import expressAsyncHandler from "express-async-handler";
import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import handleError from "../utils/handleError.js";

export const sendMessage = expressAsyncHandler(async (req, res) => {});

export const getMessages = expressAsyncHandler(async (req, res) => {});

export const editMessage = expressAsyncHandler(async (req, res) => {});

export const deleteMessage = expressAsyncHandler(async (req, res) => {});

export const replyToMessage = expressAsyncHandler(async (req, res) => {});

export const pinMessage = expressAsyncHandler(async (req, res) => {});

export const unPinMessage = expressAsyncHandler(async (req, res) => {});

import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["direct", "group"], // 'direct' for one-on-one, 'group' for group chats
      required: true,
    },
    participants: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        role: {
          type: String,
          enum: ["member", "admin"], // Role of the user in the conversation
          default: "member",
        },
        joinedAt: {
          type: Date,
          default: Date.now,
        },
        addedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        _id: false, // Don't create separate _id for each participant
      },
    ],
    name: {
      type: String,
      trim: true,
      default: function () {
        return this.type === "group" ? "Unnamed Group" : undefined;
      },
    },
    avatar: {
      type: String, // URL for the group avatar
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: function () {
        return this.type === "group";
      },
    },
    pinnedMessages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
      },
    ],
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
      default: null,
    },
    mutedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    removedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

// Indexes for efficient querying
conversationSchema.index({ type: 1, "participants.userId": 1 }); // Query by type and participants
conversationSchema.index({ "lastMessage.sentAt": -1 }); // For sorting by recent activity

const Conversation = mongoose.model("Conversation", conversationSchema);
export default Conversation;

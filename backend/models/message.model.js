import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },
    messageType: {
      type: String,
      enum: ["text", "image", "file", "audio", "video"],
      default: "text",
    },
    content: {
      type: String,
      required: function () {
        return this.messageType === "text";
      },
    },
    media: {
      url: String,
      fileType: String,
      fileName: String,
      fileSize: Number,
    },
    isPinned: {
      type: Boolean,
      default: false,
    },
    isEdited: {
      type: Boolean,
      default: false,
    },
    replyTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
      default: null,
    },
  },
  { timestamps: true }
);

// Indexes for efficient querying
messageSchema.index({ conversationId: 1, createdAt: 1 }); // For pagination
messageSchema.index({ conversationId: 1, isPinned: 1 }); // For fetching pinned messages
messageSchema.index({ senderId: 1 }); // For sender-specific queries
messageSchema.index({ replyTo: 1 }); // For fetching replies

const Message = mongoose.model("Message", messageSchema);
export default Message;

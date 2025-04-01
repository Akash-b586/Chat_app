import mongoose from "mongoose";

const reactionSchema = new mongoose.Schema(
  {
    messageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reaction: {
      type: String,
      enum: ["👍", "❤️", "😂", "😢", "😮", "🔥"],
      required: true,
    },
  },
  { timestamps: true }
);

const Reaction = mongoose.model("Reaction", reactionSchema);
export default Reaction;

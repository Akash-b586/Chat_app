import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      required: true,
      type: String,
      unique: true,
    },
    username: {
      required: true,
      type: String,
      unique: true,
    },
    password: {
      required: true,
      type: String,
      minLength: 8,
    },
    gender: {
      required: true,
      type: String,
      enum: ["male", "female"],
      default: "male",
    },
    profilePicture: {
      type: String,
      default: "",
    },
    friends: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;

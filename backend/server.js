import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import usersRoutes from "./routes/users.route.js";
import friendsRoutes from "./routes/friends.route.js";
import conversationRoutes from "./routes/conversations.route.js";
import errorMiddleware from "./middleware/error.middleware.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { connectMongoDB } from "./db/connectMongoDB.js";
import path from "node:path";

const app = express();

//use env variables
dotenv.config({ path: path.resolve("./backend/.env") });

const PORT = process.env.PORT || 3000;

//allow cors
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PATCH", "DELETE"],
  })
);

//use json from body
app.use(express.json({ limit: "5mb" }));

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }, { limit: "5mb" }));

// It makes the cookies available in req.cookies
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/friends", friendsRoutes);
app.use("/api/conversations", conversationRoutes);

//error handling middleware
app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
  connectMongoDB();
});

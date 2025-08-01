import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectMongoDB from "./db/connectMongodb.js";
import infoRoutes from "./Routes/info_routes.js";
import anonymousRoutes from "./Routes/annonymous_route.js";
// import chatbotRoutes from "./Routes/chatbot_route.js";
import authRoutes from "./Routes/authRoutes.js";
import adminAnswerRoutes from "./Routes/adminAnswerRoutes.js";
import adminRoutes from "./Routes/adminRoutes.js";
import { createServer } from "http";
import { Server } from "socket.io";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("Admin connected");
});

// Middleware
app.use(
  cors({
    origin: "http://localhost:3000", // Your frontend URL
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser()); // Added cookie-parser middleware

// Import routes
app.use("/api/userinfo", infoRoutes);
app.use("/api/anonymous", anonymousRoutes);
// app.use("/api/chatbot", chatbotRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/adminanswers", adminAnswerRoutes);

// Start server
httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectMongoDB();
});

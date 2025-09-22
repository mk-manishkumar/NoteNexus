import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import connectDB from "./config/db.js";
import { scheduleUserDeletionJob } from "./utils/cronJob.js";

import authRoutes from "./routes/authRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import notesRouter from "./routes/notesRoutes.js";
import binRouter from "./routes/binRoutes.js";
import archiveRouter from "./routes/archiveRoutes.js";

const app = express();
const port = process.env.PORT || 3000;

connectDB();
scheduleUserDeletionJob();

// Middleware to parse JSON bodies and cookies
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));

app.get("/", (req, res) => {
  res.send("<strong>Welcome to the NoteNexus API</strong>");
});

// Mount API routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/notes", notesRouter);
app.use("/api/v1/bin", binRouter);
app.use("/api/v1/archive", archiveRouter);

// Handle 404 errors with JSON response
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: "Not Found" });
});

// Global error handler returns JSON
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: "Internal Server Error" });
});

app.listen(port, () => console.log(`Server running on port ${port}`));

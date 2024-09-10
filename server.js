import "dotenv/config";
import express from "express";
import path, { dirname } from "path"; 
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";

const app = express();
const port = 3000;

// connect dB
import connectDB from "./config/db.js";
connectDB();

import authRoutes from "./routes/authRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import notesRouter from "./routes/notesRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// Use routes
app.use("/", authRoutes);
app.use("/", profileRoutes);
app.use("/", notesRouter);

app.listen(port, () => console.log(`Server running on port ${port}`));

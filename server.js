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
import binRouter from "./routes/binRoutes.js";
import archiveRouter from "./routes/archiveRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, "public")));

// Use routes
app.use("/", authRoutes);
app.use("/profile", profileRoutes);
app.use("/notes", notesRouter);
app.use("/bin", binRouter);
app.use("/archive", archiveRouter);

// Handle 404 errors (not found)
app.use((req, res, next) => {
  res.status(404).render("404", { message: "Page not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render("error", { message: "Something went wrong!" });
});

app.listen(port, () => console.log(`Server running on port ${port}`));

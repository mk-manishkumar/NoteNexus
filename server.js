import "dotenv/config";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const app = express();
const port = 3000;

import authRoutes from "./routes/authRoutes.js";
// import profileRoutes from "./routes/profileRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Use routes
app.use("/", authRoutes);
// app.use("/", profileRoutes);

app.listen(port, () => console.log(`Server running on port ${port}`));

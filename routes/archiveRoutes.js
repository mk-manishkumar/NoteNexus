import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import { deleteFromArchive, restoreFromArchive, clearArchive, searchArchive } from "../controllers/archiveController.js";

const archiveRouter = express.Router();

archiveRouter.use(authMiddleware);

// Route to archive a note
archiveRouter.post("/deletefromarchive", deleteFromArchive);

// Route to restore a note from the archive
archiveRouter.post("/restorfromarchive", restoreFromArchive);

// Route to clear all notes from the archive
archiveRouter.post("/cleararchive", clearArchive);

// Route to search notes in archive section
archiveRouter.get("/search-archived-notes", searchArchive);

export default archiveRouter;

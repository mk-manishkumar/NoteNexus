import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import { fetchArchivedNotes, deleteFromArchive, restoreFromArchive, clearArchive, searchArchive } from "../controllers/archiveController.js";
import { guestRestrictions } from "../middlewares/guestRestrictions.js";

const archiveRouter = express.Router();

archiveRouter.use(authMiddleware);
archiveRouter.use(guestRestrictions);

// to fetch archive page
archiveRouter.get("/", fetchArchivedNotes);

// Route to archive a note
archiveRouter.delete("/deletefromarchive/:id", deleteFromArchive);

// Route to restore a note from the archive
archiveRouter.post("/restorefromarchive/:id", restoreFromArchive);

// Route to clear all notes from the archive
archiveRouter.delete("/cleararchive", clearArchive);

// Route to search notes in archive section
archiveRouter.get("/search-archived-notes", searchArchive);

export default archiveRouter;

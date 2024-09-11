import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import { deleteFromArchive, restoreFromArchive, clearArchive } from "../controllers/archiveController.js"; 

const archiveRouter = express.Router();

archiveRouter.use(authMiddleware);

// Route to archive a note
archiveRouter.post("/deletefromarchive", deleteFromArchive);

// Route to restore a note from the archive
archiveRouter.post("/restorfromarchive", restoreFromArchive);

// Route to clear all notes from the archive
archiveRouter.post("/cleararchive", clearArchive);

export default archiveRouter;

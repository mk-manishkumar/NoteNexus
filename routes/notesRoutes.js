import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import { deleteNote, archiveNote, fetchDeletedNotes, fetchArchivedNotes, addNote, fetchNotes, clearAllNotes } from "../controllers/notesController.js";

const notesRouter = express.Router();

notesRouter.use(authMiddleware);

// Route for fetching all notes
notesRouter.get("/notes", fetchNotes);

// Route for adding new notes
notesRouter.post("/addnotes", addNote);

// Handle deleting (moving to bin)
notesRouter.post("/deletenote", deleteNote);

// Handle archiving notes
notesRouter.post("/archivenote", archiveNote);

// Retrieve deleted notes (bin)
notesRouter.get("/bin", fetchDeletedNotes);

// Retrieve archived notes
notesRouter.get("/archive", fetchArchivedNotes);

// Route for clearing all notes
notesRouter.post("/clearnotes", clearAllNotes);

export default notesRouter;

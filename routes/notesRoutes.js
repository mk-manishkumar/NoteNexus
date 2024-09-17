import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import { deleteNote, archiveNote, fetchDeletedNotes, fetchArchivedNotes, addNote, fetchNotes, clearAllNotes, openNote, getEditNote, updateNote, searchNotes } from "../controllers/notesController.js";

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

// Route to display a single note by its slug
notesRouter.get("/notes/:slug", openNote);

// Route to render the edit note page
notesRouter.get("/notes/edit/:slug", getEditNote);

// Route to handle the note update
notesRouter.post("/notes/edit/:slug", updateNote);

// ROute for searching a particular note
notesRouter.get("/search-notes", searchNotes);

export default notesRouter;

import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import { deleteNote, archiveNote, addNote, fetchNotes, clearAllNotes, openNote, getEditNote, updateNote, searchNotes } from "../controllers/notesController.js";
import { guestRestrictions } from "../middlewares/guestRestrictions.js";

const notesRouter = express.Router();

notesRouter.use(authMiddleware);
notesRouter.use(guestRestrictions);

// Route for fetching all notes
notesRouter.get("/", fetchNotes);

// Route for adding new notes
notesRouter.post("/addnotes", addNote);

// Handle deleting (moving to bin)
notesRouter.post("/:noteId", deleteNote);

// Handle archiving notes
notesRouter.post("/archivenote", archiveNote);

// Route for clearing all notes
notesRouter.post("/clearnotes", clearAllNotes);

// ROute for searching a particular note
notesRouter.get("/search-notes", searchNotes);

// Route to display a single note by its slug
notesRouter.get("/:slug", openNote);

// Route to render the edit note page
notesRouter.get("/edit/:slug", getEditNote);

// Route to handle the note update
notesRouter.post("/edit/:slug", updateNote);

export default notesRouter;

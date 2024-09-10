import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import User from "../models/User.model.js";
import { deleteNote, archiveNote, fetchDeletedNotes, fetchArchivedNotes, addNote } from "../controllers/notesController.js";

const notesRouter = express.Router();

notesRouter.get("/notes", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id; // Get the user ID from the JWT token
    const user = await User.findById(userId).populate("notes");

    if (!user) {
      return res.status(404).send("Something went wrong");
    }

    res.render("notes", { notes: user.notes, user });
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});

// route for adding new notes
notesRouter.post("/addnotes", authMiddleware, addNote);

// Handle deleting (moving to bin)
notesRouter.post("/deletenote", authMiddleware, deleteNote);

// Handle archiving notes
notesRouter.post("/archivenote", authMiddleware, archiveNote);

// Retrieve deleted notes (bin)
notesRouter.get("/bin", authMiddleware, fetchDeletedNotes);

// Retrieve archived notes
notesRouter.get("/archive", authMiddleware, fetchArchivedNotes);

// route for clearing all notes
// notesRouter.post("/clearall", authMiddleware, clearAllNotes);

export default notesRouter;

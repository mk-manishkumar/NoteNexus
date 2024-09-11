import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import User from "../models/User.model.js";
import { deleteNote, archiveNote, fetchDeletedNotes, fetchArchivedNotes, addNote } from "../controllers/notesController.js";

const notesRouter = express.Router();

notesRouter.use(authMiddleware);

notesRouter.get("/notes", async (req, res) => {
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

// Route for clearing all notes (example)
// notesRouter.post("/clearall", clearAllNotes);

export default notesRouter;

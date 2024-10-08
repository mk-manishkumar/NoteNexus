import Notes from "../models/Notes.model.js";
import User from "../models/User.model.js";
import { getUserForRole } from "../utils/getUserForRole.js";

// Fetch Archived Notes
export const fetchArchivedNotes = async (req, res) => {
  try {
    const { username, role } = req.user;

    const user = await getUserForRole(role, username);

    const archivedNotes = await Notes.find({ user, isArchived: true, isDeleted: false });
    res.status(200).render("archive", { notes: archivedNotes, user, error: "" });
  } catch (err) {
    console.error(err);
    res.status(500).render("error");
  }
};

// Delete a note
export const deleteFromArchive = async (req, res) => {
  try {
    const { noteId } = req.body;
    const userId = req.user.id;

    const deletedNote = await Notes.findOneAndDelete({ _id: noteId, user: userId, isArchived: true });

    if (!deletedNote) return res.status(404).send("Note not found or already deleted.");

    res.status(200).redirect("/archive");
  } catch (err) {
    console.error(err);
    res.status(500).render("error");
  }
};

// Restore a note from the archive
export const restoreFromArchive = async (req, res) => {
  try {
    const { noteId } = req.body;
    const userId = req.user.id;

    const restoredNote = await Notes.findOneAndUpdate({ _id: noteId, user: userId, isArchived: true }, { $set: { isArchived: false } }, { new: true });

    if (!restoredNote) return res.status(404).send("Note not found or already restored.");

    res.status(200).redirect("/archive");
  } catch (err) {
    console.error(err);
    res.status(500).render("error");
  }
};

// Clear all notes from the archive
export const clearArchive = async (req, res) => {
  try {
    const userId = req.user.id;

    await Notes.deleteMany({ user: userId, isArchived: true });

    res.status(200).redirect("/archive");
  } catch (err) {
    console.error(err);
    res.status(500).render("error");
  }
};

// Search notes in archive section
export const searchArchive = async (req, res) => {
  try {
    const { search } = req.query;

    const { username, role } = req.user;

    const user = await getUserForRole(role, username);

    if (!search) return res.status(400).render("archive", { error: "Please enter a search query.", user, notes: [] });

    const notes = await Notes.find({
      user,
      isArchived: true,
      isDeleted: false,
      $or: [{ title: { $regex: search, $options: "i" } }, { description: { $regex: search, $options: "i" } }],
    });

    if (notes.length === 0) return res.status(404).render("archive", { error: "No notes found", user, notes: [] });

    res.status(200).render("archive", { user, notes, error: "" });
  } catch (err) {
    console.error(err);
    res.status(500).render("error");
  }
};

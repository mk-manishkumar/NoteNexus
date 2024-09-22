import Notes from "../models/Notes.model.js";
import User from "../models/User.model.js";

// Fetch Archived Notes
export const fetchArchivedNotes = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    const archivedNotes = await Notes.find({ user: userId, isArchived: true });
    res.render("archive", { notes: archivedNotes, user, error: "" });
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
};

// Delete a note
export const deleteFromArchive = async (req, res) => {
  try {
    const { noteId } = req.body;
    const userId = req.user.id;

    await Notes.findOneAndDelete({ _id: noteId, user: userId, isArchived: true });

    res.redirect("/archive");
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
};

// Restore a note from the archive
export const restoreFromArchive = async (req, res) => {
  try {
    const { noteId } = req.body;
    const userId = req.user.id;

    await Notes.findOneAndUpdate({ _id: noteId, user: userId, isArchived: true }, { $set: { isArchived: false } }, { new: true });

    res.redirect("/archive");
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
};

// Clear all notes from the archive
export const clearArchive = async (req, res) => {
  try {
    const userId = req.user.id;

    await Notes.deleteMany({ user: userId, isArchived: true });

    res.redirect("/archive");
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
};

// Search notes in archive section
export const searchArchive = async (req, res) => {
  try {
    const { search } = req.query;
    const userId = req.user.id;

    if (!search) {
      return res.status(400).render("archive", { error: "Please enter a search query.", user: req.user, notes: [] });
    }

    const notes = await Notes.find({
      user: userId,
      isArchived: true,
      isDeleted: false,
      $or: [{ title: { $regex: search, $options: "i" } }, { description: { $regex: search, $options: "i" } }],
    });

    if (notes.length === 0) {
      return res.status(404).render("archive", { error: "No notes found", user: req.user, notes: [] });
    }

    res.render("archive", { user: req.user, notes, error: "" });
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
};

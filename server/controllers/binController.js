import Notes from "../models/Notes.model.js";
import User from "../models/User.model.js";
import { getUserForRole } from "../utils/getUserForRole.js";

// Fetch deleted notes (bin)
export const fetchDeletedNotes = async (req, res) => {
  try {
    const { username, role } = req.user;
    const user = await getUserForRole(role, username);

    const deletedNotes = await Notes.find({ user, isDeleted: true, isArchived: false });

    res.status(200).json({ success: true, notes: deletedNotes });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to fetch deleted notes" });
  }
};

// Restore note from bin (soft undelete)
export const restoreFromBin = async (req, res) => {
  try {
    const { noteId } = req.params;
    const userId = req.user.id;

    const note = await Notes.findOneAndUpdate({ _id: noteId, user: userId, isDeleted: true }, { isDeleted: false }, { new: true });

    if (!note) return res.status(404).json({ success: false, message: "Note not found or already restored." });

    res.status(200).json({ success: true, message: "Note restored successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to restore note" });
  }
};

// Permanently delete note from bin
export const deleteFromBin = async (req, res) => {
  try {
    const { noteId } = req.params;
    const userId = req.user.id;

    const deletedNote = await Notes.findOneAndDelete({ _id: noteId, user: userId, isDeleted: true });

    if (!deletedNote) return res.status(404).json({ success: false, message: "Note not found or already deleted." });

    // Remove note reference from the user's notes array
    await User.findByIdAndUpdate(userId, { $pull: { notes: noteId } });

    res.status(200).json({ success: true, message: "Note permanently deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to delete note" });
  }
};

// Clear all notes in bin permanently
export const clearBin = async (req, res) => {
  try {
    const userId = req.user.id;

    const deletedNotes = await Notes.find({ user: userId, isDeleted: true });

    if (deletedNotes.length > 0) {
      await Notes.deleteMany({ user: userId, isDeleted: true });

      const noteIds = deletedNotes.map((note) => note._id);
      await User.findByIdAndUpdate(userId, { $pull: { notes: { $in: noteIds } } });
    }

    res.status(200).json({ success: true, message: "Bin cleared successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to clear bin" });
  }
};

// Search notes in bin
export const searchBin = async (req, res) => {
  try {
    const { search } = req.query;
    const { username, role } = req.user;

    const user = await getUserForRole(role, username);

    if (!search) return res.status(400).json({ success: false, message: "Please enter a search query.", notes: [] });

    const notes = await Notes.find({
      user,
      isArchived: false,
      isDeleted: true,
      $or: [{ title: { $regex: search, $options: "i" } }, { description: { $regex: search, $options: "i" } }],
    });

    if (notes.length === 0) return res.status(404).json({ success: false, message: "No notes found", notes: [] });

    res.status(200).json({ success: true, notes });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to search notes in bin" });
  }
};

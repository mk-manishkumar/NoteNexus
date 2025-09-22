import Notes from "../models/Notes.model.js";
import { getUserForRole } from "../utils/getUserForRole.js";

// Fetch archived notes
export const fetchArchivedNotes = async (req, res) => {
  try {
    const { username, role } = req.user;
    const user = await getUserForRole(role, username);

    const archivedNotes = await Notes.find({ user, isArchived: true, isDeleted: false });
    res.status(200).json({ success: true, notes: archivedNotes });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to fetch archived notes" });
  }
};

// Permanently delete note from archive
export const deleteFromArchive = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const deletedNote = await Notes.findOneAndDelete({ _id: id, user: userId, isArchived: true });

    if (!deletedNote) return res.status(404).json({ success: false, message: "Note not found or already deleted." });

    res.status(200).json({ success: true, message: "Note deleted permanently" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to delete note" });
  }
};

// Restore note from archive
export const restoreFromArchive = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const restoredNote = await Notes.findOneAndUpdate({ _id: id, user: userId, isArchived: true }, { isArchived: false }, { new: true });

    if (!restoredNote) return res.status(404).json({ success: false, message: "Note not found or already restored." });

    res.status(200).json({ success: true, message: "Note restored successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to restore note" });
  }
};

// Clear all archived notes
export const clearArchive = async (req, res) => {
  try {
    const userId = req.user.id;

    await Notes.deleteMany({ user: userId, isArchived: true });

    res.status(200).json({ success: true, message: "All archived notes cleared" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to clear archive" });
  }
};

// Search in archived notes
export const searchArchive = async (req, res) => {
  try {
    const { q } = req.query;
    const { username, role } = req.user;

    const user = await getUserForRole(role, username);

    if (!q) return res.status(400).json({ success: false, message: "Please enter a search query." });

    const notes = await Notes.find({
      user,
      isArchived: true,
      isDeleted: false,
      $or: [{ title: { $regex: q, $options: "i" } }, { description: { $regex: q, $options: "i" } }],
    });

    if (notes.length === 0) return res.status(404).json({ success: false, message: "No notes found." });

    res.status(200).json({ success: true, notes });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Search failed" });
  }
};

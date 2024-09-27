import Notes from "../models/Notes.model.js";
import User from "../models/User.model.js";
import { getUserForRole } from "../utils/getUserForRole.js";

// Fetch Deleted Notes (Bin)
export const fetchDeletedNotes = async (req, res) => {
  try {
    const { username, role } = req.user;

    const user = await getUserForRole(role, username);

    const deletedNotes = await Notes.find({ user, isDeleted: true, isArchived: false });
    res.status(200).render("bin", { notes: deletedNotes, user, error: "" });
  } catch (err) {
    console.error(err);
    res.status(500).render("error");
  }
};

export const restoreFromBin = async (req, res) => {
  try {
    const { noteId } = req.body;
    const userId = req.user.id;

    const note = await Notes.findOneAndUpdate({ _id: noteId, user: userId, isDeleted: true }, { $set: { isDeleted: false } });

    if (!note) return res.status(404).send("Note not found or already restored.");

    res.status(200).redirect("/bin");
  } catch (err) {
    console.error(err);
    res.status(500).render("error");
  }
};

export const deleteFromBin = async (req, res) => {
  try {
    const { noteId } = req.body;
    const userId = req.user.id;

    const deletedNote = await Notes.findOneAndDelete({ _id: noteId, user: userId, isDeleted: true });

    if (!deletedNote) return res.status(404).send("Note not found or already deleted.");

    // If the note was successfully deleted, update the user's notes array
    if (deletedNote) {
      await User.findByIdAndUpdate(userId, {
        $pull: { notes: noteId }, // Remove the note reference from the user's notes array
      });
    }

    res.status(200).redirect("/bin");
  } catch (err) {
    console.error(err);
    res.status(500).render("error");
  }
};

export const clearBin = async (req, res) => {
  try {
    const userId = req.user.id;

    const deletedNotes = await Notes.find({ user: userId, isDeleted: true });

    if (deletedNotes.length > 0) {
      await Notes.deleteMany({ user: userId, isDeleted: true });

      const noteIds = deletedNotes.map((note) => note._id);
      await User.findByIdAndUpdate(userId, {
        $pull: { notes: { $in: noteIds } },
      });
    }

    res.status(200).redirect("/bin");
  } catch (err) {
    console.error(err);
    res.status(500).render("error");
  }
};

export const searchBin = async (req, res) => {
  try {
    const { search } = req.query;

    const { username, role } = req.user;

    const user = await getUserForRole(role, username);

    if (!search) return res.status(400).render("bin", { error: "Please enter a search query.", user, notes: [] });

    const notes = await Notes.find({
      user,
      isArchived: false,
      isDeleted: true,
      $or: [{ title: { $regex: search, $options: "i" } }, { description: { $regex: search, $options: "i" } }],
    });

    if (notes.length === 0) return res.status(404).render("bin", { error: "No notes found", user, notes: [] });

    res.status(200).render("bin", { user, notes, error: "" });
  } catch (err) {
    console.error(err);
    res.status(500).render("error");
  }
};

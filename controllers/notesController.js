import User from "../models/User.model.js";
import Notes from "../models/Notes.model.js";

// Fetch Active Notes (not deleted or archived)
export const fetchNotes = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    const activeNotes = await Notes.find({ user: userId, isDeleted: false, isArchived: false });
    res.render("notes", { notes: activeNotes, user });
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
};

// Add Note
export const addNote = async (req, res) => {
  try {
    const userId = req.user.id;
    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: "Title and description are required" });
    }

    const newNote = new Notes({ title, description, user: userId });
    await newNote.save();
    await User.findByIdAndUpdate(userId, { $push: { notes: newNote._id } });

    res.redirect("/notes");
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

// Move Note to Bin (delete)
export const deleteNote = async (req, res) => {
  try {
    const { noteId } = req.body;
    const userId = req.user.id;

    const note = await Notes.findOneAndUpdate({ _id: noteId, user: userId }, { $set: { isDeleted: true, isArchived: false } }, { new: true });

    if (!note) {
      return res.status(404).send("Note not found or you do not have permission");
    }

    res.redirect("/notes");
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
};

// Archive Note
export const archiveNote = async (req, res) => {
  try {
    const { noteId } = req.body;
    const userId = req.user.id;

    const note = await Notes.findOneAndUpdate({ _id: noteId, user: userId }, { $set: { isArchived: true, isDeleted: false } }, { new: true });

    if (!note) {
      return res.status(404).send("Note not found or you do not have permission");
    }

    res.redirect("/notes");
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
};

// Fetch Deleted Notes (Bin)
export const fetchDeletedNotes = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    const deletedNotes = await Notes.find({ user: userId, isDeleted: true });
    res.render("bin", { notes: deletedNotes, user });
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
};

// Fetch Archived Notes
export const fetchArchivedNotes = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    const archivedNotes = await Notes.find({ user: userId, isArchived: true });
    res.render("archive", { notes: archivedNotes, user });
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
};

// Clear All notes
export const clearAllNotes = async (req, res) => {
  try {
    const userId = req.user.id;
    await Notes.updateMany({ user: userId, isDeleted: false, isArchived: false }, { $set: { isDeleted: true } });
    res.redirect("/notes");
  } catch (error) {
    console.error(err);
    res.status(500).send(err.message);
  }
};

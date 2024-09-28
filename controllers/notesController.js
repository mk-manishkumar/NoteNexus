import User from "../models/User.model.js";
import Notes from "../models/Notes.model.js";
import Guest from "../models/Guest.model.js";
import { getUserForRole } from "../utils/getUserForRole.js";

// Helper function to validate title and description
const validateNoteInput = (title, description) => {
  if (!title || !description) throw new Error("Title and description are required");
};

// Helper function to handle note retrieval
const findNoteBySlug = async (slug, userId) => {
  const note = await Notes.findOne({ slug, user: userId }).lean();
  if (!note) throw new Error("Note not found or access denied");
  return note;
};

// Fetch Active Notes (not deleted or archived)
export const fetchNotes = async (req, res) => {
  try {
    const { username, role } = req.user;
    const user = await getUserForRole(role, username);

    const activeNotes = await Notes.find({
      user,
      isDeleted: false,
      isArchived: false,
    }).lean();

    res.status(200).render("notes", { notes: activeNotes, user, error: "" });
  } catch (err) {
    console.error(err);
    res.status(500).render("error");
  }
};

// Add Note
export const addNote = async (req, res) => {
  try {
    const { title, description } = req.body;
    const { username, role } = req.user;

    const user = await getUserForRole(role, username);
    validateNoteInput(title, description);

    const newNote = new Notes({ title, description, user: user._id });
    await newNote.validate();
    await newNote.save();

    const model = role === "guest" ? Guest : User;
    await model.findByIdAndUpdate(user._id, { $push: { notes: newNote._id } });

    res.status(200).redirect("/notes");
  } catch (err) {
    console.error(err);
    res.status(400).render("profile", { user: req.user, error: err.message });
  }
};

// Move Note to Bin (delete)
export const deleteNote = async (req, res) => {
  try {
    const { noteId } = req.body;
    const userId = req.user.id;

    const note = await Notes.findOneAndUpdate({ _id: noteId, user: userId }, { isDeleted: true, isArchived: false }, { new: true });

    if (!note) {
      return res.status(404).send("Note not found or access denied");
    }

    res.status(200).redirect("/notes");
  } catch (err) {
    console.error(err);
    res.status(500).render("error");
  }
};

// Archive Note
export const archiveNote = async (req, res) => {
  try {
    const { noteId } = req.body;
    const userId = req.user.id;

    const note = await Notes.findOneAndUpdate({ _id: noteId, user: userId }, { isArchived: true, isDeleted: false }, { new: true });

    if (!note) {
      return res.status(404).send("Note not found or access denied");
    }

    res.status(200).redirect("/notes");
  } catch (err) {
    console.error(err);
    res.status(500).render("error");
  }
};

// Clear All Notes
export const clearAllNotes = async (req, res) => {
  try {
    const userId = req.user.id;
    await Notes.updateMany({ user: userId, isDeleted: false, isArchived: false }, { isDeleted: true });

    res.status(200).redirect("/notes");
  } catch (error) {
    console.error(error);
    res.status(500).render("error");
  }
};

// Open Note
export const openNote = async (req, res) => {
  try {
    const { slug } = req.params;
    const { username, role } = req.user;

    const user = await getUserForRole(role, username);
    const note = await findNoteBySlug(slug, user._id);

    res.status(200).render("noteDetail", { note, user });
  } catch (error) {
    console.error(error);
    res.status(404).render("error");
  }
};

// Display Edit Note Page
export const getEditNote = async (req, res) => {
  try {
    const { slug } = req.params;
    const { username, role } = req.user;

    const user = await getUserForRole(role, username);
    const note = await findNoteBySlug(slug, user._id);

    res.status(200).render("editNote", { note, user, error: "" });
  } catch (error) {
    console.error(error);
    res.status(404).render("error");
  }
};

// Update Note
export const updateNote = async (req, res) => {
  try {
    const { slug } = req.params;
    const { title, description } = req.body;
    const userId = req.user.id;

    validateNoteInput(title, description);

    const note = await Notes.findOneAndUpdate({ slug, user: userId }, { title, description }, { new: true, runValidators: true });

    if (!note) return res.status(404).render("error", { message: "Note not found or access denied" });

    res.status(200).redirect(`/notes/${note.slug}`);
  } catch (error) {
    console.error(error);
    res.status(400).render("editNote", { user: req.user, note: req.body, error: error.message });
  }
};

// Search Notes
export const searchNotes = async (req, res) => {
  try {
    const { search } = req.query;
    const { username, role } = req.user;

    if (!search) return res.status(400).render("notes", { error: "Please enter a search query.", user: req.user, notes: [] });

    const user = await getUserForRole(role, username);
    const notes = await Notes.find({
      user: user._id,
      isArchived: false,
      isDeleted: false,
      $or: [{ title: { $regex: search, $options: "i" } }, { description: { $regex: search, $options: "i" } }],
    }).lean();

    if (!notes.length) return res.status(404).render("notes", { error: "No notes found", user, notes: [] });

    res.status(200).render("notes", { user, notes, error: "" });
  } catch (err) {
    console.error(err);
    res.status(500).render("error");
  }
};

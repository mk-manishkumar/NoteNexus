import User from "../models/User.model.js";
import Notes from "../models/Notes.model.js";
import Guest from "../models/Guest.model.js";
import { getUserForRole } from "../utils/getUserForRole.js";

// Validate title and description input
const validateNoteInput = (title, description) => {
  if (!title || !description) throw new Error("Title and description are required");
};

// Find note by slug and user id
const findNoteBySlug = async (slug, userId) => {
  const note = await Notes.findOne({ slug, user: userId }).lean();
  if (!note) throw new Error("Note not found or access denied");
  return note;
};

// Fetch active (not deleted/archived) notes
export const fetchNotes = async (req, res) => {
  try {
    const { username, role } = req.user;
    const user = await getUserForRole(role, username);

    // Extract pagination parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Fetch paginated notes
    const [notes, total] = await Promise.all([
      Notes.find({
        user: user._id,
        isDeleted: false,
        isArchived: false,
      })
        .sort({ createdAt: -1 }) // newest first
        .skip(skip)
        .limit(limit)
        .lean(),
      Notes.countDocuments({
        user: user._id,
        isDeleted: false,
        isArchived: false,
      }),
    ]);

    res.status(200).json({
      success: true,
      notes,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalNotes: total,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to fetch notes" });
  }
};

// Add new note
export const addNote = async (req, res) => {
  try {
    const { title, description } = req.body;
    const { username, role } = req.user;

    const user = await getUserForRole(role, username);
    validateNoteInput(title, description);

    const newNote = new Notes({ title, description, user: user._id });
    await newNote.save();

    const model = role === "guest" ? Guest : User;
    await model.findByIdAndUpdate(user._id, { $push: { notes: newNote._id } });

    res.status(201).json({ success: true, note: newNote });
  } catch (err) {
    console.error(err);
    res.status(400).json({ success: false, message: err.message });
  }
};

// Move note to bin (soft-delete)
export const deleteNote = async (req, res) => {
  try {
    const { noteId } = req.params;
    const userId = req.user.id;

    const note = await Notes.findOneAndUpdate({ _id: noteId, user: userId }, { isDeleted: true, isArchived: false }, { new: true });

    if (!note) return res.status(404).json({ success: false, message: "Note not found or access denied" });

    res.status(200).json({ success: true, message: "Note moved to bin" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to delete note" });
  }
};

// Archive note
export const archiveNote = async (req, res) => {
  try {
    const { noteId } = req.params;
    const userId = req.user.id;

    const note = await Notes.findOneAndUpdate({ _id: noteId, user: userId }, { isArchived: true, isDeleted: false }, { new: true });

    if (!note) return res.status(404).json({ success: false, message: "Note not found or access denied" });

    res.status(200).json({ success: true, message: "Note archived" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to archive note" });
  }
};

// Clear all active notes (soft-delete)
export const clearAllNotes = async (req, res) => {
  try {
    const userId = req.user.id;
    await Notes.updateMany({ user: userId, isDeleted: false, isArchived: false }, { isDeleted: true });

    res.status(200).json({ success: true, message: "All active notes moved to bin" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to clear notes" });
  }
};

// Get note details by slug
export const openNote = async (req, res) => {
  try {
    const { slug } = req.params;
    const { username, role } = req.user;

    const user = await getUserForRole(role, username);
    const note = await findNoteBySlug(slug, user._id);

    res.status(200).json({ success: true, note });
  } catch (error) {
    console.error(error);
    res.status(404).json({ success: false, message: "Note not found" });
  }
};

// Get note for editing
export const getEditNote = async (req, res) => {
  try {
    const { slug } = req.params;
    const { username, role } = req.user;

    const user = await getUserForRole(role, username);
    const note = await findNoteBySlug(slug, user._id);

    res.status(200).json({ success: true, note, user });
  } catch (error) {
    console.error(error);
    res.status(404).json({ success: false, message: "Note not found" });
  }
};

// Update note
export const updateNote = async (req, res) => {
  try {
    const { slug } = req.params;
    const { title, description } = req.body;
    const userId = req.user.id;

    validateNoteInput(title, description);

    const note = await Notes.findOneAndUpdate({ slug, user: userId }, { title, description }, { new: true, runValidators: true });

    if (!note) return res.status(404).json({ success: false, message: "Note not found or access denied" });

    res.status(200).json({ success: true, note });
  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// Search notes
export const searchNotes = async (req, res) => {
  try {
    const { search } = req.query;
    const { username, role } = req.user;

    if (!search) return res.status(400).json({ success: false, message: "Please enter a search query." });

    const user = await getUserForRole(role, username);
    const notes = await Notes.find({
      user: user._id,
      isArchived: false,
      isDeleted: false,
      $or: [{ title: { $regex: search, $options: "i" } }, { description: { $regex: search, $options: "i" } }],
    }).lean();

    if (!notes.length) return res.status(404).json({ success: false, message: "No notes found" });

    res.status(200).json({ success: true, notes });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Search failed" });
  }
};

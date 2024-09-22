import User from "../models/User.model.js";
import Notes from "../models/Notes.model.js";

// Fetch Active Notes (not deleted or archived)
export const fetchNotes = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    const activeNotes = await Notes.find({ user: userId, isDeleted: false, isArchived: false });
    res.render("notes", { notes: activeNotes, user, error: "" });
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
      return res.status(400).render("profile", { user: req.user, error: "Title and description are required" });
    }

    const newNote = new Notes({ title, description, user: userId });

    try {
      await newNote.validate();
      await newNote.save();
    } catch (validationError) {
      // Catch validation errors (like exceeding max length)
      if (validationError.name === "ValidationError") {
        const errorMessage = Object.values(validationError.errors)
          .map((err) => err.message)
          .join(", ");
        return res.status(400).render("profile", { user: req.user, error: errorMessage });
      }
      // Throw if it's not a validation error, re-throwing the error to the outer catch block.
      throw validationError;
    }

    await User.findByIdAndUpdate(userId, { $push: { notes: newNote._id } });

    res.redirect("/notes");
  } catch (err) {
    console.error(err);
    res.status(500).render("error");
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
    res.render("bin", { notes: deletedNotes, user, error: "" });
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
    res.render("archive", { notes: archivedNotes, user, error: "" });
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

// to open each note separately
export const openNote = async (req, res) => {
  try {
    const { slug } = req.params;
    const userId = req.user.id;
    const user = await User.findById(userId);

    // Find the note by its slug and user ID
    const note = await Notes.findOne({ slug, user: userId });

    if (!note) {
      return res.status(404).send("Note not found");
    }

    res.render("noteDetail", { note, user });
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
};

// to display edit page
export const getEditNote = async (req, res) => {
  try {
    const { slug } = req.params;
    const userId = req.user.id;
    const user = await User.findById(userId);

    const note = await Notes.findOne({ slug, user: userId });

    if (!note) {
      return res.status(404).send("Note not found");
    }

    res.render("editNote", { note, user, error: "" });
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
};

// to update note
export const updateNote = async (req, res) => {
  try {
    const { slug } = req.params;
    const { title, description } = req.body;
    const userId = req.user.id;

    if (!title || !description) {
      return res.status(400).render("editNote", { user: req.user, error: "Title and description are required" });
    }

    const note = await Notes.findOne({ slug, user: userId });

    note.title = title;
    note.description = description;

    try {
      await note.validate();
      await note.save();
    } catch (validationError) {
      if (validationError.name === "ValidationError") {
        const errorMessage = Object.values(validationError.errors)
          .map((err) => err.message)
          .join(", ");
        return res.status(400).render("editNote", { user: req.user, note, error: errorMessage });
      }
      throw validationError;
    }

    res.redirect(`/notes/${note.slug}`);
  } catch (error) {
    console.error(error);
    res.status(500).render("error");
  }
};

// to search notes
export const searchNotes = async (req, res) => {
  try {
    const { search } = req.query;
    const userId = req.user.id;

    const notes = await Notes.find({
      user: userId,
      isArchived: false,
      isDeleted: false,
      $or: [{ title: { $regex: search, $options: "i" } }, { description: { $regex: search, $options: "i" } }],
    });

    if (!search) {
      return res.status(400).render("notes", { user: req.user, notes, error: "Please enter a search query." });
    }

    if (notes.length === 0) {
      return res.status(404).render("notes", { user: req.user, notes, error: "No notes found" });
    }

    res.render("notes", { user: req.user, notes, error: "" });
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
};

import Notes from "../models/Notes.model.js";

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

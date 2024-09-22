import Notes from "../models/Notes.model.js";
import User from "../models/User.model.js";

export const restoreFromBin = async (req, res) => {
  try {
    const { noteId } = req.body;
    const userId = req.user.id;

    await Notes.findOneAndUpdate({ _id: noteId, user: userId, isDeleted: true }, { $set: { isDeleted: false } });
    res.redirect("/bin");
  } catch (error) {
    console.error(err);
    res.status(500).send(err.message);
  }
};

export const deleteFromBin = async (req, res) => {
  try {
    const { noteId } = req.body;
    const userId = req.user.id;

    const deletedNote = await Notes.findOneAndDelete({ _id: noteId, user: userId, isDeleted: true });

    // If the note was successfully deleted, update the user's notes array
    if (deletedNote) {
      await User.findByIdAndUpdate(userId, {
        $pull: { notes: noteId }, // Remove the note reference from the user's notes array
      });
    }

    res.redirect("/bin");
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
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

    res.redirect("/bin");
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
};

export const searchBin = async (req, res) => {
  try {
    const { search } = req.query;
    const userId = req.user.id;

    const notes = await Notes.find({
      user: userId,
      isArchived: false,
      isDeleted: true,
      $or: [{ title: { $regex: search, $options: "i" } }, { description: { $regex: search, $options: "i" } }],
    });

    if (!search) {
      return res.status(400).render("bin", { error: "Please enter a search query.", user: req.user, notes });
    }

    if (notes.length === 0) {
      return res.status(404).render("bin", { error: "No notes found", user: req.user, notes });
    }

    res.render("bin", { user: req.user, notes, error: "" });
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
};

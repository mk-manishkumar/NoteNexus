import Notes from "../models/Notes.model.js";

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

    await Notes.findOneAndDelete({ _id: noteId, user: userId, isDeleted: true });
    res.redirect("/bin");
  } catch (error) {
    console.error(err);
    res.status(500).send(err.message);
  }
};

export const clearBin = async (req, res) => {
  try {
    const userId = req.user.id;
    await Notes.deleteMany({ user: userId, isDeleted: true });
    res.redirect("/bin");
  } catch (error) {
    console.error(err);
    res.status(500).send(err.message);
  }
};

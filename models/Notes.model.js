import mongoose from "mongoose";

const notesSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 50,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 5000,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isDeleted: { type: Boolean, default: false },
    isArchived: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

// Optional: Add an index if you need to search by title frequently
notesSchema.index({ title: 1 });

export default mongoose.model("Notes", notesSchema);

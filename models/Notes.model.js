import mongoose from "mongoose";
import slugify from "slugify";

const notesSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      minlength: 1,
      maxlength: [50, "Title cannot exceed 50 characters"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      minlength: 1,
      maxlength: [5000, "Description cannot exceed 5000 characters"],
    },
    slug: {
      type: String,
      unique: true,
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

// Pre-save hook to generate slug from title
notesSchema.pre("save", function (next) {
  if (this.isModified("title")) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

// Optional: Add an index if you need to search by title frequently
notesSchema.index({ title: 1 });

export default mongoose.model("Notes", notesSchema);

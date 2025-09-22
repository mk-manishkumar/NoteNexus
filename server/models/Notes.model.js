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
notesSchema.pre("save", async function (next) {
  if (this.isModified("title")) {
    let baseSlug = slugify(this.title, { lower: true, strict: true });
    let slug = baseSlug;
    let count = 0;

    // Check if a note with the same slug exists for this user
    while (await this.constructor.findOne({ slug, user: this.user })) {
      count++;
      slug = `${baseSlug}-${count}`;
    }

    this.slug = slug;
  }
  next();
});

// Add an index if you need to search by title frequently
notesSchema.index({ title: 1 });

notesSchema.index({ slug: 1, user: 1 }, { unique: true });

export default mongoose.model("Notes", notesSchema);

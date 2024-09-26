import mongoose from "mongoose";
import bcrypt from "bcrypt";

const guestSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  name: { type: String, default: "Guest User" },
  email: { type: String, unique: true },
  password: { type: String, required: true },
  age: { type: Number, default: 25 },
  notes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Note" }],
  createdAt: { type: Date, default: Date.now, expires: "10m" },
});

// Hash password before saving guest
guestSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Delete all notes created by the guest
guestSchema.pre("remove", async function (next) {
  try {
    await Notes.deleteMany({ user: this._id }); 
    next();
  } catch (err) {
    next(err);
  }
});

export default mongoose.model("Guest", guestSchema);

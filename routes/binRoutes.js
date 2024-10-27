import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import { fetchDeletedNotes, restoreFromBin, deleteFromBin, clearBin, searchBin } from "../controllers/binController.js";
import { guestRestrictions } from "../middlewares/guestRestrictions.js";

const binRouter = express.Router();

binRouter.use(authMiddleware);
binRouter.use(guestRestrictions);

// to fetch bin page
binRouter.get("/", fetchDeletedNotes);

// Route to restore a note from bin
binRouter.post("/restorefrombin", restoreFromBin);

// Route to delete a note from bin
binRouter.post("/deletefrombin", deleteFromBin);

// Route to clear all notes in the bin
binRouter.post("/clearbin", clearBin);

// Route for searching notes in bin
binRouter.get("/search-deleted-notes", searchBin);

export default binRouter;

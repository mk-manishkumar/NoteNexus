import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import { restoreFromBin, deleteFromBin, clearBin } from "../controllers/binController.js"; 

const binRouter = express.Router();

binRouter.use(authMiddleware);

// Route to restore a note from bin
binRouter.post("/restorefrombin", restoreFromBin);

// Route to delete a note from bin
binRouter.post("/deletefrombin", deleteFromBin);

// Route to clear all notes in the bin
binRouter.post("/clearbin", clearBin);

export default binRouter;

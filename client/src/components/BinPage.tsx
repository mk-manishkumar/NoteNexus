import React, { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "./shared/Header";
import Footer from "./shared/Footer";
import { Button } from "./ui/button";
import { binApi } from "@/api/api";
import { toast } from "react-toastify";
import { Spinner } from "./ui/spinner";

type Note = {
  _id: string;
  title: string;
  description: string;
  slug: string;
};

const BinPage: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [notesLoading, setNotesLoading] = useState(true);

  const displayBinNotes = useCallback(async () => {
    try {
      const response = await binApi.fetchDeletedNotes();
      const binNotesList = response?.data?.notes || [];
      setNotes(binNotesList);
    } catch (error) {
      if (import.meta.env.VITE_ENV === "development") console.log(error);
      toast.error("Failed to fetch deleted notes");
    } finally {
      setNotesLoading(false);
    }
  }, []);

  useEffect(() => {
    displayBinNotes();
  }, [displayBinNotes]);

  const restoreNote = async (noteId: string) => {
    try {
      await binApi.restoreFromBin(noteId);
      toast.success("Note restored");
      setNotes((prevNotes) => prevNotes.filter((note) => note._id !== noteId));
    } catch (error) {
      if (import.meta.env.VITE_ENV === "development") console.log(error);
      toast.error("Failed to restore the note");
    }
  };

  const deleteNote = async (noteId: string) => {
    try {
      await binApi.deleteFromBin(noteId);
      toast.success("Note deleted");
      setNotes((prevNotes) => prevNotes.filter((note) => note._id !== noteId));
    } catch (error) {
      if (import.meta.env.VITE_ENV === "development") console.log(error);
      toast.error("Failed to delete the note");
    }
  };

  const clearBinPage = async () => {
    try {
      await binApi.clearBin();
      toast.success("All notes in Bin deleted");
      setNotes([]);
    } catch (error) {
      if (import.meta.env.VITE_ENV === "development") console.log(error);
      toast.error("Failed to clear the Bin");
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
    exit: {
      opacity: 0,
      x: -100,
      transition: { duration: 0.3 },
    },
  };

  const renderNotesSection = () => {
    if (notesLoading) {
      return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-center items-center mt-20">
          <Spinner className="size-20 text-white" />
        </motion.div>
      );
    }

    if (notes.length > 0) {
      return (
        <motion.ul variants={containerVariants} initial="hidden" animate="visible" className="list-none flex gap-5 flex-wrap justify-center xl:justify-start">
          <AnimatePresence mode="popLayout">
            {notes.map((note) => (
              <motion.li
                key={note._id}
                variants={itemVariants}
                layout
                exit="exit"
                whileHover={{
                  scale: 1.03,
                  transition: { duration: 0.2 },
                }}
                className="p-4 mb-2 rounded-md w-96 overflow-hidden bg-zinc-800 text-zinc-400"
              >
                <h3 className="text-white text-2xl">{note.title}</h3>
                <p className="text-gray-400 mb-5 h-24 overflow-hidden">{note.description}</p>
                <div className="btns mt-5 flex justify-between">
                  <Button onClick={() => restoreNote(note._id)} className="bg-green-500 text-white px-3 py-1 rounded cursor-pointer hover:bg-green-600 transition-colors duration-200">
                    Restore
                  </Button>
                  <Button onClick={() => deleteNote(note._id)} className="bg-red-500 text-white px-3 py-1 rounded cursor-pointer hover:bg-red-600 transition-colors duration-200">
                    Delete
                  </Button>
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      );
    }

    return (
      <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-white text-center">
        No notes in the Bin.
      </motion.p>
    );
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="bg-zinc-900 w-full flex-grow">
        <motion.section initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="my-8 mx-5 flex flex-col sm:flex-row text-center gap-4 items-center justify-between">
          <h3 className="text-white text-2xl">Here are your deleted notes...</h3>
          <Button onClick={clearBinPage} className="bg-[#CA2B58] hover:bg-red-800 px-4 py-2 text-white rounded-md cursor-pointer w-fit">
            Clear All
          </Button>
        </motion.section>

        <div className="notes p-5 mx-auto w-full xl:w-[77rem]">{renderNotesSection()}</div>
      </motion.div>
      <Footer />
    </div>
  );
};

export default BinPage;

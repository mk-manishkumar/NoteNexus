import React, { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "./shared/Header";
import Footer from "./shared/Footer";
import { Link, useParams } from "react-router-dom";
import { notesApi } from "@/api/api";
import { toast } from "react-toastify";
import Searchbar from "./Searchbar";
import { Button } from "./ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useUserProfile } from "@/customHooks/useUserProfile";

type Note = {
  _id: string;
  title: string;
  description: string;
  slug: string;
};

const NotesPage: React.FC = () => {
  const params = useParams();
  const { profile } = useUserProfile(params.username);
  const [notes, setNotes] = useState<Note[]>([]);
  const [notesLoading, setNotesLoading] = useState(true);

  const displayNotes = useCallback(async () => {
    setNotesLoading(true);
    try {
      const response = await notesApi.fetchNotes();
      const noteList = response?.data?.notes || [];
      setNotes(noteList);
    } catch (error) {
      if (import.meta.env.VITE_ENV === "development") console.log(error);
      toast.error("Failed to fetch Notes");
    } finally {
      setNotesLoading(false);
    }
  }, []);

  useEffect(() => {
    displayNotes();
  }, [displayNotes]);

  const deleteNote = async (noteId: string) => {
    try {
      await notesApi.deleteNote(noteId);
      toast.success("Note Deleted");
      setNotes((prevNotes) => prevNotes.filter((note) => note._id !== noteId));
    } catch (error) {
      if (import.meta.env.VITE_ENV === "development") console.log(error);
      toast.error("Failed to delete the note");
    }
  };

  const archiveNote = async (noteId: string) => {
    try {
      await notesApi.archiveNote(noteId);
      toast.success("Note Archived");
      setNotes((prevNotes) => prevNotes.filter((note) => note._id !== noteId));
    } catch (error) {
      if (import.meta.env.VITE_ENV === "development") console.log(error);
      toast.error("Failed to archive the note");
    }
  };

  const clearNotesPage = async () => {
    try {
      await notesApi.clearAllNotes();
      toast.success("All Notes Deleted");
      setNotes([]);
    } catch (error) {
      if (import.meta.env.VITE_ENV === "development") console.log(error);
      toast.error("Failed to clear the note page");
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
    exit: {
      opacity: 0,
      x: -100,
      transition: {
        duration: 0.3,
      },
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
              <motion.li key={note._id} variants={itemVariants} layout exit="exit" whileHover={{ scale: 1.03, transition: { duration: 0.2 } }} className="p-4 mb-2 rounded-md w-96 overflow-hidden bg-zinc-800 text-zinc-400">
                <Link to={`/profile/${params.username}/note/${note.slug}`} className="font-bold text-2xl mb-2 inline-block text-blue-500 hover:underline">
                  {note.title}
                </Link>
                <p className="h-24 overflow-hidden">{note.description}</p>
                <div className="btns mt-5 flex justify-between">
                  <Button onClick={() => deleteNote(note._id)} className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded cursor-pointer transition-colors duration-200">
                    Delete
                  </Button>
                  <Button onClick={() => archiveNote(note._id)} className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded cursor-pointer transition-colors duration-200">
                    Archive
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
        No notes as of now.
      </motion.p>
    );
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="bg-zinc-900 w-full flex-grow p-5">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
          <Searchbar />
        </motion.div>

        {/* Notes Header */}
        <motion.section initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="my-8 mx-5 flex flex-col sm:flex-row gap-4 text-center justify-between items-center">
          <h3 className="text-white text-2xl">
            Your notes are here, <span className="text-[#CA2B58]">{profile?.name}</span>
          </h3>
          <Button onClick={clearNotesPage} className="bg-[#CA2B58] hover:bg-red-800 px-4 py-2 text-white rounded-md cursor-pointer">
            Clear All
          </Button>
        </motion.section>

        {/* Notes List */}
        <div className="notes p-5 w-full xl:w-[77rem] mx-auto">{renderNotesSection()}</div>
      </motion.div>
      <Footer />
    </div>
  );
};

export default NotesPage;

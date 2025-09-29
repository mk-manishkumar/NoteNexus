import React, { useCallback, useEffect, useState } from "react";
import Header from "./shared/Header";
import Searchbar from "./Searchbar";
import Footer from "./shared/Footer";
import { Button } from "./ui/button";
import { toast } from "react-toastify";
import { archiveApi } from "@/api/api";

type Note = {
  _id: string;
  title: string;
  description: string;
  slug: string;
};

const ArchivePage: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);

  const fetchArchiveNote = useCallback(async () => {
    try {
      const response = await archiveApi.fetchArchivedNotes();
      const archiveNotesList = response?.data?.notes;
      setNotes(archiveNotesList);
    } catch (error) {
      if (import.meta.env.VITE_ENV === "development") console.log(error);
      toast.error("Failed to fetch Archived Notes");
    }
  }, []);

  useEffect(() => {
    fetchArchiveNote();
  }, [fetchArchiveNote]);

  const restoreNote = async (noteId: string) => {
    try {
      await archiveApi.restoreFromArchive(noteId);
      toast.success("Note Restored");
      setNotes((prevNotes) => prevNotes.filter((note) => note._id !== noteId));
    } catch (error) {
      if (import.meta.env.VITE_ENV === "development") console.log(error);
      toast.error("Failed to restore the note");
    }
  };

  const deleteNote = async (noteId: string) => {
    try {
      await archiveApi.deleteFromArchive(noteId);
      toast.success("Note Deleted");
      setNotes((prevNotes) => prevNotes.filter((note) => note._id !== noteId));
    } catch (error) {
      if (import.meta.env.VITE_ENV === "development") console.log(error);
      toast.error("Failed to delete the note");
    }
  };

  const clearArchivePage = async () => {
    try {
      await archiveApi.clearArchive();
      toast.success("All Notes in Archive Deleted");
      setNotes([]);
    } catch (error) {
      if (import.meta.env.VITE_ENV === "development") console.log(error);
      toast.error("Failed to clear the bin page");
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <div className="bg-zinc-900 w-full flex-grow">
        <Searchbar />

        <section className="my-8 mx-5 flex flex-col sm:flex-row text-center gap-4 items-center justify-between">
          <h3 className="text-white text-2xl">Here are your archived notes...</h3>
          <Button onClick={clearArchivePage} className="bg-[#CA2B58] px-4 py-2 text-white rounded-md cursor-pointer hover:bg-[#a01f44] transition-colors duration-200">
            Clear All
          </Button>
        </section>

        <div className="notes p-5 mx-auto w-full xl:w-[77rem]">
          {notes.length > 0 ? (
            <ul className="list-none flex gap-5 flex-wrap justify-center xl:justify-start">
              {notes.map((note) => (
                <li key={note._id} className="p-4 mb-2 rounded-md w-96 overflow-hidden bg-zinc-800 text-zinc-400">
                  <h3 className="text-white text-2xl">{note.title}</h3>
                  <p className="text-gray-400 mb-5 h-24 overflow-hidden">{note.description}</p>
                  <div className="btns mt-5 flex justify-between">
                    {/* Restore Button */}
                    <Button onClick={() => restoreNote(note._id)} className="bg-green-500 text-white px-3 py-1 rounded cursor-pointer hover:bg-green-600 transition-colors duration-200">
                      Restore
                    </Button>
                    {/* Delete Button */}
                    <Button onClick={() => deleteNote(note._id)} className="bg-red-500 text-white px-3 py-1 rounded cursor-pointer hover:bg-red-600 transition-colors duration-200">
                      Delete
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-white text-center">No archived notes as of now.</p>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ArchivePage;

import React, { useCallback, useEffect, useState } from "react";
import Header from "./shared/Header";
import Searchbar from "./Searchbar";
import Footer from "./shared/Footer";
import { Button } from "./ui/button";
import { binApi } from "@/api/api";
import { toast } from "react-toastify";

type Note = {
  _id: string;
  title: string;
  description: string;
  slug: string;
};

const BinPage: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);

  const displayBinNotes = useCallback(async () => {
    try {
      const response = await binApi.fetchDeletedNotes();
      const binNotesList = response?.data?.notes;
      setNotes(binNotesList);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to fetch Deleted Notes");
    }
  }, []);

  useEffect(() => {
    displayBinNotes();
  }, [displayBinNotes]);

  const restoreNote = async (noteId: string) => {
    try {
      await binApi.restoreFromBin(noteId);
      toast.success("Note Restored");
      setNotes((prevNotes) => prevNotes.filter((note) => note._id !== noteId));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to restore the note");
    }
  };

  const deleteNote = async (noteId: string) => {
    try {
      await binApi.deleteFromBin(noteId);
      toast.success("Note Deleted");
      setNotes((prevNotes) => prevNotes.filter((note) => note._id !== noteId));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete the note");
    }
  };

  const clearBinPage = async () => {
      try {
        await binApi.clearBin();
        toast.success("All Notes in Bin Deleted");
        setNotes([]);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Failed to clear the bin page");
      }
    };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <div className="bg-zinc-900 w-full flex-grow">
        <Searchbar />

        <section className="my-8 mx-5 flex flex-col sm:flex-row text-center gap-4 items-center justify-between">
          <h3 className="text-white text-2xl">Here are your deleted notes...</h3>
          <Button onClick={clearBinPage} className="bg-[#CA2B58] hover:bg-red-800 px-4 py-2 text-white rounded-md cursor-pointer w-fit">
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
            <p className="text-white text-center">No deleted notes as of now.</p>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default BinPage;

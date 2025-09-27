import React, { useCallback, useEffect, useState } from "react";
import Header from "./shared/Header";
import Footer from "./shared/Footer";
import { Link, useParams } from "react-router-dom";
import { notesApi, profileApi } from "@/api/api";
import { toast } from "react-toastify";
import Searchbar from "./Searchbar";
import { Button } from "./ui/button";

const NotesPage: React.FC = () => {
  const params = useParams();
  const [personName, setPersonName] = useState("");
  type Note = {
    _id: string;
    title: string;
    description: string;
    slug: string;
  };

  const [notes, setNotes] = useState<Note[]>([]);

  const displayNotes = useCallback(async () => {
    try {
      const response = await notesApi.fetchNotes();
      const noteList = response?.data?.notes || [];
      setNotes(noteList);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to fetch Notes");
    }
  }, []);

  useEffect(() => {
    displayNotes();
  }, [displayNotes]);

  const displayProfile = useCallback(async () => {
    try {
      if (!params.username) return;
      const response = await profileApi.getProfile(params.username);
      const name = response?.data?.user?.name;
      setPersonName(name);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to load profile");
    }
  }, [params.username]);

  useEffect(() => {
    displayProfile();
  }, [displayProfile]);

  const deleteNote = async (noteId: string) => {
    try {
      console.log(noteId);
      const response = await notesApi.deleteNote(noteId);
      console.log(response);
      
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete the note");
    }
  };

  const archiveNote = async () => {
    try {
      const response = await notesApi.archiveNote(notes._id);

    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to archive the note");
    }
  }

  const clearNotesPage = async () => {
    try {
      
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to clear the note page");
      
    }
  }
  
  
  

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <div className="bg-zinc-900 w-full flex-grow p-5">
        <Searchbar />

        {/* Notes Header */}
        <section className="my-8 mx-5 flex flex-col sm:flex-row gap-4 text-center justify-between items-center">
          <h3 className="text-white text-2xl">
            Your notes are here, <span className="text-[#CA2B58]">{personName}</span>
          </h3>
          <Button onClick={clearNotesPage} className="bg-[#CA2B58] hover:bg-red-800 px-4 py-2 text-white rounded-md cursor-pointer">Clear All</Button>
        </section>

        {/* Notes List */}
        <div className="notes p-5 w-full xl:w-[77rem] mx-auto">
          {notes.length > 0 ? (
            <ul className="list-none flex gap-5 flex-wrap justify-center xl:justify-start">
              {notes.map((note) => (
                <li key={note._id} className="p-4 mb-2 rounded-md w-96 overflow-hidden bg-zinc-800 text-zinc-400">
                  <Link to={`/notes/${note.slug}`} className="font-bold text-2xl mb-2 inline-block text-blue-500">
                    {note.title}
                  </Link>
                  <p className="h-24 overflow-hidden">{note.description}</p>
                  <div className="btns mt-5 flex justify-between">
                    <Button onClick={deleteNote} className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded cursor-pointer transition-colors duration-200">Delete</Button>
                    <Button onClick={archiveNote} className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded cursor-pointer transition-colors duration-200">Archive</Button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-white text-center">No notes as of now.</p>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default NotesPage;

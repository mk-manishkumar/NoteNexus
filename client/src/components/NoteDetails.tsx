import React, { useCallback, useEffect, useState } from "react";
import Header from "./shared/Header";
import Footer from "./shared/Footer";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { notesApi } from "@/api/api";

type Note = {
  title: string;
  description: string;
  slug: string;
};

const NoteDetails: React.FC = () => {
  const params = useParams();
  const { noteid } = useParams();
  const [note, setNote] = useState<Note>({ title: "", description: "", slug: "" });

  const fetchNote = useCallback(async (noteid: string) => {
    try {
      const response = await notesApi.getNote(noteid);
      const noteDetails = response?.data?.note;
      setNote(noteDetails);
    } catch (error) {
      if (import.meta.env.VITE_ENV === "development") console.log(error);
      toast.error("Failed to fetch the Note");
    }
  }, []);

  useEffect(() => {
    if (noteid) fetchNote(noteid);
  }, [fetchNote, noteid]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <div className="bg-zinc-900 w-full flex-grow p-8 flex items-center justify-center">
        <div className="max-w-4xl mx-auto w-full">
          {/* Note Container */}
          <div className="relative">
            {/* Glowing background */}
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 via-blue-500/10 to-purple-500/10 rounded-3xl blur-2xl"></div>

            {/* Content Card */}
            <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl">
              {/* Title */}
              <h2 className="text-4xl md:text-5xl font-bold text-center mb-8 bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">{note.title}</h2>

              {/* Description */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 md:p-8 mb-8">
                <p className="text-white/90 text-lg leading-relaxed text-center">{note.description}</p>
              </div>

              {/* Edit Button */}
              <div className="flex justify-center">
                <Link
                  to={`/profile/${params.username}/editnote/${note.slug}`}
                  className="relative bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500  text-white font-semibold px-8 py-3 rounded-xl  transition-all duration-300
                    hover:shadow-lg hover:shadow-blue-500/30 hover:scale-105 active:scale-95 inline-block overflow-hidden group"
                >
                  <span className="relative z-10">Edit Note</span>
                  {/* Shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default NoteDetails;

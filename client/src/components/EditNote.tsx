import React, { useCallback, useEffect, useState } from "react";
import Header from "./shared/Header";
import Footer from "./shared/Footer";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { notesApi } from "@/api/api";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";

type Note = {
  title: string;
  description: string;
  slug: string;
};

const EditNote: React.FC = () => {
  const { noteid, username } = useParams();
  const navigate = useNavigate();
  const [focusedField, setFocusedField] = useState<string | null>(null);
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

  const submitHandler = async (e: React.FormEvent, noteid: string | undefined) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;

    if (!noteid) {
      toast.error("Note id is missing.");
      return;
    }

    try {
      const response = await notesApi.updateNote(noteid, { title, description });
      const editDetails = response?.data?.note;
      setNote(editDetails);
      navigate(`/profile/${username}/note/${noteid}`)
      toast.success("Note Updated");
    } catch (error) {
      if (import.meta.env.VITE_ENV === "development") console.log(error);
      toast.error("Failed to update the Note");
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <div className="bg-zinc-900 w-full flex-grow p-8">
        <div className="max-w-3xl mx-auto">
          {/* Header Section */}
          <div className="mb-8 text-center">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent mb-2">Edit Note</h2>
            <p className="text-gray-400">Make changes to your note below</p>
          </div>

          {/* Form Container */}
          <form onSubmit={(e) => submitHandler(e, noteid)} method="post" className="relative">
            {/* Background glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 via-emerald-500/10 to-green-500/10 rounded-2xl blur-xl"></div>

            <div className="relative bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 shadow-2xl">
              {/* Title Field */}
              <div className="mb-6 relative group">
                <Label htmlFor="title" className="block mb-3 text-white font-semibold text-lg">
                  Title
                </Label>
                <div className="relative">
                  <Input
                    type="text"
                    name="title"
                    id="title"
                    defaultValue={note.title}
                    className={`
                      w-full bg-white/10 backdrop-blur-sm text-white placeholder-gray-400 
                      px-4 py-7 rounded-xl outline-none border border-white/20
                      transition-all duration-300
                      ${focusedField === "title" ? "border-green-400 shadow-lg shadow-green-500/25 bg-white/15" : "hover:border-white/30"}
                    `}
                    onFocus={() => setFocusedField("title")}
                    onBlur={() => setFocusedField(null)}
                    required
                  />
                  {/* Focus indicator */}
                  {focusedField === "title" && <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl pointer-events-none"></div>}
                </div>
              </div>

              {/* Description Field */}
              <div className="mb-8 relative group">
                <Label htmlFor="description" className="block mb-3 text-white font-semibold text-lg">
                  Description
                </Label>
                <div className="relative">
                  <Textarea
                    id="description"
                    name="description"
                    defaultValue={note.description}
                    className={`
                      w-full p-4 rounded-xl bg-white/10 backdrop-blur-sm text-white 
                      placeholder-gray-400 outline-none resize-none h-52 border border-white/20
                      transition-all duration-300
                      ${focusedField === "description" ? "border-green-400 shadow-lg shadow-green-500/25 bg-white/15" : "hover:border-white/30"}
                    `}
                    onFocus={() => setFocusedField("description")}
                    onBlur={() => setFocusedField(null)}
                    required
                  />
                  {/* Focus indicator */}
                  {focusedField === "description" && <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl pointer-events-none"></div>}
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <Button
                  type="submit"
                  className="
                    relative bg-gradient-to-r from-green-500 to-emerald-600 
                    hover:from-green-400 hover:to-emerald-500
                    text-white font-semibold px-8 py-6 rounded-xl
                    transition-all duration-300
                    hover:shadow-lg hover:shadow-green-500/30
                    hover:scale-105 active:scale-95
                    overflow-hidden group
                  "
                >
                  <span className="relative z-10">Save Changes</span>
                  {/* Shine effect on hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                </Button>
              </div>
            </div>
          </form>

          {/* Decorative elements */}
          <div className="mt-4 flex justify-center gap-2">
            <div className="w-2 h-2 bg-green-400/40 rounded-full"></div>
            <div className="w-2 h-2 bg-emerald-400/40 rounded-full"></div>
            <div className="w-2 h-2 bg-green-400/40 rounded-full"></div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default EditNote;

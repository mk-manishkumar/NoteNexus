import React, { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { notesApi } from "@/api/api";
import { useParams } from "react-router";
import { useUserProfile } from "@/customHooks/useUserProfile";

const MotionInput = motion.create(Input);
const MotionTextarea = motion.create(Textarea);
const MotionButton = motion.create(Button);
const MotionLink = motion.create(Link);

type NoteData = {
  title: string;
  description: string;
};

const particles = [
  { id: 1, x: "20%", y: "30%" },
  { id: 2, x: "50%", y: "80%" },
  { id: 3, x: "75%", y: "40%" },
  { id: 4, x: "10%", y: "60%" },
  { id: 5, x: "90%", y: "15%" },
  { id: 6, x: "40%", y: "95%" },
];

const NoteForm: React.FC = () => {
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [noteForm, setNoteForm] = useState<NoteData>({ title: "", description: "" });
  const [loading, setLoading] = useState(false);

  const params = useParams();
  const { profile } = useUserProfile(params.username);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNoteForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Add Note Function
  const addNoteHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteForm.title || !noteForm.description) {
      toast.error("All fields are required.");
      return;
    }
    setLoading(true);
    try {
      await notesApi.addNote(noteForm);
      setNoteForm({ title: "", description: "" });
      toast.success("Notes Added");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to add Note");
    } finally {
      setLoading(false);
    }
  };

  // ================================= ANIMATION VARIANTS ===================================
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const buttonVariants = {
    hover: { scale: 1.05, boxShadow: "0 10px 30px rgba(74, 144, 226, 0.3)", transition: { duration: 0.2 } },
    tap: { scale: 0.95 },
  };

  const profileButtonVariants = {
    hover: { scale: 1.05, boxShadow: "0 10px 30px rgba(202, 43, 88, 0.3)", background: "linear-gradient(135deg, #CA2B58, #E63578)", transition: { duration: 0.2 } },
    tap: { scale: 0.95 },
  };

  const inputVariants = {
    focus: { scale: 1.02, boxShadow: "0 0 20px rgba(74, 144, 226, 0.2)", borderColor: "#4A90E2", transition: { duration: 0.2 } },
    blur: { scale: 1, boxShadow: "0 0 0px rgba(74, 144, 226, 0)", borderColor: "transparent", transition: { duration: 0.2 } },
  };

  return (
    <div className="bg-zinc-800 flex flex-col flex-grow w-full">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-20 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl"
          animate={{
            x: [0, -80, 0],
            y: [0, 60, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>

      <motion.div className="relative z-10 flex flex-col w-full flex-grow" variants={containerVariants} initial="hidden" animate="visible">
        {/* User Greeting and Edit Profile */}
        <motion.section className="my-8 flex flex-col gap-4 items-center justify-between mx-8 sm:flex-row" variants={itemVariants}>
          <motion.h3 className=" text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent" whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 300 }}>
            Hello, <span className="bg-gradient-to-r from-[#CA2B58] to-[#E63578] bg-clip-text text-transparent">{profile?.name}</span>
          </motion.h3>
          <MotionLink to={"/profile/edit/johndoe"} className="bg-gradient-to-r from-[#CA2B58] to-[#E63578] text-white px-6 py-3 rounded-xl cursor-pointer font-semibold shadow-lg backdrop-blur-sm border border-pink-500/20" variants={profileButtonVariants} whileHover="hover" whileTap="tap">
            Edit Profile
          </MotionLink>
        </motion.section>

        {/* Add Note Form */}
        <motion.form onSubmit={addNoteHandler} className="mt-12 flex flex-col items-center px-5 space-y-6" variants={itemVariants}>
          <motion.div className="w-full lg:w-1/3 relative">
            <MotionInput
              className="block w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-xl py-6 px-4 outline-none text-white placeholder-gray-300 shadow-lg transition-all duration-300"
              type="text"
              placeholder="Enter Title"
              name="title"
              value={noteForm.title}
              onChange={handleChange}
              required
              variants={inputVariants}
              animate={focusedField === "title" ? "focus" : "blur"}
              onFocus={() => setFocusedField("title")}
              onBlur={() => setFocusedField(null)}
              whileFocus={{
                scale: 1.02,
                transition: { type: "spring", stiffness: 300 },
              }}
            />
            <motion.div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400/20 to-purple-400/20 pointer-events-none" initial={{ opacity: 0 }} animate={{ opacity: focusedField === "title" ? 1 : 0 }} transition={{ duration: 0.2 }} />
          </motion.div>

          <motion.div className="w-full lg:w-1/3 relative">
            <MotionTextarea
              name="description"
              placeholder="Enter description"
              value={noteForm.description}
              onChange={handleChange}
              className="block w-full h-52 rounded-xl outline-none px-6 py-4 bg-white/10 backdrop-blur-md border border-white/20 resize-none text-white placeholder-gray-300 shadow-lg transition-all duration-300"
              required
              variants={inputVariants}
              animate={focusedField === "description" ? "focus" : "blur"}
              onFocus={() => setFocusedField("description")}
              onBlur={() => setFocusedField(null)}
              whileFocus={{
                scale: 1.02,
                transition: { type: "spring", stiffness: 300 },
              }}
            />
            <motion.div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400/20 to-purple-400/20 pointer-events-none" initial={{ opacity: 0 }} animate={{ opacity: focusedField === "description" ? 1 : 0 }} transition={{ duration: 0.2 }} />
          </motion.div>

          <MotionButton className="bg-gradient-to-r from-[#CA2B58] to-[#E63578] text-white w-full rounded-xl p-6 lg:w-1/3 cursor-pointer font-semibold shadow-xl border border-blue-500/30 backdrop-blur-sm" type="submit" variants={buttonVariants} whileHover="hover" whileTap="tap" disabled={loading}>
            {loading ? "Adding..." : "Add Note"}
          </MotionButton>

          <MotionLink className="text-blue-400 cursor-pointer font-medium hover:text-blue-300 transition-colors duration-300 relative group" to={`/profile/${params.username}/notes`} whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 300 }}>
            <span className="relative z-10">Click here to see Notes.</span>
            <motion.div className="absolute inset-0 bg-blue-400/10 rounded-lg -z-0" initial={{ scale: 0, opacity: 0 }} whileHover={{ scale: 1, opacity: 1 }} transition={{ duration: 0.2 }} />
          </MotionLink>
        </motion.form>
      </motion.div>

      {/* Floating particles effect */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-2 h-2 bg-white/20 rounded-full"
            style={{
              left: particle.x,
              top: particle.y,
            }}
            animate={{
              y: [-20, -100, -20],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default NoteForm;

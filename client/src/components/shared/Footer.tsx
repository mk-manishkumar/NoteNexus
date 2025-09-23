import React from "react";
import { motion } from "framer-motion";

const Footer: React.FC = () => {
  return (
    <motion.footer className="relative p-4 overflow-hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
      {/* Beautiful animated background */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-[#CA2B58] via-[#E63578] to-[#CA2B58]"
        animate={{
          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{
          backgroundSize: "300% 100%",
        }}
      />

      {/* Simple content */}
      <p className="text-center text-white text-xl tracking-tight relative z-10">NoteNexus &copy; 2024</p>
    </motion.footer>
  );
};

export default Footer;

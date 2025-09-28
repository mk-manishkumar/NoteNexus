import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

type ErrorProps = {
  code?: number;
  title?: string;
  message?: string;
};

const ErrorPage: React.FC<ErrorProps> = ({ code = 404, title = code === 404 ? "Oops! Page Not Found" : "Something Went Wrong", message = code === 404 ? "The page you're looking for doesn't exist or has been moved." : "An unexpected error has occurred. Please try again later." }) => (
  <div className="bg-gray-900 text-white min-h-screen flex flex-col items-center justify-center ">
    <motion.header className="bg-[#CA2B58] p-5 w-full" initial={{ y: -40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ type: "spring", damping: 20, stiffness: 120 }}>
      <h1 className="font-[cursive] text-center text-white text-2xl tracking-tight">NoteNexus</h1>
    </motion.header>

    <main className="flex-grow flex flex-col items-center justify-center">
      <h1 className={`font-bold ${code === 404 ? "text-6xl" : "text-5xl"} text-red-500`}>{code}</h1>
      <h2 className="text-2xl mt-4">{title}</h2>
      <p className="text-gray-400 mt-2 text-center max-w-md">{message}</p>
      <Link to="/" className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
        Go Back Home
      </Link>
    </main>

    <footer className="bg-[#CA2B58] p-4 relative z-10 w-full">
      <p className="text-center text-white text-xl tracking-tight">NoteNexus &copy; 2024</p>
    </footer>
  </div>
);

export default ErrorPage;

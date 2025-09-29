import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { MdLogout } from "react-icons/md";
import { FaBars, FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";
import { authApi } from "@/api/api";

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const params = useParams();
  const username = params.username;

  const handleLogout = async () => {
    try {
      await authApi.logout();
      toast.success("Logged out successfully!");
      navigate("/login");
    } catch (error) {
      toast.error("Logout failed. Please try again.");
      if (import.meta.env.VITE_ENV === "development") console.error("Logout error:", error);
    }
  };

  return (
    <nav className="flex justify-between bg-[#CA2B58] text-white py-5 px-1 md:p-5 relative">
      {/* Logo */}
      <div className="logo">
        <Link to={`/profile/${username}`} className="text-2xl cursor-pointer tracking-tight ml-8 font-[cursive]">
          NoteNexus
        </Link>
      </div>

      {/* Hamburger Icon */}
      <div className="hamburger md:hidden flex items-center mr-8">
        <button className="menu-toggle" type="button" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <FaTimes size={28} /> : <FaBars size={28} />}
        </button>
      </div>

      {/* Desktop Menu */}
      <div className="nav-items md:flex gap-8 mr-8 items-center text-md hidden">
        <Link to={`/profile/${username}/notes`}>NOTES</Link>
        <Link to={`/profile/${username}/bin`}>BIN</Link>
        <Link to={`/profile/${username}/archive`}>ARCHIVE</Link>
        <button onClick={handleLogout} className="flex items-center gap-1 focus:outline-none hover:opacity-80 transition-opacity cursor-pointer" aria-label="Logout" type="button">
          <MdLogout size={20} />
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 w-full bg-[#CA2B58] flex flex-col items-center py-5 gap-5 md:hidden z-50">
          <Link to={`/profile/${username}/notes`} className="w-full text-center border-t border-white pt-[10px]" onClick={() => setIsOpen(false)}>
            NOTES
          </Link>
          <Link to={`/profile/${username}/bin`} className="w-full text-center border-t border-white pt-[10px]" onClick={() => setIsOpen(false)}>
            BIN
          </Link>
          <Link to={`/profile/${username}/archive`} className="w-full text-center border-t border-white pt-[10px]" onClick={() => setIsOpen(false)}>
            ARCHIVE
          </Link>
          <button
            onClick={() => {
              setIsOpen(false);
              handleLogout();
            }}
            className="w-full text-center border-t border-white pt-[10px]"
            type="button"
          >
            LOG OUT
          </button>
        </div>
      )}
    </nav>
  );
};

export default Header;

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { MdLogout } from "react-icons/md";
import { FaBars, FaTimes } from "react-icons/fa";

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="flex justify-between bg-[#CA2B58] text-white py-5 px-1 md:p-5 relative">
      {/* Logo */}
      <div className="logo">
        <Link to={"/profile"} className="text-2xl cursor-pointer tracking-tight ml-8 font-[cursive]">
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
        <Link to={"/notes"}>NOTES</Link>
        <Link to={"/bin"}>BIN</Link>
        <Link to={"/archive"}>ARCHIVE</Link>
        <Link to={"/logout"}>
          <MdLogout size={20} />
        </Link>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 w-full bg-[#CA2B58] flex flex-col items-center py-5 gap-5 md:hidden z-50">
          <Link to={"/notes"} className="w-full text-center border-t border-white pt-[10px]" onClick={() => setIsOpen(false)} >
            NOTES
          </Link>
          <Link to={"/bin"} className="w-full text-center border-t border-white pt-[10px]" onClick={() => setIsOpen(false)}>
            BIN
          </Link>
          <Link to={"/archive"} className="w-full text-center border-t border-white pt-[10px]" onClick={() => setIsOpen(false)}>
            ARCHIVE
          </Link>
          <Link to={"/logout"} className="w-full text-center border-t border-white pt-[10px]" onClick={() => setIsOpen(false)}>
            LOG OUT
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Header;

import React, { useState } from 'react'
import { CiSearch } from "react-icons/ci";
import { Button } from "./ui/button";
import { Input } from "./ui/input";


export const Searchbar : React.FC = () => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="mt-8 px-5">
      <form className="flex items-center max-w-md mx-auto relative group">
        {/* Background effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-full blur-xl opacity-70 group-hover:opacity-100 transition-opacity duration-300"></div>

        {/* Input field */}
        <Input
          type="search"
          name="search"
          placeholder="Search for notes..."
          className={`
                relative z-10 w-full px-6 py-3 h-12 text-white placeholder-gray-300 outline-none 
                bg-white/10 backdrop-blur-md border border-white/20 rounded-l-full border-r-0
                focus:border-blue-400 focus:bg-white/15 transition-all duration-300
                ${isFocused ? "shadow-lg shadow-blue-500/25" : "shadow-md shadow-black/25"}
              `}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />

        {/* Search button */}
        <Button
          type="submit"
          aria-label="Search"
          className="
                relative z-10 bg-gradient-to-r from-blue-600 to-purple-600 
                hover:from-blue-500 hover:to-purple-500 
                border border-white/20 border-l-0 rounded-r-full 
                text-white flex items-center justify-center px-4 h-12
                transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25
                hover:scale-105 active:scale-95
              "
        >
          <CiSearch size={20} />
        </Button>
      </form>
    </div>
  );
}

export default Searchbar
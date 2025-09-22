import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";

const inputClassName = "block w-full sm:w-96 bg-transparent mb-4 rounded-md border-zinc-700 px-4 py-2 border-[1px] outline-none text-zinc-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors";

const Login: React.FC = () => {
  const [error] = useState<string | null>(null);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="bg-zinc-900 w-full flex-grow">
        <header className="bg-[#CA2B58] p-5">
          <h1 className="font-[cursive] text-center text-white text-2xl tracking-tight">NoteNexus</h1>
        </header>

        <section>
          <h2 className="text-center text-white mt-8 text-2xl">Login to NoteNexus</h2>
        </section>

        <div className="mt-12 flex flex-col items-center px-4">
          <Input className={inputClassName} type="email" placeholder="Enter email" name="email" required />
          <Input className={inputClassName} type="password" placeholder="Enter password" name="password" required />

          {error && <p className="text-red-500 mb-4">{error}</p>}

          <Button className="bg-blue-500 hover:bg-blue-600 text-white w-full sm:w-96 rounded-md px-4 py-2 mb-3 transition-colors cursor-pointer">Login</Button>

          <p className="text-white">
            Don't have an account?{" "}
            <Link to={"/"} className="text-blue-500 hover:text-blue-400 underline transition-colors cursor-pointer">
              Click here to register.
            </Link>
          </p>
        </div>
      </div>
      <footer className="bg-[#CA2B58] p-4">
        <p className="text-center text-white text-xl tracking-tight">NoteNexus &copy; 2024</p>
      </footer>
    </div>
  );
};

export default Login;

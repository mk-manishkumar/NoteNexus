import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "../ui/button";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { authApi } from "@/api/api";
import { Spinner } from "@/components/ui/spinner";

const inputClassName = "block w-full sm:w-96 bg-transparent mb-4 rounded-md border-zinc-700 px-4 py-2 border-[1px] outline-none text-zinc-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors";

type RegisterFormData = {
  username: string;
  name: string;
  email: string;
  age: string;
  password: string;
};

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [form, setForm] = useState<RegisterFormData>({
    username: "",
    name: "",
    email: "",
    age: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.username || !form.name || !form.email || !form.age || !form.password) {
      toast.error("All fields are required.");
      return;
    }
    setLoading(true);

    // Connect with API
    try {
      const payload = {
        ...form,
        age: Number(form.age),
      };
      const response = await authApi.register(payload);
      const username = response?.data?.user?.username;
      toast.success("Registration successful!");
      setForm({ username: "", name: "", email: "", age: "", password: "" });
      navigate(`/profile/${username}`);
    } catch (error) {
      if (import.meta.env.VITE_ENV === "development") console.log(error);
      toast.error("Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  const guestSignIn = async () => {
    try {
      const response = await authApi.guestSignIn();
      const username = response?.data?.user?.username;
      toast.success("Guest Signin successful!");
      navigate(`/profile/${username}`);
      window.location.reload();
    } catch (error) {
      if (import.meta.env.VITE_ENV === "development") console.log(error);
      toast.error("Guest SignIn failed.");
    }
  };

  useEffect(() => {
    authApi
      .checkAuth()
      .then((res) => {
        if (res?.data?.success && res.data?.user?.username) {
          navigate(`/profile/${res.data.user.username}`, { replace: true });
        } else {
          setCheckingAuth(false);
        }
      })
      .catch(() => {
        setCheckingAuth(false);
      });
  }, [navigate]);
  

  if (checkingAuth) {
    return (
      <div className="flex flex-col min-h-screen bg-zinc-900">
        <motion.header className="bg-[#CA2B58] p-5" initial={{ y: -40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ type: "spring", damping: 20, stiffness: 120 }}>
          <h1 className="font-[cursive] text-center text-white text-2xl tracking-tight">NoteNexus</h1>
        </motion.header>
        <div className="flex flex-grow justify-center items-center">
          <Spinner className="size-8" />
        </div>
        <footer className="bg-[#CA2B58] p-4">
          <p className="text-center text-white text-xl tracking-tight">NoteNexus &copy; 2024</p>
        </footer>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden">
      <div className="bg-zinc-900 w-full flex-grow relative z-10">
        <motion.header className="bg-[#CA2B58] p-5" initial={{ y: -40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ type: "spring", damping: 20, stiffness: 120 }}>
          <h1 className="font-[cursive] text-center text-white text-2xl tracking-tight">NoteNexus</h1>
        </motion.header>

        <motion.section initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <h2 className="text-center text-white mt-8 text-2xl">Register for NoteNexus</h2>
        </motion.section>

        {/* Registeration Form */}
        <motion.form className="mt-12 flex flex-col items-center px-4" initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.08 } }, hidden: {} }} onSubmit={handleSubmit}>
          {/* Username */}
          <motion.div variants={{ visible: { opacity: 1, y: 0 }, hidden: { opacity: 0, y: 20 } }}>
            <Input className={inputClassName} type="text" placeholder="Enter username" name="username" value={form.username} onChange={handleChange} required />
          </motion.div>
          {/* Name */}
          <motion.div variants={{ visible: { opacity: 1, y: 0 }, hidden: { opacity: 0, y: 20 } }}>
            <Input className={inputClassName} type="text" placeholder="Enter name" name="name" value={form.name} onChange={handleChange} required />
          </motion.div>
          {/* Email */}
          <motion.div variants={{ visible: { opacity: 1, y: 0 }, hidden: { opacity: 0, y: 20 } }}>
            <Input className={inputClassName} type="email" placeholder="Enter email" name="email" value={form.email} onChange={handleChange} required />
          </motion.div>
          {/* Age */}
          <motion.div variants={{ visible: { opacity: 1, y: 0 }, hidden: { opacity: 0, y: 20 } }}>
            <Input className={inputClassName} type="number" placeholder="Enter age" name="age" value={form.age} onChange={handleChange} required />
          </motion.div>
          {/* Password */}
          <motion.div variants={{ visible: { opacity: 1, y: 0 }, hidden: { opacity: 0, y: 20 } }}>
            <Input className={inputClassName} type="password" placeholder="Enter password" name="password" value={form.password} onChange={handleChange} required />
          </motion.div>

          {/* Submit Button */}
          <motion.button type="submit" whileHover={{ scale: loading ? 1 : 1.04, boxShadow: loading ? "none" : "0 2px 12px #60a5fa33" }} whileTap={{ scale: loading ? 1 : 0.96 }} disabled={loading} className="bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white w-full sm:w-96 rounded-md px-4 py-2 mb-3 transition-colors cursor-pointer font-semibold">
            {loading ? "Registering..." : "Register"}
          </motion.button>

          {/* Link to Login */}
          <motion.p variants={{ visible: { opacity: 1 }, hidden: { opacity: 0 } }} className="text-white">
            Already have an account?{" "}
            <motion.span whileHover={{ scale: 1.05, color: "#38bdf8" }} className="text-blue-500 hover:text-blue-400 underline transition-colors cursor-pointer">
              <Link to={"/login"}>Click here to login.</Link>
            </motion.span>
          </motion.p>
        </motion.form>

        <motion.div className="mt-4 flex justify-center" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <Button asChild className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 font-semibold rounded-md transition-colors cursor-pointer relative overflow-hidden" onClick={guestSignIn}>
            <motion.span
              whileTap={{ scale: 0.95 }}
              whileHover={{
                scale: 1.04,
                backgroundColor: "rgba(16, 185, 129, 0.08)",
              }}
              transition={{ type: "spring", stiffness: 250, damping: 15 }}
              className="relative z-10"
            >
              Guest Sign-in
            </motion.span>
          </Button>
        </motion.div>
      </div>

      <footer className="bg-[#CA2B58] p-4 relative z-10">
        <p className="text-center text-white text-xl tracking-tight">NoteNexus &copy; 2024</p>
      </footer>
    </div>
  );
};

export default Signup;

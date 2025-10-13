import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "../ui/button";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { authApi } from "@/api/api";
import { Spinner } from "@/components/ui/spinner";

const inputClassName = "block w-full sm:w-96 bg-transparent mb-4 rounded-md border-zinc-700 px-4 py-2 border-[1px] outline-none text-zinc-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors";

type LoginFormData = {
  email: string;
  password: string;
};

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [form, setForm] = useState<LoginFormData>({ email: "", password: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      toast.error("Both email and password are required.");
      return;
    }
    setLoading(true);
    try {
      const response = await authApi.login(form);
      const username = response?.data?.user?.username;
      toast.success("Login successful!");
      setForm({ email: "", password: "" });
      navigate(`/profile/${username}`);
    } catch (error) {
      if (import.meta.env.VITE_ENV === "development") console.log(error);
      toast.error("Incorrect email and password");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    authApi
      .checkAuth()
      .then((res) => {
        if (res.status === 200 && res?.data?.success && res.data?.user?.username) {
          navigate(`/profile/${res.data.user.username}`, { replace: true });
        } else {
          setCheckingAuth(false);
        }
      })
      .catch((error) => {
        if (import.meta.env.VITE_ENV === "development") console.error("checkAuth error details:", error);
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

        <motion.section initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22 }}>
          <h2 className="text-center text-white mt-8 text-2xl">Login to NoteNexus</h2>
        </motion.section>

        <motion.form
          className="mt-12 flex flex-col items-center px-4"
          initial="hidden"
          animate="visible"
          variants={{
            visible: { transition: { staggerChildren: 0.07 } },
            hidden: {},
          }}
          onSubmit={handleSubmit}
        >
          <motion.div variants={{ visible: { opacity: 1, y: 0 }, hidden: { opacity: 0, y: 20 } }}>
            <Input className={inputClassName} type="email" placeholder="Enter email" name="email" value={form.email} onChange={handleChange} required />
          </motion.div>
          <motion.div variants={{ visible: { opacity: 1, y: 0 }, hidden: { opacity: 0, y: 20 } }}>
            <Input className={inputClassName} type="password" placeholder="Enter password" name="password" value={form.password} onChange={handleChange} required />
          </motion.div>

          <motion.div variants={{ visible: { opacity: 1, y: 0 }, hidden: { opacity: 0, y: 10 } }} className="w-full sm:w-96">
            <Button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white w-full rounded-md px-4 py-2 mb-3 transition-colors cursor-pointer font-semibold" disabled={loading}>
              <motion.span whileHover={loading ? undefined : { scale: 1.04, boxShadow: "0 2px 12px #60a5fa33" }} whileTap={loading ? undefined : { scale: 0.96 }} transition={{ type: "spring", stiffness: 250, damping: 15 }} className="relative z-10">
                {loading ? "Logging in..." : "Login"}
              </motion.span>
            </Button>
          </motion.div>

          <motion.p variants={{ visible: { opacity: 1 }, hidden: { opacity: 0 } }} className="text-white">
            Don't have an account?{" "}
            <motion.span whileHover={{ scale: 1.05, color: "#38bdf8" }} className="text-blue-500 hover:text-blue-400 underline transition-colors cursor-pointer">
              <Link to={"/"}>Click here to register.</Link>
            </motion.span>
          </motion.p>
        </motion.form>
      </div>

      <footer className="bg-[#CA2B58] p-4 relative z-10">
        <p className="text-center text-white text-xl tracking-tight">NoteNexus &copy; 2024</p>
      </footer>
    </div>
  );
};

export default Login;

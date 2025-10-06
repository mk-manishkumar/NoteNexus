import React, { useState } from "react";
import Header from "./shared/Header";
import Footer from "./shared/Footer";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";

const DeleteProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { username } = useParams<{ username?: string }>();
  const [isFocused, setIsFocused] = useState(false);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const params = useParams<{ username?: string }>();
  const navigate = useNavigate();

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!password) {
      toast.error("Password is required.");
      return;
    }
    if (!params.username) {
      toast.error("Username is missing from URL.");
      return;
    }

    setLoading(true);
    try {
      // Adjust API signature if your delete API expects differently
      await profileApi.deleteProfile(params.username, { password });
      toast.success("Profile deleted permanently.");
      // Optionally: logout user, redirect to home or login
      navigate("/login");
    } catch (error) {
      if (import.meta.env.VITE_ENV === "development") console.log(error);
      toast.error("Failed to delete profile. Please check your password.");
    } finally {
      setLoading(false);
      setPassword("");
    }
  };

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    try {
      
    } catch (error) {
      if (import.meta.env.VITE_ENV === "development") console.log(error);
      const message = error instanceof Error ? error.message : "Failed to change password";
      toast.error(message);
    }
  }
  

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <div className="bg-zinc-900 w-full flex-grow p-8 flex items-center justify-center">
        <div className="max-w-2xl mx-auto w-full">
          {/* Header Section */}
          <div className="mb-8 text-center">
            <h3 className="text-4xl font-bold bg-gradient-to-r from-red-500 to-rose-600 bg-clip-text text-transparent">
              Delete Profile
            </h3>
            <p className="text-gray-400 mt-2">This action cannot be undone</p>
          </div>

          {/* Warning Container */}
          <div className="relative">
            {/* Glowing background */}
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 via-rose-500/10 to-red-500/10 rounded-2xl blur-xl"></div>

            <div className="relative bg-white/5 backdrop-blur-sm border border-red-500/20 rounded-2xl p-8 shadow-2xl">
              {/* Warning Icon */}
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center border border-red-500/30">
                  <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
              </div>

              {/* Warning Text */}
              <div className="text-center mb-8">
                <p className="text-white text-xl font-semibold mb-3">
                  Are you sure you want to delete your profile?
                </p>
                <p className="text-gray-300">
                  Please enter your{" "}
                  <strong className="text-red-400 font-bold">password</strong> to confirm deletion.
                </p>
              </div>

              {/* Delete Form */}
              <form onSubmit={submitHandler} className="space-y-6">
                {/* Password Field */}
                <div>
                  <Label
                    htmlFor="password"
                    className="block text-white font-semibold mb-4 text-center"
                  >
                    Password
                  </Label>
                  <Input
                    type="password"
                    name="password"
                    className={`
                      w-full bg-white/10 backdrop-blur-sm text-white placeholder-gray-400 
                      py-6 rounded-xl outline-none border border-white/20
                      transition-all duration-300
                      ${isFocused ? "border-red-400 shadow-lg shadow-red-500/25 bg-white/15" : "hover:border-white/30"}
                    `}
                    placeholder="Enter your password"
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>

                {/* Delete Button */}
                <Button
                  type="submit"
                  className={`
                    w-full bg-gradient-to-r from-red-600 to-rose-700 
                    hover:from-red-500 hover:to-rose-600
                    text-white font-semibold p-6 rounded-xl
                    transition-all duration-300
                    hover:shadow-lg hover:shadow-red-500/30
                    hover:scale-105 active:scale-95
                    overflow-hidden group relative
                    ${loading ? "opacity-60 cursor-not-allowed" : ""}
                  `}
                  disabled={loading}
                >
                  <span className="relative z-10">{loading ? "Deleting..." : "Delete Profile Permanently"}</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                </Button>
              </form>

              {/* Additional Warning */}
              <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                <p className="text-red-300 text-sm text-center">
                  ⚠️ Warning: This will permanently delete your account and all associated data. This action cannot be reversed.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default DeleteProfilePage;
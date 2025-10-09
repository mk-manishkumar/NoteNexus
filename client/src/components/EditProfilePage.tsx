import React, { useState } from "react";
import Header from "./shared/Header";
import Footer from "./shared/Footer";
import { useUserProfile } from "@/customHooks/useUserProfile";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { profileApi } from "@/api/api";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";

const EditProfilePage: React.FC = () => {
  const params = useParams<{ username?: string }>();
  const { profile } = useUserProfile(params.username || "");
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);
    const username = formData.get("username") as string;
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const ageString = formData.get("age") as string;

    const age = Number(ageString);

    if (!params.username) {
      toast.error("Username missing in URL parameters.");
      return;
    }

    try {
      const data = { username, name, email, age };
      const response = await profileApi.updateProfile(params.username, data);
      console.log(response);
      toast.success("Profile updated successfully");
    } catch (error) {
      if (import.meta.env.VITE_ENV === "development") console.log(error);
      toast.error("Failed to update profile");
    }
  };

  //  Role-based gating for guest user
  const checkRole = () => profile?.name === "Guest User";

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <div className="bg-zinc-900 w-full flex-grow p-8">
        <div className="max-w-3xl mx-auto">
          {/* Header Section */}
          <div className="mb-8">
            <h3 className="text-4xl font-bold bg-gradient-to-r from-[#CA2B58] to-[#E63578] bg-clip-text text-transparent">Edit Profile</h3>
            <p className="text-gray-400 mt-2">Update your personal information</p>
          </div>

          {/* Form Container */}
          <div className="relative">
            {/* Glowing background */}
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-pink-500/10 rounded-2xl blur-xl"></div>

            <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 shadow-2xl">
              <form onSubmit={submitHandler}>
                {/* Username Field */}
                <div className="mb-6">
                  <Label htmlFor="username" className="block text-white font-semibold mb-2">
                    Username
                  </Label>
                  <Input
                    type="text"
                    name="username"
                    id="username"
                    defaultValue={profile?.username}
                    className={`
                      w-full bg-white/10 backdrop-blur-sm text-white placeholder-gray-400 
                      px-4 py-7 rounded-xl outline-none border border-white/20
                      transition-all duration-300
                      ${focusedField === "username" ? "border-pink-400 shadow-lg shadow-pink-500/25 bg-white/15" : "hover:border-white/30"}
                    `}
                    onFocus={() => setFocusedField("username")}
                    onBlur={() => setFocusedField(null)}
                    required
                  />
                </div>

                {/* Name Field */}
                <div className="mb-6">
                  <Label htmlFor="name" className="block text-white font-semibold mb-2">
                    Name
                  </Label>
                  <Input
                    type="text"
                    name="name"
                    id="name"
                    defaultValue={profile?.name}
                    className={`
                      w-full bg-white/10 backdrop-blur-sm text-white placeholder-gray-400 
                      px-4 py-7 rounded-xl outline-none border border-white/20
                      transition-all duration-300
                      ${focusedField === "name" ? "border-pink-400 shadow-lg shadow-pink-500/25 bg-white/15" : "hover:border-white/30"}
                    `}
                    onFocus={() => setFocusedField("name")}
                    onBlur={() => setFocusedField(null)}
                    required
                  />
                </div>

                {/* Email Field */}
                <div className="mb-6">
                  <Label htmlFor="email" className="block text-white font-semibold mb-2">
                    Email
                  </Label>
                  <Input
                    type="email"
                    name="email"
                    id="email"
                    defaultValue={profile?.email}
                    className={`
                      w-full bg-white/10 backdrop-blur-sm text-white placeholder-gray-400 
                      px-4 py-7 rounded-xl outline-none border border-white/20
                      transition-all duration-300
                      ${focusedField === "email" ? "border-pink-400 shadow-lg shadow-pink-500/25 bg-white/15" : "hover:border-white/30"}
                    `}
                    onFocus={() => setFocusedField("email")}
                    onBlur={() => setFocusedField(null)}
                    required
                  />
                </div>

                {/* Age Field */}
                <div className="mb-8">
                  <Label htmlFor="age" className="block text-white font-semibold mb-2">
                    Age
                  </Label>
                  <Input
                    type="number"
                    name="age"
                    id="age"
                    defaultValue={profile?.age}
                    className={`
                      w-full bg-white/10 backdrop-blur-sm text-white placeholder-gray-400 
                      px-4 py-7 rounded-xl outline-none border border-white/20
                      transition-all duration-300
                      ${focusedField === "age" ? "border-pink-400 shadow-lg shadow-pink-500/25 bg-white/15" : "hover:border-white/30"}
                    `}
                    onFocus={() => setFocusedField("age")}
                    onBlur={() => setFocusedField(null)}
                    required
                  />
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="
                    w-full bg-gradient-to-r from-yellow-500 to-orange-500 
                    hover:from-yellow-400 hover:to-orange-400
                    text-black font-semibold p-6 rounded-xl
                    transition-all duration-300
                    hover:shadow-lg hover:shadow-yellow-500/30
                    hover:scale-105 active:scale-95
                    overflow-hidden group relative
                  "
                >
                  <span className="relative z-10">{checkRole() ? "Not for Guest users" : "Save Changes"}</span>
                  <div className={checkRole() ? "absolute inset-0 bg-gray-500/30 cursor-not-allowed rounded-md" : "absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"} />
                </Button>
              </form>

              {/* Quick Links */}
              <div className="mt-8 pt-6 border-t border-white/10 space-y-3">
                <Link
                  to={`/profile/${params.username}/changepassword`}
                  className="
                    block text-center text-blue-400 hover:text-blue-300 
                    transition-colors duration-300 font-medium
                    hover:underline
                  "
                >
                  Change Password
                </Link>
                <Link
                  to={`/profile/${params.username}/deleteprofile`}
                  className="
                    block text-center text-red-400 hover:text-red-300 
                    transition-colors duration-300 font-medium
                    hover:underline
                  "
                >
                  Delete Profile
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default EditProfilePage;

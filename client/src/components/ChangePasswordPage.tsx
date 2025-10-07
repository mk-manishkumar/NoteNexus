import React, { useState } from "react";
import Header from "./shared/Header";
import Footer from "./shared/Footer";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { toast } from "react-toastify";
import { profileApi } from "@/api/api";
import { Button } from "./ui/button";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const ChangePasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const { username } = useParams<{ username?: string }>();
  const [formData, setFormData] = useState({ oldPassword: "", newPassword: "" });
  const { oldPassword, newPassword } = formData;
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!username) {
      toast.error("Missing username from URL.");
      return;
    }
    if (!oldPassword || !newPassword) {
      toast.error("Both password fields are required.");
      return;
    }

    setLoading(true);
    try {
      await profileApi.changePassword(username, formData);
      toast.success("Password Changed");
      setFormData({ oldPassword: "", newPassword: "" });
      navigate("/login");
    } catch (error: unknown) {
      if (import.meta.env.VITE_ENV === "development") console.log(error);
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to change password");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="bg-zinc-900 w-full flex-grow p-8 flex items-center justify-center">
        <div className="max-w-2xl mx-auto w-full">
          <div className="mb-8 text-center">
            <h3 className="text-4xl font-bold bg-gradient-to-r from-[#CA2B58] to-[#E63578] bg-clip-text text-transparent">Change Password</h3>
            <p className="text-gray-400 mt-2">Update your password to keep your account secure</p>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-pink-500/10 rounded-2xl blur-xl"></div>
            <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 shadow-2xl">
              <form onSubmit={submitHandler}>
                <div className="mb-6">
                  <Label htmlFor="oldPassword" className="block text-white font-semibold mb-4">
                    Old Password
                  </Label>
                  <Input
                    type="password"
                    name="oldPassword"
                    value={oldPassword}
                    onChange={(e) => setFormData({ ...formData, oldPassword: e.target.value })}
                    className={`
                      w-full bg-white/10 backdrop-blur-sm text-white placeholder-gray-400
                      px-4 py-7 rounded-xl outline-none border border-white/20
                      transition-all duration-300
                      ${focusedField === "oldPassword" ? "border-pink-400 shadow-lg shadow-pink-500/25 bg-white/15" : "hover:border-white/30"}
                    `}
                    placeholder="Enter your current password"
                    onFocus={() => setFocusedField("oldPassword")}
                    onBlur={() => setFocusedField(null)}
                    required
                    disabled={loading}
                  />
                </div>
                <div className="mb-8">
                  <Label htmlFor="newPassword" className="block text-white font-semibold mb-4">
                    New Password
                  </Label>
                  <Input
                    type="password"
                    name="newPassword"
                    value={newPassword}
                    onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                    className={`
                      w-full bg-white/10 backdrop-blur-sm text-white placeholder-gray-400
                      px-4 py-7 rounded-xl outline-none border border-white/20
                      transition-all duration-300
                      ${focusedField === "newPassword" ? "border-pink-400 shadow-lg shadow-pink-500/25 bg-white/15" : "hover:border-white/30"}
                    `}
                    placeholder="Enter your new password"
                    onFocus={() => setFocusedField("newPassword")}
                    onBlur={() => setFocusedField(null)}
                    required
                    disabled={loading}
                  />
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  className={`
                    w-full bg-gradient-to-r from-yellow-500 to-orange-500
                    hover:from-yellow-400 hover:to-orange-400
                    text-black font-semibold px-6 py-4 rounded-xl
                    transition-all duration-300
                    hover:shadow-lg hover:shadow-yellow-500/30
                    hover:scale-105 active:scale-95
                    overflow-hidden group relative
                    ${loading ? "opacity-60 cursor-not-allowed" : ""}
                  `}
                >
                  <span className="relative z-10">{loading ? "Saving..." : "Save Changes"}</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};
export default ChangePasswordPage;

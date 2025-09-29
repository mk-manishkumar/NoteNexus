import React from "react";
import Header from "./shared/Header";
import Footer from "./shared/Footer";

const ChangePasswordPage: React.FC = () => {
  const guestMode = false; // set to true to simulate guest mode

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="bg-zinc-900 w-full flex-grow">
        <section className="my-8">
          <h3 className="text-3xl text-[#CA2B58] ml-5">Change Password</h3>
        </section>

        <div className="edit-list px-5">
          <form className="mb-5">
            <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <label htmlFor="oldPassword" className="text-white w-32">
                Old Password
              </label>
              <input type="password" name="oldPassword" className="w-full sm:w-96 bg-zinc-800 text-zinc-400 p-2 rounded-md outline-none" required />
            </div>
            <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <label htmlFor="newPassword" className="text-white w-32">
                New Password
              </label>
              <input type="password" name="newPassword" className="w-full sm:w-96 bg-zinc-800 text-zinc-400 p-2 rounded-md" required />
            </div>

            <button type="submit" className={`px-4 py-2 rounded-md mt-5 ${guestMode ? "bg-gray-400 cursor-not-allowed" : "bg-yellow-500 text-black"}`} disabled={guestMode} title={guestMode ? "Not available for guest users" : undefined}>
              Save Changes
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ChangePasswordPage;

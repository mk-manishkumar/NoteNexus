import React from "react";
import Header from "./shared/Header";
import Footer from "./shared/Footer";

const DeleteProfilePage: React.FC = () => {
  const guestMode = false; // change to true to simulate guest mode

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="bg-zinc-900 w-full flex-grow">
        <section className="my-8">
          <h3 className="text-3xl text-[#CA2B58] ml-5 text-center">Delete Profile</h3>
        </section>

        <div className="edit-list px-5 text-white text-center">
          <p className="text-2xl mb-2">Are you sure you want to delete your profile?</p>
          <p>
            If so, please enter your <strong className="text-[#CA2B58]">password</strong> correctly in the box below.
          </p>

          <form className="mt-5 flex flex-col items-center">
            <input type="password" name="password" className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 bg-zinc-800 text-zinc-400 outline-none px-4 py-2 rounded-md" placeholder="Enter Password" required />

            <button type="submit" className={`px-4 py-1 rounded-md mt-5 block ${guestMode ? "bg-red-400 cursor-not-allowed" : "bg-red-700"}`} disabled={guestMode} title={guestMode ? "Not available for guest users" : undefined}>
              Delete
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default DeleteProfilePage;

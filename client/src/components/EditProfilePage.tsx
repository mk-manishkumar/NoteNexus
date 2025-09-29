import React from "react";
import Header from "./shared/Header";
import Footer from "./shared/Footer";

const EditProfilePage: React.FC = () => {
  const user = {
    username: "sampleuser",
    name: "Sample Name",
    email: "sample@example.com",
    age: 30,
  };

  const guestMode = false; // change to true to simulate guestMode

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="bg-zinc-900 w-full flex-grow">
        <section className="my-8">
          <h3 className="text-3xl text-[#CA2B58] ml-5">Edit Profile</h3>
        </section>

        <div className="edit-list px-5 text-white">
          <form className="mb-5">
            <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <label htmlFor="username" className="text-white w-24">
                Username
              </label>
              <input type="text" name="username" defaultValue={user.username} className="w-full sm:w-96 bg-zinc-800 text-zinc-400 p-2 rounded-md" required />
            </div>
            <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <label htmlFor="name" className="text-white w-24">
                Name
              </label>
              <input type="text" name="name" defaultValue={user.name} className="w-full sm:w-96 bg-zinc-800 text-zinc-400 p-2 rounded-md" required />
            </div>
            <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <label htmlFor="email" className="text-white w-24">
                Email
              </label>
              <input type="email" name="email" defaultValue={user.email} className="w-full sm:w-96 bg-zinc-800 text-zinc-400 p-2 rounded-md" required />
            </div>
            <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <label htmlFor="age" className="text-white w-24">
                Age
              </label>
              <input type="number" name="age" defaultValue={user.age} className="w-full sm:w-96 bg-zinc-800 text-zinc-400 p-2 rounded-md" required />
            </div>

            <button type="submit" className={`px-4 py-2 rounded-md mt-5 ${guestMode ? "bg-gray-400 cursor-not-allowed" : "bg-yellow-500 text-black"}`} disabled={guestMode} title={guestMode ? "Not available for guest users" : undefined}>
              Save Changes
            </button>
          </form>

          <a href={`/profile/${user.username}/change-password`} className="text-blue-500 mr-5 border-b-0 sm:border-b-2 border-blue-500">
            Click here to change password
          </a>
          <a href={`/profile/${user.username}/delete-profile`} className="text-blue-500 border-b-0 sm:border-b-2 border-blue-500 block sm:inline mt-5">
            Click here to delete your profile
          </a>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default EditProfilePage;

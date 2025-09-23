import NoteForm from "./NoteForm"
import Footer from "./shared/Footer"
import Header from "./shared/Header"

const Profile = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <NoteForm />
      <Footer />
    </div>
  );
}

export default Profile
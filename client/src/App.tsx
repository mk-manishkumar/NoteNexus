import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import Signup from "./components/auth/Signup";
import Login from "./components/auth/Login";
import Profile from "./components/Profile";
import { ToastContainer } from "react-toastify";
import NotesPage from "./components/NotesPage";
import BinPage from "./components/BinPage";
import ArchivePage from "./components/ArchivePage";
import ErrorPage from "./components/ErrorPage";
import EditProfilePage from "./components/EditProfilePage";
import NoteDetails from "./components/NoteDetails";
import EditNote from "./components/EditNote";


const router = createBrowserRouter([
  {
    path: "/",
    element: <Signup />,
    errorElement: <ErrorPage code={500} />,
  },
  {
    path: "/login",
    element: <Login />,
    errorElement: <ErrorPage code={500} />,
  },
  {
    path: "/profile/:username",
    element: <Profile />,
    errorElement: <ErrorPage code={500} />,
  },
  {
    path: "/profile/:username/notes",
    element: <NotesPage />,
    errorElement: <ErrorPage code={500} />,
  },
  {
    path: "/profile/:username/bin",
    element: <BinPage />,
    errorElement: <ErrorPage code={500} />,
  },
  {
    path: "/profile/:username/archive",
    element: <ArchivePage />,
    errorElement: <ErrorPage code={500} />,
  },
  {
    path: "/profile/:username/editprofile",
    element: <EditProfilePage />,
    errorElement: <ErrorPage code={500} />,
  },
  {
    path: "/profile/:username/note/:noteid",
    element: <NoteDetails />,
    errorElement: <ErrorPage code={500} />,
  },
  {
    path: "/profile/:username/editnote/:noteid",
    element: <EditNote />,
    errorElement: <ErrorPage code={500} />,
  },
  {
    path: "*",
    element: <ErrorPage code={404} />,
  },
]);


const App = () => {
  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer />
    </>
  );
};

export default App;

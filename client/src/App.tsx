import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import Signup from "./components/auth/Signup";
import Login from "./components/auth/Login";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Signup/>,
  },
  {
    path: "/login",
    element: <Login/>
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;

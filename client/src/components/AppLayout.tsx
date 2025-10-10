import useGuestAutoLogout from "@/customHooks/useGuestAutoLogout";
import { Outlet } from "react-router-dom";

const AppLayout = () => {
  useGuestAutoLogout();
  return <Outlet />;
};

export default AppLayout;

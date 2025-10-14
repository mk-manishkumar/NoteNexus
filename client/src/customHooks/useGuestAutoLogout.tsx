// hooks/useGuestAutoLogout.tsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { authApi } from "@/api/api";

const useGuestAutoLogout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;

    const checkAndStartPolling = async () => {
      try {
        const res = await authApi.checkAuth();
        if (res.data?.user?.role === "guest") {
          interval = setInterval(async () => {
            try {
              const checkRes = await authApi.checkAuth();
              if (!checkRes.data?.success) {
                toast.info("Guest session expired. Please register to continue.");
                navigate("/");
                if (interval) clearInterval(interval);
              }
            } catch {
              toast.info("Guest session expired. Please register to continue.");
              navigate("/");
              if (interval) clearInterval(interval);
            }
          }, 30000);
        }
      } catch {
        // not authenticated, do nothing or optionally redirect
      }
    };

    checkAndStartPolling();

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [navigate]);
};

export default useGuestAutoLogout;

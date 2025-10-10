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
          // Avoid creating multiple intervals
          if (interval) return;

          interval = setInterval(async () => {
            try {
              const checkRes = await authApi.checkAuth();
              if (!checkRes.data?.success) {
                toast.info("Guest session expired. Please register to continue.");
                navigate("/");
                if (interval) {
                  clearInterval(interval);
                  interval = null;
                }
              }
            } catch {
              toast.info("Guest session expired. Please register to continue.");
              navigate("/");
              if (interval) {
                clearInterval(interval);
                interval = null;
              }
            }
          }, 30000);
        }
      } catch {
        // not authenticated, do nothing
      }
    };

    // Run once on mount
    checkAndStartPolling();

    // Listen for "guest-login" event (triggered after guest signin)
    window.addEventListener("guest-login", checkAndStartPolling);

    // Cleanup on unmount
    return () => {
      if (interval) clearInterval(interval);
      window.removeEventListener("guest-login", checkAndStartPolling);
    };
  }, [navigate]);
};

export default useGuestAutoLogout;

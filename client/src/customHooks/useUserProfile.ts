import { useState, useEffect } from "react";
import { profileApi } from "@/api/api";
import { toast } from "react-toastify";

export interface UserProfile {
  username: string;
  name: string;
  email: string;
  age: number;
}

export function useUserProfile(username?: string) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!username) {
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      setLoading(true);
      try {
        const response = await profileApi.getProfile(username);
        setProfile(response.data.user);
        setError(null);
      } catch (err: unknown) {
        let message = "Failed to load profile";
        if (err instanceof Error) message = err.message;
        setError(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [username]);

  return { profile, loading, error };
}

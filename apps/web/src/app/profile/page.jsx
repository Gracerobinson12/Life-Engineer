"use client";

import { useEffect } from "react";
import { useUser } from "@/utils/useUser";
import ProfileUI from "@/components/ProfileUI";

export default function ProfilePage() {
  const { data: user, loading } = useUser();

  // If no user -> go to login
  useEffect(() => {
    if (!loading && !user) {
      window.location.href = "/login";
    }
  }, [user, loading]);

  if (loading) return <div>Loading...</div>;
  if (!user) return null;

  return <ProfileUI user={user} />;
}

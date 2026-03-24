"use client";

import { useState } from "react";
import { handleLogout } from "@/app/actions";

export function LogoutButton() {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      await handleLogout();
    } catch (err) {
      console.error("Logout error:", err);
      setLoading(false);
    }
  };

  return (
    <button onClick={handleClick} disabled={loading} className="text-sm">
      {loading ? "Logging out..." : "Logout"}
    </button>
  );
}

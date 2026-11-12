"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      style={{
        padding: "10px 20px",
        borderRadius: 8,
        border: 0,
        background: "#222",
        color: "#fff",
        fontWeight: 600,
        cursor: "pointer",
        opacity: loading ? 0.6 : 1,
      }}
    >
      {loading ? "Keluar..." : "Keluar"}
    </button>
  );
}

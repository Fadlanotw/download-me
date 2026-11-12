"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogoutButton() {
  const router = useRouter();
  const [error, setError] = useState("");

  async function handleLogout() {
    setError("");
    try {
      const response = await fetch("/api/admin/logout", { method: "POST" });
      if (!response.ok) {
        setError("Logout gagal. Silakan coba kembali.");
        return;
      }

      router.replace("/admin/login");
      router.refresh();
    } catch {
      setError("Tidak dapat menghubungi server. Periksa koneksi lalu coba lagi.");
    }
  }

  return (
    <div className="admin-logout-area">
      {error && <span role="alert">{error}</span>}
      <button className="admin-logout-button" type="button" onClick={handleLogout}>Keluar</button>
    </div>
  );
}

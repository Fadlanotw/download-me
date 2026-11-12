"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PrincipalLogoutButton() {
  const router = useRouter();
  const [error, setError] = useState("");

  async function handleLogout() {
    setError("");
    try {
      const response = await fetch("/api/principal/logout", { method: "POST" });
      if (!response.ok) {
        setError("Logout gagal. Silakan coba kembali.");
        return;
      }

      router.replace("/kepala-sekolah/login");
      router.refresh();
    } catch {
      setError("Tidak dapat menghubungi server. Periksa koneksi lalu coba lagi.");
    }
  }

  return (
    <>
      {error && <p className="principal-logout-error" role="alert">{error}</p>}
      <button className="principal-logout" type="button" onClick={handleLogout}>Keluar</button>
    </>
  );
}

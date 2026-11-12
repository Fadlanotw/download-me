"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import SchoolCrest from "../../components/school-crest";

export default function AdminLoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setIsError(false);
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.get("username"),
          password: formData.get("password"),
        }),
      });
      const result = (await response.json()) as { error?: string; redirectTo?: string };

      if (!response.ok || !result.redirectTo) {
        setIsError(true);
        setMessage(result.error || "Login admin gagal. Silakan coba kembali.");
        return;
      }

      router.replace(result.redirectTo);
      router.refresh();
    } catch {
      setIsError(true);
      setMessage("Tidak dapat menghubungi server. Periksa koneksi lalu coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="registration-page login-page admin-login-page">
      <section className="welcome-panel login-welcome" aria-label="Informasi SPMB Garuda Utama">
        <div className="welcome-content">
          <Link className="school-brand" href="/" aria-label="Garuda Utama - halaman pendaftaran">
            <div className="school-crest" aria-hidden="true">
              <SchoolCrest />
            </div>
            <div>
              <span className="brand-name">GARUDA UTAMA</span>
              <span className="brand-overline">SPMB ONLINE</span>
            </div>
          </Link>

          <div className="welcome-copy login-welcome-copy">
            <h1>Kelola penerimaan murid dengan lebih terarah.</h1>
            <p>
              Portal administrator SPMB SMA Garuda Utama untuk mengelola data
              pendaftar dan memastikan proses penerimaan berjalan lancar.
            </p>
          </div>
        </div>

        <footer className="welcome-footer">
          <span>Panitia SPMB Garuda Utama © 2026</span>
          <a href="tel:+62215558899">Layanan Informasi: (021) 555-8899</a>
        </footer>
      </section>

      <section className="form-panel login-form-panel" aria-labelledby="admin-login-title">
        <div className="login-shell">
          <header className="login-heading">
            <Link className="admin-back-link" href="/portal">Kembali ke pilihan peran</Link>
            <h2 id="admin-login-title">Masuk sebagai Admin</h2>
            <p>Gunakan akun administrator sekolah Anda.</p>
          </header>

          <form className="login-form" onSubmit={handleSubmit}>
            <label className="form-field">
              <span>Username admin</span>
              <span className="input-wrap">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="12" cy="8" r="3.5" />
                  <path d="M5 20c.7-3.2 3.1-5 7-5s6.3 1.8 7 5" />
                </svg>
                <input name="username" type="text" placeholder="Masukkan username admin..." autoComplete="username" maxLength={64} required aria-label="Username admin" />
              </span>
            </label>

            <label className="form-field login-password-field">
              <span className="password-label">
                <span>Password</span>
                <button className="forgot-password-link" type="button" onClick={() => {
                  setIsError(false);
                  setMessage("Untuk mengatur ulang password, hubungi administrator sistem.");
                }}>Lupa Password?</button>
              </span>
              <span className="input-wrap">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="4.5" y="10" width="15" height="11" rx="2" />
                  <path d="M8 10V7a4 4 0 0 1 8 0v3m-4 4v3" />
                </svg>
                <input name="password" type={showPassword ? "text" : "password"} placeholder="Masukkan password..." autoComplete="current-password" maxLength={128} required />
                <button className="password-toggle" type="button" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}>
                  {showPassword ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="m3 3 18 18M10.6 10.6a2 2 0 0 0 2.8 2.8" />
                      <path d="M9.9 5.2A10.9 10.9 0 0 1 12 5c5.5 0 9 7 9 7a15.6 15.6 0 0 1-3.1 3.7M6.2 6.2C3.9 7.8 3 12 3 12s3.5 7 9 7a9.8 9.8 0 0 0 3.1-.5" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M3 12s3.5-7 9-7 9 7 9 7-3.5 7-9 7-9-7-9-7Z" />
                      <circle cx="12" cy="12" r="2.5" />
                    </svg>
                  )}
                </button>
              </span>
            </label>

            {message && <p className={isError ? "form-notice admin-login-message" : "admin-login-info"} role={isError ? "alert" : "status"}>{message}</p>}
            <button className="submit-button login-submit" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Memeriksa..." : "Masuk ke Portal Admin"}
            </button>
            <nav className="staff-login-links" aria-label="Pilihan portal lainnya">
              <Link href="/kepala-sekolah/login">Login sebagai kepala sekolah</Link>
              <Link href="/login">Login sebagai pendaftar</Link>
            </nav>
          </form>
        </div>
      </section>
    </main>
  );
}

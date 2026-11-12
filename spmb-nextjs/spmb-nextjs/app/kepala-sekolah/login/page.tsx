"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import SchoolCrest from "../../components/school-crest";

export default function PrincipalLoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/principal/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier: formData.get("identifier"),
          password: formData.get("password"),
          remember: formData.get("remember") === "on",
        }),
      });
      const result = (await response.json()) as { error?: string; redirectTo?: string };

      if (!response.ok || !result.redirectTo) {
        setMessage(result.error || "Login gagal. Silakan coba kembali.");
        return;
      }

      router.replace(result.redirectTo);
      router.refresh();
    } catch {
      setMessage("Tidak dapat menghubungi server. Periksa koneksi lalu coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="principal-login">
      <header className="principal-topbar">
        <Link className="principal-brand" href="/" aria-label="Garuda Utama, beranda">
          <SchoolCrest />
          <span><strong>GARUDA UTAMA</strong><small>SPMB ONLINE</small></span>
        </Link>
      </header>

      <div className="principal-login-layout">
        <section className="principal-welcome">
          <span className="principal-portal-badge">
            <svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M3 17h14M5 17V8l5-4 5 4v9M8 17v-5h4v5M7 9h.01M13 9h.01" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
            Portal Kepala Sekolah
          </span>
          <div className="principal-welcome-copy">
            <span className="principal-gold-rule" />
            <h1>Wawasan strategis untuk kepemimpinan</h1>
            <p>Dapatkan ringkasan yang jelas untuk memimpin sekolah dengan data yang terpercaya.</p>
            <ul className="principal-benefits">
              <li>
                <span className="principal-benefit-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><path d="M4 19V5m0 14h16M7 15l4-4 3 2 5-6M16 7h3v3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
                <span><strong>Ringkasan kinerja</strong><small>Indikator akademik yang bermakna.</small></span>
              </li>
              <li>
                <span className="principal-benefit-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><path d="M6 3h8l5 5v13H6V3Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" /><path d="M14 3v6h5m-9 5 2 2 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
                <span><strong>Persetujuan cepat</strong><small>Tinjau agenda dan dokumen penting.</small></span>
              </li>
              <li>
                <span className="principal-benefit-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><path d="m12 3 8 3v5c0 5-3.4 8.2-8 10-4.6-1.8-8-5-8-10V6l8-3Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" /><path d="m9 12 2 2 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
                <span><strong>Akses terlindungi</strong><small>Khusus akun pimpinan terverifikasi.</small></span>
              </li>
            </ul>
          </div>
        </section>

        <section className="principal-form-side" aria-labelledby="principal-login-title">
          <div className="principal-login-card">
            <Link href="/portal" className="principal-back-link">
              <svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="m11.5 4-6 6 6 6M6 10h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
              Kembali ke pilihan peran
            </Link>
            <span className="principal-access-label">
              <svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M2.5 17h15M4 17V8l6-4 6 4v9M7.5 17v-5h5v5M6.5 9h.01M13.5 9h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
              AKSES PIMPINAN
            </span>
            <h2 id="principal-login-title">Masuk sebagai Kepala Sekolah</h2>
            <p className="principal-login-description">Masuk untuk memantau kinerja dan keputusan penting sekolah.</p>

            <form className="principal-login-form" onSubmit={handleSubmit}>
              <label htmlFor="principal-identifier">NIP atau email sekolah</label>
              <span className="principal-input">
                <svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.4" /><path d="M10 9v4m0-6h.01" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
                <input id="principal-identifier" name="identifier" type="text" placeholder="Masukkan NIP atau email sekolah" autoComplete="username" maxLength={128} required />
              </span>

              <label className="principal-password-label" htmlFor="principal-password">Kata sandi</label>
              <span className="principal-input">
                <svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><rect x="3.5" y="8.5" width="13" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.4" /><path d="M6 8.5V6a4 4 0 0 1 8 0v2.5m-4 4v2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>
                <input id="principal-password" name="password" type={showPassword ? "text" : "password"} placeholder="Masukkan kata sandi" autoComplete="current-password" maxLength={128} required />
                <button className="principal-password-toggle" type="button" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}>
                  {showPassword ? (
                    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="m2 2 16 16M8.6 8.6a2 2 0 0 0 2.8 2.8M5.2 5.2C3.1 6.6 2 10 2 10s3 5 8 5a8.7 8.7 0 0 0 2.8-.5M8 5.1A8.2 8.2 0 0 1 10 5c5 0 8 5 8 5a11.5 11.5 0 0 1-2.4 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  ) : (
                    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M2 10s3-5 8-5 8 5 8 5-3 5-8 5-8-5-8-5Z" stroke="currentColor" strokeWidth="1.4" /><circle cx="10" cy="10" r="2" stroke="currentColor" strokeWidth="1.4" /></svg>
                  )}
                </button>
              </span>

              <div className="principal-login-options">
                <label><input type="checkbox" name="remember" /> Ingat saya di perangkat ini</label>
                <a href="mailto:admin@garudautama.sch.id?subject=Pemulihan%20Akun%20Kepala%20Sekolah">Lupa kata sandi?</a>
              </div>

              {message && <p className="principal-login-error" role="alert">{message}</p>}
              <button className="principal-submit" type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Memeriksa..." : "Masuk sebagai Kepala Sekolah"}
                <svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M4 10h12m-5-5 5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </button>
            </form>

            <nav className="principal-role-links" aria-label="Pilihan portal lainnya">
              <Link href="/admin/login">Login sebagai Admin</Link>
              <Link href="/login">Login sebagai pendaftar</Link>
            </nav>

            <div className="principal-support">
              <svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M4 11v-1a6 6 0 0 1 12 0v1m-12 0v4h3v-5H4Zm12 0v4h-3v-5h3Zm-3 5c-.5 1.5-1.5 2-3 2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></svg>
              Perlu bantuan akun? Hubungi administrator sekolah
            </div>
            <div className="principal-secure-note">
              <svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><rect x="4" y="8" width="12" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.4" /><path d="M6.5 8V5.5a3.5 3.5 0 0 1 7 0V8m-3.5 4v1.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>
              Koneksi aman dan terenkripsi
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

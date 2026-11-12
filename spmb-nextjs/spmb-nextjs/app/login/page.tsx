"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import SchoolCrest from "../components/school-crest";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [notice, setNotice] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNotice("Login belum terhubung. Silakan hubungi panitia SPMB untuk bantuan.");
  }

  return (
    <main className="registration-page login-page">
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
            <h1>Mulai Langkah Emas Anda di Sini.</h1>
            <p>
              Sistem Penerimaan Murid Baru (SPMB) Tahun Ajaran 2026/2027.
              Bergabunglah dengan komunitas akademik terbaik untuk masa depan gemilang.
            </p>
          </div>
        </div>

        <footer className="welcome-footer">
          <span>Panitia SPMB Garuda Utama © 2026</span>
          <a href="tel:+62215558899">Hubungi Kami: (021) 555-8899</a>
        </footer>
      </section>

      <section className="form-panel login-form-panel" aria-labelledby="login-title">
        <div className="login-shell">
          <header className="login-heading">
            <h2 id="login-title">Selamat Datang</h2>
            <p>Silakan masuk ke akun pendaftaran Anda.</p>
          </header>

          <form className="login-form" onSubmit={handleSubmit}>
            <label className="form-field">
              <span>Email atau Username</span>
              <span className="input-wrap">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="12" cy="8" r="3.5" />
                  <path d="M5 20c.7-3.2 3.1-5 7-5s6.3 1.8 7 5" />
                </svg>
                <input name="username" type="text" placeholder="Masukkan email resmi Anda..." autoComplete="username" required />
              </span>
            </label>

            <label className="form-field login-password-field">
              <span className="password-label">
                <span>Password</span>
                <a href="#lupa-password" onClick={(event) => {
                  event.preventDefault();
                  setNotice("Fitur pemulihan password belum tersedia. Silakan hubungi panitia SPMB.");
                }}>Lupa Password?</a>
              </span>
              <span className="input-wrap">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="4.5" y="10" width="15" height="11" rx="2" />
                  <path d="M8 10V7a4 4 0 0 1 8 0v3m-4 4v3" />
                </svg>
                <input name="password" type={showPassword ? "text" : "password"} placeholder="Masukkan password..." autoComplete="current-password" required />
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

            <button className="submit-button login-submit" type="submit">Masuk Sekarang</button>
            <p className="login-prompt">
              Belum punya akun? <Link href="/">Daftar Sekarang</Link>
            </p>
            <div className="login-divider"><span>ATAU</span></div>
            <button className="google-login" type="button" onClick={() => setNotice("Login dengan Google belum tersedia.")}>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path fill="#4285F4" d="M21.6 12.23c0-.71-.06-1.39-.18-2.05H12v3.88h5.38a4.6 4.6 0 0 1-2 3.02v2.52h3.24c1.9-1.75 2.98-4.33 2.98-7.37Z" />
                <path fill="#34A853" d="M12 22c2.7 0 4.96-.9 6.62-2.4l-3.24-2.52c-.9.6-2.04.96-3.38.96-2.6 0-4.8-1.76-5.58-4.12H3.07v2.6A10 10 0 0 0 12 22Z" />
                <path fill="#FBBC05" d="M6.42 13.92a6 6 0 0 1 0-3.84v-2.6H3.07a10 10 0 0 0 0 9.04l3.35-2.6Z" />
                <path fill="#EA4335" d="M12 5.96c1.47 0 2.79.5 3.82 1.5l2.87-2.87C16.95 2.96 14.7 2 12 2a10 10 0 0 0-8.93 5.48l3.35 2.6C7.2 7.72 9.4 5.96 12 5.96Z" />
              </svg>
              Masuk dengan Akun Google
            </button>
            <nav className="staff-login-links" aria-label="Login untuk staf sekolah">
              <Link href="/admin/login">Login sebagai admin</Link>
              <Link href="/kepala-sekolah/login">Login sebagai kepala sekolah</Link>
            </nav>
            <p className="form-notice" role="status" aria-live="polite">{notice}</p>
          </form>
        </div>
      </section>
    </main>
  );
}

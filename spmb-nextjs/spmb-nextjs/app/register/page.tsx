"use client";

import { useState, type FormEvent } from "react";
import SchoolCrest from "../components/school-crest";

function FieldIcon({ name }: { name: "user" | "mail" | "phone" | "school" | "book" | "lock" }) {
  const paths = {
    user: <><circle cx="12" cy="8" r="3.5" /><path d="M5 20c.7-3.2 3.1-5 7-5s6.3 1.8 7 5" /></>,
    mail: <><rect x="3.5" y="5" width="17" height="14" rx="2" /><path d="m4.5 7 7.5 6 7.5-6" /></>,
    phone: <><path d="M7 3.5h10a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-13a2 2 0 0 1 2-2Z" /><path d="M10 17.5h4" /></>,
    school: <><path d="m3 9 9-5 9 5-9 5-9-5Z" /><path d="M6 11v5c3.6 3 8.4 3 12 0v-5M21 9v6" /></>,
    book: <><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21V5.5Z" /><path d="M4 17.5A2.5 2.5 0 0 1 6.5 15H20" /></>,
    lock: <><rect x="4.5" y="10" width="15" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3m-4 4v3" /></>,
  };

  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[name]}
    </svg>
  );
}

export default function RegisterPage() {
  const [notice, setNotice] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const values = new FormData(event.currentTarget);

    if (values.get("password") !== values.get("confirmPassword")) {
      setNotice("Konfirmasi password belum sama. Silakan periksa kembali.");
      return;
    }

    setNotice("Pendaftaran online belum terhubung. Silakan hubungi panitia di (021) 555-8899.");
  }

  return (
    <main className="registration-page">
      <section className="welcome-panel" aria-label="Informasi SPMB Garuda Utama">
        <div className="welcome-content">
          <div className="school-brand">
            <div className="school-crest" aria-hidden="true">
              <SchoolCrest />
            </div>
            <div>
              <span className="brand-overline">SEKOLAH UNGGULAN</span>
              <span className="brand-name">GARUDA UTAMA</span>
            </div>
          </div>

          <div className="welcome-copy">
            <span className="eyebrow">PENERIMAAN MURID BARU · 2026/2027</span>
            <h1>Mulai langkahmu menuju masa depan gemilang.</h1>
            <p>
              Bergabunglah bersama generasi berprestasi di SMA Garuda Utama.
              Wujudkan potensi terbaikmu dengan pendidikan berkualitas dan
              fasilitas modern terbaik.
            </p>
            <div className="welcome-rule" />
            <div className="welcome-note">
              <span className="note-mark" aria-hidden="true">✦</span>
              <span>Pendaftaran tahun ajaran 2026/2027 telah dibuka</span>
            </div>
          </div>
        </div>

        <footer className="welcome-footer">
          <span>Panitia SPMB Garuda Utama © 2026</span>
          <a href="tel:+62215558899">Hubungi Kami: (021) 555-8899</a>
        </footer>
      </section>

      <section className="form-panel" aria-labelledby="form-title">
        <div className="form-shell">
          <header className="form-heading">
            <span className="form-step">LANGKAH 01 <span aria-hidden="true">/</span> BUAT AKUN</span>
            <h2 id="form-title">Daftar sebagai calon murid</h2>
            <p>Lengkapi data diri Anda untuk memulai proses pendaftaran.</p>
          </header>

          <form className="registration-form" onSubmit={handleSubmit}>
            <div className="form-grid">
              <label className="form-field">
                <span>Nama Lengkap <span className="required">*</span></span>
                <span className="input-wrap">
                  <FieldIcon name="user" />
                  <input name="fullName" type="text" placeholder="Nama sesuai ijazah" autoComplete="name" required />
                </span>
              </label>
              <label className="form-field">
                <span>Email Aktif <span className="required">*</span></span>
                <span className="input-wrap">
                  <FieldIcon name="mail" />
                  <input name="email" type="email" placeholder="nama@email.com" autoComplete="email" required />
                </span>
              </label>
              <label className="form-field">
                <span>Nomor HP <span className="required">*</span></span>
                <span className="input-wrap">
                  <FieldIcon name="phone" />
                  <input name="phone" type="tel" placeholder="08xx xxxx xxxx" autoComplete="tel" required />
                </span>
              </label>
              <label className="form-field">
                <span>Asal Sekolah <span className="required">*</span></span>
                <span className="input-wrap">
                  <FieldIcon name="school" />
                  <input name="school" type="text" placeholder="Nama sekolah asal" autoComplete="organization" required />
                </span>
              </label>
              <label className="form-field form-field-wide">
                <span>Pilih Jurusan <span className="required">*</span></span>
                <span className="input-wrap">
                  <FieldIcon name="book" />
                  <select name="major" defaultValue="" required>
                    <option value="" disabled>-- Pilih Jurusan yang Diminati --</option>
                    <option value="ipa">Ilmu Pengetahuan Alam (IPA)</option>
                    <option value="ips">Ilmu Pengetahuan Sosial (IPS)</option>
                    <option value="bahasa">Bahasa dan Budaya</option>
                  </select>
                  <svg className="select-chevron" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                    <path d="m5 7.5 5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </label>
              <label className="form-field">
                <span>Password <span className="required">*</span></span>
                <span className="input-wrap">
                  <FieldIcon name="lock" />
                  <input name="password" type="password" placeholder="Minimal 8 karakter" autoComplete="new-password" minLength={8} required />
                </span>
              </label>
              <label className="form-field">
                <span>Konfirmasi Password <span className="required">*</span></span>
                <span className="input-wrap">
                  <FieldIcon name="lock" />
                  <input name="confirmPassword" type="password" placeholder="Ulangi password" autoComplete="new-password" minLength={8} required />
                </span>
              </label>
            </div>

            <button className="submit-button" type="submit">Daftar Sekarang</button>
            <p className="login-prompt">
              Sudah punya akun? <a href="/login">Masuk di sini</a>
            </p>
            <p className="form-notice" role="status" aria-live="polite">{notice}</p>
          </form>
        </div>
      </section>
    </main>
  );
}

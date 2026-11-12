"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "../auth.module.css";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErrors([]);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) {
        setErrors(data.errors || ["Terjadi kesalahan, coba lagi."]);
        setLoading(false);
        return;
      }

      router.push("/login");
    } catch {
      setErrors(["Tidak bisa terhubung ke server."]);
      setLoading(false);
    }
  }

  function handleSocial(provider) {
    alert(
      `Daftar dengan ${provider} belum dikonfigurasi.\nTambahkan kredensial OAuth ${provider} untuk mengaktifkan tombol ini (lihat README.md).`
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.title}>Buat akun baru</h1>
        <p className={styles.subtitle}>Isi data di bawah untuk memulai.</p>

        {errors.length > 0 ? (
          <div className={styles.error}>
            {errors.map((err) => (
              <div key={err}>{err}</div>
            ))}
          </div>
        ) : null}

        <div className={styles.socials}>
          <button
            type="button"
            className={styles["social-btn"]}
            onClick={() => handleSocial("Google")}
          >
            <img src="/icons/google.svg" alt="" />
            <p>
              Google
              <span className={styles["extra-text"]}>Daftar cepat</span>
            </p>
          </button>
          <button
            type="button"
            className={styles["social-btn"]}
            onClick={() => handleSocial("GitHub")}
          >
            <img src="/icons/github.svg" alt="" />
            <p>
              GitHub
              <span className={styles["extra-text"]}>Untuk developer</span>
            </p>
          </button>
        </div>

        <span className={styles.or}>atau daftar dengan email</span>

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <div className={styles.field}>
            <label htmlFor="name">Nama lengkap</label>
            <input
              id="name"
              name="name"
              type="text"
              required
              autoFocus
              placeholder="Nama kamu"
              value={form.name}
              onChange={handleChange}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="nama@email.com"
              value={form.email}
              onChange={handleChange}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="password">Kata sandi</label>
            <div className={styles["password-wrap"]}>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                minLength={8}
                placeholder="Minimal 8 karakter"
                value={form.password}
                onChange={handleChange}
              />
              <button
                type="button"
                className={styles["toggle-pw"]}
                onClick={() => setShowPassword((s) => !s)}
              >
                {showPassword ? "Sembunyikan" : "Lihat"}
              </button>
            </div>
            <span className={styles["field-hint"]}>
              Gunakan kombinasi huruf, angka, dan simbol.
            </span>
          </div>

          <div className={styles.field}>
            <label htmlFor="passwordConfirm">Konfirmasi kata sandi</label>
            <input
              id="passwordConfirm"
              name="passwordConfirm"
              type={showPassword ? "text" : "password"}
              required
              minLength={8}
              placeholder="Ulangi kata sandi"
              value={form.passwordConfirm}
              onChange={handleChange}
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Memproses..." : "Buat akun"}
          </button>
        </form>

        <p className={styles.footer}>
          Sudah punya akun? <Link href="/login">Masuk</Link>
        </p>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "../auth.module.css";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Terjadi kesalahan, coba lagi.");
        setLoading(false);
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Tidak bisa terhubung ke server.");
      setLoading(false);
    }
  }

  function handleSocial(provider) {
    alert(
      `Login dengan ${provider} belum dikonfigurasi.\nTambahkan kredensial OAuth ${provider} untuk mengaktifkan tombol ini (lihat README.md).`
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.title}>Selamat datang kembali</h1>
        <p className={styles.subtitle}>Masuk untuk melanjutkan ke akunmu.</p>

        {error ? <div className={styles.error}>{error}</div> : null}

        <div className={styles.socials}>
          <button
            type="button"
            className={styles["social-btn"]}
            onClick={() => handleSocial("Google")}
          >
            <img src="/icons/google.svg" alt="" />
            <p>
              Google
              <span className={styles["extra-text"]}>Masuk cepat</span>
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

        <span className={styles.or}>atau masuk dengan email</span>

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <div className={styles.field}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoFocus
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
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Memproses..." : "Masuk"}
          </button>
        </form>

        <p className={styles.footer}>
          Belum punya akun? <Link href="/register">Daftar</Link>
        </p>
      </div>
    </div>
  );
}

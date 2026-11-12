# Kasir restoran - tahap 1: login dan buka shift

Tanpa dependensi. Cukup Node.js 18 atau lebih baru.

## Menjalankan
    node server.js
Buka http://localhost:3000

Saat pertama jalan, dibuat tiga akun awal di data/users.json:
kasir / kasir123, admin / admin123, pemilik / pemilik123.
Segera buat akun sendiri dengan `node scripts/adduser.js` (menambah atau menimpa akun;
kata sandi minimal 8 karakter), lalu ubah atau hapus akun awal di data/users.json.

## Pengaturan
- PORT (bawaan 3000)
- HOST (bawaan 127.0.0.1). Pakai HOST=0.0.0.0 agar bisa diakses dari tablet lain di jaringan restoran.
  Untuk akses di luar jaringan lokal, pasang di belakang HTTPS (misalnya Caddy atau Nginx).

## Yang sudah ada
- Kata sandi di-hash (scrypt + salt), dibandingkan dengan timing-safe.
- Sesi lewat cookie HttpOnly + SameSite=Strict, berlaku 12 jam. Sesi disimpan di memori, jadi hilang saat server restart.
- Kunci 30 detik setelah 5 kali salah (per alamat + nama pengguna).
- Modal awal kas kasir dicatat di data/shifts.json.
- /app.html hanya bisa dibuka setelah login.

## Struktur
    server.js        server HTTP dan API (/api/login, /api/me, /api/logout)
    auth.js          hash kata sandi dan baca/tulis JSON
    public/          index.html (login), app.html (halaman setelah login)
    scripts/         adduser.js
    data/            dibuat otomatis (users.json, shifts.json)

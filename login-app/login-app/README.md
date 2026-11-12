# Akar — Login & Register (Flask + SQLite)

Aplikasi contoh dengan halaman login dan registrasi yang sudah terhubung ke database.

## Isi proyek

```
login-app/
├── app.py              # Server Flask (routing, sesi, validasi)
├── database.py         # Setup & query database SQLite
├── requirements.txt
├── instance/
│   └── akar.db          # File database (dibuat otomatis saat pertama dijalankan)
├── templates/
│   ├── login.html
│   ├── register.html
│   └── dashboard.html
└── static/
    ├── style.css
    └── script.js
```

## Cara menjalankan

1. Pastikan Python 3.9+ terpasang.
2. Buat virtual environment (opsional tapi disarankan):
   ```bash
   python3 -m venv venv
   source venv/bin/activate   # Windows: venv\Scripts\activate
   ```
3. Install dependensi:
   ```bash
   pip install -r requirements.txt
   ```
4. Jalankan aplikasi:
   ```bash
   python3 app.py
   ```
5. Buka browser ke **http://localhost:5000**

Database SQLite (`instance/akar.db`) otomatis dibuat berikut tabel `users` saat aplikasi pertama kali dijalankan — tidak perlu instalasi database server terpisah (MySQL/Postgres dsb).

## Struktur tabel `users`

| Kolom          | Tipe    | Keterangan                          |
|----------------|---------|--------------------------------------|
| id             | INTEGER | Primary key, auto increment          |
| name           | TEXT    | Nama lengkap pengguna                |
| email          | TEXT    | Unik, disimpan huruf kecil           |
| password_hash  | TEXT    | Hash PBKDF2 (werkzeug), bukan plain  |
| created_at     | TEXT    | Waktu akun dibuat (UTC, ISO 8601)    |
| last_login_at  | TEXT    | Waktu login terakhir                 |

## Fitur yang sudah ada

- Registrasi dengan validasi (nama, format email, panjang kata sandi, konfirmasi kata sandi cocok)
- Kata sandi di-hash dengan `werkzeug.security` (PBKDF2), tidak pernah disimpan dalam bentuk asli
- Login dengan sesi (`Flask session`), redirect otomatis ke dashboard bila sudah login
- Halaman dashboard contoh setelah login, tombol keluar (logout)
- Pesan error/sukses (flash message) untuk email terdaftar, kata sandi salah, dsb.
- Tombol "Lihat/Sembunyikan" kata sandi
- Desain responsif (split-screen di desktop, ditumpuk di layar kecil)

## Catatan sebelum dipakai untuk produksi

Proyek ini dibuat sebagai contoh yang bisa langsung dijalankan secara lokal. Untuk penggunaan nyata, sebaiknya tambahkan:

- Ganti `app.secret_key` di `app.py` dengan nilai acak yang dirahasiakan (mis. lewat environment variable `AKAR_SECRET_KEY`), jangan pakai nilai contoh di kode.
- Proteksi CSRF pada form (misalnya dengan `Flask-WTF`).
- Rate limiting untuk mencegah percobaan login bertubi-tubi (brute force).
- Verifikasi email saat registrasi.
- HTTPS saat di-deploy, dan set cookie sesi menjadi `Secure` + `HttpOnly`.
- Jika trafik besar, migrasi dari SQLite ke PostgreSQL/MySQL.

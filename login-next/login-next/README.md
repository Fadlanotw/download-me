# Login Next.js + SQLite

Halaman login & register menggunakan Next.js (App Router) dengan styling
berdasarkan CSS yang kamu berikan, lengkap dengan database SQLite.

## Isi proyek

```
login-next/
├── app/
│   ├── (auth)/
│   │   ├── auth.module.css     # CSS kamu (tidak diubah) + tambahan pelengkap
│   │   ├── login/page.js
│   │   └── register/page.js
│   ├── api/
│   │   ├── auth/{login,register,logout}/route.js
│   │   └── me/route.js
│   ├── dashboard/
│   │   ├── page.js
│   │   └── logout-button.js
│   ├── layout.js
│   ├── page.js                  # redirect ke /login
│   └── globals.css
├── lib/
│   ├── db.js                    # koneksi SQLite + pembuatan tabel
│   ├── users.js                 # query-query user
│   └── auth.js                  # pembuatan & verifikasi token sesi (JWT)
├── middleware.js                 # proteksi route /dashboard
├── public/icons/{google,github}.svg
├── .env.example
└── package.json
```

## Cara menjalankan

1. Pastikan Node.js 18+ terpasang.
2. Install dependensi:
   ```bash
   npm install
   ```
3. Salin file environment lalu isi secret-nya:
   ```bash
   cp .env.example .env.local
   ```
   Ganti nilai `JWT_SECRET` dengan string acak, misalnya hasil dari:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
4. Jalankan:
   ```bash
   npm run dev
   ```
5. Buka **http://localhost:3000** — otomatis diarahkan ke halaman login.

Database SQLite (`data/app.db`) otomatis dibuat berikut tabel `users`
saat kamu pertama kali membuka aplikasi (memanggil salah satu API route) —
tidak perlu instalasi database server terpisah.

## Skema tabel `users`

| Kolom          | Tipe    | Keterangan                                |
|----------------|---------|--------------------------------------------|
| id             | INTEGER | Primary key, auto increment                |
| name           | TEXT    | Nama lengkap pengguna                       |
| email          | TEXT    | Unik, disimpan huruf kecil                  |
| password_hash  | TEXT    | Hash bcrypt, bukan kata sandi asli          |
| created_at     | TEXT    | Waktu akun dibuat (default `datetime('now')`) |
| last_login_at  | TEXT    | Waktu login terakhir                        |

## Bagaimana CSS kamu dipakai

`app/(auth)/auth.module.css` memuat CSS yang kamu berikan **persis seperti
aslinya** di bagian atas file (class `.socials`, `.social-btn`, `.extra-text`,
`.or`, dan selector `button[type="submit"]`). Di bagian bawah file saya
tambahkan properti pelengkap untuk hal-hal yang belum diatur CSS kamu —
seperti ukuran kartu, padding tombol, dan styling input — tanpa mengubah
aturan yang sudah ada (mis. `border: 0` pada `.social-btn` tetap dihormati;
saya tambahkan `background` sebagai pembeda visual, bukan `border`).

Karena nama class di CSS aslimu pakai tanda hubung (kebab-case), di komponen
React classnya diakses lewat notasi `styles["social-btn"]`, `styles["or"]`,
dst — bukan `styles.socialBtn` — supaya sesuai persis dengan yang kamu tulis.

## Alur autentikasi

- **Register** (`/register`): validasi nama, format email, panjang kata sandi
  (≥8), konfirmasi kata sandi cocok, dan email belum terdaftar. Kata sandi
  di-hash dengan `bcryptjs` sebelum disimpan.
- **Login** (`/login`): memverifikasi email + kata sandi, lalu membuat token
  sesi (JWT, ditandatangani dengan `jose`) yang disimpan sebagai cookie
  `httpOnly`.
- **Middleware** (`middleware.js`): melindungi `/dashboard` — kalau belum
  login akan diarahkan ke `/login`; kalau sudah login dan membuka
  `/login`/`/register`, otomatis diarahkan ke `/dashboard`.
- **Logout**: menghapus cookie sesi.

## Tombol "Masuk dengan Google/GitHub"

Tombol sosial pada CSS kamu sudah saya buatkan tampilannya (ikon + label +
teks kecil di bawahnya, sesuai struktur `.social-btn p` yang kamu tulis
sebagai flex-column). Karena login OAuth sungguhan butuh Client ID/Secret
dari masing-masing provider, saat ini tombol tersebut hanya menampilkan
pesan info. Untuk mengaktifkannya secara nyata, opsi termudah adalah
menambahkan `next-auth` dan mendaftarkan provider Google/GitHub di sana.

## Catatan sebelum dipakai untuk produksi

- Ganti `JWT_SECRET` dengan nilai rahasia yang kuat (jangan pernah commit
  ke git — file `.env.local` sudah masuk `.gitignore`).
- Tambahkan rate limiting pada endpoint login untuk mencegah brute force.
- Tambahkan verifikasi email saat registrasi.
- Jalankan di balik HTTPS; cookie sesi sudah otomatis diset `Secure` saat
  `NODE_ENV=production`.
- SQLite cocok untuk skala kecil–menengah dan deployment single-server;
  untuk trafik besar atau deployment serverless (mis. Vercel), pertimbangkan
  migrasi ke PostgreSQL (mis. lewat Neon/Supabase) karena filesystem di
  banyak platform serverless bersifat sementara (ephemeral).

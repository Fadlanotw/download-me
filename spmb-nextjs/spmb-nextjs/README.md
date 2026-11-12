# SPMB SMA Garuda Utama

Portal pendaftaran murid dan administrasi SPMB SMA Garuda Utama.

## Menjalankan aplikasi

Gunakan Node.js 22.5 atau lebih baru (database memakai `node:sqlite`):

```bash
npm install
npm run dev
```

Buka `http://localhost:3000` untuk homepage, `http://localhost:3000/register`
untuk pendaftaran murid, `http://localhost:3000/login` untuk login pendaftar,
`http://localhost:3000/admin/login` untuk login admin, atau
`http://localhost:3000/kepala-sekolah/login` untuk login kepala sekolah.

## Membuat akun admin pertama

Jalankan perintah berikut dari terminal interaktif:

```bash
npm run admin:create
```

Masukkan username dan password ketika diminta. Password tidak ditampilkan saat
diketik dan disimpan sebagai hash scrypt. Password harus memiliki panjang
minimal 12 karakter.

Database SQLite dibuat di `data/spmb.sqlite` secara default; direktori `data`
diabaikan Git. Untuk memakai lokasi database lain, atur `SPMB_DB_PATH` sebelum
menjalankan aplikasi dan perintah pembuatan akun. Pastikan direktori database
tersimpan secara persisten ketika aplikasi di-deploy.

Sesi admin disimpan di server dan cookie-nya berumur 8 jam. Lima kegagalan login
dari alamat klien yang sama memicu jeda login selama 15 menit.

## Membuat akun kepala sekolah

Jalankan perintah berikut dari terminal interaktif:

```bash
npm run principal:create
```

Masukkan NIP atau email sekolah, lalu buat kata sandi minimal 12 karakter.
Kata sandi disimpan sebagai hash scrypt. Akun kepala sekolah memiliki sesi
terpisah dari akun admin; sesi standar berlaku 8 jam dan opsi “Ingat saya”
berlaku 30 hari. Lima kegagalan login dari alamat klien yang sama memicu jeda
login selama 15 menit.

## Batas fitur saat ini

Dashboard admin dan autentikasi akun admin aktif. Formulir pendaftaran murid
belum terhubung ke database pendaftar, sehingga pengelolaan dan statistik data
pendaftar belum tersedia.

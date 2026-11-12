# Layanan BTT Pemerintah Kota Depok (Next.js + Prisma + MySQL)

## Menjalankan
1. Nyalakan MySQL (Laragon), buat database kosong bernama `btt_depok` jika belum ada.
2. Di folder ini jalankan:
   npm install
   npx prisma generate
   npx prisma db push
   npm run seed        (hanya untuk database baru/kosong)
   npm run dev
3. Buka http://localhost:3000

File `.env` sudah berisi pengaturan untuk Laragon (root tanpa sandi). Jika MySQL memakai sandi, ubah `DATABASE_URL`.

## Mengisi konten
- `lib/info.js`: alamat, telepon, WhatsApp, email, jam layanan, dan pengumuman (kolom kosong tidak ditampilkan).
- `public/dokumen/`: taruh PDF/Word (formulir, contoh surat, Perwal). Otomatis muncul di halaman Unduhan.
- `public/walikota.jpg`: foto Wali Kota untuk kartu di beranda.
- `public/logo-depok.png`: lambang di header.

## Akun contoh (hanya untuk uji coba)
admin@depok.go.id / admin123; disrumkim, sekda, hukum, walikota, bkd @depok.go.id / depok123

## Sebelum dipakai sungguhan
- Panel akun contoh di halaman masuk petugas hanya tampil saat `DEMO_MODE="true"` dan aplikasi berjalan dengan `npm run dev`. Pada mode produksi (`npm run build` lalu `npm start`) panel itu otomatis mati. Tetap set `DEMO_MODE="false"` dan ganti semua kata sandi bawaan lewat menu Sandi.
- Ganti `AUTH_SECRET` dengan teks acak panjang baru.
- Pasang HTTPS, backup database berkala, dan proteksi bot (captcha) di pendaftaran.

Untuk mengganti sandi semua akun petugas sekaligus dengan sandi acak: `npm run acak-sandi -- --ya` (catat hasilnya).

## Email (opsional)
Isi `SMTP_*` di `.env` (dan `APP_URL` bila perlu) lalu jalankan `npm install`. Setelah aktif: warga menerima email saat permohonan diterima dan statusnya berubah, dan fitur Lupa kata sandi berfungsi. Jika `SMTP_HOST` kosong, semuanya nonaktif tanpa error.

## Alur
Warga ajukan -> Wali Kota disposisi -> Disrumkim verifikasi admin+lapangan -> Sekda (TAPD) -> Disrumkim draft SK -> Hukum verifikasi -> Disrumkim paraf -> Wali Kota TTD -> Hukum penomoran -> Disrumkim penyerahan -> BKD pencairan -> Selesai.

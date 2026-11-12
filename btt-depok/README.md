# Layanan BTT Pemerintah Kota Depok (Next.js + Prisma + MySQL)
1. Nyalakan MySQL (Laragon), buat database `btt_depok`. Sesuaikan `.env`.
2. `npm install`
3. `npx prisma db push` lalu `npm run seed` (admin: admin@depok.go.id / admin123 — ganti segera)
4. `npm run dev` -> http://localhost:3000
Berkas unggahan disimpan di folder `uploads/` (hanya pemilik & admin yang bisa membuka).
Untuk Vercel, ganti penyimpanan berkas ke layanan object storage (Vercel Blob/S3) karena disk Vercel tidak permanen.

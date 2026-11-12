# Panduan deploy

## Pilih Railway (disarankan)
Aplikasi menyimpan berkas unggahan warga di disk. Railway menyediakan Volume (disk permanen) dan MySQL,
jadi seluruh aplikasi berjalan tanpa perubahan kode.

### Langkah
1. Unggah folder ini ke repositori GitHub (file .env tidak ikut karena ada di .gitignore).
2. Di railway.com: New Project -> Deploy from GitHub repo -> pilih repositori.
3. Di project yang sama: New -> Database -> Add MySQL.
4. Buka service aplikasi -> Variables, isi:
   - DATABASE_URL  = ${{MySQL.MYSQL_URL}}   (pilih lewat Add Reference)
   - AUTH_SECRET   = string acak panjang (buat dengan: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
   - DEMO_MODE     = false
   - UPLOAD_DIR    = /data/uploads
   - APP_URL       = https://alamat-situs-anda.up.railway.app
   - SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM
5. Service aplikasi -> Settings -> Volumes -> Add Volume, Mount path: /data
6. Settings -> Networking -> Generate Domain.
7. Isi akun petugas pertama (sekali saja), dari komputer Anda dengan Railway CLI:
   npm i -g @railway/cli
   railway login && railway link
   railway run npm run seed
   railway run npm run acak-sandi -- --ya     (simpan daftar sandi yang tampil)

Tabel database dibuat otomatis saat aplikasi mulai (prisma db push).

## Vercel
Belum cocok untuk aplikasi ini tanpa perubahan. Vercel tidak punya disk permanen, sehingga berkas yang
diunggah warga akan hilang atau gagal tersimpan. Agar bisa di Vercel, penyimpanan berkas harus dipindah
ke layanan seperti Vercel Blob atau S3, dan database MySQL harus di layanan luar (misalnya Railway MySQL).

# Project SPMB — Next.js + JavaScript + Laragon + MySQL

## Cara memakai
1. Laragon -> Start All (MySQL Running).
2. cd C:\laragon\www lalu: npx create-next-app@latest spmb
   (TypeScript: No, ESLint: Yes, Tailwind: Yes, src/: No, App Router: Yes, alias: No)
3. cd spmb lalu: npm install mysql2
4. Salin isi folder ini (lib, app, database) ke dalam project spmb, timpa app/page.js.
5. Buka http://localhost/phpmyadmin -> tab Import -> pilih database/spmb.sql
   (otomatis membuat database spmb, tabel, dan data jurusan).
6. npm run dev
   - http://localhost:3000/api/test-db  -> tes koneksi
   - http://localhost:3000              -> Home
   - http://localhost:3000/daftar       -> form pendaftaran
   - http://localhost:3000/admin        -> dashboard admin

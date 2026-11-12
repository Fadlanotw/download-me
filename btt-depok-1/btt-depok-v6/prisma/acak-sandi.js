const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const p = new PrismaClient();
const H = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789';
const buat = () => Array.from(crypto.randomBytes(14), (b) => H[b % H.length]).join('');
(async () => {
  if (!process.argv.includes('--ya')) { console.log('Perintah ini mengganti sandi SEMUA akun petugas.\nJalankan: npm run acak-sandi -- --ya'); return; }
  const staf = await p.user.findMany({ where: { role: { not: 'warga' } }, orderBy: { id: 'asc' } });
  for (const u of staf) { const pw = buat(); await p.user.update({ where: { id: u.id }, data: { password: await bcrypt.hash(pw, 10) } }); console.log(u.email.padEnd(34) + pw); }
  console.log('\nSimpan daftar ini di tempat aman. Sandi tidak dapat dilihat lagi.');
})().finally(() => p.$disconnect());

// Menguji pengiriman email dan menampilkan penyebab jika gagal. Jalankan: npm run tes-email
const fs = require('fs');
try { for (const l of fs.readFileSync('.env', 'utf8').split(/\r?\n/)) { const m = l.match(/^\s*([A-Z_]+)\s*=\s*"?([^"#]*)"?/); if (m && process.env[m[1]] === undefined) process.env[m[1]] = m[2].trim(); } } catch { console.log('File .env tidak ditemukan di folder ini.'); process.exit(1); }
const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM } = process.env;
console.log('SMTP_HOST :', SMTP_HOST || '(KOSONG)');
console.log('SMTP_PORT :', SMTP_PORT || '(KOSONG)');
console.log('SMTP_USER :', SMTP_USER || '(KOSONG)');
console.log('SMTP_PASS :', SMTP_PASS ? `terisi (${SMTP_PASS.replace(/\s/g, '').length} karakter)` : '(KOSONG)');
if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) { console.log('\nGAGAL: isi dulu SMTP_HOST, SMTP_USER, dan SMTP_PASS di .env.'); process.exit(1); }
const nm = require('nodemailer'), port = Number(SMTP_PORT || 587);
const t = nm.createTransport({ host: SMTP_HOST, port, secure: port === 465, auth: { user: SMTP_USER, pass: SMTP_PASS.replace(/\s/g, '') } });
t.sendMail({ from: SMTP_FROM || SMTP_USER, to: SMTP_USER, subject: 'Tes email – Layanan BTT Kota Depok', text: 'Jika email ini masuk, pengaturan SMTP sudah benar.' })
  .then(() => console.log('\nBERHASIL: email tes terkirim ke ' + SMTP_USER + '. Cek Kotak Masuk dan Spam.'))
  .catch((e) => console.log('\nGAGAL: ' + e.message));

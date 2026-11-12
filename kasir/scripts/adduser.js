const readline = require('readline/promises');
const { FILES, load, save, hash } = require('../auth');
(async () => {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const username = (await rl.question('Nama pengguna: ')).trim().toLowerCase();
  const name = (await rl.question('Nama tampilan: ')).trim();
  const role = (await rl.question('Peran (kasir/admin/pemilik): ')).trim();
  const pw = await rl.question('Kata sandi (min. 8 karakter): ');
  rl.close();
  if (!/^[a-z0-9._-]{3,30}$/.test(username) || !name || !['kasir', 'admin', 'pemilik'].includes(role) || pw.length < 8) {
    console.error('Data tidak valid. Tidak ada yang disimpan.'); process.exit(1);
  }
  const users = load(FILES.users, []).filter((u) => u.username !== username);
  users.push({ username, name, role, hash: hash(pw) });
  save(FILES.users, users);
  console.log(`Akun "${username}" disimpan.`);
})();

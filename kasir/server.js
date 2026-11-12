const http = require('http'), fs = require('fs'), path = require('path'), crypto = require('crypto');
const { FILES, load, save, hash, verify } = require('./auth');

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '127.0.0.1';
const PUB = path.join(__dirname, 'public');
const SESSION_MS = 12 * 3600e3;

if (!fs.existsSync(FILES.users)) {
  const seed = [['kasir', 'Sari', 'kasir'], ['admin', 'Budi', 'admin'], ['pemilik', 'Ibu Ratna', 'pemilik']]
    .map(([username, name, role]) => ({ username, name, role, hash: hash(username + '123') }));
  save(FILES.users, seed);
  console.log('Akun awal dibuat (kasir/kasir123, admin/admin123, pemilik/pemilik123). Segera ganti: node scripts/adduser.js');
}

const DUMMY = hash('dummy');
const sessions = new Map(), tries = new Map();
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.ico': 'image/x-icon' };

const send = (res, code, obj, headers = {}) => {
  res.writeHead(code, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...headers });
  res.end(JSON.stringify(obj));
};
const sessionOf = (req) => {
  const m = /(?:^|; )sid=([a-f0-9]+)/.exec(req.headers.cookie || '');
  const s = m && sessions.get(m[1]);
  if (s && s.exp > Date.now()) return { token: m[1], ...s };
  if (m) sessions.delete(m[1]);
  return null;
};
const readBody = (req) => new Promise((ok, no) => {
  let d = '';
  req.on('data', (c) => { d += c; if (d.length > 10240) { no(); req.destroy(); } });
  req.on('end', () => { try { ok(JSON.parse(d || '{}')); } catch { no(); } });
});

async function login(req, res) {
  if (!(req.headers['content-type'] || '').startsWith('application/json')) return send(res, 415, { error: 'Permintaan tidak valid.' });
  const b = await readBody(req).catch(() => null);
  if (!b) return send(res, 400, { error: 'Permintaan tidak valid.' });

  const username = String(b.username || '').trim().toLowerCase(), password = String(b.password || ''), role = String(b.role || '');
  const key = req.socket.remoteAddress + '|' + username;
  const t = tries.get(key) || { n: 0, until: 0 };
  if (t.until > Date.now()) return send(res, 429, { error: `Terlalu banyak percobaan. Coba lagi dalam ${Math.ceil((t.until - Date.now()) / 1000)} detik.` });

  const user = load(FILES.users, []).find((u) => u.username === username);
  const passOk = verify(password, user ? user.hash : DUMMY);
  if (!user || !passOk || user.role !== role) {
    if (++t.n >= 5) { t.until = Date.now() + 30000; t.n = 0; }
    tries.set(key, t);
    return send(res, 401, { error: 'Nama pengguna, kata sandi, atau peran tidak cocok. Periksa lagi.' });
  }
  tries.delete(key);

  let shift = null;
  if (role === 'kasir') {
    const cash = Number(b.openingCash);
    if (!Number.isInteger(cash) || cash < 0 || cash > 1e8) return send(res, 400, { error: 'Modal awal kas tidak valid.' });
    shift = { id: crypto.randomUUID(), user: username, openingCash: cash, openedAt: new Date().toISOString() };
    const all = load(FILES.shifts, []); all.push(shift); save(FILES.shifts, all);
  }
  const token = crypto.randomBytes(24).toString('hex');
  const me = { username, name: user.name, role };
  sessions.set(token, { user: me, shift, exp: Date.now() + SESSION_MS });
  send(res, 200, { ...me, shift }, { 'Set-Cookie': `sid=${token}; HttpOnly; SameSite=Strict; Path=/; Max-Age=${SESSION_MS / 1000}` });
}

http.createServer(async (req, res) => {
  try {
    const { pathname } = new URL(req.url, 'http://x');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');

    if (pathname === '/api/login' && req.method === 'POST') return await login(req, res);
    if (pathname === '/api/me' && req.method === 'GET') {
      const s = sessionOf(req);
      return s ? send(res, 200, { ...s.user, shift: s.shift }) : send(res, 401, { error: 'Belum masuk.' });
    }
    if (pathname === '/api/logout' && req.method === 'POST') {
      const s = sessionOf(req); if (s) sessions.delete(s.token);
      return send(res, 200, { ok: true }, { 'Set-Cookie': 'sid=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0' });
    }
    if (pathname.startsWith('/api/')) return send(res, 404, { error: 'Tidak ditemukan.' });

    const rel = pathname === '/' ? '/index.html' : decodeURIComponent(pathname);
    if (rel === '/app.html' && !sessionOf(req)) { res.writeHead(302, { Location: '/' }); return res.end(); }
    const file = path.join(PUB, path.normalize(rel));
    if (!file.startsWith(PUB + path.sep)) { res.writeHead(403); return res.end(); }
    fs.readFile(file, (err, data) => {
      if (err) { res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }); return res.end('Halaman tidak ditemukan'); }
      res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream' });
      res.end(data);
    });
  } catch {
    if (!res.headersSent) send(res, 500, { error: 'Terjadi kesalahan di server.' });
  }
}).listen(PORT, HOST, () => console.log(`Kasir berjalan di http://${HOST === '0.0.0.0' ? 'localhost' : HOST}:${PORT}`));

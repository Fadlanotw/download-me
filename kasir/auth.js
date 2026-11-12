const fs = require('fs'), path = require('path'), crypto = require('crypto');
const DATA = path.join(__dirname, 'data');
const FILES = { users: path.join(DATA, 'users.json'), shifts: path.join(DATA, 'shifts.json') };
fs.mkdirSync(DATA, { recursive: true });

const load = (f, d) => { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch { return d; } };
const save = (f, v) => { fs.writeFileSync(f + '.tmp', JSON.stringify(v, null, 2)); fs.renameSync(f + '.tmp', f); };

const hash = (pw) => {
  const salt = crypto.randomBytes(16).toString('hex');
  return salt + ':' + crypto.scryptSync(pw, salt, 64).toString('hex');
};
const verify = (pw, stored) => {
  const [salt, key] = stored.split(':');
  const a = Buffer.from(key, 'hex'), b = crypto.scryptSync(pw, salt, 64);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
};

module.exports = { FILES, load, save, hash, verify };

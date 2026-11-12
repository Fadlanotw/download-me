import crypto from 'crypto';
const S = process.env.AUTH_SECRET || 'dev-secret';
const sig = (v) => crypto.createHmac('sha256', S).update('captcha.' + v).digest('hex').slice(0, 32);
export function buatCaptcha() {
  const a = 2 + crypto.randomInt(8), b = 2 + crypto.randomInt(8), v = `${a + b}.${Date.now() + 15 * 60000}`;
  return { soal: `${a} + ${b}`, token: `${v}.${sig(v)}` };
}
export function cekCaptcha(token, jawab) {
  const [ans, exp, sg] = String(token || '').split('.');
  if (!sg || Date.now() > Number(exp)) return false;
  const ok = sig(`${ans}.${exp}`);
  if (ok.length !== sg.length || !crypto.timingSafeEqual(Buffer.from(ok), Buffer.from(sg))) return false;
  return String(parseInt(jawab, 10)) === ans;
}

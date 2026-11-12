import crypto from 'crypto';
import { prisma } from './db';
const S = process.env.AUTH_SECRET || 'dev-secret';
const sig = (v) => crypto.createHmac('sha256', S).update('reset.' + v).digest('hex');
// Tautan berlaku 1 jam dan otomatis tidak berlaku lagi setelah sandi diganti.
export function buatToken(u) {
  const exp = Date.now() + 3600000, v = `${u.id}.${exp}`;
  return Buffer.from(`${v}.${sig(`${v}.${u.password.slice(-16)}`)}`).toString('base64url');
}
export async function bacaToken(t) {
  try {
    const [id, exp, sg] = Buffer.from(String(t), 'base64url').toString().split('.');
    if (!sg || Date.now() > Number(exp)) return null;
    const u = await prisma.user.findUnique({ where: { id: Number(id) } });
    if (!u || u.role !== 'warga') return null;
    const ok = sig(`${id}.${exp}.${u.password.slice(-16)}`);
    return ok.length === sg.length && crypto.timingSafeEqual(Buffer.from(ok), Buffer.from(sg)) ? u : null;
  } catch { return null; }
}

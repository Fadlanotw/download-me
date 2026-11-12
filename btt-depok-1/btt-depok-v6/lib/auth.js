import crypto from 'crypto';
import { cookies } from 'next/headers';
import { prisma } from './db';
import { PORTAL } from './constants';
if (process.env.NODE_ENV === 'production' && !process.env.AUTH_SECRET) throw new Error('AUTH_SECRET wajib diisi di production');
const S = process.env.AUTH_SECRET || 'dev-secret';
const sign = (v) => crypto.createHmac('sha256', S).update(v).digest('hex');
const same = (a, b) => a.length === b.length && crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));
export function setSession(id, portal) {
  const exp = Date.now() + PORTAL[portal].jam * 3600000, v = `${id}.${portal}.${exp}`;
  cookies().set('sid', `${v}.${sign(v)}`, { httpOnly: true, sameSite: 'strict', secure: process.env.NODE_ENV === 'production', path: '/', maxAge: PORTAL[portal].jam * 3600 });
}
export function clearSession() { cookies().delete('sid'); }
export async function getUser() {
  const c = cookies().get('sid')?.value; if (!c) return null;
  const [id, portal, exp, sig] = c.split('.');
  if (!sig || !PORTAL[portal] || Date.now() > Number(exp) || !same(sig, sign(`${id}.${portal}.${exp}`))) return null;
  const u = await prisma.user.findUnique({ where: { id: Number(id) } });
  return u && PORTAL[portal].roles.includes(u.role) ? u : null;
}

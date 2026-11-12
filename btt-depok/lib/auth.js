import crypto from 'crypto';
import { cookies } from 'next/headers';
import { prisma } from './db';
const S = process.env.AUTH_SECRET || 'dev-secret';
const sign = (v) => crypto.createHmac('sha256', S).update(v).digest('hex');
export function setSession(id) { const v = String(id); cookies().set('sid', v + '.' + sign(v), { httpOnly: true, sameSite: 'lax', path: '/', maxAge: 604800 }); }
export function clearSession() { cookies().delete('sid'); }
export async function getUser() {
  const c = cookies().get('sid')?.value; if (!c) return null;
  const [id, sig] = c.split('.'); if (!sig || sig !== sign(id)) return null;
  return prisma.user.findUnique({ where: { id: Number(id) } });
}

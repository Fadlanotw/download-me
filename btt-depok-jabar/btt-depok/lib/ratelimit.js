import { headers } from 'next/headers';
export const ipPengguna = () => (headers().get('x-forwarded-for') || 'lokal').split(',')[0].trim();
// Pembatas sederhana di memori (per proses server). Mengembalikan false jika sudah melewati batas.
export function batas(key, max, ms) {
  const m = (globalThis.__rl ||= new Map()), now = Date.now();
  const arr = (m.get(key) || []).filter((t) => now - t < ms);
  if (arr.length >= max) { m.set(key, arr); return false; }
  arr.push(now); m.set(key, arr);
  if (m.size > 5000) for (const [k, v] of m) if (!v.length || now - v[v.length - 1] > ms) m.delete(k);
  return true;
}

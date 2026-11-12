import fs from 'fs/promises';
import path from 'path';
import { prisma } from '@/lib/db';
import { getUser } from '@/lib/auth';
const T = { '.pdf': 'application/pdf', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg' };
export async function GET(_, { params }) {
  const u = await getUser();
  const p = await prisma.permohonan.findUnique({ where: { kode: params.kode } });
  if (!u || !p || (u.role !== 'admin' && p.userId !== u.id)) return new Response('Dilarang', { status: 403 });
  const name = path.basename(params.file);
  try { const b = await fs.readFile(path.join(process.env.UPLOAD_DIR || path.join(process.cwd(), 'uploads'), p.kode, name)); return new Response(b, { headers: { 'Content-Type': T[path.extname(name)] || 'application/octet-stream' } }); }
  catch { return new Response('Tidak ditemukan', { status: 404 }); }
}

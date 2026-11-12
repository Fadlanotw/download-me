import { prisma } from '@/lib/db';
import { getUser } from '@/lib/auth';
import { STATUS } from '@/lib/constants';
export const dynamic = 'force-dynamic';
const q = (v) => { let s = v == null ? '' : String(v); if (/^[=+\-@]/.test(s)) s = "'" + s; return '"' + s.replace(/"/g, '""') + '"'; };
export async function GET() {
  const u = await getUser();
  if (!u || u.role === 'warga') return new Response('Tidak diizinkan', { status: 403 });
  const rows = await prisma.permohonan.findMany({ include: { user: true }, orderBy: { createdAt: 'desc' } });
  const head = ['Kode', 'Tanggal diajukan', 'Pemohon', 'Jenis bencana', 'Tanggal kejadian', 'Kelurahan', 'Kecamatan', 'Tipe', 'Status', 'Nominal', 'Nomor SK'];
  const tgl = (d) => new Date(d).toISOString().slice(0, 10);
  const lines = rows.map((p) => [p.kode, tgl(p.createdAt), p.user.nama, p.jenisBencana, tgl(p.tanggalKejadian), p.kelurahan, p.kecamatan, p.tipe, STATUS[p.status] || p.status, p.nominal, p.nomorSK].map(q).join(','));
  return new Response('\ufeff' + [head.map(q).join(','), ...lines].join('\r\n'), { headers: { 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': 'attachment; filename="permohonan-btt.csv"' } });
}

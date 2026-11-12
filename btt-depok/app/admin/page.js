import Link from 'next/link';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { getUser } from '@/lib/auth';
import { STATUS } from '@/lib/constants';
import { Badge, fmt } from '../components';
export default async function Page({ searchParams }) {
  const u = await getUser(); if (!u || u.role !== 'admin') redirect('/masuk');
  const st = searchParams.status;
  const [list, grp] = await Promise.all([
    prisma.permohonan.findMany({ where: st ? { status: st } : {}, include: { user: true }, orderBy: { createdAt: 'desc' } }),
    prisma.permohonan.groupBy({ by: ['status'], _count: true })]);
  const c = Object.fromEntries(grp.map((g) => [g.status, g._count]));
  const total = grp.reduce((a, g) => a + g._count, 0);
  return (<div className="wrap sec"><h2>Panel Admin Disrumkim</h2>
    <div className="grid stats"><Link href="/admin" className="card"><b>{total}</b><small>Semua</small></Link>
      {Object.entries(STATUS).map(([k, v]) => <Link key={k} href={`/admin?status=${k}`} className="card"><b>{c[k] || 0}</b><small>{v}</small></Link>)}</div>
    <table><thead><tr><th>Kode</th><th>Pemohon</th><th>Bencana</th><th>Lokasi</th><th>Tanggal</th><th>Status</th></tr></thead><tbody>
      {list.map((p) => <tr key={p.id}><td><Link href={`/admin/${p.id}`}>{p.kode}</Link></td><td>{p.user.nama}</td><td>{p.jenisBencana}</td><td>{p.kelurahan}, {p.kecamatan}</td><td>{fmt(p.createdAt)}</td><td><Badge s={p.status} /></td></tr>)}
      {list.length === 0 && <tr><td colSpan={6} className="muted">Tidak ada data.</td></tr>}</tbody></table></div>);
}

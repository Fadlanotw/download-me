import Link from 'next/link';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { getUser } from '@/lib/auth';
import { STATUS, ALUR, ROLES } from '@/lib/constants';
import { Badge, fmt, hari } from '../components';
export default async function Page({ searchParams }) {
  const u = await getUser(); if (!u || u.role === 'warga') redirect('/portal/petugas');
  if (u.role !== 'admin' && !searchParams.tab && !searchParams.status) redirect('/admin/persetujuan');
  const tab = searchParams.tab || (u.role === 'admin' ? 'semua' : 'tugas'), st = searchParams.status;
  const mine = Object.entries(ALUR).filter(([, a]) => a.role === u.role).map(([k]) => k);
  const where = st ? { status: st } : tab === 'tugas' && u.role !== 'admin' ? { status: { in: mine } } : {};
  const [list, grp] = await Promise.all([
    prisma.permohonan.findMany({ where, include: { user: true }, orderBy: { tahapMulai: 'asc' } }),
    prisma.permohonan.groupBy({ by: ['status'], _count: true })]);
  const c = Object.fromEntries(grp.map((g) => [g.status, g._count]));
  const total = grp.reduce((a, g) => a + g._count, 0);
  const tugas = mine.reduce((a, k) => a + (c[k] || 0), 0);
  return (<div className="wrap sec"><div className="row between"><h2>Panel Petugas — {ROLES[u.role]}</h2>
      <span className="row">{u.role === 'admin' && <><Link href="/admin/pengguna" className="btn sm">Kelola Petugas</Link><Link href="/admin/log" className="btn sm">Log Akses</Link></>}<a href="/admin/ekspor" className="btn sm line">Unduh CSV</a></span></div>
    {searchParams.ok && <div className="alert ok">Tindakan tersimpan. Permohonan diteruskan ke tahap berikutnya.</div>}
    {u.role !== 'admin' && <div className="tabs"><Link href="/admin?tab=tugas" className={tab === 'tugas' && !st ? 'on' : ''}>Tugas Saya ({tugas})</Link><Link href="/admin?tab=semua" className={tab === 'semua' && !st ? 'on' : ''}>Semua ({total})</Link></div>}
    <div className="grid stats"><Link href="/admin?tab=semua" className="card"><b>{total}</b><small>Semua</small></Link>
      {Object.entries(STATUS).map(([k, v]) => <Link key={k} href={`/admin?status=${k}`} className="card"><b>{c[k] || 0}</b><small>{v}</small></Link>)}</div>
    <table><thead><tr><th>Kode</th><th>Pemohon</th><th>Bencana</th><th>Lokasi</th><th>Status</th><th>Lama di tahap</th></tr></thead><tbody>
      {list.map((p) => { const a = ALUR[p.status], d = hari(p.tahapMulai), late = a?.sla && d > a.sla;
        return <tr key={p.id}><td><Link href={`/admin/${p.id}`}>{p.kode}</Link></td><td>{p.user.nama}<br /><small>{p.tipe}</small></td><td>{p.jenisBencana}</td><td>{p.kelurahan}, {p.kecamatan}</td><td><Badge s={p.status} /></td>
          <td className={late ? 'late' : ''}>{a?.role ? `${d}/${a.sla || '-'} hari${late ? ' (terlambat)' : ''}` : '-'}</td></tr>; })}
      {list.length === 0 && <tr><td colSpan={6} className="muted">Tidak ada data.</td></tr>}</tbody></table></div>);
}

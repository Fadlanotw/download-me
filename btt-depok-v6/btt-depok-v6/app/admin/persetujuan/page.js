import Link from 'next/link';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { getUser } from '@/lib/auth';
import { ALUR, ROLES } from '@/lib/constants';
import { hari } from '../../components';

// Halaman awal semua petugas setelah login: langsung daftar yang menunggu tindakan perannya.
export default async function Page({ searchParams }) {
  const u = await getUser();
  if (!u || u.role === 'warga') redirect('/portal/petugas');
  if (u.role === 'admin') redirect('/admin');
  const bagian = Object.entries(ALUR).filter(([, a]) => a.role === u.role);
  const list = await prisma.permohonan.findMany({ where: { status: { in: bagian.map((b) => b[0]) } }, include: { user: true }, orderBy: { tahapMulai: 'asc' } });
  const total = list.length;
  return (<div className="wrap sec">
    <div className="row between"><h2>Tugas & Persetujuan — {ROLES[u.role]}</h2><Link href="/admin?tab=semua" className="btn sm">Lihat semua permohonan</Link></div>
    {searchParams.ok && <div className="alert ok">Tindakan tersimpan. Permohonan diteruskan ke tahap berikutnya.</div>}
    <div className={'alert' + (total ? '' : ' ok')}>{total ? `${total} permohonan menunggu tindakan Anda.` : 'Tidak ada permohonan yang menunggu tindakan Anda.'}</div>
    {bagian.map(([st, a]) => { const rows = list.filter((p) => p.status === st);
      return (<section key={st}><h3>{a.label} ({rows.length})</h3><p className="muted">Tindakan: {a.aksi}. Batas waktu {a.sla || '-'} hari.</p>
        <table><thead><tr><th>Kode</th><th>Pemohon</th><th>Bencana</th><th>Lokasi</th><th>Lama menunggu</th><th></th></tr></thead><tbody>
          {rows.map((p) => { const d = hari(p.tahapMulai), late = a.sla && d > a.sla;
            return (<tr key={p.id}><td>{p.kode}</td><td>{p.user.nama}<br /><small>{p.tipe}</small></td><td>{p.jenisBencana}</td><td>{p.kelurahan}, {p.kecamatan}</td>
              <td className={late ? 'late' : ''}>{d}/{a.sla || '-'} hari{late ? ' (terlambat)' : ''}</td>
              <td><Link href={`/admin/${p.id}`} className="btn sm">Proses</Link></td></tr>); })}
          {rows.length === 0 && <tr><td colSpan={6} className="muted">Tidak ada.</td></tr>}</tbody></table></section>); })}
  </div>);
}

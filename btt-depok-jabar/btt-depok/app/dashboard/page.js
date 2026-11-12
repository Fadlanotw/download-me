import Link from 'next/link';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { getUser } from '@/lib/auth';
import { Badge, fmt } from '../components';
export default async function Page({ searchParams }) {
  const u = await getUser(); if (!u) redirect('/portal/warga'); if (u.role !== 'warga') redirect('/admin');
  const list = await prisma.permohonan.findMany({ where: { userId: u.id }, orderBy: { createdAt: 'desc' } });
  return (<div className="wrap sec"><div className="row between"><h2>Permohonan Saya</h2><Link href="/dashboard/ajukan" className="btn">+ Ajukan Baru</Link></div>
    {searchParams.ok && <div className="alert ok">Permohonan terkirim. Kode Anda: <b>{searchParams.ok}</b></div>}
    {list.length === 0 ? <p className="muted">Belum ada permohonan.</p> :
      <table><thead><tr><th>Kode</th><th>Bencana</th><th>Lokasi</th><th>Tanggal</th><th>Status</th></tr></thead><tbody>
        {list.map((p) => <tr key={p.id}><td><Link href={`/cek?kode=${p.kode}`}>{p.kode}</Link></td><td>{p.jenisBencana}</td><td>{p.kelurahan}, {p.kecamatan}</td><td>{fmt(p.createdAt)}</td><td><Badge s={p.status} /></td></tr>)}
      </tbody></table>}</div>);
}

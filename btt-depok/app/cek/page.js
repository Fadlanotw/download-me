import { prisma } from '@/lib/db';
import { Timeline, Badge, fmt } from '../components';
export default async function Page({ searchParams }) {
  const kode = (searchParams.kode || '').trim().toUpperCase();
  const p = kode ? await prisma.permohonan.findUnique({ where: { kode }, include: { riwayat: { orderBy: { createdAt: 'asc' } } } }) : null;
  return (<div className="wrap narrow"><h2>Cek Status Permohonan</h2>
    <form className="form inline"><input name="kode" placeholder="Contoh: BTT-2026-12345" defaultValue={kode} required /><button className="btn">Cari</button></form>
    {kode && !p && <div className="alert err">Kode permohonan tidak ditemukan.</div>}
    {p && <div className="card full"><p><b>{p.kode}</b> <Badge s={p.status} /></p>
      <p className="muted">{p.jenisBencana} · {p.kelurahan}, {p.kecamatan} · diajukan {fmt(p.createdAt)}</p>
      {p.nomorSK && <p>Nomor SK: <b>{p.nomorSK}</b></p>}<Timeline status={p.status} riwayat={p.riwayat} /></div>}
  </div>);
}

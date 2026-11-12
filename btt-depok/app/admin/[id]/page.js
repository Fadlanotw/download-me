import { redirect, notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import { getUser } from '@/lib/auth';
import { STATUS, BERKAS } from '@/lib/constants';
import { updateStatus } from '../../actions';
import { Timeline, Badge, fmt } from '../../components';
export default async function Page({ params, searchParams }) {
  const u = await getUser(); if (!u || u.role !== 'admin') redirect('/masuk');
  const p = await prisma.permohonan.findUnique({ where: { id: Number(params.id) }, include: { user: true, riwayat: { orderBy: { createdAt: 'asc' } } } });
  if (!p) notFound();
  const berkas = JSON.parse(p.berkas);
  return (<div className="wrap sec two">
    <div><h2>{p.kode} <Badge s={p.status} /></h2>
      {searchParams.ok && <div className="alert ok">Status diperbarui.</div>}
      <div className="card full"><p><b>{p.user.nama}</b> · NIK {p.user.nik} · {p.user.telp || '-'}</p>
        <p>{p.jenisBencana}, {fmt(p.tanggalKejadian)}</p><p>{p.alamat}, {p.kelurahan}, {p.kecamatan}</p><p>{p.uraian}</p>
        {p.tingkatKerusakan && <p>Tingkat kerusakan: <b>{p.tingkatKerusakan}</b></p>}
        {p.nominal && <p>Nominal bantuan: <b>Rp{p.nominal.toLocaleString('id-ID')}</b></p>}{p.nomorSK && <p>Nomor SK: <b>{p.nomorSK}</b></p>}</div>
      <h3>Berkas</h3><ul>{BERKAS.map(([k, l]) => <li key={k}>{berkas[k] ? <a href={`/berkas/${p.kode}/${berkas[k]}`} target="_blank">{l}</a> : <span className="muted">{l} — tidak ada</span>}</li>)}</ul></div>
    <div><h3>Perbarui Proses</h3>
      <form action={updateStatus.bind(null, p.id)} className="form">
        <label>Status<select name="status" defaultValue={p.status}>{Object.entries(STATUS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></label>
        <label>Tingkat kerusakan<select name="tingkatKerusakan" defaultValue={p.tingkatKerusakan || ''}><option value="">-</option><option>Ringan</option><option>Sedang</option><option>Berat</option></select></label>
        <label>Nominal bantuan (Rp)<input name="nominal" type="number" min="0" defaultValue={p.nominal || ''} /></label>
        <label>Nomor SK<input name="nomorSK" defaultValue={p.nomorSK || ''} /></label>
        <label>Catatan (terlihat oleh pemohon)<textarea name="catatan" rows={3} /></label><button className="btn">Simpan</button></form>
      <h3>Progres</h3><Timeline status={p.status} riwayat={p.riwayat} /></div></div>);
}

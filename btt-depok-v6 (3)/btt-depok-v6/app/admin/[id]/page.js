import Link from 'next/link';
import { redirect, notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import { getUser } from '@/lib/auth';
import { ALUR, ROLES, BERKAS } from '@/lib/constants';
import { proses } from '../../actions';
import { Timeline, Badge, fmt } from '../../components';
const FIELD = { hasilLapangan: 'Hasil verifikasi lapangan', tingkatKerusakan: 'Tingkat kerusakan', nominal: 'Nominal bantuan (Rp)', nomorSK: 'Nomor SK' };
export default async function Page({ params, searchParams }) {
  const u = await getUser(); if (!u || u.role === 'warga') redirect('/portal/petugas');
  const p = await prisma.permohonan.findUnique({ where: { id: Number(params.id) }, include: { user: true, riwayat: { orderBy: { createdAt: 'asc' } } } });
  if (!p) notFound();
  const berkas = JSON.parse(p.berkas), a = ALUR[p.status];
  const boleh = a?.role && (u.role === 'admin' || u.role === a.role);
  return (<div className="wrap sec two">
    <div><h2>{p.kode} <Badge s={p.status} /></h2>
      {searchParams.ok && <div className="alert ok">Tindakan tersimpan.</div>}{searchParams.err && <div className="alert err">{searchParams.err}</div>}
      <div className="card full"><p><b>{p.user.nama}</b> · NIK {p.user.nik} · {p.user.telp || '-'}</p>
        <p>Pengajuan: <b>{p.tipe}</b>{p.pengusul ? ` — ${p.pengusul}` : ''}</p>
        <p>{p.jenisBencana}, {fmt(p.tanggalKejadian)}</p><p>{p.alamat}, {p.kelurahan}, {p.kecamatan}</p><p>{p.uraian}</p>
        {p.hasilLapangan && <p>Hasil lapangan: {p.hasilLapangan}</p>}
        {p.tingkatKerusakan && <p>Tingkat kerusakan: <b>{p.tingkatKerusakan}</b></p>}
        {p.nominal != null && <p>Nominal bantuan: <b>Rp{p.nominal.toLocaleString('id-ID')}</b></p>}
        {p.nomorSK && <p>Nomor SK: <b>{p.nomorSK}</b> · <Link href={`/cetak/${p.kode}`}>Lihat/cetak SK</Link></p>}</div>
      <h3>Berkas</h3><ul>{BERKAS.map(([k, l]) => <li key={k}>{berkas[k] ? <a href={`/berkas/${p.kode}/${berkas[k]}`} target="_blank">{l}</a> : <span className="muted">{l} — tidak ada</span>}</li>)}</ul></div>
    <div><h3>Tindakan</h3>
      {boleh ? <form action={proses.bind(null, p.id)} className="form">
        <div className="alert"><b>{a.label}</b><br />Tindakan: {a.aksi}</div>
        {(a.fields || []).map((f) => f === 'tingkatKerusakan'
          ? <label key={f}>{FIELD[f]}<select name={f} required><option value="">-</option><option>Ringan</option><option>Sedang</option><option>Berat</option></select></label>
          : f === 'hasilLapangan' ? <label key={f}>{FIELD[f]}<textarea name={f} rows={3} required /></label>
          : <label key={f}>{FIELD[f]}<input name={f} type={f === 'nominal' ? 'number' : 'text'} min="0" required /></label>)}
        <label>Catatan (tercatat di riwayat; wajib bila menolak)<textarea name="catatan" rows={2} /></label>
        <div className="row"><button name="keputusan" value="lanjut" className="btn">{a.aksi}</button><button name="keputusan" value="tolak" className="btn" style={{ background: '#b42318' }} formNoValidate>Tolak</button></div></form>
        : <div className="alert">{a?.role ? `Menunggu tindakan ${ROLES[a.role]} (${a.label}).` : 'Proses permohonan telah selesai.'}</div>}
      <h3>Progres</h3><Timeline status={p.status} riwayat={p.riwayat} /></div></div>);
}

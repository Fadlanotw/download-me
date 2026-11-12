import { redirect } from 'next/navigation';
import { getUser } from '@/lib/auth';
import { ajukan } from '../../actions';
import { BERKAS, BENCANA, KECAMATAN } from '@/lib/constants';
export default async function Page({ searchParams }) {
  const u = await getUser(); if (!u) redirect('/masuk');
  return (<div className="wrap narrow"><h2>Formulir Permohonan Bantuan</h2>
    {searchParams.err && <div className="alert err">{searchParams.err}</div>}
    <form action={ajukan} className="form">
      <label>Jenis bencana<select name="jenisBencana" required>{BENCANA.map((b) => <option key={b}>{b}</option>)}</select></label>
      <label>Tanggal kejadian<input type="date" name="tanggalKejadian" required /></label>
      <label>Alamat rumah terdampak<input name="alamat" required /></label>
      <label>Kelurahan<input name="kelurahan" required /></label>
      <label>Kecamatan<select name="kecamatan" required>{KECAMATAN.map((k) => <option key={k}>{k}</option>)}</select></label>
      <label>Uraian kerusakan<textarea name="uraian" rows={4} required /></label>
      <h3>Berkas Persyaratan <small className="muted">(JPG/PNG/PDF, maks. 3 MB)</small></h3>
      {BERKAS.map(([k, l, w]) => <label key={k}>{l}{w ? ' *' : ' (opsional)'}<input type="file" name={k} accept=".jpg,.jpeg,.png,.pdf" /></label>)}
      <button className="btn">Kirim Permohonan</button></form></div>);
}

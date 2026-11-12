import Link from 'next/link';
import { LANGKAH, BERKAS } from '@/lib/constants';
export default function Home() {
  return (<>
    <section className="hero"><div className="wrap">
      <h1>Layanan Bantuan Belanja Tidak Terduga (BTT)</h1>
      <p>Ajukan permohonan bantuan kepada Wali Kota Depok bagi warga yang terdampak bencana atau fenomena alam — secara daring, transparan, dan dapat dipantau.</p>
      <div className="row"><Link href="/daftar" className="btn gold">Ajukan Permohonan</Link><Link href="/cek" className="btn ghost">Cek Status Permohonan</Link></div>
    </div></section>
    <section className="wrap sec"><h2>Alur Pengajuan</h2>
      <p className="muted">Estimasi total proses: Disrumkim 5 hari kerja + OPD lain 49 hari.</p>
      <div className="grid">{LANGKAH.slice(0, 7).map((l, i) => <div className="card" key={l[0]}><span className="num">{i + 1}</span><b>{l[1]}</b><small>{l[2] || 'Sesuai jadwal BKD'}</small></div>)}</div></section>
    <section className="sec alt"><div className="wrap two">
      <div><h2>Syarat Pengajuan</h2><ol className="req">{BERKAS.map((b) => <li key={b[0]}>{b[1]}{!b[2] && ' (jika ada)'}</li>)}</ol></div>
      <div><h2>Cara Mengajukan</h2><ol className="req"><li>Buat akun warga dengan NIK & email.</li><li>Isi formulir kejadian bencana.</li><li>Unggah seluruh berkas persyaratan (JPG/PNG/PDF, maks. 3 MB).</li><li>Simpan kode permohonan, pantau status secara berkala.</li></ol>
        <div className="alert">Surat permohonan harus bermaterai Rp10.000. Pengajuan dapat dilakukan secara individu maupun kolektif (RT, RW, Kelurahan, Kecamatan).</div></div>
    </div></section>
  </>);
}

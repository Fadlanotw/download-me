import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import { prisma } from '@/lib/db';
import { LANGKAH, BERKAS, ALUR, ROLES } from '@/lib/constants';
import { Ic } from './components';
import { PENGUMUMAN } from '@/lib/info';
export const dynamic = 'force-dynamic';
const FAQ = [
  ['Siapa yang dapat mengajukan?', 'Warga yang terdampak bencana atau fenomena alam, baik perorangan maupun kolektif melalui RT, RW, Kelurahan, atau Kecamatan.'],
  ['Bagaimana mengetahui sampai mana prosesnya?', 'Simpan kode permohonan yang Anda terima setelah mengirim formulir. Masukkan kode itu di halaman Cek Status untuk melihat tahap dan riwayatnya.'],
  ['Berapa lama prosesnya?', 'Setiap tahap punya batas waktu. Estimasi keseluruhan: 5 hari di Disrumkim ditambah 49 hari di perangkat daerah lain.'],
  ['Apa yang perlu disiapkan sebelum mengajukan?', 'Siapkan seluruh berkas pada daftar syarat dalam format JPG, PNG, atau PDF maksimal 3 MB per berkas. Surat permohonan harus bermaterai Rp10.000.'],
  ['Apa dasar hukum layanan ini?', 'Peraturan Wali Kota No. 8 Tahun 2021 tentang Pedoman Pengajuan dan Pertanggungjawaban Belanja Tidak Terduga (BTT).'],
];
export default async function Home() {
  const foto = fs.existsSync(path.join(process.cwd(), 'public', 'walikota.jpg'));
  const c = { total: 0, selesai: 0, ditolak: 0 };
  try { for (const g of await prisma.permohonan.groupBy({ by: ['status'], _count: true })) { c.total += g._count; if (g.status === 'SELESAI') c.selesai = g._count; if (g.status === 'DITOLAK') c.ditolak = g._count; } } catch {}
  const proses = c.total - c.selesai - c.ditolak;
  let jenis = [], kec = [];
  try {
    const [a, b] = await Promise.all([prisma.permohonan.groupBy({ by: ['jenisBencana'], _count: true }), prisma.permohonan.groupBy({ by: ['kecamatan'], _count: true })]);
    const top = (g, k) => g.map((x) => [x[k], x._count]).sort((p, q) => q[1] - p[1]).slice(0, 6);
    jenis = top(a, 'jenisBencana'); kec = top(b, 'kecamatan');
  } catch {}
  const Bars = ({ rows }) => { const m = Math.max(1, ...rows.map((r) => r[1])); return (<div className="bars">{rows.map(([l, n]) => <div className="bar" key={l}><span>{l}</span><span className="track"><i style={{ width: (n / m * 100) + '%' }} /></span><b>{n}</b></div>)}</div>); };
  return (<>
    <section className="hx"><div className="wrap hx-in">
      <div>
        <h1>Ajukan bantuan bencana tanpa antre, pantau sampai dana cair</h1>
        <p className="lead">Layanan Belanja Tidak Terduga (BTT) Pemerintah Kota Depok untuk warga yang terdampak bencana atau fenomena alam.</p>
        <div className="row"><Link href="/daftar" className="btn gold">Ajukan permohonan</Link><Link href="/portal/warga" className="btn line">Masuk sebagai warga</Link></div>
        <form action="/cek" className="quick"><input name="kode" placeholder="Punya kode? Contoh: BTT-2026-12345" aria-label="Kode permohonan" required /><button className="btn">Cek status</button></form>
      </div>
      <div className="mayor">
        {foto ? <img src="/walikota.jpg" alt="Wali Kota Depok" /> :
          <svg viewBox="0 0 100 100" className="ph"><circle cx="50" cy="38" r="20" fill="#9db6e6" /><path d="M10 100c0-26 18-38 40-38s40 12 40 38z" fill="#9db6e6" /></svg>}
        <b>Supian Suri</b><span>Wali Kota Depok</span><small>Wakil Wali Kota: Chandra Rahmansyah</small>
      </div>
    </div></section>
    <div className="wrap tiles">
      <Link href="/daftar" className="tile"><span className="ico"><Ic n="file" /></span><b>Ajukan permohonan</b><small>Buat akun warga lalu isi formulir.</small></Link>
      <Link href="/cek" className="tile"><span className="ico"><Ic n="search" /></span><b>Cek status</b><small>Pantau dengan kode permohonan.</small></Link>
      <a href="#syarat" className="tile"><span className="ico"><Ic n="list" /></span><b>Syarat berkas</b><small>Daftar dokumen yang perlu disiapkan.</small></a>
      <Link href="/masuk" className="tile"><span className="ico"><Ic n="login" /></span><b>Masuk</b><small>Warga, petugas, dan pimpinan.</small></Link>
    </div>
    <div className="wrap statband"><div><b>{c.total}</b><small>Permohonan masuk</small></div><div><b>{proses}</b><small>Sedang diproses</small></div><div><b>{c.selesai}</b><small>Selesai</small></div></div>
    {PENGUMUMAN.length > 0 && <div className="wrap" style={{ marginTop: 20 }}>{PENGUMUMAN.map((p) => <div className="alert" key={p.judul}><b>{p.judul}</b>. {p.isi}</div>)}</div>}
    <section className="wrap sec" id="alur"><h2>Alur pengajuan</h2>
      <p className="muted">Setiap tahap diproses petugas berbeda sesuai bagan BTT. Estimasi: Disrumkim 5 hari + perangkat daerah lain 49 hari.</p>
      <ol className="alur">{LANGKAH.slice(0, 11).map((l, i) => <li key={l[0]}><span className="num">{i + 1}</span><div><b>{l[1]}</b><br /><span className={'chip ' + ALUR[l[0]].role}>{ROLES[ALUR[l[0]].role]}</span> <small className="muted">{l[2]}</small></div></li>)}</ol></section>
    <section className="sec alt" id="syarat"><div className="wrap two">
      <div><h2>Syarat pengajuan</h2><ul className="checks">{BERKAS.map((b) => <li key={b[0]}>{b[1]}{!b[2] && ' (jika ada)'}</li>)}</ul></div>
      <div><h2>Cara mengajukan</h2><ol className="req"><li>Buat akun warga dengan NIK dan email.</li><li>Isi formulir kejadian bencana.</li><li>Unggah seluruh berkas persyaratan (JPG/PNG/PDF, maks. 3 MB).</li><li>Simpan kode permohonan, pantau status secara berkala.</li></ol>
        <div className="alert">Surat permohonan harus bermaterai Rp10.000. Pengajuan dapat dilakukan perorangan maupun kolektif (RT, RW, Kelurahan, Kecamatan).</div></div>
    </div></section>
    {c.total > 0 && <section className="wrap sec" id="rekap"><h2>Rekap permohonan</h2><p className="muted">Data agregat tanpa data pribadi pemohon.</p>
      <div className="two"><div><h3>Berdasarkan jenis bencana</h3><Bars rows={jenis} /></div><div><h3>Berdasarkan kecamatan</h3><Bars rows={kec} /></div></div></section>}
    <section className="wrap sec faq"><h2>Pertanyaan yang sering diajukan</h2>
      {FAQ.map((f) => <details key={f[0]}><summary>{f[0]}</summary><p>{f[1]}</p></details>)}</section>
    <section className="wrap"><div className="cta"><div><h2>Rumah Anda terdampak bencana?</h2><p>Mulai ajukan sekarang, prosesnya bisa dipantau kapan saja.</p></div><Link href="/daftar" className="btn gold">Ajukan permohonan</Link></div></section>
  </>);
}

import Link from 'next/link';
import { notFound } from 'next/navigation';
import LoginForm from '../../masuk/LoginForm';
import { masuk } from '../../actions';
import { PORTAL } from '@/lib/constants';
import { Ic } from '../../components';
const AKUN = [
  ['admin@depok.go.id', 'Super Admin (kelola petugas, log akses)', 'admin123', 'admin'],
  ['walikota@depok.go.id', 'Wali Kota: disposisi & TTD SK', 'depok123', 'walikota'],
  ['disrumkim@depok.go.id', 'Disrumkim: verifikasi, draft & paraf SK, penyerahan', 'depok123', 'disrumkim'],
  ['sekda@depok.go.id', 'Sekda: ekspose TAPD & persetujuan', 'depok123', 'sekda'],
  ['hukum@depok.go.id', 'Bagian Hukum: verifikasi & penomoran SK', 'depok123', 'hukum'],
  ['bkd@depok.go.id', 'BKD: pencairan', 'depok123', 'bkd'],
];
const INFO = {
  warga: ['users', 'Ajukan permohonan bantuan dan pantau statusnya kapan saja.'],
  petugas: ['building', 'Proses permohonan sesuai tahap tugas perangkat daerah Anda.'],
  pimpinan: ['landmark', 'Beri disposisi dan tandatangani SK bantuan.'],
  sistem: ['shield', 'Kelola akun petugas dan periksa log akses.'],
};
export default function Page({ params, searchParams }) {
  const P = PORTAL[params.jenis]; if (!P) notFound();
  const demo = process.env.DEMO_MODE !== 'true' || process.env.NODE_ENV === 'production' || params.jenis === 'warga' ? null : AKUN.filter((a) => P.roles.includes(a[3])).map((a) => a.slice(0, 3));
  const [ikon, ket] = INFO[params.jenis];
  return (<div className="login">
    <aside className="login-side"><span className="ico"><Ic n={ikon} /></span><h2>{P.label}</h2><p>{ket}</p><Link href="/masuk">Pilih jenis masuk lain</Link></aside>
    <div className="login-box"><h3>Masuk</h3>
      {params.jenis !== 'warga' && <div className="alert">Khusus pegawai berwenang. Aktivitas masuk dicatat.</div>}
      {searchParams.err && <div className="alert err">{searchParams.err}</div>}
      <LoginForm action={masuk.bind(null, params.jenis)} akun={demo} />
      {params.jenis === 'warga' && <p className="muted">Belum punya akun? <Link href="/daftar">Daftar</Link></p>}</div></div>);
}

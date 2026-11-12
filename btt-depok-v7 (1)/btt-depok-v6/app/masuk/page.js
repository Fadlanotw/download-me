import Link from 'next/link';
import { Ic } from '../components';
export const metadata = { title: 'Masuk – Layanan BTT Pemerintah Kota Depok' };
const STAF = [
  ['petugas', 'building', 'Portal Petugas', 'Disrumkim, Sekda, Bagian Hukum, dan BKD memproses tahap sesuai tugasnya.'],
  ['pimpinan', 'landmark', 'Portal Pimpinan', 'Wali Kota memberi disposisi dan menandatangani SK bantuan.'],
  ['sistem', 'shield', 'Portal Administrator', 'Mengelola akun petugas dan memeriksa log akses.'],
];
export default function Page() {
  return (<div className="wrap sec masuk">
    <h1>Masuk ke layanan BTT</h1>
    <p className="muted">Pilih jenis akun Anda. Setiap jenis akun punya pintu masuk sendiri.</p>
    <Link href="/portal/warga" className="pc big"><span className="ico"><Ic n="users" /></span><div><b>Portal Warga</b><span>Ajukan permohonan bantuan dan pantau statusnya.</span></div><em className="go">Masuk sebagai warga</em></Link>
    <p>Belum punya akun? <Link href="/daftar">Daftar sebagai warga</Link></p>
    <h2>Khusus pegawai Pemerintah Kota Depok</h2>
    <div className="pgrid">{STAF.map((s) => <Link key={s[0]} href={`/portal/${s[0]}`} className="pc"><span className="ico"><Ic n={s[1]} /></span><div><b>{s[2]}</b><span>{s[3]}</span></div></Link>)}</div>
    <p className="muted">Aktivitas masuk pegawai dicatat oleh sistem.</p>
  </div>);
}

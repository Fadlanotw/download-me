import './globals.css';
import Link from 'next/link';
import { getUser } from '@/lib/auth';
import { keluar } from './actions';
import { INFO } from '@/lib/info';
export const metadata = { title: 'Layanan Bantuan Belanja Tidak Terduga (BTT) – Pemerintah Kota Depok', description: 'Pengajuan bantuan bagi warga terdampak bencana/fenomena alam, Pemerintah Kota Depok.' };
export default async function RootLayout({ children }) {
  const u = await getUser();
  return (
    <html lang="id"><body>
      <div className="topbar">Situs resmi layanan Pemerintah Kota Depok · Dinas Perumahan dan Kawasan Permukiman (Disrumkim)</div>
      <header className="hdr"><div className="wrap hdr-in">
        <Link href="/" className="brand"><img src="/logo-depok.png" alt="Lambang Kota Depok" width="46" height="55" />
          <span><small>PEMERINTAH KOTA</small><b>DEPOK</b></span></Link>
        <nav>
          <Link href="/">Beranda</Link><Link href="/profil">Profil</Link><Link href="/#alur">Alur</Link><Link href="/#syarat">Syarat</Link><Link href="/unduhan">Unduhan</Link><Link href="/kontak">Kontak</Link><Link href="/cek">Cek Status</Link>
          {u ? <><Link href={u.role === 'warga' ? '/dashboard' : u.role === 'admin' ? '/admin' : '/admin/persetujuan'}>{u.role === 'warga' ? 'Permohonan Saya' : u.role === 'admin' ? 'Panel Petugas' : 'Tugas & Persetujuan'}</Link>
            <Link href="/akun/sandi">Sandi</Link><form action={keluar}><button className="lnk">Keluar ({u.nama.split(' ')[0]})</button></form></>
            : <><Link href="/masuk" className="btn sm line">Masuk</Link><Link href="/daftar" className="btn sm">Daftar</Link></>}
        </nav></div></header>
      <main>{children}</main>
      <footer><div className="wrap ft">
        <div><b>Pemerintah Kota Depok</b><br />{INFO.alamat}<br />{INFO.jam && <>{INFO.jam}<br /></>}{INFO.telepon && <>Telp. {INFO.telepon}<br /></>}{INFO.email && <>{INFO.email}<br /></>}<small>Dasar hukum: Perwal No. 8 Tahun 2021 tentang Pedoman Pengajuan dan Pertanggungjawaban Belanja Tidak Terduga (BTT).</small></div>
        <div><b>Layanan</b><Link href="/profil">Visi dan misi</Link><Link href="/daftar">Ajukan permohonan</Link><Link href="/cek">Cek status</Link><Link href="/#syarat">Syarat berkas</Link><Link href="/unduhan">Unduhan dokumen</Link><Link href="/kontak">Kontak dan lokasi</Link></div>
        <div><b>Masuk</b><Link href="/portal/warga">Portal Warga</Link><Link href="/portal/petugas">Portal Petugas</Link><Link href="/portal/pimpinan">Portal Pimpinan</Link></div>
      </div></footer>
    </body></html>
  );
}

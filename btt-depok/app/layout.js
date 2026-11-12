import './globals.css';
import Link from 'next/link';
import { getUser } from '@/lib/auth';
import { keluar } from './actions';
export const metadata = { title: 'Layanan Bantuan Belanja Tidak Terduga (BTT) – Pemerintah Kota Depok', description: 'Pengajuan bantuan bagi warga terdampak bencana/fenomena alam, Pemerintah Kota Depok.' };
export default async function RootLayout({ children }) {
  const u = await getUser();
  return (
    <html lang="id"><body>
      <div className="topbar">Situs resmi layanan Pemerintah Kota Depok · Dinas Perumahan dan Kawasan Permukiman (Disrumkim)</div>
      <header className="hdr"><div className="wrap hdr-in">
        <Link href="/" className="brand"><svg width="44" height="52" viewBox="0 0 44 52"><path d="M22 2 42 9v18c0 12-9 20-20 23C11 47 2 39 2 27V9z" fill="#0b3d91" stroke="#f2b705" strokeWidth="3"/><text x="22" y="33" textAnchor="middle" fontSize="16" fontWeight="700" fill="#f2b705">D</text></svg>
          <span><small>PEMERINTAH KOTA</small><b>DEPOK</b></span></Link>
        <nav>
          <Link href="/">Beranda</Link><Link href="/cek">Cek Status</Link>
          {u ? <><Link href={u.role === 'admin' ? '/admin' : '/dashboard'}>{u.role === 'admin' ? 'Panel Admin' : 'Permohonan Saya'}</Link>
            <form action={keluar}><button className="lnk">Keluar ({u.nama.split(' ')[0]})</button></form></>
            : <><Link href="/masuk">Masuk</Link><Link href="/daftar" className="btn sm">Daftar</Link></>}
        </nav></div></header>
      <main>{children}</main>
      <footer><div className="wrap"><b>Pemerintah Kota Depok</b><br />Balai Kota Depok, Jl. Margonda Raya No. 54, Depok, Jawa Barat<br />
        <small>Dasar hukum: Perwal No. 8 Tahun 2021 tentang Pedoman Pengajuan dan Pertanggungjawaban Belanja Tidak Terduga (BTT).</small></div></footer>
    </body></html>
  );
}

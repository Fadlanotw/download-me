import Link from 'next/link';
import { mintaReset } from '../actions';
import { emailAktif } from '@/lib/email';
export const metadata = { title: 'Lupa kata sandi – Layanan BTT Kota Depok' };
export default function Page({ searchParams }) {
  return (<div className="wrap narrow"><h2>Lupa kata sandi</h2>
    {!emailAktif() ? <div className="alert">Pengiriman email belum diaktifkan di layanan ini. Silakan hubungi petugas lewat halaman <Link href="/kontak">Kontak</Link>.</div> : <>
      {searchParams.ok && <div className="alert ok">Jika email tersebut terdaftar sebagai akun warga, tautan untuk membuat kata sandi baru sudah dikirim. Tautan berlaku 1 jam.</div>}
      {searchParams.err && <div className="alert err">{searchParams.err}</div>}
      <form action={mintaReset} className="form"><label>Email akun<input name="email" type="email" required /></label><button className="btn">Kirim tautan</button></form></>}
    <p className="muted"><Link href="/portal/warga">Kembali ke halaman masuk</Link></p></div>);
}

import Link from 'next/link';
import { daftar } from '../actions';
import Captcha from '../captcha';
export const dynamic = 'force-dynamic';
export default function Page({ searchParams }) {
  return (<div className="wrap narrow"><h2>Daftar Akun Warga</h2>
    {searchParams.err && <div className="alert err">{searchParams.err}</div>}
    <form action={daftar} className="form"><label>Nama lengkap<input name="nama" required /></label>
      <label>NIK (16 digit)<input name="nik" required maxLength={16} pattern="\d{16}" inputMode="numeric" /></label>
      <label>Email<input name="email" type="email" required /></label><label>No. HP / WhatsApp<input name="telp" /></label>
      <label>Kata sandi (min. 6 karakter)<input name="password" type="password" required minLength={6} /></label><Captcha /><button className="btn">Daftar</button></form>
    <p className="muted">Sudah punya akun? <Link href="/masuk">Masuk</Link></p></div>);
}

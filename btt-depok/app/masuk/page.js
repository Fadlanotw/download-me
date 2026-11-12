import Link from 'next/link';
import { masuk } from '../actions';
export default function Page({ searchParams }) {
  return (<div className="wrap narrow"><h2>Masuk</h2>
    {searchParams.err && <div className="alert err">{searchParams.err}</div>}
    <form action={masuk} className="form"><label>Email<input name="email" type="email" required /></label>
      <label>Kata sandi<input name="password" type="password" required /></label><button className="btn">Masuk</button></form>
    <p className="muted">Belum punya akun? <Link href="/daftar">Daftar</Link></p></div>);
}

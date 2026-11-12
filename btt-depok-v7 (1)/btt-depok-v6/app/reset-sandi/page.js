import Link from 'next/link';
import { bacaToken } from '@/lib/reset';
import { setelSandi } from '../actions';
export const dynamic = 'force-dynamic';
export default async function Page({ searchParams }) {
  const t = searchParams.t || '', u = await bacaToken(t);
  if (!u) return (<div className="wrap narrow"><h2>Tautan tidak berlaku</h2><div className="alert err">Tautan sudah kedaluwarsa atau sudah dipakai.</div><p><Link href="/lupa-sandi">Minta tautan baru</Link></p></div>);
  return (<div className="wrap narrow"><h2>Buat kata sandi baru</h2>
    {searchParams.err && <div className="alert err">{searchParams.err}</div>}
    <form action={setelSandi.bind(null, t)} className="form">
      <label>Kata sandi baru (min. 8 karakter)<input name="baru" type="password" required minLength={8} /></label>
      <label>Ulangi kata sandi baru<input name="ulang" type="password" required minLength={8} /></label>
      <button className="btn">Simpan kata sandi</button></form></div>);
}

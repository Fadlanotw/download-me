import { redirect } from 'next/navigation';
import { getUser } from '@/lib/auth';
import { gantiSandi } from '../../actions';
export default async function Page({ searchParams }) {
  const u = await getUser(); if (!u) redirect('/masuk');
  return (<div className="wrap narrow"><h2>Ganti Kata Sandi</h2>
    {searchParams.err && <div className="alert err">{searchParams.err}</div>}{searchParams.ok && <div className="alert ok">Kata sandi diperbarui.</div>}
    <form action={gantiSandi} className="form"><label>Kata sandi lama<input name="lama" type="password" required /></label>
      <label>Kata sandi baru (min. 8 karakter)<input name="baru" type="password" minLength={8} required /></label>
      <label>Ulangi kata sandi baru<input name="ulang" type="password" minLength={8} required /></label><button className="btn">Simpan</button></form></div>);
}

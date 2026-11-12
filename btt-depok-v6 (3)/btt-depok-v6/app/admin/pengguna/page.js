import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { getUser } from '@/lib/auth';
import { ROLES, STAF } from '@/lib/constants';
import { buatStaf } from '../../actions';
export default async function Page({ searchParams }) {
  const u = await getUser(); if (!u || u.role !== 'admin') redirect('/portal/sistem');
  const staf = await prisma.user.findMany({ where: { role: { not: 'warga' } }, orderBy: { role: 'asc' } });
  return (<div className="wrap sec two"><div><h2>Petugas</h2>
    <table><thead><tr><th>Nama</th><th>Email</th><th>Peran</th></tr></thead><tbody>{staf.map((s) => <tr key={s.id}><td>{s.nama}</td><td>{s.email}</td><td>{ROLES[s.role]}</td></tr>)}</tbody></table></div>
    <div><h3>Tambah Petugas</h3>{searchParams.err && <div className="alert err">{searchParams.err}</div>}{searchParams.ok && <div className="alert ok">Petugas ditambahkan.</div>}
      <form action={buatStaf} className="form"><label>Nama<input name="nama" required /></label><label>Email<input name="email" type="email" required /></label>
        <label>Peran<select name="role">{STAF.map((r) => <option key={r} value={r}>{ROLES[r]}</option>)}</select></label>
        <label>Kata sandi<input name="password" type="password" minLength={6} required /></label><button className="btn">Tambah</button></form></div></div>);
}

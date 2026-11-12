import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { getUser } from '@/lib/auth';
export default async function Page() {
  const u = await getUser(); if (!u || u.role !== 'admin') redirect('/portal/sistem');
  const log = await prisma.logAkses.findMany({ orderBy: { createdAt: 'desc' }, take: 100 });
  return (<div className="wrap sec"><h2>Log Akses (100 terakhir)</h2>
    <table><thead><tr><th>Waktu</th><th>Email</th><th>Portal</th><th>Hasil</th><th>IP</th></tr></thead><tbody>
      {log.map((l) => <tr key={l.id}><td>{l.createdAt.toLocaleString('id-ID')}</td><td>{l.email}</td><td>{l.portal}</td><td className={l.berhasil ? '' : 'late'}>{l.berhasil ? 'Berhasil' : 'Gagal'}</td><td>{l.ip}</td></tr>)}</tbody></table></div>);
}

import fs from 'fs';
import path from 'path';
import { Ic } from '../components';
export const metadata = { title: 'Unduhan Dokumen – Layanan BTT Kota Depok' };
export const dynamic = 'force-dynamic';
// Semua file di folder public/dokumen otomatis muncul di sini.
export default function Page() {
  const dir = path.join(process.cwd(), 'public', 'dokumen');
  let files = [];
  try { files = fs.readdirSync(dir).filter((n) => !n.startsWith('.')).map((n) => ({ n, kb: Math.max(1, Math.round(fs.statSync(path.join(dir, n)).size / 1024)) })); } catch {}
  return (<div className="wrap sec"><h1>Unduhan dokumen</h1>
    <p className="muted">Formulir, contoh surat, dan peraturan yang berkaitan dengan pengajuan bantuan.</p>
    {files.length === 0 ? <div className="alert">Belum ada dokumen yang tersedia.</div> :
      <div className="pgrid">{files.map((f) => (
        <a key={f.n} href={'/dokumen/' + encodeURIComponent(f.n)} download className="pc"><span className="ico"><Ic n="download" /></span>
          <div><b>{f.n.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' ')}</b><span>{f.n.split('.').pop().toUpperCase()} · {f.kb} KB</span></div></a>))}</div>}
  </div>);
}

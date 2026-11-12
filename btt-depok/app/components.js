import { LANGKAH, STATUS } from '@/lib/constants';
export const fmt = (d) => new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
export const Badge = ({ s }) => <span className={'badge ' + (s === 'DITOLAK' ? 'red' : s === 'SELESAI' ? 'green' : '')}>{STATUS[s]}</span>;
export function Timeline({ status, riwayat = [] }) {
  const idx = LANGKAH.findIndex((l) => l[0] === status);
  return (
    <div>
      {status === 'DITOLAK' && <div className="alert err">Permohonan ditolak. Lihat catatan pada riwayat di bawah.</div>}
      <ol className="tl">
        {LANGKAH.map((l, i) => (
          <li key={l[0]} className={i < idx || status === 'SELESAI' ? 'done' : i === idx ? 'now' : ''}>
            <b>{l[1]}</b> {l[2] && <small>· {l[2]}</small>}
          </li>
        ))}
      </ol>
      {riwayat.length > 0 && (<><h4>Riwayat</h4>
        <ul className="hist">{riwayat.map((r) => <li key={r.id}><small>{fmt(r.createdAt)}</small> — <b>{STATUS[r.status]}</b>{r.catatan ? `: ${r.catatan}` : ''}</li>)}</ul></>)}
    </div>
  );
}

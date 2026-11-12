import { LANGKAH, STATUS, ALUR, ROLES } from '@/lib/constants';
export const fmt = (d) => new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
export const hari = (d) => Math.floor((Date.now() - new Date(d).getTime()) / 86400000);
export const Badge = ({ s }) => <span className={'badge ' + (s === 'DITOLAK' ? 'red' : s === 'SELESAI' ? 'green' : '')}>{STATUS[s]}</span>;
export function Timeline({ status, riwayat = [] }) {
  const idx = LANGKAH.findIndex((l) => l[0] === status);
  return (
    <div>
      {status === 'DITOLAK' && <div className="alert err">Permohonan ditolak. Lihat alasan pada riwayat di bawah.</div>}
      <ol className="tl">
        {LANGKAH.map((l, i) => (
          <li key={l[0]} className={i < idx || status === 'SELESAI' ? 'done' : i === idx ? 'now' : ''}>
            <b>{l[1]}</b> <small>{ALUR[l[0]].role ? `· ${ROLES[ALUR[l[0]].role]}` : ''} {l[2] && `· ${l[2]}`}</small>
          </li>
        ))}
      </ol>
      {riwayat.length > 0 && (<><h4>Riwayat</h4>
        <ul className="hist">{riwayat.map((r) => <li key={r.id}><small>{fmt(r.createdAt)}</small> — <b>{STATUS[r.status]}</b>{r.catatan ? ` (${r.catatan})` : ''}</li>)}</ul></>)}
    </div>
  );
}

const P = { pin: 'M12 21s-7-6-7-11a7 7 0 1 1 14 0c0 5-7 11-7 11z M12 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z', phone: 'M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z', mail: 'M3 6h18v12H3z M3 7l9 6 9-6', clock: 'M12 7v5l3 2 M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z', download: 'M12 4v11 M7 11l5 5 5-5 M5 20h14', file: 'M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z M14 3v5h5 M12 11v6 M9 14h6', search: 'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14z M21 21l-5-5', users: 'M16 20v-1a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v1 M9.5 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z M21 20v-1a4 4 0 0 0-3-3.9 M16 4.1a3.5 3.5 0 0 1 0 6.8', building: 'M4 21V7l8-4 8 4v14 M9 21v-6h6v6 M8 10h.01 M12 10h.01 M16 10h.01', landmark: 'M3 21h18 M5 21V10 M9 21V10 M15 21V10 M19 21V10 M2 10l10-6 10 6z', shield: 'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z M9 12l2 2 4-4', list: 'M8 6h13 M8 12h13 M8 18h13 M3 6h.01 M3 12h.01 M3 18h.01', login: 'M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4 M10 17l5-5-5-5 M15 12H3' };
export const Ic = ({ n }) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={P[n]} /></svg>;

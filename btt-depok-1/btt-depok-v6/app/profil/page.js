import Link from 'next/link';
import { Ic } from '../components';
import { VISI, VISI_URAIAN, MISI, TUJUAN_LAYANAN, ASAS, DASAR_HUKUM } from '@/lib/info';
export const metadata = { title: 'Profil, Visi & Misi – Layanan BTT Kota Depok' };
export default function Page() {
  return (<>
    <section className="wrap sec"><h1>Profil layanan</h1>
      <p className="muted">Layanan Bantuan Belanja Tidak Terduga (BTT) Pemerintah Kota Depok membantu warga yang terdampak bencana atau fenomena alam mengajukan bantuan secara daring, dan memantau prosesnya sampai dana cair.</p>
      <div className="pc big" style={{ display: 'block' }}><b>Visi Kota Depok</b><div className="visi">“{VISI}”</div><span>{VISI_URAIAN}</span></div>
    </section>
    <section className="sec alt"><div className="wrap">
      <h2>Misi</h2><p className="muted">Empat misi pembangunan Kota Depok.</p>
      <ol className="alur">{MISI.map((m, i) => <li key={i}><span className="num">{i + 1}</span><div>{m}</div></li>)}</ol>
    </div></section>
    <section className="wrap sec"><div className="two">
      <div><h2>Tujuan layanan</h2><ul className="checks">{TUJUAN_LAYANAN.map((t) => <li key={t}>{t}</li>)}</ul></div>
      <div><h2>Asas pelayanan</h2><div className="pgrid" style={{ gridTemplateColumns: '1fr' }}>{ASAS.map(([j, v]) => <div className="pc" key={j}><span className="ico"><Ic n="shield" /></span><div><b>{j}</b><span>{v}</span></div></div>)}</div></div>
    </div></section>
    <section className="sec alt"><div className="wrap"><h2>Dasar hukum</h2>
      <ul className="checks">{DASAR_HUKUM.map((d) => <li key={d}>{d}</li>)}</ul>
      <div className="row" style={{ marginTop: 20 }}><Link href="/daftar" className="btn">Ajukan permohonan</Link> <Link href="/kontak" className="btn line">Kontak dan lokasi</Link></div>
    </div></section>
  </>);
}

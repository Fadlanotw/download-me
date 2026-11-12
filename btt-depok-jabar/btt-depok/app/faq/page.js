import Link from 'next/link';
import { FAQ_LENGKAP } from '@/lib/info';
export const metadata = { title: 'Pertanyaan yang Sering Diajukan – Layanan BTT Kota Depok' };
export default function Page() {
  return (<>
    <section className="wrap sec faq">
      <h1>Pertanyaan yang sering diajukan</h1>
      <p className="muted">Jawaban untuk hal yang paling sering ditanyakan warga tentang pengajuan bantuan BTT.</p>
      {FAQ_LENGKAP.map(([judul, items]) => (<div key={judul} style={{ marginTop: 22 }}>
        <h2>{judul}</h2>
        {items.map(([q, a]) => <details key={q}><summary>{q}</summary><p>{a}</p></details>)}
      </div>))}
    </section>
    <section className="wrap"><div className="cta"><div><h2>Pertanyaan Anda belum terjawab?</h2><p>Hubungi Disrumkim melalui halaman kontak.</p></div><Link href="/kontak" className="btn gold">Kontak dan lokasi</Link></div></section>
  </>);
}

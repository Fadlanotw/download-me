import { INFO } from '@/lib/info';
import { Ic } from '../components';
export const metadata = { title: 'Kontak & Lokasi – Layanan BTT Kota Depok' };
export default function Page() {
  const peta = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(INFO.alamat);
  const baris = [
    ['pin', 'Alamat', INFO.alamat, peta, 'Buka di peta'],
    INFO.jam && ['clock', 'Jam layanan', INFO.jam],
    INFO.telepon && ['phone', 'Telepon', INFO.telepon, 'tel:' + INFO.telepon.replace(/[^\d+]/g, '')],
    INFO.whatsapp && ['phone', 'WhatsApp', '+' + INFO.whatsapp, 'https://wa.me/' + INFO.whatsapp.replace(/\D/g, '')],
    INFO.email && ['mail', 'Email', INFO.email, 'mailto:' + INFO.email],
  ].filter(Boolean);
  return (<div className="wrap sec"><h1>Kontak dan lokasi</h1>
    <p className="muted">Untuk pertanyaan seputar permohonan, siapkan kode permohonan Anda agar petugas dapat memeriksanya lebih cepat.</p>
    <div className="pgrid">{baris.map(([ic, j, v, href, ket]) => (
      <div key={j} className="pc"><span className="ico"><Ic n={ic} /></span><div><b>{j}</b><span>{v}</span>
        {href && <><br /><a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer">{ket || 'Hubungi'}</a></>}</div></div>))}</div>
  </div>);
}

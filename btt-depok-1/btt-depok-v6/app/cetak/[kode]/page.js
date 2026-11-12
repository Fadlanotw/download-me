import { prisma } from '@/lib/db';
import { getUser } from '@/lib/auth';
import PrintBtn from './PrintBtn';
import { fmt } from '../../components';
export default async function Page({ params }) {
  const u = await getUser();
  const p = await prisma.permohonan.findUnique({ where: { kode: params.kode }, include: { user: true } });
  if (!u || !p || !p.nomorSK || (u.role === 'warga' && p.userId !== u.id)) return <div className="wrap narrow"><p>SK belum diterbitkan atau Anda tidak berhak mengakses.</p></div>;
  return (<div className="wrap narrow sk"><PrintBtn />
    <h3>KEPUTUSAN WALI KOTA DEPOK</h3><h4>NOMOR {p.nomorSK}</h4>
    <h4>TENTANG PEMBERIAN BANTUAN BELANJA TIDAK TERDUGA KEPADA {p.user.nama.toUpperCase()}</h4><br />
    <p><b>Menimbang:</b> bahwa pemohon terdampak {p.jenisBencana.toLowerCase()} pada {fmt(p.tanggalKejadian)} di {p.kelurahan}, {p.kecamatan} dengan tingkat kerusakan {p.tingkatKerusakan || '-'}, dan layak diberikan bantuan.</p>
    <p><b>Mengingat:</b> Peraturan Wali Kota Depok Nomor 8 Tahun 2021 tentang Pedoman Pengajuan dan Pertanggungjawaban Belanja Tidak Terduga.</p>
    <p><b>MEMUTUSKAN:</b></p>
    <p><b>KESATU:</b> Memberikan bantuan BTT kepada {p.user.nama} (NIK {p.user.nik}), alamat {p.alamat}, sebesar <b>Rp{(p.nominal || 0).toLocaleString('id-ID')}</b>.</p>
    <p><b>KEDUA:</b> Keputusan ini mulai berlaku pada tanggal ditetapkan.</p>
    <p style={{ textAlign: 'right' }}>Ditetapkan di Depok<br />WALI KOTA DEPOK<br /><br /><br />(……………………)</p></div>);
}

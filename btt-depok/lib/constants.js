export const LANGKAH = [
  ['DIAJUKAN', 'Pengajuan & Disposisi Wali Kota', 'maks. 7 hari'],
  ['VERIFIKASI', 'Verifikasi Administrasi & Lapangan (Disrumkim)', '2 hari'],
  ['SEKDA', 'Ekspose TAPD & Persetujuan Sekda/Wali Kota', 'maks. 14 hari'],
  ['DRAFT_SK', 'Draft SK & Verifikasi Bagian Hukum', '1 + 7 hari'],
  ['PARAF', 'Paraf Asisten, Sekda, Wakil & TTD Wali Kota', 'maks. 14 hari'],
  ['SK_TERBIT', 'SK Terbit & Penyerahan kepada Penerima', '1 hari'],
  ['PENCAIRAN', 'Proses Pencairan oleh BKD', ''],
  ['SELESAI', 'Selesai', ''],
];
export const STATUS = { ...Object.fromEntries(LANGKAH.map((l) => [l[0], l[1]])), DITOLAK: 'Ditolak' };
// [key, label, wajib]
export const BERKAS = [
  ['surat_permohonan', 'Surat permohonan bantuan kepada Wali Kota (bermaterai 10.000)', 1],
  ['surat_lurah', 'Surat keterangan terkena bencana dari Lurah', 1],
  ['pengantar_rt', 'Surat pengantar dari RT/RW', 1],
  ['ktp', 'Foto copy KTP', 1],
  ['kk', 'Foto copy KK', 1],
  ['kartu_bantuan', 'Foto copy Jamkesda/Jamkesmas/KIS/KKS/PKH/KPS/BPJS', 0],
  ['bukti_rumah', 'Bukti kepemilikan rumah (PBB)', 1],
  ['foto_bencana', 'Dokumentasi foto rumah saat terkena bencana', 1],
  ['denah', 'Denah rumah', 1],
];
export const BENCANA = ['Banjir', 'Tanah longsor', 'Angin puting beliung', 'Pohon tumbang', 'Gempa bumi', 'Lainnya'];
export const KECAMATAN = ['Beji','Bojongsari','Cilodong','Cimanggis','Cinere','Cipayung','Limo','Pancoran Mas','Sawangan','Sukmajaya','Tapos'];

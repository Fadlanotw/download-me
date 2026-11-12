export const ROLES = { warga: 'Warga', admin: 'Super Admin', disrumkim: 'Disrumkim', sekda: 'Sekretaris Daerah', hukum: 'Bagian Hukum', walikota: 'Wali Kota', bkd: 'BKD' };
export const STAF = ['disrumkim', 'sekda', 'hukum', 'walikota', 'bkd'];
// Alur sesuai bagan BTT (Perwal No. 8 Tahun 2021). role = petugas yang memproses tahap itu; sla dalam hari.
export const ALUR = {
  DIAJUKAN: { label: 'Disposisi Wali Kota', role: 'walikota', sla: 7, next: 'VERIF_ADMIN', aksi: 'Disposisikan ke Disrumkim' },
  VERIF_ADMIN: { label: 'Verifikasi Administrasi (Disrumkim)', role: 'disrumkim', sla: 1, next: 'VERIF_LAPANGAN', aksi: 'Berkas lengkap, lanjut ke verifikasi lapangan' },
  VERIF_LAPANGAN: { label: 'Verifikasi Lapangan & Hitung Kerusakan (Disrumkim)', role: 'disrumkim', sla: 1, next: 'USUL_SEKDA', aksi: 'Ajukan permohonan penggunaan BTT ke Sekda', fields: ['hasilLapangan', 'tingkatKerusakan', 'nominal'] },
  USUL_SEKDA: { label: 'Verifikasi Sekda & Ekspose TAPD', role: 'sekda', sla: 14, next: 'DRAFT_SK', aksi: 'Setujui (nota dinas persetujuan Wali Kota)' },
  DRAFT_SK: { label: 'Penyusunan Draft SK (Disrumkim)', role: 'disrumkim', sla: 1, next: 'VERIF_HUKUM', aksi: 'Kirim draft SK ke Bagian Hukum' },
  VERIF_HUKUM: { label: 'Verifikasi Bagian Hukum', role: 'hukum', sla: 7, next: 'PARAF_DINAS', aksi: 'Verifikasi selesai, kembalikan untuk paraf' },
  PARAF_DINAS: { label: 'Paraf SK (Disrumkim)', role: 'disrumkim', sla: 1, next: 'TTD', aksi: 'Paraf & teruskan ke Wali Kota' },
  TTD: { label: 'Paraf Asisten/Sekda/Wakil & TTD Wali Kota', role: 'walikota', sla: 14, next: 'PENOMORAN', aksi: 'Tandatangani SK' },
  PENOMORAN: { label: 'Penomoran SK (Bagian Hukum)', role: 'hukum', sla: 1, next: 'PENYERAHAN', aksi: 'Terbitkan nomor SK', fields: ['nomorSK'] },
  PENYERAHAN: { label: 'Rekomendasi Pencairan & Penyerahan SK (Disrumkim)', role: 'disrumkim', sla: 1, next: 'PENCAIRAN', aksi: 'SK diserahkan, rekomendasikan pencairan ke BKD' },
  PENCAIRAN: { label: 'Proses Pencairan (BKD)', role: 'bkd', sla: 0, next: 'SELESAI', aksi: 'Dana telah dicairkan' },
  SELESAI: { label: 'Selesai', role: null },
};
export const LANGKAH = Object.entries(ALUR).map(([k, a]) => [k, a.label, a.sla ? `maks. ${a.sla} hari` : '']);
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
// Portal login terpisah: satu akun hanya bisa masuk lewat portal yang sesuai perannya.
export const PORTAL = {
  warga: { label: 'Portal Warga', roles: ['warga'], jam: 24, home: '/dashboard' },
  petugas: { label: 'Portal Petugas Perangkat Daerah', roles: ['disrumkim', 'sekda', 'hukum', 'bkd'], jam: 8, home: '/admin/persetujuan' },
  pimpinan: { label: 'Portal Pimpinan (Wali Kota)', roles: ['walikota'], jam: 8, home: '/admin/persetujuan' },
  sistem: { label: 'Portal Administrator Sistem', roles: ['admin'], jam: 4, home: '/admin' },
};

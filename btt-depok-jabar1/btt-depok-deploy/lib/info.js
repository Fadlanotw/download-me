// Isi data di bawah ini. Kolom yang dikosongkan ('') tidak akan ditampilkan di website.
export const INFO = {
  alamat: 'Dinas Perumahan dan Permukiman (Disrumkim), Gedung Dibaleka 2 Lantai 5, Jl. Margonda Raya No. 54, Kota Depok 16431',
  telepon: '(021) 2940 2293',
  whatsapp: '6288809929745', // contoh: 6281234567890 (tanpa tanda + atau spasi)
  email: 'rumkim@depok.go.id',
  jam: 'Senin-Jumat, 08.00-16.00', // contoh: Senin–Jumat, 08.00–16.00 WIB
};
// Pengumuman tampil di beranda. Contoh: [{ judul: 'Layanan libur', isi: 'Layanan tutup pada ...' }]
export const PENGUMUMAN = [];

// ===== Profil: visi, misi, dan lainnya. Ubah teks di sini, halaman /profil ikut berubah. =====
export const VISI = 'Bersama Depok Maju';
export const VISI_URAIAN = 'Memajukan Kota Depok dengan infrastruktur yang ramah lingkungan, penataan ruang yang baik, dan pelayanan publik yang prima.';
// Visi dan misi Wali Kota dan Wakil Wali Kota Depok periode 2025–2030.
export const MISI = [
  'Memperkuat pembangunan sumber daya manusia secara inklusif.',
  'Mempercepat pembangunan infrastruktur yang maju dan ramah lingkungan.',
  'Membangun ekonomi kreatif berbasis teknologi.',
  'Mentransformasi pelayanan publik berbasis digital.',
];
export const TUJUAN_LAYANAN = [
  'Mempermudah warga terdampak bencana atau fenomena alam mengajukan bantuan tanpa harus antre.',
  'Membuat setiap tahap proses terlihat dan dapat dipantau dengan kode permohonan.',
  'Memastikan setiap tahap diproses sesuai batas waktu oleh petugas yang berwenang.',
  'Menjaga proses yang transparan, tertib, dan dapat dipertanggungjawabkan.',
];
export const ASAS = [
  ['Transparan', 'Status dan riwayat permohonan dapat dilihat pemohon kapan saja.'],
  ['Tepat waktu', 'Setiap tahap punya batas waktu pelayanan yang jelas.'],
  ['Akuntabel', 'Setiap tindakan petugas tercatat dalam riwayat permohonan.'],
  ['Mudah diakses', 'Pengajuan dilakukan daring, perorangan maupun kolektif (RT, RW, Kelurahan, Kecamatan).'],
];
export const DASAR_HUKUM = [
  'Peraturan Wali Kota Depok No. 8 Tahun 2021 tentang Pedoman Pengajuan dan Pertanggungjawaban Belanja Tidak Terduga (BTT).',
];

// ===== FAQ lengkap (halaman /faq). Format: [judul kelompok, [[pertanyaan, jawaban], ...]] =====
export const FAQ_LENGKAP = [
  ['Sebelum mengajukan', [
    ['Bantuan apa yang diberikan layanan ini?', 'Bantuan Belanja Tidak Terduga (BTT) bagi warga yang rumahnya terdampak bencana atau fenomena alam, seperti banjir, tanah longsor, angin puting beliung, pohon tumbang, dan gempa bumi. Besar bantuan ditentukan dari hasil verifikasi lapangan dan tingkat kerusakan.'],
    ['Siapa yang dapat mengajukan?', 'Warga yang terdampak, baik perorangan maupun kolektif melalui RT, RW, Kelurahan, atau Kecamatan.'],
    ['Apa saja berkas yang harus disiapkan?', 'Surat permohonan bermaterai Rp10.000, surat keterangan terkena bencana dari Lurah, surat pengantar RT/RW, foto copy KTP dan KK, bukti kepemilikan rumah (PBB), foto rumah saat terkena bencana, dan denah rumah. Foto copy kartu bantuan (Jamkesda, KIS, KKS, PKH, BPJS, dan sejenisnya) bersifat opsional. Daftar lengkapnya ada di bagian Syarat pada beranda.'],
    ['Apa format dan ukuran berkas yang boleh diunggah?', 'Format JPG, PNG, atau PDF, dengan ukuran maksimal 3 MB per berkas. Pastikan tulisan terbaca jelas saat difoto atau dipindai.'],
  ]],
  ['Mengajukan permohonan', [
    ['Bagaimana cara mengajukan?', 'Daftar akun warga dengan nama, NIK 16 digit, dan email. Setelah masuk, pilih Ajukan permohonan, isi formulir, unggah berkas, lalu kirim. Anda akan mendapat kode permohonan.'],
    ['Apa itu pengajuan kolektif?', 'Pengajuan yang diusulkan oleh RT, RW, Kelurahan, atau Kecamatan. Pada formulir, pilih jenis pengajuan kolektif yang sesuai, lalu tulis nama RT, RW, Kelurahan, atau Kecamatan pengusul.'],
    ['Apakah saya harus datang ke kantor?', 'Pengajuan dilakukan daring. Namun, berkas seperti surat keterangan Lurah dan surat pengantar RT/RW tetap perlu diurus lebih dulu ke RT, RW, dan Kelurahan. Petugas juga dapat melakukan verifikasi lapangan ke rumah yang terdampak.'],
    ['Saya lupa menyimpan kode permohonan. Apa yang harus dilakukan?', 'Masuk ke akun Anda, lalu buka menu Permohonan Saya. Semua permohonan beserta kodenya tampil di sana.'],
  ]],
  ['Memantau proses', [
    ['Bagaimana mengetahui sampai mana prosesnya?', 'Masukkan kode permohonan di halaman Cek Status, atau buka Permohonan Saya setelah masuk. Tahap dan riwayatnya ditampilkan di sana.'],
    ['Apa saja tahapan prosesnya?', 'Disposisi Wali Kota, verifikasi administrasi dan lapangan oleh Disrumkim, verifikasi Sekda dan ekspose TAPD, penyusunan dan verifikasi draft SK, paraf dan tanda tangan Wali Kota, penomoran SK, penyerahan SK, lalu pencairan oleh BKD.'],
    ['Berapa lama prosesnya?', 'Setiap tahap punya batas waktu yang ditampilkan pada alur di beranda. Lama keseluruhan bergantung pada kelengkapan berkas dan hasil verifikasi.'],
    ['Apa arti status Ditolak?', 'Permohonan tidak dapat dilanjutkan, misalnya karena berkas tidak lengkap atau tidak memenuhi syarat. Alasannya dapat dilihat pada riwayat permohonan.'],
  ]],
  ['Akun dan keamanan', [
    ['Saya lupa kata sandi. Bagaimana?', 'Gunakan menu Lupa kata sandi di halaman masuk. Tautan untuk mengatur ulang dikirim ke email yang terdaftar. Jika tidak ada email masuk, hubungi Disrumkim lewat halaman Kontak.'],
    ['Apakah data saya aman?', 'Berkas dan data pribadi hanya dapat dilihat pemohon dan petugas yang berwenang. Setiap akses petugas tercatat dalam log. Data yang tampil untuk umum hanya rekap agregat tanpa data pribadi.'],
    ['Mengapa saya tidak melihat menu Unduhan?', 'Menu Unduhan hanya tampil setelah Anda masuk ke akun.'],
  ]],
];

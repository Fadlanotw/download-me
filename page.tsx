'use client';

import { useState } from 'react';
import './global.css';

/* ---------------------------------------------------------------------- */
/* Data contoh — ganti dengan data asli dari backend/API sekolah          */
/* ---------------------------------------------------------------------- */

const JALUR = [
  {
    nama: 'Zonasi',
    kuota: '50%',
    deskripsi:
      'Diprioritaskan bagi calon murid dengan domisili terdekat dari sekolah, dibuktikan dengan Kartu Keluarga.',
  },
  {
    nama: 'Afirmasi',
    kuota: '15%',
    deskripsi:
      'Untuk keluarga penerima bantuan sosial dan anak penyandang disabilitas, dibuktikan dengan kartu program pemerintah.',
  },
  {
    nama: 'Prestasi',
    kuota: '30%',
    deskripsi:
      'Berdasarkan nilai rapor atau prestasi akademik/non-akademik berjenjang minimal tingkat kabupaten/kota.',
  },
  {
    nama: 'Perpindahan Tugas Orang Tua',
    kuota: '5%',
    deskripsi:
      'Bagi anak dari orang tua/wali yang berpindah tugas, dibuktikan dengan surat penugasan dari instansi terkait.',
  },
];

const JADWAL = [
  { tahap: 'Pengajuan akun & unggah dokumen', tanggal: '2–14 Jun 2026' },
  { tahap: 'Verifikasi berkas oleh sekolah', tanggal: '15–17 Jun 2026' },
  { tahap: 'Pengumuman hasil', tanggal: '20 Jun 2026' },
  { tahap: 'Daftar ulang', tanggal: '21–24 Jun 2026' },
];

const PERSYARATAN = [
  'Kartu Keluarga (KK) yang diterbitkan minimal 1 tahun sebelum pendaftaran',
  'Akta kelahiran atau surat keterangan lahir',
  'Ijazah/SKL jenjang sebelumnya',
  'Pas foto terbaru latar merah',
  'Dokumen pendukung jalur (KIP, sertifikat prestasi, atau surat tugas)',
];

/* ---------------------------------------------------------------------- */

export default function SpmbPage() {
  const [nomor, setNomor] = useState('');
  const [hasil, setHasil] = useState<null | 'diterima' | 'ditolak' | 'belum'>(null);

  function cekStatus(e: React.FormEvent) {
    e.preventDefault();
    if (!nomor.trim()) return;
    // Demo lokal: ganti dengan pemanggilan API status pendaftaran sesungguhnya.
    const digitAkhir = Number(nomor.trim().slice(-1));
    if (Number.isNaN(digitAkhir)) setHasil('belum');
    else setHasil(digitAkhir % 2 === 0 ? 'diterima' : 'ditolak');
  }

  return (
    <>
      {/* NAVBAR */}
      <header className="navbar">
        <div className="navbar__inner">
          <a href="#" className="navbar__brand">
            <span className="navbar__mark">SM</span>
            SPMB 2026/2027
          </a>
          <nav className="navbar__links">
            <a href="#alur" aria-current="page">Alur Pendaftaran</a>
            <a href="#jalur">Jalur</a>
            <a href="#jadwal">Jadwal</a>
            <a href="#status">Cek Status</a>
          </nav>
          <a href="#daftar" className="btn btn--brass btn--sm">Daftar Sekarang</a>
        </div>
      </header>

      <main>
        {/* HERO */}
        <section className="section" style={{ background: 'var(--canvas)', color: 'var(--paper)' }}>
          <div className="container grid-2" style={{ alignItems: 'center' }}>
            <div className="stack">
              <span className="text-eyebrow" style={{ color: 'var(--brass)' }}>
                Tahun Ajaran 2026/2027
              </span>
              <h1 style={{ color: 'var(--paper)' }}>
                Satu pintu pendaftaran, empat jalur menuju sekolah pilihan.
              </h1>
              <p style={{ color: 'rgba(244,239,225,0.75)', maxWidth: '46ch' }}>
                Ajukan berkas, pantau verifikasi, dan lihat hasil kelulusan
                dalam satu sistem — tanpa perlu datang berkali-kali ke sekolah.
              </p>
              <div className="cluster mt-6">
                <a href="#daftar" className="btn btn--brass btn--lg">Mulai Pendaftaran</a>
                <a href="#status" className="btn btn--outline btn--lg" style={{ borderColor: 'rgba(244,239,225,0.3)', color: 'var(--paper)' }}>
                  Cek Status Pendaftaran
                </a>
              </div>
            </div>

            <div className="cluster" style={{ justifyContent: 'space-between', gap: 'var(--space-6)' }}>
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-2xl)', color: 'var(--brass)' }}>1.240</div>
                <div className="text-sm" style={{ color: 'rgba(244,239,225,0.6)' }}>Kuota murid baru</div>
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-2xl)', color: 'var(--brass)' }}>18</div>
                <div className="text-sm" style={{ color: 'rgba(244,239,225,0.6)' }}>Sekolah bergabung</div>
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-2xl)', color: 'var(--brass)' }}>4</div>
                <div className="text-sm" style={{ color: 'rgba(244,239,225,0.6)' }}>Jalur pendaftaran</div>
              </div>
            </div>
          </div>
        </section>

        {/* ALUR PENDAFTARAN */}
        <section id="alur" className="section">
          <div className="container stack">
            <h2>Alur pendaftaran</h2>
            <p>Empat tahap dari pengajuan akun hingga daftar ulang, semuanya dapat dipantau di halaman status.</p>
            <ol className="stepper mt-6">
              <li className="step is-complete">
                <div className="step__circle">1</div>
                Buat akun &amp; isi data diri
              </li>
              <li className="step is-complete">
                <div className="step__circle">2</div>
                Unggah dokumen
              </li>
              <li className="step is-current">
                <div className="step__circle">3</div>
                Verifikasi sekolah
              </li>
              <li className="step">
                <div className="step__circle">4</div>
                Pengumuman &amp; daftar ulang
              </li>
            </ol>
          </div>
        </section>

        {/* JALUR PENDAFTARAN */}
        <section id="jalur" className="section section--alt">
          <div className="container stack">
            <h2>Pilih jalur pendaftaran</h2>
            <p>Setiap calon murid hanya dapat memilih satu jalur sesuai dokumen pendukung yang dimiliki.</p>
            <div className="grid-2 mt-6">
              {JALUR.map((j) => (
                <div className="card" key={j.nama}>
                  <div className="card__header">
                    <h3>{j.nama}</h3>
                    <span className="badge badge--tinjau">Kuota {j.kuota}</span>
                  </div>
                  <div className="card__body">
                    <p>{j.deskripsi}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PERSYARATAN & JADWAL */}
        <section id="jadwal" className="section">
          <div className="container grid-2">
            <div className="stack">
              <h2>Dokumen yang disiapkan</h2>
              <ul className="stack" style={{ marginTop: 'var(--space-4)' }}>
                {PERSYARATAN.map((p) => (
                  <li key={p} className="cluster" style={{ alignItems: 'flex-start' }}>
                    <span className="badge badge--terverifikasi" style={{ flexShrink: 0 }}>Wajib</span>
                    <span className="text-sm">{p}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="stack">
              <h2>Jadwal tahapan</h2>
              <div className="table-wrap mt-4">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Tahapan</th>
                      <th>Tanggal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {JADWAL.map((row) => (
                      <tr key={row.tahap}>
                        <td>{row.tahap}</td>
                        <td className="mono text-sm">{row.tanggal}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* CEK STATUS */}
        <section id="status" className="section section--alt">
          <div className="container">
            <div className="card card--elevated" style={{ maxWidth: 560, margin: '0 auto' }}>
              <div className="card__header">
                <h3>Cek status pendaftaran</h3>
              </div>
              <div className="card__body stack">
                <form onSubmit={cekStatus} className="cluster" style={{ alignItems: 'flex-end' }}>
                  <div className="field" style={{ flex: 1, marginBottom: 0 }}>
                    <label className="field__label" htmlFor="nomor">Nomor pendaftaran</label>
                    <input
                      id="nomor"
                      className="input"
                      placeholder="Contoh: SPMB-00214"
                      value={nomor}
                      onChange={(e) => setNomor(e.target.value)}
                    />
                  </div>
                  <button type="submit" className="btn btn--primary">Cek</button>
                </form>

                {hasil && (
                  <div className="flex items-center gap-4 mt-4">
                    {hasil === 'diterima' && <div className="stamp">Diterima</div>}
                    {hasil === 'ditolak' && <div className="stamp stamp--ditolak">Belum Lolos</div>}
                    {hasil === 'belum' && <span className="badge badge--proses">Sedang diproses</span>}
                    <p className="text-sm" style={{ margin: 0 }}>
                      {hasil === 'diterima' && 'Selamat! Silakan lanjutkan ke tahap daftar ulang sebelum 24 Jun 2026.'}
                      {hasil === 'ditolak' && 'Nomor ini belum lolos pada jalur yang dipilih. Anda dapat mencoba jalur lain bila memenuhi syarat.'}
                      {hasil === 'belum' && 'Berkas Anda masih dalam antrean verifikasi sekolah.'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer style={{ background: 'var(--canvas)', color: 'rgba(244,239,225,0.6)' }}>
        <div className="container" style={{ padding: 'var(--space-6) var(--space-5)' }}>
          <p className="text-sm" style={{ color: 'inherit' }}>
            Dinas Pendidikan — Sistem Penerimaan Murid Baru. Butuh bantuan? Hubungi
            posko SPMB di sekolah tujuan.
          </p>
        </div>
      </footer>
    </>
  );
}

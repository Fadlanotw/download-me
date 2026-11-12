import Link from "next/link";
import SchoolCrest from "./components/school-crest";

const programs = [
  {
    number: "1",
    title: "Buat Akun",
    detail: "Lakukan registrasi awal melalui portal SPMB ini untuk mendapatkan nomor pendaftaran resmi.",
  },
  {
    number: "2",
    title: "Lengkapi Berkas",
    detail: "Unggah scan rapor, akta kelahiran, kartu keluarga, serta pas foto terbaru untuk tahap administrasi.",
  },
  {
    number: "3",
    title: "Tes Seleksi",
    detail: "Ikuti ujian seleksi secara online yang meliputi Tes Potensi Akademik dan wawancara internal.",
  },
  {
    number: "4",
    title: "Hasil Kelulusan",
    detail: "Pengumuman hasil seleksi dapat diakses secara transparan langsung melalui dashboard personal Anda.",
  },
];

const milestones = [
  {
    date: "10 Jan - 28 Feb 2026",
    title: "Gelombang I: Pendaftaran Online & Pengunggahan Berkas",
    detail: "Diskon biaya formulir pendaftaran sebesar 20% bagi pendaftar gelombang pertama.",
    status: "Berlangsung",
    active: true,
  },
  {
    date: "07 Maret 2026",
    title: "Pelaksanaan Tes Seleksi Akademik Online",
    detail: "Ujian dilaksanakan serentak melalui portal e-exam Garuda Utama.",
    status: "Terjadwal",
    active: false,
  },
  {
    date: "14 Maret 2026",
    title: "Pengumuman Hasil Kelulusan Gelombang I",
    detail: "Hasil seleksi diumumkan secara transparan pada pukul 10.00 WIB.",
    status: "Terjadwal",
    active: false,
  },
  {
    date: "15 Mar - 31 Mar 2026",
    title: "Registrasi Ulang & Penyerahan Dokumen Fisik",
    detail: "Proses administrasi fisik dan pengukuran seragam bagi siswa yang lolos.",
    status: "Terjadwal",
    active: false,
  },
];

export default function Home() {
  return (
    <main className="home-page">
      <header className="home-header">
        <div className="home-header-inner">
          <Link className="home-brand" href="/" aria-label="SMA Garuda Utama">
            <span className="home-brand-crest" aria-hidden="true">
              <SchoolCrest />
            </span>
            <span className="home-brand-copy">
              <strong>GARUDA UTAMA</strong>
              <small>SPMB ONLINE</small>
            </span>
          </Link>

          <nav className="home-nav" aria-label="Navigasi utama">
            <a className="home-nav-active" href="#tentang">Beranda</a>
            <a href="#alur">Alur Pendaftaran</a>
            <a href="#informasi">Informasi</a>
            <a href="#kontak">Kontak</a>
          </nav>

          <div className="home-header-actions">
            <Link className="home-sign-in" href="/login">Login</Link>
            <Link className="home-button home-button-gold home-header-cta" href="/register">
              Daftar Baru
            </Link>
          </div>
        </div>
      </header>

      <section className="home-hero" id="tentang">
        <div className="home-hero-image" aria-hidden="true" />
        <div className="home-hero-inner">
          <div className="home-hero-copy">
            <span className="home-eyebrow">★ Pendaftaran Online T.A 2026/2027 Telah Dibuka</span>
            <h1>Pintu Menuju Prestasi Internasional Telah Terbuka!</h1>
            <p>
              Mari menjadi bagian dari generasi unggul di Garuda Utama High
              School. Kurikulum berstandar global dengan fasilitas modern siap
              mengantarkan putra-putri terbaik bangsa menggapai impian dunia.
            </p>
            <div className="home-hero-actions">
              <Link className="home-button home-button-gold" href="/register">
                Daftar Sekarang
              </Link>
              <a className="home-button home-button-outline" href="#alur">Lihat Panduan Pendaftaran</a>
            </div>
          </div>
        </div>
      </section>

      <section className="home-process" id="alur">
        <div className="home-process-heading">
          <div>
            <span className="home-section-eyebrow">BAGAIMANA CARA BERGABUNG?</span>
            <h2>Alur Penerimaan Murid Baru</h2>
          </div>
        </div>
        <div className="home-process-grid">
          {programs.map((step) => (
            <article className="home-process-card" key={step.number}>
              <span className="home-process-number">{step.number}</span>
              <h3>{step.title}</h3>
              <p>{step.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="home-schedule" id="informasi">
        <div className="home-schedule-inner">
          <div className="home-schedule-heading">
            <span className="home-section-eyebrow">AGENDA SPMB</span>
            <h2>Jadwal Penting &amp; Timeline Utama</h2>
          </div>
          <div className="home-milestones">
            {milestones.map((item) => (
              <article className={`home-milestone${item.active ? " home-milestone-active" : ""}`} key={item.date}>
                <span className="home-milestone-date">{item.date}</span>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.detail}</p>
                </div>
                <span className="home-milestone-status">{item.status}</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      <footer className="home-footer" id="kontak">
        <div className="home-footer-main">
          <div className="home-footer-school">
            <Link className="home-brand home-footer-brand" href="/" aria-label="SMA Garuda Utama">
              <span className="home-brand-crest" aria-hidden="true">
                <SchoolCrest />
              </span>
              <span className="home-brand-copy">
                <strong>GARUDA UTAMA</strong>
                <small>SPMB ONLINE</small>
              </span>
            </Link>
            <p>Mendidik pemimpin masa depan yang berkarakter kokoh, cerdas, berwawasan global, dan berintegritas tinggi.</p>
          </div>
          <div className="home-footer-column">
            <h2>Hubungi Kami</h2>
            <address>
              <span>Jl. Garuda Utama No. 45, Depok, Jawa Barat</span>
              <a href="mailto:info@garudautama.sch.id">info@garudautama.sch.id</a>
              <a href="tel:+62215558899">(021) 555-8899</a>
            </address>
          </div>
          <div className="home-footer-column">
            <h2>Tautan Cepat</h2>
            <nav className="home-footer-links" aria-label="Tautan cepat">
              <Link href="/portal">Portal Akademik</Link>
              <a href="#alur">Fasilitas Sekolah</a>
              <a href="#informasi">Biaya Pendidikan</a>
            </nav>
          </div>
        </div>
        <div className="home-footer-bottom">
          <span className="home-copyright">© 2026 Garuda Utama High School. All rights reserved.</span>
          <div className="home-social-links" aria-label="Media sosial">
            <span aria-label="Instagram">
              <svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><rect x="3" y="3" width="14" height="14" rx="4" /><circle cx="10" cy="10" r="3.2" /><circle cx="14.5" cy="5.7" r=".8" fill="currentColor" stroke="none" /></svg>
            </span>
            <span aria-label="YouTube">
              <svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><rect x="2.5" y="4.5" width="15" height="11" rx="3" /><path d="m8 7 5 3-5 3V7Z" fill="currentColor" stroke="none" /></svg>
            </span>
            <span aria-label="Facebook">
              <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M11.5 17v-6h2l.3-2.4h-2.3V7.1c0-.7.2-1.2 1.2-1.2h1.2V3.8c-.2 0-.9-.1-1.8-.1-1.9 0-3.2 1.1-3.2 3.3v1.6H7V11h1.9v6h2.6Z" /></svg>
            </span>
          </div>
        </div>
      </footer>
    </main>
  );
}

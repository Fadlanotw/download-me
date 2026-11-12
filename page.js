import Link from "next/link";
import LogoutButton from "../LogoutButton";
import styles from "./dashboard.module.css";

// TODO: ganti dengan data dari sesi login / database
const nama = "muhammad fadlan sabani";
const progres = { biodata: false, berkas: false, tes: false, hasil: false };

const langkah = [
  { judul: "Buat Akun", ket: "Akun Anda sudah aktif.", selesai: true },
  {
    judul: "Lengkapi Berkas",
    ket: "Isi biodata dan unggah dokumen.",
    selesai: progres.biodata && progres.berkas,
  },
  {
    judul: "Tes Seleksi",
    ket: "Tes Potensi Akademik dan wawancara.",
    selesai: progres.tes,
  },
  {
    judul: "Hasil Kelulusan",
    ket: "Pengumuman muncul di dashboard ini.",
    selesai: progres.hasil,
  },
];
const langkahAktif = langkah.findIndex((l) => !l.selesai);

const menu = [
  {
    href: "/dashboard/calon-siswa/biodata", // sesuaikan dengan route Anda
    judul: "Isi Biodata",
    ket: "Data diri, orang tua, dan asal sekolah.",
    aksi: "Isi sekarang",
  },
  {
    href: "/dashboard/calon-siswa/berkas",
    judul: "Upload Berkas",
    ket: "Scan rapor, akta kelahiran, kartu keluarga, dan pas foto.",
    aksi: "Unggah berkas",
  },
  {
    href: "/dashboard/calon-siswa/tes",
    judul: "Ikut Tes",
    ket: "Tes Potensi Akademik online dan wawancara.",
    aksi: "Mulai tes",
  },
];

const jadwal = [
  { tgl: "10 Jan - 28 Feb 2026", acara: "Gelombang I: Pendaftaran Online", aktif: true },
  { tgl: "07 Maret 2026", acara: "Pelaksanaan Tes Seleksi Akademik Online" },
  { tgl: "14 Maret 2026", acara: "Pengumuman Hasil Kelulusan Gelombang I" },
];

export default function DashboardCalonSiswa() {
  return (
    <div className={styles.page}>
      <header className={styles.nav}>
        <div className={styles.navInner}>
          <div className={styles.brand}>
            <span className={styles.brandName}>GARUDA UTAMA</span>
            <span className={styles.brandSub}>SPMB ONLINE</span>
          </div>
          <div className={styles.logoutWrap}>
            <LogoutButton />
          </div>
        </div>
      </header>

      <section className={styles.hero}>
        <div className={styles.container}>
          <p className={styles.badge}>Pendaftaran Online T.A 2026/2027</p>
          <h1 className={styles.title}>
            Halo, <span className={styles.name}>{nama}</span>
          </h1>
          <p className={styles.lead}>
            Lengkapi biodata, unggah berkas, lalu ikuti tes seleksi. Status
            pendaftaran Anda tampil di halaman ini.
          </p>
        </div>
      </section>

      <main className={styles.container}>
        <section className={styles.block} aria-labelledby="h-status">
          <h2 id="h-status" className={styles.h2}>
            Status Pendaftaran
          </h2>
          <ol className={styles.steps}>
            {langkah.map((l, i) => {
              const state = l.selesai ? "done" : i === langkahAktif ? "now" : "next";
              return (
                <li key={l.judul} className={`${styles.step} ${styles[state]}`}>
                  <span className={styles.stepNo}>{l.selesai ? "✓" : i + 1}</span>
                  <h3 className={styles.stepTitle}>{l.judul}</h3>
                  <p className={styles.stepText}>{l.ket}</p>
                </li>
              );
            })}
          </ol>
        </section>

        <section className={styles.block} aria-labelledby="h-menu">
          <h2 id="h-menu" className={styles.h2}>
            Yang perlu Anda lakukan
          </h2>
          <div className={styles.menu}>
            {menu.map((m) => (
              <Link key={m.judul} href={m.href} className={styles.card}>
                <h3 className={styles.cardTitle}>{m.judul}</h3>
                <p className={styles.cardText}>{m.ket}</p>
                <span className={styles.cardAction}>{m.aksi}</span>
              </Link>
            ))}
          </div>
        </section>

        <section className={styles.block} aria-labelledby="h-jadwal">
          <h2 id="h-jadwal" className={styles.h2}>
            Jadwal Penting
          </h2>
          <ul className={styles.jadwal}>
            {jadwal.map((j) => (
              <li
                key={j.acara}
                className={`${styles.row} ${j.aktif ? styles.rowAktif : ""}`}
              >
                <span className={styles.date}>{j.tgl}</span>
                <span className={styles.event}>{j.acara}</span>
                <span className={styles.tag}>{j.aktif ? "Berlangsung" : "Terjadwal"}</span>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <footer className={styles.footer}>
        © 2026 Garuda Utama High School. All rights reserved.
      </footer>
    </div>
  );
}

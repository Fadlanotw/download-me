"use client";

import AdminShell from "../_components/AdminShell";
import JadwalSection from "./JadwalSection";
import s from "./page.module.css";
import t from "./jadwal.module.css";

const TIMELINE = [
  { id: 1, tanggal: "01 - 28 Feb 2026", teks: "Masa Pendaftaran & Upload Berkas Gelombang I", selesai: true },
  { id: 2, tanggal: "07 Maret 2026", teks: "Pelaksanaan Tes Potensi Akademik (TPA)", selesai: false },
  { id: 3, tanggal: "14 Maret 2026", teks: "Tes Wawancara Kepribadian & Kemandirian", selesai: false },
  { id: 4, tanggal: "21 Maret 2026", teks: "Pengumuman Kelulusan Akhir Gelombang I", selesai: false },
];

export default function JadwalTesPage() {
  return (
    <AdminShell breadcrumb="Jadwal Tes Seleksi">
      <div className={s.wrap}>
        <JadwalSection />

        <div className={t.timelineBox}>
          <h2 className={t.timelineTitle}>Alur Timeline Kegiatan Terdekat</h2>
          {TIMELINE.map((item) => (
            <div key={item.id} className={t.timelineRow}>
              <span className={t.timelineDate}>{item.tanggal}</span>
              <span className={`${t.dot} ${item.selesai ? t.dotDone : ""}`} />
              <span className={t.timelineText}>{item.teks}</span>
              <span className={`${t.timelineBadge} ${item.selesai ? t.badgeDone : ""}`}>
                {item.selesai ? "Selesai" : "Akan Datang"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </AdminShell>
  );
}
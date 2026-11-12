"use client";
import { useEffect, useState } from "react";
import { Plus, Clock, MapPin, X } from "lucide-react";
import styles from "./jadwal.module.css";

const JURUSAN = { PPLG: "PPLG (RPL)", MPLB: "MPLB (Layanan Bisnis)", PM: "Pemasaran (BDR)" };
const kosong = { nama: "", tanggal: "", jam_mulai: "", jam_selesai: "", lokasi: "", semua_peserta: true };

const fmtTgl = (t) =>
  new Date(t + "T00:00:00").toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" });

export default function JadwalSection() {
  const [jadwal, setJadwal] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(kosong);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [pesertaOf, setPesertaOf] = useState(null);
  const [peserta, setPeserta] = useState([]);
  const [loadingPeserta, setLoadingPeserta] = useState(false);

  async function load() {
    try {
      const res = await fetch("/api/admin/jadwal");
      const data = await res.json();
      setJadwal(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => { load(); }, []);

  async function simpan(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/admin/jadwal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal menyimpan");
      setShowForm(false);
      setForm(kosong);
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function lihatPeserta(j) {
    setPesertaOf(j);
    setPeserta([]);
    setLoadingPeserta(true);
    try {
      const res = await fetch(`/api/admin/jadwal/${j.id}/peserta`);
      const data = await res.json();
      setPeserta(Array.isArray(data) ? data : []);
    } finally {
      setLoadingPeserta(false);
    }
  }

  const set = (k) => (e) =>
    setForm({ ...form, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value });

  return (
    <>
      <div className={styles.head}>
        <div>
          <h1 className={styles.title}>Jadwal Tes &amp; Seleksi Masuk</h1>
          <p className={styles.sub}>Kelola jadwal, ruangan, metode tes, dan pantau jumlah partisipasi peserta seleksi.</p>
        </div>
        <button className={styles.btnPrimary} onClick={() => { setError(""); setShowForm(true); }}>
          <Plus size={16} /> Tambah Jadwal Baru
        </button>
      </div>

      {loading ? (
        <p className={styles.empty}>Memuat jadwal...</p>
      ) : jadwal.length === 0 ? (
        <p className={styles.empty}>Belum ada jadwal. Klik "Tambah Jadwal Baru".</p>
      ) : (
        <div className={styles.grid}>
          {jadwal.map((j) => (
            <div key={j.id} className={styles.card}>
              <div className={styles.cardTop}>
                <span className={`${styles.badge} ${styles[j.status]}`}>{j.status}</span>
                <span className={styles.date}>{fmtTgl(j.tanggal)}</span>
              </div>
              <h3 className={styles.cardTitle}>{j.nama}</h3>
              <p className={styles.meta}><Clock size={14} /> {j.jam_mulai} - {j.jam_selesai} WIB</p>
              <p className={styles.meta}><MapPin size={14} /> {j.lokasi}</p>
              <div className={styles.cardBottom}>
                <strong>{j.jumlah_peserta} Peserta Terdaftar</strong>
                <button className={styles.btnDark} onClick={() => lihatPeserta(j)}>Lihat Peserta</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className={styles.overlay} onClick={() => setShowForm(false)}>
          <form className={styles.modal} onClick={(e) => e.stopPropagation()} onSubmit={simpan}>
            <div className={styles.modalHead}>
              <h2>Tambah Jadwal Baru</h2>
              <button type="button" className={styles.close} onClick={() => setShowForm(false)}><X size={18} /></button>
            </div>
            <label>Nama Tes
              <input value={form.nama} onChange={set("nama")} placeholder="Contoh: TPA (Tes Potensi Akademik)" required />
            </label>
            <label>Tanggal
              <input type="date" value={form.tanggal} onChange={set("tanggal")} required />
            </label>
            <div className={styles.row}>
              <label>Jam Mulai
                <input type="time" value={form.jam_mulai} onChange={set("jam_mulai")} required />
              </label>
              <label>Jam Selesai
                <input type="time" value={form.jam_selesai} onChange={set("jam_selesai")} required />
              </label>
            </div>
            <label>Lokasi / Metode
              <input value={form.lokasi} onChange={set("lokasi")} placeholder="Contoh: Online (CBT Portal)" required />
            </label>
            <label className={styles.check}>
              <input type="checkbox" checked={form.semua_peserta} onChange={set("semua_peserta")} />
              Daftarkan semua calon siswa sebagai peserta
            </label>
            {error && <p className={styles.error}>{error}</p>}
            <div className={styles.actions}>
              <button type="button" className={styles.btnGhost} onClick={() => setShowForm(false)}>Batal</button>
              <button type="submit" className={styles.btnPrimary} disabled={saving}>
                {saving ? "Menyimpan..." : "Simpan Jadwal"}
              </button>
            </div>
          </form>
        </div>
      )}

      {pesertaOf && (
        <div className={styles.overlay} onClick={() => setPesertaOf(null)}>
          <div className={`${styles.modal} ${styles.wide}`} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHead}>
              <h2>Peserta: {pesertaOf.nama}</h2>
              <button type="button" className={styles.close} onClick={() => setPesertaOf(null)}><X size={18} /></button>
            </div>
            {loadingPeserta ? (
              <p className={styles.empty}>Memuat peserta...</p>
            ) : peserta.length === 0 ? (
              <p className={styles.empty}>Belum ada peserta di jadwal ini.</p>
            ) : (
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr><th>No</th><th>Nama</th><th>NISN</th><th>Jurusan</th><th>WhatsApp</th></tr>
                  </thead>
                  <tbody>
                    {peserta.map((p, i) => (
                      <tr key={p.id}>
                        <td>{i + 1}</td>
                        <td>{p.nama}</td>
                        <td>{p.nisn || "-"}</td>
                        <td>{JURUSAN[p.jurusan] || p.jurusan || "-"}</td>
                        <td>{p.whatsapp || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
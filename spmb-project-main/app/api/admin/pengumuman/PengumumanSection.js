"use client";
import { useEffect, useState } from "react";
import { Plus, X, CheckCircle2 } from "lucide-react";
import styles from "./pengumuman.module.css";

const kosong = { judul: "", isi: "" };

const tglPanjang = (v) =>
  new Date(v).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
const tglPendek = (v) =>
  new Date(v).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });

function infoWaktu(p) {
  if (p.status === "published" && p.published_at) {
    const selisih = Date.now() - new Date(p.published_at).getTime();
    return selisih < 3600000 ? "Published baru saja" : `Published ${tglPanjang(p.published_at)}`;
  }
  return `Terakhir diubah ${tglPendek(p.updated_at)}`;
}

async function kirim(url, method, body) {
  const res = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Terjadi kesalahan");
  return data;
}

export default function PengumumanSection() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(null);
  const [modal, setModal] = useState(null); // null | { mode: "create" } | { mode: "edit", p }
  const [form, setForm] = useState(kosong);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function load(pilihId) {
    try {
      const res = await fetch("/api/admin/pengumuman", { cache: "no-store" });
      const data = await res.json();
      const rows = Array.isArray(data) ? data : [];
      setList(rows);
      setSelectedId((cur) =>
        pilihId ?? (rows.some((r) => r.id === cur) ? cur : rows[0]?.id ?? null)
      );
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    load();
  }, []);

  function bukaBaru() {
    setForm(kosong);
    setError("");
    setModal({ mode: "create" });
  }

  function bukaEdit(p) {
    setForm({ judul: p.judul, isi: p.isi });
    setError("");
    setModal({ mode: "edit", p });
  }

  async function simpan(publish) {
    if (!form.judul.trim() || !form.isi.trim()) {
      setError("Judul dan isi pengumuman wajib diisi");
      return;
    }
    setSaving(true);
    setError("");
    try {
      let id;
      if (modal.mode === "create") {
        const d = await kirim("/api/admin/pengumuman", "POST", { ...form, publish });
        id = d.id;
      } else {
        id = modal.p.id;
        await kirim(`/api/admin/pengumuman/${id}`, "PUT", form);
        if (publish && modal.p.status !== "published") {
          await kirim(`/api/admin/pengumuman/${id}`, "PATCH", { aksi: "publish" });
        }
      }
      setModal(null);
      await load(id);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function ubahStatus(p, aksi) {
    if (
      aksi === "tarik" &&
      !window.confirm(`Tarik pengumuman "${p.judul}"? Pengumuman akan kembali menjadi draft.`)
    ) {
      return;
    }
    try {
      await kirim(`/api/admin/pengumuman/${p.id}`, "PATCH", { aksi });
      await load(p.id);
    } catch (err) {
      alert(err.message);
    }
  }

  const sel = list.find((p) => p.id === selectedId);
  const isEdit = modal?.mode === "edit";
  const sudahPublished = isEdit && modal.p.status === "published";

  return (
    <>
      <div className={styles.head}>
        <div>
          <h1 className={styles.title}>Manajemen Pengumuman &amp; Broadcast</h1>
          <p className={styles.sub}>
            Publikasikan informasi kelulusan, jadwal registrasi ulang, dan berita penting SPMB.
          </p>
        </div>
        <button type="button" className={styles.btnPrimary} onClick={bukaBaru}>
          <Plus size={16} /> Buat Pengumuman Baru
        </button>
      </div>

      <div className={styles.layout}>
        <div className={styles.listCard}>
          <h2 className={styles.cardHeading}>Daftar Pengumuman</h2>

          {loading ? (
            <p className={styles.empty}>Memuat pengumuman...</p>
          ) : list.length === 0 ? (
            <p className={styles.empty}>Belum ada pengumuman. Klik &quot;Buat Pengumuman Baru&quot;.</p>
          ) : (
            list.map((p) => (
              <div
                key={p.id}
                className={`${styles.item} ${p.id === selectedId ? styles.itemActive : ""}`}
                onClick={() => setSelectedId(p.id)}
              >
                <div className={styles.itemTop}>
                  <span className={`${styles.badge} ${p.status === "published" ? styles.bPub : styles.bDraft}`}>
                    {p.status === "published" ? "Published" : "Draft"}
                  </span>
                  <span className={styles.itemTime}>{infoWaktu(p)}</span>
                </div>
                <h3 className={styles.itemTitle}>{p.judul}</h3>
                <div className={styles.itemBottom}>
                  <span className={styles.count}>{p.jumlah_penerima.toLocaleString("id-ID")} Penerima</span>
                  <div className={styles.actions}>
                    <button
                      type="button"
                      className={`${styles.btnSmall} ${styles.btnEdit}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        bukaEdit(p);
                      }}
                    >
                      Edit
                    </button>
                    {p.status === "published" ? (
                      <button
                        type="button"
                        className={`${styles.btnSmall} ${styles.btnTarik}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          ubahStatus(p, "tarik");
                        }}
                      >
                        Tarik
                      </button>
                    ) : (
                      <button
                        type="button"
                        className={`${styles.btnSmall} ${styles.btnPublish}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          ubahStatus(p, "publish");
                        }}
                      >
                        Publish
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className={styles.preview}>
          {!sel ? (
            <p className={styles.empty}>Pilih pengumuman untuk melihat pratinjau.</p>
          ) : (
            <>
              <p className={styles.kicker}>PRATINJAU PENGUMUMAN</p>
              <h2 className={styles.pvTitle}>{sel.judul}</h2>
              <p className={styles.pvMeta}>
                Dibuat oleh: {sel.dibuat_oleh} &nbsp;•&nbsp; Tanggal:{" "}
                {tglPanjang(sel.published_at || sel.created_at)}
              </p>
              <div className={styles.pvBody}>
                <div className={styles.pvText}>{sel.isi}</div>
                <a
                  href={`/api/admin/pengumuman/${sel.id}/sk`}
                  download
                  className={styles.btnSk}
                >
                  Unduh Surat Keputusan Kelulusan
                </a>
              </div>
              <div className={styles.pvFoot}>
                {sel.status === "published" ? (
                  <>
                    <span>
                      Terkirim ke {sel.jumlah_penerima.toLocaleString("id-ID")} murid via Portal
                    </span>
                    <CheckCircle2 size={20} className={styles.ok} />
                  </>
                ) : (
                  <span>Belum dipublikasikan (draft)</span>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {modal && (
        <div className={styles.overlay} onClick={() => setModal(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHead}>
              <h2>{isEdit ? "Edit Pengumuman" : "Buat Pengumuman Baru"}</h2>
              <button type="button" className={styles.close} onClick={() => setModal(null)}>
                <X size={18} />
              </button>
            </div>

            <label>
              Judul Pengumuman
              <input
                value={form.judul}
                onChange={(e) => setForm({ ...form, judul: e.target.value })}
                placeholder="Contoh: Pengumuman Hasil Seleksi Gelombang I"
              />
            </label>

            <label>
              Isi Pengumuman
              <textarea
                rows={9}
                value={form.isi}
                onChange={(e) => setForm({ ...form, isi: e.target.value })}
                placeholder="Tulis isi pengumuman di sini..."
              />
            </label>

            {error && <p className={styles.error}>{error}</p>}

            <div className={styles.formActions}>
              <button type="button" className={styles.btnGhost} onClick={() => setModal(null)}>
                Batal
              </button>
              {sudahPublished ? (
                <button type="button" className={styles.btnPrimary} disabled={saving} onClick={() => simpan(false)}>
                  {saving ? "Menyimpan..." : "Simpan Perubahan"}
                </button>
              ) : (
                <>
                  <button type="button" className={styles.btnGhost} disabled={saving} onClick={() => simpan(false)}>
                    {saving ? "Menyimpan..." : "Simpan Draft"}
                  </button>
                  <button type="button" className={styles.btnGold} disabled={saving} onClick={() => simpan(true)}>
                    {isEdit ? "Simpan & Publish" : "Publish Sekarang"}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
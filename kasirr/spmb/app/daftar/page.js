"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

const kosong = {
  nama: "", nisn: "", jenis_kelamin: "L", tempat_lahir: "", tanggal_lahir: "",
  alamat: "", asal_sekolah: "", no_hp: "", jurusan_id: "",
};

export default function Daftar() {
  const [form, setForm] = useState(kosong);
  const [jurusan, setJurusan] = useState([]);
  const [hasil, setHasil] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/jurusan").then((r) => r.json()).then((r) => setJurusan(r.data || []));
  }, []);

  const ubah = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  async function kirim(e) {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/calon-siswa", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (data.success) { setHasil(data.no_pendaftaran); setForm(kosong); }
    else setError(data.message || data.error);
  }

  const input = "w-full border rounded-lg px-3 py-2";

  if (hasil)
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
        <div className="bg-white rounded-xl shadow p-8 text-center max-w-md">
          <h1 className="text-2xl font-bold text-green-600">Pendaftaran Berhasil!</h1>
          <p className="mt-3 text-slate-600">Nomor pendaftaran Anda:</p>
          <p className="text-3xl font-mono font-bold my-3">{hasil}</p>
          <p className="text-sm text-slate-500">Simpan nomor ini.</p>
          <Link href="/" className="inline-block mt-5 text-blue-700 underline">Kembali ke Home</Link>
        </div>
      </main>
    );

  return (
    <main className="min-h-screen bg-slate-50 py-10 px-6">
      <form onSubmit={kirim} className="max-w-2xl mx-auto bg-white rounded-xl shadow p-8 space-y-4">
        <h1 className="text-2xl font-bold text-slate-800">Form Pendaftaran</h1>
        {error && <p className="bg-red-50 text-red-600 p-3 rounded">{error}</p>}

        <label className="block">Nama Lengkap *
          <input name="nama" value={form.nama} onChange={ubah} className={input} required /></label>
        <label className="block">NISN *
          <input name="nisn" value={form.nisn} onChange={ubah} className={input} required /></label>
        <label className="block">Jenis Kelamin *
          <select name="jenis_kelamin" value={form.jenis_kelamin} onChange={ubah} className={input}>
            <option value="L">Laki-laki</option><option value="P">Perempuan</option></select></label>
        <div className="grid grid-cols-2 gap-4">
          <label className="block">Tempat Lahir
            <input name="tempat_lahir" value={form.tempat_lahir} onChange={ubah} className={input} /></label>
          <label className="block">Tanggal Lahir
            <input type="date" name="tanggal_lahir" value={form.tanggal_lahir} onChange={ubah} className={input} /></label>
        </div>
        <label className="block">Alamat
          <textarea name="alamat" value={form.alamat} onChange={ubah} className={input} rows={2} /></label>
        <label className="block">Asal Sekolah
          <input name="asal_sekolah" value={form.asal_sekolah} onChange={ubah} className={input} /></label>
        <label className="block">No. HP
          <input name="no_hp" value={form.no_hp} onChange={ubah} className={input} /></label>
        <label className="block">Pilihan Jurusan *
          <select name="jurusan_id" value={form.jurusan_id} onChange={ubah} className={input} required>
            <option value="">-- Pilih jurusan --</option>
            {jurusan.map((j) => <option key={j.id} value={j.id}>{j.nama}</option>)}
          </select></label>

        <button className="w-full bg-blue-700 text-white font-semibold py-3 rounded-lg">Kirim Pendaftaran</button>
      </form>
    </main>
  );
}

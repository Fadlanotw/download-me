"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

const warna = {
  menunggu: "bg-yellow-100 text-yellow-700",
  diterima: "bg-green-100 text-green-700",
  ditolak: "bg-red-100 text-red-700",
};

export default function Admin() {
  const [data, setData] = useState([]);
  const [cari, setCari] = useState("");

  async function muat() {
    const r = await fetch("/api/calon-siswa", { cache: "no-store" });
    const j = await r.json();
    setData(j.data || []);
  }
  useEffect(() => { muat(); }, []);

  async function ubahStatus(id, status) {
    await fetch(`/api/calon-siswa/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    muat();
  }

  async function hapus(id) {
    if (!confirm("Hapus data ini?")) return;
    await fetch(`/api/calon-siswa/${id}`, { method: "DELETE" });
    muat();
  }

  const hitung = (s) => data.filter((d) => d.status === s).length;
  const tampil = data.filter((d) =>
    (d.nama + d.no_pendaftaran + d.nisn).toLowerCase().includes(cari.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-slate-800">Dashboard Admin SPMB</h1>
          <Link href="/" className="text-blue-700 underline">Home</Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[["Total", data.length], ["Menunggu", hitung("menunggu")],
            ["Diterima", hitung("diterima")], ["Ditolak", hitung("ditolak")]].map(([l, n]) => (
            <div key={l} className="bg-white rounded-xl shadow p-4">
              <p className="text-sm text-slate-500">{l}</p>
              <p className="text-3xl font-bold">{n}</p>
            </div>
          ))}
        </div>

        <input value={cari} onChange={(e) => setCari(e.target.value)}
          placeholder="Cari nama / NISN / no. pendaftaran..."
          className="w-full border rounded-lg px-3 py-2 mb-4 bg-white" />

        <div className="bg-white rounded-xl shadow overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-100 text-left">
              <tr>
                <th className="p-3">No. Daftar</th><th className="p-3">Nama</th>
                <th className="p-3">NISN</th><th className="p-3">Jurusan</th>
                <th className="p-3">Status</th><th className="p-3">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {tampil.map((d) => (
                <tr key={d.id} className="border-t">
                  <td className="p-3 font-mono">{d.no_pendaftaran}</td>
                  <td className="p-3">{d.nama}</td>
                  <td className="p-3">{d.nisn}</td>
                  <td className="p-3">{d.jurusan}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded text-xs ${warna[d.status]}`}>{d.status}</span>
                  </td>
                  <td className="p-3 space-x-2 whitespace-nowrap">
                    <button onClick={() => ubahStatus(d.id, "diterima")} className="text-green-600">Terima</button>
                    <button onClick={() => ubahStatus(d.id, "ditolak")} className="text-orange-600">Tolak</button>
                    <button onClick={() => hapus(d.id)} className="text-red-600">Hapus</button>
                  </td>
                </tr>
              ))}
              {tampil.length === 0 && (
                <tr><td colSpan={6} className="p-6 text-center text-slate-500">Belum ada data.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}

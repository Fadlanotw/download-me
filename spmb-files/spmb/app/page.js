import Link from "next/link";
import db from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function Home() {
  let jurusan = [];
  try {
    const [rows] = await db.query(
      `SELECT j.id, j.nama, j.kuota,
              (SELECT COUNT(*) FROM calon_siswa c WHERE c.jurusan_id = j.id) AS pendaftar
       FROM jurusan j ORDER BY j.nama`
    );
    jurusan = rows;
  } catch (e) {}

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="bg-blue-700 text-white py-16 px-6 text-center">
        <h1 className="text-4xl font-bold">SPMB Online</h1>
        <p className="mt-3 text-blue-100">Sistem Penerimaan Murid Baru — daftar dengan mudah dari mana saja.</p>
        <div className="mt-8 flex gap-3 justify-center">
          <Link href="/daftar" className="bg-white text-blue-700 font-semibold px-6 py-3 rounded-lg">Daftar Sekarang</Link>
          <Link href="/admin" className="border border-white px-6 py-3 rounded-lg">Admin</Link>
        </div>
      </section>

      <section className="max-w-5xl mx-auto py-12 px-6">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Jurusan Tersedia</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {jurusan.map((j) => (
            <div key={j.id} className="bg-white rounded-xl shadow p-5">
              <h3 className="font-semibold text-lg text-slate-800">{j.nama}</h3>
              <p className="text-sm text-slate-500 mt-1">Kuota {j.kuota} • Pendaftar {j.pendaftar}</p>
            </div>
          ))}
          {jurusan.length === 0 && (
            <p className="text-slate-500">Belum ada data jurusan. Import database/spmb.sql terlebih dahulu.</p>
          )}
        </div>
      </section>
    </main>
  );
}

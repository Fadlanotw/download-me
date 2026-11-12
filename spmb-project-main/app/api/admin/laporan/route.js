import db from "@/lib/db";

const JURUSAN = {
  PPLG: "PPLG (RPL)",
  MPLB: "MPLB (Layanan Bisnis)",
  PM: "Pemasaran (BDR)",
};

function esc(v) {
  if (v === null || v === undefined) return "";
  return `"${String(v).replace(/"/g, '""')}"`;
}

// supaya Excel tidak menghapus angka 0 di depan (NISN, WhatsApp)
function teks(v) {
  if (!v) return "";
  return `"=""${String(v).replace(/"/g, "")}"""`;
}

export async function GET() {
  try {
    // TODO: tambahkan cek role admin seperti di API admin lainnya

    const [rows] = await db.query(`
      SELECT u.nama, u.email, u.nisn, u.whatsapp, u.jurusan, u.created_at,
             b.tempat_lahir, b.tanggal_lahir, b.jenis_kelamin,
             b.asal_sekolah, b.nama_orang_tua, b.whatsapp_orang_tua,
             (SELECT COUNT(*) FROM berkas_siswa k WHERE k.user_id = u.id) AS jumlah_berkas
      FROM users u
      LEFT JOIN biodata_siswa b ON b.user_id = u.id
      WHERE u.role = 'calon_siswa'
      ORDER BY u.created_at DESC
    `);

    const tgl = (d) => (d ? new Date(d).toLocaleDateString("id-ID") : "");

    const header = [
      "No", "Nama Lengkap", "Email", "NISN", "WhatsApp", "Jurusan",
      "Tanggal Daftar", "Tempat Lahir", "Tanggal Lahir", "Jenis Kelamin",
      "Asal Sekolah", "Nama Orang Tua", "WhatsApp Orang Tua", "Jumlah Berkas",
    ];

    const lines = rows.map((r, i) =>
      [
        esc(i + 1),
        esc(r.nama),
        esc(r.email),
        teks(r.nisn),
        teks(r.whatsapp),
        esc(JURUSAN[r.jurusan] || r.jurusan),
        esc(tgl(r.created_at)),
        esc(r.tempat_lahir),
        esc(tgl(r.tanggal_lahir)),
        esc(r.jenis_kelamin === "L" ? "Laki-laki" : r.jenis_kelamin === "P" ? "Perempuan" : ""),
        esc(r.asal_sekolah),
        esc(r.nama_orang_tua),
        teks(r.whatsapp_orang_tua),
        esc(r.jumlah_berkas),
      ].join(";")
    );

    const csv = "\uFEFF" + [header.map(esc).join(";"), ...lines].join("\r\n");
    const hariIni = new Date().toISOString().slice(0, 10);

    return new Response(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="laporan-spmb-${hariIni}.csv"`,
      },
    });
  } catch (err) {
    console.error("LAPORAN ERROR:", err.message);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
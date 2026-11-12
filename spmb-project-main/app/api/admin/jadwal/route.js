import db from "@/lib/db";

export async function GET() {
  try {
    const [rows] = await db.query(`
      SELECT j.id, j.nama, j.lokasi,
             DATE_FORMAT(j.tanggal, '%Y-%m-%d') AS tanggal,
             TIME_FORMAT(j.jam_mulai, '%H:%i') AS jam_mulai,
             TIME_FORMAT(j.jam_selesai, '%H:%i') AS jam_selesai,
             CASE WHEN j.tanggal < CURDATE() THEN 'Selesai'
                  WHEN j.tanggal = CURDATE() THEN 'Berlangsung'
                  ELSE 'Terjadwal' END AS status,
             (SELECT COUNT(*) FROM peserta_tes p WHERE p.jadwal_id = j.id) AS jumlah_peserta
      FROM jadwal_tes j
      ORDER BY j.tanggal DESC, j.jam_mulai DESC
    `);
    return Response.json(rows);
  } catch (err) {
    console.error("JADWAL GET ERROR:", err.message);
    return Response.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    // TODO: tambahkan cek role admin seperti di API admin lainnya
    const { nama, tanggal, jam_mulai, jam_selesai, lokasi, semua_peserta } =
      await request.json();

    if (!nama || !tanggal || !jam_mulai || !jam_selesai || !lokasi) {
      return Response.json({ error: "Semua field wajib diisi" }, { status: 400 });
    }
    if (jam_selesai <= jam_mulai) {
      return Response.json({ error: "Jam selesai harus setelah jam mulai" }, { status: 400 });
    }

    const [result] = await db.query(
      "INSERT INTO jadwal_tes (nama, tanggal, jam_mulai, jam_selesai, lokasi) VALUES (?, ?, ?, ?, ?)",
      [nama.trim(), tanggal, jam_mulai, jam_selesai, lokasi.trim()]
    );

    if (semua_peserta) {
      await db.query(
        "INSERT IGNORE INTO peserta_tes (jadwal_id, user_id) SELECT ?, id FROM users WHERE role = 'calon_siswa'",
        [result.insertId]
      );
    }

    return Response.json({ ok: true, id: result.insertId }, { status: 201 });
  } catch (err) {
    console.error("JADWAL POST ERROR:", err.message);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
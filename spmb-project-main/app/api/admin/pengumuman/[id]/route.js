import db from "@/lib/db";

export async function GET() {
  try {
    const [rows] = await db.query(`
      SELECT id, judul, isi, status, jumlah_penerima, dibuat_oleh,
             published_at, created_at, updated_at
      FROM pengumuman
      ORDER BY (status = 'published') DESC, COALESCE(published_at, updated_at) DESC
    `);
    return Response.json(rows);
  } catch (err) {
    console.error("PENGUMUMAN GET ERROR:", err.message);
    return Response.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    // TODO: tambahkan cek role admin seperti di API admin lainnya
    const { judul, isi, publish } = await request.json();

    if (!judul?.trim() || !isi?.trim()) {
      return Response.json({ error: "Judul dan isi pengumuman wajib diisi" }, { status: 400 });
    }

    let jumlah = 0;
    if (publish) {
      const [[c]] = await db.query("SELECT COUNT(*) AS n FROM users WHERE role = 'calon_siswa'");
      jumlah = c.n;
    }

    const [result] = await db.query(
      `INSERT INTO pengumuman (judul, isi, status, jumlah_penerima, published_at)
       VALUES (?, ?, ?, ?, ${publish ? "NOW()" : "NULL"})`,
      [judul.trim(), isi.trim(), publish ? "published" : "draft", jumlah]
    );

    return Response.json({ ok: true, id: result.insertId }, { status: 201 });
  } catch (err) {
    console.error("PENGUMUMAN POST ERROR:", err.message);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
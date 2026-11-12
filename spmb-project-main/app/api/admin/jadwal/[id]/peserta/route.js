import db from "@/lib/db";

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const [rows] = await db.query(
      `SELECT u.id, u.nama, u.nisn, u.whatsapp, u.jurusan
       FROM peserta_tes p
       JOIN users u ON u.id = p.user_id
       WHERE p.jadwal_id = ?
       ORDER BY u.nama`,
      [id]
    );
    return Response.json(rows);
  } catch (err) {
    console.error("PESERTA GET ERROR:", err.message);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
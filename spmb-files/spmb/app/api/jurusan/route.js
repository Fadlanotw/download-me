import db from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [rows] = await db.query(
      `SELECT j.id, j.nama, j.kuota,
              (SELECT COUNT(*) FROM calon_siswa c WHERE c.jurusan_id = j.id) AS pendaftar
       FROM jurusan j ORDER BY j.nama`
    );
    return Response.json({ success: true, data: rows });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}

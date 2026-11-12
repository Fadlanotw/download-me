import db from "@/lib/db";

export async function GET(_req, { params }) {
  const { id } = await params;
  const [rows] = await db.query("SELECT * FROM calon_siswa WHERE id = ?", [id]);
  if (rows.length === 0) {
    return Response.json({ success: false, message: "Data tidak ditemukan" }, { status: 404 });
  }
  return Response.json({ success: true, data: rows[0] });
}

// UPDATE: ubah data / status
export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const b = await request.json();
    const [rows] = await db.query("SELECT * FROM calon_siswa WHERE id = ?", [id]);
    if (rows.length === 0) {
      return Response.json({ success: false, message: "Data tidak ditemukan" }, { status: 404 });
    }
    const d = { ...rows[0], ...b };
    await db.query(
      `UPDATE calon_siswa SET nama=?, nisn=?, jenis_kelamin=?, tempat_lahir=?, tanggal_lahir=?,
       alamat=?, asal_sekolah=?, no_hp=?, jurusan_id=?, status=? WHERE id=?`,
      [d.nama, d.nisn, d.jenis_kelamin, d.tempat_lahir, d.tanggal_lahir, d.alamat,
       d.asal_sekolah, d.no_hp, d.jurusan_id, d.status, id]
    );
    return Response.json({ success: true, message: "Data berhasil diubah" });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}

// DELETE
export async function DELETE(_req, { params }) {
  try {
    const { id } = await params;
    await db.query("DELETE FROM calon_siswa WHERE id = ?", [id]);
    return Response.json({ success: true, message: "Data berhasil dihapus" });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}

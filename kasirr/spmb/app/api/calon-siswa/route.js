import db from "@/lib/db";

export const dynamic = "force-dynamic";

// READ: daftar semua calon siswa
export async function GET() {
  try {
    const [rows] = await db.query(
      `SELECT c.*, j.nama AS jurusan
       FROM calon_siswa c JOIN jurusan j ON j.id = c.jurusan_id
       ORDER BY c.id DESC`
    );
    return Response.json({ success: true, data: rows });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}

// CREATE: pendaftaran baru
export async function POST(request) {
  try {
    const b = await request.json();
    if (!b.nama || !b.nisn || !b.jenis_kelamin || !b.jurusan_id) {
      return Response.json(
        { success: false, message: "Nama, NISN, jenis kelamin, dan jurusan wajib diisi" },
        { status: 400 }
      );
    }
    const no = "SPMB-" + new Date().getFullYear() + "-" + Math.floor(10000 + Math.random() * 90000);
    await db.query(
      `INSERT INTO calon_siswa
       (no_pendaftaran, nama, nisn, jenis_kelamin, tempat_lahir, tanggal_lahir, alamat, asal_sekolah, no_hp, jurusan_id)
       VALUES (?,?,?,?,?,?,?,?,?,?)`,
      [no, b.nama, b.nisn, b.jenis_kelamin, b.tempat_lahir || null, b.tanggal_lahir || null,
       b.alamat || null, b.asal_sekolah || null, b.no_hp || null, b.jurusan_id]
    );
    return Response.json({ success: true, message: "Pendaftaran berhasil", no_pendaftaran: no }, { status: 201 });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
